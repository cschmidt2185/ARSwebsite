const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['admin', 'employee'],
    default: 'employee'
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
EmployeeSchema.pre('save', async function(next) {
  const employee = this;
  if (employee.isModified('password')) {
    employee.password = await bcrypt.hash(employee.password, 8);
  }
  next();
});

// Generate auth token method
EmployeeSchema.methods.generateAuthToken = async function() {
  const employee = this;
  const token = jwt.sign({ _id: employee._id.toString() }, process.env.JWT_SECRET);
  
  employee.tokens = employee.tokens.concat({ token });
  await employee.save();
  
  return token;
};

// Login method
EmployeeSchema.statics.findByCredentials = async (email, password) => {
  const employee = await Employee.findOne({ email });
  
  if (!employee) {
    throw new Error('Invalid login credentials');
  }
  
  const isMatch = await bcrypt.compare(password, employee.password);
  
  if (!isMatch) {
    throw new Error('Invalid login credentials');
  }
  
  return employee;
};

// Remove sensitive data when returning employee object
EmployeeSchema.methods.toJSON = function() {
  const employee = this;
  const employeeObject = employee.toObject();
  
  delete employeeObject.password;
  delete employeeObject.tokens;
  
  return employeeObject;
};

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;