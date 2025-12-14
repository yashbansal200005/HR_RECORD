# 🚂 Railway Backend Deployment Guide

## Railway में Backend Deploy करने के Steps

### Step 1: Railway Project Setup

1. **Railway पर जाएं:** https://railway.app
2. **GitHub से Sign In करें**
3. **"New Project"** पर click करें
4. **"Deploy from GitHub repo"** select करें
5. अपना repository select करें: `yashbansal200005/HR_RECORD`
6. **"Deploy Now"** click करें

### Step 2: Backend Service Configure करें

Railway automatically दोनों folders detect करेगा। आपको सिर्फ backend service configure करना है:

1. Railway dashboard में आपको **2 services** दिखेंगे:
   - `frontend` (इसे ignore करें या delete करें)
   - `backend` (इस पर focus करें)

2. **Backend service** पर click करें

3. **Settings** tab में जाएं:
   - **Root Directory:** `backend` (यह automatically set होना चाहिए)
   - **Start Command:** `node server.js` (या `npm start`)

### Step 3: Environment Variables Add करें

1. Backend service में **"Variables"** tab पर जाएं
2. **"New Variable"** click करें और add करें:

| Variable Name | Value |
|---------------|-------|
| `MONGODB_URI` | आपका MongoDB connection string |
| `JWT_SECRET` | कोई भी long random string (32+ characters) |
| `ADMIN_USER` | `admin` (या आपका username) |
| `ADMIN_PASS` | आपका password |
| `NODE_ENV` | `production` |
| `PORT` | (खाली छोड़ दें, Railway automatically assign करेगा) |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` (frontend deploy के बाद add करें) |

**Example:**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=my-super-secret-key-12345678901234567890
ADMIN_USER=admin
ADMIN_PASS=your-secure-password
NODE_ENV=production
FRONTEND_URL=https://hr-frontend.vercel.app
```

### Step 4: Domain Generate करें

1. **Settings** tab में जाएं
2. **"Generate Domain"** button click करें
3. Railway आपको एक URL देगा (जैसे: `https://hr-backend-production.up.railway.app`)
4. **इस URL को copy करें** - यह आपका backend URL है

### Step 5: Test करें

1. Browser में जाएं: `https://your-railway-url.railway.app/api/health`
2. Response मिलना चाहिए: `{"status":"OK"}`

### Step 6: Frontend Service Delete करें (Optional)

अगर आप frontend Railway पर deploy नहीं करना चाहते:

1. Railway dashboard में `frontend` service पर click करें
2. **Settings** → **Delete Service** click करें
3. Confirm करें

---

## 🔧 Troubleshooting

### Problem: Railway दोनों services detect कर रहा है
**Solution:** 
- Backend service को configure करें
- Frontend service को delete करें या ignore करें
- Frontend को Vercel पर deploy करें

### Problem: Build fail हो रहा है
**Solution:**
- Check करें Root Directory `backend` है
- Check करें Start Command `node server.js` है
- Logs check करें Railway dashboard में

### Problem: MongoDB connection error
**Solution:**
- MongoDB Atlas में IP whitelist check करें (`0.0.0.0/0` होना चाहिए)
- Connection string सही है या नहीं check करें
- Environment variable `MONGODB_URI` correctly set है या नहीं

### Problem: CORS error
**Solution:**
- `FRONTEND_URL` environment variable add करें
- Frontend का exact URL add करें (जैसे: `https://hr-frontend.vercel.app`)
- Railway automatically redeploy करेगा

---

## ✅ Checklist

- [ ] Railway project create किया
- [ ] Backend service configure किया
- [ ] Root Directory `backend` set किया
- [ ] Start Command `node server.js` set किया
- [ ] सभी environment variables add किए
- [ ] Domain generate किया
- [ ] Health check test किया (`/api/health`)
- [ ] Frontend service delete किया (optional)

---

## 📝 Important Notes

1. **Railway Auto-Deploy:** जब भी आप GitHub पर push करेंगे, Railway automatically redeploy करेगा
2. **Port:** Railway automatically PORT assign करता है, hardcode न करें
3. **Logs:** Railway dashboard में **"Logs"** tab से errors check कर सकते हैं
4. **Environment Variables:** सभी sensitive data environment variables में रखें

---

## 🎉 Success!

अगर `/api/health` endpoint `{"status":"OK"}` return कर रहा है, तो आपका backend successfully deploy हो गया है!

**Backend URL:** `https://your-railway-url.railway.app`

