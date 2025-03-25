const express = require('express');
const Employee = require('../database/models/Employee');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Register a new employee (admin only)
router.post('/employees', authMiddleware, async (req, res) => {
  try {
    // Check if user has admin privileges
    if (req.employee.role !== 'admin') {
      return res.status(403).send({ error: 'Only admins can create new employees' });
    }
    
    const employee = new Employee(req.body);
    await employee.save();
    const token = await employee.generateAuthToken();
    
    res.status(201).send({ employee, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Login
router.post('/employees/login', async (req, res) => {
  try {
    const employee = await Employee.findByCredentials(req.body.email, req.body.password);
    const token = await employee.generateAuthToken();
    
    res.send({ employee, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Logout
router.post('/employees/logout', authMiddleware, async (req, res) => {
  try {
    req.employee.tokens = req.employee.tokens.filter((token) => {
      return token.token !== req.token;
    });
    
    await req.employee.save();
    res.send({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Logout all sessions
router.post('/employees/logoutAll', authMiddleware, async (req, res) => {
  try {
    req.employee.tokens = [];
    await req.employee.save();
    
    res.send({ message: 'Logged out from all devices successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get profile
router.get('/employees/me', authMiddleware, async (req, res) => {
  res.send(req.employee);
});

// Update profile
router.patch('/employees/me', authMiddleware, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  
  try {
    updates.forEach((update) => req.employee[update] = req.body[update]);
    await req.employee.save();
    
    res.send(req.employee);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;