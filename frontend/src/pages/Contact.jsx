import React from 'react';
import { motion } from 'framer-motion';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page-container">
      <div className="contact-page-header">
        <div className="overlay"></div>
        <motion.div 
          className="header-content text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Contact Us</h1>
          <div className="divider"></div>
          <p>We would love to hear from you.</p>
        </motion.div>
      </div>

      <div className="container contact-content-wrapper">
        <div className="contact-grid">
          {/* Left: Info */}
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2>Get in Touch</h2>
            <div className="divider-left"></div>
            <p className="contact-desc">
              Whether you have a question about our menu, reservations, or special events, our team is ready to answer all your questions.
            </p>
            
            <div className="info-block">
              <h3>Address</h3>
              <p>13-15 Castle Street<br/>Douglas, IM1 2EX</p>
            </div>
            
            <div className="info-block">
              <h3>Contact Info</h3>
              <p>Phone: xxxxxx<br/>Email: info@figandolive.im</p>
            </div>
            
            <div className="info-block">
              <h3>Opening Hours</h3>
              <p>Mon - Sun: 12:00 PM - 10:00 PM</p>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div 
            className="contact-form-wrapper"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }}>
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" className="input-field luxury-input" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="input-field luxury-input" required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea className="input-field luxury-input" rows="4" required></textarea>
              </div>
              <button type="submit" className="btn-primary mt-4">Send Message</button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
