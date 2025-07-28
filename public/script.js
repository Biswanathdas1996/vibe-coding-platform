// Welcome to your blank canvas!
console.log('🎨 Welcome to your new project!');

// Add some sparkle to the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('✨ Page loaded and ready for your creativity!');
    
    // Add a subtle animation to the container
    const container = document.querySelector('.container');
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            container.style.transition = 'all 0.8s ease-out';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 100);
    }
});