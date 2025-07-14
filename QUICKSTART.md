# 🚀 HTTP Lab - Quick Start Guide

## ✅ **Project Status: READY TO USE**

The Tailwind CSS compilation issues have been resolved! The project now uses custom CSS for a clean, modern interface.

## 🖥️ **Running the Application**

### Option 1: Start Both Servers Separately (Recommended)

**Terminal 1 - Backend Server:**
```bash
cd C:\Users\SUMIT\Desktop\http
node server/index.js
```
*Server will run on: http://localhost:5000*

**Terminal 2 - Frontend Client:**
```bash
cd C:\Users\SUMIT\Desktop\http\client
npm start
```
*React app will run on: http://localhost:3001*

### Option 2: Start Both Together
```bash
cd C:\Users\SUMIT\Desktop\http
npm run dev
```

## 🎯 **Quick Test**

1. **Open your browser:** http://localhost:3001
2. **Test the mock API:**
   - URL: `http://localhost:5000/api/mock/test`
   - Method: `GET`
   - Click "Send"
3. **Check response:** Should see a JSON response with test data

## ✨ **Features Available**

- ✅ **HTTP Client Interface** - Send any HTTP request
- ✅ **Mock API Endpoints** - Built-in testing endpoints
- ✅ **Request History** - View and replay previous requests
- ✅ **Dark Mode** - Toggle light/dark themes
- ✅ **Response Viewer** - Formatted JSON, status codes, headers
- ✅ **Custom Styling** - Modern UI without framework dependencies

## 🧪 **Try These Test URLs**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `http://localhost:5000/api/mock/test` | GET | Simple test response |
| `http://localhost:5000/api/mock/users` | GET | List of mock users |
| `http://localhost:5000/api/mock/status/404` | GET | Test 404 error |
| `http://localhost:5000/api/mock/slow?delay=3000` | GET | Slow response (3s) |

## 🔧 **Troubleshooting**

- **Port 3001 taken?** React will prompt for another port
- **MongoDB not running?** App works without it (history disabled)
- **CORS errors?** Backend handles CORS automatically

## 🎉 **You're All Set!**

The HTTP Lab is now fully functional and ready for testing HTTP requests!
