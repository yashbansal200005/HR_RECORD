# 🚀 Deployment Guide - HR Management Dashboard

This guide will walk you through deploying both the frontend and backend to Vercel.

---

## 📋 Prerequisites

Before deploying, make sure you have:

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Atlas Account** - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
4. **Node.js** - Installed on your local machine (for testing)

---

## 🔧 Step 1: Setup MongoDB Atlas

1. **Create a MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Create" or "Build a Database"
   - Choose the **FREE (M0)** tier
   - Select a cloud provider and region (choose closest to you)
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Username: `admin` (or your choice)
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Atlas admin"
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for Vercel deployment)
   - Or add specific IPs: `0.0.0.0/0`
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<username>` and `<password>` with your database user credentials
   - Add database name at the end: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hr-database?retryWrites=true&w=majority`

---

## 🔐 Step 2: Prepare Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` folder (for local testing):

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hr-database?retryWrites=true&w=majority
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
ADMIN_USER=admin
ADMIN_PASS=your-admin-password
NODE_ENV=production
```

**Important:** 
- Replace `username`, `password`, and cluster URL with your MongoDB Atlas credentials
- `JWT_SECRET` should be a long random string (at least 32 characters)
- `ADMIN_USER` and `ADMIN_PASS` are your login credentials for the app

### Frontend Environment Variables

Create a `.env` file in the `frontend` folder (for local testing):

```env
REACT_APP_API_URL=http://localhost:5001/api
```

**Note:** This will be set in Vercel after backend deployment.

---

## 🌐 Step 3: Deploy Backend to Vercel

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Backend Project**
   - **Root Directory:** Select `backend` folder
   - **Framework Preset:** Other
   - **Build Command:** Leave empty (or `npm install`)
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   | Name | Value |
   |------|-------|
   | `MONGODB_URI` | Your MongoDB connection string |
   | `JWT_SECRET` | Your JWT secret key |
   | `ADMIN_USER` | Your admin username |
   | `ADMIN_PASS` | Your admin password |
   | `PORT` | `5001` (optional, Vercel handles this) |
   | `NODE_ENV` | `production` |

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - **Copy the deployment URL** (e.g., `https://your-backend.vercel.app`)

---

## 🎨 Step 4: Deploy Frontend to Vercel

1. **Create New Vercel Project for Frontend**
   - In Vercel dashboard, click "Add New..." → "Project"
   - Import the same GitHub repository (or create a separate repo for frontend)

2. **Configure Frontend Project**
   - **Root Directory:** Select `frontend` folder
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `build` (auto-detected)
   - **Install Command:** `npm install`

3. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   | Name | Value |
   |------|-------|
   | `REACT_APP_API_URL` | `https://your-backend.vercel.app/api` |
   
   **Important:** Replace `your-backend.vercel.app` with your actual backend URL from Step 3.

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend will be live!

---

## ✅ Step 5: Verify Deployment

1. **Test Backend**
   - Visit: `https://your-backend.vercel.app/api/health`
   - Should return: `{"status":"OK"}`

2. **Test Frontend**
   - Visit your frontend URL
   - Try logging in with your admin credentials
   - Test creating HR records
   - Test email functionality

3. **Check Logs**
   - In Vercel dashboard, go to your project
   - Click "Deployments" → Select a deployment → "Functions" tab
   - Check for any errors

---

## 🔄 Step 6: Update CORS (if needed)

If you get CORS errors, update `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:3000' // for local development
  ],
  credentials: true
}));
```

Then redeploy the backend.

---

## 📝 Step 7: Custom Domains (Optional)

1. **Add Custom Domain to Frontend**
   - In Vercel dashboard → Your frontend project → Settings → Domains
   - Add your domain (e.g., `app.yourdomain.com`)
   - Follow DNS configuration instructions

2. **Add Custom Domain to Backend**
   - In Vercel dashboard → Your backend project → Settings → Domains
   - Add your domain (e.g., `api.yourdomain.com`)
   - Update `REACT_APP_API_URL` in frontend environment variables

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Backend returns 404
- **Solution:** Check that `vercel.json` is in the `backend` folder
- **Solution:** Ensure routes are prefixed with `/api`

**Problem:** MongoDB connection fails
- **Solution:** Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- **Solution:** Verify connection string has correct username/password
- **Solution:** Check database user has proper permissions

**Problem:** Environment variables not working
- **Solution:** Redeploy after adding environment variables
- **Solution:** Check variable names match exactly (case-sensitive)

### Frontend Issues

**Problem:** API calls fail
- **Solution:** Check `REACT_APP_API_URL` is set correctly
- **Solution:** Verify backend URL is accessible
- **Solution:** Check browser console for CORS errors

**Problem:** Build fails
- **Solution:** Check `package.json` has all dependencies
- **Solution:** Review build logs in Vercel dashboard
- **Solution:** Ensure `build` script exists in package.json

---

## 📦 Project Structure for Deployment

```
your-repo/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── vercel.json          ← Backend Vercel config
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── middleware/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vercel.json          ← Frontend Vercel config (optional)
└── vercel.json              ← Root Vercel config (if using monorepo)
```

---

## 🔐 Security Checklist

- [ ] MongoDB password is strong and unique
- [ ] JWT_SECRET is long and random (32+ characters)
- [ ] Admin password is strong
- [ ] Environment variables are set in Vercel (not in code)
- [ ] MongoDB IP whitelist is configured
- [ ] CORS is properly configured
- [ ] HTTPS is enabled (automatic with Vercel)

---

## 🚀 Quick Deploy Commands

### Using Vercel CLI (Alternative Method)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   vercel
   # Follow prompts, set environment variables
   ```

3. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   # Follow prompts, set REACT_APP_API_URL
   ```

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas connection status
3. Verify all environment variables are set
4. Test API endpoints directly using Postman/curl

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelist configured
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set
- [ ] Backend health check passes
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables set
- [ ] Frontend can connect to backend
- [ ] Login functionality works
- [ ] All features tested

---

**🎉 Congratulations! Your HR Management Dashboard is now live!**

