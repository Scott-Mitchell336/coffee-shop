import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { itemsApi } from '../api/api';

// Remove user from props, we'll get it from useAuth() instead
const ItemsPage = ({ onAddToCart }) => {
  // Get user from auth context to ensure it's always up-to-date
  const { publicRequest, authRequest, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loadingItems, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [modifyDropdownOpen, setModifyDropdownOpen] = useState(false);
  const modifyDropdownRef = useRef(null);

  // Check if user is admin (will update automatically when user changes)
  const isAdmin = user?.role === "administrator";

  // For debugging - remove in production
  useEffect(() => {
    console.log("Current user in ItemsPage:", user);
    console.log("Is admin:", isAdmin);
  }, [user, isAdmin]);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modifyDropdownRef.current && !modifyDropdownRef.current.contains(event.target)) {
        setModifyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper to get unique categories and sort them safely
  const getSortedCategories = (items) => {
    const categoriesSet = new Set(
      items
        .map((item) => item.category)
        .filter((category) => category != null) // filter out null/undefined categories
    );
    return Array.from(categoriesSet).sort((a, b) => a.localeCompare(b));
  };

  // Group items by category
  const groupItemsByCategory = (items) => {
    return items.reduce((groups, item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
      return groups;
    }, {});
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const itemsData = await itemsApi.getItems(publicRequest);
        setItems(itemsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching items:", error);
        setError('Failed to load menu items. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [publicRequest]);

  const handleEdit = (itemId) => {
    setModifyDropdownOpen(false);
    setSelectedItem(null);
    navigate(`/menu/edit/${itemId}`);
  };

  const handleDelete = async (itemId) => {
    setModifyDropdownOpen(false);
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      await itemsApi.deleteItem(authRequest, itemId);
      setItems(items.filter((item) => item.id !== itemId));
      setSelectedItem(null);
    } catch (error) {
      console.error("Delete error:", error.message);
    }
  };

  const handleAddToCart = (item) => {
    if (onAddToCart) {
      onAddToCart(item);
    } else {
      alert(`Added ${item.name} to cart! (Add your cart logic here)`);
    }
  };

  if (loadingItems) return <p className="text-center mt-10 text-gray-600">Loading items...</p>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  const sortedCategories = getSortedCategories(items);
  const groupedItems = groupItemsByCategory(items);

  // Modal close helper
  const closeModal = () => {
    setSelectedItem(null);
    setModifyDropdownOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Menu</h1>

      {isAdmin && (
        <div className="mb-8 text-center">
          <Link
            to="/menu/add"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            + Add New Item
          </Link>
        </div>
      )}

      {sortedCategories.map((category) => (
        <section key={category} className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 border-b border-gray-300 pb-2">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {groupedItems[category]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white shadow rounded-lg p-6 flex flex-col justify-between hover:shadow-lg transition"
                >
                  <div 
                    onClick={() => setSelectedItem(item)}
                    className="cursor-pointer"
                    aria-label={`View details for ${item.name}`}
                  >
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    {item.description && (
                      <p className="mt-2 text-gray-600 text-sm">{item.description}</p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold">${item.price.toFixed(2)}</span>
                    
                    {/* Add admin controls here */}
                    {isAdmin && (
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item.id);
                          }}
                          className="bg-blue-600 text-white px-2 py-1 text-sm rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="bg-red-600 text-white px-2 py-1 text-sm rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}

      {/* Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
        >
          <div 
            className="bg-white rounded-lg max-w-md w-full p-6 relative"
            onClick={e => e.stopPropagation()} // Prevent modal close on inner click
          >
            <button 
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold mb-4">{selectedItem.name}</h3>
            {selectedItem.description && (
              <p className="mb-4 text-gray-700">{selectedItem.description}</p>
            )}
            <p className="mb-4 font-semibold text-lg">Price: ${selectedItem.price.toFixed(2)}</p>

            {/* Placeholder for future image */}
            {/* <img src={selectedItem.imageUrl} alt={selectedItem.name} className="mb-4 max-h-48 mx-auto object-contain" /> */}

            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleAddToCart(selectedItem)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Add to Cart
              </button>

              {isAdmin && (
                <div className="relative" ref={modifyDropdownRef}>
                  <button
                    onClick={() => setModifyDropdownOpen((open) => !open)}
                    className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 transition"
                    aria-haspopup="true"
                    aria-expanded={modifyDropdownOpen}
                  >
                    Modify &#x25BC;
                  </button>
                  {modifyDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-md z-50">
                      <button
                        onClick={() => handleEdit(selectedItem.id)}
                        className="block w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(selectedItem.id)}
                        className="block w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsPage;
