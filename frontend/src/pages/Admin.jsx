import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { Settings, Utensils, CalendarCheck, Edit, Trash2, CheckCircle, XCircle, UploadCloud, Image as ImageIcon, Mail } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import api, { BASE_URL } from '../services/api';
import './Admin.css';

const Admin = () => {
  const { settings, setSettings } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Settings Form State
  const [themeForm, setThemeForm] = useState(settings);
  
  const [bookings, setBookings] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [homeImages, setHomeImages] = useState([]);
  const [messages, setMessages] = useState([]);

  // Menu Form State
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [menuForm, setMenuForm] = useState({
    name: '',
    price: '',
    category: 'Main Course',
    description: '',
    dietary: 'non-veg'
  });
  const [editMenuId, setEditMenuId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  // Home Images Form State
  const [showHomeImageForm, setShowHomeImageForm] = useState(false);
  const [homeImageForm, setHomeImageForm] = useState({ title: '', subtitle: '', section: 'hero' });
  const [selectedHomeImage, setSelectedHomeImage] = useState(null);
  const [homeImagePreview, setHomeImagePreview] = useState(null);
  const homeImageFileInputRef = useRef(null);

  const [orders, setOrders] = useState([]);

  // Fetch Menu, Bookings, Orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, orderRes, bookingRes, homeImageRes, msgRes] = await Promise.all([
          api.get('/menu'),
          api.get('/orders'),
          api.get('/bookings'),
          api.get('/home-images'),
          api.get('/contact')
        ]);
        if (menuRes.data) setMenuItems(menuRes.data);
        if (orderRes.data) setOrders(orderRes.data);
        if (bookingRes.data) setBookings(bookingRes.data);
        if (homeImageRes.data) setHomeImages(homeImageRes.data);
        if (msgRes.data) setMessages(msgRes.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        console.warn("Backend not running or endpoint not found");
      }
    };
    fetchData();
  }, []);

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}`, { status: newStatus });
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      // Demo fallback
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    }
  };

  // Handle Theme Settings Update
  const handleThemeUpdate = (e) => {
    e.preventDefault();
    setSettings(themeForm);
    document.documentElement.style.setProperty('--primary-color', themeForm.themeColor);
    document.title = themeForm.restaurantName;
    alert('Branding updated successfully!');
  };

  // Handle Booking Status
  const updateBookingStatus = async (id, newStatus) => {
    try {
      await api.put(`/bookings/${id}`, { status: newStatus });
      setBookings(bookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
    } catch (error) {
      console.error(error);
      alert("Failed to update booking status");
    }
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Menu Item Submit
  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append('name', menuForm.name);
    formData.append('price', menuForm.price);
    formData.append('category', menuForm.category);
    formData.append('description', menuForm.description);
    formData.append('dietary', menuForm.dietary);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      let res;
      if (editMenuId) {
        res = await api.put(`/menu/${editMenuId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMenuItems(menuItems.map(item => item._id === editMenuId ? res.data : item));
        alert('Menu item updated successfully!');
      } else {
        res = await api.post('/menu', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMenuItems([res.data, ...menuItems]);
        alert('Menu item added successfully!');
      }
      
      setShowMenuForm(false);
      setMenuForm({ name: '', price: '', category: 'Main Course', description: '', dietary: 'non-veg' });
      setSelectedImage(null);
      setImagePreview(null);
      setEditMenuId(null);
    } catch (error) {
      alert("Failed to save menu item. Ensure you are logged in.");
    } finally {
      setUploading(false);
    }
  };

  const handleEditMenuItem = (item) => {
    setMenuForm({
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
      dietary: item.dietary || 'non-veg'
    });
    setEditMenuId(item._id);
    setImagePreview(item.image ? (item.image.startsWith('/uploads') ? `${BASE_URL}${item.image}` : item.image) : null);
    setShowMenuForm(true);
  };

  const handleDeleteMenuItem = async (id) => {
    if (window.confirm("Delete this menu item?")) {
      try {
        await api.delete(`/menu/${id}`);
        setMenuItems(menuItems.filter(item => item._id !== id));
      } catch (err) {
        alert("Failed to delete item");
      }
    }
  };

  const handleHomeImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedHomeImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setHomeImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleHomeImageSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHomeImage) return alert("Select an image first");
    setUploading(true);
    const formData = new FormData();
    formData.append('title', homeImageForm.title);
    formData.append('subtitle', homeImageForm.subtitle);
    formData.append('section', homeImageForm.section);
    formData.append('image', selectedHomeImage);

    try {
      const res = await api.post('/home-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setHomeImages([res.data, ...homeImages]);
      setShowHomeImageForm(false);
      setHomeImageForm({ title: '', subtitle: '', section: 'hero' });
      setSelectedHomeImage(null);
      setHomeImagePreview(null);
      alert('Home image added successfully');
    } catch (err) {
      alert("Failed to upload home image");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteHomeImage = async (id) => {
    if (window.confirm("Delete this home image?")) {
      try {
        await api.delete(`/home-images/${id}`);
        setHomeImages(homeImages.filter(img => img._id !== id));
      } catch (err) {
        alert("Failed to delete home image");
      }
    }
  };

  // Rest of Admin.jsx remains similar...
  return (
    <div className="admin-wrapper">
      <div className="admin-sidebar">
        <div className="admin-brand">
          <Settings size={24} color="var(--primary-color)" />
          <h3>Admin Panel</h3>
        </div>
        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <CalendarCheck size={18} /> Bookings
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Utensils size={18} /> Orders
            {orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="badge">{orders.filter(o => o.status === 'pending').length}</span>
            )}
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <Utensils size={18} /> Menu Management
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'home-images' ? 'active' : ''}`}
            onClick={() => setActiveTab('home-images')}
          >
            <ImageIcon size={18} /> Home Slider Images
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} /> Store Settings
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <Mail size={18} /> Messages
            {messages.filter(m => !m.read).length > 0 && (
              <span className="badge">{messages.filter(m => !m.read).length}</span>
            )}
          </button>
        </nav>
      </div>

      <div className="admin-main">
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (() => {
          const now = new Date();
          let daily = 0, monthly = 0, yearly = 0, accepted = 0, cancelled = 0;
          orders.forEach(o => {
            if (['preparing', 'ready', 'served', 'completed'].includes(o.status)) {
              accepted++;
              const amt = o.totalAmount || 0;
              const oDate = new Date(o.createdAt || new Date());
              if (oDate.getFullYear() === now.getFullYear()) {
                yearly += amt;
                if (oDate.getMonth() === now.getMonth()) {
                  monthly += amt;
                  if (oDate.getDate() === now.getDate()) { daily += amt; }
                }
              }
            } else if (o.status === 'cancelled') {
              cancelled++;
            }
          });

          return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-panel-card">
            <div className="admin-panel-header">
              <h2>Order & Earning Statistics</h2>
            </div>
            <div className="profile-stats mb-4" style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
              <div className="stat glass-panel" style={{flex: 1, minWidth: '150px'}}>
                <span className="stat-num text-primary">${daily.toFixed(2)}</span>
                <span className="stat-label">Daily Earning</span>
              </div>
              <div className="stat glass-panel" style={{flex: 1, minWidth: '150px'}}>
                <span className="stat-num text-primary">${monthly.toFixed(2)}</span>
                <span className="stat-label">Monthly Earning</span>
              </div>
              <div className="stat glass-panel" style={{flex: 1, minWidth: '150px'}}>
                <span className="stat-num text-primary">${yearly.toFixed(2)}</span>
                <span className="stat-label">Yearly Earning</span>
              </div>
              <div className="stat glass-panel" style={{flex: 1, minWidth: '120px'}}>
                <span className="stat-num text-success">{accepted}</span>
                <span className="stat-label">Accepted</span>
              </div>
              <div className="stat glass-panel" style={{flex: 1, minWidth: '120px'}}>
                <span className="stat-num text-red">{cancelled}</span>
                <span className="stat-label">Cancelled</span>
              </div>
            </div>

            <div className="admin-panel-header mt-4">
              <h2>Recent Orders</h2>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-clean-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td data-label="Order ID" className="text-muted">#{order._id.substring(order._id.length - 6)}</td>
                      <td data-label="Customer" className="font-medium">Guest</td>
                      <td data-label="Type">
                        <span style={{textTransform: 'capitalize'}}>{order.orderType || 'Walk-in'}</span>
                        {order.orderType === 'dine-in' && order.tableNumber && (
                          <div className="text-muted text-sm">Table {order.tableNumber}</div>
                        )}
                      </td>
                      <td data-label="Total" className="text-primary font-bold">${order.totalAmount?.toFixed(2)}</td>
                      <td data-label="Status">
                        <span className={`admin-badge ${order.status}`}>{order.status}</span>
                      </td>
                      <td data-label="Actions">
                        {order.status === 'pending' && (
                          <div className="action-row">
                            <button onClick={() => updateOrderStatus(order._id, 'preparing')} className="btn-action accept"><CheckCircle size={16}/> Prepare</button>
                            <button onClick={() => updateOrderStatus(order._id, 'cancelled')} className="btn-action reject"><XCircle size={16}/> Cancel</button>
                          </div>
                        )}
                        {order.status === 'preparing' && (
                          <div className="action-row">
                            <button onClick={() => updateOrderStatus(order._id, 'ready')} className="btn-action accept" style={{backgroundColor: '#eab308', borderColor: '#eab308'}}><CheckCircle size={16}/> Mark Ready</button>
                          </div>
                        )}
                        {order.status === 'ready' && (
                          <div className="action-row">
                            <button onClick={() => updateOrderStatus(order._id, 'completed')} className="btn-action accept"><CheckCircle size={16}/> Complete</button>
                          </div>
                        )}
                        {(order.status === 'completed' || order.status === 'cancelled' || order.status === 'served') && (
                          <span className="text-muted text-sm capitalize">{order.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan="6" className="text-center py-4">No recent orders.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )})()}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-panel-card">
            <div className="admin-panel-header">
              <h2>Recent Reservations</h2>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-clean-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Date / Time</th>
                    <th>Guests</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td data-label="Customer" className="font-medium">{booking.name}</td>
                      <td data-label="Date / Time">{booking.date} at {booking.time}</td>
                      <td data-label="Guests">{booking.guests}</td>
                      <td data-label="Status">
                        <span className={`admin-badge ${booking.status}`}>{booking.status}</span>
                      </td>
                      <td data-label="Actions">
                        {booking.status === 'pending' ? (
                          <div className="action-row">
                            <button onClick={() => updateBookingStatus(booking._id, 'confirmed')} className="btn-action accept"><CheckCircle size={16}/> Accept</button>
                            <button onClick={() => updateBookingStatus(booking._id, 'cancelled')} className="btn-action reject"><XCircle size={16}/> Reject</button>
                          </div>
                        ) : (
                          <span className="text-muted">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* MENU TAB */}
        {activeTab === 'menu' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-panel-card">
            <div className="admin-panel-header flex-between">
              <h2>Menu Items</h2>
              <button className="btn-admin-primary" onClick={() => {
                if(showMenuForm) {
                  setShowMenuForm(false);
                  setEditMenuId(null);
                  setMenuForm({ name: '', price: '', category: 'Main Course', description: '', dietary: 'non-veg' });
                  setImagePreview(null);
                } else {
                  setShowMenuForm(true);
                }
              }}>
                {showMenuForm ? 'Cancel' : '+ Add New Dish'}
              </button>
            </div>

            {showMenuForm && (
              <div className="admin-form-card">
                <h3>{editMenuId ? 'Edit Dish' : 'Add New Dish'}</h3>
                <form onSubmit={handleMenuSubmit} className="admin-grid-form">
                  <div className="form-col">
                    <div className="admin-form-group">
                      <label>Dish Name</label>
                      <input type="text" className="admin-input" required value={menuForm.name} onChange={(e) => setMenuForm({...menuForm, name: e.target.value})} />
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Price ($)</label>
                        <input type="number" step="0.01" className="admin-input" required value={menuForm.price} onChange={(e) => setMenuForm({...menuForm, price: e.target.value})} />
                      </div>
                      <div className="admin-form-group">
                        <label>Category</label>
                        <select className="admin-input" value={menuForm.category} onChange={(e) => setMenuForm({...menuForm, category: e.target.value})}>
                          <option>Starters</option>
                          <option>Main Course</option>
                          <option>Desserts</option>
                          <option>Drinks</option>
                        </select>
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label>Description</label>
                      <textarea className="admin-input" rows="3" required value={menuForm.description} onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}></textarea>
                    </div>
                  </div>

                  <div className="form-col upload-col">
                    <label>Dish Image</label>
                    <div 
                      className="image-upload-box" 
                      onClick={() => fileInputRef.current.click()}
                      style={{ backgroundImage: imagePreview ? `url(${imagePreview})` : 'none' }}
                    >
                      {!imagePreview && (
                        <div className="upload-placeholder">
                          <UploadCloud size={40} color="#cbd5e1" />
                          <p>Click to upload image</p>
                          <span>JPG, PNG up to 5MB</span>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      style={{ display: 'none' }} 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <button type="button" className="btn-outline-small" onClick={(e) => { e.stopPropagation(); setSelectedImage(null); setImagePreview(null); }}>
                        Remove Image
                      </button>
                    )}
                  </div>
                  
                  <div className="form-footer">
                    <button type="submit" className="btn-admin-primary" disabled={uploading}>
                      {uploading ? 'Saving...' : 'Save Menu Item'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="admin-table-wrapper mt-4">
              <table className="admin-clean-table">
                <thead>
                  <tr>
                    <th>Dish</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map(item => (
                    <tr key={item._id}>
                      <td data-label="Dish">
                        <div className="menu-item-row">
                          {item.image ? (
                            <img 
                              src={item.image.startsWith('/uploads') ? `${BASE_URL}${item.image}` : item.image} 
                              alt={item.name} 
                              className="admin-menu-thumb" 
                              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'}
                            />
                          ) : (
                            <div className="admin-menu-thumb placeholder"><ImageIcon size={16}/></div>
                          )}
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </td>
                      <td data-label="Category">{item.category}</td>
                      <td data-label="Price" className="text-primary font-bold">${item.price.toFixed(2)}</td>
                      <td data-label="Actions">
                        <div className="action-row">
                          <button className="btn-icon-soft text-blue" onClick={() => handleEditMenuItem(item)}><Edit size={16}/></button>
                          <button className="btn-icon-soft text-red" onClick={() => handleDeleteMenuItem(item._id)}><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-panel-card">
            <div className="admin-panel-header">
              <h2>Store Branding & Configuration</h2>
              <p className="text-muted">Configure the public-facing storefront.</p>
            </div>
            
            <form onSubmit={handleThemeUpdate} className="admin-settings-form">
              <div className="admin-form-group">
                <label>Restaurant Name</label>
                <input type="text" className="admin-input" value={themeForm.restaurantName} onChange={(e) => setThemeForm({...themeForm, restaurantName: e.target.value})} />
              </div>
              
              <div className="admin-form-group">
                <label>Primary Brand Color</label>
                <div className="color-picker-row">
                  <input type="color" className="color-input" value={themeForm.themeColor} onChange={(e) => setThemeForm({...themeForm, themeColor: e.target.value})} />
                  <input type="text" className="admin-input" value={themeForm.themeColor} onChange={(e) => setThemeForm({...themeForm, themeColor: e.target.value})} />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Logo URL</label>
                <input type="text" className="admin-input" placeholder="https://..." value={themeForm.logoUrl} onChange={(e) => setThemeForm({...themeForm, logoUrl: e.target.value})} />
              </div>

              <button type="submit" className="btn-admin-primary mt-4">Apply Brand Settings</button>
            </form>
          </motion.div>
        )}
        {/* HOME IMAGES TAB */}
        {activeTab === 'home-images' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-panel-card">
            <div className="admin-panel-header flex-between">
              <h2>Home Slider Images</h2>
              <button className="btn-admin-primary" onClick={() => setShowHomeImageForm(!showHomeImageForm)}>
                {showHomeImageForm ? 'Cancel' : '+ Add Image'}
              </button>
            </div>

            {showHomeImageForm && (
              <div className="admin-form-card">
                <h3>Upload New Hero Image</h3>
                <form onSubmit={handleHomeImageSubmit} className="admin-grid-form">
                  <div className="form-col">
                    <div className="admin-form-group">
                      <label>Title (Optional)</label>
                      <input type="text" className="admin-input" value={homeImageForm.title} onChange={(e) => setHomeImageForm({...homeImageForm, title: e.target.value})} />
                    </div>
                    <div className="admin-form-group">
                      <label>Subtitle (Optional)</label>
                      <input type="text" className="admin-input" value={homeImageForm.subtitle} onChange={(e) => setHomeImageForm({...homeImageForm, subtitle: e.target.value})} />
                    </div>
                    <div className="admin-form-group">
                      <label>Target Section</label>
                      <select className="admin-input" value={homeImageForm.section} onChange={(e) => setHomeImageForm({...homeImageForm, section: e.target.value})}>
                        <option value="hero">Main Hero Background</option>
                        <option value="about">Our Story Section</option>
                        <option value="signature1">Signature Dish 1</option>
                        <option value="signature2">Signature Dish 2</option>
                        <option value="signature3">Signature Dish 3</option>
                        <option value="gallery">Gallery Photo</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-col upload-col">
                    <label>Image (Required)</label>
                    <div 
                      className="image-upload-box" 
                      onClick={() => homeImageFileInputRef.current.click()}
                      style={{ backgroundImage: homeImagePreview ? `url(${homeImagePreview})` : 'none' }}
                    >
                      {!homeImagePreview && (
                        <div className="upload-placeholder">
                          <UploadCloud size={40} color="#cbd5e1" />
                          <p>Click to upload image</p>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={homeImageFileInputRef} 
                      style={{ display: 'none' }} 
                      accept="image/*"
                      onChange={handleHomeImageChange}
                    />
                  </div>
                  
                  <div className="form-footer">
                    <button type="submit" className="btn-admin-primary" disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Save Image'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="admin-table-wrapper mt-4">
              <table className="admin-clean-table">
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Section</th>
                    <th>Title</th>
                    <th>Uploaded On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {homeImages.map(img => (
                    <tr key={img._id}>
                      <td data-label="Preview">
                        <img 
                          src={img.imageUrl.startsWith('/uploads') ? `${BASE_URL}${img.imageUrl}` : img.imageUrl} 
                          alt="Hero" 
                          className="admin-menu-thumb" 
                        />
                      </td>
                      <td data-label="Section">
                        <span className="admin-badge confirmed" style={{textTransform: 'capitalize'}}>{img.section || 'Gallery'}</span>
                      </td>
                      <td data-label="Title">{img.title || <span className="text-muted">No Title</span>}</td>
                      <td data-label="Uploaded On">{new Date(img.createdAt).toLocaleDateString()}</td>
                      <td data-label="Actions">
                        <button className="btn-icon-soft text-red" onClick={() => handleDeleteHomeImage(img._id)}>
                          <Trash2 size={16}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {homeImages.length === 0 && <tr><td colSpan="5" className="text-center py-4">No home images uploaded yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-panel-card">
            <div className="admin-panel-header">
              <h2>Contact Messages</h2>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-clean-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map(msg => (
                    <tr key={msg._id} style={{ fontWeight: msg.read ? 'normal' : 'bold' }}>
                      <td data-label="Date">{new Date(msg.createdAt).toLocaleDateString()}</td>
                      <td data-label="Name">{msg.name}</td>
                      <td data-label="Email"><a href={`mailto:${msg.email}`} className="text-primary">{msg.email}</a></td>
                      <td data-label="Message" className="message-cell" style={{ maxWidth: '300px' }}>
                        <div style={{ 
                          maxHeight: '100px', 
                          overflowY: 'auto', 
                          whiteSpace: 'pre-wrap', 
                          wordBreak: 'break-word',
                          paddingRight: '5px'
                        }}>
                          {msg.message}
                        </div>
                      </td>
                      <td data-label="Status">
                        {!msg.read ? (
                          <button 
                            className="btn-action accept" 
                            onClick={async () => {
                              try {
                                await api.put(`/contact/${msg._id}`, { read: true });
                                setMessages(messages.map(m => m._id === msg._id ? { ...m, read: true } : m));
                              } catch (e) {
                                alert("Failed to mark as read");
                              }
                            }}
                          >
                            <CheckCircle size={16}/> Mark Read
                          </button>
                        ) : (
                          <span className="text-muted">Read</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {messages.length === 0 && (
                    <tr><td colSpan="5" className="text-center py-4">No messages received yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admin;
