/*
Top nav with logo and site name
Navigation links (Home, Menu, About, Order)
*/
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/menu">Menu</Link></li>
        <li><Link to="/order">Order</Link></li>
      </ul>
    </nav>
  );
};

export default Header;