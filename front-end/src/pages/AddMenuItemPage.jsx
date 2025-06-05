import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AddMenuItemPage() {
  const navigate = useNavigate();
  const { authRequest } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await authRequest('/items', 'POST', formData);
      navigate('/menu');
    } catch (err) {
      setError('Failed to add menu item. Please try again.');
      console.error('Error adding menu item:', err);
    }
  };

  return (
    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-white p-6 shadow-lg max-w-md w-full rounded-lg z-50">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add New Menu Item</h2>
      {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Category</option>
            <option value="Coffee">Coffee</option>
            <option value="Tea">Tea</option>
            <option value="Extras">extras</option>
            <option value="Pastry">Pastry</option>
            <option value="Baked">Baked</option>
            <option value="Sandwiches">Sandwiches</option>
            <option value="Bottled">Bottled Drinks</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="image_url">Image URL</label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-700 text-white font-semibold"
          >
            Add Menu Item
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMenuItemPage;


// This code defines a React component for adding a new menu item in a cafe management application.
// It includes a form with fields for the item's name, description, price, category, and image URL.
// The form validates input and handles submission to create a new menu item.
// It also includes error handling and navigation back to the menu page after successful submission.
// This code is a React component for adding a new menu item in a cafe application.
// It includes a form for entering item details, validation, and submission handling.
// It also provides a cancel button to navigate back to the menu without saving changes.
//       <div className="flex flex-col">
//         <button
//           onClick={() => navigate(`/edit/${item.id}`)}
//           className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md"
//         >
//           Edit
//         </button>
//         <button
//           onClick={handleDelete}
//           className="px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded-md"     