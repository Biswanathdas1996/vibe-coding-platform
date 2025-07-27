import { GoogleGenAI } from "@google/genai";
// Fallback imports removed - only AI-generated implementation plans supported

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

export interface PageRequirement {
  name: string;
  title: string;
  purpose: string;
  content: PageContent;
  features: string[];
}

export interface PageContent {
  sections: ContentSection[];
  components: string[];
  interactivity: string[];
}

export interface ContentSection {
  type: string;
  title: string;
  content: string;
  priority: number;
}

// Advanced Agentic AI Architecture with MCP-like capabilities
export class AdvancedGeminiAgent {
  private genAI: GoogleGenAI;
  private context: AgentContext;
  private tools: Map<string, ToolCapability>;
  private memory: Map<string, any>;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenAI(apiKey);
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

  // New intelligent page analysis system
  private analyzePromptForPages(prompt: string): { pages: PageRequirement[], appName: string } {
    const req = prompt.toLowerCase();
    const appName = this.extractAppName(prompt);
    const pages: PageRequirement[] = [];

    // Always include home page
    pages.push({
      name: 'index',
      title: 'Home',
      purpose: 'Main landing page with overview and navigation',
      content: this.generateHomeContent(prompt, appName),
      features: ['navigation', 'hero-section', 'overview']
    });

    // Analyze prompt for specific page requirements
    if (req.includes('about') || req.includes('company') || req.includes('team') || req.includes('story')) {
      pages.push({
        name: 'about',
        title: 'About',
        purpose: 'Information about the company, team, or project',
        content: this.generateAboutContent(prompt, appName),
        features: ['company-info', 'team-section', 'mission-vision']
      });
    }

    if (req.includes('contact') || req.includes('support') || req.includes('reach')) {
      pages.push({
        name: 'contact',
        title: 'Contact',
        purpose: 'Contact information and communication forms',
        content: this.generateContactContent(prompt, appName),
        features: ['contact-form', 'contact-info', 'social-links']
      });
    }

    if (req.includes('service') || req.includes('feature') || req.includes('offering')) {
      pages.push({
        name: 'services',
        title: 'Services',
        purpose: 'Detailed information about services or features offered',
        content: this.generateServicesContent(prompt, appName),
        features: ['service-cards', 'pricing', 'feature-comparison']
      });
    }

    if (req.includes('product') || req.includes('item') || req.includes('catalog')) {
      pages.push({
        name: 'products',
        title: 'Products',
        purpose: 'Product catalog and detailed product information',
        content: this.generateProductsContent(prompt, appName),
        features: ['product-grid', 'filters', 'search', 'categories']
      });
    }

    if (req.includes('blog') || req.includes('news') || req.includes('article') || req.includes('post')) {
      pages.push({
        name: 'blog',
        title: 'Blog',
        purpose: 'Blog posts, articles, and news updates',
        content: this.generateBlogContent(prompt, appName),
        features: ['article-list', 'categories', 'search', 'pagination']
      });
    }

    if (req.includes('dashboard') || req.includes('admin') || req.includes('control')) {
      pages.push({
        name: 'dashboard',
        title: 'Dashboard',
        purpose: 'Administrative interface and control panel',
        content: this.generateDashboardContent(prompt, appName),
        features: ['metrics', 'charts', 'quick-actions', 'notifications']
      });
    }

    if (req.includes('portfolio') || req.includes('gallery') || req.includes('showcase')) {
      pages.push({
        name: 'portfolio',
        title: 'Portfolio',
        purpose: 'Showcase of work, projects, or achievements',
        content: this.generatePortfolioContent(prompt, appName),
        features: ['project-grid', 'image-gallery', 'project-details']
      });
    }

    if (req.includes('pricing') || req.includes('plan') || req.includes('subscription')) {
      pages.push({
        name: 'pricing',
        title: 'Pricing',
        purpose: 'Pricing plans and subscription options',
        content: this.generatePricingContent(prompt, appName),
        features: ['pricing-table', 'feature-comparison', 'cta-buttons']
      });
    }

    // If no specific pages mentioned, add default essential pages
    if (pages.length === 1) {
      pages.push(
        {
          name: 'features',
          title: 'Features',
          purpose: 'Key features and capabilities',
          content: this.generateFeaturesContent(prompt, appName),
          features: ['feature-grid', 'benefits', 'demonstrations']
        },
        {
          name: 'contact',
          title: 'Contact',
          purpose: 'Contact information and forms',
          content: this.generateContactContent(prompt, appName),
          features: ['contact-form', 'contact-info']
        }
      );
    }

    return { pages, appName };
  }

  private extractAppName(prompt: string): string {
    // Extract application name from prompt
    const patterns = [
      /(?:create|build|make)(?:\s+a|\s+an)?\s+(.+?)(?:\s+(?:app|application|website|platform|system))/i,
      /(?:^|\s)(.+?)(?:\s+(?:app|application|website|platform|system))/i,
      /for\s+(.+?)(?:\s|$)/i
    ];

    for (const pattern of patterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        return match[1].trim().replace(/\b\w/g, l => l.toUpperCase());
      }
    }

    return 'Application';
  }

  // Content generation methods for different page types
  private generateHomeContent(prompt: string, appName: string): PageContent {
    const appType = this.detectApplicationType(prompt);
    return {
      sections: [
        {
          type: 'hero',
          title: `Welcome to ${appName}`,
          content: this.generateHeroContent(prompt, appType),
          priority: 1
        },
        {
          type: 'features',
          title: 'Key Features',
          content: this.generateFeatureOverview(prompt, appType),
          priority: 2
        },
        {
          type: 'cta',
          title: 'Get Started',
          content: this.generateCallToAction(appType),
          priority: 3
        }
      ],
      components: ['hero-banner', 'feature-cards', 'navigation', 'footer'],
      interactivity: ['smooth-scroll', 'hover-effects', 'button-animations']
    };
  }

  private generateAboutContent(prompt: string, appName: string): PageContent {
    return {
      sections: [
        {
          type: 'intro',
          title: `About ${appName}`,
          content: `Learn more about ${appName} and our mission to provide exceptional solutions.`,
          priority: 1
        },
        {
          type: 'story',
          title: 'Our Story',
          content: 'Founded with a vision to innovate and create meaningful impact in the industry.',
          priority: 2
        },
        {
          type: 'team',
          title: 'Our Team',
          content: 'Meet the dedicated professionals behind our success.',
          priority: 3
        }
      ],
      components: ['intro-section', 'story-timeline', 'team-grid'],
      interactivity: ['parallax-scroll', 'team-member-cards', 'animated-counters']
    };
  }

  private generateContactContent(prompt: string, appName: string): PageContent {
    return {
      sections: [
        {
          type: 'header',
          title: 'Contact Us',
          content: `Get in touch with the ${appName} team. We'd love to hear from you.`,
          priority: 1
        },
        {
          type: 'form',
          title: 'Send a Message',
          content: 'Fill out the form below and we\'ll get back to you as soon as possible.',
          priority: 2
        },
        {
          type: 'info',
          title: 'Contact Information',
          content: 'Find alternative ways to reach us.',
          priority: 3
        }
      ],
      components: ['contact-form', 'contact-info', 'map-embed'],
      interactivity: ['form-validation', 'success-messages', 'interactive-map']
    };
  }

  private generateServicesContent(prompt: string, appName: string): PageContent {
    return {
      sections: [
        {
          type: 'overview',
          title: 'Our Services',
          content: `Discover the comprehensive range of services offered by ${appName}.`,
          priority: 1
        },
        {
          type: 'service-list',
          title: 'What We Offer',
          content: 'Professional services tailored to meet your specific needs.',
          priority: 2
        },
        {
          type: 'benefits',
          title: 'Why Choose Us',
          content: 'The advantages of working with our experienced team.',
          priority: 3
        }
      ],
      components: ['service-cards', 'pricing-table', 'testimonials'],
      interactivity: ['service-tabs', 'pricing-calculator', 'testimonial-carousel']
    };
  }

  private generateProductsContent(prompt: string, appName: string): PageContent {
    return {
      sections: [
        {
          type: 'catalog',
          title: 'Product Catalog',
          content: `Browse our extensive collection of products from ${appName}.`,
          priority: 1
        },
        {
          type: 'categories',
          title: 'Categories',
          content: 'Find products organized by category for easy browsing.',
          priority: 2
        },
        {
          type: 'featured',
          title: 'Featured Products',
          content: 'Check out our most popular and recommended items.',
          priority: 3
        }
      ],
      components: ['product-grid', 'category-filters', 'search-bar', 'product-cards'],
      interactivity: ['filter-system', 'product-search', 'quick-view', 'shopping-cart']
    };
  }

  private generateBlogContent(prompt: string, appName: string): PageContent {
    return {
      sections: [
        {
          type: 'latest',
          title: 'Latest Posts',
          content: `Stay updated with the latest news and insights from ${appName}.`,
          priority: 1
        },
        {
          type: 'categories',
          title: 'Post Categories',
          content: 'Explore content organized by topic and interest.',
          priority: 2
        },
        {
          type: 'featured',
          title: 'Featured Articles',
          content: 'Don\'t miss our most popular and trending articles.',
          priority: 3
        }
      ],
      components: ['article-grid', 'category-tags', 'search-functionality'],
      interactivity: ['infinite-scroll', 'tag-filtering', 'social-sharing']
    };
  }

  private generateDashboardContent(prompt: string, appName: string): PageContent {
    return {
      sections: [
        {
          type: 'metrics',
          title: 'Key Metrics',
          content: 'Monitor important performance indicators and statistics.',
          priority: 1
        },
        {
          type: 'charts',
          title: 'Analytics',
          content: 'Visualize data trends and patterns with interactive charts.',
          priority: 2
        },
        {
          type: 'actions',
          title: 'Quick Actions',
          content: 'Access frequently used functions and tools.',
          priority: 3
        }
      ],
      components: ['metric-cards', 'chart-widgets', 'action-buttons', 'data-tables'],
      interactivity: ['real-time-updates', 'interactive-charts', 'data-filtering']
    };
  }

  private generatePortfolioContent(prompt: string, appName: string): PageContent {
    return {
      sections: [
        {
          type: 'showcase',
          title: 'Portfolio Showcase',
          content: `Explore the creative work and projects from ${appName}.`,
          priority: 1
        },
        {
          type: 'projects',
          title: 'Featured Projects',
          content: 'Highlighting our most successful and innovative projects.',
          priority: 2
        },
        {
          type: 'skills',
          title: 'Skills & Expertise',
          content: 'The technologies and methodologies we specialize in.',
          priority: 3
        }
      ],
      components: ['project-gallery', 'skill-bars', 'project-details'],
      interactivity: ['image-lightbox', 'project-filters', 'skill-animations']
    };
  }

  private generatePricingContent(prompt: string, appName: string): PageContent {
    return {
      sections: [
        {
          type: 'plans',
          title: 'Pricing Plans',
          content: `Choose the perfect plan for your needs with ${appName}.`,
          priority: 1
        },
        {
          type: 'comparison',
          title: 'Feature Comparison',
          content: 'Compare features across different pricing tiers.',
          priority: 2
        },
        {
          type: 'faq',
          title: 'Pricing FAQ',
          content: 'Common questions about our pricing and billing.',
          priority: 3
        }
      ],
      components: ['pricing-table', 'feature-matrix', 'faq-accordion'],
      interactivity: ['plan-toggle', 'calculator', 'expandable-faq']
    };
  }

  private generateFeaturesContent(prompt: string, appName: string): PageContent {
    return {
      sections: [
        {
          type: 'overview',
          title: 'Feature Overview',
          content: `Discover all the powerful features that make ${appName} exceptional.`,
          priority: 1
        },
        {
          type: 'detailed',
          title: 'Detailed Features',
          content: 'In-depth look at each feature and its benefits.',
          priority: 2
        },
        {
          type: 'benefits',
          title: 'Benefits',
          content: 'How these features translate to real value for you.',
          priority: 3
        }
      ],
      components: ['feature-grid', 'benefit-cards', 'demo-videos'],
      interactivity: ['feature-tabs', 'demo-modals', 'benefit-animations']
    };
  }

  private generateHeroContent(prompt: string, appType: string): string {
    const typeMessages: Record<string, string> = {
      'E-commerce': 'Shop with confidence and discover amazing products at unbeatable prices.',
      'Productivity': 'Boost your productivity and achieve more with our powerful tools.',
      'Portfolio/Gallery': 'Showcase your creativity and share your amazing work with the world.',
      'Social Platform': 'Connect, share, and engage with a vibrant community.',
      'Educational Platform': 'Learn, grow, and achieve your educational goals.',
      'Health/Fitness': 'Transform your health and fitness journey with expert guidance.',
      'Financial Management': 'Take control of your finances and build a secure future.',
      'Analytics Dashboard': 'Make data-driven decisions with powerful analytics.',
      'Content Management': 'Create, manage, and publish content with ease.',
      'Booking System': 'Schedule appointments and manage bookings effortlessly.'
    };
    return typeMessages[appType] || 'Welcome to our innovative platform designed to meet your needs.';
  }

  private generateFeatureOverview(prompt: string, appType: string): string {
    const features: Record<string, string[]> = {
      'E-commerce': ['Secure Payment Processing', 'Product Catalog Management', 'Order Tracking', 'Customer Reviews'],
      'Productivity': ['Task Management', 'Team Collaboration', 'Time Tracking', 'Progress Analytics'],
      'Portfolio/Gallery': ['Image Gallery', 'Project Showcase', 'Client Testimonials', 'Contact Integration'],
      'Social Platform': ['User Profiles', 'Content Sharing', 'Real-time Chat', 'Community Groups'],
      'Educational Platform': ['Course Creation', 'Progress Tracking', 'Interactive Quizzes', 'Certificate Generation'],
      'Health/Fitness': ['Workout Plans', 'Progress Tracking', 'Nutrition Guides', 'Goal Setting'],
      'Financial Management': ['Expense Tracking', 'Budget Planning', 'Investment Monitoring', 'Financial Reports'],
      'Analytics Dashboard': ['Real-time Charts', 'Data Visualization', 'Custom Reports', 'Performance Metrics'],
      'Content Management': ['Content Editor', 'Media Library', 'SEO Optimization', 'Publishing Workflow'],
      'Booking System': ['Calendar Integration', 'Automated Reminders', 'Payment Processing', 'Customer Management']
    };
    
    const appFeatures = features[appType] || ['User-Friendly Interface', 'Secure Data Handling', 'Mobile Responsive', 'Customer Support'];
    return appFeatures.join(' • ');
  }

  private generateCallToAction(appType: string): string {
    const ctas: Record<string, string> = {
      'E-commerce': 'Start Shopping Now',
      'Productivity': 'Boost Your Productivity',
      'Portfolio/Gallery': 'View Portfolio',
      'Social Platform': 'Join the Community',
      'Educational Platform': 'Start Learning',
      'Health/Fitness': 'Begin Your Journey',
      'Financial Management': 'Take Control of Your Finances',
      'Analytics Dashboard': 'View Analytics',
      'Content Management': 'Create Content',
      'Booking System': 'Book Now'
    };
    return ctas[appType] || 'Get Started Today';
  }

  // New intelligent HTML generation system
  private generateHTMLForPage(page: PageRequirement, allPages: PageRequirement[], appName: string, themeColors: any): string {
    const navigation = this.generateNavigation(allPages);
    const sidebar = this.generateSidebar(allPages, page.name);
    const mainContent = this.generateMainContent(page);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title} - ${appName}</title>
    <meta name="description" content="${page.purpose}">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <h1 class="app-title">${appName}</h1>
            ${navigation}
        </header>
        
        <div class="app-layout">
            ${sidebar}
            
            <main class="main-content">
                ${mainContent}
            </main>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
  }

  private generateNavigation(pages: PageRequirement[]): string {
    const navLinks = pages.slice(0, 4).map(page => {
      const filename = page.name === 'index' ? 'index.html' : `${page.name}.html`;
      return `<a href="/preview/${filename}" class="nav-link">${page.title}</a>`;
    }).join('\n                ');

    return `<nav class="header-nav">
                ${navLinks}
            </nav>`;
  }

  private generateSidebar(pages: PageRequirement[], currentPage: string): string {
    const sidebarItems = pages.map(page => {
      const filename = page.name === 'index' ? 'index.html' : `${page.name}.html`;
      const activeClass = page.name === currentPage ? ' active' : '';
      const displayName = page.name === 'index' ? 'Dashboard' : page.title;
      return `                        <li><a href="/preview/${filename}" class="nav-item${activeClass}">${displayName}</a></li>`;
    }).join('\n');

    return `<aside class="sidebar">
                <nav class="sidebar-nav">
                    <ul>
${sidebarItems}
                    </ul>
                </nav>
            </aside>`;
  }

  private generateMainContent(page: PageRequirement): string {
    const sections = page.content.sections
      .sort((a, b) => a.priority - b.priority)
      .map(section => this.generateContentSection(section, page))
      .join('\n');

    return `<div class="content-section">
                    <h2>${page.title}</h2>
                    <p class="page-description">${page.purpose}</p>
                    
${sections}
                </div>`;
  }

  private generateContentSection(section: ContentSection, page: PageRequirement): string {
    switch (section.type) {
      case 'hero':
        return `                    <div class="hero-section">
                        <h3>${section.title}</h3>
                        <p class="hero-text">${section.content}</p>
                        <button class="cta-button">Get Started</button>
                    </div>`;
      
      case 'features':
      case 'overview':
        return `                    <div class="features-section">
                        <h3>${section.title}</h3>
                        <div class="features-grid">
                            ${this.generateFeatureCards(section.content)}
                        </div>
                    </div>`;
      
      case 'form':
        return `                    <div class="form-section">
                        <h3>${section.title}</h3>
                        <p>${section.content}</p>
                        <form class="contact-form">
                            <input type="text" placeholder="Your Name" required>
                            <input type="email" placeholder="Your Email" required>
                            <textarea placeholder="Your Message" required></textarea>
                            <button type="submit">Send Message</button>
                        </form>
                    </div>`;
      
      case 'catalog':
      case 'products':
        return `                    <div class="catalog-section">
                        <h3>${section.title}</h3>
                        <p>${section.content}</p>
                        <div class="product-grid">
                            ${this.generateProductCards()}
                        </div>
                    </div>`;
      
      case 'metrics':
        return `                    <div class="metrics-section">
                        <h3>${section.title}</h3>
                        <div class="metrics-grid">
                            ${this.generateMetricCards()}
                        </div>
                    </div>`;
      
      case 'charts':
        return `                    <div class="charts-section">
                        <h3>${section.title}</h3>
                        <p>${section.content}</p>
                        <div class="chart-container">
                            <canvas id="chart-${section.type}" width="400" height="200"></canvas>
                        </div>
                    </div>`;
      
      default:
        return `                    <div class="content-block">
                        <h3>${section.title}</h3>
                        <p>${section.content}</p>
                    </div>`;
    }
  }

  private generateFeatureCards(featuresText: string): string {
    const features = featuresText.split(' • ');
    return features.map(feature => `
                            <div class="feature-card">
                                <h4>${feature}</h4>
                                <p>High-quality implementation with modern standards.</p>
                                <div class="feature-status">✅ Available</div>
                            </div>`).join('');
  }

  private generateProductCards(): string {
    const products = [
      { name: 'Premium Product', price: '$99', description: 'Top-quality product with excellent features.' },
      { name: 'Standard Product', price: '$59', description: 'Great value product for everyday use.' },
      { name: 'Basic Product', price: '$29', description: 'Essential features at an affordable price.' }
    ];

    return products.map(product => `
                            <div class="product-card">
                                <h4>${product.name}</h4>
                                <p class="price">${product.price}</p>
                                <p>${product.description}</p>
                                <button class="product-btn">Add to Cart</button>
                            </div>`).join('');
  }

  private generateMetricCards(): string {
    const metrics = [
      { label: 'Total Users', value: '12,456', trend: '+15%' },
      { label: 'Revenue', value: '$89,432', trend: '+8%' },
      { label: 'Active Sessions', value: '1,234', trend: '+23%' },
      { label: 'Conversion Rate', value: '3.2%', trend: '+5%' }
    ];

    return metrics.map(metric => `
                            <div class="metric-card">
                                <h4>${metric.label}</h4>
                                <div class="metric-value">${metric.value}</div>
                                <div class="metric-trend">${metric.trend}</div>
                            </div>`).join('');
  }

  // Enhanced CSS generation with dynamic theming
  private generateEnhancedCSS(appType: string, themeColors: any, pages: PageRequirement[]): string {
    return `/* Enhanced CSS with Dynamic Theming for ${appType} */
:root {
    --primary-color: ${themeColors.primary};
    --secondary-color: ${themeColors.secondary};
    --accent-color: ${themeColors.accent};
    --background-color: hsl(0, 0%, 98%);
    --surface-color: hsl(0, 0%, 100%);
    --text-color: hsl(0, 0%, 10%);
    --text-secondary: hsl(0, 0%, 40%);
    --border-color: hsl(0, 0%, 90%);
    --shadow: 0 2px 10px hsla(0, 0%, 0%, 0.1);
    --shadow-hover: 0 4px 20px hsla(0, 0%, 0%, 0.15);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
    overflow-x: hidden;
}

.app-container {
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr;
}

.app-header {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: var(--shadow);
    position: sticky;
    top: 0;
    z-index: 100;
}

.app-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
}

.header-nav {
    display: flex;
    gap: 2rem;
}

.nav-link {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.app-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    min-height: calc(100vh - 80px);
}

.sidebar {
    background: var(--surface-color);
    border-right: 1px solid var(--border-color);
    padding: 2rem 0;
    box-shadow: 2px 0 10px hsla(0, 0%, 0%, 0.05);
}

.sidebar-nav ul {
    list-style: none;
}

.nav-item {
    display: block;
    padding: 0.75rem 2rem;
    text-decoration: none;
    color: var(--text-secondary);
    transition: all 0.3s ease;
    border-left: 3px solid transparent;
}

.nav-item:hover {
    background: var(--background-color);
    color: var(--primary-color);
    border-left-color: var(--accent-color);
}

.nav-item.active {
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    color: white;
    border-left-color: var(--accent-color);
    font-weight: 600;
}

.main-content {
    padding: 2rem;
    overflow-y: auto;
    background: var(--background-color);
}

.content-section {
    max-width: 1200px;
    margin: 0 auto;
}

.content-section h2 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    font-size: 2rem;
}

.page-description {
    color: var(--text-secondary);
    margin-bottom: 2rem;
    font-size: 1.1rem;
}

.hero-section {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 3rem 2rem;
    border-radius: 12px;
    text-align: center;
    margin-bottom: 2rem;
    box-shadow: var(--shadow);
}

.hero-section h3 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.hero-text {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

.cta-button {
    background: var(--accent-color);
    color: white;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-hover);
}

.features-section {
    margin-bottom: 2rem;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.feature-card {
    background: var(--surface-color);
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
}

.feature-card h4 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
}

.feature-status {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #4CAF50, #8BC34A);
    color: white;
    border-radius: 20px;
    font-weight: 600;
    display: inline-block;
    font-size: 0.9rem;
}

.form-section {
    background: var(--surface-color);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: var(--shadow);
    margin-bottom: 2rem;
}

.contact-form {
    display: grid;
    gap: 1rem;
    max-width: 500px;
}

.contact-form input,
.contact-form textarea {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-family: inherit;
}

.contact-form button {
    background: var(--primary-color);
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.product-card {
    background: var(--surface-color);
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    box-shadow: var(--shadow);
}

.product-card .price {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-color);
    margin: 0.5rem 0;
}

.product-btn {
    background: var(--accent-color);
    color: white;
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 1rem;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.metric-card {
    background: var(--surface-color);
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: var(--shadow);
    border-left: 4px solid var(--accent-color);
}

.metric-value {
    font-size: 2rem;
    font-weight: 600;
    color: var(--primary-color);
    margin: 0.5rem 0;
}

.metric-trend {
    color: #4CAF50;
    font-weight: 600;
}

@media (max-width: 768px) {
    .app-layout {
        grid-template-columns: 1fr;
    }
    
    .sidebar {
        order: 2;
        border-right: none;
        border-top: 1px solid var(--border-color);
        padding: 1rem 0;
    }
    
    .header-nav {
        gap: 1rem;
    }
    
    .nav-link {
        padding: 0.25rem 0.5rem;
        font-size: 0.9rem;
    }
    
    .features-grid,
    .product-grid,
    .metrics-grid {
        grid-template-columns: 1fr;
    }
    
    .hero-section h3 {
        font-size: 2rem;
    }
}`;
  }

  // Enhanced JavaScript generation with interactivity for all pages
  private generateEnhancedJavaScript(pages: PageRequirement[], appType: string): string {
    return `// Enhanced JavaScript for ${appType} Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Multi-page ${appType} application loaded successfully');
    
    // Initialize application
    initializeApp();
    updateActiveNavigation();
    addPageTransitions();
    addInteractiveFeatures();
});

function initializeApp() {
    setupGlobalEvents();
    initializePageFeatures();
}

function initializePageFeatures() {
    const currentPage = getCurrentPage();
    
    // Page-specific initialization
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'contact':
            initializeContactPage();
            break;
        case 'products':
            initializeProductsPage();
            break;
        case 'dashboard':
            initializeDashboardPage();
            break;
        default:
            console.log('Default page initialization');
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('contact.html')) return 'contact';
    if (path.includes('products.html')) return 'products';
    if (path.includes('dashboard.html')) return 'dashboard';
    return 'index';
}

function initializeHomePage() {
    setupFeatureCards();
    setupCTAButtons();
}

function initializeContactPage() {
    setupContactForm();
}

function initializeProductsPage() {
    setupProductGrid();
}

function initializeDashboardPage() {
    animateMetrics();
}

function setupFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Message sent successfully!', 'success');
        this.reset();
    });
}

function setupProductGrid() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const button = card.querySelector('.product-btn');
        if (button) {
            button.addEventListener('click', function() {
                showNotification('Added to cart!', 'info');
            });
        }
    });
}

function animateMetrics() {
    const metricValues = document.querySelectorAll('.metric-value');
    metricValues.forEach(metric => {
        const finalValue = metric.textContent;
        const numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
        
        if (!isNaN(numericValue)) {
            animateCounter(metric, 0, numericValue, finalValue);
        }
    });
}

function animateCounter(element, start, end, finalText) {
    const duration = 2000;
    const increment = (end - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = finalText;
            clearInterval(timer);
        } else {
            const prefix = finalText.match(/[^0-9.]/g)?.[0] || '';
            element.textContent = prefix + Math.floor(current);
        }
    }, 16);
}

function updateActiveNavigation() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item, .nav-link');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        item.classList.remove('active');
        
        if (href && currentPath.includes(href.replace('/preview/', ''))) {
            item.classList.add('active');
        }
    });
}

function addPageTransitions() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            mainContent.style.transition = 'all 0.3s ease';
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }, 100);
    }
}

function addInteractiveFeatures() {
    setupCTAButtons();
    setupNavigation();
}

function setupCTAButtons() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            showNotification('Action initiated!', 'success');
        });
    });
}

function setupNavigation() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('.nav-item, .nav-link')) {
            e.target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.target.style.transform = 'scale(1)';
            }, 150);
        }
    });
}

function setupGlobalEvents() {
    console.log('Global events initialized');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 4px;
        color: white;
        z-index: 1000;
        background: \${type === 'success' ? '#4CAF50' : '#2196F3'};
    \`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

console.log('Enhanced ${appType} application fully initialized');`;
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
      // Step 1: Analyze prompt and determine required pages
      const { pages, appName } = this.analyzePromptForPages(prompt);
      const appType = this.detectApplicationType(prompt);
      const themeColors = this.getThemeColors(appType);
      
      console.log(`🔍 Analyzed prompt - App: ${appName}, Type: ${appType}, Pages: ${pages.map(p => p.name).join(', ')}`);
      
      // Step 2: Generate HTML files for each page
      const files: Record<string, string> = {};
      
      // Generate each HTML page with tailored content
      for (const page of pages) {
        const filename = page.name === 'index' ? 'index.html' : `${page.name}.html`;
        files[filename] = this.generateHTMLForPage(page, pages, appName, themeColors);
        console.log(`📄 Generated ${filename} with sections: ${page.content.sections.map(s => s.type).join(', ')}`);
      }
      
      // Step 3: Generate enhanced CSS with dynamic theming
      files['styles.css'] = this.generateEnhancedCSS(appType, themeColors, pages);
      
      // Step 4: Generate JavaScript with interactivity for all pages
      files['script.js'] = this.generateEnhancedJavaScript(pages, appType);
      
      // Step 5: Generate AI-driven implementation plan
      const implementationPlan = await this.generateAIImplementationPlan(prompt);
      
      const result: CodeGenerationResponse = {
        plan: implementationPlan.plan,
        files,
        reasoning: implementationPlan.reasoning,
        architecture: implementationPlan.architecture,
        nextSteps: implementationPlan.nextSteps,
        dependencies: implementationPlan.dependencies,
        testingStrategy: implementationPlan.testingStrategy
      };
      
      // Store interaction in context for learning
      this.context.previousInteractions.push({
        prompt,
        response: result,
        timestamp: new Date()
      });

      return result;
    } catch (error) {
      console.error("Advanced Gemini agent error:", error);
      
      // No fallback - only use generative AI for implementation plans
      // Attempt AI-based error recovery with different parameters
      try {
        console.log("Attempting AI recovery with simplified parameters...");
        return await this.generateWithAIRecovery(prompt);
      } catch (recoveryError) {
        throw new Error(
          `AI service unavailable. Original error: ${
            error instanceof Error ? error.message : "Unknown error"
          }. Recovery failed: ${
            recoveryError instanceof Error ? recoveryError.message : "Unknown recovery error"
          }`
        );
      }
    }
  }

  // AI recovery method with simplified parameters
  private async generateWithAIRecovery(prompt: string): Promise<CodeGenerationResponse> {
    console.log("🔄 AI Recovery Mode: Generating implementation plan with optimized parameters");
    
    // Use AI to generate implementation plan entirely
    const implementationPlan = await this.generateAIImplementationPlan(prompt);
    
    // Analyze prompt for pages and app type using local intelligence
    const { pages, appName } = this.analyzePromptForPages(prompt);
    const appType = this.detectApplicationType(prompt);
    const themeColors = this.getThemeColors(appType);
    
    // Generate files using local methods
    const files: Record<string, string> = {};
    
    for (const page of pages) {
      const filename = page.name === 'index' ? 'index.html' : `${page.name}.html`;
      files[filename] = this.generateHTMLForPage(page, pages, appName, themeColors);
    }
    
    files['styles.css'] = this.generateEnhancedCSS(appType, themeColors, pages);
    files['script.js'] = this.generateEnhancedJavaScript(pages, appType);
    
    return {
      plan: implementationPlan.plan,
      files,
      reasoning: implementationPlan.reasoning,
      architecture: implementationPlan.architecture,
      nextSteps: implementationPlan.nextSteps,
      dependencies: implementationPlan.dependencies,
      testingStrategy: implementationPlan.testingStrategy
    };
  }

  // Pure AI-driven implementation plan generator
  private async generateAIImplementationPlan(prompt: string): Promise<{
    plan: string[];
    reasoning: string;
    architecture: string;
    nextSteps: string[];
    dependencies: string[];
    testingStrategy: string;
  }> {
    const systemPrompt = `You are an expert implementation planning agent. Generate a comprehensive implementation plan based on the user's request.

User Request: ${prompt}

Analyze the request and provide a detailed implementation plan in JSON format:

{
  "plan": ["Step 1: specific action", "Step 2: specific action", "Step 3: specific action", ...],
  "reasoning": "Detailed explanation of the approach and decisions made",
  "architecture": "Technical architecture and design patterns used",
  "nextSteps": ["Future improvement 1", "Future improvement 2", ...],
  "dependencies": ["Required technology 1", "Required technology 2", ...],
  "testingStrategy": "Comprehensive testing approach and validation methods"
}

Focus on:
1. Specific, actionable implementation steps
2. Technical architecture decisions
3. User experience considerations
4. Performance and scalability planning
5. Future extensibility

Generate a professional, production-ready implementation plan.`;

    try {
      const response = await this.generateWithRetry({
        model: "gemini-2.0-flash-lite",
        contents: systemPrompt,
        config: {
          temperature: 0.3,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048
        }
      });

      let content = response.text || "";
      content = this.cleanResponseContent(content);
      
      const result = JSON.parse(content);
      
      // Validate required fields
      if (!result.plan || !Array.isArray(result.plan)) {
        throw new Error("Invalid AI response: missing or invalid plan array");
      }
      
      return {
        plan: result.plan,
        reasoning: result.reasoning || "AI-generated implementation approach",
        architecture: result.architecture || "Modern web application architecture",
        nextSteps: result.nextSteps || ["Add advanced features", "Optimize performance"],
        dependencies: result.dependencies || ["HTML5", "CSS3", "JavaScript"],
        testingStrategy: result.testingStrategy || "Manual testing and validation"
      };
      
    } catch (error) {
      console.error("AI implementation plan generation failed:", error);
      
      // If AI fails completely, throw error instead of fallback
      throw new Error(`AI implementation plan generation failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`);
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

  // All fallback methods removed - only AI-generated implementation plans supported

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

  // Core AI generation method - essential for service functionality
  private async generateWithRetry(options: {
    model: string;
    contents: string;
    config: {
      temperature: number;
      topP: number;
      topK: number;
      maxOutputTokens: number;
    };
  }, maxRetries: number = 3): Promise<{ text: string }> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Use the correct Google GenAI API structure
        const result = await this.genAI.models.generateContent({
          model: options.model,
          contents: [{ role: 'user', parts: [{ text: options.contents }] }],
          generationConfig: {
            temperature: options.config.temperature,
            topP: options.config.topP,
            topK: options.config.topK,
            maxOutputTokens: options.config.maxOutputTokens
          }
        });
        
        if (!result || !result.candidates || result.candidates.length === 0) {
          throw new Error("No candidates in AI response");
        }
        
        const text = result.candidates[0].content.parts[0].text;
        
        if (!text || text.trim().length === 0) {
          throw new Error("Empty response from AI service");
        }
        
        return { text };
        
      } catch (error) {
        lastError = error as Error;
        console.warn(`AI generation attempt ${attempt}/${maxRetries} failed:`, error.message);
        
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw new Error(`AI generation failed after ${maxRetries} attempts: ${lastError.message}`);
  }

  // End of class - all fallback methods removed to ensure only AI-generated implementation plans
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

// All fallback methods removed to ensure only AI-generated implementation plans
