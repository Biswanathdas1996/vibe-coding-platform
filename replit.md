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

### Code Generation Service
- **AI Provider**: Google Gemini 2.0 Flash Lite model
- **Input**: Natural language prompts describing desired functionality
- **Output**: Structured JSON with implementation plan and generated files
- **File Types**: HTML, CSS, JavaScript with support for additional assets
- **Context Awareness**: Can modify existing files or create new ones
- **Update (July 27, 2025)**: Switched from OpenAI GPT-4o to Google Gemini for cost efficiency and performance

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

### AI Services
- **Google Gemini API**: Gemini 2.0 Flash Lite model for code generation
- **API Key**: Required environment variable `GOOGLE_API_KEY`
- **Response Format**: JSON parsing with markdown code block handling
- **Migration Date**: July 27, 2025 - Switched from OpenAI GPT-4o to Google Gemini

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