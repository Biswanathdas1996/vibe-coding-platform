import { GoogleGenAI } from "@google/genai";

// Enhanced interfaces for advanced agentic capabilities
export interface CodeGenerationResponse {
  plan: string[];
  files: Record<string, string>;
  reasoning?: string;
  architecture?: string;
  nextSteps?: string[];
  dependencies?: string[];
  testingStrategy?: string;
}

export interface AgentContext {
  previousInteractions: Array<{
    prompt: string;
    response: CodeGenerationResponse;
    timestamp: Date;
  }>;
  projectGoals: string[];
  constraints: string[];
  preferences: Record<string, any>;
}

export interface ToolCapability {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  execute: (input: any) => Promise<any>;
}

// Advanced Agentic AI Architecture with MCP-like capabilities
export class AdvancedGeminiAgent {
  private genAI: GoogleGenAI;
  private context: AgentContext;
  private tools: Map<string, ToolCapability>;
  private memory: Map<string, any>;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenAI({ apiKey });
    this.context = {
      previousInteractions: [],
      projectGoals: [],
      constraints: [],
      preferences: {}
    };
    this.tools = new Map();
    this.memory = new Map();
    this.initializeTools();
  }

  private initializeTools() {
    // File analysis tool
    this.tools.set("analyzeFile", {
      name: "analyzeFile",
      description: "Analyze existing code files for patterns, dependencies, and improvements",
      inputSchema: { filename: "string", content: "string" },
      execute: async (input) => {
        const { filename, content } = input;
        const analysis = {
          fileType: filename.split('.').pop(),
          complexity: content.split('\n').length,
          dependencies: this.extractDependencies(content),
          patterns: this.detectPatterns(content),
          suggestions: this.getSuggestions(content)
        };
        return analysis;
      }
    });

    // Code quality assessment tool
    this.tools.set("assessQuality", {
      name: "assessQuality",
      description: "Assess code quality and provide improvement recommendations",
      inputSchema: { code: "string", language: "string" },
      execute: async (input) => {
        const { code, language } = input;
        return {
          score: this.calculateQualityScore(code),
          issues: this.findQualityIssues(code),
          recommendations: this.getQualityRecommendations(code),
          refactoringOpportunities: this.findRefactoringOpportunities(code)
        };
      }
    });

    // Architecture planning tool
    this.tools.set("planArchitecture", {
      name: "planArchitecture",
      description: "Plan software architecture based on requirements",
      inputSchema: { requirements: "string", constraints: "array" },
      execute: async (input) => {
        const { requirements, constraints } = input;
        return {
          architecture: this.generateArchitecture(requirements, constraints),
          patterns: this.recommendPatterns(requirements),
          technologies: this.suggestTechnologies(requirements),
          scalability: this.assessScalability(requirements)
        };
      }
    });
  }

  private extractDependencies(content: string): string[] {
    const imports = content.match(/import.*from.*['"](.*)['"]/g) || [];
    const requires = content.match(/require\(['"](.*)['"]\)/g) || [];
    return [...imports, ...requires].map(dep => 
      dep.replace(/.*['"](.*?)['"].*/, '$1')
    );
  }

  private detectPatterns(content: string): string[] {
    const patterns = [];
    if (content.includes('addEventListener')) patterns.push('Event Handling');
    if (content.includes('fetch(') || content.includes('axios')) patterns.push('API Integration');
    if (content.includes('class ')) patterns.push('Object-Oriented');
    if (content.includes('useState') || content.includes('useEffect')) patterns.push('React Hooks');
    return patterns;
  }

  private getSuggestions(content: string): string[] {
    const suggestions = [];
    if (!content.includes('try') && content.includes('fetch')) {
      suggestions.push('Add error handling for API calls');
    }
    if (content.includes('var ')) {
      suggestions.push('Consider using const/let instead of var');
    }
    return suggestions;
  }

  private calculateQualityScore(code: string): number {
    let score = 100;
    if (code.includes('var ')) score -= 10;
    if (!code.includes('try')) score -= 5;
    if (code.split('\n').length > 500) score -= 15;
    return Math.max(0, score);
  }

  private findQualityIssues(code: string): string[] {
    const issues = [];
    if (code.includes('console.log')) issues.push('Debug statements present');
    if (code.includes('TODO')) issues.push('Incomplete implementation');
    if (!/^function\s+\w+/.test(code) && !/^const\s+\w+\s*=/.test(code)) {
      issues.push('Poor function definition structure');
    }
    return issues;
  }

  private getQualityRecommendations(code: string): string[] {
    const recommendations = [];
    if (!code.includes('JSDoc') && code.includes('function')) {
      recommendations.push('Add JSDoc documentation');
    }
    if (!code.includes('test') && !code.includes('spec')) {
      recommendations.push('Add unit tests');
    }
    return recommendations;
  }

  private findRefactoringOpportunities(code: string): string[] {
    const opportunities = [];
    const lines = code.split('\n');
    if (lines.length > 100) opportunities.push('Consider breaking into smaller modules');
    if (code.includes('if') && code.split('if').length > 5) {
      opportunities.push('Consider using strategy pattern');
    }
    return opportunities;
  }

  private generateArchitecture(requirements: string, constraints: string[]): object {
    return {
      layers: ['Presentation', 'Business Logic', 'Data Access'],
      patterns: ['MVC', 'Observer', 'Factory'],
      components: this.identifyComponents(requirements),
      dataFlow: 'Unidirectional'
    };
  }

  private identifyComponents(requirements: string): string[] {
    const components = [];
    if (requirements.includes('user')) components.push('User Management');
    if (requirements.includes('data')) components.push('Data Layer');
    if (requirements.includes('api')) components.push('API Layer');
    return components;
  }

  private recommendPatterns(requirements: string): string[] {
    const patterns = [];
    if (requirements.includes('state')) patterns.push('State Management');
    if (requirements.includes('event')) patterns.push('Observer Pattern');
    if (requirements.includes('create')) patterns.push('Factory Pattern');
    return patterns;
  }

  private suggestTechnologies(requirements: string): string[] {
    const techs = [];
    if (requirements.includes('real-time')) techs.push('WebSockets');
    if (requirements.includes('database')) techs.push('PostgreSQL');
    if (requirements.includes('api')) techs.push('REST API');
    return techs;
  }

  private assessScalability(requirements: string): object {
    return {
      horizontal: requirements.includes('multiple users'),
      vertical: requirements.includes('large data'),
      recommendations: ['Use caching', 'Implement lazy loading', 'Consider microservices']
    };
  }

  public async generateCode(
    prompt: string,
    existingFiles?: Record<string, string>
  ): Promise<CodeGenerationResponse> {
    try {
      // Analyze existing files using tools
      const fileAnalyses = await this.analyzeExistingFiles(existingFiles);
      
      // Plan architecture using AI agent approach
      const architecturePlan = await this.tools.get("planArchitecture")?.execute({
        requirements: prompt,
        constraints: this.context.constraints
      });

      // Enhanced system prompt with agentic reasoning
      const systemPrompt = this.buildAdvancedSystemPrompt(prompt, fileAnalyses, architecturePlan);

      const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}\n\nContext from previous interactions: ${this.getContextualHistory()}\n\nIMPORTANT: Return ONLY valid JSON in this exact format:
{
  "plan": ["step 1", "step 2", "step 3"],
  "files": {
    "index.html": "file content here",
    "styles.css": "css content here",
    "script.js": "js content here"
  },
  "reasoning": "explanation of approach and decisions",
  "architecture": "architectural decisions and patterns used",
  "nextSteps": ["future improvements", "next features to add"],
  "dependencies": ["required packages or libraries"],
  "testingStrategy": "approach for testing the generated code"
}`;

      const response = await this.genAI.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: fullPrompt,
        config: {
          temperature: 0.2,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 8192
        }
      });

      let content = response.text || "";
      if (!content) {
        throw new Error("No response content from Gemini");
      }

      // Enhanced content parsing
      content = this.cleanResponseContent(content);
      const result = JSON.parse(content) as CodeGenerationResponse;

      // Validate and enhance response
      this.validateResponse(result);
      
      // Store interaction in context for learning
      this.context.previousInteractions.push({
        prompt,
        response: result,
        timestamp: new Date()
      });

      return result;
    } catch (error) {
      console.error("Advanced Gemini agent error:", error);
      throw new Error(
        `Advanced agent failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private async analyzeExistingFiles(existingFiles?: Record<string, string>): Promise<any[]> {
    if (!existingFiles) return [];
    
    const analyses = [];
    for (const [filename, content] of Object.entries(existingFiles)) {
      const analysis = await this.tools.get("analyzeFile")?.execute({ filename, content });
      analyses.push({ filename, analysis });
    }
    return analyses;
  }

  private buildAdvancedSystemPrompt(
    prompt: string, 
    fileAnalyses: any[], 
    architecturePlan: any
  ): string {
    return `You are VibeCodingAgent 2.0, an advanced autonomous AI agent with sophisticated reasoning capabilities.

CORE CAPABILITIES:
- Deep architectural thinking and pattern recognition
- Context-aware code generation with memory of previous interactions
- Quality-first development with built-in best practices
- Adaptive learning from user feedback and project evolution
- Tool-augmented reasoning for complex problem solving

AGENTIC REASONING PROCESS:
1. ANALYZE: Understand requirements deeply, considering context and constraints
2. ARCHITECT: Design optimal solution structure and patterns
3. PLAN: Create detailed implementation strategy with reasoning
4. GENERATE: Produce high-quality, production-ready code
5. VALIDATE: Self-assess output quality and suggest improvements
6. LEARN: Incorporate feedback for future interactions

TECHNICAL STANDARDS (2025):
- Modern ES2024+ JavaScript features
- CSS Grid, Flexbox, Container Queries for responsive design
- Web Components and Custom Elements when appropriate
- Progressive Enhancement and Core Web Vitals optimization
- Accessibility (WCAG 2.2) and Security best practices
- Performance-first approach with lazy loading and code splitting

ARCHITECTURAL PRINCIPLES:
- SOLID principles and clean architecture
- Component-based design with clear separation of concerns
- Reactive programming patterns where beneficial
- Test-driven development mindset
- Scalable and maintainable code structure

EXISTING PROJECT ANALYSIS:
${fileAnalyses.length ? `Files analyzed: ${fileAnalyses.map(fa => fa.filename).join(', ')}
Patterns detected: ${fileAnalyses.map(fa => fa.analysis?.patterns || []).flat().join(', ')}
Dependencies found: ${fileAnalyses.map(fa => fa.analysis?.dependencies || []).flat().join(', ')}` : 'Starting fresh project'}

ARCHITECTURAL PLAN:
${architecturePlan ? JSON.stringify(architecturePlan, null, 2) : 'Will determine architecture based on requirements'}

REASONING REQUIREMENTS:
- Explain architectural decisions and trade-offs
- Justify technology choices and patterns used
- Identify potential improvements and next steps
- Consider scalability, maintainability, and performance implications
- Suggest testing strategies and quality assurance approaches`;
  }

  private getContextualHistory(): string {
    const recentInteractions = this.context.previousInteractions.slice(-3);
    return recentInteractions.map(interaction => 
      `Previous: "${interaction.prompt}" -> ${interaction.response.plan.join(', ')}`
    ).join('\n');
  }

  private cleanResponseContent(content: string): string {
    content = content.trim();
    
    // Remove various markdown code block formats
    const patterns = [
      /^```json\s*/,
      /^```\s*/,
      /\s*```$/,
      /^`{1,3}/,
      /`{1,3}$/
    ];
    
    for (const pattern of patterns) {
      content = content.replace(pattern, '');
    }
    
    return content.trim();
  }

  private validateResponse(result: CodeGenerationResponse): void {
    if (!result.plan || !Array.isArray(result.plan)) {
      throw new Error("Invalid response: missing or invalid plan array");
    }

    if (!result.files || typeof result.files !== "object") {
      throw new Error("Invalid response: missing or invalid files object");
    }

    // Enhanced validation for new fields
    if (result.reasoning && typeof result.reasoning !== "string") {
      console.warn("Invalid reasoning field, removing");
      delete result.reasoning;
    }

    if (result.nextSteps && !Array.isArray(result.nextSteps)) {
      console.warn("Invalid nextSteps field, removing");
      delete result.nextSteps;
    }
  }

  public updateContext(updates: Partial<AgentContext>): void {
    this.context = { ...this.context, ...updates };
  }

  public addTool(tool: ToolCapability): void {
    this.tools.set(tool.name, tool);
  }

  public getMemory(key: string): any {
    return this.memory.get(key);
  }

  public setMemory(key: string, value: any): void {
    this.memory.set(key, value);
  }
}

// Global singleton instance
let globalGeminiAgent: AdvancedGeminiAgent | null = null;

// Factory function for backward compatibility
export async function generateCode(
  prompt: string,
  existingFiles?: Record<string, string>
): Promise<CodeGenerationResponse> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Google API key not found in environment variables");
  }

  // Create singleton instance for session continuity
  if (!globalGeminiAgent) {
    globalGeminiAgent = new AdvancedGeminiAgent(apiKey);
  }

  return globalGeminiAgent.generateCode(prompt, existingFiles);
}

// Advanced Gemini Agent class is exported by default above
