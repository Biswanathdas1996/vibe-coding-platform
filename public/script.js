document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const tasksList = document.getElementById('tasks');

    // Dark Mode Toggle
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Load tasks from local storage (placeholder)
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();

    // Add Task
    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ text: taskText, completed: false });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
            taskInput.value = '';
        }
    });

    // Render Tasks
    function renderTasks() {
        tasksList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.textContent = task.text;
            // Add a delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasks();
            });
            li.appendChild(deleteButton);
            tasksList.appendChild(li);
        });
    }

    // Placeholder for WebSocket connection (replace with actual implementation)
    // const socket = new WebSocket('ws://your-websocket-server');
    // socket.onmessage = (event) => {
    //     // Handle real-time updates
    //     console.log('Received:', event.data);
    //     // Update the task list based on the received data
    // };
});