# TallyPrime AI Assistant

## Overview

This is a full-stack web application that provides an AI-powered chat assistant for TallyPrime accounting software. The application helps users with accounting queries, provides step-by-step guidance, and can simulate TallyPrime interface actions. It features a modern React frontend with a Node.js/Express backend, integrated with OpenAI for intelligent responses and PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for TallyPrime branding
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Voice Features**: Built-in speech recognition and synthesis APIs for voice input/output

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Request Logging**: Custom middleware for API request/response logging
- **Error Handling**: Centralized error handling middleware

### Data Storage
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Data Models**: 
  - Messages table for chat history with role-based conversations
  - FAQ items table for knowledge base with keyword search capabilities
- **Storage Layer**: Abstracted storage interface with in-memory fallback for development

### AI Integration
- **Provider**: OpenAI GPT-4o for natural language processing
- **Response Types**: Text, FAQ matches, TallyPrime simulations, and error responses
- **Structured Responses**: JSON-formatted responses with metadata for enhanced UX
- **Context Awareness**: FAQ search integration for domain-specific knowledge

### Authentication & Security
- **Session Management**: Express sessions with PostgreSQL session store
- **CORS**: Configured for development and production environments
- **Input Validation**: Zod schemas for request/response validation
- **Environment Variables**: Secure configuration management for API keys and database URLs

### Development Tools
- **Build System**: Vite for fast development and optimized production builds
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Hot Reload**: Vite HMR with custom error overlay for development
- **Path Aliases**: Configured import aliases for clean module resolution

## External Dependencies

### Core Technologies
- **Database**: PostgreSQL (via Neon serverless)
- **AI Service**: OpenAI GPT-4o API
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Build Tools**: Vite, esbuild
- **Development**: tsx for TypeScript execution

### Third-Party Services
- **Neon Database**: Serverless PostgreSQL hosting
- **OpenAI API**: Natural language processing and response generation
- **Replit Platform**: Development environment with custom plugins

### Key Libraries
- **Frontend**: React, TanStack Query, Wouter, date-fns
- **Backend**: Express, Drizzle ORM, connect-pg-simple
- **Shared**: Zod for validation, nanoid for ID generation
- **UI**: Lucide React icons, class-variance-authority for component variants