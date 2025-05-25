import React from 'react';
import { useParams } from 'react-router-dom';

export default function ItemDetail() {
  const { id } = useParams();

  return (
    <div>
      <h1>Item Detail for ID: {id}</h1>
      {/* Add more details here */}
    </div>
  );
}
