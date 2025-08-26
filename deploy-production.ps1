# FleetManager Production Deployment Script
Write-Host "Production Deployment Options:" -ForegroundColor Green
Write-Host ""

Write-Host "1. Vercel (Recommended)" -ForegroundColor Yellow
Write-Host "   - Already deployed to: https://fleet-manager-o7r5tzev5-akuprofs-projects.vercel.app" -ForegroundColor Cyan
Write-Host "   - Environment variables configured" -ForegroundColor Green
Write-Host ""

Write-Host "2. Railway" -ForegroundColor Yellow
Write-Host "   - Connect GitHub repo to Railway" -ForegroundColor White
Write-Host "   - Auto-deploys on push" -ForegroundColor White
Write-Host ""

Write-Host "3. Docker" -ForegroundColor Yellow
Write-Host "   - Build and deploy container" -ForegroundColor White
Write-Host ""

Write-Host "4. Manual Server" -ForegroundColor Yellow
Write-Host "   - Deploy to your own server" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Select deployment option (1-4)"

switch ($choice) {
    "1" {
        Write-Host "Deploying to Vercel..." -ForegroundColor Green
        vercel --prod
    }
    "2" {
        Write-Host "Railway Deployment Instructions:" -ForegroundColor Green
        Write-Host "1. Go to https://railway.app" -ForegroundColor White
        Write-Host "2. Connect your GitHub repository" -ForegroundColor White
        Write-Host "3. Railway will auto-detect the configuration" -ForegroundColor White
        Write-Host "4. Set environment variables in Railway dashboard" -ForegroundColor White
    }
    "3" {
        Write-Host "Building Docker image..." -ForegroundColor Green
        docker build -t fleetmanager-prod .
        Write-Host "Docker image built. Run with:" -ForegroundColor Yellow
        Write-Host "docker run -d -p 5000:5000 -e DATABASE_URL=your_db_url fleetmanager-prod" -ForegroundColor Cyan
    }
    "4" {
        Write-Host "Manual Deployment Steps:" -ForegroundColor Green
        Write-Host "1. Upload files to your server" -ForegroundColor White
        Write-Host "2. Install dependencies: npm install" -ForegroundColor White
        Write-Host "3. Build application: npm run build" -ForegroundColor White
        Write-Host "4. Set environment variables" -ForegroundColor White
        Write-Host "5. Start application: npm run start" -ForegroundColor White
    }
    default {
        Write-Host "Invalid choice. Please select 1-4." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Production URLs:" -ForegroundColor Green
Write-Host "- Vercel: https://fleet-manager-o7r5tzev5-akuprofs-projects.vercel.app" -ForegroundColor Cyan
Write-Host "- Frontend: https://final-theta-ochre.vercel.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "Environment Variables Set:" -ForegroundColor Green
Write-Host "- DATABASE_URL: Supabase PostgreSQL" -ForegroundColor White
Write-Host "- NODE_ENV: production" -ForegroundColor White
Write-Host "- REPLIT_DOMAINS: configured" -ForegroundColor White
