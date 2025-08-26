# FleetManager Database Setup Script
Write-Host "🚀 Setting up FleetManager Database..." -ForegroundColor Green

# Check if DATABASE_URL is set
if (-not $env:DATABASE_URL) {
    Write-Host "❌ DATABASE_URL environment variable is not set!" -ForegroundColor Red
    Write-Host "Please set your database URL first:" -ForegroundColor Yellow
    Write-Host "  `$env:DATABASE_URL = 'your_database_connection_string'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Database options:" -ForegroundColor Yellow
    Write-Host "  1. Neon (neon.tech) - Free PostgreSQL hosting" -ForegroundColor White
    Write-Host "  2. Supabase (supabase.com) - Free PostgreSQL hosting" -ForegroundColor White
    Write-Host "  3. Local PostgreSQL installation" -ForegroundColor White
    exit 1
}

Write-Host "✅ DATABASE_URL is set" -ForegroundColor Green

# Run database migration
Write-Host "📊 Running database migration..." -ForegroundColor Yellow
npm run db:push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Your FleetManager application is ready!" -ForegroundColor Green
    Write-Host "   Access it at: http://localhost:5000" -ForegroundColor Cyan
} else {
    Write-Host "❌ Database setup failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}
