// script.js
// IIFE to encapsulate code and avoid global scope pollution
(function() {
    // --- Utility Functions ---

    // Function to fetch content for a section (simulated for this example)
    async function fetchSectionContent(section) {
        switch (section) {
            case 'about':
                return `<h2 class="section-title">About Me</h2>
                        <p>I am a passionate web developer... (Your bio here)</p>`;
            case 'projects':
                return `<h2 class="section-title">Projects</h2>
                        <div class="project-item">
                            <h3>Project 1</h3>
                            <p>Description of project 1...</p>
                            <a href="#" target="_blank">View Project</a>
                        </div>
                        <div class="project-item">
                            <h3>Project 2</h3>
                            <p>Description of project 2...</p>
                            <a href="#" target="_blank">View Project</a>
                        </div>`;
            case 'contact':
                return `<h2 class="section-title">Contact Me</h2>
                        <form id="contactForm">
                            <label for="name">Name:</label>
                            <input type="text" id="name" name="name" required><br><br>

                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" required><br><br>

                            <label for="message">Message:</label>
                            <textarea id="message" name="message" rows="4" required></textarea><br><br>

                            <button type="submit">Submit</button>
                            <div id="formFeedback" style="color: green;"></div>
                        </form>`;
            default:
                return `<p>Content for this section is not available yet.</p>`;
        }
    }

    // Function to update a section's content
    async function updateSection(sectionId) {
        const sectionElement = document.getElementById(sectionId);
        if (!sectionElement) {
            console.error(`Section element with ID '${sectionId}' not found.`);
            return;
        }

        try {
            const content = await fetchSectionContent(sectionId);
            sectionElement.innerHTML = content;

            // Initialize form event listener after content is injected (only for the contact section)
            if (sectionId === 'contact') {
                initializeContactForm();
            }

        } catch (error) {
            console.error(`Error fetching or updating content for section '${sectionId}':`, error);
            sectionElement.innerHTML = `<p>Error loading content.</p>`;
        }
    }


    // --- Navigation ---

    function smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.warn(`Target element with ID '${targetId}' not found.`);
        }
    }


    function handleNavigationClick(event) {
        event.preventDefault(); // Prevent default link behavior
        const sectionId = event.target.dataset.section; // Get the section ID from the data attribute
        if (sectionId) {
            smoothScrollTo(sectionId); // Use smoothScrollTo
            // Optionally: Update the URL hash for bookmarking.  Consider browser history also
            history.pushState({ section: sectionId }, '', `#${sectionId}`); // creates a new entry in browser history
        }
    }



    // --- Contact Form Functionality ---

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showFormFeedback(message, isError = false) {
        const feedbackElement = document.getElementById('formFeedback');
        if (feedbackElement) {
            feedbackElement.textContent = message;
            feedbackElement.style.color = isError ? 'red' : 'green';
        }
    }


    async function sendContactForm(formData) {
        // Simulated server-side logic.  Replace with your actual API call.
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const isSuccess = Math.random() > 0.2; // Simulate success/failure
                if (isSuccess) {
                    resolve({message: "Your message has been sent."});
                } else {
                    reject(new Error("Failed to send the message. Please try again later."));
                }
            }, 1000); // Simulate network latency
        });

    }


    function handleContactFormSubmit(event) {
        event.preventDefault(); // Prevent the default form submission

        const form = event.target;
        const name = form.elements.name.value;
        const email = form.elements.email.value;
        const message = form.elements.message.value;

        if (!name || !email || !message) {
            showFormFeedback('Please fill out all fields.', true);
            return;
        }

        if (!validateEmail(email)) {
            showFormFeedback('Please enter a valid email address.', true);
            return;
        }

        const formData = { name, email, message };
        showFormFeedback('Sending...', false); // feedback to the user

        sendContactForm(formData)
            .then(response => {
                showFormFeedback(response.message, false); // success feedback
                form.reset(); // Clear the form
            })
            .catch(error => {
                console.error("Form submission error:", error);
                showFormFeedback(error.message || 'An error occurred. Please try again.', true); // Display error to user
            });
    }



    function initializeContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactFormSubmit);
        }
    }


    // --- Initial Setup and Event Listeners ---

    function initialize() {
        // Load content for initial section (e.g., 'about')
        updateSection('about');
        updateSection('projects');
        updateSection('contact');


        // Event delegation for navigation links
        document.addEventListener('click', function(event) {
            if (event.target.tagName === 'A' && event.target.dataset.section) {
                handleNavigationClick(event);
            }
        });

        // Handle back/forward browser navigation (using the hash, if present)
        window.addEventListener('popstate', (event) => { // react to the user clicking back and forward buttons
            const sectionId = event.state ? event.state.section : 'about';
            smoothScrollTo(sectionId);
        });
    }

    // --- Run the Initialization ---
    initialize();

})();