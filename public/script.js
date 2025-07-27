// Data Models
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let budgets = JSON.parse(localStorage.getItem('budgets')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || [];

// DOM Elements
const expenseList = document.getElementById('expense-list');
const budgetList = document.getElementById('budget-list');
const categoryList = document.getElementById('category-list');
const addExpenseButton = document.getElementById('add-expense-button');
const addBudgetButton = document.getElementById('add-budget-button');
const addCategoryButton = document.getElementById('add-category-button');

// Helper Functions
function saveToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('budgets', JSON.stringify(budgets));
    localStorage.setItem('categories', JSON.stringify(categories));
}

function renderExpenses() {
    expenseList.innerHTML = '';
    expenses.forEach(expense => {
        const expenseItem = document.createElement('div');
        expenseItem.classList.add('expense-item');
        expenseItem.innerHTML = `
            <p><strong>Description:</strong> ${expense.description}</p>
            <p><strong>Amount:</strong> $${expense.amount}</p>
            <p><strong>Category:</strong> ${expense.category}</p>
            <p><strong>Date:</strong> ${expense.date}</p>
            <button class="edit-expense-button" data-id="${expense.id}">Edit</button>
            <button class="delete-expense-button" data-id="${expense.id}">Delete</button>
        `;
        expenseList.appendChild(expenseItem);
    });
}

function renderBudgets() {
    budgetList.innerHTML = '';
    budgets.forEach(budget => {
        const budgetItem = document.createElement('div');
        budgetItem.classList.add('budget-item');
        budgetItem.innerHTML = `
            <p><strong>Category:</strong> ${budget.category}</p>
            <p><strong>Amount:</strong> $${budget.amount}</p>
            <button class="edit-budget-button" data-id="${budget.id}">Edit</button>
            <button class="delete-budget-button" data-id="${budget.id}">Delete</button>
        `;
        budgetList.appendChild(budgetItem);
    });
}

function renderCategories() {
    categoryList.innerHTML = '';
    categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.classList.add('category-item');
        categoryItem.innerHTML = `
            <p><strong>Name:</strong> ${category.name}</p>
            <button class="edit-category-button" data-id="${category.id}">Edit</button>
            <button class="delete-category-button" data-id="${category.id}">Delete</button>
        `;
        categoryList.appendChild(categoryItem);
    });
}

// Event Listeners
addExpenseButton.addEventListener('click', () => {
    const description = prompt('Enter expense description:');
    const amount = parseFloat(prompt('Enter expense amount:'));
    const category = prompt('Enter expense category:');
    const date = prompt('Enter expense date (YYYY-MM-DD):');

    if (description && !isNaN(amount) && category && date) {
        const newExpense = {
            id: Date.now(),
            description,
            amount,
            category,
            date
        };
        expenses.push(newExpense);
        saveToLocalStorage();
        renderExpenses();
    }
});

addBudgetButton.addEventListener('click', () => {
    const category = prompt('Enter budget category:');
    const amount = parseFloat(prompt('Enter budget amount:'));

    if (category && !isNaN(amount)) {
        const newBudget = {
            id: Date.now(),
            category,
            amount
        };
        budgets.push(newBudget);
        saveToLocalStorage();
        renderBudgets();
    }
});

addCategoryButton.addEventListener('click', () => {
    const name = prompt('Enter category name:');

    if (name) {
        const newCategory = {
            id: Date.now(),
            name
        };
        categories.push(newCategory);
        saveToLocalStorage();
        renderCategories();
    }
});

// Initial Render
renderExpenses();
renderBudgets();
renderCategories();