import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Fuse from "fuse.js";
import { searchItems } from "../api/api";
import { useAuth } from "../contexts/AuthContext";

export default function SearchResultsPage() {
  const location = useLocation();
  console.log("location.search = ", location.search);
  const queryParams = new URLSearchParams(location.search);
  console.log("queryParams = ", queryParams);
  const query = queryParams.get("query") || "";
  const { publicRequest } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(" ");

  useEffect(() => {
    if (!query.trim()) {
      setItems([]);
      return;
    }

    async function fetchSearchResults() {
      setLoading(true);
      setError(" ");
      try {
        console.log("Fetching search results for query:", query);
        const results = await searchItems(publicRequest, query);
        console.log("Search results:", results);
        setItems(results);
      } catch (err) {
        console.error("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Search Results for: <span className="text-blue-500">{query}</span>
      </h1>

      {loading && <p>Loading results...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {console.log("loading = ",loading)}
      
      {console.log("items = ",items)}
      {!loading && !error && (
        items.length > 0 ? (
          <ul className="space-y-4">
            {items.map(item => (
              <li
                key={item.id}
                className="border p-4 rounded shadow hover:shadow-md transition"
              >
                <h3 className="font-semibold">{item.name}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No results found.</p>
        )
      )}
    </div>
  );
}
 