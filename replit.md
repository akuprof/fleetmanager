# Fleet Management System

## Overview

FleetFlow is a comprehensive fullstack web application for fleet rental and driver management. The system provides role-based access control for admins, managers, and drivers, with features including vehicle management, trip tracking, expense management, automated revenue sharing calculations, and detailed analytics dashboards.

The application is built using a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence and featuring a sophisticated revenue-sharing algorithm that automatically calculates driver-company splits based on daily earnings thresholds.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite for build tooling
- **UI Library**: Shadcn/UI components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for client-side routing with role-based route protection
- **Forms**: React Hook Form with Zod schema validation for type-safe form handling
- **Charts**: Recharts for data visualization and analytics dashboards

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth using OpenID Connect with Passport.js strategy
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful endpoints with role-based access control middleware
- **Error Handling**: Centralized error handling with structured error responses

### Database Design
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Comprehensive schema with proper relationships and constraints
  - Users table with role-based access (admin, manager, driver)
  - Vehicles with status tracking and maintenance scheduling
  - Drivers with performance analytics and assignment management
  - Trips with automated revenue splitting calculations
  - Expenses categorized by type with vehicle associations
  - Payouts with status tracking and audit trails
  - Maintenance logs for service history tracking
  - Alerts system for automated notifications

### Authentication & Authorization
- **Provider**: Replit Auth with OpenID Connect protocol
- **Session Storage**: PostgreSQL-backed sessions for scalability
- **Role-Based Access**: Three-tier permission system (admin, manager, driver)
- **Route Protection**: Frontend and backend route guards based on user roles

### Revenue Calculation System
- **Algorithm**: Tiered revenue sharing model
  - Up to ₹2,500/day: Driver gets 30%, Company gets 70%
  - Above ₹2,500/day: Driver gets 70%, Company gets 30%
- **Implementation**: Centralized calculation logic with real-time preview in forms
- **Automation**: Automatic calculation during trip creation and payout processing

### Data Management
- **ORM**: Drizzle ORM with type-safe queries and migrations
- **Validation**: Zod schemas shared between frontend and backend for consistency
- **Caching**: React Query for client-side caching with background synchronization
- **Real-time Updates**: Optimistic updates with automatic error recovery

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Replit Auth**: Authentication service with OpenID Connect support
- **Vite**: Development server and build tool with hot module replacement

### UI & Styling
- **Shadcn/UI**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Radix UI**: Accessible component primitives for complex UI interactions
- **Lucide React**: Icon library with consistent design language

### Data & Forms
- **TanStack React Query**: Server state management with caching and synchronization
- **React Hook Form**: Performance-focused form library with validation
- **Zod**: TypeScript-first schema validation for runtime type safety
- **Drizzle ORM**: Type-safe database operations with automatic migrations

### Development Tools
- **TypeScript**: Static type checking across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer for browser compatibility
- **Date-fns**: Modern date utility library for time calculations