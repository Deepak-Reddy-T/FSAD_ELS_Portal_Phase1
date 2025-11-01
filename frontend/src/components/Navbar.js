import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  if (!user) {
    return null;
  }

  const navigationItems = [
    { text: 'Dashboard', path: '/dashboard' },
    { text: 'Equipment', path: '/equipment' },
  ];

  if (user.role === 'STUDENT') {
    navigationItems.push({ text: 'My Requests', path: '/requests' });
  }

  if (user.role === 'STAFF') {
    navigationItems.push({ text: 'Manage Requests', path: '/admin/requests' });
  }

  if (user.role === 'ADMIN') {
    navigationItems.push(
      { text: 'Manage Equipment', path: '/admin/equipment', isAdmin: true },
      { text: 'Manage Requests', path: '/admin/requests', isAdmin: true }
    );
  }

  return (
    <>
      <div className="navbar navbar-expand-lg d-flex justify-content-between align-items-center py-3 px-3 px-md-5">
        {/* Logo */}
        <h2 className="m-0">
          <Link to="/dashboard" className="text-decoration-none" onClick={closeMobileMenu}>
            🏫 School Equipment
          </Link>
        </h2>
        
        {/* Desktop Navigation */}
        <ul className="d-none d-lg-flex m-0 gap-4 me-5 fw-medium">
          {navigationItems.map((item) => (
            <Link key={item.path} className="text-decoration-none" to={item.path}>
              <li className={`navtext ${
                item.isAdmin
                  ? (isActive(item.path) ? 'admin-active' : 'admin-hover')
                  : (isActive(item.path) ? 'active' : '')
              }`}>
                {item.text}
              </li>
            </Link>
          ))}
        </ul>
        
        {/* Desktop Auth Buttons */}
        <div className="d-none d-lg-flex gap-3">
          <span className="d-flex align-items-center me-2" style={{ color: 'white', fontWeight: 500 }}>
            Welcome, {user.firstName}
          </span>
          <button 
            className={user.role === 'ADMIN' ? 'admin-profile-btn' : 'logbtn'}
            style={{ cursor: 'default' }}
          >
            {user.role}
          </button>
          <button className="regbtn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="d-lg-none mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          {/* Mobile Menu Header with Close Button */}
          <div className="mobile-menu-header">
            <h3 className="mobile-menu-title">Menu</h3>
            <button 
              className="mobile-close-btn"
              onClick={closeMobileMenu}
              aria-label="Close mobile menu"
            >
              <span className="close-icon">×</span>
            </button>
          </div>
          
          {/* Mobile Navigation Links */}
          <ul className="mobile-nav-list">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link 
                  className={`mobile-nav-link ${
                    item.isAdmin
                      ? (isActive(item.path) ? 'admin-active' : '')
                      : (isActive(item.path) ? 'active' : '')
                  }`}
                  to={item.path}
                  onClick={closeMobileMenu}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Auth Buttons */}
          <div className="mobile-auth-buttons">
            <div className="text-center mb-2" style={{ color: 'white', fontWeight: 500 }}>
              Welcome, {user.firstName}
            </div>
            <button className={`mobile-btn ${user.role === 'ADMIN' ? 'mobile-admin-profile-btn' : 'mobile-login-btn'}`}>
              {user.role}
            </button>
            <button className="mobile-btn mobile-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
