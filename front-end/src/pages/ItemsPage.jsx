import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { itemsApi } from "../api/api";

const ItemsPage = () => {
  const { publicRequest, authRequest, user } = useAuth();
  const { addItemToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loadingItems, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();
  const preferredCategories = [
    "Coffee",
    "Tea",
    "Extras",
    "Pastries",
    "Baked",
    "Bottled",
    "Sandwiches",
  ];

  const capitalize = (str) => {
    if (!str || typeof str !== "string") return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const [selectedItem, setSelectedItem] = useState(null);
  const [modifyDropdownOpen, setModifyDropdownOpen] = useState(false);
  const modifyDropdownRef = useRef(null);

  const isAdmin = user?.role === "administrator";

  const categoryRefs = useRef({});

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        modifyDropdownRef.current &&
        !modifyDropdownRef.current.contains(event.target)
      ) {
        setModifyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPreferredCategories = (items) => {
    const presentCategories = new Set(
      items.map((item) => capitalize(item.category))
    );
    return preferredCategories.filter((cat) => presentCategories.has(cat));
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmed) return;

    try {
      await itemsApi.deleteItem(authRequest, itemId);
      setItems(items.filter((item) => item.id !== itemId));
      setSelectedItem(null);
    } catch (error) {
      console.error("Delete error:", error.message);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      setActionLoading(true);
      await addItemToCart(item.id, 1);
      alert(`${item.name} added to cart!`);
      closeModal();
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert(`Failed to add ${item.name} to cart. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

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

  if (loadingItems)
    return <p className="text-center mt-10 text-gray-600">Loading items...</p>;
  if (error)
    return <div className="text-center mt-10 text-red-600">{error}</div>;

  const sortedCategories = getPreferredCategories(items);
  const groupedItems = groupItemsByCategory(items);
  const closeModal = () => {
    setSelectedItem(null);
    setModifyDropdownOpen(false);
  };

  return (
    <>
      <section className="bg-gray-100 py-8 mb-12 shadow-sm rounded-b-lg">
        <h1
          className="text-6xl text-center text-black-600 font-semibold"
        >
          Menu
        </h1>
      </section>

      {/* BELOW THE MENU TITLE: TWO COLUMN LAYOUT */}
      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* LEFT VERTICAL NAV */}
        <nav
          className="sticky top-20 flex flex-col space-y-14 w-40 mr-8 self-start
            bg-white bg-opacity-90"
          aria-label="Category navigation"
          style={{ minHeight: "300px" }}
        >
          {sortedCategories.map((category) => (
            <a
              key={category}
              href={`#${category}`}
              className="font-bold text-grey-300 hover:text-blue-500 cursor-pointer"
            >
              {category}
            </a>
          ))}
        </nav>

        {/* Vertical Separator */}
        <div
          className="border-r border-gray-300 opacity-20"
          style={{ width: "1px", marginRight: "2rem" }}
        ></div>

        {/* MAIN CONTENT */}
        <main className="flex-1">
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
              className="mb-20"
              ref={(el) => (categoryRefs.current[category] = el)}
            >
              <div id={category.toLowerCase()} className="scroll-mt-50"></div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-5 border-b border-gray-500 pb-2">
                {category}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedItems[category]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="bg-white border border-black/10 rounded-xl drop-shadow-lg hover:drop-shadow-[0_10px_15px_rgba(59,130,246,0.25)] transition p-6 cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="mt-2 text-med text-gray-600">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-md font-semibold text-gray-700">
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
              className="fixed inset-0 bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50"
              onClick={closeModal}
              aria-modal="true"
              role="dialog"
            >
              <div
                className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  onClick={closeModal}
                  aria-label="Close modal"
                >
                  &times;
                </button>

                <h3 className="text-2xl font-bold mb-2">{selectedItem.name}</h3>
                {selectedItem.description && (
                  <p className="mb-4 text-gray-600">{selectedItem.description}</p>
                )}
                <p className="font-semibold mb-4">${selectedItem.price.toFixed(2)}</p>

                <button
                  onClick={() => handleAddToCart(selectedItem)}
                  disabled={actionLoading}
                  className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {actionLoading ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ItemsPage;
