import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './pages/ItemsPage';


function Home() {
  return (
    <div>
      <h1>Moon Rock Cafe</h1>
      <p><Link to="/items">View Menu Items</Link></p>
    </div>
  );
}

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> | <Link to="/items">Menu</Link> | <Link to="/items">Order</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Items />} />
      </Routes>
    </>
  );
}
