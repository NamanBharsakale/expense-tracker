import { getExpenses, saveExpenses } from './storage.js';

let expenses = getExpenses();

const expenseForm = document.getElementById('expense-form');
const expenseTableBody = document.querySelector('#expense-table tbody');
const totalBalance = document.getElementById('total-balance');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const filterCategory = document.getElementById('filter-category');

// Render expenses
const renderExpenses = (filteredExpenses = expenses) => {
    expenseTableBody.innerHTML = '';

    if (filteredExpenses.length === 0) {
        expenseTableBody.innerHTML = `
          <tr>
            <td colspan="4" style="color:#777; font-style:italic;">No records found</td>
          </tr>`;
    }

    filteredExpenses.forEach(exp => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${exp.title}</td>
            <td>₹${exp.amount}</td>
            <td>${exp.category}</td>
            <td><button onclick="deleteExpense(${exp.id})">Delete</button></td>
        `;
        expenseTableBody.appendChild(tr);
    });

    updateBalance();
};

// Update totals
const updateBalance = () => {
    const income = expenses
        .filter(e => e.amount > 0)
        .reduce((a, b) => a + b.amount, 0);

    const expense = expenses
        .filter(e => e.amount < 0)
        .reduce((a, b) => a + Math.abs(b.amount), 0);

    totalIncome.textContent = income;
    totalExpense.textContent = expense;
    totalBalance.textContent = income - expense;
};

// Delete expense
const deleteExpense = (id) => {
    expenses = expenses.filter(exp => exp.id !== id);
    saveExpenses(expenses);
    renderExpenses();
};

window.deleteExpense = deleteExpense; // so HTML inline onclick works

// Add expense
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const id = Date.now();

    if (!title || isNaN(amount) || !category) {
        alert("Please fill all fields correctly.");
        return;
    }

    expenses.push({ id, title, amount, category });
    saveExpenses(expenses);
    renderExpenses();
    expenseForm.reset();
});

// Filter by category
filterCategory.addEventListener('change', () => {
    const value = filterCategory.value;
    if (value === 'all') {
        renderExpenses();
    } else {
        renderExpenses(expenses.filter(exp => exp.category === value));
    }
});

renderExpenses();
