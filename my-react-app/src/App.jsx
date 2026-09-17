import { useState, useEffect } from 'react';

// 1. Employee Card Component (Updated to match your MongoDB fields)
function EmployeeCard({ name, email, department, phone, profileImage }) {
  // Use a default avatar if profileImage is empty or undefined
  const avatarUrl = profileImage ? profileImage : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

  return (
    <div style={{ 
      border: '1px solid #e2e8f0', 
      padding: '20px', 
      margin: '15px', 
      borderRadius: '10px',
      width: '280px',
      display: 'inline-block',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      textAlign: 'center',
      backgroundColor: 'white'
    }}>
      <img 
        src={avatarUrl} 
        alt="Profile" 
        style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '15px', border: '3px solid #f8fafc' }} 
      />
      <h3 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>{name}</h3>
      <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '14px' }}>📧 {email}</p>
      <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '14px' }}>📞 {phone}</p>
      <span style={{ backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
        {department}
      </span>
    </div>
  );
}

// 2. Main App Component
function App() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // IMPORTANT: Replace this URL with your actual Vercel API link for fetching employees
    // Example: 'https://your-app-name.vercel.app/api/employees'
    const API_URL = 'https://advance-employee-api.vercel.app/api/employees'; 
    
    // If your API requires the admin token, we get it from localStorage
    const token = localStorage.getItem('adminToken');

    fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Uncomment the line below if your API uses verifyToken middleware
        // 'Authorization': `Bearer ${token}` 
      }
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch data');
        return response.json();
      })
      .then(data => {
        // Assuming your API returns { status: "Success", data: [...] }
        // Adjust this depending on how your Node.js API sends the array
        const employeeArray = data.data || data; 
        setEmployees(employeeArray);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setError('Could not load data from database. Check your API link.');
        setIsLoading(false);
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', padding: '40px', minHeight: '100vh' }}>
      <h2>My Real HR Database 🚀</h2>
      
      {isLoading && <h3 style={{ color: '#f59e0b' }}>Loading real data from MongoDB... ⏳</h3>}
      {error && <h3 style={{ color: '#ef4444' }}>{error}</h3>}
      
      {!isLoading && !error && employees.length === 0 && (
        <h3 style={{ color: '#64748b' }}>No employees found in the database.</h3>
      )}

      {/* Render the actual database records */}
      {!isLoading && !error && employees.length > 0 && (
        employees.map((emp) => (
          <EmployeeCard 
              key={emp._id} 
              name={emp.name} 
              email={emp.email} 
              phone={emp.phone}
              department={emp.department}
              profileImage={emp.profileImage}
          />
        ))
      )}
      
    </div>
  );
}

export default App;