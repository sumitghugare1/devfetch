# DevFetch - Professional HTTP Client & API Testing Tool

A comprehensive and modern HTTP Client & API Testing Tool designed for developers. DevFetch provides an intuitive interface for testing APIs, debugging requests, and streamlining your development workflow with advanced features like request history, dark mode, and export capabilities.

## 🚀 Features

### Frontend (React)
- **HTTP Client Interface**: Send GET, POST, PUT, DELETE, and other HTTP requests
- **Request Builder**: Easy-to-use form for URL, method, headers, and body
- **Response Viewer**: Display status codes, headers, response time, and formatted response data
- **Request History**: View, replay, and manage previous requests
- **Dark Mode**: Toggle between light and dark themes
- **Modern UI**: Clean, responsive interface with custom CSS styling
- **Export/Import**: Export request history for sharing or backup

### Backend (Node.js + Express)
- **Mock API Endpoints**: Pre-built endpoints for testing (`/api/mock/*`)
- **Request Proxy**: Send requests to external APIs through the server
- **Request Logging**: Automatic logging of all requests and responses to MongoDB
- **History Management**: CRUD operations for request history
- **Response Simulation**: Simulate various status codes, delays, and response types

### Database (MongoDB)
- **Request Logs**: Store complete request/response data with timestamps
- **History Management**: Efficient querying and filtering of request history
- **Data Persistence**: Maintain request history across sessions

## 🏗️ Project Structure

```
📦 http-lab-mern/
├── 📁 client/                    # React frontend
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📄 HTTPClient.js  # Main HTTP client interface
│   │   │   └── 📄 History.js     # Request history management
│   │   ├── 📄 App.js            # Main app component
│   │   ├── 📄 App.css           # Custom CSS styling
│   │   └── 📄 index.js          # React entry point
│   ├── 📄 package.json          # Frontend dependencies
│   └── 📄 postcss.config.js     # PostCSS configuration
├── 📁 server/                    # Node.js backend
│   ├── 📁 routes/
│   │   └── 📄 mockRouter.js     # Mock API endpoints
│   ├── 📁 models/
│   │   └── 📄 RequestLog.js     # MongoDB schema
│   ├── 📁 middleware/
│   │   └── 📄 logger.js         # Request logging middleware
│   ├── 📄 index.js              # Express server
│   ├── 📄 .env                  # Environment variables
│   └── 📄 package.json          # Backend dependencies
├── 📄 package.json              # Root package.json with scripts
└── 📄 README.md                 # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Quick Start

1. **Clone and install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   ```bash
   # In server/.env
   MONGODB_URI=mongodb://localhost:27017/httplab
   PORT=5000
   ```

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

This will start both the React frontend (http://localhost:3001) and Express backend (http://localhost:5000) concurrently.

### Individual Commands

- **Frontend only:** `npm run client`
- **Backend only:** `npm run server:dev`
- **Production build:** `npm run client:build`

## 🎯 Usage

### HTTP Client
1. Open http://localhost:3001
2. Select HTTP method (GET, POST, PUT, DELETE, etc.)
3. Enter the request URL
4. Add headers (key-value pairs)
5. Add request body (for POST/PUT requests)
6. Click "Send" to execute the request
7. View the response with status, headers, and body

### Mock Endpoints
The server provides several mock endpoints for testing:

- `GET /api/mock/test` - Simple test endpoint
- `GET /api/mock/users` - Get all users
- `GET /api/mock/users/:id` - Get user by ID
- `POST /api/mock/users` - Create new user
- `PUT /api/mock/users/:id` - Update user
- `DELETE /api/mock/users/:id` - Delete user
- `GET /api/mock/data?format=json|xml|text|html` - Different response formats
- `GET /api/mock/status/:code` - Return specific status codes
- `GET /api/mock/slow?delay=3000` - Simulate slow responses
- `ALL /api/mock/echo` - Echo request data back

### Request History
- View all previous requests in the History tab
- Filter by status (success/error) or search by URL
- Click on any request to view full details
- Replay requests by clicking the "Replay" button
- Export history as JSON for backup or sharing
- Delete individual requests or clear all history

## 🧪 Testing Scenarios

### Status Code Testing
```
GET http://localhost:5000/api/mock/status/404
GET http://localhost:5000/api/mock/status/500
```

### Response Format Testing
```
GET http://localhost:5000/api/mock/data?format=xml
GET http://localhost:5000/api/mock/data?format=text
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
