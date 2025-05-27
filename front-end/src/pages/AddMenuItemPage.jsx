import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../api/fetchWrapper';

const AddMenuItemPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      return 'Name and description are required.';
    }

    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      return 'Price must be a number greater than 0.';
    }

    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    setIsSubmitting(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      await createItem(formData);
      setSuccessMessage('Menu item added successfully!');
      setFormData({ name: '', description: '', price: '' });

      setTimeout(() => {
        navigate('/menu');
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/menu');
  };

  return (
    <div>
      <h1>Add New Menu Item</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Add Item'}
          </button>
          <button type="button" onClick={handleCancel} style={{ marginLeft: '8px' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMenuItemPage;