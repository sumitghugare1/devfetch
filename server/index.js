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

    const fetch = require('node-fetch');
    const requestOptions = {
      method: method.toUpperCase(),
      headers: {
        'User-Agent': 'DevFetch/1.0',
        ...headers
      },
    };

    // Add body for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body) {
      requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      if (!requestOptions.headers['Content-Type']) {
        requestOptions.headers['Content-Type'] = 'application/json';
      }
    }

    console.log(`Proxying ${method.toUpperCase()} request to: ${url}`);
    
    const response = await fetch(url, requestOptions);
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
      size: responseText.length,
      url: url
    };

    res.json(result);
  } catch (error) {
    console.error('External API proxy error:', error);
    res.status(500).json({
      error: 'Failed to fetch from external API',
      message: error.message,
      url: req.body.url
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
