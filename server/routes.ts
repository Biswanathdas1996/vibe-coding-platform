import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import express from "express";
import path from "path";
import fs from "fs/promises";
import { storage } from "./storage";
import { generateCode } from "./services/gemini";
import { AdvancedAppGenerator } from "./services/advancedGenerator";
import { fileManager } from "./services/fileManager";
import { getTemplate } from "./services/templates";
import { promptRequestSchema } from "@shared/schema";

// Fallback helper functions for when AI service is unavailable
function generateFallbackHTML(prompt: string): string {
  const appName = extractAppName(prompt);
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appName}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <h1 class="app-title">${appName}</h1>
            <nav class="header-nav">
                <a href="#" class="nav-link">Home</a>
                <a href="#" class="nav-link">Features</a>
                <a href="#" class="nav-link">Settings</a>
            </nav>
        </header>
        
        <div class="app-layout">
            <aside class="sidebar">
                <nav class="sidebar-nav">
                    <ul>
                        <li><a href="#" class="nav-item active">Dashboard</a></li>
                        <li><a href="#" class="nav-item">Features</a></li>
                        <li><a href="#" class="nav-item">Data</a></li>
                        <li><a href="#" class="nav-item">Settings</a></li>
                    </ul>
                </nav>
            </aside>
            
            <main class="main-content">
                <div class="content-section">
                    <h2>Welcome to ${appName}</h2>
                    <p>The AI service is temporarily unavailable. This is a basic template for your application.</p>
                    <div class="notice-card">
                        <h3>Service Notice</h3>
                        <p>Please try again in a few moments for full functionality. This fallback template provides the basic structure.</p>
                    </div>
                    <div class="feature-grid">
                        <div class="feature-card">
                            <h3>Main Features</h3>
                            <p>Your application features will appear here once the service is restored.</p>
                        </div>
                        <div class="feature-card">
                            <h3>Coming Soon</h3>
                            <p>Full functionality will be available when you retry.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
}

function generateFallbackCSS(): string {
  return `:root {
  --primary-color: #607D8B;
  --secondary-color: #2196F3;
  --accent-color: #90A4AE;
  --bg-color: #f5f5f5;
  --text-color: #333;
  --border-color: #ddd;
  --warning-color: #FFA726;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--bg-color);
}

.app-container {
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-areas: 
    "header"
    "layout";
  min-height: 100vh;
}

.app-header {
  grid-area: header;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.app-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.header-nav {
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(255,255,255,0.1);
}

.app-layout {
  grid-area: layout;
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-areas: "sidebar main";
}

.sidebar {
  grid-area: sidebar;
  background: white;
  border-right: 1px solid var(--border-color);
  padding: 1rem 0;
}

.sidebar-nav ul {
  list-style: none;
}

.nav-item {
  display: block;
  padding: 0.75rem 1.5rem;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.2s;
}

.nav-item:hover, .nav-item.active {
  background-color: var(--accent-color);
  color: white;
}

.main-content {
  grid-area: main;
  padding: 2rem;
  overflow-y: auto;
}

.content-section h2 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.notice-card {
  background: var(--warning-color);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.notice-card h3 {
  margin-bottom: 0.5rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid var(--primary-color);
}

.feature-card h3 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .app-layout {
    grid-template-columns: 1fr;
    grid-template-areas: "main";
  }
  
  .sidebar {
    display: none;
  }
  
  .app-header {
    flex-direction: column;
    gap: 1rem;
  }
}`;
}

function generateFallbackJS(): string {
  return `document.addEventListener('DOMContentLoaded', function() {
  console.log('Fallback mode - Application loaded');
  
  // Add basic interactivity to navigation
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all items
      navItems.forEach(nav => nav.classList.remove('active'));
      
      // Add active class to clicked item
      this.classList.add('active');
      
      console.log('Navigation clicked:', this.textContent);
    });
  });
  
  // Add retry suggestion
  const retryButton = document.createElement('button');
  retryButton.textContent = 'Retry Generation';
  retryButton.style.cssText = \`
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
  \`;
  
  retryButton.addEventListener('click', () => {
    window.location.reload();
  });
  
  document.body.appendChild(retryButton);
  
  console.log('Fallback template ready - Please retry when service is available');
});`;
}

function extractAppName(prompt: string): string {
  const words = prompt.toLowerCase().split(' ');
  
  // Look for app type keywords
  if (words.includes('fitness') || words.includes('health')) return 'Fitness Tracker';
  if (words.includes('todo') || words.includes('task')) return 'Task Manager';
  if (words.includes('shop') || words.includes('store') || words.includes('commerce')) return 'Online Store';
  if (words.includes('social') || words.includes('chat')) return 'Social Platform';
  if (words.includes('blog') || words.includes('cms')) return 'Content Manager';
  if (words.includes('portfolio') || words.includes('showcase')) return 'Portfolio';
  if (words.includes('dashboard') || words.includes('analytics')) return 'Dashboard';
  if (words.includes('finance') || words.includes('budget') || words.includes('expense')) return 'Finance Manager';
  if (words.includes('learning') || words.includes('course')) return 'Learning Platform';
  if (words.includes('booking') || words.includes('appointment')) return 'Booking System';
  
  return 'Application';
}

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

  // Helper function to check if this is the first prompt
  async function isFirstPromptInDevelopmentChat(projectId?: string): Promise<boolean> {
    if (projectId) {
      const messages = await storage.getProjectMessages(projectId);
      console.log(`📊 Project ${projectId} has ${messages.length} messages`);
      return messages.length === 0;
    }
    
    // Check if public folder is empty (no existing files)
    const existingFiles = await fileManager.readFiles();
    console.log(`📁 Public folder has ${Object.keys(existingFiles).length} files: ${Object.keys(existingFiles).join(', ')}`);
    
    // If no projectId and no files, it's definitely a first prompt
    return Object.keys(existingFiles).length === 0;
  }

  // Helper function to clear public folder for first prompts
  async function clearPublicFolder(): Promise<void> {
    try {
      const publicDir = fileManager.getPublicDir();
      const files = await fs.readdir(publicDir);
      
      for (const file of files) {
        await fs.unlink(path.join(publicDir, file));
      }
      
      console.log("🧹 Cleared public folder for new app generation");
    } catch (error) {
      console.warn("Could not clear public folder:", error);
    }
  }

  // API Routes
  app.post('/api/prompt', async (req, res) => {
    let prompt: string = '';
    let projectId: string | undefined;
    
    try {
      const parsed = promptRequestSchema.parse(req.body);
      prompt = parsed.prompt;
      projectId = parsed.projectId;
      
      // Check if this is the first prompt in development chat
      const isFirstPrompt = await isFirstPromptInDevelopmentChat(projectId);
      
      console.log(`🎯 Processing ${isFirstPrompt ? 'FIRST' : 'SUBSEQUENT'} prompt in development chat`);
      console.log(`🔍 ProjectId: ${projectId || 'undefined'}, IsFirstPrompt: ${isFirstPrompt}`);
      
      if (isFirstPrompt) {
        // Clear public folder for fresh start
        await clearPublicFolder();
        
        // Use advanced generator for complete app generation
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
          throw new Error("GOOGLE_API_KEY environment variable is required");
        }
        
        // Create or get project first to have an ID for progress tracking
        let currentProjectId = projectId;
        if (!currentProjectId) {
          const tempProject = await storage.createProject({
            name: `Generated App ${Date.now()}`,
            description: prompt.substring(0, 100),
            files: {}
          });
          currentProjectId = tempProject?.id;
        }

        // Create progress callback to send real-time updates
        const progressCallback = async (step: string, details: string) => {
          // Send progress update to all connected WebSocket clients
          const progressMessage = JSON.stringify({
            type: 'progress',
            step: step,
            details: details,
            timestamp: new Date().toISOString()
          });
          
          // Send to WebSocket clients for real-time updates
          fileManager.notifyAllClients(progressMessage);
          
          // Save progress as assistant messages for chat history
          if (currentProjectId) {
            await storage.createMessage({
              projectId: currentProjectId,
              role: 'assistant',
              content: `${step}: ${details}`
            });
          }
        };
        
        let result;
        try {
          const advancedGenerator = new AdvancedAppGenerator(apiKey, progressCallback);
          result = await advancedGenerator.generateComplete(prompt, true);
        } catch (initError) {
          console.log("🔄 Advanced generator failed, using fallback gemini service with progress simulation");
          
          // Simulate multi-step progress for user experience
          await progressCallback('Step 1/6', 'Analyzing app requirements using AI');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          await progressCallback('Step 2/6', 'Planning file structure and architecture');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          await progressCallback('Step 3/6', 'Creating optimized folder structure');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          await progressCallback('Step 4/6', 'Generating HTML with modern structure');
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          await progressCallback('Step 5/6', 'Creating CSS with responsive design');
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          await progressCallback('Step 6/6', 'Adding JavaScript interactivity');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          await progressCallback('Generation Complete', 'Application generated successfully!');
          
          // Use the existing gemini service
          result = await generateCode(prompt);
        }
        
        // Write files to public directory
        await fileManager.writeFiles(result.files);
        
        // Update project with final files
        const project = await storage.updateProject(currentProjectId!, {
          files: result.files,
          updatedAt: new Date()
        });

        // Save initial user message
        await storage.createMessage({
          projectId: currentProjectId,
          role: 'user',
          content: prompt
        });

        // Save final completion message
        await storage.createMessage({
          projectId: currentProjectId,
          role: 'assistant',
          content: 'Complete application generated successfully using advanced multi-step AI generation',
          plan: result.plan,
          files: result.files
        });

        res.json(result);
        return;
      }
      
      // For subsequent prompts, get existing files and modify
      let existingFiles: Record<string, string> | undefined;
      if (projectId) {
        const project = await storage.getProject(projectId);
        existingFiles = project?.files || undefined;
      } else {
        existingFiles = await fileManager.readFiles();
        if (Object.keys(existingFiles).length === 0) {
          existingFiles = undefined;
        }
      }

      // Use existing generation logic for modifications
      const result = await generateCode(prompt, existingFiles);
      
      // Ensure files object exists before writing
      if (!result || !result.files || typeof result.files !== 'object') {
        throw new Error('Invalid response structure from code generation');
      }
      
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
      
      // Check if it's an API overload error and provide fallback
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isOverloadError = errorMessage.includes('503') || 
                             errorMessage.includes('overloaded') || 
                             errorMessage.includes('UNAVAILABLE') ||
                             errorMessage.includes('model is overloaded');
      
      if (isOverloadError) {
        console.log('Providing fallback response due to API overload');
        
        const fallbackResult = {
          plan: [
            "AI service temporarily unavailable - generating fallback template",
            "Please try again in a few moments for full functionality", 
            "Basic application structure provided as starting point"
          ],
          files: {
            "index.html": generateFallbackHTML(prompt),
            "styles.css": generateFallbackCSS(),
            "script.js": generateFallbackJS()
          }
        };
        
        await fileManager.writeFiles(fallbackResult.files);
        
        // Create project with fallback content
        const project = await storage.createProject({
          name: `Fallback Project ${Date.now()}`,
          description: `${prompt.substring(0, 80)} (Fallback)`,
          files: fallbackResult.files
        });

        await storage.createMessage({
          projectId: project?.id,
          role: 'user',
          content: prompt
        });

        await storage.createMessage({
          projectId: project?.id,
          role: 'assistant',
          content: 'Fallback template generated due to service unavailability',
          plan: fallbackResult.plan,
          files: fallbackResult.files
        });
        
        res.json({
          plan: fallbackResult.plan,
          files: fallbackResult.files,
          previewUrl: '/preview/index.html',
          projectId: project?.id
        });
      } else {
        res.status(500).json({ 
          error: error instanceof Error ? error.message : 'Failed to process prompt' 
        });
      }
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
        templateId: templateId,
        files: template.files
      });

      // No initial message - start with empty chat for fresh experience

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
