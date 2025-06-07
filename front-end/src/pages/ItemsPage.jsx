import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { itemsApi } from "../api/api";
import Footer from "../components/Footer";

const ItemsPage = () => {
  const { publicRequest, authRequest, user } = useAuth();
  const { addItemToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loadingItems, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartSuccessItem, setCartSuccessItem] = useState(null);
  const categoryRefs = useRef({});
  const userRedirectedRef = useRef(false);
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

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  const isAdmin = user?.role === "administrator";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const itemsData = await itemsApi.getItems(publicRequest);
        setItems(itemsData);
      } catch (err) {
        setError("Failed to load menu items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [publicRequest]);

  const handleEdit = (id) => navigate(`/menu/edit/${id}`);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await itemsApi.deleteItem(authRequest, id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      setActionLoading(true);
      setSelectedItem(null);
      setCartSuccessItem(null);
      userRedirectedRef.current = false;

      await addItemToCart(item.id, 1);
      setCartSuccessItem(item);
      setTimeout(() => {
        if (!userRedirectedRef.current) {
          setCartSuccessItem(null);
        }
      }, 10000);
    } catch (err) {
      alert(`Failed to add ${item.name} to cart. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleHashChange = () => {
    const id = window.location.hash.slice(1);
    if (id && categoryRefs.current[id]) {
      categoryRefs.current[id].scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const getPreferredCategories = (items) => {
    const present = new Set(items.map((item) => capitalize(item.category)));
    return preferredCategories.filter((cat) => present.has(cat));
  };

  const groupItemsByCategory = (items) => {
    return items.reduce((acc, item) => {
      const cat = capitalize(item.category);
      acc[cat] = acc[cat] || [];
      acc[cat].push(item);
      return acc;
    }, {});
  };

  if (loadingItems)
    return <p className="text-center mt-10 text-gray-600">Loading items...</p>;
  if (error)
    return <div className="text-center mt-10 text-red-600">{error}</div>;

  const groupedItems = groupItemsByCategory(items);
  const sortedCategories = getPreferredCategories(items);

  return (
    <>
      <section className="bg-gray-100 py-8 mb-12 shadow-sm rounded-b-lg">
        <h1 className="text-6xl text-center text-black-600 font-semibold">Menu</h1>
      </section>

      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <nav
          className="sticky top-20 flex flex-col space-y-14 w-40 mr-8 self-start bg-white bg-opacity-90"
          aria-label="Category navigation"
        >
          {sortedCategories.map((category) => (
            <a
              key={category}
              href={`#${category}`}
              className="font-bold text-gray-700 hover:text-blue-500 cursor-pointer"
            >
              {category}
            </a>
          ))}
        </nav>

        <div className="border-r border-gray-300 opacity-20" style={{ width: "1px", marginRight: "2rem" }}></div>

        <main className="flex-1">
          {isAdmin && (
            <div className="mb-6 text-right">
              <Link
                to="/menu/add"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
              >
                Add New Item to Menu
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
              <h2 className="text-2xl font-semibold text-gray-800 mb-5 border-b border-gray-500 pb-2">
                {category}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {groupedItems[category]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        setSelectedItem((prev) =>
                          prev?.id === item.id ? null : item
                        )
                      }
                      className="bg-white border border-black/10 rounded-xl drop-shadow-lg hover:drop-shadow-[0_10px_15px_rgba(59,130,246,0.25)] transition p-4 cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex flex-row mb-4">
                        <div className="w-1/2 flex items-center justify-center pr-2">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="object-contain rounded-md max-h-[170px] w-auto"
                          />
                        </div>
                        <div className="w-1/2 pl-4 flex flex-col justify-start">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-gray-700">{item.description}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-semibold text-blue-500">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      {(selectedItem?.id === item.id || !isAdmin) && (
                        <div className="flex flex-col gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                            className="bg-blue-600 text-white px-2 py-2 rounded hover:bg-indigo-600 transition"
                          >
                            Add to Cart
                          </button>

                          {isAdmin && selectedItem?.id === item.id && (
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(item.id);
                                }}
                                className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-indigo-600"
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
                      )}
                    </div>
                  ))}
              </div>
            </section>
          ))}

          {cartSuccessItem && (
            <div
              className="fixed inset-0 bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50"
              onClick={() => setCartSuccessItem(null)}
            >
              <div
                className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 relative text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setCartSuccessItem(null)}
                  aria-label="Close"
                >
                  &times;
                </button>

                <h3 className="text-2xl font-semibold mb-4 text-blue-600">
                  {cartSuccessItem.name} added to cart!
                </h3>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      userRedirectedRef.current = true;
                      setCartSuccessItem(null);
                      setSelectedItem(null);
                      navigate("/menu");
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
                  >
                    Add More Items
                  </button>

                  <button
                    onClick={() => {
                      userRedirectedRef.current = true;
                      setCartSuccessItem(null);
                      setSelectedItem(null);
                      navigate("/cart");
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
                  >
                    Go to Cart
                  </button>
                </div>

                <p className="text-sm text-gray-400 mt-4">
                  Closing in 10 seconds...
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default ItemsPage;
