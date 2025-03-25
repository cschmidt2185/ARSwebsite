require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('../admin/database/models/Employee');
const connectDatabase = require('../admin/config/database');

// Admin details - change these as needed
const adminData = {
  name: 'Admin User',
  email: 'admin@arservices.com',
  password: 'securePassword123',
  role: 'admin'
};

const createAdmin = async () => {
  try {
    await connectDatabase();
    
    // Check if admin already exists
    const existingAdmin = await Employee.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return mongoose.disconnect();
    }
    
    // Create new admin
    const admin = new Employee(adminData);
    await admin.save();
    
    console.log('Admin user created successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    mongoose.disconnect();
  }
};

createAdmin();