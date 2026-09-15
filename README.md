# 🚀 Enterprise Employee Management API

A production-ready RESTful API built to handle employee data securely and efficiently. This project demonstrates advanced backend architecture, MongoDB aggregation, strict data validation, JWT authentication, and robust security measures.

## ✨ Enterprise Features
- **Full CRUD Operations:** Create, Read, Update, and Delete employee records seamlessly.
- **JWT Authentication:** Highly secure admin login system with token-based route protection.
- **Advanced Security:** `Helmet.js` for secure headers and `Express Rate Limit` to prevent DDoS attacks.
- **HR Analytics Dashboard:** Uses MongoDB Aggregation Pipeline for real-time department stats.
- **Strict Data Validation:** Utilizes `Zod` to catch invalid data before database interaction.
- **Serverless Deployment:** Fully deployed and running smoothly on **Vercel**.

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas & Mongoose
- **Security:** JSON Web Tokens (JWT), Helmet, Express-Rate-Limit
- **Validation:** Zod
- **Deployment:** Vercel

## 🔗 Live Demo
**Base URL:** `https://advance-employee-api.vercel.app` *(API is currently live)*

## 🚀 Core API Endpoints

### 🔐 Auth & Security
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/login` | Admin login to generate JWT Token | Public |

### 👥 Employee Management
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/employees` | Fetch all employees (Pagination & Search) | Public |
| `GET` | `/api/employees/stats/hr-dashboard` | Get department-wise stats | Public |
| `POST` | `/api/add-employee` | Add a new employee | **Protected** (Requires Token) |
| `PUT` | `/api/update-employee/:id` | Update existing employee | **Protected** (Requires Token) |
| `DELETE` | `/api/delete-employee/:id` | Remove an employee | **Protected** (Requires Token) |

## 💻 How to Run Locally
1. Clone this repository.
2. Install dependencies: `npm install`
3. Create a `.env` file and add your `MONGO_URI` and `JWT_SECRET`.
4. Start the server: `node index.js`