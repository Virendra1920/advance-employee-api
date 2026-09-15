const express = require('express');
const { z } = require('zod');
const mongoose = require('mongoose'); //
const connectDB = require('./db');
const Employee = require('./employeeModel');
const { employeeSchema } = require('./validation');
// Enterprise Level Validation for Update (Optional fields)
const updateEmployeeSchema = z.object({
  name: z.string().min(3, "Name is too short").optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().length(10, "Phone must be 10 digits").optional(),
  age: z.number().min(18).max(65).optional(),
  department: z.string().optional()
});
const { validateData } = require('./middleware');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());
// 1. Add Security Headers to hide backend architecture
app.use(helmet());

// 2. Prevent DDOS Attacks (Rate Limiting)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: {
    status: "Fail",
    message: "Too many requests from this IP. Security system activated. Please try again after 15 minutes."
  }
});

// Apply this strict security rule to all API routes
app.use('/api/', apiLimiter);

// Connect to MongoDB database
connectDB();

// ----------------------------------------------------
// 1. POST API: Add New Employee (Your existing code)
// ----------------------------------------------------
app.post('/api/add-employee', validateData(employeeSchema), async (req, res) => {
  try {
    const existingUser = await Employee.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({
        status: "Fail",
        message: "This email is already registered in our database."
      });
    }

    const newEmployee = new Employee(req.body);
    await newEmployee.save();

    res.status(201).json({
      status: "Success",
      message: "Data successfully validated and permanently saved to database!",
      data: newEmployee
    });

  } catch (error) {
    res.status(500).json({ status: "Fail", message: "Internal Server Error", error: error.message });
  }
});

// ----------------------------------------------------
// 2. GET API: Smart Search, Filtering & Pagination (NEW ADVANCED)
// ----------------------------------------------------
app.get('/api/employees', async (req, res) => {
  try {
    const { department, search, page = 1, limit = 5 } = req.query;
    let query = {};

    if (department) query.department = department;
    if (search) query.name = { $regex: search, $options: "i" }; 

    const skip = (page - 1) * limit;
    
    const employees = await Employee.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await Employee.countDocuments(query);

    res.status(200).json({
      status: "Success",
      message: "Data fetched with advanced filters!",
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      data: employees
    });

  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
});

// ----------------------------------------------------
// 3. GET API: HR Analytics Dashboard (NEW ENTERPRISE FEATURE)
// ----------------------------------------------------
app.get('/api/employees/stats/hr-dashboard', async (req, res) => {
  try {
    const stats = await Employee.aggregate([
      {
        $group: {
          _id: "$department",
          totalEmployees: { $sum: 1 },
          averageAge: { $avg: "$age" },
          minAge: { $min: "$age" },
          maxAge: { $max: "$age" }
        }
      },
      { $sort: { totalEmployees: -1 } }
    ]);

    res.status(200).json({
      status: "Success",
      message: "HR Analytics generated successfully!",
      totalDepartments: stats.length,
      data: stats
    });

  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
});

// ----------------------------------------------------
// 5. UPDATE Employee (PUT) - Senior Level Implementation
// ----------------------------------------------------
app.put('/api/update-employee/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Security Check 1: Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "Error", message: "Invalid Employee ID format" });
    }

    // Security Check 2: Validate incoming data
    const validation = updateEmployeeSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ status: "Error", errors: validation.error.errors });
    }

    // Database Operation: Update only provided fields
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { $set: req.body }, 
      { new: true, runValidators: true } // Return the updated document, not the old one
    );

    if (!updatedEmployee) {
      return res.status(404).json({ status: "Error", message: "Employee not found in Database" });
    }

    res.status(200).json({
      status: "Success",
      message: "Employee updated successfully",
      data: updatedEmployee
    });
  } catch (error) {
    // Handle Duplicate Email error during update
    if (error.code === 11000) {
      return res.status(400).json({ status: "Error", message: "This Email already belongs to another employee" });
    }
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
});

// ----------------------------------------------------
// 6. DELETE Employee (DELETE) - Senior Level Implementation
// ----------------------------------------------------
app.delete('/api/delete-employee/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: "Error", message: "Invalid Employee ID format" });
    }

    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ status: "Error", message: "Employee not found in Database" });
    }

    res.status(200).json({
      status: "Success",
      message: `Record for ${deletedEmployee.name} has been permanently deleted.`
    });
  } catch (error) {
    res.status(500).json({ status: "Error", message: "Internal Server Error" });
  }
});

// ----------------------------------------------------
// 4. Default Route for Vercel (Homepage)
// ----------------------------------------------------
app.get('/', (req, res) => {
  res.status(200).send("Welcome to Enterprise Employee API! The server is running perfectly on Vercel.");
});

// Start the Server (Local)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Advanced API Server is running on port ${PORT}`);
});

// CRITICAL: Export the app for Vercel Serverless Function
module.exports = app;