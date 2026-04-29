import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import api, { BASE_URL } from '../services/api';
import './Home.css';

const Home = () => {
  const { settings } = useContext(ThemeContext);
  const [heroImages, setHeroImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await api.get('/home-images');
        setHeroImages(res.data);
      } catch (error) {
        console.error("Failed to load home images");
      }
    };
    fetchImages();
  }, []);

  const galleryImagesFallback = [
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop',
  ];

  const getImageUrlBySection = (sectionName, fallback) => {
    const imgObj = heroImages.find(img => img.section === sectionName);
    if (imgObj) {
      return imgObj.imageUrl.startsWith('/uploads') ? `${BASE_URL}${imgObj.imageUrl}` : imgObj.imageUrl;
    }
    return fallback;
  };

  const getHeroUrl = () => getImageUrlBySection('hero', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop');
  const getStoryUrl = () => getImageUrlBySection('about', 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=2070&auto=format&fit=crop');
  const getSig1Url = () => getImageUrlBySection('signature1', 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop');
  const getSig2Url = () => getImageUrlBySection('signature2', 'https://images.unsplash.com/photo-1599084942208-9a3b615c00a6?q=80&w=2067&auto=format&fit=crop');
  const getSig3Url = () => getImageUrlBySection('signature3', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb438?q=80&w=1974&auto=format&fit=crop');
  
  const galleryImagesData = heroImages.filter(img => img.section === 'gallery' || !img.section);
  const galleryImages = galleryImagesData.length > 0 
    ? galleryImagesData.map(img => img.imageUrl.startsWith('/uploads') ? `${BASE_URL}${img.imageUrl}` : img.imageUrl) 
    : galleryImagesFallback;

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section" style={{ backgroundImage: `url(${getHeroUrl()})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {settings.restaurantName}
          </motion.h1>
          <motion.p 
            className="tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            Experience Fine Dining
          </motion.p>
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link to="/book" className="btn-primary">Reserve a Table</Link>
            <Link to="/menu" className="btn-outline white-outline">Explore Menu</Link>
          </motion.div>
        </div>
      </div>

      {/* Intro / Story Section */}
      <section className="intro-section container">
        <div className="story-grid">
          <motion.div 
            className="story-text"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <p className="subtitle">New Beginnings</p>
            <h2>Our Story</h2>
            <div className="divider-left"></div>
            <p>
              Born from the vision of a dreamer from Greece, The Fig & Olive brings the Mediterranean spirit to the Isle of Man. We believe in the magic of dining—where every meal is an opportunity to connect, celebrate, and savor the beautiful moments of life.
            </p>
            <p>
              Our culinary journey is defined by a passion for authenticity, utilizing the freshest ingredients to craft dishes that echo the rich, diverse flavors of the Mediterranean coast.
            </p>
            <Link to="/about" className="btn-outline mt-4">About Us</Link>
          </motion.div>
          <motion.div 
            className="story-image"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <img src={getStoryUrl()} alt="Chef preparing food" />
          </motion.div>
        </div>
      </section>

      {/* Menu Highlight Section */}
      <section className="signature-section">
        <div className="container">
          <div className="section-header text-center">
            <p className="subtitle text-center">Food Varieties</p>
            <h2>Our Menu</h2>
            <div className="divider mx-auto"></div>
            <p className="text-muted" style={{maxWidth: '600px', margin: '0 auto 40px'}}>
              On our menu you will find old favourites sitting alongside contemporary creations, all designed to transport you to the sun-drenched shores of the Mediterranean.
            </p>
          </div>
          <div className="signature-grid">
            <div className="sig-item">
              <img src={getSig1Url()} alt="Signature Dish 1" />
              <h3>Herb Crusted Lamb</h3>
              <p>Served with seasonal root vegetables and a rosemary reduction.</p>
            </div>
            <div className="sig-item">
              <img src={getSig2Url()} alt="Signature Dish 2" />
              <h3>Seared Scallops</h3>
              <p>Pan-seared to perfection over a bed of cauliflower purée.</p>
            </div>
            <div className="sig-item">
              <img src={getSig3Url()} alt="Signature Dish 3" />
              <h3>Truffle Linguine</h3>
              <p>Handmade pasta tossed in a rich black truffle cream sauce.</p>
            </div>
          </div>
          <div className="text-center mt-5">
            <Link to="/menu" className="btn-primary">View Menu</Link>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="gallery-grid">
          {galleryImages.map((src, index) => (
            <motion.div 
              key={index} 
              className="gallery-item"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <img src={src} alt="Restaurant ambiance and food" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Booking Section */}
      <section className="home-booking-section">
        <div className="container">
          <div className="home-booking-card">
            <div className="section-header text-center">
              <h2>Reserve a Table</h2>
              <div className="divider mx-auto"></div>
              <p className="text-muted">Please be aware that this booking is for The Fig & Olive Isle of Man.</p>
            </div>
            <form className="home-booking-form" onSubmit={async (e) => { 
              e.preventDefault(); 
              const formData = new FormData(e.target);
              try {
                await api.post('/bookings', {
                  name: formData.get('name'),
                  email: formData.get('email'),
                  phone: formData.get('phone'),
                  date: formData.get('date'),
                  time: '19:00', // Default or could add time field
                  guests: 2,     // Default or could add guest field
                  specialRequests: formData.get('requests')
                });
                alert("Booking request sent! We will confirm shortly.");
                e.target.reset();
              } catch (err) {
                alert("Failed to submit booking. Please ensure backend is running.");
              }
            }}>
              <div className="form-row">
                <input type="text" name="name" className="input-field" placeholder="Full Name" required />
                <input type="email" name="email" className="input-field" placeholder="Email Address" required />
              </div>
              <div className="form-row">
                <input type="tel" name="phone" className="input-field" placeholder="Phone Number" required />
                <input type="date" name="date" className="input-field" required min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-row">
                <textarea name="requests" className="input-field" placeholder="Special Requests (e.g., Anniversary, Allergies)" rows="3" style={{width: '100%'}}></textarea>
              </div>
              <div className="text-center mt-4">
                <button type="submit" className="btn-primary">Book Now</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
