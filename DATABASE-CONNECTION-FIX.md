# 🔧 Database Connection Fix for Render Deployment

## 🚨 **Current Issue**
Your FleetManager is deployed on Render but cannot connect to the Supabase database, resulting in:
- ❌ Health check failing
- ❌ API endpoints returning database errors
- ❌ `ENETUNREACH` connection errors

## 🎯 **Root Cause**
The `DATABASE_URL` environment variable is not configured in your Render deployment.

## 🛠️ **Solution Steps**

### **Step 1: Access Render Dashboard**
1. Go to: https://dashboard.render.com
2. Sign in to your account
3. Find your "FleetManager" service

### **Step 2: Configure Environment Variables**
1. Click on your FleetManager service
2. Go to the **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add these variables:

```
Key: DATABASE_URL
Value: postgresql://postgres:newnew@db.bfaaznkamabozpiyjych.supabase.co:5432/postgres
```

```
Key: NODE_ENV
Value: production
```

```
Key: PORT
Value: 10000
```

### **Step 3: Redeploy**
- Render will automatically redeploy after adding environment variables
- Wait for the deployment to complete (usually 2-3 minutes)

### **Step 4: Verify Fix**
After redeployment, test these endpoints:

1. **Health Check**: https://fleetmanager-oa1n.onrender.com/api/health
2. **Main App**: https://fleetmanager-oa1n.onrender.com
3. **API Root**: https://fleetmanager-oa1n.onrender.com/

## 🔍 **Alternative: Test Database Connection Locally**

If you want to test the database connection locally first:

```bash
# Set the environment variable
$env:DATABASE_URL="postgresql://postgres:newnew@db.bfaaznkamabozpiyjych.supabase.co:5432/postgres"

# Run the database check script
node scripts/check-database.js
```

## 🚀 **Expected Results After Fix**

✅ **Health Check**: Should return database status
✅ **API Endpoints**: Should work without database errors
✅ **Frontend**: Should load and function properly
✅ **Authentication**: Should work with database sessions

## 📞 **If Issues Persist**

If you still have issues after adding the environment variables:

1. **Check Supabase Dashboard**: Ensure your database is active
2. **Verify Database URL**: Double-check the connection string
3. **Check Supabase Settings**: Ensure external connections are allowed
4. **Contact Support**: Render or Supabase support if needed

## 🎉 **Success Indicators**

When the fix is successful, you should see:
- ✅ Health check returns `{"status":"healthy","database":"connected"}`
- ✅ API endpoints respond without database errors
- ✅ Frontend loads and functions properly
- ✅ No more `ENETUNREACH` errors in logs

---

**🎯 Your FleetManager will be fully functional once the database connection is established!**
