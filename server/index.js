const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const mockRouter = require('./routes/mockRouter');
const RequestLog = require('./models/RequestLog');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(logger);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/httplab')
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.warn('MongoDB connection failed. Running without database features:', err.message);
  console.log('Some features like request history will be disabled.');
});

// Routes
app.use('/api/mock', mockRouter);

// External API proxy endpoint
app.post('/api/external', async (req, res) => {
  try {
    const { url, method = 'GET', headers = {}, body } = req.body;
    const startTime = Date.now();
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (urlError) {
      return res.status(400).json({ 
        error: 'Invalid URL format',
        message: urlError.message,
        url: url
      });
    }

    const fetch = require('node-fetch');
    const requestOptions = {
      method: method.toUpperCase(),
      headers: {
        'User-Agent': 'DevFetch/1.0 (External API Proxy)',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        ...headers
      },
      timeout: 15000, // 15 second timeout
      follow: 5, // Follow up to 5 redirects
      compress: true
    };

    // Add body for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
      requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      if (!requestOptions.headers['Content-Type']) {
        requestOptions.headers['Content-Type'] = 'application/json';
      }
    }

    console.log(`[${new Date().toISOString()}] Proxying ${method.toUpperCase()} request to: ${url}`);
    console.log('Request headers:', JSON.stringify(requestOptions.headers, null, 2));
    
    const response = await fetch(url, requestOptions);
    const responseText = await response.text();
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.log(`[${new Date().toISOString()}] Response received: ${response.status} ${response.statusText} (${responseTime}ms)`);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      responseData = responseText;
      console.log('Response is not valid JSON, returning as text');
    }

    const result = {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData,
      responseTime,
      size: responseText.length,
      url: url,
      success: response.ok
    };

    res.json(result);
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.error(`[${new Date().toISOString()}] External API proxy error for ${req.body.url}:`, error);
    
    // Handle different types of errors
    let errorMessage = error.message;
    let errorType = 'UNKNOWN_ERROR';
    
    if (error.code === 'ENOTFOUND') {
      errorType = 'DNS_ERROR';
      errorMessage = `DNS lookup failed for ${req.body.url}. The domain might not exist or there might be a network connectivity issue.`;
    } else if (error.code === 'ETIMEDOUT') {
      errorType = 'TIMEOUT_ERROR';
      errorMessage = `Request timeout after 15 seconds for ${req.body.url}`;
    } else if (error.code === 'ECONNREFUSED') {
      errorType = 'CONNECTION_REFUSED';
      errorMessage = `Connection refused by ${req.body.url}`;
    } else if (error.name === 'FetchError') {
      errorType = 'FETCH_ERROR';
      errorMessage = `Network error: ${error.message}`;
    }

    res.status(500).json({
      error: 'Failed to fetch from external API',
      message: errorMessage,
      errorType: errorType,
      url: req.body.url,
      responseTime: responseTime,
      timestamp: new Date().toISOString()
    });
  }
});

// API endpoint for sending HTTP requests
app.post('/api/request', async (req, res) => {
  try {
    const { url, method, headers, body } = req.body;
    const startTime = Date.now();
    
    let response;
    const requestOptions = {
      method: method.toUpperCase(),
      headers: headers || {},
    };

    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
      requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      if (!requestOptions.headers['Content-Type']) {
        requestOptions.headers['Content-Type'] = 'application/json';
      }
    }

    try {
      const fetch = require('node-fetch');
      response = await fetch(url, requestOptions);
      
      const responseText = await response.text();
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      const result = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        responseTime,
        size: responseText.length
      };

      // Log the request (if MongoDB is available)
      try {
        const requestLog = new RequestLog({
          url,
          method: method.toUpperCase(),
          requestHeaders: headers || {},
          requestBody: body || null,
          responseStatus: response.status,
          responseHeaders: result.headers,
          responseBody: responseData,
          responseTime,
          timestamp: new Date()
        });

        await requestLog.save();
      } catch (dbError) {
        console.warn('Failed to save request to database:', dbError.message);
      }

      res.json(result);
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Log failed request (if MongoDB is available)
      try {
        const requestLog = new RequestLog({
          url,
          method: method.toUpperCase(),
          requestHeaders: headers || {},
          requestBody: body || null,
          responseStatus: 0,
          responseHeaders: {},
          responseBody: error.message,
          responseTime,
          timestamp: new Date(),
          error: true
        });

        await requestLog.save();
      } catch (dbError) {
        console.warn('Failed to save error request to database:', dbError.message);
      }

      res.status(500).json({
        error: true,
        message: error.message,
        responseTime
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get request history
app.get('/api/history', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]); // Return empty array if DB not connected
    }
    const history = await RequestLog.find()
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(history);
  } catch (error) {
    console.warn('Database error in /api/history:', error.message);
    res.json([]); // Return empty array on error
  }
});

// Get specific request from history
app.get('/api/history/:id', async (req, res) => {
  try {
    const request = await RequestLog.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete request from history
app.delete('/api/history/:id', async (req, res) => {
  try {
    await RequestLog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear all history
app.delete('/api/history', async (req, res) => {
  try {
    await RequestLog.deleteMany({});
    res.json({ message: 'History cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test APIs endpoint - provides a list of reliable APIs for testing
app.get('/api/test-apis', (req, res) => {
  const testApis = [
    {
      name: "JSONPlaceholder - Posts",
      url: "https://jsonplaceholder.typicode.com/posts/1",
      method: "GET",
      description: "Get a sample post (reliable test API)"
    },
    {
      name: "JSONPlaceholder - Users", 
      url: "https://jsonplaceholder.typicode.com/users",
      method: "GET",
      description: "Get list of users"
    },
    {
      name: "Cat Facts API",
      url: "https://catfact.ninja/fact",
      method: "GET", 
      description: "Get a random cat fact"
    },
    {
      name: "Dog API",
      url: "https://dog.ceo/api/breeds/image/random",
      method: "GET",
      description: "Get random dog image"
    },
    {
      name: "Public IP",
      url: "https://api.ipify.org?format=json",
      method: "GET",
      description: "Get your public IP address"
    },
    {
      name: "Random Quote",
      url: "https://api.quotable.io/random",
      method: "GET",
      description: "Get a random inspirational quote"
    },
    {
      name: "Weather (Demo)",
      url: "https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current=temperature_2m",
      method: "GET",
      description: "Get weather for NYC (no API key required)"
    },
    {
      name: "DevFetch Backend Test",
      url: "https://devfetchbackend.vercel.app/api/mock/test",
      method: "GET",
      description: "Test your own backend API"
    }
  ];

  res.json({
    message: "Reliable APIs for testing DevFetch",
    apis: testApis,
    tip: "These APIs are known to work well and don't require authentication"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
