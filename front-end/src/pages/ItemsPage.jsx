import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
// import MenuItem from '../components/MenuItem';
import { itemsApi } from '../api/api';

const ItemsPage = ({ user }) => {
  const { publicRequest, authRequest } = useAuth();
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {

      try {
        setLoadingItems(true);
        // Use publicRequest since this doesn't need auth
        const itemsData = await itemsApi.getItems(publicRequest);
        setItems(itemsData);
        setLoadingItems(false);
      } catch (error) {
        console.error("Error fetching items:", error);
        setError('Failed to load menu items. Please try again later.');
        setLoadingItems(false);
      }
    };

    fetchData();
  }, [publicRequest]);

  const handleEdit = (itemId) => {
    navigate(`/menu/edit/${itemId}`);
  };

  const handleDelete = async (itemId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmed) return;

    try {
      // Use authRequest instead of direct fetch
      await itemsApi.deleteItem(authRequest, itemId);
      
      // Remove item from state
      setItems(items.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Delete error:", error.message);
    }
  };

  if (loadingItems) return <p>Loading items...</p>;
  if (error) return <div className="error">{error}</div>;

  const isAdmin = user?.role === "administrator";
  console.log("Current user:", user);
  console.log("User role:", user?.role);
  console.log("Is admin:", isAdmin);

  return (
    <div>
      <h1>Menu</h1>
      {isAdmin && (
        <div>
          <Link to="/menu/add">+ Add New Item</Link>
        </div>
      )}

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <p>${item.price.toFixed(2)}</p>

            {isAdmin && (
              <>
                <button onClick={() => handleEdit(item.id)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsPage;
