/**
 * Enterprise Dashboard Controller
 * Fetches employee data from REST API and renders it into a professional Data Table.
 */
async function fetchAndRenderEmployees() {
    const tableBody = document.getElementById('employee-list');

    try {
        const response = await fetch('/api/employees');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        
        // Handle empty database scenario
        if (!result.data || result.data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="state-message">
                        No employee records found in the database.
                    </td>
                </tr>`;
            return;
        }

        // Render data into table rows
        const htmlContent = result.data.map(emp => `
            <tr>
                <td>
                    <span class="emp-name">${emp.name}</span>
                    <span class="emp-subtext">ID: ${emp._id.substring(0, 8)}...</span>
                </td>
                <td>
                    <span class="emp-name">${emp.email}</span>
                    <span class="emp-subtext">${emp.phone}</span>
                </td>
                <td>
                    <span class="department-tag">${emp.department}</span>
                </td>
                <td>
                    <span class="emp-name">${emp.age}</span>
                    <span class="emp-subtext">Years</span>
                </td>
            </tr>
        `).join('');

        tableBody.innerHTML = htmlContent;

    } catch (error) {
        console.error("Data Fetching Error:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="state-message error-text">
                    Failed to load data. Please check your connection or server status.
                </td>
            </tr>`;
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', fetchAndRenderEmployees);