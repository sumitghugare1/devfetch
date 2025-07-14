const mongoose = require('mongoose');

const RequestLogSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']
  },
  requestHeaders: {
    type: Object,
    default: {}
  },
  requestBody: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  responseStatus: {
    type: Number,
    required: true
  },
  responseHeaders: {
    type: Object,
    default: {}
  },
  responseBody: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  responseTime: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  error: {
    type: Boolean,
    default: false
  }
});

// Index for faster queries
RequestLogSchema.index({ timestamp: -1 });
RequestLogSchema.index({ url: 1 });
RequestLogSchema.index({ method: 1 });

module.exports = mongoose.model('RequestLog', RequestLogSchema);
