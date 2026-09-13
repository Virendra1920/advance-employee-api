const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const connectDB = async () => {
  try {
    // Now it uses the secure cloud link from the .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('☁️ Cloud MongoDB Connection Successful!');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;