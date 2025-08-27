# FleetManager Backend API

## Description
Backend API for FleetManager - Vehicle and Driver Management System

## Quick Start

### Install Dependencies
\\\ash
npm install
\\\

### Environment Variables
Create a \.env\ file:
\\\env
DATABASE_URL=postgresql://postgres:newnew@db.bfaaznkamabozpiyjych.supabase.co:5432/postgres
SESSION_SECRET=fleetmanager-secret-key-2024
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://fleetmanager-frontend.vercel.app
\\\

### Development
\\\ash
npm run dev
\\\

### Production Build
\\\ash
npm run build
npm run start
\\\

## API Endpoints

- \GET /api/health\ - Health check
- \GET /api/auth/user\ - Get current user
- \GET /api/auth/status\ - Authentication status
- \GET /api/vehicles\ - List vehicles
- \GET /api/drivers\ - List drivers

## Deployment

### Render
1. Connect GitHub repository
2. Set environment variables
3. Build command: \
pm run build\
4. Start command: \
pm run start\

### Railway
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically
