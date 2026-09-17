import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

// ==========================================
// 1. Employee Card Component
// ==========================================
function EmployeeCard({ name, email, department, phone, profileImage }) {
  const avatarUrl = profileImage ? profileImage : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

  return (
    <div style={{ border: '1px solid #e2e8f0', padding: '20px', margin: '15px', borderRadius: '10px', width: '280px', display: 'inline-block', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center', backgroundColor: 'white' }}>
      <img src={avatarUrl} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '15px' }} />
      <h3 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>{name}</h3>
      <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '14px' }}>📧 {email}</p>
      <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '14px' }}>📞 {phone}</p>
      <span style={{ backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>{department}</span>
    </div>
  );
}

// ==========================================
// 2. Dashboard Page (Showing all employees)
// ==========================================
function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // आपका असली Vercel API लिंक
    fetch('https://advance-employee-api.vercel.app/api/employees')
      .then(res => res.json())
      .then(data => {
        setEmployees(data.data || data);
        setIsLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>My HR Database 🚀</h2>
      {isLoading ? <h3>Loading... ⏳</h3> : employees.map(emp => (
        <EmployeeCard key={emp._id} {...emp} />
      ))}
    </div>
  );
}

// ==========================================
// 3. Add Employee Form Page (NEW!)
// ==========================================
function AddEmployee() {
  // फॉर्म का सारा डेटा एक ही State में हैंडल हो रहा है
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', age: '', department: ''
  });

  // जैसे ही आप टाइप करेंगे, यह फंक्शन अपने आप State अपडेट करेगा
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // फॉर्म को रीलोड होने से रोकना
    
    // अभी हम सिर्फ डेटा चेक कर रहे हैं
    console.log("Form Data Ready to Send:", formData);
    alert(`Success! Data for ${formData.name} is ready. Check Console!`);
    
    // अगले स्टेप में हम इसे Vercel API पर भेजेंगे
  };

  const inputStyle = { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '16px' };

  return (
    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '400px', textAlign: 'left' }}>
        <h2 style={{ textAlign: 'center', color: '#0f172a' }}>Add New Employee</h2>
        
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={inputStyle} />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required style={inputStyle} />
          <input type="text" name="phone" placeholder="Phone Number (10 digits)" value={formData.phone} onChange={handleChange} required style={inputStyle} />
          <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required style={inputStyle} />
          
          <select name="department" value={formData.department} onChange={handleChange} required style={inputStyle}>
            <option value="" disabled>Select Department</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
          </select>

          <button type="submit" style={{ width: '100%', padding: '12px', marginTop: '20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>
            Save Employee
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 4. Main App (Navigation & Routes)
// ==========================================
function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        
        {/* Navigation Bar */}
        <nav style={{ backgroundColor: '#1e293b', padding: '20px', display: 'flex', justifyContent: 'center', gap: '30px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>Dashboard</Link>
          <Link to="/add-employee" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>+ Add Employee</Link>
        </nav>

        {/* Page Content changes based on the URL */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-employee" element={<AddEmployee />} />
        </Routes>
        
      </div>
    </BrowserRouter>
  );
}

export default App;