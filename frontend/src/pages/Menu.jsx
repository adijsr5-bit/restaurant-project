import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import api, { BASE_URL } from '../services/api';
import { CartContext } from '../context/CartContext';
import './Menu.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const { addToCart } = useContext(CartContext);



  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get('/menu');
        if (res.data && res.data.length > 0) {
          setMenuItems(res.data);
        } else {
          setMenuItems([]);
        }
      } catch (error) {
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const categories = ['All', 'Starters', 'Main Course', 'Desserts'];

  const filteredMenu = menuItems.filter(item => {
    return categoryFilter === 'All' || item.category === categoryFilter;
  });

  return (
    <div className="menu-page-container">
      {/* Menu Header with background */}
      <div className="menu-page-header">
        <div className="overlay"></div>
        <motion.div 
          className="header-content text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Culinary Offerings</h1>
          <div className="divider"></div>
          <p>A symphony of flavors carefully crafted for the discerning palate.</p>
        </motion.div>
      </div>

      <div className="container" style={{ padding: '80px 20px' }}>
        {/* Category Tabs */}
        <div className="menu-categories">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`cat-btn ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div className="loading-state">Curating menu...</div>
        ) : (
          <motion.div 
            className="luxury-menu-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.2 }}
          >
            {filteredMenu.length > 0 ? (
              filteredMenu.map(item => {
                const imageUrl = item.image?.startsWith('/uploads') ? `${BASE_URL}${item.image}` : (item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80');
                return (
                <motion.div 
                  key={item._id} 
                  className="luxury-menu-card"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="card-img-wrapper">
                    <img src={imageUrl} alt={item.name} onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'} />
                  </div>
                  <div className="card-content">
                    <div className="card-header-row">
                      <h3>{item.name}</h3>
                      <span className="card-price">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="card-desc">{item.description}</p>
                    <button className="add-to-cart-btn" onClick={() => addToCart(item)}>
                      <ShoppingBag size={18} /> Add to Cart
                    </button>
                  </div>
                </motion.div>
              )})
            ) : (
              <div className="no-results">No dishes found.</div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Menu;
