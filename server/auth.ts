import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Flexible authentication system for different environments
export function getEnvironmentInfo() {
  const isReplit = !!(process.env.REPL_ID && process.env.REPL_OWNER);
  const isVercel = !!(process.env.VERCEL || process.env.NEXTAUTH_SECRET);
  const isLocal = process.env.NODE_ENV === 'development';
  
  return {
    isReplit,
    isVercel,
    isLocal,
    environment: isReplit ? 'replit' : isVercel ? 'vercel' : 'local'
  };
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  // Use PostgreSQL session store if DATABASE_URL is available
  if (process.env.DATABASE_URL) {
    const pgStore = connectPg(session);
    const sessionStore = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      ttl: sessionTtl,
      tableName: "sessions",
    });
    
    return session({
      secret: process.env.SESSION_SECRET || 'fleetmanager-secret-key',
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: sessionTtl,
      },
    });
  }
  
  // Fallback to memory store for development
  return session({
    secret: process.env.SESSION_SECRET || 'fleetmanager-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: sessionTtl,
    },
  });
}

// Mock user for development/testing
export function getMockUser() {
  return {
    id: 'dev-user-001',
    email: 'admin@fleetmanager.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    claims: {
      sub: 'dev-user-001',
      email: 'admin@fleetmanager.com',
      first_name: 'Admin',
      last_name: 'User'
    }
  };
}

// Setup authentication based on environment
export async function setupAuth(app: Express) {
  const env = getEnvironmentInfo();
  
  app.set("trust proxy", 1);
  app.use(getSession());
  
  console.log(`🔐 Authentication setup for environment: ${env.environment}`);
  
  if (env.isReplit) {
    // Use Replit authentication
    console.log('✅ Using Replit authentication');
    const { setupAuth: setupReplitAuth } = await import('./replitAuth');
    await setupReplitAuth(app);
  } else {
    // Use simplified authentication for Vercel/local
    console.log('✅ Using simplified authentication');
    await setupSimpleAuth(app);
  }
}

// Simple authentication for Vercel/local environments
async function setupSimpleAuth(app: Express) {
  // Create a mock user session for development
  app.use((req, res, next) => {
    if (!req.session.user) {
      req.session.user = getMockUser();
    }
    req.user = req.session.user;
    next();
  });
  
  // Mock authentication endpoints
  app.get("/api/auth/user", (req, res) => {
    res.json(req.user || getMockUser());
  });
  
  app.get("/api/login", (req, res) => {
    // Mock login - just set the user
    req.session.user = getMockUser();
    res.json({ message: "Logged in successfully", user: req.session.user });
  });
  
  app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/callback", (req, res) => {
    // Mock callback
    res.redirect("/");
  });
}

// Flexible authentication middleware
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const env = getEnvironmentInfo();
  
  if (env.isReplit) {
    // Use Replit authentication middleware
    const { isAuthenticated: replitAuth } = await import('./replitAuth');
    return replitAuth(req, res, next);
  } else {
    // Use simplified authentication
    if (req.session && req.session.user) {
      req.user = req.session.user;
      return next();
    }
    
    // For API requests, return JSON error
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // For web requests, redirect to login
    return res.redirect('/api/login');
  }
};

// Optional authentication for public endpoints
export const optionalAuth: RequestHandler = async (req, res, next) => {
  const env = getEnvironmentInfo();
  
  if (env.isReplit) {
    // Use Replit authentication if available
    try {
      const { isAuthenticated: replitAuth } = await import('./replitAuth');
      return replitAuth(req, res, next);
    } catch (error) {
      // Fallback to mock user
      req.user = getMockUser();
      return next();
    }
  } else {
    // Use session user or mock user
    req.user = req.session?.user || getMockUser();
    return next();
  }
};
