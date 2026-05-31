const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Test Route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend API is running!' });
});

module.exports = app;