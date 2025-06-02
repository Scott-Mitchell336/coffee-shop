import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ShoppingCartIcon } from "@heroicons/react/24/outline"; // Ensure you have installed @heroicons/react package npm install @heroicons/react

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("Header rendered with user:", user);
  }, [user]);

  return (
    <nav className="w-full border-b border-gray-200 bg-white shadow-lg py-5 px-6">
      <ul className="flex items-center justify-between text-med font-medium">
        {/* Left Navigation Links */}
        <div className="flex items-center space-x-12">
          <li>
            <Link
              to="/"
              className="text-blue-500 hover:text-blue-600 font-bold"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/menu"
              className="text-blue-500 hover:text-blue-600 font-bold"
            >
              Menu
            </Link>
          </li>
        </div>

        {/* Center Logo Placeholder */}
        <div className="flex-1 text-center">
          {/* Replace the src with your actual logo URL */}
          <p className="text-2xl font-bold text-gray-800">
            Moon Rock Cafe
          </p>
          <img
            src="https://via.placeholder.com/100x40?text=Logo"
            alt="Logo"
            className="mx-auto h-10 object-contain"
          />
        </div>

        {/* Right User Section */}
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <li className="text-blue-500 font-bold">
                Hello, {user.username}!
              </li>
              <li>
                <button
                  onClick={logout}
                  className="bg-blue-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="text-blue-500 hover:text-blue-600 font-bold"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-blue-500 hover:text-blue-600 font-bold"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
          <li>
            <Link
              to="/order"
              className="text-blue-500 hover:text-blue-600 font-bold"
            >
              Order
            </Link>
          </li>
          <li>
            <Link to="/cart" className="text-blue-500 hover:text-blue-600">
              <ShoppingCartIcon className="h-6 w-6" />
            </Link>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Header;
