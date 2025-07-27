import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import express from "express";
import path from "path";
import { storage } from "./storage";
import { generateCode } from "./services/gemini";
import { fileManager } from "./services/fileManager";
import { getTemplate } from "./services/templates";
import { promptRequestSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Serve static files from public directory
  app.use('/preview', express.static(fileManager.getPublicDir()));

  // WebSocket server for live reload
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    fileManager.addClient(ws);
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // Start file watching
  fileManager.startWatching();

  // API Routes
  app.post('/api/prompt', async (req, res) => {
    try {
      const { prompt, projectId } = promptRequestSchema.parse(req.body);
      
      // Get existing files if this is an update to existing project
      let existingFiles: Record<string, string> | undefined;
      if (projectId) {
        const project = await storage.getProject(projectId);
        existingFiles = project?.files || undefined;
      } else {
        // Try to read existing files from public directory
        existingFiles = await fileManager.readFiles();
        if (Object.keys(existingFiles).length === 0) {
          existingFiles = undefined;
        }
      }

      // Generate code using OpenAI
      const result = await generateCode(prompt, existingFiles);
      
      // Write files to public directory
      await fileManager.writeFiles(result.files);
      
      // Create or update project
      let project;
      if (projectId) {
        project = await storage.updateProject(projectId, { 
          files: result.files,
          updatedAt: new Date()
        });
      } else {
        project = await storage.createProject({
          name: `Generated Project ${Date.now()}`,
          description: prompt.substring(0, 100),
          files: result.files
        });
      }

      // Save message
      await storage.createMessage({
        projectId: project?.id,
        role: 'user',
        content: prompt
      });

      await storage.createMessage({
        projectId: project?.id,
        role: 'assistant',
        content: 'Code generated successfully',
        plan: result.plan,
        files: result.files
      });

      const previewUrl = '/preview/index.html';
      
      res.json({
        plan: result.plan,
        files: result.files,
        previewUrl,
        projectId: project?.id
      });

    } catch (error) {
      console.error('Prompt processing error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to process prompt' 
      });
    }
  });

  app.get('/api/projects/:id/messages', async (req, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getProjectMessages(id);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });

  // Initialize project with template
  app.post('/api/projects/init-template', async (req, res) => {
    try {
      const { templateId } = req.body;
      
      if (!templateId) {
        return res.status(400).json({ error: 'Template ID is required' });
      }

      const template = getTemplate(templateId);
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }

      // Write template files to public directory
      await fileManager.writeFiles(template.files);
      
      // Create project
      const project = await storage.createProject({
        name: template.name,
        description: template.description,
        files: template.files
      });

      // Create initial message
      await storage.createMessage({
        projectId: project.id,
        role: 'assistant',
        content: `Project initialized with ${template.name} template`,
        plan: [`Initialized ${template.name} template`, 'Files created and ready for customization'],
        files: template.files
      });

      const previewUrl = '/preview/index.html';
      
      res.json({
        project,
        plan: [`Initialized ${template.name} template`, 'Files created and ready for customization'],
        files: template.files,
        previewUrl,
        projectId: project.id
      });

    } catch (error) {
      console.error('Template initialization error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to initialize template' 
      });
    }
  });

  return httpServer;
}
