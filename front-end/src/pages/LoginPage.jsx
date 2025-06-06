import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import Footer from "../components/Footer";

function LoginPage() {
  const { login, loading, setUser } = useAuth();
  const navigate = useNavigate();
  //const { useCart } = useCart();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  // Get the cart context with a null check
  const cart = useCart();
  //const transferGuestCartToUser = cart?.transferGuestCartToUser;

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    console.log("handleSubmit called");

    try {
      const data = await login(credentials);
      console.log("data = ", data);

      // Transfer any guest cart to the user's account
      //await transferGuestCartToUser();

      console.log("naviagting to /menu");
      navigate("/menu");
    } catch (err) {
      setFormError("Invalid username or password");
      console.error("Login error:", err);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-23 bg-white p-8 rounded-lg shadow-md">
        <div className="max-w-md w-full space-y-10 bg-white p-8 shadow-lg rounded-xl">
          <div>
            <h2 className="mt-2 text-center text-2xl font-extrabold text-gray-900">
              Login to your account
            </h2>
          </div>

          {formError && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
              {formError}
            </div>
          )}

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={credentials.username}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          <div className="text-center text-sm text-gray-600">
            Need an account.{" "}
            <Link
              to="/register"
              className="text-blue-500 hover:text-blue-600 font-semibold"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <Footer />{" "}
    </>
  );
}

export default LoginPage;

// LoginPage component for a React application.
// Includes a form for users to log in with their username and password.
// Component uses the useAuth context to handle authentication and the useCart context to manage the shopping cart.
// Includes error handling for invalid login attempts and a link to the registration page.
// Styled with Tailwind CSS.