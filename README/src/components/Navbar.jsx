import { Phone, Menu, X } from 'lucide-react';
import { User } from 'lucide-react';
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import hyundaiLogo from '../assets/hyundai-logo.png';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    // Check if user or admin is logged in whenever location changes
    const isUser = localStorage.getItem('userAuth') === 'true';
    const isAdmin = localStorage.getItem('adminAuth') === 'true';
    setIsAuthenticated(isUser || isAdmin);
  }, [location.pathname]);

  return (
    <>
      {/* Top Utility Bar */}
      <div className="top-utility-bar">
        <div className="top-bar-content">
          <div className="top-bar-left">
            <span className="top-bar-text">Welcome to Premium Hyundai Service</span>
            <span className="top-divider">|</span>
            <span className="top-bar-text">Certified Mechanics</span>
          </div>
          <div className="top-bar-right">
            <a href="tel:9699938509" className="top-bar-link">
              <Phone size={14} /> 9699938509
            </a>
            <span className="top-divider">|</span>
            <span className="top-bar-link">Mon - Sat, 9:00 AM - 7:00 PM</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="floating-navbar">
        <div className="nav-content">
          <span className="mobile-brand-text">HYUNDAI</span>
          <Link 
            to="/" 
            className="brand"
            onClick={(e) => {
              if (window.innerWidth <= 900) {
                e.preventDefault();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }
            }}
          >
            <img src={hyundaiLogo} alt="Hyundai Logo" className="brand-icon" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
          </Link>

          <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
            <div
              className={`nav-link dropdown-container ${['/parivahan', '/rto-info', '/owner-details', '/puc'].includes(location.pathname) ? 'active' : ''}`}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >


            </div>
            {isAuthenticated && (
              <Link to="/my-garage" className={`nav-link ${location.pathname === '/my-garage' ? 'active' : ''}`}>
                My Garage
              </Link>
            )}
            <Link to="/car-services" className={`nav-link ${location.pathname === '/car-services' ? 'active' : ''}`}>
              Car Services
            </Link>
            <Link to="/social-media" className={`nav-link ${location.pathname === '/social-media' ? 'active' : ''}`}>
              Social Media
            </Link>
          
            <div className="nav-actions-mobile" style={{ display: window.innerWidth <= 900 ? 'flex' : 'none', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <a href="tel:9699938509" className="contact-chip-link" style={{ width: '100%' }}>
                <div className="contact-chip" style={{ justifyContent: 'center' }}>
                  <Phone size={18} />
                  <span>9699938509</span>
                </div>
              </a>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    localStorage.removeItem('adminAuth');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userAuth');
                    localStorage.removeItem('userEmail');
                    window.location.href = '/';
                  }}
                  className="login-btn"
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', width: '100%', justifyContent: 'center' }}
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="login-btn" style={{ width: '100%', justifyContent: 'center' }}>
                  <User size={18} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>

          <div className="nav-actions">
            <a href="tel:9699938509" className="contact-chip-link">
              <div className="contact-chip">
                <Phone size={18} />
                <span>9699938509</span>
              </div>
            </a>
            {isAuthenticated ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    localStorage.removeItem('adminAuth');
                    localStorage.removeItem('userRole');
                    localStorage.removeItem('userAuth');
                    localStorage.removeItem('userEmail');
                    window.location.href = '/';
                  }}
                  className="login-btn"
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                <User size={18} />
                <span>Login</span>
              </Link>
            )}
                    </div>
          
          
        </div>
      </nav>
    </>
  );
};

export default Navbar;
