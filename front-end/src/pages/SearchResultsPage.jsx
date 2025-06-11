import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import Fuse from "fuse.js";
import { searchItems } from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import Footer from "../components/Footer"; // Import Footer for consistency

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate(); // Add navigation hook
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";
  const { publicRequest } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setItems([]);
      return;
    }

    async function fetchSearchResults() {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching search results for query:", query);
        const results = await searchItems(publicRequest, query);
        console.log("Search results:", results);
        setItems(results);
      } catch (err) {
        console.error("Failed to fetch search results.");
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query, publicRequest]);

  // Handler for clicking on a search result
  const handleItemClick = (itemId, category) => {
    // Navigate to the menu page with item ID and its category
    navigate(`/menu?selectedItem=${itemId}`);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Search Results for: <span className="text-blue-500">{query}</span>
        </h1>

        {loading && <p className="text-gray-600">Loading results...</p>}
        {error && <p className="text-red-500">{error.message || "An error occurred"}</p>}
        
        {!loading && !error && (
          items.length > 0 ? (
            <ul className="space-y-4">
              {items.map(item => (
                <li
                  key={item.id}
                  className="border p-4 rounded shadow hover:shadow-md cursor-pointer transition hover:bg-blue-50"
                  onClick={() => handleItemClick(item.id, item.category)}
                >
                  <div className="flex items-start">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg text-blue-700">{item.name}</h3>
                      <p className="text-gray-700">{item.description}</p>
                      <p className="mt-2 font-medium text-blue-600">${item.price.toFixed(2)}</p>
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded mt-2">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center py-10">No results found for "{query}".</p>
          )
        )}

        {items.length > 0 && (
          <div className="mt-8 text-center">
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
              onClick={() => navigate('/menu')}
            >
              View Full Menu
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
