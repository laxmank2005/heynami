# Deployment Guide

This document explains how to deploy the Chat Application to production using Render (Backend) and Vercel (Frontend), alongside MongoDB Atlas for the database.

## 1. Database Deployment (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. Create a Database User with a username and password.
3. Under **Network Access**, add `0.0.0.0/0` to allow access from anywhere (since Render's IPs change).
4. Go to **Databases** > **Connect** > **Connect your application**.
5. Copy the connection string. Replace `<password>` with your database user's password. This is your `MONGO_URL`.

## 2. Backend Deployment (Render)
1. Go to [Render.com](https://render.com/) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Configure the settings as follows:
   - **Root Directory**: `Backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Expand the **Environment Variables** section and add the following keys:
   - `PORT` : `8080` (or leave blank, Render assigns one automatically)
   - `NODE_ENV` : `production`
   - `MONGO_URL` : *(Your MongoDB Atlas Connection String)*
   - `JWT_SECRET` : *(A secure random string for JWTs)*
   - `FRONTEND_URL` : *(The URL of your deployed Vercel frontend, e.g., https://your-frontend.vercel.app)*
5. Click **Create Web Service**. Render will deploy the backend. Copy the backend URL (e.g., `https://your-backend.onrender.com`).

## 3. Frontend Deployment (Vercel)
1. Go to [Vercel](https://vercel.com/) and click **Add New** > **Project**.
2. Import your GitHub repository.
3. Configure the settings as follows:
   - **Root Directory**: `Frontend`
   - **Framework Preset**: `Vite` (Vercel usually auto-detects this)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand the **Environment Variables** section and add the following keys:
   - `VITE_API_URL` : *(Your Render backend URL, e.g., https://your-backend.onrender.com)*
   - `VITE_SOCKET_URL` : *(Your Render backend URL, e.g., https://your-backend.onrender.com)*
5. Click **Deploy**. Vercel will build and deploy the frontend.

## 4. Final Verification
- Make sure `FRONTEND_URL` in Render matches exactly the URL provided by Vercel.
- Make sure `VITE_API_URL` in Vercel matches exactly the URL provided by Render.
- Test user registration and live chat to verify CORS and Socket.io are functioning perfectly in production.
