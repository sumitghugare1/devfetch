# DevFetch - Vercel Deployment Guide

This guide will help you deploy DevFetch with separate frontend and backend deployments on Vercel.

## ✨ New: Local Storage Implementation

DevFetch now uses **localStorage** for request history instead of MongoDB! This means:
- ✅ **No database setup required**
- ✅ **Zero configuration** 
- ✅ **Instant deployment**
- ✅ **Request history stored locally** in user's browser
- ✅ **Works offline** for saved requests

## Prerequisites

- GitHub account with your DevFetch repository
- Vercel account (sign up at [vercel.com](https://vercel.com))
- ~~MongoDB Atlas account~~ ❌ **No longer needed!**

## 🚀 Deployment Steps

### 1. Deploy Backend First

1. **Login to Vercel**: Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. **Import Project**: Click "New Project" → Import your `devfetch` repository
3. **Configure Backend**:
   - **Framework Preset**: Other
   - **Root Directory**: `server`
   - **Build Command**: Leave empty (not needed for Node.js)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Set Environment Variables** (Optional):
   ```
   NODE_ENV=production
   PORT=3000
   ```

5. **Deploy**: Click "Deploy"
6. **Note the URL**: Save your backend URL (e.g., `https://your-backend.vercel.app`)

### 2. Deploy Frontend Second

1. **Import Project Again**: Click "New Project" → Import your `devfetch` repository again
2. **Configure Frontend**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

3. **Set Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app
   ```

4. **Deploy**: Click "Deploy"

## 🔧 Environment Variables

### Backend (.env) - **Minimal Setup!**
```env
NODE_ENV=production
PORT=3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-deployment.vercel.app
```

## 📱 No Database Required!

✅ **Request history** is stored locally in the user's browser using localStorage  
✅ **No setup needed** - works immediately after deployment  
✅ **Privacy-focused** - user data stays on their device  
✅ **Fast and responsive** - no database queries needed

## 🎯 Quick Deploy Commands

If you prefer using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd server
vercel --prod

# Deploy frontend  
cd ../client
vercel --prod
```

## ✅ Verification

After deployment:

1. **Test Backend**: Visit `https://your-backend.vercel.app/api/mock/test`
2. **Test Frontend**: Visit your frontend URL and try making requests
3. **Check Integration**: Ensure frontend can communicate with backend

## 🔄 Updates

To update your deployment:
1. Push changes to your GitHub repository
2. Vercel will automatically redeploy (if auto-deploy is enabled)
3. Or use `vercel --prod` in the respective directories

## 🛠️ Troubleshooting

**Common Issues:**

1. **CORS Errors**: Make sure your backend CORS is configured for your frontend domain
2. **Environment Variables**: Double-check all environment variables are set correctly
3. **Build Failures**: Check build logs in Vercel dashboard
4. **API Not Found**: Ensure your frontend is pointing to the correct backend URL

## 📞 Support

If you encounter issues:
- Check Vercel deployment logs
- Verify environment variables
- Test API endpoints individually
- Check browser console for errors

---

## Example URLs After Deployment

- **Frontend**: `https://devfetch-frontend.vercel.app`
- **Backend**: `https://devfetch-backend.vercel.app`
- **API Test**: `https://devfetch-backend.vercel.app/api/mock/test`
