const express = require('express');
const connectDB = require('./db');
const Employee = require('./employeeModel');
const { employeeSchema } = require('./validation');
const { validateData } = require('./middleware');

const app = express();
app.use(express.json());

// Connect to MongoDB database
connectDB();

app.post('/api/add-employee', validateData(employeeSchema), async (req, res) => {
  try {
    // 1. Check if the email already exists in the database
    const existingUser = await Employee.findOne({ email: req.body.email });
    
    if (existingUser) {
      return res.status(409).json({
        status: "Fail",
        message: "This email is already registered in our database."
      });
    }

    // 2. Create a new employee record and save it to MongoDB
    const newEmployee = new Employee(req.body);
    await newEmployee.save();

    // 3. Send success response back to the client
    res.status(201).json({
      status: "Success",
      message: "Data successfully validated and permanently saved to database!",
      data: newEmployee
    });

  } catch (error) {
    // Catch any unexpected server/database errors
    res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Advanced API Server is running on http://localhost:3000');
});