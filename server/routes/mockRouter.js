const express = require('express');
const router = express.Router();

// Mock data for testing
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
];

const mockPosts = [
  { id: 1, title: 'First Post', content: 'This is the first post', authorId: 1 },
  { id: 2, title: 'Second Post', content: 'This is the second post', authorId: 2 },
  { id: 3, title: 'Third Post', content: 'This is the third post', authorId: 1 }
];

// Simple test endpoint
router.get('/test', (req, res) => {
  res.json({
    message: 'Test endpoint working!',
    timestamp: new Date().toISOString(),
    method: 'GET'
  });
});

// Users endpoints
router.get('/users', (req, res) => {
  const delay = req.query.delay ? parseInt(req.query.delay) : 0;
  
  setTimeout(() => {
    res.json({
      success: true,
      data: mockUsers,
      count: mockUsers.length
    });
  }, delay);
});

router.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

router.post('/users', (req, res) => {
  const { name, email, role } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required'
    });
  }
  
  const newUser = {
    id: mockUsers.length + 1,
    name,
    email,
    role: role || 'user'
  };
  
  mockUsers.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser,
    message: 'User created successfully'
  });
});

router.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  const { name, email, role } = req.body;
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    ...(name && { name }),
    ...(email && { email }),
    ...(role && { role })
  };
  
  res.json({
    success: true,
    data: mockUsers[userIndex],
    message: 'User updated successfully'
  });
});

router.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  mockUsers.splice(userIndex, 1);
  
  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// Posts endpoints
router.get('/posts', (req, res) => {
  res.json({
    success: true,
    data: mockPosts,
    count: mockPosts.length
  });
});

router.post('/posts', (req, res) => {
  const { title, content, authorId } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      error: 'Title and content are required'
    });
  }
  
  const newPost = {
    id: mockPosts.length + 1,
    title,
    content,
    authorId: authorId || 1
  };
  
  mockPosts.push(newPost);
  
  res.status(201).json({
    success: true,
    data: newPost,
    message: 'Post created successfully'
  });
});

// Data endpoint with various response types
router.get('/data', (req, res) => {
  const format = req.query.format || 'json';
  const status = req.query.status ? parseInt(req.query.status) : 200;
  
  res.status(status);
  
  switch (format) {
    case 'xml':
      res.set('Content-Type', 'application/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
<response>
  <message>XML response</message>
  <timestamp>${new Date().toISOString()}</timestamp>
</response>`);
      break;
    case 'text':
      res.set('Content-Type', 'text/plain');
      res.send('Plain text response');
      break;
    case 'html':
      res.set('Content-Type', 'text/html');
      res.send('<html><body><h1>HTML Response</h1><p>This is an HTML response</p></body></html>');
      break;
    default:
      res.json({
        message: 'JSON response',
        timestamp: new Date().toISOString(),
        format: 'json'
      });
  }
});

// Status code testing
router.get('/status/:code', (req, res) => {
  const statusCode = parseInt(req.params.code);
  
  if (statusCode < 100 || statusCode > 599) {
    return res.status(400).json({
      error: 'Invalid status code'
    });
  }
  
  res.status(statusCode).json({
    status: statusCode,
    message: getStatusMessage(statusCode)
  });
});

// Simulate slow responses
router.get('/slow', (req, res) => {
  const delay = req.query.delay ? parseInt(req.query.delay) : 3000;
  
  setTimeout(() => {
    res.json({
      message: `Response after ${delay}ms delay`,
      delay: delay
    });
  }, delay);
});

// Echo endpoint - returns the request back
router.all('/echo', (req, res) => {
  res.json({
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

function getStatusMessage(code) {
  const messages = {
    200: 'OK',
    201: 'Created',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable'
  };
  
  return messages[code] || 'Unknown Status';
}

module.exports = router;
