# FleetManager Docker Deployment Script
Write-Host "🐳 Starting FleetManager Docker Deployment..." -ForegroundColor Green

# Check if Docker is running
Write-Host "🔍 Checking Docker status..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    Write-Host "   Starting Docker Desktop..." -ForegroundColor Yellow
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    Write-Host "   Please wait for Docker Desktop to start and run this script again." -ForegroundColor Yellow
    exit 1
}

# Check if DATABASE_URL is set
if (-not $env:DATABASE_URL) {
    Write-Host "⚠️  DATABASE_URL not set. Using local PostgreSQL container." -ForegroundColor Yellow
    Write-Host "   For production, set DATABASE_URL environment variable." -ForegroundColor Yellow
}

# Stop any existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose down 2>$null

# Build and start containers
Write-Host "🔨 Building and starting containers..." -ForegroundColor Yellow
docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker deployment completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Your FleetManager application is running!" -ForegroundColor Green
    Write-Host "   Access it at: http://localhost:5000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📊 Container status:" -ForegroundColor Yellow
    docker-compose ps
    Write-Host ""
    Write-Host "📝 View logs: docker-compose logs -f app" -ForegroundColor Cyan
    Write-Host "🛑 Stop containers: docker-compose down" -ForegroundColor Cyan
} else {
    Write-Host "❌ Docker deployment failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}
