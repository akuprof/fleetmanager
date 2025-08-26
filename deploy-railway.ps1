# Railway Deployment Script for FleetManager
Write-Host "🚀 Railway Deployment Setup for FleetManager" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

Write-Host ""
Write-Host "Step 1: Install Railway CLI (if not already installed)" -ForegroundColor Yellow
Write-Host "Run: npm install -g @railway/cli" -ForegroundColor Cyan

Write-Host ""
Write-Host "Step 2: Login to Railway" -ForegroundColor Yellow
Write-Host "Run: railway login" -ForegroundColor Cyan

Write-Host ""
Write-Host "Step 3: Initialize Railway Project" -ForegroundColor Yellow
Write-Host "Run: railway init" -ForegroundColor Cyan

Write-Host ""
Write-Host "Step 4: Set Environment Variables" -ForegroundColor Yellow
Write-Host "You'll need to set these environment variables in Railway dashboard:" -ForegroundColor Cyan
Write-Host "  - DATABASE_URL: postgresql://postgres:newnew@db.bfaaznkamabozpiyjych.supabase.co:5432/postgres" -ForegroundColor White
Write-Host "  - SESSION_SECRET: (your session secret)" -ForegroundColor White
Write-Host "  - NODE_ENV: production" -ForegroundColor White

Write-Host ""
Write-Host "Step 5: Deploy to Railway" -ForegroundColor Yellow
Write-Host "Run: railway up" -ForegroundColor Cyan

Write-Host ""
Write-Host "Step 6: Get Your Railway URL" -ForegroundColor Yellow
Write-Host "Run: railway domain" -ForegroundColor Cyan

Write-Host ""
Write-Host "🎉 Your FleetManager will be live at: https://your-app-name.railway.app" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Quick Commands:" -ForegroundColor Yellow
Write-Host "  railway login          - Login to Railway" -ForegroundColor Cyan
Write-Host "  railway init           - Initialize project" -ForegroundColor Cyan
Write-Host "  railway up             - Deploy to Railway" -ForegroundColor Cyan
Write-Host "  railway logs           - View deployment logs" -ForegroundColor Cyan
Write-Host "  railway domain         - Get your app URL" -ForegroundColor Cyan
Write-Host "  railway open           - Open in browser" -ForegroundColor Cyan

Write-Host ""
Write-Host "🔗 Railway Dashboard: https://railway.app/dashboard" -ForegroundColor Blue
Write-Host "📚 Railway Docs: https://docs.railway.app" -ForegroundColor Blue
