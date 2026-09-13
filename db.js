const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connects to local MongoDB (database name: companyDB)
    await mongoose.connect('mongodb://127.0.0.1:27017/companyDB');
    console.log('MongoDB Connection Successful!');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    process.exit(1); // Stop the server if database connection fails
  }
};

module.exports = connectDB;