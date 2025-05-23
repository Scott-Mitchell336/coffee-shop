
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const itemsRoutes = require('./routes/items');
const cartRoutes = require('./routes/cart');
const users = require('/routes/users');
const cartItemsRoutes = require('./routes/cart_items');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/users', users);
app.use('/api', cartRoutes);
app.use('/api', cartItemsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Coffee-shop API' });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// Export the app for use in index.js and for testing
module.exports = app;
