# Render Deployment Script for FleetManager
Write-Host "Render Deployment Setup for FleetManager" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

Write-Host ""
Write-Host "Step 1: Go to Render Dashboard" -ForegroundColor Yellow
Write-Host "Visit: https://dashboard.render.com" -ForegroundColor Cyan

Write-Host ""
Write-Host "Step 2: Create New Web Service" -ForegroundColor Yellow
Write-Host "1. Click 'New +'" -ForegroundColor Cyan
Write-Host "2. Select 'Web Service'" -ForegroundColor Cyan
Write-Host "3. Connect your GitHub repository: https://github.com/akuprof/fleetmanager" -ForegroundColor Cyan

Write-Host ""
Write-Host "Step 3: Configure Service" -ForegroundColor Yellow
Write-Host "Service Name: fleetmanager" -ForegroundColor Cyan
Write-Host "Environment: Node" -ForegroundColor Cyan
Write-Host "Build Command: npm run build" -ForegroundColor Cyan
Write-Host "Start Command: npm run start" -ForegroundColor Cyan

Write-Host ""
Write-Host "Step 4: Set Environment Variables" -ForegroundColor Yellow
Write-Host "Add these environment variables in Render dashboard:" -ForegroundColor Cyan
Write-Host "  - DATABASE_URL: postgresql://postgres:newnew@db.bfaaznkamabozpiyjych.supabase.co:5432/postgres" -ForegroundColor White
Write-Host "  - SESSION_SECRET: fleetmanager-secret-key-2024" -ForegroundColor White
Write-Host "  - NODE_ENV: production" -ForegroundColor White
Write-Host "  - PORT: 10000" -ForegroundColor White

Write-Host ""
Write-Host "Step 5: Deploy" -ForegroundColor Yellow
Write-Host "Click 'Create Web Service' to start deployment" -ForegroundColor Cyan

Write-Host ""
Write-Host "Your FleetManager will be live at: https://fleetmanager.onrender.com" -ForegroundColor Green

Write-Host ""
Write-Host "Alternative: Deploy via Render CLI" -ForegroundColor Yellow
Write-Host "1. Install Render CLI: npm install -g @render/cli" -ForegroundColor Cyan
Write-Host "2. Login: render login" -ForegroundColor Cyan
Write-Host "3. Deploy: render deploy" -ForegroundColor Cyan

Write-Host ""
Write-Host "Render Dashboard: https://dashboard.render.com" -ForegroundColor Blue
Write-Host "Render Docs: https://render.com/docs" -ForegroundColor Blue
