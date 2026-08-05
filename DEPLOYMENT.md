# Deployment Guide - Chat Application

## 📋 Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (or MongoDB instance)
- Git installed

## 🚀 Deployment Steps

### 1️⃣ Backend Deployment (Render/Railway/Heroku)

#### **Environment Variables to Set:**
```
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secure_random_string
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

#### **Deploy to Render:**
1. Push your code to GitHub
2. Go to https://render.com
3. Create New Web Service
4. Connect your GitHub repository
5. Configure:
   - **Root Directory**: `Backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables
7. Deploy!

#### **Deploy to Railway:**
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repository
4. Add environment variables
5. Set root directory to `Backend`
6. Deploy!

---

### 2️⃣ Frontend Deployment (Vercel/Netlify)

#### **Update `.env` file:**
```
VITE_API_URL=https://your-backend-url.onrender.com
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

#### **Deploy to Vercel:**
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to Frontend folder: `cd Frontend`
3. Run: `vercel`
4. Follow prompts
5. Set environment variables in Vercel dashboard
6. Redeploy: `vercel --prod`

**Or use Vercel Dashboard:**
1. Go to https://vercel.com
2. Import your GitHub repository
3. Root Directory: `Frontend`
4. Framework: Vite
5. Add environment variables
6. Deploy!

#### **Deploy to Netlify:**
1. Go to https://netlify.com
2. New Site from Git
3. Select your repository
4. Configure:
   - **Base directory**: `Frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `Frontend/dist`
5. Add environment variables
6. Deploy!

---

### 3️⃣ Update Backend CORS

After deploying frontend, update Backend `.env`:
```
FRONTEND_URL=https://your-actual-frontend-url.vercel.app
```

Redeploy backend to apply changes.

---

## 🧪 Testing Deployment

1. Open your deployed frontend URL
2. Register a new account
3. Login with credentials
4. Test sending messages
5. Open in another browser/incognito to test real-time chat

---

## 🔧 Troubleshooting

### **CORS Errors:**
- Ensure `FRONTEND_URL` in backend matches your frontend URL exactly
- No trailing slash in URLs

### **Socket Connection Issues:**
- Check `VITE_SOCKET_URL` matches backend URL
- Ensure backend supports WebSocket connections

### **Database Connection:**
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check MongoDB URI is correct

### **Build Failures:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node version compatibility

---

## 📝 Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is deployed and loads
- [ ] User registration works
- [ ] User login works
- [ ] Messages send and receive
- [ ] Real-time updates work
- [ ] Avatar images load
- [ ] Logout works
- [ ] Search functionality works

---

## 🔐 Security Notes

1. **NEVER commit `.env` files to Git**
2. Use strong JWT secret (at least 32 characters)
3. Keep MongoDB credentials secure
4. Use HTTPS in production
5. Regularly update dependencies

---

## 📱 Optional: Custom Domain

### Vercel:
1. Go to your project settings
2. Domains → Add Domain
3. Follow DNS configuration steps

### Render:
1. Go to your service settings
2. Custom Domain → Add
3. Update DNS records

---

## 🆘 Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs in hosting platform
3. Verify all environment variables are set correctly
4. Test API endpoints directly using Postman

---

**Good luck with your deployment! 🚀**
