import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import ItemsPage from './pages/ItemsPage'; // aka Menu
import OrderPage from './pages/OrderPage';
import CartPage from './pages/CartPage'; 
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<ItemsPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/cart" element={<CartPage />} /> 
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/signup" element={<RegisterPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
}

export default App;
