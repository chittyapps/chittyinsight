# ChittyInsight AI Dashboard

## Overview

ChittyInsight is an AI Activity Intelligence dashboard application that provides real-time monitoring and management of AI agents. The system features a comprehensive interface for tracking AI agent performance, managing orchestrators and workers, monitoring system health metrics, and facilitating chat interactions with AI assistants. Built as a full-stack web application, it combines a React frontend with an Express.js backend, utilizing PostgreSQL for data persistence and real-time WebSocket connections for live updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom ChittyInsight theme variables for consistent branding
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Communication**: Custom WebSocket hook for live data updates

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **Development Environment**: Uses Vite middleware in development for hot module reloading
- **API Design**: RESTful API structure with dedicated routes for users, agents, activities, metrics, chat, notifications, and integrations
- **Request Logging**: Custom middleware for API request logging and performance monitoring
- **Error Handling**: Centralized error handling middleware with structured error responses

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: Comprehensive database schema including:
  - Users with role-based access and verification system
  - AI Agents with type classification (analyzer, processor, generator, orchestrator, worker)
  - Activities for tracking agent actions and system events
  - System Metrics for performance monitoring
  - Chat Messages for AI assistant interactions
  - Notifications for user alerts
  - Integrations for external service connections
- **Database Migrations**: Managed through Drizzle Kit with automatic UUID generation

### Authentication and Authorization
- **User Management**: Role-based system supporting admin, user, and viewer roles
- **Session Management**: PostgreSQL session storage using connect-pg-simple
- **User Verification**: Built-in user verification system with score tracking

### External Dependencies
- **Database Provider**: Neon serverless PostgreSQL database
- **UI Framework**: Comprehensive shadcn/ui component system with Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Date Handling**: date-fns for consistent date formatting and manipulation
- **WebSocket Support**: Native WebSocket implementation for real-time features
- **Development Tools**: Replit-specific development enhancements and error overlays

The system is designed with a clear separation of concerns, utilizing shared schema definitions between frontend and backend for type safety, and implementing a scalable architecture that supports real-time monitoring of AI agent activities and system performance metrics.