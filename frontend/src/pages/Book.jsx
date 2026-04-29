import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import './Book.css';

const Book = () => {
  const [loading, setLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    date: '',
    time: '',
    guests: '2',
  });

  const availableTimes = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/bookings', bookingData);
      setBookingConfirmed(true);
    } catch (error) {
      console.error(error);
      alert('Failed to save booking. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-page-container">
      <div className="book-page-header">
        <div className="overlay"></div>
        <motion.div 
          className="header-content text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Reservations</h1>
          <div className="divider"></div>
          <p>Join us for an unforgettable experience.</p>
        </motion.div>
      </div>

      <div className="container" style={{ padding: '80px 20px' }}>
        <div className="reservation-wrapper">
          {bookingConfirmed ? (
            <motion.div 
              className="success-state text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h2>Reservation Confirmed</h2>
              <div className="divider"></div>
              <p>We look forward to welcoming you, {bookingData.name.split(' ')[0]}.</p>
              <div className="booking-summary">
                <p><strong>Date:</strong> {bookingData.date}</p>
                <p><strong>Time:</strong> {bookingData.time}</p>
                <p><strong>Guests:</strong> {bookingData.guests}</p>
              </div>
              <button className="btn-outline mt-4" onClick={() => window.location.href = '/'}>Return Home</button>
            </motion.div>
          ) : (
            <motion.form 
              className="reservation-form" 
              onSubmit={submitBooking}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    className="input-field luxury-input" 
                    placeholder="E.g., John Doe"
                    value={bookingData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Number of Guests</label>
                  <select 
                    name="guests" 
                    className="input-field luxury-input"
                    value={bookingData.guests}
                    onChange={handleChange}
                    required
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1} {i === 0 ? 'Guest' : 'Guests'}</option>
                    ))}
                    <option value="11+">11+ Guests</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    name="date"
                    required
                    className="input-field luxury-input" 
                    value={bookingData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <select 
                    name="time" 
                    className="input-field luxury-input"
                    value={bookingData.time}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select Time</option>
                    {availableTimes.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-submit text-center">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Confirming...' : 'Request Reservation'}
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Book;
