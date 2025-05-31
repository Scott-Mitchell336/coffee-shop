import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AddMenuItemPage() {
  const navigate = useNavigate();
  const { authRequest } = useAuth(); // Use authRequest for protected routes
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use authRequest since this needs authentication
      await authRequest('/items', 'POST', formData);
      navigate('/menu');
    } catch (err) {
      setError('Failed to add menu item. Please try again.');
      console.error('Error adding menu item:', err);
    }
  };

  return (
    <div className="add-item-page">
      <h2>Add New Menu Item</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="coffee">Coffee</option>
            <option value="tea">Tea</option>
            <option value="pastry">Pastry</option>
            <option value="sandwich">Sandwich</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="image_url">Image URL</label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/menu')} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Add Menu Item
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMenuItemPage;