# Vibe Coding Platform

## Overview

This is a full-stack web application that serves as an AI-powered coding platform. Users can describe what they want to build through a chat interface, and the system generates HTML, CSS, and JavaScript files in real-time with live preview capabilities. The platform combines React frontend with Express backend, using OpenAI for code generation and WebSocket for live reload functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Styling**: Tailwind CSS with CSS variables for theming
- **Real-time Updates**: WebSocket client for live reload functionality

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with JSON responses
- **Real-time Communication**: WebSocket server for live reload
- **File Management**: Custom file system operations for code generation
- **AI Integration**: OpenAI GPT-4o for code generation

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Schema**: Users, projects, and messages tables
- **Connection**: Neon Database serverless driver
- **Development Storage**: In-memory storage fallback for development
- **File Storage**: Local file system for generated code files

## Key Components

### Advanced Agentic AI Code Generation Service
- **AI Provider**: Google Gemini 2.0 Flash Experimental model with advanced agentic capabilities
- **Architecture**: Multi-layered agent system with MCP (Model Context Protocol) integration
- **Input**: Natural language prompts with contextual memory and tool augmentation
- **Output**: Enhanced JSON with reasoning, architecture decisions, dependencies, and testing strategies
- **File Types**: HTML, CSS, JavaScript with comprehensive analysis and quality assessment
- **Context Awareness**: Memory-driven interactions with learning from previous sessions
- **Tool Integration**: Built-in code analysis, quality assessment, and architecture planning tools
- **MCP Support**: Compatible with Model Context Protocol for external tool integration
- **Framework Integration**: Supports LangChain, CrewAI, and AutoGen patterns
- **Layout Structure**: Mandatory HTML5 layout with header, sidebar, and main content using CSS Grid
- **Dynamic Theming**: Automatic theme color assignment based on application type (10+ predefined themes)
- **Comprehensive Apps**: Creates complete, production-ready applications from first prompts
- **Update (July 27, 2025)**: Major upgrade to advanced agentic AI architecture with MCP capabilities and dynamic theming
- **Enhancement Completed**: Pure AI-driven implementation plan generation with all fallback mechanisms removed per user requirement
- **Update (July 30, 2025)**: Refactored advancedGenerator.ts to implement a 5-step process:
  1. Analyze and enhance prompts with detailed features and functionality
  2. Generate ONLY browser-executable HTML and CSS file structure in JSON format (JavaScript files excluded)
  3. Create file structure in public folder
  4. Generate each file content separately with different LLM calls asynchronously
  5. Save all files to public folder
- **Critical Update (January 30, 2025)**: Modified generator to exclude ALL JavaScript files - now generates ONLY HTML5 and modern CSS files with CSS-only interactivity, ensuring pure static web applications with semantic HTML structure and responsive design
- **Major Update (January 27, 2025)**: Implemented intelligent page analysis system that dynamically determines required pages based on prompt keywords and application type instead of using fixed templates
- **Architecture Change (January 27, 2025)**: Completely removed all fallback mechanisms ensuring 100% AI-generated implementation plans without any template-based responses
- **Major Enhancement (January 27, 2025)**: Implemented complete AI-driven application generation that analyzes user prompts and creates applications that exactly match the specific requirements instead of generic templates
- **Iterative Development (January 27, 2025)**: Added intelligent iterative development - first prompt creates base application, subsequent prompts modify existing codebase with minimal changes while preserving existing functionality
- **Critical Fix (January 27, 2025)**: Implemented robust JSON parsing with safe error handling to prevent escaped character parsing failures that caused 500 errors in AI responses
- **Multi-LLM Architecture (January 27, 2025)**: Implemented advanced multi-LLM approach with dedicated AI calls for each component (plan, pages, CSS, JavaScript) ensuring high-quality, modern UI and proper multi-page generation
- **Complete Refactor (January 28, 2025)**: Rebuilt the entire generation system with advanced multi-step process: 1) First prompt detection and public folder clearing, 2) AI feature analysis, 3) File structure planning, 4) Individual file generation with separate AI calls, 5) Navigation setup, 6) Final integration. Added real-time progress display in Development Chat with WebSocket updates for each step.

### File Management System
- **Directory Structure**: `/public` directory for generated static files
- **File Operations**: Read, write, and watch file system changes
- **Live Reload**: Automatic browser refresh when files change
- **Asset Serving**: Static file serving for preview functionality

### WebSocket Live Reload
- **Connection**: WebSocket server on `/ws` endpoint
- **File Watching**: Chokidar for monitoring file system changes
- **Client Notification**: Real-time updates to connected browsers
- **Auto-Reconnection**: Client automatically reconnects on disconnect

### Chat Interface
- **Message History**: Persistent storage of user prompts and AI responses
- **Real-time Updates**: Immediate feedback during code generation
- **Project Context**: Maintains conversation context for iterative development
- **Error Handling**: Graceful handling of API failures

## Data Flow

1. **User Input**: User types natural language prompt in chat interface
2. **API Request**: Frontend sends prompt to `/api/prompt` endpoint
3. **AI Processing**: Backend calls OpenAI API with system prompt and user input
4. **Code Generation**: AI returns structured plan and generated files
5. **File Writing**: Backend writes generated files to `/public` directory
6. **File Watching**: Chokidar detects file changes and triggers WebSocket event
7. **Live Reload**: WebSocket notifies connected clients to refresh preview
8. **Database Storage**: Conversation history stored in PostgreSQL
9. **Preview Update**: User sees updated code in live preview panel

## External Dependencies

### Advanced AI Services
- **Google Gemini API**: Gemini 2.0 Flash Experimental model for advanced agentic capabilities
- **API Key**: Required environment variable `GOOGLE_API_KEY`
- **Response Format**: Enhanced JSON with reasoning, architecture, and testing strategies
- **MCP Integration**: Model Context Protocol support for external tool integration
- **Agent Architecture**: Multi-layered agent system with memory and learning capabilities
- **Framework Support**: Compatible with LangChain, CrewAI, AutoGen patterns
- **Tool Ecosystem**: Built-in code analysis, quality assessment, and architecture planning
- **Migration Date**: July 27, 2025 - Major upgrade to advanced agentic AI architecture

### Database Services
- **Neon Database**: PostgreSQL-compatible serverless database
- **Connection String**: Required environment variable `DATABASE_URL`
- **Migration**: Drizzle Kit for schema management

### Development Tools
- **Replit Integration**: Cartographer plugin for development mode
- **Error Overlay**: Runtime error modal for debugging
- **File Watching**: Chokidar for cross-platform file system monitoring

## Deployment Strategy

### Development Mode
- **Vite Dev Server**: Hot module replacement for React frontend
- **Express Server**: Serves API endpoints and static files
- **Live Reload**: WebSocket connection for real-time updates
- **Error Handling**: Development-specific error overlays

### Production Build
- **Frontend Build**: Vite builds optimized React bundle to `dist/public`
- **Backend Build**: ESBuild bundles Express server to `dist/index.js`
- **Static Serving**: Express serves built frontend and generated files
- **Environment Variables**: Database URL and OpenAI API key required

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with client, server, and shared code
   - **Problem**: Need to share TypeScript types between frontend and backend
   - **Solution**: `/shared` directory with common schemas and types
   - **Benefits**: Type safety across full stack, easier development

2. **Real-time Preview**: WebSocket-based live reload system
   - **Problem**: Users need immediate feedback when code is generated
   - **Solution**: File watching with WebSocket notifications
   - **Benefits**: Instant preview updates, better user experience

3. **AI-First Architecture**: OpenAI integration as core service
   - **Problem**: Need to generate complete, functional code from natural language
   - **Solution**: Structured prompts with JSON response format
   - **Benefits**: Consistent output format, easy parsing and validation

4. **Static File Generation**: Files written to local file system
   - **Problem**: Need to serve generated code as static web pages
   - **Solution**: Write files to `/public` directory served by Express
   - **Benefits**: Simple preview mechanism, standard web hosting compatibility

5. **Project-Based Chat History**: Template selection creates persistent projects
   - **Problem**: Need to associate dev chat conversations with specific projects
   - **Solution**: Generate unique project ID on template selection, store in database
   - **Benefits**: Persistent conversation history, project tracking, better organization
   - **Implementation Date**: January 28, 2025 - Added project ID generation and database storage

## Advanced Agentic AI Features (July 27, 2025)

### Model Context Protocol (MCP) Integration
- **Protocol**: Anthropic's MCP standard for connecting AI agents to external tools
- **Implementation**: Custom MCP-compatible agent architecture
- **Tool Discovery**: Dynamic discovery and integration of MCP servers
- **Supported Servers**: GitHub, filesystem, SQLite, and custom tool servers
- **Benefits**: Standardized tool integration, extensible architecture

### Multi-Framework Agent Support
1. **LangChain Integration**
   - Chain-based workflow execution
   - Tool integration with LangChain ecosystem
   - Memory management and conversation buffers
   - Web search, calculator, and code execution tools

2. **CrewAI Integration**
   - Role-based multi-agent collaboration
   - Hierarchical task delegation
   - Specialized agent roles (Engineer, Architect, QA)
   - Team performance metrics and optimization

3. **AutoGen Integration**
   - Conversation-driven multi-agent system
   - Code execution in sandboxed environments
   - Human-in-the-loop capabilities
   - Agent coordination and consensus building

### Enhanced Agent Capabilities
- **Contextual Memory**: Persistent storage of interactions and learning
- **Quality Assessment**: Built-in code quality scoring and recommendations
- **Architecture Planning**: Automated system design and pattern recognition
- **Dependency Analysis**: Smart detection and management of project dependencies
- **Testing Strategy**: Automated test planning and quality assurance approaches
- **Reasoning Engine**: Explicit reasoning and decision-making documentation
- **Intelligent Page Analysis**: Dynamic determination of required pages based on prompt keywords and application type
- **Smart Content Generation**: Context-aware HTML, CSS, and JavaScript generation tailored to each page's specific purpose
- **Application Type Detection**: Automatic classification of applications (e-commerce, dashboard, portfolio, etc.) for targeted theming and features

### Tool Ecosystem
- **File Analysis**: Pattern detection, dependency extraction, complexity assessment
- **Code Quality**: Scoring, issue detection, refactoring opportunities
- **Architecture Planning**: Component identification, pattern recommendation
- **Performance Optimization**: Scalability assessment and recommendations