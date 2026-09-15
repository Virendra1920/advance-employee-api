// DOM Elements
const tableBody = document.getElementById('employee-list');
const modalOverlay = document.getElementById('modal-overlay');
const loginForm = document.getElementById('login-form');
const employeeForm = document.getElementById('employee-form');
const modalTitle = document.getElementById('modal-title');
const submitBtn = document.getElementById('submit-btn');

// Fetch and Render Table Data
async function fetchAndRenderEmployees() {
    try {
        const response = await fetch('/api/employees');
        const result = await response.json();
        
        if (!result.data || result.data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="state-message">No employee records found.</td></tr>`;
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
                <td class="actions-cell">
                    <button onclick="editEmployee('${emp._id}', '${emp.name}', '${emp.email}', '${emp.phone}', '${emp.age}', '${emp.department}')" class="btn-icon" title="Edit Record">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button onclick="deleteEmployee('${emp._id}')" class="btn-icon delete" title="Delete Record">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="5" class="state-message" style="color:red;">Failed to load data.</td></tr>`;
    }
}

// Check Token & Show Modal
document.getElementById('open-modal-btn').addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
    employeeForm.reset();
    document.getElementById('edit-emp-id').value = '';
    
    if (localStorage.getItem('adminToken')) {
        showEmployeeForm("Add New Employee", "Save Record");
    } else {
        showLoginForm();
    }
});

document.getElementById('close-modal-btn').addEventListener('click', () => {
    modalOverlay.style.display = 'none';
});

function showLoginForm() {
    loginForm.style.display = 'block';
    employeeForm.style.display = 'none';
    modalTitle.innerText = 'Admin Access';
}

function showEmployeeForm(title, btnText) {
    loginForm.style.display = 'none';
    employeeForm.style.display = 'block';
    modalTitle.innerText = title;
    submitBtn.innerText = btnText;
}

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
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
            localStorage.setItem('adminToken', data.token);
            showEmployeeForm("Add New Employee", "Save Record");
        } else {
            alert(data.message || 'Invalid credentials');
        }
    } catch (error) {
        console.error("Login Error", error);
    }
});

// Create or Update Employee
employeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const empId = document.getElementById('edit-emp-id').value;
    
    const payload = {
        name: document.getElementById('emp-name').value,
        email: document.getElementById('emp-email').value,
        phone: document.getElementById('emp-phone').value,
        age: Number(document.getElementById('emp-age').value),
        department: document.getElementById('emp-dept').value
    };

    // If empId exists, it's an UPDATE, else it's a CREATE
    const endpoint = empId ? `/api/update-employee/${empId}` : '/api/add-employee';
    const method = empId ? 'PUT' : 'POST';

    try {
        const response = await fetch(endpoint, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            modalOverlay.style.display = 'none';
            fetchAndRenderEmployees(); // Instant reload table
        } else if (response.status === 401 || response.status === 403) {
            alert("Session expired. Please login again.");
            localStorage.removeItem('adminToken');
            showLoginForm();
        } else {
            alert("Operation failed. Email might already exist.");
        }
    } catch (error) {
        console.error("Submission error", error);
    }
});

// Edit Button Logic
window.editEmployee = function(id, name, email, phone, age, dept) {
    if (!localStorage.getItem('adminToken')) {
        alert("Please login first by clicking 'Add Employee'");
        return;
    }
    modalOverlay.style.display = 'flex';
    showEmployeeForm("Update Employee Data", "Update Record");
    
    // Fill the form with existing data
    document.getElementById('edit-emp-id').value = id;
    document.getElementById('emp-name').value = name;
    document.getElementById('emp-email').value = email;
    document.getElementById('emp-phone').value = phone;
    document.getElementById('emp-age').value = age;
    document.getElementById('emp-dept').value = dept;
}

// Delete Button Logic
window.deleteEmployee = async function(id) {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        alert("Admin Access Required. Please login first.");
        return;
    }

    if (confirm("Are you sure you want to permanently delete this record?")) {
        try {
            const response = await fetch(`/api/delete-employee/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchAndRenderEmployees(); // Instant reload table
            } else {
                alert("Session expired or unauthorized.");
            }
        } catch (error) {
            console.error("Delete error", error);
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchAndRenderEmployees);