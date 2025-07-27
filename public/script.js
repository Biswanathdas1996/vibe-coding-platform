// Simple navigation handling
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = event.target.getAttribute('href');
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        // Add active class to the clicked link
        event.target.classList.add('active');

        // Basic navigation (replace with more sophisticated routing)
        if (target) {
            window.location.href = target;
        }
    });
});

// Sidebar toggle for mobile
const sidebar = document.querySelector('.sidebar');
const header = document.querySelector('header');

if (window.innerWidth <= 768) {
    // Add a button to toggle the sidebar
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Menu';
    header.appendChild(toggleButton);
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}
