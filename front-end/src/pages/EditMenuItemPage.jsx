//import { getItemById, updateItem } from '../api/fetchWrapper';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { itemsApi } from '../api/api';

const EditMenuItemPage = () => {
  const { publicRequest, authRequest } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const allItems = await itemsApi.getItems(publicRequest);
        const item = allItems.find(i => i.id === parseInt(id));
        if (!item) {
          setError('Item not found.');
          setLoading(false);
          return;
        }
        setFormData({
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category || '',
          image_url: item.image_url || '',
        });
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load item.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, publicRequest]);

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
      await itemsApi.updateItem(authRequest, id, formData);
      setSuccessMessage('Menu item updated successfully!');
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

  if (loading) return <p className="text-center mt-10">Loading item...</p>;

  return (
    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-white p-6 shadow-lg max-w-md w-full rounded-lg z-50">
      <h2 className="text-2xl font-semibold mb-4 text-center">Edit Menu Item</h2>

      {error && <p className="mb-4 text-red-600 text-sm text-center">{error}</p>}
      {successMessage && (
        <p className="mb-4 text-green-600 text-sm text-center">{successMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Category (optional)</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Category</option>
            <option value="coffee">Coffee</option>
            <option value="tea">Tea</option>
            <option value="pastry">Pastry</option>
            <option value="sandwich">Sandwich</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Image URL (optional)</label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md text-white font-semibold ${
              isSubmitting ? 'bg-blue-200 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMenuItemPage;


// This code is a React component for editing a menu item in a cafe application.
// It fetches the item details by ID, allows the user to edit its properties,
// and submits the changes to the server. It includes form validation and displays success or error messages.
// It also provides a cancel button to navigate back to the menu without saving changes.
//       <button
//               onClick={() => navigate(`/edit/${item.id}`)}
//               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               disabled={actionLoading}
//             >
//               Edit         