/*
Top nav with logo and site name
Navigation links (Home, Menu, About, Order)
*/
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isGuest = !user;
  const isCustomer = user?.role === 'customer';
  const isAdmin = user?.role === 'admin';

  const handleOrderClick = () => {
    navigate('/order');
  };

 return (
    <header className="bg-white shadow-md">
      {/* Left Section: Logo + Main Links */}
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex space-x-6 items-center">
        <Link to="/" className="text-xl font-bold text-stone-800">Moon Rock Cafe</Link>
        <Link to="/" className="text-lg text-gray-700 hover:text-stone-600">Home</Link>
        <Link to="/menu" className="text-lg text-gray-700 hover:text-stone-600">Menu</Link>
        </div>

      {/* Right Section */}
      <div className="flex flex-col items-end space-y-2 text-right">
        {/* Top Row: Auth or Admin */}
        <div className="flex space-x-4 text-sm">
          {isGuest && (
            <>
              <Link to="/login" className="text-gray-700 hover:underline">Login</Link>
              <Link to="/register" className="text-gray-700 hover:underline">Sign Up</Link>
            </>
          )}

          {isCustomer && (
            <>
              <span className="text-gray-600">Hello, {user.username}!</span>
              <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin" className="text-red-700 font-semibold hover:underline">Admin Panel</Link>
              <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
            </>
          )}
        </div>

        {/* Bottom Row: Order + Search */}
        <div className="flex space-x-4 items-center">
          <button
            onClick={handleOrderClick}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-full text-sm font-medium"
          >
            Order
          </button>

          <input
            type="text"
            placeholder="Search menu..."
            arial-label="Search menu"
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:ring-yellow-400"
          />
        </div>
      </div>
      </nav>
    </header>
  );
};

export default Header;
