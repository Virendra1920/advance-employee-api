# 🚀 Enterprise Employee Management API

A production-ready RESTful API built to handle employee data securely and efficiently. This project demonstrates advanced backend architecture, MongoDB aggregation, strict data validation, and robust security measures.

## ✨ Enterprise Features
- **HR Analytics Dashboard:** Uses MongoDB Aggregation Pipeline to generate real-time stats (employee count, average age, etc.) grouped by departments.
- **Smart Search & Pagination:** Optimized data fetching using limit, skip, and regex-based search for scalable performance.
- **Advanced Security:** 
  - `Helmet.js` to secure HTTP headers and hide backend tech stack.
  - `Express Rate Limit` to protect against DDoS attacks and brute force.
- **Strict Data Validation:** Utilizes `Zod` to catch invalid data before database interaction.
- **Duplicate Prevention:** Automatically blocks duplicate email entries.

## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Security:** Helmet, Express-Rate-Limit
- **Validation:** Zod

## 🚀 Core API Endpoints

### 1. HR Analytics Dashboard (Aggregation)
- **URL:** `/api/employees/stats/hr-dashboard`
- **Method:** `GET`
- **Description:** Returns statistical data grouped by department.

### 2. Get Employees (With Pagination & Search)
- **URL:** `/api/employees?department=IT&page=1&limit=5`
- **Method:** `GET`
- **Description:** Returns a paginated list of employees. Supports filtering by department and searching by name.

### 3. Add New Employee
- **URL:** `/api/add-employee`
- **Method:** `POST`
- **Body (JSON):** Requires name, email, phone, age, and department.

## 💻 How to Run Locally
1. Clone this repository: `git clone <your-repo-link>`
2. Install dependencies: `npm install`
3. Ensure MongoDB is running locally (`mongodb://127.0.0.1:27017/`).
4. Start the server: `node index.js`