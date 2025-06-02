import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext'; // Import useCart hook
import { itemsApi } from '../api/api';

// Remove user from props, we'll get it from useAuth() instead
const ItemsPage = ({ onAddToCart }) => {
  // Get user from auth context to ensure it's always up-to-date
  const { publicRequest, authRequest, user } = useAuth();
  const { addItemToCart } = useCart(); // Use the cart context
  const [items, setItems] = useState([]);
  const [loadingItems, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false); // For tracking add to cart state
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [modifyDropdownOpen, setModifyDropdownOpen] = useState(false);
  const modifyDropdownRef = useRef(null);

  const isAdmin = user?.role === "administrator";

  // Refs to category sections for scrolling
  const categoryRefs = useRef({});

  useEffect(() => {
    function handleClickOutside(event) {
      if (modifyDropdownRef.current && !modifyDropdownRef.current.contains(event.target)) {
        setModifyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter and order categories by preferred order, only those present in items
  const getPreferredCategories = (items) => {
    const presentCategories = new Set(
      items.map((item) => capitalize(item.category))
    );
    return preferredCategories.filter(cat => presentCategories.has(cat));
  };

  const groupItemsByCategory = (items) => {
    return items.reduce((groups, item) => {
      const cat = capitalize(item.category);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
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
        setError("Failed to load menu items. Please try again later.");
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

  // Update handleAddToCart to use CartContext
  const handleAddToCart = async (item) => {
    try {
      setActionLoading(true);
      await addItemToCart(item.id, 1);
      // Show success feedback
      alert(`${item.name} added to cart!`);
      closeModal(); // Close the modal after adding to cart
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert(`Failed to add ${item.name} to cart. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  // Smooth scroll for anchor links
  useEffect(() => {
    const handleHashChange = () => {
      const id = window.location.hash.replace("#", "");
      if (id && categoryRefs.current[id]) {
        categoryRefs.current[id].scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (loadingItems) return <p className="text-center mt-10 text-gray-600">Loading items...</p>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  const sortedCategories = getPreferredCategories(items);
  const groupedItems = groupItemsByCategory(items);
  const closeModal = () => {
    setSelectedItem(null);
    setModifyDropdownOpen(false);
  };

  return (
    <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* LEFT VERTICAL NAV */}
      <nav
        className="sticky top-40 flex flex-col space-y-12 w-40 mr-8 self-start"
        aria-label="Category navigation"
      >
        {sortedCategories.map((category) => (
          <a
            key={category}
            href={`#${category}`}
            className="font-bold text-gray-700 hover:text-indigo-600 cursor-pointer"
          >
            {category}
          </a>
        ))}
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">Menu</h1>

        {isAdmin && (
          <div className="mb-10 text-center">
            <Link
              to="/menu/add"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              + Add New Item
            </Link>
          </div>
        )}

        {sortedCategories.map((category) => (
          <section
            key={category}
            id={category}
            className="mb-14"
            ref={(el) => (categoryRefs.current[category] = el)}
          >
            <div id={category.toLowerCase()} className="scroll-mt-40"></div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-5 border-b border-gray-200 pb-2">
              {category}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedItems[category]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition p-6 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      {item.description && (
                        <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-md font-semibold text-green-700">
                        ${item.price.toFixed(2)}
                      </span>

                      {isAdmin && (
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item.id);
                            }}
                            className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600"
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

        {selectedItem && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            onClick={closeModal}
            aria-modal="true"
            role="dialog"
          >
            <div
              className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">{selectedItem.name}</h3>
              {selectedItem.description && (
                <p className="text-gray-600 mb-3">{selectedItem.description}</p>
              )}
              <p className="text-md font-semibold mb-6 text-gray-800">
                Price: ${selectedItem.price.toFixed(2)}
              </p>

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
                      className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                      aria-haspopup="true"
                      aria-expanded={modifyDropdownOpen}
                    >
                      Modify ▼
                    </button>

                    {modifyDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow z-50">
                        <button
                          onClick={() => handleEdit(selectedItem.id)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-600 hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(selectedItem.id)}
                          className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white"
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
      </main>
    </div>
  );
};

export default ItemsPage;
