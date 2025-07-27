import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';
import './CSS/trend.css';

const TrendingProducts = () => {
  // Initialize with proper structure
  const [trendingData, setTrendingData] = useState({
    temu: [],
    daraz: [],
    yourStore: [],
    lastUpdated: null,
    fromCache: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchTrendingProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('http://localhost:3001/api/auth/trending-products');
      
      if (response.data.success) {
        setTrendingData(response.data.data);
      } else {
        setError('Failed to fetch trending products');
      }
    } catch (err) {
      console.error('Error fetching trending products:', err);
      setError('Error connecting to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProducts = () => {
    let products = [];
    
    // Add null checks and ensure arrays exist
    const temuProducts = Array.isArray(trendingData?.temu) ? trendingData.temu : [];
    const darazProducts = Array.isArray(trendingData?.daraz) ? trendingData.daraz : [];
    const yourStoreProducts = Array.isArray(trendingData?.yourStore) ? trendingData.yourStore : [];
    
    if (selectedSource === 'all') {
      products = [...temuProducts, ...darazProducts, ...yourStoreProducts];
    } else if (selectedSource === 'temu') {
      products = temuProducts;
    } else if (selectedSource === 'daraz') {
      products = darazProducts;
    } else if (selectedSource === 'yourStore') {
      products = yourStoreProducts;
    }
    
    if (searchTerm) {
      products = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return products;
  };

  const handleRefresh = () => {
    fetchTrendingProducts();
  };

  const openExternalLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getLastUpdatedText = () => {
    if (!trendingData.lastUpdated) return 'Never';
    
    const lastUpdate = new Date(trendingData.lastUpdated);
    const now = new Date();
    const diffMinutes = Math.floor((now - lastUpdate) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="main">
      <Sidebar />
      <div className="main-content">
        <div className="trending-container">
          {/* Header */}
          <div className="page-header">
            <h1>🔥 Trending Products</h1>
            <div className="auth-links">
              <span className="logout-link">LOGOUT</span>
              <span className="separator">/</span>
              <span className="dashboard-text">Admin Dashboard</span>
            </div>
          </div>

          {/* Stats Cards - Add null checks */}
          <div className="stats-container">
            <div className="stat-card total">
              <h3>Total Trending</h3>
              <p className="stat-number">
                {(trendingData.temu?.length || 0) + (trendingData.daraz?.length || 0) + (trendingData.yourStore?.length || 0)}
              </p>
              <span className="stat-label">Products Found</span>
            </div>
            <div className="stat-card temu">
              <h3>Temu Products</h3>
              <p className="stat-number">{trendingData.temu?.length || 0}</p>
              <span className="stat-label">International Deals</span>
            </div>
            <div className="stat-card daraz">
              <h3>Daraz Products</h3>
              <p className="stat-number">{trendingData.daraz?.length || 0}</p>
              <span className="stat-label">Local Marketplace</span>
            </div>
            <div className="stat-card your-store">
              <h3>Your Store</h3>
              <p className="stat-number">{trendingData.yourStore?.length || 0}</p>
              <span className="stat-label">POS Products</span>
            </div>
            <div className="stat-card update">
              <h3>Last Updated</h3>
              <p className="stat-text">{getLastUpdatedText()}</p>
              <span className="stat-label">
                {trendingData.fromCache ? '📦 From Cache' : '🔄 Fresh Data'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="controls">
            <div className="filter-controls">
              <div className="source-filter">
                <label htmlFor="source">Source:</label>
                <select
                  id="source"
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                >
                  <option value="all">All Sources</option>
                  <option value="temu">Temu</option>
                  <option value="daraz">Daraz</option>
                  <option value="yourStore">Your Store</option>
                </select>
              </div>
              
              <div className="search-container">
                <label htmlFor="search">Search:</label>
                <input
                  id="search"
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            
            <button 
              className="refresh-btn" 
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
              <button onClick={handleRefresh} className="retry-btn">
                Try Again
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Fetching trending products from multiple sources...</p>
              <small>This may take up to 60 seconds for fresh data</small>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <>
              <div className="products-info">
                <h2>
                  {selectedSource === 'all' 
                    ? 'All Trending Products' 
                    : `${selectedSource.charAt(0).toUpperCase() + selectedSource.slice(1)} Trending Products`
                  }
                  {searchTerm && ` (Search: "${searchTerm}")`}
                </h2>
                <span className="products-count">
                  Showing {filteredProducts.length} products
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  <div className="no-products-icon">🔍</div>
                  <h3>No products found</h3>
                  <p>
                    {searchTerm 
                      ? `No products match "${searchTerm}". Try different keywords.`
                      : 'No trending products available at the moment.'
                    }
                  </p>
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="clear-search-btn"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map((product, index) => (
                    <div key={product.id} className={`product-card ${product.source.toLowerCase()}`}>
                      <div className="product-badge">
                        <span className={`source-badge ${product.source.toLowerCase()}`}>
                          {product.source}
                        </span>
                      </div>
                      
                      <div className="product-image">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          loading="lazy"
                          onError={(e) => {
                            if (!e.target.dataset.fallback1) {
                              e.target.dataset.fallback1 = 'true';
                              e.target.src = `https://picsum.photos/300/300?random=${index + 1}`;
                              return;
                            }
                            
                            if (!e.target.dataset.fallback2) {
                              e.target.dataset.fallback2 = 'true';
                              const colors = ['4F46E5', '059669', 'DC2626', 'D97706', '7C3AED'];
                              const randomColor = colors[index % colors.length];
                              e.target.src = `https://via.placeholder.com/300x300/${randomColor}/FFFFFF?text=${encodeURIComponent(product.source)}`;
                              return;
                            }
                            
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2YjczODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                          }}
                          onLoad={(e) => {
                            e.target.style.opacity = '1';
                          }}
                          style={{ 
                            transition: 'opacity 0.3s ease',
                            opacity: '0.8'
                          }}
                        />
                      </div>
                      
                      <div className="product-info">
                        <h3 className="product-title" title={product.title}>
                          {product.title}
                        </h3>
                        
                        <div className="product-details">
                          <span className="product-price">{product.price}</span>
                          <span className="product-rating">{product.rating}</span>
                        </div>
                        
                        <div className="product-meta">
                          <span className="product-category">📂 {product.category}</span>
                        </div>
                        
                        <div className="product-actions">
                          <button 
                            className="view-btn"
                            onClick={() => openExternalLink(product.sourceLink)}
                          >
                            🔗 View on {product.source}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Footer Info */}
          {!loading && !error && (
            <div className="footer-info">
              <div className="disclaimer">
                <h4>ℹ️ Trending Products Information</h4>
                <ul>
                  <li>🔄 Data refreshes automatically every 6 hours</li>
                  <li>🌐 Products are scraped from multiple sources for market research</li>
                  <li>💡 Use this data to understand market trends and pricing</li>
                  <li>🔗 Click "View on [Source]" to visit the original product page</li>
                  <li>⚡ First load may take 30-60 seconds for fresh data scraping</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingProducts;