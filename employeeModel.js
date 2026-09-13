const mongoose = require('mongoose');

// Define how the data will look inside the MongoDB database
const dbSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // unique: true prevents duplicate emails
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  department: { type: String, required: true }
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' fields

const Employee = mongoose.model('Employee', dbSchema);

module.exports = Employee;