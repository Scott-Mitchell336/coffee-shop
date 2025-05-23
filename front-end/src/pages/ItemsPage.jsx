import React, { useEffect, useState } from 'react';
import { getItems } from '../api/api';
import ItemCard from '../components/ItemCard';

function ItemsPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItems()
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load items:', err);
        setError('Failed to load items.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading items...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Items</h1>
      {items.length === 0 ? (
        <p>No items available.</p>
      ) : (
        items.map(item => <ItemCard key={item.id} item={item} />)
      )}
    </div>
  );
}

export default ItemsPage;
