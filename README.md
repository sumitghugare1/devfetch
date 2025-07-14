# DevFetch - Where API Testing Meets Aesthetic Excellence

A modern, professional HTTP client and API testing tool built with React and Node.js. DevFetch transforms API testing into a beautiful developer experience with glassmorphism UI, zero-setup deployment, and comprehensive request management.

## 🌟 Live Demo

**Frontend**: [https://devfetchfront.vercel.app/](https://devfetchfront.vercel.app/)  
**Backend API**: [https://devfetchbackend.vercel.app/](https://devfetchbackend.vercel.app/)

## ✨ Key Features

### 🎯 **Zero Setup Required**
- **Instant Access**: Works directly in browser, no installation needed
- **localStorage History**: All request history saved locally, no database dependency
- **CORS Proxy**: Automatically handles external API requests through backend proxy

### 🌙 **Smart Modern UI**
- **Glassmorphism Design**: Beautiful, professional interface with depth and transparency
- **Dark Mode Support**: Seamless toggle between light and dark themes
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Status Code Visualization**: Color-coded status indicators for instant feedback

### 💾 **Advanced Request Management**
- **Complete HTTP Methods**: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- **Smart Headers**: Auto-completion and preset configurations
- **Request History**: Local storage with replay functionality
- **Test APIs**: Built-in collection of reliable APIs for testing
- **Export/Import**: Share requests and responses easily

### 🛠️ **Developer Experience**
- **External API Support**: Built-in CORS proxy for any external API
- **Error Handling**: Detailed error messages with troubleshooting tips
- **Response Analysis**: Status codes, headers, timing, and formatted JSON
- **Request Builder**: Intuitive interface for complex API requests

## 🏗️ Architecture

### Frontend (React + Tailwind CSS)
```
📁 client/
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📄 HTTPClient.js      # Main HTTP client interface
│   │   └── 📄 History.js         # Local storage history management
│   ├── 📄 App.js                 # Main application with routing
│   ├── 📄 App.css               # Glassmorphism and responsive styles
│   └── 📄 index.js              # React entry point
├── 📄 package.json              # Dependencies and scripts
└── � vercel.json               # Vercel deployment config
```

### Backend (Node.js + Express)
```
📁 server/
├── 📁 routes/
│   └── 📄 mockRouter.js         # Mock API endpoints for testing
├── 📁 models/
│   └── 📄 RequestLog.js         # MongoDB schema (optional)
├── 📁 middleware/
│   └── 📄 logger.js             # Request logging middleware
├── 📄 index.js                  # Express server with CORS proxy
├── 📄 package.json              # Server dependencies
└── 📄 vercel.json               # Serverless deployment config
```
│   └── 📄 package.json          # Backend dependencies
├── 📄 package.json              # Root package.json with scripts
└── 📄 README.md                 # This file
```

## � Quick Start

### Option 1: Use Live Demo (Recommended)
Simply visit [https://devfetchfront.vercel.app/](https://devfetchfront.vercel.app/) and start testing APIs immediately!

### Option 2: Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sumitghugare1/devfetch.git
   cd devfetch
   ```

2. **Install dependencies:**
   ```bash
   # Install frontend dependencies
   cd client
   npm install

   # Install backend dependencies
   cd ../server
   npm install
   ```

3. **Start development servers:**
   ```bash
   # Start backend (from server directory)
   npm run dev

   # Start frontend (from client directory, new terminal)
   cd ../client
   npm start
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🌐 Deployment

### Vercel (Recommended)

DevFetch is optimized for Vercel deployment with separate frontend and backend deployments:

#### Backend Deployment
1. Import your GitHub repository to Vercel
2. Set **Root Directory** to `server`
3. **Framework Preset**: Other
4. Deploy!

#### Frontend Deployment  
1. Import the same repository again
2. Set **Root Directory** to `client`
3. **Framework Preset**: Create React App
4. Add environment variable: `REACT_APP_API_URL=https://your-backend.vercel.app`
5. Deploy!

### Manual Deployment
```bash
# Build frontend
cd client
npm run build

# Start backend
cd ../server
npm start
```

## 🧪 API Endpoints

### Mock API Endpoints (Built-in Testing)
- `GET /api/mock/test` - Simple test endpoint
- `GET /api/mock/users` - Sample user data
- `GET /api/mock/posts` - Sample posts data
- `POST /api/mock/users` - Create user simulation
- `GET /api/mock/status/:code` - Return specific status codes

### External API Proxy
- `POST /api/external` - CORS proxy for external APIs
- `GET /api/test-apis` - List of reliable test APIs

### Request History (Optional MongoDB)
- `GET /api/history` - Get request history
- `DELETE /api/history/:id` - Delete specific request
- `DELETE /api/history` - Clear all history

## 🎯 Key Features in Detail

### 🔗 External API Support
DevFetch automatically detects external URLs and routes them through the backend proxy to avoid CORS issues:

```javascript
// These work automatically:
https://jsonplaceholder.typicode.com/posts/1
https://api.github.com/users/sumitghugare1
https://catfact.ninja/fact
```

### 🧪 Built-in Test APIs
Click the "Test APIs" button to access curated, reliable APIs:
- **JSONPlaceholder** - Posts, Users, Comments
- **Cat Facts API** - Random cat facts
- **Dog API** - Random dog images
- **Public IP API** - Your IP address
- **Quote API** - Inspirational quotes
- **Weather API** - NYC weather (no key required)

### 💾 Local Storage History
All request history is stored locally in your browser:
- No database required
- Privacy-first approach
- Export/import functionality
- Persistent across sessions

### 🎨 Glassmorphism UI
Modern design with:
- Translucent backgrounds with blur effects
- Depth and layering
- Smooth animations and transitions
- Professional color schemes
## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework  
- **Axios** - HTTP client for API requests
- **CSS3** - Custom glassmorphism styling
- **localStorage** - Client-side data persistence

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **node-fetch** - HTTP client for external API proxy
- **CORS** - Cross-origin resource sharing
- **MongoDB** (Optional) - Database for request logging

### Deployment & DevOps
- **Vercel** - Serverless deployment platform
- **GitHub** - Version control and CI/CD
- **npm** - Package management
- **Environment Variables** - Configuration management

## 📱 Screenshots

### Light Mode
![DevFetch Light Mode](https://via.placeholder.com/800x400/667eea/white?text=DevFetch+Light+Mode)

### Dark Mode  
![DevFetch Dark Mode](https://via.placeholder.com/800x400/1e293b/white?text=DevFetch+Dark+Mode)

### Test APIs Modal
![Test APIs](https://via.placeholder.com/600x400/10b981/white?text=Test+APIs+Collection)

## 📖 Usage Guide

### Basic HTTP Request
1. Visit [DevFetch](https://devfetchfront.vercel.app/)
2. Select HTTP method from dropdown
3. Enter API URL
4. Add headers if needed (optional)
5. Add request body for POST/PUT/PATCH
6. Click "Send Request"
7. View formatted response with timing

### Using Test APIs
1. Click "Test APIs" button in the Quick Start section
2. Browse the collection of reliable APIs
3. Click any API to auto-fill the request form
4. Send the request to see live data

### Request History
- All requests are automatically saved to localStorage
- View history in the "History" tab
- Replay any previous request with one click
- Delete individual requests or clear all history
- Export history for sharing or backup

### Dark Mode
- Toggle between light and dark themes
- Preference is saved automatically
- Optimized for both day and night coding sessions

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow React best practices
- Use functional components with hooks
- Maintain responsive design principles
- Add appropriate error handling
- Test external API integrations

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sumit Ghugare**
- GitHub: [@sumitghugare1](https://github.com/sumitghugare1)
- LinkedIn: [Connect with me](https://linkedin.com/in/sumitghugare)

## 🙏 Acknowledgments

- **Vercel** - For excellent serverless deployment platform
- **React Team** - For the amazing React library  
- **Tailwind CSS** - For the utility-first CSS framework
- **Open Source Community** - For the tools and inspiration

---

## 🚀 Ready to Test APIs Like a Pro?

**[Try DevFetch Live →](https://devfetchfront.vercel.app/)**

*Transform your API testing experience with beautiful UI and powerful features!*
```

### Performance Testing
```
GET http://localhost:5000/api/mock/slow?delay=5000
```

### CRUD Operations
```
POST http://localhost:5000/api/mock/users
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

## 🔧 Configuration

### Environment Variables (server/.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/httplab
CORS_ORIGIN=http://localhost:3001
```

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in server/.env
3. The application will automatically create the database and collections

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run client:build
# Deploy the client/build folder
```

### Backend (Heroku/Railway)
```bash
# Set environment variables
# Deploy the server folder
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🔮 Future Enhancements

- [ ] Authentication and user accounts
- [ ] Request collections and workspaces
- [ ] API documentation generation
- [ ] WebSocket support for real-time updates
- [ ] Response assertions and testing
- [ ] Environment variables management
- [ ] Import/export Postman collections
- [ ] Collaborative features
- [ ] Performance monitoring and analytics
