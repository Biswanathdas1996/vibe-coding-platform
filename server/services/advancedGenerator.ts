import { GoogleGenAI } from "@google/genai";
import { fileManager } from "./fileManager";
import path from "path";
import fs from "fs/promises";

export interface EnhancedPrompt {
  originalPrompt: string;
  enhancedDescription: string;
  features: string[];
  functionality: string[];
  technicalRequirements: string[];
  uiComponents: string[];
  userInteractions: string[];
  dataFlow: string[];
}

export interface FileStructure {
  projectName: string;
  files: FileSpec[];
  entryPoint: string;
  dependencies: string[];
}

export interface FileSpec {
  filename: string;
  type: "html" | "css" | "js";
  path: string;
  purpose: string;
  dependencies: string[];
  content?: string;
}

export interface GenerationResponse {
  enhancedPrompt: EnhancedPrompt;
  fileStructure: FileStructure;
  files: Record<string, string>;
  generationSteps: string[];
}

export class AdvancedAppGenerator {
  private genAI: GoogleGenAI;
  private progressCallback?: (step: string, details: string) => void;

  constructor(
    apiKey?: string,
    progressCallback?: (step: string, details: string) => void
  ) {
    const key = apiKey || process.env.GOOGLE_API_KEY;
    if (!key) {
      throw new Error("Google API key is required");
    }
    this.progressCallback = progressCallback;
    
    // Initialize Google Generative AI
    this.genAI = new GoogleGenAI({ apiKey: key });
  }

  private reportProgress(step: string, details: string) {
    console.log(`${step}: ${details}`);
    if (this.progressCallback) {
      this.progressCallback(step, details);
    }
  }

  async generateComplete(prompt: string): Promise<GenerationResponse> {
    try {
      // Step 1: Analyze and enhance the prompt
      this.reportProgress("🔍 Step 1/5", "Analyzing and enhancing prompt with AI");
      const enhancedPrompt = await this.analyzeAndEnhancePrompt(prompt);
      this.reportProgress(
        "✅ Step 1 Complete",
        `Enhanced prompt with ${enhancedPrompt.features.length} features and ${enhancedPrompt.functionality.length} functionalities`
      );

      // Step 2: Generate file structure in JSON format
      this.reportProgress("📁 Step 2/5", "Generating file structure");
      const fileStructure = await this.generateFileStructure(enhancedPrompt);
      this.reportProgress(
        "✅ Step 2 Complete",
        `Generated structure with ${fileStructure.files.length} files`
      );

      // Step 3: Create empty files in public folder
      this.reportProgress("🗂️ Step 3/5", "Creating file structure in public folder");
      await this.createFileStructureInPublic(fileStructure);
      this.reportProgress("✅ Step 3 Complete", "File structure created");

      // Step 4: Generate content for each file asynchronously
      this.reportProgress("⚡ Step 4/5", "Generating file contents with AI");
      const files = await this.generateAllFileContents(fileStructure, enhancedPrompt);
      this.reportProgress(
        "✅ Step 4 Complete",
        `Generated content for ${Object.keys(files).length} files`
      );

      // Step 5: Write files to public folder
      this.reportProgress("💾 Step 5/5", "Saving files to public folder");
      await fileManager.writeFiles(files);
      this.reportProgress("✅ Generation Complete", "All files saved successfully");

      return {
        enhancedPrompt,
        fileStructure,
        files,
        generationSteps: [
          "Analyzed and enhanced the prompt",
          "Generated optimal file structure",
          "Created file structure in public folder",
          "Generated content for each file asynchronously",
          "Saved all files to public folder"
        ]
      };
    } catch (error) {
      console.error("Generation failed:", error);
      throw error;
    }
  }

  private async analyzeAndEnhancePrompt(prompt: string): Promise<EnhancedPrompt> {
    const systemPrompt = `You are an expert application architect. Analyze the user's prompt and enhance it with detailed features and functionality.

USER PROMPT: "${prompt}"

Your task is to:
1. Understand the core application concept
2. Identify explicit and implicit features
3. Define technical requirements
4. List UI components needed
5. Map user interactions
6. Design data flow

Return a JSON object with this exact structure:
{
  "originalPrompt": "The original user prompt",
  "enhancedDescription": "A comprehensive description of what the application should do",
  "features": [
    "List of specific features the app should have",
    "Include both explicitly requested and implied features",
    "Be comprehensive and detailed"
  ],
  "functionality": [
    "Core functions the app must perform",
    "User actions and system responses",
    "Business logic and rules"
  ],
  "technicalRequirements": [
    "Browser compatibility requirements",
    "Performance considerations",
    "Security requirements",
    "Data persistence needs"
  ],
  "uiComponents": [
    "Specific UI elements needed",
    "Forms, buttons, modals, etc.",
    "Navigation components",
    "Display components"
  ],
  "userInteractions": [
    "How users will interact with the app",
    "Click events, form submissions",
    "Drag and drop, gestures",
    "Keyboard shortcuts"
  ],
  "dataFlow": [
    "How data moves through the app",
    "User input processing",
    "State management",
    "Data validation and transformation"
  ]
}

Be thorough and think like a product manager and developer combined.`;

    try {
      const result = await this.genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: systemPrompt }], role: "user" }]
      });
      
      if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("No response text received from AI");
      }
      
      const response = result.candidates[0].content.parts[0].text;
      return this.parseJSON(response);
    } catch (error) {
      console.error("Failed to analyze prompt:", error);
      throw new Error("Could not analyze and enhance the prompt");
    }
  }

  private async generateFileStructure(enhancedPrompt: EnhancedPrompt): Promise<FileStructure> {
    const systemPrompt = `You are an expert web developer. Based on the enhanced prompt, generate an optimal file structure for a browser-executable web application.

ENHANCED PROMPT DATA:
${JSON.stringify(enhancedPrompt, null, 2)}

Requirements:
1. Create ONLY HTML, CSS, and JavaScript files
2. The application must be fully browser-executable (no server-side code)
3. Use modern web standards and best practices
4. Keep the structure simple but scalable
5. Include all necessary files for a complete application

Return a JSON object with this exact structure:
{
  "projectName": "A short, descriptive name for the project",
  "files": [
    {
      "filename": "index.html",
      "type": "html",
      "path": "/",
      "purpose": "Main entry point of the application",
      "dependencies": ["styles.css", "app.js"]
    },
    {
      "filename": "styles.css",
      "type": "css",
      "path": "/",
      "purpose": "Main stylesheet for the application",
      "dependencies": []
    },
    {
      "filename": "app.js",
      "type": "js",
      "path": "/",
      "purpose": "Main JavaScript file with application logic",
      "dependencies": []
    }
  ],
  "entryPoint": "index.html",
  "dependencies": []
}

Generate a complete file structure that implements all the features and functionality described.`;

    try {
      const result = await this.genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: systemPrompt }], role: "user" }]
      });
      
      if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("No response text received from AI");
      }
      
      const response = result.candidates[0].content.parts[0].text;
      return this.parseJSON(response);
    } catch (error) {
      console.error("Failed to generate file structure:", error);
      throw new Error("Could not generate file structure");
    }
  }

  private async createFileStructureInPublic(fileStructure: FileStructure): Promise<void> {
    const publicDir = fileManager.getPublicDir();
    
    // Create directories if needed
    const directories = new Set<string>();
    for (const file of fileStructure.files) {
      if (file.path && file.path !== "/") {
        directories.add(path.join(publicDir, file.path));
      }
    }

    for (const dir of Array.from(directories)) {
      await fs.mkdir(dir, { recursive: true });
    }

    // Create empty files
    for (const file of fileStructure.files) {
      // Normalize the file path to avoid duplicates
      let filePath: string;
      if (file.path && file.path !== "/") {
        // Remove leading slash if present
        const cleanPath = file.path.startsWith("/") ? file.path.slice(1) : file.path;
        filePath = path.join(publicDir, cleanPath, file.filename);
      } else {
        filePath = path.join(publicDir, file.filename);
      }
      
      // Ensure the directory exists for the file
      const fileDir = path.dirname(filePath);
      await fs.mkdir(fileDir, { recursive: true });
      
      await fs.writeFile(filePath, "", "utf-8");
    }
  }

  private async generateAllFileContents(
    fileStructure: FileStructure,
    enhancedPrompt: EnhancedPrompt
  ): Promise<Record<string, string>> {
    const files: Record<string, string> = {};

    // Sort files by dependencies to ensure proper generation order
    const sortedFiles = this.sortFilesByDependencies(fileStructure.files);

    // Generate files in parallel groups based on dependencies
    const fileGroups = this.groupFilesByDependencyLevel(sortedFiles);

    for (const group of fileGroups) {
      // Generate all files in the same dependency level in parallel
      const generatePromises = group.map(async (fileSpec) => {
        this.reportProgress(
          `🔧 Generating`,
          `Creating ${fileSpec.filename} (${fileSpec.purpose})`
        );

        try {
          const content = await this.generateFileContent(
            fileSpec,
            fileStructure,
            enhancedPrompt,
            files
          );

          files[fileSpec.filename] = content;
          
          this.reportProgress(
            `✅ Generated`,
            `${fileSpec.filename} completed`
          );
        } catch (error) {
          console.error(`Failed to generate ${fileSpec.filename}:`, error);
          files[fileSpec.filename] = this.generateFallbackContent(
            fileSpec.type,
            fileSpec.filename
          );
        }
      });

      // Wait for all files in this group to complete
      await Promise.all(generatePromises);
    }

    return files;
  }

  private async generateFileContent(
    fileSpec: FileSpec,
    fileStructure: FileStructure,
    enhancedPrompt: EnhancedPrompt,
    existingFiles: Record<string, string>
  ): Promise<string> {
    let systemPrompt = "";
    
    switch (fileSpec.type) {
      case "html":
        systemPrompt = this.createHTMLGenerationPrompt(fileSpec, fileStructure, enhancedPrompt, existingFiles);
        break;
      case "css":
        systemPrompt = this.createCSSGenerationPrompt(fileSpec, fileStructure, enhancedPrompt, existingFiles);
        break;
      case "js":
        systemPrompt = this.createJSGenerationPrompt(fileSpec, fileStructure, enhancedPrompt, existingFiles);
        break;
    }

    try {
      const result = await this.genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: systemPrompt }], role: "user" }]
      });
      
      if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("No response text received from AI");
      }
      
      let content = result.candidates[0].content.parts[0].text;
      
      // Clean up the content
      content = this.cleanGeneratedCode(content, fileSpec.type);
      
      // Validate the content
      if (!this.validateGeneratedContent(content, fileSpec)) {
        throw new Error(`Invalid ${fileSpec.type} content generated`);
      }
      
      return content;
    } catch (error) {
      console.error(`Failed to generate ${fileSpec.type} file:`, error);
      throw error;
    }
  }

  private createHTMLGenerationPrompt(
    fileSpec: FileSpec,
    fileStructure: FileStructure,
    enhancedPrompt: EnhancedPrompt,
    existingFiles: Record<string, string>
  ): string {
    return `You are an expert HTML developer. Generate a complete, production-ready HTML file.

FILE DETAILS:
- Filename: ${fileSpec.filename}
- Purpose: ${fileSpec.purpose}
- Dependencies: ${JSON.stringify(fileSpec.dependencies)}

PROJECT CONTEXT:
${JSON.stringify(enhancedPrompt, null, 2)}

FILE STRUCTURE:
${JSON.stringify(fileStructure, null, 2)}

${this.getDependencyContext(fileSpec, existingFiles)}

REQUIREMENTS:
1. Use semantic HTML5 elements
2. Include proper meta tags for SEO and responsiveness
3. Link all CSS and JavaScript dependencies correctly
4. Implement all UI components from the enhanced prompt
5. Add proper accessibility attributes (ARIA labels, roles)
6. Include loading states and error handling
7. Make it fully responsive with viewport meta tag
8. Add meaningful comments for complex sections
9. CRITICAL: Implement FUNCTIONAL navigation that works properly:
   - Create navigation links with proper href attributes
   - Use data-nav attributes or IDs to link to different sections/views
   - Ensure clicking nav items actually shows/hides content sections
   - Add active states for current navigation items
   - Include proper navigation structure (nav element with meaningful links)

Return ONLY the complete HTML code. Do not include any explanations or markdown formatting.`;
  }

  private createCSSGenerationPrompt(
    fileSpec: FileSpec,
    fileStructure: FileStructure,
    enhancedPrompt: EnhancedPrompt,
    existingFiles: Record<string, string>
  ): string {
    return `You are an expert CSS developer. Generate a complete, modern stylesheet.

FILE DETAILS:
- Filename: ${fileSpec.filename}
- Purpose: ${fileSpec.purpose}

PROJECT CONTEXT:
${JSON.stringify(enhancedPrompt, null, 2)}

${this.getDependencyContext(fileSpec, existingFiles)}

REQUIREMENTS:
1. Use modern CSS features (Grid, Flexbox, Custom Properties)
2. Implement a cohesive design system with:
   - Consistent color palette
   - Typography scale
   - Spacing system
   - Component styles
3. Make it fully responsive (mobile-first approach)
4. Include interactive states (hover, focus, active)
5. Add smooth transitions and animations
6. Implement loading and error states
7. Ensure cross-browser compatibility
8. Use CSS variables for theming
9. Add comments for major sections

Return ONLY the complete CSS code. Do not include any explanations or markdown formatting.`;
  }

  private createJSGenerationPrompt(
    fileSpec: FileSpec,
    fileStructure: FileStructure,
    enhancedPrompt: EnhancedPrompt,
    existingFiles: Record<string, string>
  ): string {
    return `You are an expert JavaScript developer. Generate modern, production-ready JavaScript code.

FILE DETAILS:
- Filename: ${fileSpec.filename}
- Purpose: ${fileSpec.purpose}

PROJECT CONTEXT:
${JSON.stringify(enhancedPrompt, null, 2)}

${this.getDependencyContext(fileSpec, existingFiles)}

REQUIREMENTS:
1. Use modern ES6+ JavaScript features
2. Implement all functionality from the enhanced prompt:
   - ${enhancedPrompt.functionality.join("\n   - ")}
3. Handle all user interactions:
   - ${enhancedPrompt.userInteractions.join("\n   - ")}
4. Implement proper data flow:
   - ${enhancedPrompt.dataFlow.join("\n   - ")}
5. Add comprehensive error handling
6. Include input validation
7. Implement state management if needed
8. Add event listeners with proper cleanup
9. Use async/await for asynchronous operations
10. Add helpful comments and JSDoc documentation
11. CRITICAL: Implement FUNCTIONAL navigation system:
    - Add event listeners for navigation links/buttons
    - Create functions to show/hide different sections or views
    - Implement active state management for navigation items
    - Handle route changes or view switching logic
    - Ensure smooth transitions between different app sections
    - Include navigation history management if applicable

Return ONLY the complete JavaScript code. Do not include any explanations or markdown formatting.`;
  }

  private getDependencyContext(fileSpec: FileSpec, existingFiles: Record<string, string>): string {
    if (!fileSpec.dependencies || fileSpec.dependencies.length === 0) {
      return "";
    }

    let context = "DEPENDENCY FILES:\n";
    for (const dep of fileSpec.dependencies) {
      if (existingFiles[dep]) {
        context += `\n=== ${dep} ===\n${existingFiles[dep]}\n`;
      }
    }
    return context;
  }

  private sortFilesByDependencies(files: FileSpec[]): FileSpec[] {
    const visited = new Set<string>();
    const result: FileSpec[] = [];

    const visit = (file: FileSpec) => {
      if (visited.has(file.filename)) return;

      // Process dependencies first
      if (file.dependencies) {
        for (const dep of file.dependencies) {
          const depFile = files.find((f) => f.filename === dep);
          if (depFile) visit(depFile);
        }
      }

      visited.add(file.filename);
      result.push(file);
    };

    // Process all files
    for (const file of files) {
      visit(file);
    }

    return result;
  }

  private groupFilesByDependencyLevel(files: FileSpec[]): FileSpec[][] {
    const levels: FileSpec[][] = [];
    const processed = new Set<string>();

    while (processed.size < files.length) {
      const currentLevel: FileSpec[] = [];

      for (const file of files) {
        if (processed.has(file.filename)) continue;

        // Check if all dependencies are processed
        const canProcess = !file.dependencies || 
          file.dependencies.every(dep => processed.has(dep));

        if (canProcess) {
          currentLevel.push(file);
        }
      }

      // Add current level files to processed
      for (const file of currentLevel) {
        processed.add(file.filename);
      }

      if (currentLevel.length > 0) {
        levels.push(currentLevel);
      } else {
        // Prevent infinite loop - add remaining files
        const remaining = files.filter(f => !processed.has(f.filename));
        if (remaining.length > 0) {
          levels.push(remaining);
          break;
        }
      }
    }

    return levels;
  }

  private cleanGeneratedCode(content: string, type: "html" | "css" | "js"): string {
    // Remove markdown code block markers
    content = content.replace(/```[a-z]*\n?/gi, "");
    content = content.replace(/\n?```/g, "");

    // Remove any text before the actual code
    switch (type) {
      case "html":
        const htmlStart = content.indexOf("<!DOCTYPE") >= 0 
          ? content.indexOf("<!DOCTYPE") 
          : content.indexOf("<html");
        if (htmlStart > 0) {
          content = content.slice(htmlStart);
        }
        break;

      case "css":
        // Find the first CSS rule or comment
        const cssMatch = content.match(/(\*|\/\*|:root|@|[a-zA-Z.#\[:])/);
        if (cssMatch && cssMatch.index && cssMatch.index > 0) {
          content = content.slice(cssMatch.index);
        }
        break;

      case "js":
        // Find the first JS code
        const jsMatch = content.match(/(\/\/|\/\*|const|let|var|function|class|import|export|\()/);
        if (jsMatch && jsMatch.index && jsMatch.index > 0) {
          content = content.slice(jsMatch.index);
        }
        break;
    }

    return content.trim();
  }

  private validateGeneratedContent(content: string, fileSpec: FileSpec): boolean {
    if (!content || content.trim().length === 0) {
      return false;
    }

    switch (fileSpec.type) {
      case "html":
        return content.includes("<!DOCTYPE") || content.includes("<html");
      case "css":
        return content.includes("{") && content.includes("}");
      case "js":
        // Basic syntax check
        try {
          // Check if it's valid JavaScript syntax
          new Function(content);
          return true;
        } catch {
          // Even if syntax check fails, accept if it looks like JS
          return /(?:const|let|var|function|class|\()/.test(content);
        }
      default:
        return true;
    }
  }

  private generateFallbackContent(type: string, filename: string): string {
    switch (type) {
      case "html":
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>App Generation Failed</h1>
    <p>Failed to generate content for ${filename}. Please try again.</p>
    <script src="app.js"></script>
</body>
</html>`;

      case "css":
        return `/* Fallback CSS */
body {
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
}

h1 {
  color: #333;
}`;

      case "js":
        return `// Fallback JavaScript
console.log('App loaded - ${filename}');
console.error('Content generation failed for this file');`;

      default:
        return `// Fallback content for ${filename}`;
    }
  }

  private parseJSON(content: string): any {
    try {
      // Clean up the content
      let cleanContent = content
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();

      // Find JSON boundaries
      const jsonStart = cleanContent.indexOf("{");
      const jsonEnd = cleanContent.lastIndexOf("}");

      if (jsonStart >= 0 && jsonEnd >= 0) {
        cleanContent = cleanContent.slice(jsonStart, jsonEnd + 1);
      }

      return JSON.parse(cleanContent);
    } catch (error) {
      console.error("JSON parsing failed:", error);
      console.error("Content:", content);
      throw new Error("Failed to parse AI response as JSON");
    }
  }
}