#!/bin/bash

# FleetManager Deployment Script
echo "🚀 Starting FleetManager deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  Warning: DATABASE_URL environment variable is not set."
    echo "   You'll need to set this before running the application."
    echo "   Example: export DATABASE_URL='postgresql://user:password@host:port/database'"
fi

echo "🎉 Deployment preparation completed!"
echo ""
echo "Next steps:"
echo "1. Set your DATABASE_URL environment variable"
echo "2. Run 'npm run start' to start the application"
echo "3. Or use Docker: 'docker-compose up -d'"
echo "4. Or deploy to your preferred platform using the configuration files provided"
