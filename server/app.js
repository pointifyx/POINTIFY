const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const agentRoutes = require('./routes/agent');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files - FIXED FOR VERCEL
app.use(express.static(path.join(__dirname, '..')));
app.use('/src', express.static(path.join(__dirname, '../src')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/agent', agentRoutes);

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../signup.html'));
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, '../app.html'));
});

app.get('/agent', (req, res) => {
  res.sendFile(path.join(__dirname, '../agent.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin.html'));
});

// SECRET ADMIN ROUTE - ADD THIS LINE
app.get('/admin-secret', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin-login.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;