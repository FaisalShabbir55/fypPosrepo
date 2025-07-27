import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/sidebar.css';
import { logout, getUser } from '../../utils/auth';

export default function Sidebar() {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const user = getUser();
  
  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { path: '/signup', label: 'Staff Registration', icon: '👥' },
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'My Products', icon: '📦' },
    { path: '/order-List', label: 'Order List', icon: '📋' },
    { path: '/add-product', label: 'Add New Product', icon: '➕' },
    { path: '/suppliers', label: 'My Vendors', icon: '🏭' },
    { path: '/users', label: 'Staff Data', icon: '👨‍💼' },
    { path: '/category', label: 'Add New Category', icon: '📂' },
    { path: '/create-order', label: 'Create New Order', icon: '🛒' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  return (
    <>
      <div className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">POS System</h2>
          <p className="sidebar-subtitle">Point of Sale Management</p>
        </div>
        
        <ul className="sidebar-list">
          {menuItems.map((item, index) => (
            <li key={index} onClick={() => handleNavigation(item.path)}>
              <div className="sidebar-item">
                <span className="sidebar-item-icon">{item.icon}</span>
                {item.label}
              </div>
            </li>
          ))}
          
          <li className="logout-item" onClick={handleLogout}>
            <div className="sidebar-item">
              <span className="sidebar-item-icon">🚪</span>
              Logout
            </div>
          </li>
        </ul>

        {user && (
          <div className="sidebar-user">
            <div className="user-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-name">{user.name || 'User'}</div>
            <div className="user-role">{user.role || 'Staff'}</div>
          </div>
        )}
      </div>
      
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: window.innerWidth <= 1024 ? 'block' : 'none'
          }}
        />
      )}
    </>
  );
}