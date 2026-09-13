# 🚀 Advanced Employee Management API

A production-ready RESTful API built to handle employee data securely and efficiently. This project demonstrates backend architecture, strict data validation, and seamless database integration.

## ✨ Key Features
- **Strict Data Validation:** Utilizes `Zod` to catch invalid data (e.g., wrong emails, invalid age) before it hits the database.
- **Clean Error Handling:** Returns user-friendly, pinpointed error messages for front-end developers.
- **Database Integration:** Permanent and secure data storage using MongoDB and Mongoose.
- **Duplicate Prevention:** Automatically blocks duplicate email entries.

## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Validation:** Zod

## 🚀 API Endpoints

### 1. Add New Employee
- **URL:** `/api/add-employee`
- **Method:** `POST`
- **Body (JSON):**
json
{
"name": "Rahul Sharma",
"email": "rahul@example.com",
"phone": "9876543210",
"age": 28,
"department": "IT"
}
- **Success Response (201):** Returns the saved user object.
- **Error Response (400):** Returns exact validation errors (e.g., "Age must be at least 18").

### 2. Get All Employees
- **URL:** `/api/employees`
- **Method:** `GET`
- **Success Response (200):** Returns an array of all employees from the database.

## 💻 How to Run Locally
1. Clone this repository: `git clone <your-repo-link>`
2. Install dependencies: `npm install`
3. Ensure MongoDB is running on your local machine (`mongodb://127.0.0.1:27017/`).
4. Start the server: `node index.js`
5. The API will be available at `http://localhost:3000`