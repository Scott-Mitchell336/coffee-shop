import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import { useAuth } from '../contexts/AuthContext';
import { itemsApi } from '../api/api';

const ItemDetail = () => {
  const { publicRequest } = useAuth();
  const { itemId } = useParams(); // Get itemId from URL
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, [itemId]);

  if (loading) return <p>Loading item details...</p>;
  if (error) return <p>{error}</p>;
  if (!item) return <p>Item not found.</p>;

  return (
    <div>
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <p>Price: ${item.price.toFixed(2)}</p>
      {/* Add more details here as needed */}
    </div>
  );
};

export default ItemDetail;
