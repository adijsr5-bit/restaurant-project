import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Heart, LogOut } from 'lucide-react';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState({
    name: 'User',
    email: 'Loading...',
    role: 'user',
  });
  
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserData({ name: user.email.split('@')[0], email: user.email, role: user.role });
        }

        const bookingsRes = await api.get('/bookings/my-bookings');
        setBookings(bookingsRes.data);
        
        setFavorites([]); // Favorites not implemented yet in backend
        setLoading(false);
      } catch (error) {
        console.warn("Failed to fetch dashboard data", error);
        setBookings([]);
        setFavorites([]);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container container">
      <div className="dashboard-header text-center">
        <h2>Welcome back, <span style={{ color: 'var(--primary-color)' }}>{userData.name.split(' ')[0]}</span>!</h2>
        <p>Manage your reservations and favorites</p>
      </div>

      {loading ? (
        <div className="loading-state">Loading your dashboard...</div>
      ) : (
        <div className="dashboard-grid">
          {/* Sidebar / Profile Info */}
          <motion.div 
            className="profile-card glass-panel"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="profile-avatar">
              {userData.name.charAt(0)}
            </div>
            <h3>{userData.name}</h3>
            <p className="text-muted">{userData.email}</p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-num">{bookings.length}</span>
                <span className="stat-label">Total Visits</span>
              </div>
              <div className="stat">
                <span className="stat-num text-primary">120</span>
                <span className="stat-label">Loyalty Pts</span>
              </div>
            </div>
            {userData.role?.toLowerCase() === 'admin' && (
              <button 
                className="btn-primary full-width mt-4" 
                style={{display: 'flex', justifyContent: 'center', marginBottom: '10px'}} 
                onClick={() => window.location.href = '/admin'}
              >
                Go to Admin Dashboard
              </button>
            )}
            <button className="btn-outline full-width mt-4" style={{display: 'flex', justifyContent: 'center'}} onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </button>
          </motion.div>

          {/* Main Content Area */}
          <div className="dashboard-main">
            {/* Upcoming Bookings */}
            <motion.div 
              className="dashboard-section glass-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="section-title">Upcoming Reservations</h3>
              {upcomingBookings.length > 0 ? (
                <div className="bookings-list">
                  {upcomingBookings.map(booking => (
                    <div key={booking._id} className="booking-item upcoming">
                      <div className="booking-date-badge">
                        <span className="month">{new Date(booking.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="day">{new Date(booking.date).getDate()}</span>
                      </div>
                      <div className="booking-details">
                        <p className="booking-time"><Clock size={14}/> {booking.time}</p>
                        <p className="booking-meta">{booking.guests} Guests</p>
                      </div>
                      <div className="booking-actions">
                        <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">You have no upcoming reservations.</p>
              )}
            </motion.div>

            <div className="dashboard-row">
              {/* Past Bookings */}
              <motion.div 
                className="dashboard-section glass-panel half-width"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="section-title">Past Visits</h3>
                {pastBookings.length > 0 ? (
                  <div className="bookings-list small">
                    {pastBookings.map(booking => (
                      <div key={booking._id} className="booking-item past">
                        <div className="booking-details">
                          <p><strong>{new Date(booking.date).toLocaleDateString()}</strong></p>
                          <p className="text-muted text-sm">{booking.guests} Guests</p>
                        </div>
                        <span className="status-badge completed">Completed</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-state">No past visits yet.</p>
                )}
              </motion.div>

              {/* Favorites */}
              <motion.div 
                className="dashboard-section glass-panel half-width"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="section-title"><Heart size={18} className="text-primary"/> Favorite Dishes</h3>
                {favorites.length > 0 ? (
                  <div className="favorites-list">
                    {favorites.map(item => {
                      const imageUrl = item.image?.startsWith('/uploads') ? `${BASE_URL}${item.image}` : (item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80');
                      return (
                      <div key={item._id} className="favorite-item">
                        <img src={imageUrl} alt={item.name} onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'} />
                        <div className="fav-details">
                          <p className="fav-name">{item.name}</p>
                          <p className="fav-price">${item.price.toFixed(2)}</p>
                        </div>
                        <button className="btn-icon"><Heart size={16} fill="var(--primary-color)" color="var(--primary-color)"/></button>
                      </div>
                    )})}
                  </div>
                ) : (
                  <p className="empty-state">You haven't favorited any dishes yet.</p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
