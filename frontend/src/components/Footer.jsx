import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './Footer.css';

const Footer = () => {
  const { settings } = useContext(ThemeContext);

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.restaurantName} className="footer-logo" />
            ) : (
              <h2 className="footer-title">{settings.restaurantName}</h2>
            )}
          </div>
          
          <div className="footer-info">
            <p className="address">{settings.address}</p>
            <p className="phone">Call us: {settings.contactPhone}</p>
          </div>
          
          <div className="footer-copyright">
            <p>© 2025 {settings.restaurantName}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
