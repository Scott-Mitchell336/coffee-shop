import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { itemsApi, cartApi } from "../api/api";

const ItemDetail = () => {
  const { publicRequest, authRequest, currentUser } = useAuth();
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false); // for button loading state
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await itemsApi.getItemById(publicRequest, itemId);
        setItem(data);
      } catch (err) {
        console.error("Error fetching item:", err);
        setError("Failed to load item.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId, publicRequest]);

  if (loading)
    return <p className="text-center text-gray-600">Loading item details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!item)
    return <p className="text-center text-gray-600">Item not found.</p>;

  const handleAddToCart = async () => {
    if (!currentUser) {
      alert("Please log in to add items to your cart.");
      return;
    }
    setActionLoading(true);
    setMessage(null);
    try {
      await cartApi.addItemToCart(authRequest, currentUser.id, {
        itemId: item.id,
        quantity: 1,
      });
      setMessage("Item added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      setMessage("Failed to add item to cart.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setActionLoading(true);
    setMessage(null);
    try {
      await itemsApi.deleteItem(authRequest, item.id);
      setMessage("Item deleted successfully.");
      navigate("/items");
    } catch (err) {
      console.error("Delete item error:", err);
      setMessage("Failed to delete item.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/items/edit/${item.id}`);
  };

  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-white p-6 shadow-lg max-w-md w-full rounded-lg z-50">
      <h2 className="text-2xl font-semibold mb-4">{item.name}</h2>

      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full max-h-64 object-cover rounded-md mb-4"
        />
      )}

      <p className="mb-2 text-gray-700">{item.description}</p>
      <p className="mb-4 font-semibold text-lg">
        Price: <span className="text-blue-600">${item.price.toFixed(2)}</span>
      </p>

      <button
        onClick={handleAddToCart}
        disabled={actionLoading}
        className={`mr-4 px-4 py-2 rounded-md text-white font-semibold transition-colors ${
          actionLoading
            ? "bg-blue-200 cursor-not-allowed"
            : "bg-blue-400 hover:bg-blue-700"
        }`}
      >
        {actionLoading ? "Adding..." : "Add to Cart"}
      </button>

      {isAdmin && (
        <div className="inline-block relative">
          <button
            disabled={actionLoading}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 font-semibold"
          >
            Modify ▼
          </button>
          <div className="absolute top-full left-0 bg-white border border-gray-300 rounded-md shadow-md flex flex-col min-w-[120px] z-50">
            <button
              onClick={handleEdit}
              disabled={actionLoading}
              className="px-4 py-2 text-left hover:bg-gray-100 disabled:text-gray-400 cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="px-4 py-2 text-left text-red-600 hover:bg-red-100 disabled:text-gray-400 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {message && (
        <p className="mt-4 text-center text-sm text-green-600">{message}</p>
      )}
    </div>
  );
};

export default ItemDetail;
