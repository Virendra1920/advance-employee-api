/**
 * Fetches employee data from the REST API and renders it to the DOM.
 */
async function fetchAndRenderEmployees() {
    const loadingElement = document.getElementById('loading');
    const employeeListElement = document.getElementById('employee-list');

    try {
        const response = await fetch('/api/employees');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        
        // Remove loading indicator
        loadingElement.style.display = 'none';
        
        // Handle empty database scenario
        if (!result.data || result.data.length === 0) {
            employeeListElement.innerHTML = '<p class="error-state">No employee records found in the database.</p>';
            return;
        }

        // Map data array to HTML strings
        const htmlContent = result.data.map(emp => `
            <article class="card">
                <div class="name">
                    🧑‍💼 ${emp.name} 
                    <span class="tag">${emp.department}</span>
                </div>
                <div class="detail">📧 <b>Email:</b> ${emp.email}</div>
                <div class="detail">📞 <b>Phone:</b> ${emp.phone}</div>
                <div class="detail">🎂 <b>Age:</b> ${emp.age} Years</div>
            </article>
        `).join('');

        employeeListElement.innerHTML = htmlContent;

    } catch (error) {
        console.error("Data Fetching Error:", error);
        loadingElement.style.display = 'none';
        employeeListElement.innerHTML = '<p class="error-state">❌ Failed to load data. Please check your connection and refresh the page.</p>';
    }
}

document.addEventListener('DOMContentLoaded', fetchAndRenderEmployees);