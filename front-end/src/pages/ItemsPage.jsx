import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const preferredCategories = [
    "Coffee",
    "Tea",
    "Extras",
    "Pastries",
    "Baked",
    "Bottled",
    "Sandwiches",
  ];

  const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");
  const isAdmin = user?.role === "administrator";

  // Get selected item ID from URL if present
  const queryParams = new URLSearchParams(location.search);
  const selectedItemId = queryParams.get("selectedItem");

  // Fetch items and then scroll to selected item if needed
  const headerOffset = 80; // Adjust this value based on your header height
  const itemRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const itemsData = await itemsApi.getItems(publicRequest);
        setItems(itemsData);
        
        // If a specific item was selected through search, find and select it
        if (selectedItemId) {
          const foundItem = itemsData.find(item => item.id === parseInt(selectedItemId));
          if (foundItem) {
            setSelectedItem(foundItem);
            
            // Give the DOM more time to fully render before attempting to highlight and scroll
            console.log("Will highlight item:", selectedItemId);
            setTimeout(() => {
              console.log("Attempting to highlight item after delay");
              highlightAndScrollToItem(parseInt(selectedItemId));
            }, 1000); // Longer timeout for more reliable rendering
          }
        }
      } catch (err) {
        setError("Failed to load menu items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [publicRequest, selectedItemId]);

  // Add this new function for more robust highlighting
  const highlightAndScrollToItem = (itemId) => {
    console.log("Looking for item:", itemId);
    
    // Try multiple selectors to find the element
    let itemElement = document.getElementById(`item-${itemId}`);
    
    if (!itemElement) {
      console.warn("Could not find element by ID, trying query selector");
      itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
    }
    
    if (!itemElement) {
      console.warn("Could not find element by data attribute either");
      // Try again after a short delay
      setTimeout(() => {
        let retryElement = document.getElementById(`item-${itemId}`);
        if (retryElement) {
          applyHighlightToElement(retryElement, itemId);
        } else {
          console.error("Failed to find element after retry");
        }
      }, 500);
      return;
    }
    
    applyHighlightToElement(itemElement, itemId);
  };

  // Move the highlight application to a separate function
  const applyHighlightToElement = (element, itemId) => {
    console.log("Applying highlight to element:", element);
    
    // First set selected item again to ensure React state is updated
    const item = items.find(i => i.id === itemId);
    if (item) {
      setSelectedItem(item);
    }
    
    // Add a distinct class for the highlight effect
    element.classList.add('search-highlight');
    
    // Add inline blue ring style
    element.style.setProperty('box-shadow', '0 0 0 4px rgb(59, 130, 246)', 'important');
    element.style.setProperty('border-radius', '0.75rem', 'important');
    
    // Scroll the element into view
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // Flash effect with background color
    element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    
    // Remove highlight after delay
    setTimeout(() => {
      element.classList.remove('search-highlight');
      element.style.removeProperty('box-shadow');
      element.style.removeProperty('background-color');
      
      // Keep the item selected in React state
    }, 3000);
  };

  const scrollToSelectedItem = (itemId) => {
    // Find the element
    const itemElement = document.getElementById(`item-${itemId}`);
    
    if (itemElement) {
      console.log("Found item element:", itemId);
      
      // First remove any existing highlight classes that might be causing conflicts
      itemElement.classList.remove('ring-0', 'ring-1', 'ring-2', 'ring-4', 'ring-black', 'ring-gray-300');
      
      // Add the highlight effect with !important to ensure it's applied
      itemElement.style.setProperty('--tw-ring-color', 'rgb(59, 130, 246)', 'important'); // Blue-500 color
      itemElement.style.setProperty('--tw-ring-opacity', '1', 'important');
      itemElement.style.setProperty('--tw-ring-offset-width', '0px', 'important');
      itemElement.style.setProperty('--tw-ring-offset-color', 'transparent', 'important');
      
      // Apply the classes
      itemElement.classList.add('ring-4', 'highlight-pulse');
      
      // Calculate position with offset for header
      const elementPosition = itemElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      // Scroll with better positioning
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Remove highlight after delay
      setTimeout(() => {
        itemElement.classList.remove('ring-4', 'highlight-pulse');
        
        // Also clear the inline styles
        itemElement.style.removeProperty('--tw-ring-color');
        itemElement.style.removeProperty('--tw-ring-opacity');
        itemElement.style.removeProperty('--tw-ring-offset-width');
        itemElement.style.removeProperty('--tw-ring-offset-color');
      }, 3000);
      
      console.log("Applied highlight to item:", itemId);
    } else {
      console.warn("Could not find element for item:", itemId);
    }
  };

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
        <h1 className="text-6xl text-center text-black-600 pb-3 font-semibold">
          Menu
        </h1>
        <h3 className="text-center text-gray-600 max-w-2xl mx-auto">
          "Discover handcrafted coffee, fresh-baked pastries, and gourmet sandwiches
          made with care—every item on our menu is a little moment of joy."
        </h3>
        <p className="text-center text-blue-600 mt-4 max-w-xl mx-auto">
          Our café does not accept requests for order modifications at this time.
        </p>
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

        <div
          className="border-r border-gray-300 opacity-20"
          style={{ width: "1px", marginRight: "2rem" }}
        ></div>

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
                      id={`item-${item.id}`}
                      data-item-id={item.id}  // Add this data attribute
                      ref={el => itemRefs.current[item.id] = el}
                      onClick={() => setSelectedItem((prev) => prev?.id === item.id ? null : item)}
                      className={`bg-white border border-gray-200 rounded-xl shadow-md 
    hover:shadow-lg transition duration-300 p-4 cursor-pointer 
    flex flex-col h-full
    ${selectedItem?.id === item.id ? 'ring-2 ring-blue-500' : ''}
    ${Number(selectedItemId) === item.id ? 'search-result-item' : ''}`}
                    >
                      {/* Image section with fixed height */}
                      <div className="flex flex-row mb-4">
                        <div className="w-1/2 flex items-center justify-center pr-2">
                          <div className="h-[170px] w-full flex items-center justify-center">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="object-contain max-h-[170px] max-w-full rounded-md"
                            />
                          </div>
                        </div>
                        <div className="w-1/2 pl-4 flex flex-col justify-start">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-gray-700 line-clamp-4">{item.description}</p>
                        </div>
                      </div>

                      {/* Price section */}
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-semibold text-blue-500">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Button section - pushed to bottom with mt-auto */}
                      <div className="mt-auto">
                        {(selectedItem?.id === item.id || !isAdmin) && (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(item);
                              }}
                              className="bg-blue-600 text-white px-2 py-2 rounded hover:bg-indigo-600 transition w-full"
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
