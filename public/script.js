// DOM Elements
const tableBody = document.getElementById('employee-list');
const modalOverlay = document.getElementById('modal-overlay');
const loginForm = document.getElementById('login-form');
const employeeForm = document.getElementById('employee-form');
const modalTitle = document.getElementById('modal-title');
const submitBtn = document.getElementById('submit-btn');

// New Elements for Search & Export
const searchInput = document.getElementById('search-input');
const filterDept = document.getElementById('filter-dept');
const exportBtn = document.getElementById('export-btn');

// Global Array to store fetched data for fast searching
let allEmployees = [];

// Fetch Data from Server
async function fetchAndRenderEmployees() {
    try {
        const response = await fetch('/api/employees');
        const result = await response.json();
        
        if (result.data) {
            allEmployees = result.data; // Store data globally
            renderTable(allEmployees);  // Display data
        } else {
            renderTable([]);
        }
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="5" class="state-message" style="color:red;">Failed to load data from Server.</td></tr>`;
    }
}

// Render Table Function
function renderTable(data) {
    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="state-message">No matching employee records found.</td></tr>`;
        return;
    }

    tableBody.innerHTML = data.map(emp => `
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
                <button class="btn-icon edit-btn" title="Edit Record" 
                    data-id="${emp._id}" data-name="${emp.name}" data-email="${emp.email}" 
                    data-phone="${emp.phone}" data-age="${emp.age}" data-dept="${emp.department}">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button class="btn-icon delete-btn" title="Delete Record" data-id="${emp._id}">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </td>
        </tr>
    `).join('');
}

// --- NEW FEATURE 1: Live Search & Filter Logic ---
function handleSearchAndFilter() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedDept = filterDept.value;

    const filteredData = allEmployees.filter(emp => {
        const matchesNameOrEmail = emp.name.toLowerCase().includes(searchTerm) || emp.email.toLowerCase().includes(searchTerm);
        const matchesDept = selectedDept === 'All' || emp.department.toLowerCase() === selectedDept.toLowerCase();
        
        return matchesNameOrEmail && matchesDept;
    });

    renderTable(filteredData);
}

// Attach Event Listeners to Search and Dropdown
searchInput.addEventListener('input', handleSearchAndFilter);
filterDept.addEventListener('change', handleSearchAndFilter);

// --- NEW FEATURE 2: Export to CSV (Excel) ---
exportBtn.addEventListener('click', () => {
    if (allEmployees.length === 0) {
        alert("No data available to export!");
        return;
    }

    // 1. Create CSV Headers
    const headers = ["Employee ID", "Full Name", "Email Address", "Phone Number", "Age", "Department"];
    const csvRows = [headers.join(",")];

    // 2. Add Data Rows
    allEmployees.forEach(emp => {
        const row = [emp._id, emp.name, emp.email, emp.phone, emp.age, emp.department];
        csvRows.push(row.join(","));
    });

    // 3. Create a Blob (File) and Download it
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    
    downloadLink.setAttribute("hidden", "");
    downloadLink.setAttribute("href", url);
    downloadLink.setAttribute("download", "Enterprise_Employee_Report.csv");
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});

// Event Delegation for Edit & Delete buttons (Remains exactly the same)
tableBody.addEventListener('click', async (e) => {
    const editBtn = e.target.closest('.edit-btn');
    if (editBtn) {
        if (!localStorage.getItem('adminToken')) {
            alert("Please login first by clicking 'Add Employee'");
            return;
        }
        modalOverlay.style.display = 'flex';
        showEmployeeForm("Update Employee Data", "Update Record");
        
        document.getElementById('edit-emp-id').value = editBtn.dataset.id;
        document.getElementById('emp-name').value = editBtn.dataset.name;
        document.getElementById('emp-email').value = editBtn.dataset.email;
        document.getElementById('emp-phone').value = editBtn.dataset.phone;
        document.getElementById('emp-age').value = editBtn.dataset.age;
        document.getElementById('emp-dept').value = editBtn.dataset.dept;
    }

    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            alert("Admin Access Required. Please login first.");
            return;
        }
        
        const id = deleteBtn.dataset.id;
        if (confirm("Are you sure you want to permanently delete this record?")) {
            try {
                const response = await fetch(`/api/delete-employee/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) fetchAndRenderEmployees();
                else alert("Session expired or unauthorized.");
            } catch (error) { console.error("Delete error", error); }
        }
    }
});

// Form and Auth Modal Handlers (Remains exactly the same)
document.getElementById('open-modal-btn').addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
    employeeForm.reset();
    document.getElementById('edit-emp-id').value = '';
    
    if (localStorage.getItem('adminToken')) showEmployeeForm("Add New Employee", "Save Record");
    else showLoginForm();
});

document.getElementById('close-modal-btn').addEventListener('click', () => modalOverlay.style.display = 'none');

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
        } else alert(data.message || 'Invalid credentials');
    } catch (error) { console.error("Login Error", error); }
});

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

    const endpoint = empId ? `/api/update-employee/${empId}` : '/api/add-employee';
    const method = empId ? 'PUT' : 'POST';

    try {
        const response = await fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            modalOverlay.style.display = 'none';
            fetchAndRenderEmployees();
        } else alert("Operation failed. Check if email already exists or session expired.");
    } catch (error) { console.error("Submission error", error); }
});

// Initialize App
document.addEventListener('DOMContentLoaded', fetchAndRenderEmployees);