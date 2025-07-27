import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import './CSS/powerBi.css';

const PowerBI = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Simulate loading time for the iframe
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const refreshReport = () => {
    setIsLoading(true);
    // Force iframe reload
    const iframe = document.querySelector('.powerbi-iframe');
    if (iframe) {
      iframe.src = iframe.src;
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="main">
      <Sidebar />
      <div className="main-content">
        <div className={`powerbi-container ${isFullscreen ? 'fullscreen' : ''}`}>
          
          {/* Header */}
          <div className="powerbi-header">
            <div className="header-left">
              <h1>📊 Power BI Analytics Dashboard</h1>
              <p className="subtitle">FYP Exhibition - Data Insights & Visualizations</p>
            </div>
            <div className="header-right">
              <button 
                className="control-btn refresh-btn" 
                onClick={refreshReport}
                disabled={isLoading}
              >
                {isLoading ? '🔄 Loading...' : '🔄 Refresh'}
              </button>
              <button 
                className="control-btn fullscreen-btn" 
                onClick={toggleFullscreen}
              >
                {isFullscreen ? '🗗 Exit Fullscreen' : '🗖 Fullscreen'}
              </button>
              <div className="auth-links">
                <span className="logout-link">LOGOUT</span>
                <span className="separator">/</span>
                <span className="dashboard-text">Admin Dashboard</span>
              </div>
            </div>
          </div>

          {/* PowerBI Content */}
          <div className="powerbi-content">
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <h3>Loading Power BI Dashboard...</h3>
                <p>Please wait while we fetch your analytics data</p>
                <div className="loading-progress">
                  <div className="progress-bar"></div>
                </div>
              </div>
            )}

            {/* PowerBI Iframe Container */}
            <div className="iframe-container">
              <div className="iframe-wrapper">
               <iframe title="FYPEXHIBITION" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=b3e18ed6-3c51-48fd-875a-ce8984d242d4&autoAuth=true&ctid=b853cd98-2488-4155-8389-5d5b880a5324" frameborder="0" allowFullScreen="true"></iframe>
              </div>
            </div>

            {/* Info Cards */}
            <div className="info-section">
              <div className="info-cards">
                <div className="info-card">
                  <div className="card-icon">📈</div>
                  <h3>Real-time Analytics</h3>
                  <p>Live data visualization from your POS system with automatic updates every 15 minutes.</p>
                </div>
                <div className="info-card">
                  <div className="card-icon">🎯</div>
                  <h3>Interactive Reports</h3>
                  <p>Click and drill down into specific data points for detailed insights and analysis.</p>
                </div>
                <div className="info-card">
                  <div className="card-icon">📊</div>
                  <h3>Custom Dashboards</h3>
                  <p>Tailored visualizations for sales, inventory, customer behavior, and performance metrics.</p>
                </div>
                <div className="info-card">
                  <div className="card-icon">🔒</div>
                  <h3>Secure Access</h3>
                  <p>Enterprise-grade security with role-based access control and data encryption.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="powerbi-footer">
            <div className="footer-info">
              <p>
                <strong>Power BI Integration:</strong> This dashboard connects directly to your POS database 
                and provides real-time insights into sales performance, inventory levels, and customer analytics.
              </p>
              <div className="footer-links">
                <a href="#" className="footer-link">📖 User Guide</a>
                <a href="#" className="footer-link">🛠️ Report Issues</a>
                <a href="#" className="footer-link">📞 Support</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PowerBI;