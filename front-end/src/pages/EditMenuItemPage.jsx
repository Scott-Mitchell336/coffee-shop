import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById, updateItem } from '../api/fetchWrapper';

const EditMenuItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const item = await getItemById(id);
        setFormData({
          name: item.name,
          description: item.description,
          price: item.price,
        });
      } catch (err) {
        setError('Failed to load item.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

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
      await updateItem(id, formData);
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

  if (loading) return <p>Loading item...</p>;

  return (
    <div>
      <h1>Edit Menu Item</h1>

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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMenuItemPage;
