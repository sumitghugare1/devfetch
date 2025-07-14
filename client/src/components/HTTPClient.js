import React, { useState } from 'react';
import axios from 'axios';

const HTTPClient = ({ onRequestComplete, apiBaseUrl, darkMode }) => {
  const [request, setRequest] = useState({
    url: `${apiBaseUrl}/api/mock/test`,
    method: 'GET',
    headers: [],
    body: ''
  });
  
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  const addHeader = () => {
    setRequest(prev => ({
      ...prev,
      headers: [...prev.headers, { key: '', value: '', enabled: true }]
    }));
  };

  const updateHeader = (index, field, value) => {
    setRequest(prev => ({
      ...prev,
      headers: prev.headers.map((header, i) => 
        i === index ? { ...header, [field]: value } : header
      )
    }));
  };

  const removeHeader = (index) => {
    setRequest(prev => ({
      ...prev,
      headers: prev.headers.filter((_, i) => i !== index)
    }));
  };

  const toggleHeader = (index) => {
    setRequest(prev => ({
      ...prev,
      headers: prev.headers.map((header, i) => 
        i === index ? { ...header, enabled: !header.enabled } : header
      )
    }));
  };

  const sendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const startTime = Date.now();
    const enabledHeaders = request.headers
      .filter(h => h.enabled && h.key && h.value)
      .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

    try {
      // Check if this is an external URL (not our backend)
      const isExternalUrl = !request.url.startsWith(apiBaseUrl) && 
                           (request.url.startsWith('http://') || request.url.startsWith('https://'));

      let res;
      
      if (isExternalUrl) {
        // Use backend proxy for external URLs to avoid CORS issues
        console.log('Using backend proxy for external URL:', request.url);
        
        const proxyData = {
          url: request.url,
          method: request.method,
          headers: enabledHeaders
        };

        // Add body for methods that support it
        if (['POST', 'PUT', 'PATCH'].includes(request.method.toUpperCase()) && request.body) {
          try {
            proxyData.body = JSON.parse(request.body);
          } catch {
            proxyData.body = request.body;
          }
        }

        res = await axios.post(`${apiBaseUrl}/api/external`, proxyData, {
          timeout: 30000
        });
        
        // The response from proxy endpoint contains the actual response data
        const actualResponse = res.data;
        res = {
          status: actualResponse.status,
          statusText: actualResponse.statusText,
          headers: actualResponse.headers,
          data: actualResponse.data
        };
      } else {
        // Make direct HTTP request for internal/same-origin requests
        const axiosConfig = {
          method: request.method.toLowerCase(),
          url: request.url,
          headers: enabledHeaders,
          timeout: 30000 // 30 second timeout
        };

        // Add body for methods that support it
        if (['post', 'put', 'patch'].includes(request.method.toLowerCase()) && request.body) {
          try {
            // Try to parse as JSON
            axiosConfig.data = JSON.parse(request.body);
          } catch {
            // If not JSON, send as string
            axiosConfig.data = request.body;
          }
        }

        res = await axios(axiosConfig);
      }
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const responseData = {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        data: res.data,
        responseTime: responseTime
      };

      setResponse(responseData);

      // Save to history
      const historyEntry = {
        url: request.url,
        method: request.method,
        headers: enabledHeaders,
        body: request.body,
        responseStatus: res.status,
        responseTime: responseTime,
        response: responseData
      };

      onRequestComplete(historyEntry);

    } catch (err) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      const enabledHeaders = request.headers
        .filter(h => h.enabled && h.key && h.value)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

      let errorResponse;
      
      // Check if this was a proxy request error
      if (err.response?.data?.error && err.response?.data?.url) {
        // This is an error from our proxy endpoint
        errorResponse = {
          status: err.response.status || 500,
          statusText: err.response.statusText || 'Proxy Error',
          headers: err.response.headers || {},
          data: err.response.data,
          responseTime: responseTime
        };
      } else {
        // This is a direct request error
        errorResponse = {
          status: err.response?.status || 0,
          statusText: err.response?.statusText || 'Network Error',
          headers: err.response?.headers || {},
          data: err.response?.data || { error: err.message },
          responseTime: responseTime
        };
      }

      setResponse(errorResponse);
      setError(errorResponse.data);

      // Save error to history too
      const historyEntry = {
        url: request.url,
        method: request.method,
        headers: enabledHeaders,
        body: request.body,
        responseStatus: errorResponse.status,
        responseTime: responseTime,
        response: errorResponse
      };

      onRequestComplete(historyEntry);

    } finally {
      setLoading(false);
    }
  };

  const formatJson = (text) => {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  };

  const loadPreset = (preset) => {
    const presets = {
      test: {
        url: `${apiBaseUrl}/api/mock/test`,
        method: 'GET',
        headers: [],
        body: ''
      },
      users: {
        url: `${apiBaseUrl}/api/mock/users`,
        method: 'GET',
        headers: [],
        body: ''
      },
      createUser: {
        url: `${apiBaseUrl}/api/mock/users`,
        method: 'POST',
        headers: [{ key: 'Content-Type', value: 'application/json', enabled: true }],
        body: JSON.stringify({ name: 'John Doe', email: 'john@example.com', role: 'user' }, null, 2)
      },
      status: {
        url: `${apiBaseUrl}/api/mock/status/404`,
        method: 'GET',
        headers: [],
        body: ''
      }
    };

    if (presets[preset]) {
      setRequest(presets[preset]);
    }
  };

  return (
    <div className="content-grid">
      {/* Request Panel */}
      <div className="panel">
        <div className="panel-header" style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)', 
          color: 'white', 
          border: 'none'
        }}>
          <h2 className="panel-title" style={{color: 'white'}}>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Request Builder
          </h2>
          
          {/* Presets */}
          <div style={{marginTop: '1rem'}}>
            <div style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              flexWrap: 'wrap',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1rem',
              borderRadius: '0.75rem',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{
                fontSize: '0.875rem', 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Start :
              </span>
              
              {/* Quick buttons */}
              {['test', 'users', 'createUser', 'status'].map(preset => (
                <button
                  key={preset}
                  onClick={() => loadPreset(preset)}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontWeight: '500',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  {preset === 'createUser' ? 'Create User' : preset.charAt(0).toUpperCase() + preset.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="panel-body" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
          {/* URL and Method */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '700',
              color: darkMode ? '#f1f5f9' : '#1e293b',
              marginBottom: '0.75rem',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <svg style={{width: '1rem', height: '1rem', color: '#667eea'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Request Configuration
            </label>
            <div style={{
              display: 'flex', 
              gap: '0.75rem',
              background: darkMode ? 'linear-gradient(135deg, #334155, #475569)' : 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: `1px solid ${darkMode ? '#64748b' : '#e2e8f0'}`
            }}>
              <div className={`method-select ${request.method.toLowerCase()}`}>
                <select
                  value={request.method}
                  onChange={(e) => setRequest(prev => ({ ...prev, method: e.target.value }))}
                >
                  {methods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
              <input
                type="url"
                value={request.url}
                onChange={(e) => setRequest(prev => ({ ...prev, url: e.target.value }))}
                placeholder="Enter request URL (e.g., https://api.example.com/users)"
                style={{
                  flex: 1,
                  padding: '0.875rem 1rem',
                  border: `2px solid ${darkMode ? '#64748b' : '#e2e8f0'}`,
                  borderRadius: '0.75rem',
                  background: darkMode ? '#1e293b' : 'white',
                  color: darkMode ? '#f1f5f9' : '#1e293b',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'monospace'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = darkMode ? '#64748b' : '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                onClick={sendRequest}
                disabled={loading || !request.url}
                style={{
                  minWidth: '140px',
                  padding: '0.875rem 1.5rem',
                  background: loading || !request.url 
                    ? (darkMode ? '#64748b' : '#e2e8f0')
                    : 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: loading || !request.url ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  boxShadow: loading || !request.url ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
                onMouseOver={(e) => {
                  if (!loading && request.url) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading && request.url) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '1rem', 
                      height: '1rem', 
                      border: '2px solid rgba(255, 255, 255, 0.3)', 
                      borderTop: '2px solid white', 
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Request
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Headers */}
          <div>
            <div style={{
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1rem'
            }}>
              <label style={{
                fontSize: '0.875rem', 
                fontWeight: '700', 
                color: darkMode ? '#f1f5f9' : '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg style={{width: '1rem', height: '1rem', color: '#10b981'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Request Headers
                <span style={{
                  background: darkMode ? '#475569' : '#e2e8f0',
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {request.headers.filter(h => h.enabled && h.key && h.value).length}
                </span>
              </label>
              <button
                onClick={addHeader}
                style={{
                  color: '#667eea',
                  background: darkMode ? 'linear-gradient(135deg, #334155, #475569)' : 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                  border: `1px solid ${darkMode ? '#64748b' : '#7dd3fc'}`,
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = darkMode 
                    ? 'linear-gradient(135deg, #475569, #64748b)' 
                    : 'linear-gradient(135deg, #e0f2fe, #bae6fd)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = darkMode 
                    ? 'linear-gradient(135deg, #334155, #475569)' 
                    : 'linear-gradient(135deg, #f0f9ff, #e0f2fe)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Header
              </button>
            </div>
            
            <div style={{
              background: darkMode ? 'linear-gradient(135deg, #334155, #475569)' : 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: `1px solid ${darkMode ? '#64748b' : '#e2e8f0'}`,
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem'
            }}>
              {request.headers.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  borderRadius: '0.75rem',
                  border: `2px dashed ${darkMode ? '#64748b' : '#cbd5e1'}`
                }}>
                  <svg style={{width: '2rem', height: '2rem', margin: '0 auto 0.5rem', color: darkMode ? '#94a3b8' : '#9ca3af'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <p style={{fontSize: '0.875rem', margin: 0}}>No headers added yet. Click "Add Header" to get started.</p>
                </div>
              ) : (
                request.headers.map((header, index) => (
                  <div key={index} style={{
                    display: 'flex', 
                    gap: '0.75rem', 
                    alignItems: 'center',
                    background: darkMode ? '#1e293b' : 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
                    boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <input
                      type="checkbox"
                      checked={header.enabled}
                      onChange={() => toggleHeader(index)}
                      style={{
                        width: '1.25rem', 
                        height: '1.25rem',
                        accentColor: '#667eea'
                      }}
                    />
                    <input
                      type="text"
                      value={header.key}
                      onChange={(e) => updateHeader(index, 'key', e.target.value)}
                      placeholder="Header name (e.g., Authorization)"
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: `2px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
                        borderRadius: '0.5rem',
                        background: darkMode ? '#334155' : '#f8fafc',
                        color: darkMode ? '#f1f5f9' : '#1e293b',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.background = darkMode ? '#1e293b' : 'white';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = darkMode ? '#475569' : '#e2e8f0';
                        e.target.style.background = darkMode ? '#334155' : '#f8fafc';
                      }}
                    />
                    <input
                      type="text"
                      value={header.value}
                      onChange={(e) => updateHeader(index, 'value', e.target.value)}
                      placeholder="Header value (e.g., Bearer token)"
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: `2px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
                        borderRadius: '0.5rem',
                        background: darkMode ? '#334155' : '#f8fafc',
                        color: darkMode ? '#f1f5f9' : '#1e293b',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.background = darkMode ? '#1e293b' : 'white';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = darkMode ? '#475569' : '#e2e8f0';
                        e.target.style.background = darkMode ? '#334155' : '#f8fafc';
                      }}
                    />
                    <button
                      onClick={() => removeHeader(index)}
                      style={{
                        color: '#ef4444',
                        background: darkMode ? 'linear-gradient(135deg, #7f1d1d, #991b1b)' : 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                        border: `1px solid ${darkMode ? '#b91c1c' : '#fca5a5'}`,
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = darkMode 
                          ? 'linear-gradient(135deg, #991b1b, #b91c1c)' 
                          : 'linear-gradient(135deg, #fee2e2, #fecaca)';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = darkMode 
                          ? 'linear-gradient(135deg, #7f1d1d, #991b1b)' 
                          : 'linear-gradient(135deg, #fef2f2, #fee2e2)';
                        e.target.style.transform = 'scale(1)';
                      }}
                      title="Remove Header"
                    >
                      <svg style={{width: '1.25rem', height: '1.25rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Body */}
          {['POST', 'PUT', 'PATCH'].includes(request.method) && (
            <div>
              <label style={{
                display: 'flex', 
                fontSize: '0.875rem', 
                fontWeight: '700', 
                color: darkMode ? '#f1f5f9' : '#1e293b', 
                marginBottom: '1rem',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg style={{width: '1rem', height: '1rem', color: '#f59e0b'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Request Body
                <span style={{
                  background: request.body ? (darkMode ? '#475569' : '#e2e8f0') : (darkMode ? '#64748b' : '#cbd5e1'),
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {request.body ? `${request.body.length} chars` : 'Empty'}
                </span>
              </label>
              <div style={{
                background: darkMode ? 'linear-gradient(135deg, #334155, #475569)' : 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                padding: '1.5rem',
                borderRadius: '1rem',
                border: `1px solid ${darkMode ? '#64748b' : '#e2e8f0'}`
              }}>
                <textarea
                  value={request.body}
                  onChange={(e) => setRequest(prev => ({ ...prev, body: e.target.value }))}
                  placeholder="Enter request body (JSON, XML, or plain text)"
                  style={{
                    width: '100%',
                    height: '10rem',
                    padding: '1rem',
                    border: `2px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
                    borderRadius: '0.75rem',
                    background: darkMode ? '#1e293b' : 'white',
                    color: darkMode ? '#f1f5f9' : '#1e293b',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = darkMode ? '#475569' : '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div style={{marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
                  <button
                    onClick={() => setRequest(prev => ({ ...prev, body: formatJson(prev.body) }))}
                    style={{
                      color: '#667eea',
                      background: darkMode ? 'linear-gradient(135deg, #1e40af, #1d4ed8)' : 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                      border: `1px solid ${darkMode ? '#3b82f6' : '#7dd3fc'}`,
                      borderRadius: '0.5rem',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = darkMode 
                        ? 'linear-gradient(135deg, #1d4ed8, #2563eb)' 
                        : 'linear-gradient(135deg, #e0f2fe, #bae6fd)';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = darkMode 
                        ? 'linear-gradient(135deg, #1e40af, #1d4ed8)' 
                        : 'linear-gradient(135deg, #f0f9ff, #e0f2fe)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Format JSON
                  </button>
                  <button
                    onClick={() => setRequest(prev => ({ ...prev, body: '' }))}
                    style={{
                      color: '#64748b',
                      background: 'none',
                      border: `1px solid ${darkMode ? '#64748b' : '#cbd5e1'}`,
                      borderRadius: '0.5rem',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = darkMode ? '#334155' : '#f1f5f9';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'none';
                    }}
                  >
                    <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear Body
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Response Panel */}
      <div className="panel">
        <div className="panel-header" style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)', 
          color: 'white', 
          border: 'none'
        }}>
          <h2 className="panel-title" style={{color: 'white'}}>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Response Viewer
            {response && (
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)', 
                padding: '0.5rem 1rem', 
                borderRadius: '1rem', 
                fontSize: '0.75rem',
                fontWeight: '600',
                marginLeft: '1rem',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg style={{width: '0.75rem', height: '0.75rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {response.status} • {response.responseTime}ms
              </span>
            )}
          </h2>
        </div>
        
        <div className="panel-body">
          {loading && (
            <div style={{
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '4rem 2rem', 
              flexDirection: 'column', 
              gap: '1.5rem',
              background: darkMode ? 'linear-gradient(135deg, #334155, #475569)' : 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
              borderRadius: '1rem',
              border: `2px dashed ${darkMode ? '#64748b' : '#cbd5e1'}`
            }}>
              <div style={{
                width: '3rem', 
                height: '3rem', 
                border: `4px solid ${darkMode ? '#475569' : '#e2e8f0'}`, 
                borderTop: '4px solid #667eea', 
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <div style={{textAlign: 'center'}}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  margin: '0 0 0.5rem 0',
                  color: darkMode ? '#f1f5f9' : '#1e293b'
                }}>
                  🚀 Sending request...
                </h3>
                <p style={{
                  color: darkMode ? '#cbd5e1' : '#64748b', 
                  fontSize: '1rem',
                  margin: 0
                }}>
                  Please wait while we process your HTTP request
                </p>
              </div>
            </div>
          )}

          {error && (
            <div style={{
              background: darkMode ? 'linear-gradient(135deg, #7f1d1d, #991b1b)' : 'linear-gradient(135deg, #fef2f2, #fee2e2)', 
              border: `2px solid ${darkMode ? '#b91c1c' : '#fecaca'}`, 
              borderRadius: '1rem', 
              padding: '2rem'
            }}>
              <div style={{display: 'flex', alignItems: 'flex-start', gap: '1rem'}}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg style={{width: '1.5rem', height: '1.5rem', color: 'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div style={{flex: 1}}>
                  <h3 style={{
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    color: darkMode ? '#fecaca' : '#dc2626', 
                    margin: '0 0 1rem 0'
                  }}>
                    ❌ Request Failed
                  </h3>
                  <div style={{
                    background: darkMode ? '#450a0a' : 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: `1px solid ${darkMode ? '#7f1d1d' : '#f87171'}`,
                    maxHeight: '16rem',
                    overflow: 'auto'
                  }}>
                    <pre style={{
                      fontSize: '0.875rem', 
                      color: darkMode ? '#fca5a5' : '#b91c1c', 
                      whiteSpace: 'pre-wrap', 
                      margin: 0,
                      fontFamily: 'monospace',
                      lineHeight: '1.5'
                    }}>
                      {JSON.stringify(error, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {response && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
              {/* Status and metrics */}
              <div style={{
                background: darkMode ? 'linear-gradient(135deg, #334155, #475569)' : 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                padding: '1.5rem',
                borderRadius: '1rem',
                border: `1px solid ${darkMode ? '#64748b' : '#e2e8f0'}`
              }}>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center'}}>
                  <div style={{
                    background: response.status >= 200 && response.status < 300 
                      ? (darkMode ? 'linear-gradient(135deg, #064e3b, #059669)' : 'linear-gradient(135deg, #dcfce7, #bbf7d0)')
                      : response.status >= 400 
                      ? (darkMode ? 'linear-gradient(135deg, #7f1d1d, #dc2626)' : 'linear-gradient(135deg, #fef2f2, #fecaca)')
                      : (darkMode ? 'linear-gradient(135deg, #1e3a8a, #3b82f6)' : 'linear-gradient(135deg, #dbeafe, #93c5fd)'),
                    color: response.status >= 200 && response.status < 300 
                      ? (darkMode ? '#bbf7d0' : '#166534')
                      : response.status >= 400 
                      ? (darkMode ? '#fecaca' : '#dc2626')
                      : (darkMode ? '#93c5fd' : '#1d4ed8'),
                    padding: '0.75rem 1.25rem',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: '700',
                    border: `2px solid ${
                      response.status >= 200 && response.status < 300 
                        ? (darkMode ? '#059669' : '#bbf7d0')
                        : response.status >= 400 
                        ? (darkMode ? '#dc2626' : '#fecaca')
                        : (darkMode ? '#3b82f6' : '#93c5fd')
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <svg style={{width: '1.25rem', height: '1.25rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                        response.status >= 200 && response.status < 300 
                          ? "M5 13l4 4L19 7" 
                          : response.status >= 400 
                          ? "M6 18L18 6M6 6l12 12" 
                          : "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      } />
                    </svg>
                    {response.status} {response.statusText}
                  </div>
                  
                  <div style={{
                    fontSize: '0.875rem', 
                    color: darkMode ? '#cbd5e1' : '#64748b', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    background: darkMode ? '#1e293b' : 'white',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`
                  }}>
                    <svg style={{width: '1rem', height: '1rem', color: '#8b5cf6'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <strong>{response.responseTime}ms</strong>
                  </div>
                  
                  {response.size && (
                    <div style={{
                      fontSize: '0.875rem', 
                      color: darkMode ? '#cbd5e1' : '#64748b', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      background: darkMode ? '#1e293b' : 'white',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.75rem',
                      border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`
                    }}>
                      <svg style={{width: '1rem', height: '1rem', color: '#10b981'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <strong>{response.size} bytes</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Response headers */}
              <div>
                <h3 style={{
                  fontSize: '1rem', 
                  fontWeight: '700', 
                  color: darkMode ? '#f1f5f9' : '#1e293b', 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <svg style={{width: '1.25rem', height: '1.25rem', color: '#3b82f6'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Response Headers
                </h3>
                <div style={{
                  background: darkMode ? 'linear-gradient(135deg, #1e3a8a, #1e40af)' : 'linear-gradient(135deg, #eff6ff, #dbeafe)', 
                  border: `2px solid ${darkMode ? '#3b82f6' : '#93c5fd'}`, 
                  borderRadius: '1rem', 
                  padding: '1.5rem', 
                  maxHeight: '12rem', 
                  overflow: 'auto'
                }}>
                  <pre style={{
                    fontSize: '0.875rem', 
                    color: darkMode ? '#bfdbfe' : '#1d4ed8', 
                    margin: 0,
                    fontFamily: 'monospace',
                    lineHeight: '1.6'
                  }}>
                    {JSON.stringify(response.headers, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Response body */}
              <div>
                <h3 style={{
                  fontSize: '1rem', 
                  fontWeight: '700', 
                  color: darkMode ? '#f1f5f9' : '#1e293b', 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <svg style={{width: '1.25rem', height: '1.25rem', color: '#8b5cf6'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Response Body
                </h3>
                <div style={{
                  background: darkMode ? 'linear-gradient(135deg, #581c87, #7c3aed)' : 'linear-gradient(135deg, #faf5ff, #f3e8ff)', 
                  border: `2px solid ${darkMode ? '#8b5cf6' : '#c4b5fd'}`, 
                  borderRadius: '1rem', 
                  padding: '1.5rem', 
                  maxHeight: '24rem', 
                  overflow: 'auto',
                  position: 'relative'
                }}>
                  <pre style={{
                    fontSize: '0.875rem', 
                    color: darkMode ? '#e9d5ff' : '#7c3aed', 
                    margin: 0, 
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    lineHeight: '1.6'
                  }}>
                    {typeof response.data === 'object' 
                      ? JSON.stringify(response.data, null, 2)
                      : response.data
                    }
                  </pre>
                </div>
              </div>
            </div>
          )}

          {!loading && !response && !error && (
            <div style={{
              textAlign: 'center', 
              padding: '4rem 2rem', 
              background: darkMode ? 'linear-gradient(135deg, #334155, #475569)' : 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
              borderRadius: '1rem',
              border: `2px dashed ${darkMode ? '#64748b' : '#cbd5e1'}`
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: darkMode ? 'linear-gradient(135deg, #64748b, #475569)' : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: darkMode ? '#cbd5e1' : '#64748b'
              }}>
                <svg style={{width: '2rem', height: '2rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 style={{
                fontSize: '1.25rem', 
                fontWeight: '700', 
                margin: '0 0 0.75rem 0', 
                color: darkMode ? '#f1f5f9' : '#1e293b'
              }}>
                🚀 Ready to send requests
              </h3>
              <p style={{
                fontSize: '1rem', 
                margin: 0, 
                color: darkMode ? '#cbd5e1' : '#64748b',
                lineHeight: '1.6'
              }}>
                Configure your request above and click "Send Request" to see the response here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HTTPClient;
