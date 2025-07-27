import { GoogleGenAI } from "@google/genai";
import { generateFallbackAboutHTML, generateFallbackFeaturesHTML, generateFallbackContactHTML } from './multipage-fallback';

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
    const themeColors = this.getThemeColors(appType);
    
    return {
      applicationType: appType,
      themeColors: themeColors,
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

  private getThemeColors(appType: string): {primary: string, secondary: string, accent: string} {
    const themes: Record<string, {primary: string, secondary: string, accent: string}> = {
      'Health/Fitness': { primary: '#4CAF50', secondary: '#2196F3', accent: '#81C784' },
      'E-commerce': { primary: '#FF9800', secondary: '#9C27B0', accent: '#FFB74D' },
      'Productivity': { primary: '#2196F3', secondary: '#3F51B5', accent: '#64B5F6' },
      'Social Platform': { primary: '#E91E63', secondary: '#9C27B0', accent: '#F06292' },
      'Financial Management': { primary: '#4CAF50', secondary: '#009688', accent: '#26A69A' },
      'Portfolio/Gallery': { primary: '#9C27B0', secondary: '#E91E63', accent: '#BA68C8' },
      'Educational Platform': { primary: '#2196F3', secondary: '#00BCD4', accent: '#4FC3F7' },
      'Analytics Dashboard': { primary: '#3F51B5', secondary: '#2196F3', accent: '#7986CB' },
      'Content Management': { primary: '#795548', secondary: '#FF7043', accent: '#A1887F' },
      'Booking System': { primary: '#607D8B', secondary: '#2196F3', accent: '#90A4AE' }
    };
    
    return themes[appType] || { primary: '#607D8B', secondary: '#2196F3', accent: '#90A4AE' };
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

DYNAMIC THEME COLOR SYSTEM:
Each application type must have a unique theme color scheme that reflects its purpose:
- Fitness/Health Apps → Green/Blue theme (#4CAF50, #2196F3)
- E-commerce Apps → Orange/Purple theme (#FF9800, #9C27B0)
- Productivity Apps → Blue/Indigo theme (#2196F3, #3F51B5)
- Social Apps → Pink/Purple theme (#E91E63, #9C27B0)
- Finance Apps → Green/Teal theme (#4CAF50, #009688)
- Creative Apps → Purple/Pink theme (#9C27B0, #E91E63)
- Educational Apps → Blue/Cyan theme (#2196F3, #00BCD4)
- Analytics Apps → Indigo/Blue theme (#3F51B5, #2196F3)
- Default Apps → Gray/Blue theme (#607D8B, #2196F3)

The theme colors should be applied to:
- Header background and accent elements
- Sidebar active states and highlights
- Primary buttons and interactive elements
- Progress bars and status indicators
- Active navigation states
- Form focus states and validation
- Use CSS custom properties for easy theme switching
` : `
ENHANCEMENT MODE: Improve existing application while maintaining consistency.
`}

Context from previous interactions: ${this.getContextualHistory()}

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "plan": ["step 1", "step 2", "step 3"],
  "files": {
    "index.html": "main page content here",
    "about.html": "about page content here",
    "features.html": "features page content here", 
    "contact.html": "contact page content here",
    "styles.css": "css content here", 
    "script.js": "js content with navigation handling here"
  },
  "reasoning": "explanation of approach and decisions",
  "architecture": "architectural decisions and patterns used",
  "nextSteps": ["future improvements", "next features to add"],
  "dependencies": ["required packages or libraries"],
  "testingStrategy": "approach for testing the generated code"
}`;

      const response = await this.generateWithRetry({
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

      // Enhanced content parsing with proper error handling
      try {
        content = this.cleanResponseContent(content);
      } catch (contentError) {
        console.warn("Content cleaning failed, using raw content:", contentError);
        content = String(content || "");
      }
      
      let result: CodeGenerationResponse;
      try {
        result = JSON.parse(content) as CodeGenerationResponse;
      } catch (parseError) {
        console.log("JSON parsing failed, generating fallback response");
        return this.generateFallbackResponse(prompt);
      }

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
      
      // Check for overload errors and generate inline fallback
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isOverloadError = errorMessage.includes('503') || 
                             errorMessage.includes('overloaded') || 
                             errorMessage.includes('UNAVAILABLE') ||
                             (error as any)?.status === 503;
      
      if (isOverloadError) {
        console.log("All retries failed, generating inline fallback response");
        return this.generateFallbackResponse(prompt);
      }
      
      // Also generate fallback for JSON parsing errors  
      if (errorMessage.includes('JSON') || errorMessage.includes('parse')) {
        console.log("JSON parsing error, generating fallback response");
        return this.generateFallbackResponse(prompt);
      }
      
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
🎯 YOUR MISSION: Create a COMPLETE, PROFESSIONAL MULTI-PAGE APPLICATION that demonstrates the full potential of the user's idea. Don't just build a basic example - build something that could be deployed and used in production. Think of yourself as a senior developer who has been given a project brief and needs to deliver a complete solution.

MULTI-PAGE REQUIREMENTS:
- Create multiple HTML pages (minimum 3-5 pages) that represent different sections of the application
- Include a main index.html as the homepage/dashboard
- Add logical pages like: about.html, features.html, settings.html, contact.html, etc. based on the application type
- Each page should maintain the same header/sidebar/main layout structure
- Add proper navigation between pages using relative links
- Include page-specific content and functionality for each page
- Ensure consistent styling and theme across all pages

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

  private cleanResponseContent(content: any): string {
    // Ensure we have a string to work with
    if (typeof content !== 'string') {
      content = String(content || '');
    }
    
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

  private generateFallbackResponse(prompt: string): CodeGenerationResponse {
    const appName = this.extractAppName(prompt);
    
    return {
      plan: [
        "AI service temporarily unavailable - fallback template generated",
        "Complete application architecture with header, sidebar, and main content",
        "Responsive design with modern CSS Grid layout",
        "Basic interactivity with retry functionality",
        "Professional styling with dynamic theme colors"
      ],
      files: {
        "index.html": this.generateFallbackHTML(prompt, appName),
        "about.html": generateFallbackAboutHTML(appName),
        "features.html": generateFallbackFeaturesHTML(appName),
        "contact.html": generateFallbackContactHTML(appName),
        "styles.css": this.generateFallbackCSS(),
        "script.js": this.generateFallbackJS()
      },
      reasoning: "Generated fallback template due to AI service overload. Maintains consistent architecture with proper layout structure.",
      architecture: "Uses CSS Grid for layout with semantic HTML5 structure. Responsive design with mobile-first approach.",
      nextSteps: ["Retry when service is available", "Customize content and features", "Add specific functionality"],
      dependencies: ["No external dependencies required"],
      testingStrategy: "Manual testing of responsive layout and basic interactivity"
    };
  }

  private extractAppName(prompt: string): string {
    const words = prompt.toLowerCase().split(' ');
    
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

  private generateFallbackHTML(prompt: string, appName: string): string {
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
                    <p class="intro-text">Request: "${prompt}"</p>
                    <div class="status-card">
                        <h3>⚠️ Service Status</h3>
                        <p>The AI service is temporarily overloaded. This fallback template maintains the proper application structure while you wait.</p>
                        <button class="retry-btn" onclick="window.location.reload()">Retry Generation</button>
                    </div>
                    
                    <div class="feature-preview">
                        <h3>Application Preview</h3>
                        <div class="feature-grid">
                            <div class="feature-card">
                                <h4>Professional Layout</h4>
                                <p>Modern CSS Grid with header, sidebar, and main content areas</p>
                            </div>
                            <div class="feature-card">
                                <h4>Responsive Design</h4>
                                <p>Mobile-first approach with adaptive layouts</p>
                            </div>
                            <div class="feature-card">
                                <h4>Interactive Elements</h4>
                                <p>Basic navigation and interactive components</p>
                            </div>
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

  private generateFallbackCSS(): string {
    return `:root {
  --primary-color: #3B82F6;
  --secondary-color: #1E40AF;
  --accent-color: #60A5FA;
  --bg-color: #F8FAFC;
  --text-color: #1E293B;
  --border-color: #E2E8F0;
  --warning-color: #F59E0B;
  --success-color: #10B981;
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
  border-radius: 6px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(255,255,255,0.15);
}

.app-layout {
  grid-area: layout;
  display: grid;
  grid-template-columns: 280px 1fr;
  grid-template-areas: "sidebar main";
}

.sidebar {
  grid-area: sidebar;
  background: white;
  border-right: 1px solid var(--border-color);
  padding: 1rem 0;
  box-shadow: 2px 0 4px rgba(0,0,0,0.05);
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
  border-left: 3px solid transparent;
}

.nav-item:hover, .nav-item.active {
  background-color: var(--accent-color);
  color: white;
  border-left-color: var(--primary-color);
}

.main-content {
  grid-area: main;
  padding: 2rem;
  overflow-y: auto;
}

.content-section h2 {
  margin-bottom: 1rem;
  color: var(--primary-color);
  font-size: 2rem;
}

.intro-text {
  font-style: italic;
  color: #666;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f0f4f8;
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

.status-card {
  background: linear-gradient(135deg, var(--warning-color), #F97316);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1.5rem 0;
  text-align: center;
}

.status-card h3 {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.retry-btn {
  background: white;
  color: var(--warning-color);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.feature-preview h3 {
  color: var(--primary-color);
  margin: 2rem 0 1rem 0;
  font-size: 1.5rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.feature-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-left: 4px solid var(--primary-color);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-card h4 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.feature-card p {
  color: #666;
  line-height: 1.5;
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
    text-align: center;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}

.about-content {
  display: grid;
  gap: 1.5rem;
  margin-top: 1rem;
}

.about-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-left: 4px solid var(--primary-color);
}

.about-card h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.about-card ul {
  list-style-position: inside;
  color: #666;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.feature-showcase {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-left: 4px solid var(--primary-color);
  position: relative;
}

.feature-showcase h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.feature-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--success-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
}

.contact-form {
  display: grid;
  gap: 1rem;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text-color);
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.submit-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.submit-btn:hover {
  transform: translateY(-2px);
}

.contact-info-section {
  display: grid;
  gap: 1rem;
}

.info-card {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

.info-card h4 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
  }
}`;
  }

  private generateFallbackJS(): string {
    return `document.addEventListener('DOMContentLoaded', function() {
  console.log('🔄 Fallback mode activated - Application structure loaded');
  
  // Add enhanced navigation interactivity
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all items
      navItems.forEach(nav => nav.classList.remove('active'));
      
      // Add active class to clicked item
      this.classList.add('active');
      
      // Visual feedback
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
      
      console.log('📍 Navigation:', this.textContent);
    });
  });
  
  // Add floating retry notification
  function showRetryNotification() {
    const notification = document.createElement('div');
    notification.innerHTML = \`
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      ">
        🔄 Click to retry AI generation
      </div>
    \`;
    
    const retryBtn = notification.firstElementChild;
    retryBtn.addEventListener('click', () => {
      window.location.reload();
    });
    
    retryBtn.addEventListener('mouseenter', () => {
      retryBtn.style.transform = 'translateY(-2px)';
      retryBtn.style.boxShadow = '0 12px 35px rgba(0,0,0,0.2)';
    });
    
    retryBtn.addEventListener('mouseleave', () => {
      retryBtn.style.transform = '';
      retryBtn.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    });
    
    document.body.appendChild(notification);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 10000);
  }
  
  // Show retry notification after 2 seconds
  setTimeout(showRetryNotification, 2000);
  
  // Add pulse animation to retry button
  const retryBtn = document.querySelector('.retry-btn');
  if (retryBtn) {
    setInterval(() => {
      retryBtn.style.transform = 'scale(1.05)';
      setTimeout(() => {
        retryBtn.style.transform = '';
      }, 200);
    }, 3000);
  }
  
  console.log('✅ Fallback template ready - Enhanced UI with retry capabilities');
  console.log('💡 This template demonstrates the complete application structure');
});`;
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

  private async generateWithRetry(requestParams: any, maxRetries: number = 3): Promise<any> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Gemini API attempt ${attempt}/${maxRetries}`);
        return await this.genAI.models.generateContent(requestParams);
      } catch (error: any) {
        lastError = error;
        
        // Check if it's a rate limit or overload error
        const isRetryableError = error.status === 503 || error.status === 429 || 
                                (error.message && error.message.includes('overloaded')) ||
                                (error.error && error.error.code === 503) ||
                                (error.error && error.error.message && error.error.message.includes('overloaded'));
        
        if (isRetryableError) {
          
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
            console.log(`API overloaded, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        
        // For non-retryable errors, throw immediately
        if (!isRetryableError) {
          throw error;
        }
      }
    }
    
    // If all retries failed, return a fallback response
    console.warn(`All ${maxRetries} attempts failed, generating fallback response`);
    return this.generateFallbackResponse();
  }

  private generateFallbackResponse(): any {
    return {
      text: () => JSON.stringify({
        plan: [
          "The AI service is temporarily unavailable",
          "Please try again in a few moments",
          "A basic template will be generated as fallback"
        ],
        files: {
          "index.html": this.generateFallbackHTML(),
          "styles.css": this.generateFallbackCSS(),
          "script.js": this.generateFallbackJS()
        },
        reasoning: "Generated fallback response due to API unavailability",
        architecture: "Basic HTML5 structure with modern layout",
        nextSteps: ["Retry when API service is restored"],
        dependencies: [],
        testingStrategy: "Manual testing recommended"
      })
    };
  }

  private generateFallbackHTML(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <h1 class="app-title">Your Application</h1>
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
                    <h2>Welcome to Your Application</h2>
                    <p>The AI service is temporarily unavailable. This is a basic template.</p>
                    <div class="feature-grid">
                        <div class="feature-card">
                            <h3>Feature 1</h3>
                            <p>Your main application features will appear here.</p>
                        </div>
                        <div class="feature-card">
                            <h3>Feature 2</h3>
                            <p>Try again in a few moments for full functionality.</p>
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

  private generateFallbackCSS(): string {
    return `:root {
  --primary-color: #2196F3;
  --secondary-color: #1976D2;
  --accent-color: #64B5F6;
  --bg-color: #f5f5f5;
  --text-color: #333;
  --border-color: #ddd;
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

  private generateFallbackJS(): string {
    return `document.addEventListener('DOMContentLoaded', function() {
  console.log('Application loaded - Fallback mode');
  
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
  
  // Add retry mechanism notification
  const retryNotification = document.createElement('div');
  retryNotification.style.cssText = \`
    position: fixed;
    top: 20px;
    right: 20px;
    background: #FFA726;
    color: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    max-width: 300px;
  \`;
  retryNotification.innerHTML = \`
    <strong>Service Notice</strong><br>
    The AI service is temporarily unavailable. Please try again in a few moments for full functionality.
  \`;
  
  document.body.appendChild(retryNotification);
  
  // Auto-hide notification after 8 seconds
  setTimeout(() => {
    retryNotification.style.opacity = '0';
    retryNotification.style.transition = 'opacity 0.5s';
    setTimeout(() => retryNotification.remove(), 500);
  }, 8000);
});`;
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
