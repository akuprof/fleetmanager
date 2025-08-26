# FleetManager Deployment Guide

This guide covers multiple deployment options for the FleetManager application.

## Prerequisites

- Node.js 20 or higher
- npm or yarn
- PostgreSQL database (Neon, Supabase, or self-hosted)
- Git repository

## Environment Variables

Set the following environment variables:

```bash
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
PORT=5000
```

## Deployment Options

### 1. Replit Deployment (Recommended)

Your application is already configured for Replit deployment.

**Steps:**
1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Create a new Replit project and import from your Git repository
3. Set up environment variables in Replit's Secrets tab:
   - `DATABASE_URL`: Your PostgreSQL connection string
4. Deploy using Replit's deployment system

**Advantages:**
- Zero configuration required
- Built-in PostgreSQL database
- Automatic scaling
- Free tier available

### 2. Vercel Deployment

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy
4. Set environment variables in Vercel dashboard

**Advantages:**
- Excellent performance
- Global CDN
- Automatic deployments from Git
- Free tier available

### 3. Railway Deployment

**Steps:**
1. Connect your GitHub repository to Railway
2. Railway will automatically detect the configuration
3. Set environment variables in Railway dashboard
4. Deploy

**Advantages:**
- Simple deployment process
- Built-in PostgreSQL
- Automatic deployments
- Reasonable pricing

### 4. Docker Deployment

**Local Development:**
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build and run manually
docker build -t fleetmanager .
docker run -p 5000:5000 -e DATABASE_URL=your_db_url fleetmanager
```

**Production:**
```bash
# Build the image
docker build -t fleetmanager .

# Run with environment variables
docker run -d \
  -p 5000:5000 \
  -e DATABASE_URL=your_db_url \
  -e NODE_ENV=production \
  --name fleetmanager \
  fleetmanager
```

### 5. Manual Deployment

**Steps:**
1. Run the deployment script: `./deploy.sh`
2. Set environment variables
3. Start the application: `npm run start`

## Database Setup

### Option 1: Neon (Recommended)
1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Set as `DATABASE_URL`

### Option 2: Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Set as `DATABASE_URL`

### Option 3: Self-hosted PostgreSQL
1. Install PostgreSQL on your server
2. Create a database
3. Set up user and permissions
4. Use connection string format: `postgresql://user:password@host:port/database`

## Database Migration

After setting up your database, run the migration:

```bash
npm run db:push
```

This will create all the necessary tables and schemas.

## Health Check

Your application will be available at:
- **Local**: http://localhost:5000
- **Production**: Your deployment URL

## Monitoring

- Check application logs for errors
- Monitor database connections
- Set up uptime monitoring
- Configure error tracking (Sentry, etc.)

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **Database**: Use strong passwords and SSL connections
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure CORS properly for your domain
5. **Rate Limiting**: Consider implementing rate limiting
6. **Authentication**: Ensure proper authentication is configured

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check `DATABASE_URL` format
   - Ensure database is accessible
   - Verify network connectivity

2. **Build Failures**
   - Check Node.js version (requires 20+)
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

3. **Port Already in Use**
   - Change PORT environment variable
   - Kill existing processes on port 5000

4. **Permission Denied**
   - Check file permissions
   - Run with appropriate user permissions

### Support

For deployment issues:
1. Check the application logs
2. Verify environment variables
3. Test database connectivity
4. Review the error messages in the console
