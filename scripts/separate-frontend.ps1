# Frontend Separation Script
Write-Host "Creating Frontend Repository..." -ForegroundColor Green

# Create frontend directory
$frontendDir = "fleetmanager-frontend"
if (Test-Path $frontendDir) {
    Remove-Item $frontendDir -Recurse -Force
}
New-Item -ItemType Directory -Path $frontendDir -Force

# Create subdirectories
New-Item -ItemType Directory -Path "$frontendDir/src" -Force
New-Item -ItemType Directory -Path "$frontendDir/src/components" -Force
New-Item -ItemType Directory -Path "$frontendDir/src/pages" -Force
New-Item -ItemType Directory -Path "$frontendDir/src/hooks" -Force
New-Item -ItemType Directory -Path "$frontendDir/src/utils" -Force
New-Item -ItemType Directory -Path "$frontendDir/src/types" -Force
New-Item -ItemType Directory -Path "$frontendDir/public" -Force

# Copy frontend files
Write-Host "Copying frontend files..." -ForegroundColor Yellow
Copy-Item "src/*" "$frontendDir/src/" -Recurse -Force
Copy-Item "public/*" "$frontendDir/public/" -Recurse -Force

# Copy configuration files
Copy-Item "vite.config.ts" "$frontendDir/"
Copy-Item "tailwind.config.js" "$frontendDir/"
Copy-Item "postcss.config.js" "$frontendDir/"
Copy-Item "index.html" "$frontendDir/"

# Create frontend package.json
$frontendPackageJson = @"
{
  "name": "fleetmanager-frontend",
  "version": "1.0.0",
  "description": "FleetManager Frontend",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.3.2",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2",
    "vite": "^5.4.19"
  }
}
"@

$frontendPackageJson | Out-File -FilePath "$frontendDir/package.json" -Encoding UTF8

# Create frontend README
$frontendReadme = @"
# FleetManager Frontend

## Description
Frontend application for FleetManager - Vehicle and Driver Management System

## Quick Start

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Environment Variables
Create a \`.env\` file:
\`\`\`env
VITE_API_URL=https://fleetmanager-backend.onrender.com
VITE_APP_NAME=FleetManager
\`\`\`

### Development
\`\`\`bash
npm run dev
\`\`\`

### Production Build
\`\`\`bash
npm run build
npm run preview
\`\`\`

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
3. Build command: \`npm run build\`
4. Output directory: \`dist\`

### Netlify
1. Connect GitHub repository
2. Build command: \`npm run build\`
3. Publish directory: \`dist\`

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Set source to GitHub Actions
3. Create workflow for automatic deployment
"@

$frontendReadme | Out-File -FilePath "$frontendDir/README.md" -Encoding UTF8

# Create frontend .env.example
$frontendEnvExample = @"
# API Configuration
VITE_API_URL=https://fleetmanager-backend.onrender.com

# Application Configuration
VITE_APP_NAME=FleetManager
"@

$frontendEnvExample | Out-File -FilePath "$frontendDir/.env.example" -Encoding UTF8

# Create .gitignore for frontend
$frontendGitignore = @"
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
"@

$frontendGitignore | Out-File -FilePath "$frontendDir/.gitignore" -Encoding UTF8

# Create vercel.json for frontend
$vercelJson = @"
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
"@

$vercelJson | Out-File -FilePath "$frontendDir/vercel.json" -Encoding UTF8

# Create API utility file
$apiUtil = @"
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
    config.headers.Authorization = \`Bearer \${token}\`;
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

export default api;
"@

$apiUtil | Out-File -FilePath "$frontendDir/src/utils/api.ts" -Encoding UTF8

Write-Host "Frontend repository created successfully!" -ForegroundColor Green
Write-Host "Location: $frontendDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. cd $frontendDir" -ForegroundColor Cyan
Write-Host "2. git init" -ForegroundColor Cyan
Write-Host "3. git add ." -ForegroundColor Cyan
Write-Host "4. git commit -m 'Initial frontend commit'" -ForegroundColor Cyan
Write-Host "5. Create GitHub repository: fleetmanager-frontend" -ForegroundColor Cyan
Write-Host "6. git remote add origin https://github.com/akuprof/fleetmanager-frontend.git" -ForegroundColor Cyan
Write-Host "7. git push -u origin main" -ForegroundColor Cyan
