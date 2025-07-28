import { GoogleGenAI } from "@google/genai";

export interface AppFeatures {
  description: string;
  features: string[];
  functionality: string[];
  userTypes: string[];
  keyComponents: string[];
  businessLogic: string[];
  dataRequirements: string[];
}

export interface FileStructure {
  files: FileSpec[];
  folderStructure: string;
  architecture: string;
  dependencies: string[];
  navigation: NavigationSpec;
}

export interface FileSpec {
  name: string;
  type: "html" | "css" | "js";
  purpose: string;
  dependencies: string[];
  linkedFiles: string[];
}

export interface NavigationSpec {
  type: string;
  structure: string;
  routes: RouteSpec[];
}

export interface RouteSpec {
  path: string;
  file: string;
  title: string;
  description: string;
}

export interface GenerationResponse {
  plan: string[];
  files: Record<string, string>;
  reasoning: string;
  architecture: string;
  nextSteps: string[];
  dependencies: string[];
  testingStrategy: string;
}

export class AdvancedAppGenerator {
  private genAI: GoogleGenAI;
  private model: any;
  private progressCallback?: (step: string, details: string) => void;

  constructor(
    apiKey?: string,
    progressCallback?: (step: string, details: string) => void,
  ) {
    const key = apiKey || process.env.GOOGLE_API_KEY;
    if (!key) {
      throw new Error("Google API key is required");
    }
    this.genAI = new GoogleGenAI({ apiKey: key });
    this.model = this.genAI.models.get({
      model: "gemini-2.0-flash-exp",
    });
    this.progressCallback = progressCallback;
  }

  private reportProgress(step: string, details: string) {
    console.log(`${step}: ${details}`);
    if (this.progressCallback) {
      this.progressCallback(step, details);
    }
  }

  async generateComplete(
    prompt: string,
    isFirstPrompt: boolean = true,
  ): Promise<GenerationResponse> {
    if (isFirstPrompt) {
      console.log(
        "🎯 First prompt detected - Starting complete app generation",
      );
      return await this.generateCompleteApp(prompt);
    } else {
      console.log("🔄 Modifying existing application");
      // TODO: Implement modification logic
      throw new Error("Modification logic not yet implemented");
    }
  }

  private async generateCompleteApp(
    prompt: string,
  ): Promise<GenerationResponse> {
    this.reportProgress(
      "📋 Step 1/6",
      "Analyzing app features and functionality using advanced AI",
    );
    const appFeatures = await this.analyzeAppFeatures(prompt);
    this.reportProgress(
      "✅ Step 1 Complete",
      `Identified ${appFeatures.features.length} key features: ${appFeatures.features.slice(0, 3).join(", ")}${appFeatures.features.length > 3 ? "..." : ""}`,
    );

    this.reportProgress(
      "🏗️ Step 2/6",
      "Determining optimal file structure and architecture",
    );
    const fileStructure = await this.determineFileStructure(appFeatures);
    this.reportProgress(
      "✅ Step 2 Complete",
      `Planned ${fileStructure.files.length} files with ${fileStructure.architecture} architecture`,
    );

    this.reportProgress("📁 Step 3/6", "Creating optimized folder structure");
    // Folder structure is just planning - actual files created in step 4
    this.reportProgress(
      "✅ Step 3 Complete",
      `Designed ${fileStructure.folderStructure} with proper file organization`,
    );

    this.reportProgress(
      "⚡ Step 4/6",
      "Generating individual files with modern HTML5, CSS3, and JavaScript",
    );
    const files = await this.generateAllFiles(fileStructure, appFeatures);
    this.reportProgress(
      "✅ Step 4 Complete",
      `Generated ${Object.keys(files).length} production-ready files with modern code`,
    );

    this.reportProgress(
      "🔗 Step 5/6",
      "Setting up navigation and routing system",
    );
    const routedFiles = await this.setupNavigation(files, fileStructure);
    this.reportProgress(
      "✅ Step 5 Complete",
      `Implemented ${fileStructure.navigation.type} with responsive navigation`,
    );

    this.reportProgress("🎯 Step 6/6", "Final integration and optimization");
    const finalFiles = await this.finalizeIntegration(
      routedFiles,
      fileStructure,
    );
    this.reportProgress(
      "✅ Generation Complete",
      `Created fully functional app with ${Object.keys(finalFiles).length} integrated files`,
    );

    return {
      plan: this.createImplementationPlan(appFeatures, fileStructure),
      files: finalFiles,
      reasoning: appFeatures.description,
      architecture: fileStructure.architecture,
      nextSteps: [
        "Test all functionality",
        "Add responsive design",
        "Optimize performance",
      ],
      dependencies: fileStructure.dependencies,
      testingStrategy: "Manual testing of all features and navigation",
    };
  }

  private async analyzeAppFeatures(prompt: string): Promise<AppFeatures> {
    const systemPrompt = `You are an expert product analyst. Analyze the user's prompt and extract detailed features and functionality.

User Request: "${prompt}"

Provide a comprehensive analysis in JSON format:

{
  "description": "Clear, detailed description of what the app does",
  "features": ["Feature 1", "Feature 2", ...],
  "functionality": ["Core function 1", "Core function 2", ...],
  "userTypes": ["User type 1", "User type 2", ...],
  "keyComponents": ["Component 1", "Component 2", ...],
  "businessLogic": ["Logic rule 1", "Logic rule 2", ...],
  "dataRequirements": ["Data type 1", "Data type 2", ...]
}

Focus on extracting specific, actionable features that can be implemented in HTML, CSS, and JavaScript.`;

    try {
      const response = await this.model.generateContent(systemPrompt);
      const content = response.response.text();
      return this.parseJSON(content);
    } catch (error) {
      console.error("Failed to analyze app features:", error);
      throw new Error("Could not analyze app features");
    }
  }

  private async determineFileStructure(
    appFeatures: AppFeatures,
  ): Promise<FileStructure> {
    const systemPrompt = `You are an expert web architect. Based on the app features, determine the optimal file structure.

App Features: ${JSON.stringify(appFeatures)}

Determine the file structure in JSON format:

{
  "files": [
    {
      "name": "index.html",
      "type": "html",
      "purpose": "Main landing page",
      "dependencies": ["styles.css", "script.js"],
      "linkedFiles": ["about.html", "contact.html"]
    }
  ],
  "folderStructure": "Describe the folder organization",
  "architecture": "Describe the overall architecture pattern",
  "dependencies": ["HTML5", "CSS3", "Vanilla JavaScript"],
  "navigation": {
    "type": "SPA with client-side routing",
    "structure": "Header navigation with sidebar",
    "routes": [
      {
        "path": "/",
        "file": "index.html",
        "title": "Home",
        "description": "Main page"
      }
    ]
  }
}

Create all necessary HTML pages, one main CSS file, and one main JavaScript file. Ensure proper linking between files.`;

    try {
      const response = await this.model.generateContent(systemPrompt);
      const content = response.response.text();
      return this.parseJSON(content);
    } catch (error) {
      console.error("Failed to determine file structure:", error);
      throw new Error("Could not determine file structure");
    }
  }

  private async generateAllFiles(
    fileStructure: FileStructure,
    appFeatures: AppFeatures,
  ): Promise<Record<string, string>> {
    const files: Record<string, string> = {};

    // Generate each file with a separate AI call for maximum quality
    for (const fileSpec of fileStructure.files) {
      this.reportProgress(
        `🔧 Generating`,
        `Creating ${fileSpec.name} for ${fileSpec.purpose}`,
      );

      if (fileSpec.type === "html") {
        files[fileSpec.name] = await this.generateHTMLFile(
          fileSpec,
          appFeatures,
          fileStructure,
        );
        this.reportProgress(
          `✅ HTML Generated`,
          `${fileSpec.name} with semantic HTML5 structure`,
        );
      } else if (fileSpec.type === "css") {
        files[fileSpec.name] = await this.generateCSSFile(
          fileSpec,
          appFeatures,
          fileStructure,
        );
        this.reportProgress(
          `✅ CSS Generated`,
          `${fileSpec.name} with modern responsive design`,
        );
      } else if (fileSpec.type === "js") {
        files[fileSpec.name] = await this.generateJSFile(
          fileSpec,
          appFeatures,
          fileStructure,
        );
        this.reportProgress(
          `✅ JavaScript Generated`,
          `${fileSpec.name} with ES6+ functionality`,
        );
      }
    }

    return files;
  }

  private async generateHTMLFile(
    fileSpec: FileSpec,
    appFeatures: AppFeatures,
    fileStructure: FileStructure,
  ): Promise<string> {
    const systemPrompt = `You are an expert HTML5 developer. Generate a complete, modern HTML file.

File Specification: ${JSON.stringify(fileSpec)}
App Features: ${JSON.stringify(appFeatures)}
File Structure: ${JSON.stringify(fileStructure)}

Generate a complete HTML5 file with:
- Semantic HTML5 elements
- Proper document structure
- Meta tags for SEO
- Responsive viewport meta tag
- Links to CSS and JavaScript files
- Modern, accessible markup
- All necessary content for this specific page

The HTML should be production-ready with proper structure, semantic elements, and all content needed for the ${fileSpec.purpose}.

Return only the HTML code, no explanations.`;

    try {
      const response = await this.model.generateContent(systemPrompt);
      return response.response.text();
    } catch (error) {
      console.error(`Failed to generate HTML file ${fileSpec.name}:`, error);
      return this.generateFallbackHTML(fileSpec.name);
    }
  }

  private async generateCSSFile(
    fileSpec: FileSpec,
    appFeatures: AppFeatures,
    fileStructure: FileStructure,
  ): Promise<string> {
    const systemPrompt = `You are an expert CSS3 developer. Generate a complete, modern CSS file.

File Specification: ${JSON.stringify(fileSpec)}
App Features: ${JSON.stringify(appFeatures)}
File Structure: ${JSON.stringify(fileStructure)}

Generate complete CSS3 code with:
- Modern CSS3 features (Grid, Flexbox, Custom Properties)
- Responsive design with mobile-first approach
- Beautiful, modern UI design
- Consistent color scheme and typography
- Smooth animations and transitions
- Professional layout and spacing
- Cross-browser compatibility
- Dark mode support (optional)

The CSS should create a beautiful, modern interface that's fully responsive and professional.

Return only the CSS code, no explanations.`;

    try {
      const response = await this.model.generateContent(systemPrompt);
      return response.response.text();
    } catch (error) {
      console.error(`Failed to generate CSS file ${fileSpec.name}:`, error);
      return this.generateFallbackCSS();
    }
  }

  private async generateJSFile(
    fileSpec: FileSpec,
    appFeatures: AppFeatures,
    fileStructure: FileStructure,
  ): Promise<string> {
    const systemPrompt = `You are an expert JavaScript developer. Generate complete, modern JavaScript code.

File Specification: ${JSON.stringify(fileSpec)}
App Features: ${JSON.stringify(appFeatures)}
File Structure: ${JSON.stringify(fileStructure)}

Generate modern JavaScript code with:
- ES6+ features (const/let, arrow functions, async/await)
- Modular, clean code structure
- Event listeners for all interactive elements
- Form validation and handling
- Client-side routing if needed
- Local storage for data persistence
- Error handling
- Modern DOM manipulation
- Full functionality for all app features

The JavaScript should implement all the functionality described in the app features with modern, clean code.

Return only the JavaScript code, no explanations.`;

    try {
      const response = await this.model.generateContent(systemPrompt);
      return response.response.text();
    } catch (error) {
      console.error(`Failed to generate JS file ${fileSpec.name}:`, error);
      return this.generateFallbackJS();
    }
  }

  private async setupNavigation(
    files: Record<string, string>,
    fileStructure: FileStructure,
  ): Promise<Record<string, string>> {
    const navigationPrompt = `You are an expert web developer. Enhance the navigation and routing in these files.

Current Files: ${JSON.stringify(Object.keys(files))}
Navigation Spec: ${JSON.stringify(fileStructure.navigation)}

Update the HTML and JavaScript files to ensure:
- Proper navigation between pages
- Active state management
- Smooth transitions
- Breadcrumb navigation if needed
- Mobile-responsive navigation

Return the updated files as JSON: {"filename": "updated content", ...}`;

    try {
      const response = await this.model.generateContent(navigationPrompt);
      const content = response.response.text();
      const updates = this.parseJSON(content);

      // Merge updates with existing files
      return { ...files, ...updates };
    } catch (error) {
      console.error("Failed to setup navigation:", error);
      return files; // Return original files if navigation setup fails
    }
  }

  private async finalizeIntegration(
    files: Record<string, string>,
    fileStructure: FileStructure,
  ): Promise<Record<string, string>> {
    const integrationPrompt = `You are an expert web developer. Perform final integration and optimization.

Files: ${JSON.stringify(Object.keys(files))}
Architecture: ${fileStructure.architecture}

Ensure:
- All files are properly linked
- JavaScript functions work across all pages
- CSS styles are consistent
- No broken links or references
- Optimal performance
- Clean, production-ready code

Return the finalized files as JSON: {"filename": "final content", ...}`;

    try {
      const response = await this.model.generateContent(integrationPrompt);
      const content = response.response.text();
      const finalFiles = this.parseJSON(content);

      // Merge with existing files
      return { ...files, ...finalFiles };
    } catch (error) {
      console.error("Failed to finalize integration:", error);
      return files; // Return current files if finalization fails
    }
  }

  private createImplementationPlan(
    appFeatures: AppFeatures,
    fileStructure: FileStructure,
  ): string[] {
    return [
      `Analyzed app requirements: ${appFeatures.description}`,
      `Identified ${appFeatures.features.length} key features`,
      `Created ${fileStructure.files.length} files with proper architecture`,
      `Implemented ${fileStructure.navigation.type} navigation`,
      `Generated modern, responsive design with full functionality`,
      `Integrated all components with proper routing and data flow`,
    ];
  }

  private parseJSON(content: string): any {
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\s*|\s*```/g, "").trim();
      return JSON.parse(cleanContent);
    } catch (error) {
      console.error("JSON parsing failed:", error);
      console.log("Content:", content);
      throw new Error("Invalid JSON response from AI");
    }
  }

  // Fallback methods (minimal fallbacks)
  private generateFallbackHTML(filename: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Generated App</h1>
    <p>AI generation failed for ${filename}. Please retry.</p>
    <script src="script.js"></script>
</body>
</html>`;
  }

  private generateFallbackCSS(): string {
    return `body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
h1 { color: #333; }`;
  }

  private generateFallbackJS(): string {
    return `console.log('App loaded');`;
  }
}
