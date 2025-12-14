# ⚡ Quick Deployment Summary

## 🎯 Deployment Steps Overview

### 1. MongoDB Atlas Setup (5 minutes)
- Create account at mongodb.com/cloud/atlas
- Create free M0 cluster
- Create database user (save credentials!)
- Whitelist IP: `0.0.0.0/0`
- Get connection string

### 2. Backend Deployment (10 minutes)
1. Push code to GitHub
2. Go to vercel.com → New Project
3. Import repository → Select `backend` folder
4. Add environment variables:
   - `MONGODB_URI` = Your MongoDB connection string
   - `JWT_SECRET` = Random 32+ character string
   - `ADMIN_USER` = admin (or your choice)
   - `ADMIN_PASS` = Your password
5. Deploy → Copy backend URL

### 3. Frontend Deployment (5 minutes)
1. Go to vercel.com → New Project
2. Import same repository → Select `frontend` folder
3. Add environment variable:
   - `REACT_APP_API_URL` = `https://your-backend.vercel.app/api`
4. Deploy

### 4. Test
- Backend: `https://your-backend.vercel.app/api/health`
- Frontend: Visit frontend URL and login

---

## 📝 Environment Variables Checklist

### Backend (Vercel)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-32-char-secret-key
ADMIN_USER=admin
ADMIN_PASS=your-password
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

---

## 🔗 Important URLs

After deployment, you'll have:
- **Backend:** `https://your-backend.vercel.app`
- **Frontend:** `https://your-frontend.vercel.app`
- **API Health:** `https://your-backend.vercel.app/api/health`

---

## ⚠️ Common Issues

1. **CORS Error:** Update `FRONTEND_URL` in backend env vars
2. **MongoDB Connection:** Check IP whitelist includes `0.0.0.0/0`
3. **404 on API:** Ensure routes start with `/api`
4. **Build Fails:** Check all dependencies in package.json

---

For detailed instructions, see `DEPLOYMENT_GUIDE.md`

