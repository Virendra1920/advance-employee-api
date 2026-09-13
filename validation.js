const { z } = require('zod');

// Strict schema rules for database entry
const employeeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email format. Please provide a valid email address"),
  phone: z.string().length(10, "Phone number must be exactly 10 digits"),
  age: z.number().min(18, "Age must be at least 18").max(60, "Age cannot exceed 60"),
  department: z.enum(["IT", "HR", "Sales"], { 
    errorMap: () => ({ message: "Department must be strictly IT, HR, or Sales" }) 
  })
});

module.exports = { employeeSchema };