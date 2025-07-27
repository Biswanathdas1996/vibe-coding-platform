// Enhanced JavaScript for Multi-Page Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize application
    console.log('Multi-page application loaded successfully');
    
    // Add active state management for navigation
    updateActiveNavigation();
    
    // Add smooth transitions
    addPageTransitions();
    
    // Add basic interactivity
    addInteractivity();
});

function updateActiveNavigation() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item, .nav-link');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && currentPath.includes(href.replace('/preview/', ''))) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function addPageTransitions() {
    // Add fade-in effect for main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            mainContent.style.transition = 'all 0.3s ease';
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }, 100);
    }
}

function addInteractivity() {
    // Add hover effects for feature showcases
    const featureCards = document.querySelectorAll('.feature-showcase');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click feedback for navigation items
    const navItems = document.querySelectorAll('.nav-item, .nav-link');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Status indicator functionality
function updateStatusIndicators() {
    const statusElements = document.querySelectorAll('.feature-status');
    statusElements.forEach(status => {
        if (status.textContent.includes('Fixed') || status.textContent.includes('Active')) {
            status.style.animation = 'pulse 2s infinite';
        }
    });
}

// Call status update
setTimeout(updateStatusIndicators, 500);