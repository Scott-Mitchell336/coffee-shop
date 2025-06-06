/*Displays an item (e.g., coffee drink, pastry) with:
Image
Name
Description
*/

import React from 'react';

function ItemCard({ item }) {
  return (
    <div className="item-card" style={styles.card}>
      <h2>{item.name}</h2>
      <p>{item.description}</p>
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full max-h-64 object-cover rounded-md mb-4"
        />  
      )}
      <p><strong>Price: </strong>${item.price.toFixed(2)}</p>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #ccc',
    padding: '1rem',
    marginBottom: '1rem',
    borderRadius: '8px',
  },
};

export default ItemCard;
