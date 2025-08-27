# 🏗️ FleetManager Architecture & Deployment Guide

## 📋 **Current Architecture**

### **Frontend (React)**
- **Location**: `client/` directory
- **Framework**: React + Vite + TypeScript
- **UI**: Tailwind CSS + Radix UI components
- **Build Output**: `dist/public/` (static files)

### **Backend (Express.js)**
- **Location**: `server/` directory
- **Framework**: Express.js + TypeScript
- **API**: RESTful endpoints
- **Database**: Supabase PostgreSQL with Drizzle ORM

### **Database**
- **Provider**: Supabase
- **Type**: PostgreSQL
- **ORM**: Drizzle ORM

## 🚀 **Deployment Options**

### **Option 1: Render (Full-Stack) - RECOMMENDED**
**Deploy both frontend and backend together on Render**

#### **Advantages:**
- ✅ Single deployment
- ✅ No CORS issues
- ✅ Shared domain
- ✅ Easier management

#### **How it works:**
1. **Build Process**: Vite builds frontend → `dist/public/`
2. **Server**: Express serves static files + API endpoints
3. **Single URL**: Everything accessible from one domain

#### **Deployment Steps:**
1. **Render Dashboard**: https://dashboard.render.com
2. **New Web Service** → Connect GitHub repo
3. **Build Command**: `npm run build`
4. **Start Command**: `npm run start`
5. **Environment Variables**:
   ```
   DATABASE_URL=postgresql://postgres:newnew@db.bfaaznkamabozpiyjych.supabase.co:5432/postgres
   SESSION_SECRET=fleetmanager-secret-key-2024
   NODE_ENV=production
   PORT=10000
   ```

#### **Result:**
- **Frontend**: `https://fleetmanager.onrender.com/`
- **API**: `https://fleetmanager.onrender.com/api/*`
- **Health Check**: `https://fleetmanager.onrender.com/api/health`

### **Option 2: Separate Deployments**
**Deploy frontend and backend separately**

#### **Frontend (Vercel/Netlify)**
- **Build**: `npm run build:frontend`
- **Deploy**: Static files to Vercel/Netlify
- **URL**: `https://fleetmanager-frontend.vercel.app`

#### **Backend (Render/Railway)**
- **Build**: `npm run build:backend`
- **Deploy**: API server to Render/Railway
- **URL**: `https://fleetmanager-api.onrender.com`

#### **CORS Configuration Required:**
```javascript
// Backend CORS setup
app.use(cors({
  origin: ['https://fleetmanager-frontend.vercel.app'],
  credentials: true
}));
```

## 🔧 **Current Issues & Solutions**

### **Issue 1: Local Development Port Binding**
**Error**: `ENOTSUP: operation not supported on socket 0.0.0.0:5000`

**Solution**: Update server configuration for local development

### **Issue 2: Vercel Serverless Limitations**
**Error**: `FUNCTION_INVOCATION_FAILED`

**Solution**: Use Render instead of Vercel for full-stack apps

### **Issue 3: Build Tool Dependencies**
**Error**: `vite: not found`

**Solution**: ✅ **FIXED** - Moved build tools to dependencies

## 🎯 **Recommended Approach: Option 1 (Render Full-Stack)**

### **Why This is Best:**
1. **Simpler**: One deployment, one URL
2. **No CORS**: Frontend and backend on same domain
3. **Cost Effective**: Single service instead of two
4. **Easier Management**: One dashboard, one set of logs

### **How It Works:**
```
User Request → Render → Express Server
                    ├── Static Files (React Frontend)
                    └── API Endpoints (Express Backend)
```

### **File Structure:**
```
fleetmanager/
├── client/           # React frontend
├── server/           # Express backend
├── shared/           # Shared types/schema
├── dist/
│   ├── public/       # Built frontend (served by Express)
│   └── index.js      # Built backend
└── package.json
```

## 🚀 **Next Steps**

### **Immediate Action:**
1. **Deploy to Render** using Option 1
2. **Test all endpoints** after deployment
3. **Verify frontend and backend** work together

### **Alternative:**
1. **Fix local development** first
2. **Test locally** before deploying
3. **Then deploy to Render**

## 🔗 **Quick Links**

- **Render Dashboard**: https://dashboard.render.com
- **GitHub Repository**: https://github.com/akuprof/fleetmanager
- **Supabase Dashboard**: https://supabase.com/dashboard

---

**🎯 Recommendation: Use Option 1 (Render Full-Stack) for the best experience!**
