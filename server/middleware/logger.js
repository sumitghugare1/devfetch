const logger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Capture response data
  const originalSend = res.send;
  res.send = function(data) {
    const responseTime = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${responseTime}ms)`);
    
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = logger;
