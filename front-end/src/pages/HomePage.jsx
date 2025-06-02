import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const featuredItems = [
    { id: 1, name: 'Latte', description: 'Creamy espresso blend', price: '$4.50' },
    { id: 2, name: 'Iced Matcha', description: 'Chilled green tea with oat milk', price: '$5.00' },
    { id: 3, name: 'Blueberry Muffin', description: 'Freshly baked daily', price: '$3.00' },
    { id: 4, name: 'Cappuccino', description: 'Bold espresso with frothed milk', price: '$4.25' },
    { id: 5, name: 'Chai Latte', description: 'Spiced tea with steamed milk', price: '$4.75' },
    { id: 6, name: 'Almond Croissant', description: 'Flaky pastry with almond cream', price: '$3.75' },
  ];

  return (
    <div className="flex flex-col">

      {/* Hero Section */}
      <div
        className="relative w-full h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url('https://via.placeholder.com/1600x600?text=Coffee+Shop+Background')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <h1 className="relative text-white text-5xl font-bold z-10 text-center">Welcome to Moon Rock Café</h1>
      </div>

      {/* Featured Items */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Featured Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <Link
              to={`/menu/${item.id}`}
              key={item.id}
              className="transform transition duration-300 hover:scale-105"
            >
              <div className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-blue-300 hover:shadow-2xl p-6 h-full flex flex-col justify-between">
                <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 mt-2 flex-grow">{item.description}</p>
                <div className="mt-4 text-right font-bold text-blue-500">{item.price}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/menu"
            className="inline-block bg-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow hover:bg-blue-600 transition duration-300"
          >
            Browse Full Menu
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
