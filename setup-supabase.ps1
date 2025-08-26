
# FleetManager Supabase Setup Script
Write-Host "Setting up FleetManager with Supabase..." -ForegroundColor Green

# Function to get user input
function Get-UserInput {
    param([string]$Prompt, [string]$DefaultValue = "")
    
    if ($DefaultValue) {
        $input = Read-Host "$Prompt [$DefaultValue]"
        if (-not $input) { $input = $DefaultValue }
    } else {
        $input = Read-Host $Prompt
    }
    return $input
}

Write-Host ""
Write-Host "Supabase Setup Instructions:" -ForegroundColor Yellow
Write-Host "1. Go to https://supabase.com and create a free account" -ForegroundColor White
Write-Host "2. Create a new project called 'fleetmanager'" -ForegroundColor White
Write-Host "3. Go to Project Settings > Database" -ForegroundColor White
Write-Host "4. Copy the connection string" -ForegroundColor White
Write-Host ""

# Get Supabase connection string
$connectionString = Get-UserInput "Enter your Supabase connection string"

if (-not $connectionString) {
    Write-Host "No connection string provided. Setup cancelled." -ForegroundColor Red
    exit 1
}

# Validate connection string format
if ($connectionString -notmatch "postgresql://postgres:.*@db\..*\.supabase\.co:5432/postgres") {
    Write-Host "Warning: Connection string format doesn't match expected Supabase format." -ForegroundColor Yellow
    Write-Host "Expected: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" -ForegroundColor Cyan
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

# Set environment variable
$env:DATABASE_URL = $connectionString

Write-Host ""
Write-Host "Environment variable set successfully!" -ForegroundColor Green
Write-Host "DATABASE_URL = $connectionString" -ForegroundColor Cyan

# Test database connection
Write-Host ""
Write-Host "Testing database connection..." -ForegroundColor Yellow

try {
    # Run database migration
    npm run db:push
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Supabase setup completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Database tables created" -ForegroundColor Green
        Write-Host "FleetManager is ready to use!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Access your application at: http://localhost:5000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "You can now:" -ForegroundColor Yellow
        Write-Host "   - Add vehicles to your fleet" -ForegroundColor White
        Write-Host "   - Register drivers" -ForegroundColor White
        Write-Host "   - Track trips and expenses" -ForegroundColor White
        Write-Host "   - Monitor fleet performance" -ForegroundColor White
    } else {
        Write-Host "Database setup failed. Please check your connection string." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error testing database connection: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Save to .env file for future use
Write-Host ""
Write-Host "Saving configuration..." -ForegroundColor Yellow
$envContent = @"
# FleetManager Supabase Configuration
DATABASE_URL=$connectionString
NODE_ENV=production
PORT=5000
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8
Write-Host "Configuration saved to .env file" -ForegroundColor Green

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Start your application: npm run start" -ForegroundColor White
Write-Host "2. Open http://localhost:5000 in your browser" -ForegroundColor White
Write-Host "3. Begin using your FleetManager application!" -ForegroundColor White