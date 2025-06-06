import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("Header rendered with user:", user);
  }, [user]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm(""); // Clear search input after submission
    }
    console.log("Search for:", searchTerm);
  };

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

        {/* Center Logo */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex items-center space-x-3">
            <p className="text-2xl font-bold text-gray-800">Moon Rock Cafe</p>
            <img
              src="https://cdn.vectorstock.com/i/2000v/07/96/dark-alien-landscape-vector-52000796.avif"
              alt="Moon Rock Cafe Logo"
              className="h-10 object-contain"
            />
          </div>
        </div>

        {/* Right User Section with Search */}
        <div className="flex items-center space-x-8">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="border border-gray-200 rounded px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
              aria-label="Search">
                Search
              </button>
          </form>

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


// Header component for a cafe website, including navigation links, user authentication status, and a search bar.
// Uses React Router for navigation and includes a shopping cart icon from Heroicons.
// Styled with Tailwind CSS.
// Handles user login/logout and displays a welcome message with the user's name if logged in.
// Header is responsive and adapts to different screen sizes, ensuring a good user experience across devices.
// Uses the useAuth context to access user authentication state and actions.
// Designed to be reusable across different pages of the application, providing a consistent navigation experience.
// Structured to be easily maintainable and extendable, allowing for future enhancements like additional navigation links or user profile features.
// Serves as the navigation bar for the entire website.
// Includes links to the home page, menu, and user authentication actions (login/logout).
// Search bar for users to search for menu items.        