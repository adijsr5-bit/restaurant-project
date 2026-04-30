import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, CreditCard, CheckCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { BASE_URL } from '../services/api';
import api from '../services/api';
import './CartPanel.css';

const CartPanel = () => {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, clearCart } = useContext(CartContext);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Cart, 2: Details
  const [orderDetails, setOrderDetails] = useState({ orderType: 'walk-in', tableNumber: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
    return image.startsWith('/uploads') ? `${BASE_URL}${image}` : image;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/orders', {
        items: cartItems,
        totalAmount: cartTotal,
        customerDetails: { name: orderDetails.name, tableNumber: orderDetails.tableNumber },
        orderType: orderDetails.orderType
      });
      setOrderSuccess(true);
      setTimeout(() => {
        clearCart();
        setIsCartOpen(false);
        setCheckoutStep(1);
        setOrderSuccess(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div 
            className="cart-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: "easeOut" }}
          >
            <div className="cart-header">
              <h3>Your Order</h3>
              <button className="close-cart" onClick={() => setIsCartOpen(false)}><X size={24} /></button>
            </div>

            <div className="cart-content">
              {orderSuccess ? (
                <div className="cart-success">
                  <div className="success-circle"><CheckCircle size={40} /></div>
                  <h4>Order Placed!</h4>
                  <p>Your order has been sent to the kitchen.</p>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="cart-empty">
                  <p>Your cart is empty.</p>
                  <button className="btn-outline" onClick={() => setIsCartOpen(false)}>Continue Browsing</button>
                </div>
              ) : checkoutStep === 1 ? (
                <div className="cart-items-wrapper">
                  {cartItems.map(item => (
                    <div key={item._id} className="cart-item">
                      <img src={getImageUrl(item.image)} alt={item.name} />
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                        <div className="cart-controls">
                          <button onClick={() => updateQuantity(item._id, -1)}><Minus size={14}/></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, 1)}><Plus size={14}/></button>
                        </div>
                      </div>
                      <button className="remove-item" onClick={() => removeFromCart(item._id)}><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
              ) : (
                <form className="checkout-form" onSubmit={handleCheckout}>
                  <h4>Order Details</h4>
                  <div className="form-group">
                    <label>Order Type</label>
                    <select className="input-field" value={orderDetails.orderType} onChange={(e) => setOrderDetails({...orderDetails, orderType: e.target.value})}>
                      <option value="walk-in">Walk-in / Takeaway</option>
                      <option value="dine-in">Dine-in (Table)</option>
                    </select>
                  </div>
                  {orderDetails.orderType === 'dine-in' && (
                    <div className="form-group">
                      <label>Table Number</label>
                      <input type="text" required className="input-field" value={orderDetails.tableNumber} onChange={(e) => setOrderDetails({...orderDetails, tableNumber: e.target.value})} />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" required className="input-field" value={orderDetails.name} onChange={(e) => setOrderDetails({...orderDetails, name: e.target.value})} />
                  </div>
                  <div className="payment-note">
                    <CreditCard size={18} />
                    <p>Payment will be collected at the counter.</p>
                  </div>
                  <div className="cart-actions-row">
                    <button type="button" className="btn-outline" onClick={() => setCheckoutStep(1)}>Back</button>
                    <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Processing...' : 'Confirm Order'}</button>
                  </div>
                </form>
              )}
            </div>

            {!orderSuccess && cartItems.length > 0 && checkoutStep === 1 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button className="btn-primary full-width" onClick={() => setCheckoutStep(2)}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartPanel;
