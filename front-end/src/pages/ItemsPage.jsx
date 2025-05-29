import React, { useEffect, useState } from "react";
import { getItems } from "../api/fetchWrapper";
import { Link, useNavigate } from "react-router-dom";

const ItemsPage = ({ user }) => {
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {

      try {
        setLoadingItems(true);
        const itemsData = await getItems();
        console.log("Fetched items:", itemsData);
        setItems(itemsData);
        setLoadingItems(false);
      } catch (error) {
        console.error("Error fetching items:", error);
        setLoadingItems(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (itemId) => {
    navigate(`/menu/edit/${itemId}`);
  };

  const handleDelete = async (itemId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3000/api/items/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete item");
      }

      // Remove item from state
      setItems(items.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Delete error:", error.message);
    }
  };

if (loadingItems) return <p>Loading items...</p>;

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
