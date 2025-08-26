# Render Deployment Script for FleetManager
Write-Host "🚀 Render Deployment Guide for FleetManager" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Prerequisites:" -ForegroundColor Yellow
Write-Host "1. Render account: https://render.com"
Write-Host "2. GitHub repository connected"
Write-Host "3. Environment variables ready"

Write-Host ""
Write-Host "🎯 Step-by-Step Deployment:" -ForegroundColor Cyan
Write-Host "1. Go to https://render.com/dashboard" -ForegroundColor White
Write-Host "2. Click 'New +' button" -ForegroundColor White
Write-Host "3. Select 'Web Service'" -ForegroundColor White
Write-Host "4. Connect your GitHub repository: akuprof/fleetmanager" -ForegroundColor White
Write-Host "5. Configure the service:" -ForegroundColor White

Write-Host ""
Write-Host "⚙️ Service Configuration:" -ForegroundColor Yellow
Write-Host "Name: fleetmanager-backend" -ForegroundColor White
Write-Host "Environment: Node" -ForegroundColor White
Write-Host "Build Command: npm install; npm run build" -ForegroundColor White
Write-Host "Start Command: npm run start" -ForegroundColor White
Write-Host "Plan: Free" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Environment Variables to Add:" -ForegroundColor Cyan
Write-Host "DATABASE_URL=postgresql://postgres:newnew@db.bfaaznkamabozpiyjych.supabase.co:5432/postgres" -ForegroundColor White
Write-Host "NODE_ENV=production" -ForegroundColor White
Write-Host "SESSION_SECRET=your-secure-session-secret-here" -ForegroundColor White
Write-Host "REPLIT_DOMAINS=localhost:5000" -ForegroundColor White

Write-Host ""
Write-Host "✅ Render Advantages:" -ForegroundColor Green
Write-Host "- Generous free tier" -ForegroundColor White
Write-Host "- Excellent Node.js support" -ForegroundColor White
Write-Host "- Automatic HTTPS" -ForegroundColor White
Write-Host "- Easy environment variable management" -ForegroundColor White
Write-Host "- Built-in PostgreSQL database option" -ForegroundColor White
Write-Host "- Custom domains support" -ForegroundColor White

Write-Host ""
Write-Host "🔍 Test Commands:" -ForegroundColor Cyan
Write-Host "curl https://your-app-name.onrender.com/api/health" -ForegroundColor White
Write-Host "curl https://your-app-name.onrender.com/" -ForegroundColor White

Write-Host ""
Write-Host "📞 Support:" -ForegroundColor Yellow
Write-Host "Render Docs: https://render.com/docs" -ForegroundColor White
Write-Host "Render Dashboard: https://render.com/dashboard" -ForegroundColor White
