// script.js - Contains JavaScript logic

// Dummy user data
const users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', status: 'Inactive' },
    { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', status: 'Active' },
    { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', status: 'Pending' },
    { id: 5, name: 'Bob Williams', email: 'bob.williams@example.com', status: 'Active' }
];

// Function to populate the user list table
function populateUserList() {
    const tableBody = document.getElementById('userListTableBody');

    if (!tableBody) {
        console.error('User list table body not found.');
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.status}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Check if we are on the user list page and populate the table
if (window.location.pathname.includes('/preview/user_list.html')) {
    populateUserList();
}
