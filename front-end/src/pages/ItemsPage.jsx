import React, { useEffect, useState } from "react";
import { getItems } from "../api/fetchWrapper";


const ItemsPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getItems();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      }
    };
    fetchMenu();
  }, []);

  return (
    <div>
      <h1>Menu</h1>
      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <p>${item.price.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items available.</p>
      )}
    </div>
  );
};

export default ItemsPage;
