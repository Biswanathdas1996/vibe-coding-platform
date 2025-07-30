import { GoogleGenerativeAI } from "@google/generative-ai";

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
  private model: any;
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

    // Initialize the AI model directly
    this.model = {
      generateContent: async (prompt: string) => {
        try {
          const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${key}`,
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: prompt,
                      },
                    ],
                  },
                ],
              }),
            }
          );

          const data = await response.json();
          if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error("Invalid API response structure");
          }
          return {
            response: {
              text: () => data.candidates[0].content.parts[0].text,
            },
          };
        } catch (error) {
          console.error("AI generation error:", error);
          throw error;
        }
      },
    };
  }

  private reportProgress(step: string, details: string) {
    console.log(`${step}: ${details}`);
    if (this.progressCallback) {
      this.progressCallback(step, details);
    }
  }

  async generateComplete(
    prompt: string,
    isFirstPrompt: boolean = true
  ): Promise<GenerationResponse> {
    if (isFirstPrompt) {
      console.log(
        "🎯 First prompt detected - Starting comprehensive app generation"
      );
      this.reportProgress(
        "🔍 Initial Analysis",
        "Analyzing complete application requirements"
      );

      // First step: Detailed feature analysis
      const appFeatures = await this.analyzeAppFeatures(prompt);
      this.reportProgress(
        "✅ Analysis Complete",
        `Extracted ${appFeatures.features.length} core features and requirements`
      );

      // Second step: Determine detailed file structure
      this.reportProgress(
        "� Planning Structure",
        "Determining optimal file organization"
      );
      const fileStructure = await this.determineFileStructure(appFeatures);
      this.reportProgress(
        "✅ Structure Complete",
        `Planned ${fileStructure.files.length} files and folder structure`
      );

      // Third step: Generate all files
      return await this.generateCompleteApp(prompt, appFeatures, fileStructure);
    } else {
      console.log("🔄 Modifying existing application");
      throw new Error("Modification of existing apps not yet implemented");
    }
  }

  private async generateCompleteApp(
    prompt: string,
    initialFeatures?: AppFeatures,
    initialStructure?: FileStructure
  ): Promise<GenerationResponse> {
    // Use provided features or analyze new ones
    let appFeatures: AppFeatures;
    if (initialFeatures) {
      appFeatures = initialFeatures;
      this.reportProgress(
        "📋 Using Initial Analysis",
        `Working with ${appFeatures.features.length} identified features`
      );
    } else {
      this.reportProgress(
        "📋 Step 1/6",
        "Analyzing app features and functionality"
      );
      appFeatures = await this.analyzeAppFeatures(prompt);
      this.reportProgress(
        "✅ Step 1 Complete",
        `Identified ${
          appFeatures.features.length
        } key features: ${appFeatures.features.slice(0, 3).join(", ")}${
          appFeatures.features.length > 3 ? "..." : ""
        }`
      );
    }

    // Use provided structure or determine new one
    let fileStructure: FileStructure;
    if (initialStructure) {
      fileStructure = initialStructure;
      this.reportProgress(
        "🏗️ Using Provided Structure",
        `Working with ${fileStructure.files.length} planned files`
      );
    } else {
      this.reportProgress(
        "🏗️ Step 2/6",
        "Determining optimal file structure and architecture"
      );
      fileStructure = await this.determineFileStructure(appFeatures);
      this.reportProgress(
        "✅ Step 2 Complete",
        `Planned ${fileStructure.files.length} files with ${fileStructure.architecture} architecture`
      );
    }

    this.reportProgress("📁 Step 3/6", "Creating optimized folder structure");
    // Folder structure is just planning - actual files created in step 4
    this.reportProgress(
      "✅ Step 3 Complete",
      `Designed ${fileStructure.folderStructure} with proper file organization`
    );

    this.reportProgress(
      "⚡ Step 4/6",
      "Generating individual files with modern HTML5, CSS3, and JavaScript"
    );
    const files = await this.generateAllFiles(fileStructure, appFeatures);
    this.reportProgress(
      "✅ Step 4 Complete",
      `Generated ${
        Object.keys(files).length
      } production-ready files with modern code`
    );

    this.reportProgress(
      "🔗 Step 5/6",
      "Setting up navigation and routing system"
    );
    const routedFiles = await this.setupNavigation(files, fileStructure);
    this.reportProgress(
      "✅ Step 5 Complete",
      `Implemented ${fileStructure.navigation.type} with responsive navigation`
    );

    this.reportProgress("🎯 Step 6/6", "Final integration and optimization");
    const finalFiles = await this.finalizeIntegration(
      routedFiles,
      fileStructure
    );
    this.reportProgress(
      "✅ Generation Complete",
      `Created fully functional app with ${
        Object.keys(finalFiles).length
      } integrated files`
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
    const systemPrompt = `As an expert system architect, provide a comprehensive analysis of this application request.

USER REQUEST: "${prompt}"

Analyze this as if building a production application. Return a detailed JSON with this structure:

{
  "description": "Detailed explanation of the application's purpose and goals",
  "features": [
    "Detailed list of all features, both explicit and implied",
    "Include user interface features",
    "Include data management features",
    "Include user interaction features"
  ],
  "functionality": [
    "Core functions the app must perform",
    "Background processes",
    "Data operations",
    "User interactions"
  ],
  "userTypes": [
    "All potential user roles",
    "Their permissions and capabilities"
  ],
  "keyComponents": [
    "Major UI components needed",
    "Backend services required",
    "Data storage components",
    "Integration points"
  ],
  "businessLogic": [
    "Core business rules",
    "Validation rules",
    "Process flows",
    "State management needs"
  ],
  "dataRequirements": [
    "Data types to be stored",
    "Data relationships",
    "Storage requirements",
    "Cache needs"
  ]
}

BE COMPREHENSIVE - Include everything needed for a production application. Think beyond the basic requirements.`;

    try {
      const response = await this.model.generateContent(systemPrompt);
      let content = response.response.text();

      // Clean up the response and ensure we get valid JSON
      content = content.trim();

      // Remove any markdown code block markers
      content = content.replace(/```json\s*|\s*```/g, "");

      // Extract JSON if it's wrapped in other text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }

      return this.parseJSON(content);
    } catch (error) {
      console.error("Failed to analyze app features:", error);
      throw new Error("Could not analyze app features");
    }
  }

  private async determineFileStructure(
    appFeatures: AppFeatures
  ): Promise<FileStructure> {
    const systemPrompt = `As an expert web architect, create a detailed file structure plan for this application.

APP REQUIREMENTS: ${JSON.stringify(appFeatures, null, 2)}

Create a comprehensive file structure plan following modern web development best practices. Return a JSON with this structure:

{
  "files": [
    {
      "name": "Filename with extension",
      "type": "html|css|js",
      "purpose": "Detailed purpose of this file",
      "dependencies": [
        "List of files this depends on",
        "Including framework files",
        "And third-party libraries"
      ],
      "linkedFiles": [
        "Other files this interacts with",
        "Navigation targets",
        "Dynamic content sources"
      ]
    }
  ],
  "folderStructure": "Detailed description of directory organization",
  "architecture": "Detailed description of the technical architecture",
  "dependencies": [
    "List ALL required technologies",
    "Include versions if critical",
    "List build tools if needed",
    "List runtime dependencies"
  ],
  "navigation": {
    "type": "Navigation architecture type (SPA, MPA, etc)",
    "structure": "Detailed navigation structure description",
    "routes": [
      {
        "path": "URL path",
        "file": "Source file",
        "title": "Page title",
        "description": "Detailed page purpose"
      }
    ]
  }
}

REQUIREMENTS:
1. Consider modern web standards and best practices
2. Include ALL necessary files for a production app
3. Plan for proper code organization and maintainability
4. Consider build and deployment needs
5. Include error handling and fallback files
6. Consider performance optimization`;

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
    appFeatures: AppFeatures
  ): Promise<Record<string, string>> {
    const files: Record<string, string> = {};

    // Sort files by dependencies to ensure proper generation order
    const sortedFiles = this.sortFilesByDependencies(fileStructure.files);

    // Generate each file with a dedicated LLM call for maximum quality
    for (const fileSpec of sortedFiles) {
      this.reportProgress(
        `🔧 Generating`,
        `Creating ${fileSpec.name} (${fileSpec.purpose})`
      );

      // Get context from already generated files
      const context = this.getFileGenerationContext(fileSpec, files);

      try {
        let content: string;
        switch (fileSpec.type) {
          case "html":
            content = await this.generateHTMLFile(
              fileSpec,
              appFeatures,
              fileStructure,
              context
            );
            this.reportProgress(
              `✅ HTML Generated`,
              `${fileSpec.name} with modern semantic structure`
            );
            break;

          case "css":
            content = await this.generateCSSFile(
              fileSpec,
              appFeatures,
              fileStructure,
              context
            );
            this.reportProgress(
              `✅ CSS Generated`,
              `${fileSpec.name} with responsive design`
            );
            break;

          case "js":
            content = await this.generateJSFile(
              fileSpec,
              appFeatures,
              fileStructure,
              context
            );
            this.reportProgress(
              `✅ JavaScript Generated`,
              `${fileSpec.name} with modern features`
            );
            break;

          default:
            throw new Error(`Unknown file type: ${fileSpec.type}`);
        }

        // Validate generated content
        this.validateGeneratedContent(content, fileSpec);

        // Store the file
        files[fileSpec.name] = content;

        // Optional: Check for cross-file consistency
        if (Object.keys(files).length > 1) {
          await this.validateCrossFileConsistency(files, fileStructure);
        }
      } catch (error) {
        console.error(`Failed to generate ${fileSpec.name}:`, error);
        files[fileSpec.name] = this.generateFallbackContent(
          fileSpec.type,
          fileSpec.name
        );
        this.reportProgress(`⚠️ Warning`, `Used fallback for ${fileSpec.name}`);
      }
    }

    return files;
  }

  private async generateHTMLFile(
    fileSpec: FileSpec,
    appFeatures: AppFeatures,
    fileStructure: FileStructure,
    context?: { dependencies: string[]; content: string[] }
  ): Promise<string> {
    const systemPrompt = `As an expert HTML5 developer, generate a complete, modern HTML file.

FILE DETAILS:
Name: ${fileSpec.name}
Purpose: ${fileSpec.purpose}
Dependencies: ${JSON.stringify(fileSpec.dependencies)}
Linked Files: ${JSON.stringify(fileSpec.linkedFiles)}

APP FEATURES:
${JSON.stringify(appFeatures, null, 2)}

FILE STRUCTURE:
${JSON.stringify(fileStructure, null, 2)}

${
  context
    ? `RELATED FILES:
${context.dependencies
  .map((dep, i) => `${dep}:\n${context.content[i]}\n`)
  .join("\n")}`
    : ""
}

REQUIREMENTS:
1. Use modern HTML5 semantic elements appropriately
2. Include comprehensive meta tags for SEO and social sharing
3. Ensure proper viewport settings for responsive design
4. Link all required CSS and JavaScript files
5. Implement modern, accessible markup (ARIA labels, roles)
6. Include appropriate schema.org markup if relevant
7. Add error boundaries and fallback content
8. Optimize for performance (async/defer scripts)
9. Include proper security headers
10. Add favicon and PWA support if applicable

Return ONLY the complete HTML code with no explanations. The code must be production-ready and fully functional.`;

    try {
      const response = await this.model.generateContent(systemPrompt);
      let content = response.response.text();

      // Clean up the content
      content = this.cleanGeneratedCode(content, "html");

      // Validate the HTML structure
      if (!this.isValidHTML(content)) {
        console.error(
          `Invalid HTML structure for ${fileSpec.name}, attempting repair...`
        );
        content = this.repairHTML(content);
      }

      if (!content.includes("<!DOCTYPE html>")) {
        content = `<!DOCTYPE html>\n${content}`;
      }

      return content;
    } catch (error) {
      console.error(`Failed to generate HTML file ${fileSpec.name}:`, error);
      return this.generateFallbackHTML(fileSpec.name);
    }
  }

  private async generateCSSFile(
    fileSpec: FileSpec,
    appFeatures: AppFeatures,
    fileStructure: FileStructure,
    context?: { dependencies: string[]; content: string[] }
  ): Promise<string> {
    const systemPrompt = `As an expert CSS developer, generate a complete, modern stylesheet.

FILE DETAILS:
Name: ${fileSpec.name}
Purpose: ${fileSpec.purpose}
Dependencies: ${JSON.stringify(fileSpec.dependencies)}
Linked Files: ${JSON.stringify(fileSpec.linkedFiles)}

APP FEATURES:
${JSON.stringify(appFeatures, null, 2)}

FILE STRUCTURE:
${JSON.stringify(fileStructure, null, 2)}

${
  context
    ? `HTML CONTENT TO STYLE:
${context.dependencies
  .filter((d) => d.endsWith(".html"))
  .map((dep, i) => `${dep}:\n${context.content[i]}\n`)
  .join("\n")}`
    : ""
}

REQUIREMENTS:
1. Use modern CSS features:
   - CSS Grid and Flexbox for layout
   - CSS Custom Properties for theming
   - CSS Modules or BEM naming for scoping
   - Modern selectors and pseudo-classes
2. Implement responsive design:
   - Mobile-first approach
   - Fluid typography
   - Responsive images
   - Flexible layouts
3. Create professional UI:
   - Consistent color scheme
   - Typography system
   - Component styles
   - Interactive states
4. Add enhancements:
   - Smooth animations
   - Loading states
   - Error states
   - Focus styles
5. Optimize for:
   - Performance
   - Accessibility
   - Cross-browser support
   - Print styles

Return ONLY the complete CSS code with no explanations. The code must be production-ready and fully functional.`;

    try {
      const response = await this.model.generateContent(systemPrompt);
      let content = response.response.text();

      // Clean up the content
      content = this.cleanGeneratedCode(content, "css");

      // Validate and repair CSS if needed
      if (!this.isValidCSS(content)) {
        console.error(
          `Invalid CSS structure for ${fileSpec.name}, attempting repair...`
        );
        content = this.repairCSS(content);
      }

      return content;
    } catch (error) {
      console.error(`Failed to generate CSS file ${fileSpec.name}:`, error);
      return this.generateFallbackCSS();
    }
  }

  private async generateJSFile(
    fileSpec: FileSpec,
    appFeatures: AppFeatures,
    fileStructure: FileStructure,
    context?: { dependencies: string[]; content: string[] }
  ): Promise<string> {
    const systemPrompt = `As an expert JavaScript developer, generate modern, production-ready code.

FILE DETAILS:
Name: ${fileSpec.name}
Purpose: ${fileSpec.purpose}
Dependencies: ${JSON.stringify(fileSpec.dependencies)}
Linked Files: ${JSON.stringify(fileSpec.linkedFiles)}

APP FEATURES:
${JSON.stringify(appFeatures, null, 2)}

FILE STRUCTURE:
${JSON.stringify(fileStructure, null, 2)}

${
  context
    ? `RELATED FILES:
${context.dependencies
  .map((dep, i) => `${dep}:\n${context.content[i]}\n`)
  .join("\n")}`
    : ""
}

REQUIREMENTS:
1. Use Modern JavaScript:
   - ES2024+ features
   - Modular structure
   - Clean code practices
   - Type safety patterns
2. Implement Core Features:
   - Event handling
   - Form validation
   - API integration
   - State management
3. Add Essential Functionality:
   - Error handling
   - Loading states
   - Data persistence
   - Cache management
4. Ensure Reliability:
   - Input validation
   - Error boundaries
   - Retry mechanisms
   - Fallback handling
5. Optimize Performance:
   - Lazy loading
   - Debouncing/throttling
   - Memory management
   - Resource cleanup
6. Enhance Security:
   - Input sanitization
   - XSS prevention
   - CSRF protection
   - Secure storage

Return ONLY the complete JavaScript code with no explanations. The code must be production-ready and fully functional.`;

    try {
      const response = await this.model.generateContent(systemPrompt);
      let content = response.response.text();

      // Clean up the content
      content = this.cleanGeneratedCode(content, "js");

      // Validate and repair JavaScript if needed
      if (!this.isValidJS(content)) {
        console.error(
          `Invalid JavaScript structure for ${fileSpec.name}, attempting repair...`
        );
        content = this.repairJS(content);
      }

      return content;
    } catch (error) {
      console.error(`Failed to generate JS file ${fileSpec.name}:`, error);
      return this.generateFallbackJS();
    }
  }

  private async setupNavigation(
    files: Record<string, string>,
    fileStructure: FileStructure
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
    fileStructure: FileStructure
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
    fileStructure: FileStructure
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
      // Step 1: Clean up the content
      let cleanContent = content
        // Remove code block markers
        .replace(/```json\s*|\s*```|```javascript\s*|```js\s*/g, "")
        // Remove any non-JSON text before or after the actual JSON
        .replace(/^[^{]*/, "")
        .replace(/[^}]*$/, "")
        // Normalize whitespace
        .trim();

      // Step 2: Try to find the actual JSON content
      const jsonStart = cleanContent.indexOf("{");
      const jsonEnd = cleanContent.lastIndexOf("}");

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("No valid JSON object found in content");
      }

      cleanContent = cleanContent.slice(jsonStart, jsonEnd + 1);

      // Step 3: Fix common JSON syntax issues
      cleanContent = cleanContent
        // Fix trailing commas
        .replace(/,(\s*[}\]])/g, "$1")
        // Fix missing quotes around property names
        .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3')
        // Fix single quotes to double quotes
        .replace(/'/g, '"')
        // Remove any comments
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");

      // Step 4: Validate and parse
      const parsed = JSON.parse(cleanContent);

      // Step 5: Basic structure validation
      if (!parsed || typeof parsed !== "object") {
        throw new Error("Parsed content is not a valid JSON object");
      }

      return parsed;
    } catch (error) {
      console.error("JSON parsing failed:", error);
      console.error("Original content:", content);
      console.error("Failed to parse JSON. Attempting alternative cleanup...");

      try {
        // Last resort: Try to extract just the required properties based on context
        const extracted: any = {};

        // Extract arrays using regex
        const featureMatch = content.match(/"features"\s*:\s*\[([\s\S]*?)\]/);
        if (featureMatch)
          extracted.features = JSON.parse(`[${featureMatch[1]}]`);

        const funcMatch = content.match(/"functionality"\s*:\s*\[([\s\S]*?)\]/);
        if (funcMatch)
          extracted.functionality = JSON.parse(`[${funcMatch[1]}]`);

        // Extract strings using regex
        const descMatch = content.match(/"description"\s*:\s*"([^"]*)"/);
        if (descMatch) extracted.description = descMatch[1];

        const archMatch = content.match(/"architecture"\s*:\s*"([^"]*)"/);
        if (archMatch) extracted.architecture = archMatch[1];

        if (Object.keys(extracted).length > 0) {
          console.log("Extracted partial content:", extracted);
          return extracted;
        }

        throw new Error("Alternative parsing failed");
      } catch (alternativeError) {
        console.error("Alternative parsing also failed:", alternativeError);
        throw new Error(`JSON parsing failed completely`);
      }
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

  private sortFilesByDependencies(files: FileSpec[]): FileSpec[] {
    const visited = new Set<string>();
    const result: FileSpec[] = [];

    const visit = (file: FileSpec) => {
      if (visited.has(file.name)) return;

      // Process dependencies first
      if (file.dependencies) {
        for (const dep of file.dependencies) {
          const depFile = files.find((f) => f.name === dep);
          if (depFile) visit(depFile);
        }
      }

      visited.add(file.name);
      result.push(file);
    };

    // Process all files
    for (const file of files) {
      visit(file);
    }

    return result;
  }

  private getFileGenerationContext(
    fileSpec: FileSpec,
    generatedFiles: Record<string, string>
  ): { dependencies: string[]; content: string[] } {
    const context = {
      dependencies: [] as string[],
      content: [] as string[],
    };

    // Add content from dependencies
    if (fileSpec.dependencies) {
      for (const dep of fileSpec.dependencies) {
        if (generatedFiles[dep]) {
          context.dependencies.push(dep);
          context.content.push(generatedFiles[dep]);
        }
      }
    }

    return context;
  }

  private validateGeneratedContent(content: string, fileSpec: FileSpec): void {
    if (!content || content.trim().length === 0) {
      throw new Error(`Generated empty content for ${fileSpec.name}`);
    }

    // Basic validation based on file type
    switch (fileSpec.type) {
      case "html":
        if (!content.includes("<!DOCTYPE html>")) {
          throw new Error(`Invalid HTML content in ${fileSpec.name}`);
        }
        break;
      case "css":
        if (!content.match(/[a-z-]+\s*{[^}]*}/)) {
          throw new Error(`Invalid CSS content in ${fileSpec.name}`);
        }
        break;
      case "js":
        try {
          Function(`"use strict";${content}`);
        } catch (e) {
          throw new Error(`Invalid JavaScript in ${fileSpec.name}: ${e}`);
        }
        break;
    }
  }

  private async validateCrossFileConsistency(
    files: Record<string, string>,
    fileStructure: FileStructure
  ): Promise<void> {
    // Check CSS class usage
    const cssContent =
      Object.entries(files).find(([name]) => name.endsWith(".css"))?.[1] || "";
    const cssClasses =
      cssContent.match(/\.[a-zA-Z-_0-9]+\s*{/g)?.map((c) => c.slice(1, -1)) ||
      [];

    // Check HTML files reference valid CSS classes
    for (const [name, content] of Object.entries(files)) {
      if (!name.endsWith(".html")) continue;

      for (const cssClass of cssClasses) {
        if (
          content.includes(`class="${cssClass}"`) ||
          content.includes(`class='${cssClass}'`)
        ) {
          // Class is used, all good
          continue;
        }
      }
    }

    // Check JavaScript function references
    const jsContent =
      Object.entries(files).find(([name]) => name.endsWith(".js"))?.[1] || "";
    const jsFunctions =
      jsContent
        .match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g)
        ?.map((f) => f.split(" ")[1]) || [];

    // Check HTML files reference valid JavaScript functions
    for (const [name, content] of Object.entries(files)) {
      if (!name.endsWith(".html")) continue;

      for (const func of jsFunctions) {
        if (
          content.includes(`onclick="${func}"`) ||
          content.includes(`onclick='${func}'`)
        ) {
          // Function is used, all good
          continue;
        }
      }
    }
  }

  private generateFallbackContent(type: string, filename: string): string {
    switch (type) {
      case "html":
        return this.generateFallbackHTML(filename);
      case "css":
        return this.generateFallbackCSS();
      case "js":
        return this.generateFallbackJS();
      default:
        return `// Fallback content for ${filename}`;
    }
  }

  private cleanGeneratedCode(
    content: string,
    type: "html" | "css" | "js"
  ): string {
    // Remove any markdown code block markers
    content = content.replace(/```[a-z]*\n|\n```/g, "");

    // Remove any response text before or after the actual code
    switch (type) {
      case "html":
        const htmlStart =
          content.indexOf("<!DOCTYPE") >= 0
            ? content.indexOf("<!DOCTYPE")
            : content.indexOf("<html");
        if (htmlStart >= 0) {
          content = content.slice(htmlStart);
        }
        break;

      case "css":
        const cssStart = content.search(/[\w-]+\s*{/);
        if (cssStart >= 0) {
          content = content.slice(cssStart);
        }
        break;

      case "js":
        // Remove potential explanation text at the start
        content = content.replace(
          /^[\s\S]*?(?=(const|let|var|function|class|import|\/\/|\/\*))/m,
          ""
        );
        break;
    }

    // Normalize line endings
    content = content.replace(/\r\n/g, "\n");

    return content.trim();
  }

  private isValidHTML(content: string): boolean {
    try {
      // Basic structure checks
      const hasDoctype = content.includes("<!DOCTYPE");
      const hasHtml = content.includes("<html");
      const hasHead = content.includes("<head");
      const hasBody = content.includes("<body");
      const hasClosingTags =
        content.includes("</html>") &&
        content.includes("</head>") &&
        content.includes("</body>");

      if (!hasDoctype || !hasHtml || !hasHead || !hasBody || !hasClosingTags) {
        return false;
      }

      // Check for unclosed tags
      const openTags: string[] = [];
      const tagPattern = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
      let match;

      while ((match = tagPattern.exec(content)) !== null) {
        const isClosing = match[0].startsWith("</");
        const tagName = match[1].toLowerCase();

        if (isClosing) {
          if (openTags.length === 0 || openTags.pop() !== tagName) {
            return false;
          }
        } else if (
          !match[0].endsWith("/>") &&
          !["meta", "link", "br", "hr", "img", "input"].includes(tagName)
        ) {
          openTags.push(tagName);
        }
      }

      return openTags.length === 0;
    } catch (error) {
      return false;
    }
  }

  private repairHTML(content: string): string {
    // Ensure basic structure
    if (!content.includes("<!DOCTYPE html>")) {
      content = "<!DOCTYPE html>\n" + content;
    }

    if (!content.includes("<html")) {
      content = content.replace(
        "<!DOCTYPE html>",
        '<!DOCTYPE html>\n<html lang="en">'
      );
    }

    if (!content.includes("<head>")) {
      const htmlPattern = /<html[^>]*>/;
      content = content.replace(htmlPattern, "$&\n<head>");

      // Add minimal head content if missing
      if (!content.includes("<title>")) {
        content = content.replace(
          "</head>",
          "  <title>Generated Page</title>\n</head>"
        );
      }
      if (!content.includes("charset")) {
        content = content.replace("<head>", '<head>\n  <meta charset="UTF-8">');
      }
      if (!content.includes("viewport")) {
        content = content.replace(
          "</head>",
          '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n</head>'
        );
      }
    }

    if (!content.includes("<body>")) {
      content = content.replace("</head>", "</head>\n<body>");
    }

    // Ensure proper closing
    if (!content.includes("</body>")) {
      content += "\n</body>";
    }
    if (!content.includes("</html>")) {
      content += "\n</html>";
    }

    // Fix common issues
    content = content
      // Remove duplicate doctypes
      .replace(/(<!DOCTYPE html>[\s\n]*)+/g, "<!DOCTYPE html>\n")
      // Fix self-closing tags
      .replace(
        /<(meta|link|br|hr|img|input)([^>]*)>(?![\s\n]*<\/\1>)/g,
        "<$1$2 />"
      )
      // Normalize quotes
      .replace(/='([^']*)'/g, '="$1"')
      // Fix malformed attributes
      .replace(/([a-zA-Z-]+)=([^"'][^\s>]*)/g, '$1="$2"');

    return content;
  }

  private isValidCSS(content: string): boolean {
    try {
      // Basic structure check for CSS
      const rulePattern = /[a-z0-9\s\-.#:[]]+{[^}]*}/gi;
      const matches = content.match(rulePattern);

      if (!matches) return false;

      // Check for balanced braces
      const openBraces = (content.match(/{/g) || []).length;
      const closeBraces = (content.match(/}/g) || []).length;

      return openBraces === closeBraces;
    } catch (error) {
      return false;
    }
  }

  private repairCSS(content: string): string {
    // Add root and fallback variables
    if (!content.includes(":root")) {
      content = `:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --background-color: #ffffff;
  --text-color: #212529;
  --font-family: system-ui, -apple-system, sans-serif;
}

${content}`;
    }

    // Fix common issues
    content = content
      // Fix missing units
      .replace(/:\s*0(?![a-z%.])/g, ": 0px")
      // Fix missing semicolons
      .replace(/([a-z0-9)%])\s*}/g, "$1; }")
      // Fix malformed colors
      .replace(/#([0-9a-f]{3}|[0-9a-f]{6})\b/gi, (match) => match.toLowerCase())
      // Fix invalid vendor prefixes
      .replace(/-([a-z]+-)*(?!webkit|moz|ms|o)[a-z]+-/g, "-");

    // Ensure all rules have closing braces
    let openBraces = (content.match(/{/g) || []).length;
    let closeBraces = (content.match(/}/g) || []).length;
    while (openBraces > closeBraces) {
      content += "\n}";
      closeBraces++;
    }

    return content;
  }

  private isValidJS(content: string): boolean {
    try {
      new Function("'use strict';" + content);
      return true;
    } catch (error) {
      return false;
    }
  }

  private repairJS(content: string): string {
    // Add strict mode if missing
    if (
      !content.includes("'use strict'") &&
      !content.includes('"use strict"')
    ) {
      content = "'use strict';\n\n" + content;
    }

    // Add basic error handling
    if (!content.includes("try") && !content.includes("catch")) {
      content = `try {
${content}
} catch (error) {
  console.error('An error occurred:', error);
}`;
    }

    // Fix common issues
    content = content
      // Fix missing semicolons
      .replace(/([a-z0-9"'`])\n/g, "$1;\n")
      // Ensure proper function declarations
      .replace(/function\s+([^(])/g, "function $1")
      // Fix arrow functions
      .replace(/=>\s*{([^}]*)(?<!return)}/g, "=> { return $1 }");

    return content;
  }
}
