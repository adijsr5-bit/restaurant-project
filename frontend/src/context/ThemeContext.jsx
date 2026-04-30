import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const defaultSettings = {
    restaurantName: 'The Fig & Olive',
    logoUrl: '',
    themeColor: '#7b8c5a', // Luxury Olive Green
    address: '13-15 Castle Street, Douglas, IM1 2EX',
    contactEmail: 'contact@thefigandolive.com',
    contactPhone: '01624 626003',
  };

  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data) {
          setSettings(res.data);
          // Dynamically update CSS variables
          document.documentElement.style.setProperty('--primary-color', res.data.themeColor);
          document.title = res.data.restaurantName;
        }
      } catch (error) {
        console.warn('Backend unavailable. Using default theme settings for demo.');
        setSettings(defaultSettings);
        document.documentElement.style.setProperty('--primary-color', defaultSettings.themeColor);
        document.title = defaultSettings.restaurantName;
      }
    };
    fetchSettings();
  }, []);

  return (
    <ThemeContext.Provider value={{ settings, setSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};
