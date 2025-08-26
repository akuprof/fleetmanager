# Backend Separation Script
Write-Host "Creating Backend Repository..." -ForegroundColor Green

# Create backend directory
$backendDir = "fleetmanager-backend"
if (Test-Path $backendDir) {
    Remove-Item $backendDir -Recurse -Force
}
New-Item -ItemType Directory -Path $backendDir -Force

# Create subdirectories
New-Item -ItemType Directory -Path "$backendDir/server" -Force
New-Item -ItemType Directory -Path "$backendDir/shared" -Force
New-Item -ItemType Directory -Path "$backendDir/migrations" -Force
New-Item -ItemType Directory -Path "$backendDir/scripts" -Force
New-Item -ItemType Directory -Path "$backendDir/drizzle" -Force

# Copy backend files
Write-Host "Copying backend files..." -ForegroundColor Yellow
Copy-Item "server/*" "$backendDir/server/" -Recurse -Force
Copy-Item "shared/*" "$backendDir/shared/" -Recurse -Force
Copy-Item "migrations/*" "$backendDir/migrations/" -Recurse -Force
Copy-Item "drizzle/*" "$backendDir/drizzle/" -Recurse -Force
Copy-Item "scripts/create-sessions-table.js" "$backendDir/scripts/" -Force

# Copy configuration files
Copy-Item "tsconfig.json" "$backendDir/"
Copy-Item "drizzle.config.ts" "$backendDir/"
Copy-Item "railway.toml" "$backendDir/"
Copy-Item "render.yaml" "$backendDir/"
Copy-Item "Dockerfile" "$backendDir/"
Copy-Item "docker-compose.yml" "$backendDir/"

# Create backend package.json
$backendPackageJson = @"
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
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
"@

$backendPackageJson | Out-File -FilePath "$backendDir/package.json" -Encoding UTF8

# Create backend README
$backendReadme = @"
# FleetManager Backend API

## Description
Backend API for FleetManager - Vehicle and Driver Management System

## Quick Start

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Environment Variables
Create a \`.env\` file:
\`\`\`env
DATABASE_URL=postgresql://postgres:newnew@db.bfaaznkamabozpiyjych.supabase.co:5432/postgres
SESSION_SECRET=fleetmanager-secret-key-2024
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://fleetmanager-frontend.vercel.app
\`\`\`

### Development
\`\`\`bash
npm run dev
\`\`\`

### Production Build
\`\`\`bash
npm run build
npm run start
\`\`\`

## API Endpoints

- \`GET /api/health\` - Health check
- \`GET /api/auth/user\` - Get current user
- \`GET /api/auth/status\` - Authentication status
- \`GET /api/vehicles\` - List vehicles
- \`GET /api/drivers\` - List drivers

## Deployment

### Render
1. Connect GitHub repository
2. Set environment variables
3. Build command: \`npm run build\`
4. Start command: \`npm run start\`

### Railway
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically
"@

$backendReadme | Out-File -FilePath "$backendDir/README.md" -Encoding UTF8

# Create backend .env.example
$backendEnvExample = @"
# Database Configuration
DATABASE_URL=postgresql://postgres:newnew@db.bfaaznkamabozpiyjych.supabase.co:5432/postgres

# Session Configuration
SESSION_SECRET=fleetmanager-secret-key-2024

# Environment
NODE_ENV=production

# Server Configuration
PORT=5000

# CORS Configuration
CORS_ORIGIN=https://fleetmanager-frontend.vercel.app
"@

$backendEnvExample | Out-File -FilePath "$backendDir/.env.example" -Encoding UTF8

# Create .gitignore for backend
$backendGitignore = @"
node_modules/
dist/
.env
.env.local
.env.production
*.log
.DS_Store
"@

$backendGitignore | Out-File -FilePath "$backendDir/.gitignore" -Encoding UTF8

Write-Host "Backend repository created successfully!" -ForegroundColor Green
Write-Host "Location: $backendDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. cd $backendDir" -ForegroundColor Cyan
Write-Host "2. git init" -ForegroundColor Cyan
Write-Host "3. git add ." -ForegroundColor Cyan
Write-Host "4. git commit -m 'Initial backend commit'" -ForegroundColor Cyan
Write-Host "5. Create GitHub repository: fleetmanager-backend" -ForegroundColor Cyan
Write-Host "6. git remote add origin https://github.com/akuprof/fleetmanager-backend.git" -ForegroundColor Cyan
Write-Host "7. git push -u origin main" -ForegroundColor Cyan
