import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import PrivateRoute from "./components/PrivateRoute";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ItemsPage from "./pages/ItemsPage";
import AddMenuItemPage from "./pages/AddMenuItemPage";
import EditMenuItemPage from "./pages/EditMenuItemPage";
import ItemDetail from "./pages/ItemDetail";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
      <AuthProvider>
        <CartProvider>
          <div>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<ItemsPage />} />
              <Route
                path="/menu/add"
                element={
                  <PrivateRoute requiredRole="administrator">
                    <AddMenuItemPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/menu/edit/:id"
                element={
                  <PrivateRoute requiredRole="administrator">
                    <EditMenuItemPage />
                  </PrivateRoute>
                }
              />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
  );
}

export default App;
