# Railway Deployment Script for FleetManager
Write-Host "🚀 Railway Deployment Guide for FleetManager" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Prerequisites:" -ForegroundColor Yellow
Write-Host "1. Railway account: https://railway.app"
Write-Host "2. GitHub repository connected"
Write-Host "3. Environment variables ready"

Write-Host ""
Write-Host "🔧 Step 1: Install Railway CLI" -ForegroundColor Cyan
Write-Host "npm install -g @railway/cli" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Step 2: Login to Railway" -ForegroundColor Cyan
Write-Host "railway login" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Step 3: Initialize Railway Project" -ForegroundColor Cyan
Write-Host "railway init" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Step 4: Set Environment Variables" -ForegroundColor Cyan
Write-Host "railway variables set DATABASE_URL=postgresql://postgres:newnew@db.bfaaznkamabozpiyjych.supabase.co:5432/postgres" -ForegroundColor White
Write-Host "railway variables set NODE_ENV=production" -ForegroundColor White
Write-Host "railway variables set SESSION_SECRET=your-session-secret-here" -ForegroundColor White
Write-Host "railway variables set REPLIT_DOMAINS=localhost:5000" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Step 5: Deploy to Railway" -ForegroundColor Cyan
Write-Host "railway up" -ForegroundColor White

Write-Host ""
Write-Host "🔧 Step 6: Get Deployment URL" -ForegroundColor Cyan
Write-Host "railway domain" -ForegroundColor White

Write-Host ""
Write-Host "🎯 Alternative: Deploy via Railway Dashboard" -ForegroundColor Green
Write-Host "1. Go to https://railway.app"
Write-Host "2. Click 'New Project'"
Write-Host "3. Select 'Deploy from GitHub repo'"
Write-Host "4. Choose your repository: akuprof/fleetmanager"
Write-Host "5. Railway will auto-detect the configuration"
Write-Host "6. Add environment variables in the Variables tab"

Write-Host ""
Write-Host "📊 Environment Variables to Set:" -ForegroundColor Yellow
Write-Host "DATABASE_URL=postgresql://postgres:newnew@db.bfaaznkamabozpiyjych.supabase.co:5432/postgres" -ForegroundColor White
Write-Host "NODE_ENV=production" -ForegroundColor White
Write-Host "SESSION_SECRET=your-secure-session-secret" -ForegroundColor White
Write-Host "REPLIT_DOMAINS=localhost:5000" -ForegroundColor White

Write-Host ""
Write-Host "✅ Railway Advantages:" -ForegroundColor Green
Write-Host "- Better session handling than Vercel" -ForegroundColor White
Write-Host "- Built-in PostgreSQL support" -ForegroundColor White
Write-Host "- Automatic HTTPS" -ForegroundColor White
Write-Host "- Easy environment variable management" -ForegroundColor White
Write-Host "- Better for full-stack applications" -ForegroundColor White

Write-Host ""
Write-Host "🔍 Test Commands:" -ForegroundColor Cyan
Write-Host "curl https://your-railway-url.railway.app/api/health" -ForegroundColor White
Write-Host "curl https://your-railway-url.railway.app/" -ForegroundColor White

Write-Host ""
Write-Host "📞 Support:" -ForegroundColor Yellow
Write-Host "Railway Docs: https://docs.railway.app" -ForegroundColor White
Write-Host "Railway Dashboard: https://railway.app/dashboard" -ForegroundColor White
