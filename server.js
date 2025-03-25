require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDatabase = require('./admin/config/database');
const submissionRoutes = require('./admin/routes/submission');
const employeeRoutes = require('./admin/routes/employee');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDatabase();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// API Routes
app.use('/api', submissionRoutes);
app.use('/api', employeeRoutes);

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'about.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'services.html'));
});

app.get('/newsroom', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'newsroom.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'contact.html'));
});

// Admin dashboard (protected route)
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'dashboard', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});