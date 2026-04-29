import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu as MenuIcon, X } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { settings } = useContext(ThemeContext);
  const { cartCount, toggleCart } = useContext(CartContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';
  const navClass = scrolled || !isHome ? 'navbar solid' : 'navbar transparent';
  const isLoggedIn = !!localStorage.getItem('token');

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={navClass}>
      <div className="container nav-content">
        <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.restaurantName} className="logo-img" />
          ) : (
            <span className="text-logo">{settings.restaurantName}</span>
          )}
        </Link>
        
        <div className="desktop-menu">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/book">Reservations</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            {isLoggedIn ? (
              <li><Link to="/dashboard" className="nav-admin-link">Profile</Link></li>
            ) : (
              <li><Link to="/login" className="nav-admin-link">Login</Link></li>
            )}
          </ul>
          
          <div className="nav-actions">
            <button className="cart-btn" onClick={toggleCart}>
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>

        <div className="mobile-menu-toggle">
          <button className="cart-btn-mobile" onClick={toggleCart}>
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="hamburger" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <div className={`mobile-slide-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-links">
          <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
          <li><Link to="/menu" onClick={() => setMobileMenuOpen(false)}>Menu</Link></li>
          <li><Link to="/book" onClick={() => setMobileMenuOpen(false)}>Reservations</Link></li>
          <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
          {isLoggedIn ? (
            <li><Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="nav-admin-link">Profile</Link></li>
          ) : (
            <li><Link to="/login" onClick={() => setMobileMenuOpen(false)} className="nav-admin-link">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
