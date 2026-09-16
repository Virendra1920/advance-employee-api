// DOM Elements
const tableBody = document.getElementById('employee-list');
const modalOverlay = document.getElementById('modal-overlay');
const loginForm = document.getElementById('login-form');
const employeeForm = document.getElementById('employee-form');
const modalTitle = document.getElementById('modal-title');
const submitBtn = document.getElementById('submit-btn');

const searchInput = document.getElementById('search-input');
const filterDept = document.getElementById('filter-dept');
const exportBtn = document.getElementById('export-btn');

// Pagination Elements
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');

// Global Variables
let currentPage = 1;
let totalPages = 1;
let allEmployees = []; // For export functionality

// --- NEW SMART FETCH WITH PAGINATION & SEARCH ---
async function fetchAndRenderEmployees() {
    const searchTerm = searchInput.value;
    const dept = filterDept.value;
    
    // API URL तैयार करें (page और limit के साथ)
    let url = `/api/employees?page=${currentPage}&limit=5`;
    if (searchTerm) url += `&search=${searchTerm}`;
    if (dept !== 'All') url += `&department=${dept}`;

    try {
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.status === "Success") {
            allEmployees = result.data;
            renderTable(result.data);
            
            // Pagination अपडेट करें
            totalPages = result.totalPages || 1;
            pageInfo.innerText = `Showing page ${result.currentPage} of ${totalPages} (Total Records: ${result.totalRecords})`;
            
            // Buttons चालू/बंद करें
            prevBtn.disabled = currentPage === 1;
            prevBtn.style.opacity = currentPage === 1 ? '0.5' : '1';
            
            nextBtn.disabled = currentPage === totalPages || totalPages === 0;
            nextBtn.style.opacity = (currentPage === totalPages || totalPages === 0) ? '0.5' : '1';
        } else {
            renderTable([]);
        }
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="5" class="state-message" style="color:red;">Failed to load data.</td></tr>`;
    }
}

// Pagination Event Listeners
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchAndRenderEmployees();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchAndRenderEmployees();
    }
});

// Search & Filter Listeners (जब भी सर्च करें, पेज 1 पर वापस आ जाएँ)
searchInput.addEventListener('input', () => { currentPage = 1; fetchAndRenderEmployees(); });
filterDept.addEventListener('change', () => { currentPage = 1; fetchAndRenderEmployees(); });

// Render Table Function (Remains exactly the same)
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
                <button class="btn-icon edit-btn" title="Edit Record" data-id="${emp._id}">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button class="btn-icon delete-btn" title="Delete Record" data-id="${emp._id}">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </td>
        </tr>
    `).join('');
}

// Note: Ensure your old Export to CSV, and Modal code remains below this...

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
    const deleteBtn = e.target.closest('.delete-btn');

    if (editBtn) {
        const id = editBtn.dataset.id;
        const employee = allEmployees.find(emp => emp._id === id);

        if (employee) {
            document.getElementById('edit-emp-id').value = employee._id;
            document.getElementById('emp-name').value = employee.name;
            document.getElementById('emp-email').value = employee.email;
            document.getElementById('emp-phone').value = employee.phone;
            document.getElementById('emp-age').value = employee.age;
            document.getElementById('emp-dept').value = employee.department;

            modalTitle.innerText = 'Update Employee Data';
            submitBtn.innerText = 'Update Record';
            employeeForm.style.display = 'block';
            loginForm.style.display = 'none';
            modalOverlay.style.display = 'flex';
        }
    }

    if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        if (confirm('Are you sure you want to move this record to trash?')) {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                alert('Session expired or unauthorized.');
                return;
            }

            try {
                const response = await fetch(`/api/delete-employee/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                
                if (result.status === "Success") {
                    fetchAndRenderEmployees();
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Delete error:', error);
            }
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