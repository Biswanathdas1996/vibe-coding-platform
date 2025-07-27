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
    const isInitialPrompt = this.context.previousInteractions.length === 0;
    const appType = this.detectApplicationType(requirements);
    const coreFeatures = this.inferCoreFeatures(requirements, appType);
    
    return {
      applicationType: appType,
      coreFeatures: coreFeatures,
      layers: ['Presentation Layer', 'Business Logic Layer', 'Data Access Layer', 'Storage Layer'],
      patterns: this.recommendPatterns(requirements),
      components: this.identifyComponents(requirements, coreFeatures),
      dataFlow: 'Reactive with State Management',
      uiSections: this.planUISections(requirements, coreFeatures),
      dataModels: this.identifyDataModels(requirements, coreFeatures),
      userFlows: this.planUserFlows(requirements, coreFeatures),
      featureSet: isInitialPrompt ? 'Complete Application' : 'Incremental Enhancement',
      scalabilityConsiderations: this.assessScalability(requirements),
      performanceOptimizations: this.suggestPerformanceOptimizations(appType),
      accessibilityFeatures: this.planAccessibilityFeatures(),
      securityConsiderations: this.identifySecurityNeeds(requirements)
    };
  }

  private detectApplicationType(requirements: string): string {
    const req = requirements.toLowerCase();
    if (req.includes('todo') || req.includes('task') || req.includes('project management')) return 'Productivity';
    if (req.includes('dashboard') || req.includes('analytics') || req.includes('chart')) return 'Analytics Dashboard';
    if (req.includes('shop') || req.includes('store') || req.includes('commerce') || req.includes('cart')) return 'E-commerce';
    if (req.includes('blog') || req.includes('cms') || req.includes('content')) return 'Content Management';
    if (req.includes('portfolio') || req.includes('showcase') || req.includes('gallery')) return 'Portfolio/Gallery';
    if (req.includes('social') || req.includes('chat') || req.includes('community')) return 'Social Platform';
    if (req.includes('booking') || req.includes('reservation') || req.includes('appointment')) return 'Booking System';
    if (req.includes('learning') || req.includes('course') || req.includes('quiz')) return 'Educational Platform';
    if (req.includes('finance') || req.includes('budget') || req.includes('expense')) return 'Financial Management';
    if (req.includes('health') || req.includes('fitness') || req.includes('tracker')) return 'Health/Fitness';
    return 'Custom Application';
  }

  private inferCoreFeatures(requirements: string, appType: string): string[] {
    const baseFeatures = ['Responsive Design', 'Data Persistence', 'User Interface', 'Error Handling'];
    
    const typeFeatures: Record<string, string[]> = {
      'Productivity': ['Task Creation', 'Task Management', 'Categories', 'Priorities', 'Search & Filter', 'Progress Tracking', 'Data Export'],
      'Analytics Dashboard': ['Data Visualization', 'Charts & Graphs', 'Real-time Updates', 'Customizable Widgets', 'Dark Mode', 'Notifications'],
      'E-commerce': ['Product Catalog', 'Shopping Cart', 'Checkout Process', 'User Accounts', 'Order History', 'Product Reviews', 'Payment Integration'],
      'Content Management': ['Content Creation', 'Categories & Tags', 'Comments System', 'Search Functionality', 'Author Profiles', 'Content Scheduling'],
      'Portfolio/Gallery': ['Project Showcase', 'Image Gallery', 'Contact Form', 'Skills Section', 'Testimonials', 'Resume Download', 'Animations'],
      'Social Platform': ['User Profiles', 'Posts & Comments', 'Like System', 'Friend Connections', 'Messaging', 'Activity Feed', 'Notifications'],
      'Booking System': ['Calendar View', 'Appointment Scheduling', 'Availability Management', 'Confirmation System', 'Reminders', 'User Accounts'],
      'Educational Platform': ['Course Catalog', 'Lesson Management', 'Quiz System', 'Progress Tracking', 'Certificates', 'User Profiles'],
      'Financial Management': ['Expense Tracking', 'Budget Planning', 'Category Management', 'Reports & Analytics', 'Goal Setting', 'Data Export'],
      'Health/Fitness': ['Activity Tracking', 'Goal Setting', 'Progress Visualization', 'Calendar Integration', 'Statistics', 'Personal Records']
    };

    return [...baseFeatures, ...(typeFeatures[appType] || ['Custom Features', 'Interactive UI', 'Data Management'])];
  }

  private planUISections(requirements: string, features: string[]): string[] {
    const sections = ['Header/Navigation', 'Main Content Area', 'Footer'];
    
    if (features.includes('User Accounts') || features.includes('User Profiles')) {
      sections.push('User Profile Section', 'Authentication Forms');
    }
    if (features.includes('Search')) sections.push('Search Interface');
    if (features.includes('Categories')) sections.push('Category Navigation');
    if (features.includes('Dashboard')) sections.push('Dashboard Widgets');
    if (features.includes('Settings')) sections.push('Settings Panel');
    if (features.includes('Notifications')) sections.push('Notification Center');
    
    return sections;
  }

  private identifyDataModels(requirements: string, features: string[]): string[] {
    const models = [];
    
    if (features.some(f => f.includes('Task'))) models.push('Task', 'Category', 'Priority');
    if (features.some(f => f.includes('User'))) models.push('User', 'UserPreferences');
    if (features.some(f => f.includes('Product'))) models.push('Product', 'Order', 'Cart');
    if (features.some(f => f.includes('Content') || f.includes('Post'))) models.push('Post', 'Comment', 'Tag');
    if (features.some(f => f.includes('Project'))) models.push('Project', 'Skill', 'Testimonial');
    if (features.some(f => f.includes('Booking'))) models.push('Appointment', 'TimeSlot', 'Service');
    
    return models.length > 0 ? models : ['DataModel', 'UserData', 'AppState'];
  }

  private planUserFlows(requirements: string, features: string[]): string[] {
    const flows = ['Application Launch', 'Main Navigation'];
    
    if (features.includes('Task Creation')) flows.push('Create New Task', 'Edit Task', 'Complete Task');
    if (features.includes('User Accounts')) flows.push('User Registration', 'User Login', 'Profile Management');
    if (features.includes('Shopping Cart')) flows.push('Browse Products', 'Add to Cart', 'Checkout Process');
    if (features.includes('Content Creation')) flows.push('Create Content', 'Edit Content', 'Publish Content');
    if (features.includes('Search')) flows.push('Search and Filter', 'View Results');
    
    return flows;
  }

  private suggestPerformanceOptimizations(appType: string): string[] {
    const baseOptimizations = ['Lazy Loading', 'Code Splitting', 'Image Optimization', 'Caching Strategy'];
    
    const typeOptimizations: Record<string, string[]> = {
      'Analytics Dashboard': ['Chart Virtualization', 'Data Streaming', 'Background Updates'],
      'E-commerce': ['Product Image Lazy Loading', 'Search Debouncing', 'Wishlist Caching'],
      'Content Management': ['Content Pagination', 'Search Indexing', 'Media Optimization'],
      'Portfolio/Gallery': ['Image Lazy Loading', 'Animation Optimization', 'Progressive Loading']
    };

    return [...baseOptimizations, ...(typeOptimizations[appType] || ['Component Optimization'])];
  }

  private planAccessibilityFeatures(): string[] {
    return [
      'ARIA Labels and Roles',
      'Keyboard Navigation Support',
      'Screen Reader Compatibility',
      'High Contrast Support',
      'Focus Management',
      'Alt Text for Images',
      'Semantic HTML Structure'
    ];
  }

  private identifySecurityNeeds(requirements: string): string[] {
    const security = ['Input Validation', 'XSS Prevention', 'CSRF Protection'];
    
    if (requirements.includes('user') || requirements.includes('login')) {
      security.push('Authentication Security', 'Password Hashing', 'Session Management');
    }
    if (requirements.includes('payment') || requirements.includes('commerce')) {
      security.push('Payment Security', 'PCI Compliance', 'Secure Transmission');
    }
    
    return security;
  }

  private identifyComponents(requirements: string, features: string[]): string[] {
    const components = ['App Container', 'Navigation Component', 'Main Layout'];
    
    if (features.includes('Task')) components.push('TaskList', 'TaskItem', 'TaskForm');
    if (features.includes('User')) components.push('UserProfile', 'AuthenticationForm');
    if (features.includes('Product')) components.push('ProductCard', 'ProductList', 'ShoppingCart');
    if (features.includes('Chart')) components.push('ChartComponent', 'Dashboard', 'Widget');
    if (features.includes('Form')) components.push('FormComponent', 'InputValidation');
    if (features.includes('Modal')) components.push('ModalDialog', 'Confirmation');
    if (features.includes('Search')) components.push('SearchBar', 'FilterPanel');
    
    components.push('LoadingState', 'ErrorBoundary', 'NotificationSystem');
    
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

      const isInitialPrompt = fileAnalyses.length === 0 && this.context.previousInteractions.length === 0;
      
      const fullPrompt = `${systemPrompt}

User request: ${prompt}

${isInitialPrompt ? `
🚀 CRITICAL: This is the FIRST PROMPT for creating a new application. Create a COMPLETE, COMPREHENSIVE application with ALL features that would make this production-ready.

MANDATORY HTML LAYOUT STRUCTURE:
- Header with app name and navigation elements
- Sidebar with main navigation menu
- Main content area for primary features
- Use CSS Grid layout with responsive design
- Modern HTML5 semantic structure

COMPREHENSIVE FEATURE REQUIREMENTS:
Build ALL logical features for this application type. For example:
- Fitness Tracker → Workout logging, exercise library, progress charts, goal tracking, calendar view, social features, data export
- Task Manager → Task creation/editing, categories, priorities, search/filter, progress tracking, team collaboration, notifications
- E-commerce → Product catalog, cart, checkout, user accounts, order history, reviews, wishlist, recommendations
- Dashboard → Multiple widgets, data visualization, real-time updates, customization, dark mode, notifications
` : `
ENHANCEMENT MODE: Improve existing application while maintaining consistency.
`}

Context from previous interactions: ${this.getContextualHistory()}

IMPORTANT: Return ONLY valid JSON in this exact format:
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
    const isInitialPrompt = fileAnalyses.length === 0 && this.context.previousInteractions.length === 0;
    
    return `You are VibeCodingAgent 2.0, an advanced autonomous AI agent specialized in creating complete, production-ready web applications.

${isInitialPrompt ? `
🚀 INITIAL APPLICATION CREATION MODE:
You are receiving the FIRST PROMPT for a new application. This is your opportunity to create a COMPLETE, FULLY-FUNCTIONAL application that exceeds expectations.

COMPREHENSIVE APPLICATION STRATEGY:
1. VISION ANALYSIS: Extract the complete application concept from the user's description
2. FEATURE EXPANSION: Infer and implement ALL logical features that would make this a complete application
3. ARCHITECTURE DESIGN: Create a robust, scalable application architecture
4. COMPLETE IMPLEMENTATION: Build every component needed for a production-ready application
5. USER EXPERIENCE: Ensure intuitive navigation, responsive design, and excellent UX
6. FUTURE-PROOFING: Include extensibility points and modern best practices

WHAT TO BUILD FOR INITIAL PROMPT:
- Complete application with ALL core features (not just a basic example)
- Multiple interconnected pages/sections if applicable
- Full CRUD operations where relevant
- Data persistence (localStorage, sessionStorage, or mock backend)
- Responsive design that works on all devices
- Modern UI with professional styling
- Interactive features and smooth animations
- Error handling and user feedback
- Loading states and empty states
- Search, filtering, sorting where applicable
- User preferences and settings
- Navigation system (menus, breadcrumbs, etc.)
- Forms with validation
- Modal dialogs and confirmations
- Real-time features (where applicable)
- Accessibility features
- Performance optimizations

MANDATORY UI LAYOUT STRUCTURE FOR ALL APPLICATIONS:
- HEADER: Must include app name/title and navigation elements
- SIDEBAR: Must include main navigation menu with organized sections
- MAIN CONTENT AREA: Primary application content with proper spacing
- Use modern HTML5 semantic elements (header, nav, main, aside, section, article)
- Implement CSS Grid or Flexbox for responsive layout
- Ensure sidebar can collapse/expand on mobile devices
- Header should be fixed or sticky for better navigation
- Modern design with consistent spacing, typography, and color scheme

FEATURE INFERENCE EXAMPLES:
- "Todo app" → Include categories, priorities, due dates, search, filters, bulk operations, data export
- "Dashboard" → Include charts, widgets, customization, dark mode, notifications, user profile
- "E-commerce" → Include product catalog, cart, checkout, user accounts, order history, reviews
- "Blog" → Include posts, categories, tags, comments, search, author profiles, related posts
- "Portfolio" → Include projects, skills, contact form, testimonials, resume download, animations

APPLICATION TYPES TO RECOGNIZE:
- Business Applications: CRM, ERP, Project Management, Analytics
- Consumer Applications: Social Media, E-commerce, Entertainment, Productivity
- Educational: Learning Management, Courses, Quizzes, Progress Tracking
- Creative: Portfolio, Gallery, Design Tools, Content Creation
- Technical: Developer Tools, APIs, Documentation, Monitoring
` : `
🔧 ITERATIVE ENHANCEMENT MODE:
You are enhancing an existing application. Focus on incremental improvements while maintaining consistency.
`}

CORE CAPABILITIES:
- Deep architectural thinking and pattern recognition
- Complete application development from single descriptions
- Context-aware code generation with memory of previous interactions
- Quality-first development with built-in best practices
- Advanced feature inference and implementation
- Tool-augmented reasoning for complex problem solving

AGENTIC REASONING PROCESS:
1. ANALYZE: Understand the complete application vision and all implicit requirements
2. ARCHITECT: Design optimal solution structure for the entire application
3. EXPAND: Infer ALL logical features that would make this a complete, professional application
4. PLAN: Create detailed implementation strategy covering all components
5. GENERATE: Produce comprehensive, production-ready code for the full application
6. VALIDATE: Self-assess completeness and suggest future enhancements
7. LEARN: Incorporate patterns for future application development

TECHNICAL STANDARDS (2025):
- Modern ES2024+ JavaScript with advanced patterns
- CSS Grid, Flexbox, Container Queries for responsive design
- Web Components and Custom Elements where beneficial
- Progressive Enhancement and Core Web Vitals optimization
- Accessibility (WCAG 2.2) and Security best practices
- Performance-first approach with lazy loading and code splitting
- Modern CSS features (custom properties, logical properties, cascade layers)
- Advanced JavaScript patterns (modules, workers, streaming)

MANDATORY HTML5 LAYOUT STRUCTURE:
All generated applications MUST follow this exact layout pattern:

HTML STRUCTURE REQUIREMENTS:
- Header with app name and navigation elements
- Sidebar with main navigation menu
- Main content area for primary application features
- Use semantic HTML5 elements (header, nav, main, aside)
- App container with proper CSS Grid layout
- Mobile-responsive design with collapsible sidebar

CSS LAYOUT REQUIREMENTS:
- Use CSS Grid for main layout with header/sidebar/main areas
- Sidebar must be collapsible on mobile (under 768px)
- Header should be sticky or fixed position
- Responsive design with mobile-first approach
- Modern spacing and typography
- Consistent color scheme and visual hierarchy
- Smooth animations for interactive elements
- Professional styling with proper visual hierarchy

ARCHITECTURAL PRINCIPLES:
- SOLID principles and clean architecture
- Component-based design with clear separation of concerns
- Reactive programming patterns and state management
- Progressive Web App capabilities where applicable
- Microinteractions and smooth user experience
- Scalable and maintainable code structure
- Data-driven development with proper state management

APPLICATION COMPLETENESS CHECKLIST:
✅ Multiple interconnected features
✅ Full user interface with navigation
✅ Data management (CRUD operations)
✅ Responsive design for all screen sizes
✅ Interactive elements and feedback
✅ Error handling and validation
✅ Loading states and empty states
✅ Search and filtering capabilities
✅ User preferences and customization
✅ Modern styling with smooth animations
✅ Accessibility features
✅ Performance optimizations
✅ Code organization and modularity

EXISTING PROJECT ANALYSIS:
${fileAnalyses.length ? `Files analyzed: ${fileAnalyses.map(fa => fa.filename).join(', ')}
Patterns detected: ${fileAnalyses.map(fa => fa.analysis?.patterns || []).flat().join(', ')}
Dependencies found: ${fileAnalyses.map(fa => fa.analysis?.dependencies || []).flat().join(', ')}` : 'Creating new comprehensive application from scratch'}

ARCHITECTURAL PLAN:
${architecturePlan ? JSON.stringify(architecturePlan, null, 2) : 'Will design complete application architecture based on requirements'}

${isInitialPrompt ? `
🎯 YOUR MISSION: Create a COMPLETE, PROFESSIONAL APPLICATION that demonstrates the full potential of the user's idea. Don't just build a basic example - build something that could be deployed and used in production. Think of yourself as a senior developer who has been given a project brief and needs to deliver a complete solution.

REMEMBER: This is the user's first impression. Exceed their expectations by delivering more than they asked for while staying true to their core vision.
` : `
ENHANCEMENT FOCUS: Build upon the existing foundation while maintaining consistency and adding meaningful improvements.
`}

REASONING REQUIREMENTS:
- Explain architectural decisions and trade-offs for the complete application
- Justify technology choices and patterns used across all features
- Identify potential improvements and logical next steps
- Consider scalability, maintainability, and performance implications
- Suggest comprehensive testing strategies and quality assurance approaches
- Document the complete feature set and how components work together`;
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
