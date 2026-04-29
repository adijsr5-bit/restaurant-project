import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { Settings, Utensils, CalendarCheck, Edit, Trash2, CheckCircle, XCircle, UploadCloud, Image as ImageIcon } from 'lucide-react';
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

  // Menu Form State
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [menuForm, setMenuForm] = useState({
    name: '',
    price: '',
    category: 'Main Course',
    description: '',
    dietary: 'non-veg'
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  // Home Images Form State
  const [showHomeImageForm, setShowHomeImageForm] = useState(false);
  const [homeImageForm, setHomeImageForm] = useState({ title: '', subtitle: '' });
  const [selectedHomeImage, setSelectedHomeImage] = useState(null);
  const [homeImagePreview, setHomeImagePreview] = useState(null);
  const homeImageFileInputRef = useRef(null);

  const [orders, setOrders] = useState([]);

  // Fetch Menu, Bookings, Orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, orderRes, bookingRes, homeImageRes] = await Promise.all([
          api.get('/menu'),
          api.get('/orders'),
          api.get('/bookings'),
          api.get('/home-images')
        ]);
        if (menuRes.data) setMenuItems(menuRes.data);
        if (orderRes.data) setOrders(orderRes.data);
        if (bookingRes.data) setBookings(bookingRes.data);
        if (homeImageRes.data) setHomeImages(homeImageRes.data);
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
      const res = await api.post('/menu', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMenuItems([res.data, ...menuItems]);
      setShowMenuForm(false);
      setMenuForm({ name: '', price: '', category: 'Main Course', description: '', dietary: 'non-veg' });
      setSelectedImage(null);
      setImagePreview(null);
      alert('Menu item added successfully!');
    } catch (error) {
      alert("Failed to add menu item. Ensure you are logged in.");
    } finally {
      setUploading(false);
    }
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
    formData.append('image', selectedHomeImage);

    try {
      const res = await api.post('/home-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setHomeImages([res.data, ...homeImages]);
      setShowHomeImageForm(false);
      setHomeImageForm({ title: '', subtitle: '' });
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
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} /> Store Settings
          </button>
        </nav>
      </div>

      <div className="admin-main">
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-panel-card">
            <div className="admin-panel-header">
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
                      <td className="text-muted">#{order._id.substring(order._id.length - 6)}</td>
                      <td className="font-medium">Guest</td>
                      <td>{order.orderType || 'Walk-in'}</td>
                      <td className="text-primary font-bold">${order.totalAmount?.toFixed(2)}</td>
                      <td>
                        <span className={`admin-badge ${order.status}`}>{order.status}</span>
                      </td>
                      <td>
                        {order.status === 'pending' ? (
                          <div className="action-row">
                            <button onClick={() => updateOrderStatus(order._id, 'confirmed')} className="btn-action accept"><CheckCircle size={16}/> Prepare</button>
                            <button onClick={() => updateOrderStatus(order._id, 'cancelled')} className="btn-action reject"><XCircle size={16}/> Cancel</button>
                          </div>
                        ) : (
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
        )}

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
                      <td className="font-medium">{booking.name}</td>
                      <td>{booking.date} at {booking.time}</td>
                      <td>{booking.guests}</td>
                      <td>
                        <span className={`admin-badge ${booking.status}`}>{booking.status}</span>
                      </td>
                      <td>
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
              <button className="btn-admin-primary" onClick={() => setShowMenuForm(!showMenuForm)}>
                {showMenuForm ? 'Cancel' : '+ Add New Dish'}
              </button>
            </div>

            {showMenuForm && (
              <div className="admin-form-card">
                <h3>Add New Dish</h3>
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
                      <td>
                        <div className="menu-item-row">
                          {item.image ? (
                            <img 
                              src={item.image.startsWith('/uploads') ? `http://localhost:5000${item.image}` : item.image} 
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
                      <td>{item.category}</td>
                      <td className="text-primary font-bold">${item.price.toFixed(2)}</td>
                      <td>
                        <div className="action-row">
                          <button className="btn-icon-soft text-blue"><Edit size={16}/></button>
                          <button className="btn-icon-soft text-red"><Trash2 size={16}/></button>
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
                    <th>Title</th>
                    <th>Uploaded On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {homeImages.map(img => (
                    <tr key={img._id}>
                      <td>
                        <img 
                          src={img.imageUrl.startsWith('/uploads') ? `${BASE_URL}${img.imageUrl}` : img.imageUrl} 
                          alt="Hero" 
                          className="admin-menu-thumb" 
                        />
                      </td>
                      <td>{img.title || <span className="text-muted">No Title</span>}</td>
                      <td>{new Date(img.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn-icon-soft text-red" onClick={() => handleDeleteHomeImage(img._id)}>
                          <Trash2 size={16}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {homeImages.length === 0 && <tr><td colSpan="4" className="text-center py-4">No home images uploaded yet.</td></tr>}
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
