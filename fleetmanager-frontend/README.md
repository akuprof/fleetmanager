# FleetManager Frontend

## Description
Frontend application for FleetManager - Vehicle and Driver Management System

## Quick Start

### Install Dependencies
\\\ash
npm install
\\\

### Environment Variables
Create a \.env\ file:
\\\env
VITE_API_URL=https://fleetmanager-backend.onrender.com
VITE_APP_NAME=FleetManager
\\\

### Development
\\\ash
npm run dev
\\\

### Production Build
\\\ash
npm run build
npm run preview
\\\

## Features

- Vehicle management dashboard
- Driver assignment and tracking
- Trip planning and monitoring
- Expense tracking
- Real-time updates
- Responsive design

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Framework preset: Vite
3. Build command: \
pm run build\
4. Output directory: \dist\

### Netlify
1. Connect GitHub repository
2. Build command: \
pm run build\
3. Publish directory: \dist\

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Set source to GitHub Actions
3. Create workflow for automatic deployment
