import React, { useState } from 'react';

const History = ({ history, onClearHistory, onReloadHistory, darkMode }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const deleteRequest = (id) => {
    try {
      const updatedHistory = history.filter(req => req._id !== id);
      localStorage.setItem('devfetch-history', JSON.stringify(updatedHistory));
      onReloadHistory();
      if (selectedRequest && selectedRequest._id === id) {
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('Failed to delete request:', error);
    }
  };

  const replayRequest = (request) => {
    // This would typically navigate back to the client tab with the request loaded
    // For now, we'll just show the request details
    setSelectedRequest(request);
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `devfetch-history-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const filteredHistory = history.filter(request => {
    const matchesFilter = filter === 'all' || 
      (filter === 'success' && request.responseStatus >= 200 && request.responseStatus < 300) ||
      (filter === 'error' && request.responseStatus >= 400);
      
    const matchesSearch = searchTerm === '' || 
      request.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.method.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="history-container">
      {/* History Overview Panel */}
      <div className="panel">
        <div className="panel-header" style={{background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <h2 className="panel-title" style={{color: 'white', margin: '0'}}>
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Request History
            </h2>
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '1rem', 
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              {filteredHistory.length} {filteredHistory.length === 1 ? 'request' : 'requests'}
            </span>
          </div>
          
          <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
            <button
              onClick={exportHistory}
              disabled={history.length === 0}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '0.75rem 1.25rem',
                borderRadius: '0.75rem',
                fontWeight: '500',
                cursor: history.length === 0 ? 'not-allowed' : 'pointer',
                opacity: history.length === 0 ? 0.5 : 1,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backdropFilter: 'blur(10px)'
              }}
              onMouseOver={(e) => {
                if (history.length > 0) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseOut={(e) => {
                if (history.length > 0) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1rem', height: '1rem'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
            <button
              onClick={onClearHistory}
              disabled={history.length === 0}
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.25rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                cursor: history.length === 0 ? 'not-allowed' : 'pointer',
                opacity: history.length === 0 ? 0.5 : 1,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: history.length > 0 ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none'
              }}
              onMouseOver={(e) => {
                if (history.length > 0) {
                  e.target.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (history.length > 0) {
                  e.target.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                }
              }}
            >
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '1rem', height: '1rem'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          </div>
        </div>
        
        <div className="panel-body">
          {/* Enhanced Search and Filter Section */}
          <div style={{
            background: darkMode ? 'linear-gradient(135deg, #334155, #475569)' : 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            border: `1px solid ${darkMode ? '#64748b' : '#e2e8f0'}`
          }}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'end'}}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: darkMode ? '#f1f5f9' : '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Search Requests
                </label>
                <div style={{position: 'relative'}}>
                  <svg 
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '1.25rem',
                      height: '1.25rem',
                      color: darkMode ? '#94a3b8' : '#9ca3af'
                    }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by URL, method, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem 0.875rem 3rem',
                      border: `2px solid ${darkMode ? '#64748b' : '#e5e7eb'}`,
                      borderRadius: '0.75rem',
                      outline: 'none',
                      background: darkMode ? '#1e293b' : 'white',
                      color: darkMode ? '#f1f5f9' : '#1f2937',
                      transition: 'all 0.2s ease',
                      fontSize: '0.875rem'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = darkMode ? '#64748b' : '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: darkMode ? '#f1f5f9' : '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Filter by Status
                </label>
                <div className="filter-select">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Requests</option>
                    <option value="success">✅ Successful (2xx)</option>
                    <option value="error">❌ Errors (4xx+)</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '1.5rem', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1e293b'}}>{history.length}</div>
                <div style={{fontSize: '0.75rem', color: darkMode ? '#cbd5e1' : '#64748b', fontWeight: '500'}}>Total Requests</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#059669'}}>
                  {history.filter(r => r.responseStatus >= 200 && r.responseStatus < 300).length}
                </div>
                <div style={{fontSize: '0.75rem', color: darkMode ? '#cbd5e1' : '#64748b', fontWeight: '500'}}>Successful</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#dc2626'}}>
                  {history.filter(r => r.responseStatus >= 400).length}
                </div>
                <div style={{fontSize: '0.75rem', color: darkMode ? '#cbd5e1' : '#64748b', fontWeight: '500'}}>Errors</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#7c3aed'}}>
                  {history.length > 0 ? Math.round(history.reduce((sum, r) => sum + r.responseTime, 0) / history.length) : 0}ms
                </div>
                <div style={{fontSize: '0.75rem', color: darkMode ? '#cbd5e1' : '#64748b', fontWeight: '500'}}>Avg Response</div>
              </div>
            </div>
          </div>

          {/* Enhanced History Grid */}
          {filteredHistory.length === 0 ? (
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                margin: '0 0 0.75rem 0',
                color: darkMode ? '#f1f5f9' : '#374151'
              }}>
                {history.length === 0 ? '🚀 No requests yet' : '🔍 No matching requests'}
              </h3>
              <p style={{
                fontSize: '1rem',
                margin: '0 0 1.5rem 0',
                color: darkMode ? '#cbd5e1' : '#64748b',
                lineHeight: '1.6'
              }}>
                {history.length === 0 
                  ? 'Your request history will appear here after you send your first HTTP request. Start testing APIs to build your history!' 
                  : 'Try adjusting your search terms or filters to find what you\'re looking for.'
                }
              </p>
              {history.length === 0 && (
                <div style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  💡 Switch to HTTP Client tab to get started
                </div>
              )}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredHistory.map((request, index) => (
                <div
                  key={request._id}
                  style={{
                    background: selectedRequest && selectedRequest._id === request._id 
                      ? (darkMode ? 'linear-gradient(145deg, #334155, #475569)' : 'linear-gradient(145deg, #f0f4ff, #e0e7ff)') 
                      : (darkMode ? 'linear-gradient(135deg, #1e293b, #334155)' : 'white'),
                    border: selectedRequest && selectedRequest._id === request._id 
                      ? '2px solid #667eea' 
                      : `1px solid ${darkMode ? '#64748b' : '#e2e8f0'}`,
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: selectedRequest && selectedRequest._id === request._id 
                      ? '0 8px 25px rgba(102, 126, 234, 0.15)' 
                      : (darkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.08)'),
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onClick={() => setSelectedRequest(request)}
                  onMouseOver={(e) => {
                    if (!selectedRequest || selectedRequest._id !== request._id) {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = darkMode 
                        ? '0 12px 30px rgba(0, 0, 0, 0.4)' 
                        : '0 12px 30px rgba(0, 0, 0, 0.12)';
                      e.currentTarget.style.borderColor = darkMode ? '#94a3b8' : '#cbd5e1';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!selectedRequest || selectedRequest._id !== request._id) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = darkMode 
                        ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
                        : '0 2px 8px rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.borderColor = darkMode ? '#64748b' : '#e2e8f0';
                    }
                  }}
                >
                  {/* Request Number Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '-0.5rem',
                    right: '1rem',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '1rem',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                  }}>
                    #{filteredHistory.length - index}
                  </div>

                  {/* Status and Method Section */}
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', marginTop: '0.5rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap'}}>
                      <div style={{
                        background: request.method === 'GET' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' :
                                   request.method === 'POST' ? 'linear-gradient(135deg, #10b981, #059669)' :
                                   request.method === 'PUT' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                                   request.method === 'DELETE' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                                   'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                        color: 'white',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        letterSpacing: '0.025em'
                      }}>
                        {request.method}
                      </div>
                      <div style={{
                        background: request.responseStatus >= 200 && request.responseStatus < 300 
                          ? (darkMode ? 'linear-gradient(135deg, #064e3b, #059669)' : 'linear-gradient(135deg, #dcfce7, #bbf7d0)')
                          : request.responseStatus >= 400 
                          ? (darkMode ? 'linear-gradient(135deg, #7f1d1d, #dc2626)' : 'linear-gradient(135deg, #fef2f2, #fecaca)')
                          : (darkMode ? 'linear-gradient(135deg, #1e3a8a, #3b82f6)' : 'linear-gradient(135deg, #dbeafe, #93c5fd)'),
                        color: request.responseStatus >= 200 && request.responseStatus < 300 
                          ? (darkMode ? '#bbf7d0' : '#166534')
                          : request.responseStatus >= 400 
                          ? (darkMode ? '#fecaca' : '#dc2626')
                          : (darkMode ? '#93c5fd' : '#1d4ed8'),
                        padding: '0.375rem 0.875rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        border: `1px solid ${
                          request.responseStatus >= 200 && request.responseStatus < 300 
                            ? (darkMode ? '#059669' : '#bbf7d0')
                            : request.responseStatus >= 400 
                            ? (darkMode ? '#dc2626' : '#fecaca')
                            : (darkMode ? '#3b82f6' : '#93c5fd')
                        }`
                      }}>
                        {request.responseStatus}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        fontSize: '0.75rem',
                        color: darkMode ? '#cbd5e1' : '#64748b',
                        fontWeight: '600'
                      }}>
                        <svg style={{width: '0.875rem', height: '0.875rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {request.responseTime}ms
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          replayRequest(request);
                        }}
                        style={{
                          background: darkMode 
                            ? 'linear-gradient(135deg, #1e40af, #1d4ed8)' 
                            : 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                          color: darkMode ? 'white' : '#0369a1',
                          border: `1px solid ${darkMode ? '#3b82f6' : '#7dd3fc'}`,
                          borderRadius: '0.5rem',
                          padding: '0.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = darkMode 
                            ? 'linear-gradient(135deg, #1d4ed8, #2563eb)' 
                            : 'linear-gradient(135deg, #e0f2fe, #bae6fd)';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = darkMode 
                            ? 'linear-gradient(135deg, #1e40af, #1d4ed8)' 
                            : 'linear-gradient(135deg, #f0f9ff, #e0f2fe)';
                          e.target.style.transform = 'scale(1)';
                        }}
                        title="Replay Request"
                      >
                        <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRequest(request._id);
                        }}
                        style={{
                          background: darkMode 
                            ? 'linear-gradient(135deg, #dc2626, #b91c1c)' 
                            : 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                          color: darkMode ? 'white' : '#dc2626',
                          border: `1px solid ${darkMode ? '#ef4444' : '#fca5a5'}`,
                          borderRadius: '0.5rem',
                          padding: '0.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = darkMode 
                            ? 'linear-gradient(135deg, #b91c1c, #991b1b)' 
                            : 'linear-gradient(135deg, #fee2e2, #fecaca)';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = darkMode 
                            ? 'linear-gradient(135deg, #dc2626, #b91c1c)' 
                            : 'linear-gradient(135deg, #fef2f2, #fee2e2)';
                          e.target.style.transform = 'scale(1)';
                        }}
                        title="Delete Request"
                      >
                        <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* URL Section */}
                  <div style={{marginBottom: '1rem'}}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: darkMode ? '#f1f5f9' : '#1e293b',
                      marginBottom: '0.5rem',
                      wordBreak: 'break-all',
                      lineHeight: '1.4',
                      background: darkMode ? '#334155' : '#f8fafc',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: `1px solid ${darkMode ? '#64748b' : '#e2e8f0'}`,
                      fontFamily: 'monospace'
                    }}>
                      {request.url}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.75rem',
                      color: darkMode ? '#cbd5e1' : '#64748b',
                      fontWeight: '500'
                    }}>
                      <svg style={{width: '0.875rem', height: '0.875rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(request.timestamp).toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Selection Indicator */}
                  {selectedRequest && selectedRequest._id === request._id && (
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      padding: '0.75rem',
                      borderRadius: '0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}>
                      <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Selected - View details below
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Request Details Panel */}
      {selectedRequest && (
        <div className="panel" style={{marginTop: '2rem'}}>
          <div className="panel-header" style={{
            background: 'linear-gradient(135deg, #1e293b, #334155)',
            color: 'white',
            border: 'none'
          }}>
            <h3 className="panel-title" style={{color: 'white'}}>
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Request Details
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '1rem', 
                fontSize: '0.75rem',
                fontWeight: '600',
                marginLeft: '1rem'
              }}>
                {selectedRequest.method} {selectedRequest.responseStatus}
              </span>
            </h3>
            <button
              onClick={() => setSelectedRequest(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
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
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>
          
          <div className="panel-body">
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem'}}>
              {/* Enhanced Basic Info */}
              <div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: darkMode ? '#f1f5f9' : '#1e293b',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <svg style={{width: '1.25rem', height: '1.25rem', color: '#667eea'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Request Overview
                </h4>
                
                <div style={{
                  background: darkMode ? 'linear-gradient(135deg, #334155, #475569)' : 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                  border: `1px solid ${darkMode ? '#64748b' : '#e2e8f0'}`,
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap'}}>
                    <div style={{
                      background: selectedRequest.method === 'GET' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' :
                                 selectedRequest.method === 'POST' ? 'linear-gradient(135deg, #10b981, #059669)' :
                                 selectedRequest.method === 'PUT' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                                 selectedRequest.method === 'DELETE' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                                 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      letterSpacing: '0.025em'
                    }}>
                      {selectedRequest.method}
                    </div>
                    <div style={{
                      background: selectedRequest.responseStatus >= 200 && selectedRequest.responseStatus < 300 
                        ? (darkMode ? 'linear-gradient(135deg, #064e3b, #059669)' : 'linear-gradient(135deg, #dcfce7, #bbf7d0)')
                        : selectedRequest.responseStatus >= 400 
                        ? (darkMode ? 'linear-gradient(135deg, #7f1d1d, #dc2626)' : 'linear-gradient(135deg, #fef2f2, #fecaca)')
                        : (darkMode ? 'linear-gradient(135deg, #1e3a8a, #3b82f6)' : 'linear-gradient(135deg, #dbeafe, #93c5fd)'),
                      color: selectedRequest.responseStatus >= 200 && selectedRequest.responseStatus < 300 
                        ? (darkMode ? '#bbf7d0' : '#166534')
                        : selectedRequest.responseStatus >= 400 
                        ? (darkMode ? '#fecaca' : '#dc2626')
                        : (darkMode ? '#93c5fd' : '#1d4ed8'),
                      padding: '0.5rem 1rem',
                      borderRadius: '0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      border: `2px solid ${
                        selectedRequest.responseStatus >= 200 && selectedRequest.responseStatus < 300 
                          ? (darkMode ? '#059669' : '#bbf7d0')
                          : selectedRequest.responseStatus >= 400 
                          ? (darkMode ? '#dc2626' : '#fecaca')
                          : (darkMode ? '#3b82f6' : '#93c5fd')
                      }`
                    }}>
                      {selectedRequest.responseStatus}
                    </div>
                  </div>
                  
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: darkMode ? '#f1f5f9' : '#1e293b',
                    marginBottom: '1rem',
                    wordBreak: 'break-all',
                    lineHeight: '1.5',
                    background: darkMode ? '#1e293b' : 'white',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
                    fontFamily: 'monospace'
                  }}>
                    {selectedRequest.url}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#64748b',
                    fontWeight: '500',
                    marginBottom: '1.5rem'
                  }}>
                    <svg style={{width: '1rem', height: '1rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(selectedRequest.timestamp).toLocaleString()}
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '1rem'
                  }}>
                    <div style={{textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0'}}>
                      <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#7c3aed'}}>{selectedRequest.responseTime}ms</div>
                      <div style={{fontSize: '0.75rem', color: '#64748b', fontWeight: '500'}}>Response Time</div>
                    </div>
                    <div style={{textAlign: 'center', padding: '1rem', background: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0'}}>
                      <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#0369a1'}}>{selectedRequest.responseStatus}</div>
                      <div style={{fontSize: '0.75rem', color: '#64748b', fontWeight: '500'}}>Status Code</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Request Headers */}
              {Object.keys(selectedRequest.requestHeaders || {}).length > 0 && (
                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: darkMode ? '#f1f5f9' : '#1e293b',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <svg style={{width: '1.25rem', height: '1.25rem', color: '#10b981'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Request Headers
                  </h4>
                  <div style={{
                    background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
                    border: '2px solid #bbf7d0',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    maxHeight: '16rem',
                    overflow: 'auto'
                  }}>
                    <pre style={{
                      fontSize: '0.8rem',
                      color: '#166534',
                      margin: 0,
                      lineHeight: '1.6',
                      fontFamily: 'monospace'
                    }}>
                      {JSON.stringify(selectedRequest.requestHeaders, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Enhanced Request Body */}
              {selectedRequest.requestBody && (
                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: darkMode ? '#f1f5f9' : '#1e293b',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <svg style={{width: '1.25rem', height: '1.25rem', color: '#f59e0b'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Request Body
                  </h4>
                  <div style={{
                    background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
                    border: '2px solid #fbbf24',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    maxHeight: '16rem',
                    overflow: 'auto'
                  }}>
                    <pre style={{
                      fontSize: '0.8rem',
                      color: '#92400e',
                      margin: 0,
                      lineHeight: '1.6',
                      fontFamily: 'monospace'
                    }}>
                      {typeof selectedRequest.requestBody === 'object' 
                        ? JSON.stringify(selectedRequest.requestBody, null, 2)
                        : selectedRequest.requestBody
                      }
                    </pre>
                  </div>
                </div>
              )}

              {/* Enhanced Response Headers */}
              {Object.keys(selectedRequest.responseHeaders || {}).length > 0 && (
                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: darkMode ? '#f1f5f9' : '#1e293b',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <svg style={{width: '1.25rem', height: '1.25rem', color: '#3b82f6'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Response Headers
                  </h4>
                  <div style={{
                    background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                    border: '2px solid #93c5fd',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    maxHeight: '16rem',
                    overflow: 'auto'
                  }}>
                    <pre style={{
                      fontSize: '0.8rem',
                      color: '#1d4ed8',
                      margin: 0,
                      lineHeight: '1.6',
                      fontFamily: 'monospace'
                    }}>
                      {JSON.stringify(selectedRequest.responseHeaders, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Enhanced Response Body */}
              <div style={{gridColumn: '1 / -1'}}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: darkMode ? '#f1f5f9' : '#1e293b',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <svg style={{width: '1.25rem', height: '1.25rem', color: '#8b5cf6'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Response Body
                </h4>
                <div style={{
                  background: selectedRequest.error 
                    ? 'linear-gradient(135deg, #fef2f2, #fee2e2)' 
                    : 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
                  border: selectedRequest.error 
                    ? '2px solid #fca5a5' 
                    : '2px solid #c4b5fd',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  maxHeight: '20rem',
                  overflow: 'auto',
                  position: 'relative'
                }}>
                  {selectedRequest.error && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      ERROR
                    </div>
                  )}
                  <pre style={{
                    fontSize: '0.875rem',
                    color: selectedRequest.error ? '#dc2626' : '#7c3aed',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6',
                    fontFamily: 'monospace'
                  }}>
                    {selectedRequest.error ? (
                      selectedRequest.responseBody
                    ) : (
                      typeof selectedRequest.responseBody === 'object' 
                        ? JSON.stringify(selectedRequest.responseBody, null, 2)
                        : selectedRequest.responseBody
                    )}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
