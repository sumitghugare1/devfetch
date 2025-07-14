import React, { useState, useEffect } from 'react';
import HTTPClient from './components/HTTPClient';
import History from './components/History';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [activeTab, setActiveTab] = useState('client');
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    loadHistory();
    
    // Check for saved dark mode preference, default to dark mode
    const savedDarkMode = localStorage.getItem('darkMode');
    const isDarkMode = savedDarkMode !== null ? savedDarkMode === 'true' : true;
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('devfetch-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to load history from localStorage:', error);
      setHistory([]);
    }
  };

  const saveHistoryToStorage = (newHistory) => {
    try {
      localStorage.setItem('devfetch-history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save history to localStorage:', error);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem('devfetch-history');
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const handleRequestComplete = (requestData) => {
    try {
      const newRequest = {
        _id: Date.now().toString(), // Simple ID generation
        ...requestData,
        timestamp: new Date().toISOString()
      };
      
      const updatedHistory = [newRequest, ...history];
      setHistory(updatedHistory);
      saveHistoryToStorage(updatedHistory);
    } catch (error) {
      console.error('Failed to save request to history:', error);
    }
  };

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <div className="app-background">
        {/* Navigation Bar */}
        <nav className="app-nav">
          <div className="nav-content">
            <div className="nav-brand">
              <div className="brand-icon">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              DevFetch
            </div>
            
            <div className="nav-tabs">
              <button
                onClick={() => setActiveTab('client')}
                className={`nav-tab ${activeTab === 'client' ? 'active' : ''}`}
              >
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginRight: '0.5rem', display: 'inline'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                HTTP Client
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
              >
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginRight: '0.5rem', display: 'inline'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History ({history.length})
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`nav-tab ${activeTab === 'about' ? 'active' : ''}`}
              >
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginRight: '0.5rem', display: 'inline'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`nav-tab ${activeTab === 'contact' ? 'active' : ''}`}
              >
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginRight: '0.5rem', display: 'inline'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </button>
            </div>
            
            <div className="nav-controls">
              <button
                onClick={toggleDarkMode}
                className="theme-toggle"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Banner - Only show on HTTP Client tab */}
        {activeTab === 'client' && (
          <section className="hero-banner">
            <div className="hero-content">
              <div className="hero-title">
                <h1>DevFetch</h1>
                <span className="hero-badge">by Sumit Ghugare</span>
              </div>
              <p className="hero-subtitle">
                The ultimate HTTP Client & API Testing Tool designed for modern developers. 
                Test REST APIs, debug requests, manage collections, and streamline your development workflow.
              </p>
              <div className="hero-features">
                <div className="hero-feature-card">
                  <div className="hero-feature-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3>Lightning Fast</h3>
                  <p>Send HTTP requests instantly with real-time response analysis and beautiful formatting</p>
                </div>
                <div className="hero-feature-card">
                  <div className="hero-feature-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3>Smart History</h3>
                  <p>Automatically log requests with intelligent filtering, search, and export capabilities</p>
                </div>
                <div className="hero-feature-card">
                  <div className="hero-feature-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <h3>Dark Mode First</h3>
                  <p>Designed with dark mode as the primary experience, perfect for developers</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <main className="main-content">
          {activeTab === 'client' && (
            <HTTPClient onRequestComplete={handleRequestComplete} apiBaseUrl={API_BASE_URL} darkMode={darkMode} />
          )}
          {activeTab === 'history' && (
            <History 
              history={history} 
              onClearHistory={clearHistory}
              onReloadHistory={loadHistory}
              darkMode={darkMode}
            />
          )}
          {activeTab === 'about' && (
            <div className="panel">
              <div className="panel-header" style={{background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none'}}>
                <h2 className="panel-title" style={{color: 'white'}}>
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About DevFetch
                </h2>
              </div>
              <div className="panel-body">
                {/* Hero Section */}
                <div style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  padding: '3rem 2rem',
                  borderRadius: '1rem',
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: '2rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    backgroundSize: '60px 60px'
                  }}></div>
                  <div style={{position: 'relative', zIndex: 1}}>
                    <h1 style={{fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem', margin: '0 0 0.5rem 0'}}>
                      DevFetch
                    </h1>
                    <p style={{fontSize: '1rem', opacity: '0.8', marginBottom: '1rem', margin: '0 0 1rem 0'}}>
                      by <strong>Sumit Ghugare</strong>
                    </p>
                    <p style={{fontSize: '1.25rem', opacity: '0.9', marginBottom: '2rem', margin: '0 0 2rem 0'}}>
                      Professional HTTP Client & API Testing Tool
                    </p>
                    <div style={{display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap'}}>
                      <div style={{textAlign: 'center'}}>
                        <div style={{fontSize: '2rem', fontWeight: '700'}}>⚡</div>
                        <div style={{fontSize: '0.875rem', opacity: '0.8'}}>Lightning Fast</div>
                      </div>
                      <div style={{textAlign: 'center'}}>
                        <div style={{fontSize: '2rem', fontWeight: '700'}}>📋</div>
                        <div style={{fontSize: '0.875rem', opacity: '0.8'}}>Smart History</div>
                      </div>
                      <div style={{textAlign: 'center'}}>
                        <div style={{fontSize: '2rem', fontWeight: '700'}}>🌙</div>
                        <div style={{fontSize: '0.875rem', opacity: '0.8'}}>Dark Mode</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div style={{marginBottom: '2rem'}}>
                  <h3 style={{
                    color: darkMode ? '#f1f5f9' : '#1e293b', 
                    marginBottom: '1.5rem', 
                    fontWeight: '700', 
                    fontSize: '1.5rem', 
                    textAlign: 'center'
                  }}>
                    ✨ Key Features
                  </h3>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
                    <div className="feature-card" style={{
                      background: darkMode ? 'linear-gradient(135deg, #334155, #475569)' : 'linear-gradient(135deg, #f8fafc, #ffffff)', 
                      border: `1px solid ${darkMode ? '#64748b' : '#e2e8f0'}`, 
                      height: 'auto'
                    }}>
                      <div className="feature-icon" style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>
                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="feature-title" style={{color: darkMode ? '#f1f5f9' : '#1e293b'}}>Lightning Fast Requests</div>
                      <div className="feature-description" style={{color: darkMode ? '#cbd5e1' : '#64748b'}}>Send HTTP requests instantly with real-time response analysis and beautiful formatting</div>
                    </div>
                    
                    <div className="feature-card" style={{
                      background: darkMode ? 'linear-gradient(135deg, #334155, #475569)' : 'linear-gradient(135deg, #f8fafc, #ffffff)', 
                      border: `1px solid ${darkMode ? '#64748b' : '#e2e8f0'}`, 
                      height: 'auto'
                    }}>
                      <div className="feature-icon" style={{background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'}}>
                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="feature-title" style={{color: darkMode ? '#f1f5f9' : '#1e293b'}}>Smart History Management</div>
                      <div className="feature-description" style={{color: darkMode ? '#cbd5e1' : '#64748b'}}>Automatically log requests with intelligent filtering, search, and export capabilities</div>
                    </div>
                    
                    <div className="feature-card" style={{
                      background: darkMode ? 'linear-gradient(135deg, #334155, #475569)' : 'linear-gradient(135deg, #f8fafc, #ffffff)', 
                      border: `1px solid ${darkMode ? '#64748b' : '#e2e8f0'}`, 
                      height: 'auto'
                    }}>
                      <div className="feature-icon" style={{background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'}}>
                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="feature-title" style={{color: darkMode ? '#f1f5f9' : '#1e293b'}}>Developer Experience</div>
                      <div className="feature-description" style={{color: darkMode ? '#cbd5e1' : '#64748b'}}>Clean interface with dark mode, keyboard shortcuts, and professional design</div>
                    </div>
                  </div>
                </div>

                {/* Technology Stack */}
                <div className="tech-stack-section" style={{
                  background: darkMode ? 'linear-gradient(135deg, #334155, #475569)' : '#f8fafc', 
                  padding: '2rem', 
                  borderRadius: '1rem', 
                  border: `1px solid ${darkMode ? '#64748b' : '#e2e8f0'}`, 
                  marginBottom: '2rem'
                }}>
                  <h4 style={{
                    color: darkMode ? '#f1f5f9' : '#1e293b', 
                    marginBottom: '1.5rem', 
                    fontWeight: '700', 
                    textAlign: 'center', 
                    fontSize: '1.25rem'
                  }}>
                    🚀 Technology Stack
                  </h4>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                    <div style={{textAlign: 'center', padding: '1rem'}}>
                      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⚛️</div>
                      <div style={{fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b'}}>React.js</div>
                      <div style={{fontSize: '0.875rem', color: darkMode ? '#cbd5e1' : '#64748b'}}>Frontend Framework</div>
                    </div>
                    <div style={{textAlign: 'center', padding: '1rem'}}>
                      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🟢</div>
                      <div style={{fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b'}}>Node.js</div>
                      <div style={{fontSize: '0.875rem', color: darkMode ? '#cbd5e1' : '#64748b'}}>Backend Runtime</div>
                    </div>
                    <div style={{textAlign: 'center', padding: '1rem'}}>
                      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🚂</div>
                      <div style={{fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b'}}>Express.js</div>
                      <div style={{fontSize: '0.875rem', color: darkMode ? '#cbd5e1' : '#64748b'}}>Web Framework</div>
                    </div>
                    <div style={{textAlign: 'center', padding: '1rem'}}>
                      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>💾</div>
                      <div style={{fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1e293b'}}>localStorage</div>
                      <div style={{fontSize: '0.875rem', color: darkMode ? '#cbd5e1' : '#64748b'}}>Client Storage</div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div style={{background: 'linear-gradient(135deg, #1e293b, #334155)', color: 'white', padding: '2rem', borderRadius: '1rem', textAlign: 'center'}}>
                  <h4 style={{marginBottom: '1.5rem', fontWeight: '700', fontSize: '1.25rem', margin: '0 0 1.5rem 0'}}>
                    📊 Built for Performance
                  </h4>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem'}}>
                    <div>
                      <div style={{fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem'}}>100%</div>
                      <div style={{fontSize: '0.875rem', opacity: '0.8'}}>Open Source</div>
                    </div>
                    <div>
                      <div style={{fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem'}}>&lt;100ms</div>
                      <div style={{fontSize: '0.875rem', opacity: '0.8'}}>Response Time</div>
                    </div>
                    <div>
                      <div style={{fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem'}}>All</div>
                      <div style={{fontSize: '0.875rem', opacity: '0.8'}}>HTTP Methods</div>
                    </div>
                    <div>
                      <div style={{fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem'}}>∞</div>
                      <div style={{fontSize: '0.875rem', opacity: '0.8'}}>Request History</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'contact' && (
            <div className="panel">
              <div className="panel-header" style={{background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none'}}>
                <h2 className="panel-title" style={{color: 'white'}}>
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Me
                </h2>
              </div>
              <div className="panel-body">
                <div style={{lineHeight: '1.8'}}>
                  <div style={{marginBottom: '2rem'}}>
                    <h3 style={{color: darkMode ? '#f1f5f9' : '#1e293b', marginBottom: '1rem', fontWeight: '600'}}>Get in Touch</h3>
                    <p style={{color: darkMode ? '#cbd5e1' : '#64748b', marginBottom: '1.5rem'}}>
                      Feel free to connect with me! Whether you have questions about this project, want to collaborate, 
                      or just want to chat about development, I'd love to hear from you.
                    </p>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem'}}>
                    <div className="feature-card" style={{
                      background: darkMode ? 'linear-gradient(135deg, #334155, #475569)' : 'white', 
                      border: `1px solid ${darkMode ? '#64748b' : '#e2e8f0'}`, 
                      color: darkMode ? '#e2e8f0' : '#1e293b', 
                      cursor: 'pointer'
                    }} 
                         onClick={() => window.open('https://github.com/sumitghugare1', '_blank')}>
                      <div className="feature-icon" style={{background: 'linear-gradient(135deg, #24292e, #586069)', color: 'white'}}>
                        <svg className="icon" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <div className="feature-title" style={{color: darkMode ? '#f1f5f9' : '#1e293b'}}>GitHub</div>
                      <div className="feature-description" style={{color: darkMode ? '#cbd5e1' : '#64748b'}}>Check out my repositories</div>
                    </div>

                    <div className="feature-card" style={{
                      background: darkMode ? 'linear-gradient(135deg, #334155, #475569)' : 'white', 
                      border: `1px solid ${darkMode ? '#64748b' : '#e2e8f0'}`, 
                      color: darkMode ? '#e2e8f0' : '#1e293b', 
                      cursor: 'pointer'
                    }}
                         onClick={() => window.open('https://www.linkedin.com/in/sumit-ghugare-30200024a/', '_blank')}>
                      <div className="feature-icon" style={{background: 'linear-gradient(135deg, #0077b5, #005885)', color: 'white'}}>
                        <svg className="icon" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <div className="feature-title" style={{color: darkMode ? '#f1f5f9' : '#1e293b'}}>LinkedIn</div>
                      <div className="feature-description" style={{color: darkMode ? '#cbd5e1' : '#64748b'}}>Let's connect professionally</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
