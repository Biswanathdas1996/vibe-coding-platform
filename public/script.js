document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskNameInput = document.getElementById('task-name');
    const taskDescriptionInput = document.getElementById('task-description');
    const taskAssigneeInput = document.getElementById('task-assignee');
    const taskDueDateInput = document.getElementById('task-due-date');
    const taskList = document.getElementById('tasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${task.name}</strong><br>
                Description: ${task.description || 'No description'}<br>
                Assignee: ${task.assignee || 'Unassigned'}<br>
                Due Date: ${task.dueDate || 'No due date'}
            `;
            taskList.appendChild(li);
        });
    }

    function addTask(event) {
        event.preventDefault();
        const name = taskNameInput.value;
        const description = taskDescriptionInput.value;
        const assignee = taskAssigneeInput.value;
        const dueDate = taskDueDateInput.value;

        if (!name) {
            alert('Task name is required.');
            return;
        }

        const newTask = {
            name,
            description,
            assignee,
            dueDate
        };

        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        taskForm.reset();
    }

    taskForm.addEventListener('submit', addTask);

    renderTasks();
});