import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import ItemsPage from './pages/ItemsPage'; // aka Menu
import AddMenuItemPage from './pages/AddMenuItemPage';
import EditMenuItemPage from './pages/EditMenuItemPage';
import ItemDetail from './pages/ItemDetail'; // you missed importing this
import CartPage from './pages/CartPage'; 
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage';

function App() {

  const [user, setUser] = useState(null);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<ItemsPage user={user} />} />
        <Route path="/menu/add" element={<AddMenuItemPage />} />  
        <Route path="/menu/edit/:id" element={<EditMenuItemPage />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/cart" element={<CartPage />} /> 
        <Route path="/login" element={<LoginPage user={user} setUser={setUser}/>} /> 
        <Route path="/signup" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;
