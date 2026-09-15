/**
 * Enterprise Dashboard Controller
 */

// DOM Elements
const tableBody = document.getElementById('employee-list');
const modalOverlay = document.getElementById('modal-overlay');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const loginForm = document.getElementById('login-form');
const addEmployeeForm = document.getElementById('add-employee-form');
const modalTitle = document.getElementById('modal-title');
const loginError = document.getElementById('login-error');

// Fetch and Render Table Data
async function fetchAndRenderEmployees() {
    try {
        const response = await fetch('/api/employees');
        const result = await response.json();
        
        if (!result.data || result.data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" class="state-message">No employee records found.</td></tr>`;
            return;
        }

        tableBody.innerHTML = result.data.map(emp => `
            <tr>
                <td>
                    <span class="emp-name">${emp.name}</span>
                    <span class="emp-subtext">ID: ${emp._id.substring(0, 8)}</span>
                </td>
                <td>
                    <span class="emp-name">${emp.email}</span>
                    <span class="emp-subtext">${emp.phone}</span>
                </td>
                <td><span class="department-tag">${emp.department}</span></td>
                <td>
                    <span class="emp-name">${emp.age}</span>
                    <span class="emp-subtext">Years</span>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="4" class="state-message" style="color:red;">Failed to load data.</td></tr>`;
    }
}

// Modal Logic
openModalBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
    // Check if user already has a token
    const token = localStorage.getItem('adminToken');
    if (token) {
        showEmployeeForm();
    } else {
        showLoginForm();
    }
});

closeModalBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
});

function showLoginForm() {
    loginForm.style.display = 'block';
    addEmployeeForm.style.display = 'none';
    modalTitle.innerText = 'Admin Access';
}

function showEmployeeForm() {
    loginForm.style.display = 'none';
    addEmployeeForm.style.display = 'block';
    modalTitle.innerText = 'Add New Employee';
}

// Handle Login Form Submit
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.token) {
            localStorage.setItem('adminToken', data.token); // Save token securely
            showEmployeeForm();
        } else {
            loginError.style.display = 'block';
            loginError.innerText = data.message || 'Invalid credentials';
        }
    } catch (error) {
        console.error("Login failed", error);
    }
});

// Handle Add Employee Form Submit
addEmployeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    const payload = {
        name: document.getElementById('emp-name').value,
        email: document.getElementById('emp-email').value,
        phone: document.getElementById('emp-phone').value,
        age: Number(document.getElementById('emp-age').value),
        department: document.getElementById('emp-dept').value
    };

    try {
        const response = await fetch('/api/add-employee', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Sending the secret key
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Employee added successfully!");
            addEmployeeForm.reset();
            modalOverlay.style.display = 'none';
            fetchAndRenderEmployees(); // Refresh table instantly
        } else if (response.status === 401 || response.status === 403) {
            alert("Session expired. Please login again.");
            localStorage.removeItem('adminToken');
            showLoginForm();
        } else {
            alert("Error adding employee. Check details.");
        }
    } catch (error) {
        console.error("Submission error", error);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', fetchAndRenderEmployees);