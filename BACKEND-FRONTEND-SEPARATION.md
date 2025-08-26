# 🚀 Backend & Frontend Separate Deployment Guide

## 📋 Overview

This guide will help you separate your FleetManager application into two independent repositories:
- **Backend**: API server with database and authentication
- **Frontend**: React application with UI components

## 🏗️ Backend Repository Setup

### Step 1: Create Backend Repository

```bash
# Create new backend directory
mkdir fleetmanager-backend
cd fleetmanager-backend

# Initialize git repository
git init
git remote add origin https://github.com/akuprof/fleetmanager-backend.git
```

### Step 2: Backend File Structure

```
fleetmanager-backend/
├── server/
│   ├── index.ts
│   ├── auth.ts
│   ├── routes.ts
│   ├── db.ts
│   └── storage.ts
├── shared/
│   └── schema.ts
├── migrations/
├── scripts/
├── package.json
├── tsconfig.json
├── drizzle.config.ts
├── railway.toml
├── render.yaml
├── Dockerfile
└── README.md
```

### Step 3: Backend package.json

```json
{
  "name": "fleetmanager-backend",
  "version": "1.0.0",
  "description": "FleetManager Backend API",
  "main": "dist/index.js",
  "scripts": {
    "dev": "cross-env NODE_ENV=development tsx server/index.ts",
    "build": "esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "cross-env NODE_ENV=production node dist/index.js",
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.9.0",
    "connect-pg-simple": "^9.0.0",
    "drizzle-orm": "^0.30.4",
    "express": "^4.21.2",
    "express-session": "^1.18.0",
    "ws": "^8.18.0"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/express-session": "^1.18.0",
    "@types/ws": "^8.5.10",
    "cross-env": "^10.0.0",
    "drizzle-kit": "^0.30.4",
    "esbuild": "^0.25.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  }
}
```

### Step 4: Backend Environment Variables

```env
# Backend .env
DATABASE_URL=postgresql://postgres:newnew@db.bfaaznkamabozpiyjych.supabase.co:5432/postgres
SESSION_SECRET=fleetmanager-secret-key-2024
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://fleetmanager-frontend.vercel.app
```

## 🎨 Frontend Repository Setup

### Step 1: Create Frontend Repository

```bash
# Create new frontend directory
mkdir fleetmanager-frontend
cd fleetmanager-frontend

# Initialize git repository
git init
git remote add origin https://github.com/akuprof/fleetmanager-frontend.git
```

### Step 2: Frontend File Structure

```
fleetmanager-frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   ├── main.tsx
│   └── App.tsx
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
└── README.md
```

### Step 3: Frontend package.json

```json
{
  "name": "fleetmanager-frontend",
  "version": "1.0.0",
  "description": "FleetManager Frontend",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.6.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.2",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2",
    "vite": "^5.4.19"
  }
}
```

### Step 4: Frontend Environment Variables

```env
# Frontend .env
VITE_API_URL=https://fleetmanager-backend.onrender.com
VITE_APP_NAME=FleetManager
```

## 🚀 Deployment Guide

### Backend Deployment Options

#### Option 1: Render (Recommended)

1. **Visit**: https://dashboard.render.com
2. **Create Web Service**
3. **Connect Repository**: `fleetmanager-backend`
4. **Configure**:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
5. **Environment Variables**:
   ```
   DATABASE_URL=postgresql://postgres:newnew@db.bfaaznkamabozpiyjych.supabase.co:5432/postgres
   SESSION_SECRET=fleetmanager-secret-key-2024
   NODE_ENV=production
   PORT=10000
   CORS_ORIGIN=https://fleetmanager-frontend.vercel.app
   ```

#### Option 2: Railway

1. **Visit**: https://railway.app
2. **Connect Repository**: `fleetmanager-backend`
3. **Set Environment Variables**
4. **Deploy**

#### Option 3: Vercel

1. **Visit**: https://vercel.com
2. **Import Repository**: `fleetmanager-backend`
3. **Configure as API**
4. **Set Environment Variables**

### Frontend Deployment Options

#### Option 1: Vercel (Recommended)

1. **Visit**: https://vercel.com
2. **Import Repository**: `fleetmanager-frontend`
3. **Configure**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://fleetmanager-backend.onrender.com
   ```

#### Option 2: Netlify

1. **Visit**: https://netlify.com
2. **Connect Repository**: `fleetmanager-frontend`
3. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

#### Option 3: GitHub Pages

1. **Enable GitHub Pages** in repository settings
2. **Set Source** to GitHub Actions
3. **Create workflow** for automatic deployment

## 🔧 Configuration Updates

### Backend CORS Configuration

Update `server/index.ts`:

```typescript
import cors from 'cors';

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Frontend API Configuration

Create `src/utils/api.ts`:

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 📊 Expected URLs

### Backend URLs
- **Render**: https://fleetmanager-backend.onrender.com
- **Railway**: https://fleetmanager-backend.railway.app
- **Vercel**: https://fleetmanager-backend.vercel.app

### Frontend URLs
- **Vercel**: https://fleetmanager-frontend.vercel.app
- **Netlify**: https://fleetmanager-frontend.netlify.app
- **GitHub Pages**: https://akuprof.github.io/fleetmanager-frontend

## 🔍 Testing

### Backend Testing
```bash
# Health check
curl https://fleetmanager-backend.onrender.com/api/health

# Authentication status
curl https://fleetmanager-backend.onrender.com/api/auth/status
```

### Frontend Testing
```bash
# Local development
npm run dev

# Production build
npm run build
npm run preview
```

## 🎯 Benefits of Separation

### ✅ **Scalability**
- Backend and frontend can scale independently
- Different hosting providers for optimal performance
- Separate resource allocation

### ✅ **Development**
- Independent development teams
- Different deployment cycles
- Technology-specific optimizations

### ✅ **Maintenance**
- Easier debugging and monitoring
- Independent updates and rollbacks
- Better error isolation

### ✅ **Cost Optimization**
- Choose best hosting for each part
- Pay only for what you use
- Better resource utilization

## 📋 Migration Checklist

### Backend Migration
- [ ] Create backend repository
- [ ] Copy server files
- [ ] Update package.json
- [ ] Configure environment variables
- [ ] Update CORS settings
- [ ] Test API endpoints
- [ ] Deploy to chosen platform

### Frontend Migration
- [ ] Create frontend repository
- [ ] Copy React files
- [ ] Update package.json
- [ ] Configure API URL
- [ ] Update build configuration
- [ ] Test frontend functionality
- [ ] Deploy to chosen platform

### Integration Testing
- [ ] Test API communication
- [ ] Verify authentication flow
- [ ] Check CORS configuration
- [ ] Test all features
- [ ] Monitor performance

---

**🚀 Your FleetManager will be more scalable and maintainable with separate backend and frontend deployments!**
