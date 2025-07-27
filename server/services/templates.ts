export interface TemplateFiles extends Record<string, string> {
  "index.html": string;
  "styles.css": string;
  "script.js": string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  files: TemplateFiles;
}

export const templates: Record<string, Template> = {
  "landing-page": {
    id: "landing-page",
    name: "Landing Page",
    description: "Modern landing page with hero section, features, and contact form",
    files: {
      "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Landing Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">YourBrand</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="home" class="hero">
            <div class="hero-content">
                <h1>Welcome to Your Product</h1>
                <p>Transform your business with our innovative solution</p>
                <button class="cta-button">Get Started</button>
            </div>
        </section>

        <section id="features" class="features">
            <div class="container">
                <h2>Features</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <h3>Fast</h3>
                        <p>Lightning-fast performance for your needs</p>
                    </div>
                    <div class="feature-card">
                        <h3>Reliable</h3>
                        <p>Built to last with 99.9% uptime guarantee</p>
                    </div>
                    <div class="feature-card">
                        <h3>Secure</h3>
                        <p>Enterprise-grade security you can trust</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="contact" class="contact">
            <div class="container">
                <h2>Get in Touch</h2>
                <form class="contact-form">
                    <input type="text" placeholder="Your Name" required>
                    <input type="email" placeholder="Your Email" required>
                    <textarea placeholder="Your Message" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        </section>
    </main>

    <footer class="footer">
        <p>&copy; 2024 YourBrand. All rights reserved.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>`,
      "styles.css": `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
.header {
    background: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #007bff;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    text-decoration: none;
    color: #333;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: #007bff;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
}

.hero-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero-content p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
}

.cta-button {
    background: #007bff;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.cta-button:hover {
    background: #0056b3;
}

/* Features Section */
.features {
    padding: 5rem 0;
    background: #f8f9fa;
}

.features h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    text-align: center;
}

.feature-card h3 {
    margin-bottom: 1rem;
    color: #007bff;
}

/* Contact Section */
.contact {
    padding: 5rem 0;
}

.contact h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
}

.contact-form {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-form input,
.contact-form textarea {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}

.contact-form textarea {
    height: 150px;
    resize: vertical;
}

.contact-form button {
    background: #007bff;
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.1rem;
    transition: background 0.3s;
}

.contact-form button:hover {
    background: #0056b3;
}

/* Footer */
.footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 2rem 0;
}`,
      "script.js": `// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Contact form handling
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});`
    }
  },

  "portfolio": {
    id: "portfolio",
    name: "Portfolio Website",
    description: "Professional portfolio showcase with project gallery",
    files: {
      "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>John Doe - Portfolio</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="logo">John Doe</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="home" class="hero">
            <div class="hero-content">
                <h1>John Doe</h1>
                <p class="tagline">Full Stack Developer</p>
                <p class="description">Creating beautiful digital experiences with modern technology</p>
                <div class="hero-buttons">
                    <a href="#portfolio" class="btn primary">View My Work</a>
                    <a href="#contact" class="btn secondary">Get In Touch</a>
                </div>
            </div>
        </section>

        <section id="about" class="about">
            <div class="container">
                <h2>About Me</h2>
                <div class="about-content">
                    <div class="about-text">
                        <p>I'm a passionate full-stack developer with 5+ years of experience in creating web applications. I love turning complex problems into simple, beautiful, and intuitive solutions.</p>
                        <p>When I'm not coding, you can find me exploring new technologies, contributing to open source projects, or capturing moments through photography.</p>
                    </div>
                    <div class="skills">
                        <h3>Skills</h3>
                        <div class="skill-tags">
                            <span class="skill-tag">JavaScript</span>
                            <span class="skill-tag">React</span>
                            <span class="skill-tag">Node.js</span>
                            <span class="skill-tag">Python</span>
                            <span class="skill-tag">CSS</span>
                            <span class="skill-tag">Git</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="portfolio" class="portfolio">
            <div class="container">
                <h2>My Work</h2>
                <div class="portfolio-grid">
                    <div class="project-card">
                        <div class="project-image"></div>
                        <div class="project-info">
                            <h3>E-commerce Platform</h3>
                            <p>A full-featured online store built with React and Node.js</p>
                            <div class="project-links">
                                <a href="#" class="project-link">View Live</a>
                                <a href="#" class="project-link">Source Code</a>
                            </div>
                        </div>
                    </div>
                    <div class="project-card">
                        <div class="project-image"></div>
                        <div class="project-info">
                            <h3>Task Management App</h3>
                            <p>A collaborative project management tool for teams</p>
                            <div class="project-links">
                                <a href="#" class="project-link">View Live</a>
                                <a href="#" class="project-link">Source Code</a>
                            </div>
                        </div>
                    </div>
                    <div class="project-card">
                        <div class="project-image"></div>
                        <div class="project-info">
                            <h3>Weather App</h3>
                            <p>Real-time weather application with location-based forecasts</p>
                            <div class="project-links">
                                <a href="#" class="project-link">View Live</a>
                                <a href="#" class="project-link">Source Code</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="contact" class="contact">
            <div class="container">
                <h2>Get In Touch</h2>
                <p>I'm always interested in new opportunities and interesting projects.</p>
                <div class="contact-info">
                    <div class="contact-item">
                        <h3>Email</h3>
                        <p>john.doe@email.com</p>
                    </div>
                    <div class="contact-item">
                        <h3>LinkedIn</h3>
                        <p>linkedin.com/in/johndoe</p>
                    </div>
                    <div class="contact-item">
                        <h3>GitHub</h3>
                        <p>github.com/johndoe</p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <p>&copy; 2024 John Doe. All rights reserved.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>`,
      "styles.css": `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
.header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2563eb;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: #2563eb;
}

/* Hero Section */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.hero-content h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
}

.tagline {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    opacity: 0.9;
}

.description {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    opacity: 0.8;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.btn {
    display: inline-block;
    padding: 1rem 2rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s;
    border: 2px solid transparent;
}

.btn.primary {
    background: #2563eb;
    color: white;
}

.btn.primary:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
}

.btn.secondary {
    background: transparent;
    color: white;
    border-color: white;
}

.btn.secondary:hover {
    background: white;
    color: #2563eb;
}

/* Sections */
section {
    padding: 5rem 0;
}

.about {
    background: #f8fafc;
}

.about h2, .portfolio h2, .contact h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #1e293b;
}

.about-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
    align-items: start;
}

.about-text p {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    color: #475569;
}

.skills h3 {
    margin-bottom: 1rem;
    color: #1e293b;
}

.skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.skill-tag {
    background: #2563eb;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
}

.portfolio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.project-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}

.project-card:hover {
    transform: translateY(-5px);
}

.project-image {
    height: 200px;
    background: linear-gradient(45deg, #667eea, #764ba2);
}

.project-info {
    padding: 1.5rem;
}

.project-info h3 {
    margin-bottom: 0.5rem;
    color: #1e293b;
}

.project-info p {
    color: #64748b;
    margin-bottom: 1rem;
}

.project-links {
    display: flex;
    gap: 1rem;
}

.project-link {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
}

.project-link:hover {
    text-decoration: underline;
}

.contact {
    background: #f8fafc;
    text-align: center;
}

.contact p {
    font-size: 1.1rem;
    color: #64748b;
    margin-bottom: 3rem;
}

.contact-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 800px;
    margin: 0 auto;
}

.contact-item h3 {
    margin-bottom: 0.5rem;
    color: #1e293b;
}

.contact-item p {
    color: #2563eb;
    font-weight: 500;
}

.footer {
    background: #1e293b;
    color: white;
    text-align: center;
    padding: 2rem 0;
}

@media (max-width: 768px) {
    .hero-content h1 {
        font-size: 2.5rem;
    }
    
    .about-content {
        grid-template-columns: 1fr;
    }
    
    .nav-links {
        gap: 1rem;
    }
}`,
      "script.js": `// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Skill tags animation
const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillTags = entry.target.querySelectorAll('.skill-tag');
            skillTags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.opacity = '1';
                    tag.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });
});

document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.style.opacity = '0';
    tag.style.transform = 'translateY(20px)';
    tag.style.transition = 'all 0.3s ease';
});

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    observer.observe(skillsSection);
}`
    }
  },

  "blank": {
    id: "blank",
    name: "Start from Scratch",
    description: "Empty project to build whatever you imagine",
    files: {
      "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to Your Blank Canvas</h1>
        <p>This is a clean slate ready for your ideas. Start describing what you'd like to build!</p>
        <div class="getting-started">
            <h2>Getting Started</h2>
            <ul>
                <li>Describe your vision in the chat</li>
                <li>I'll help you build it step by step</li>
                <li>Modify, iterate, and perfect your creation</li>
            </ul>
        </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`,
      "styles.css": `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 3rem;
    max-width: 600px;
    margin: 2rem;
    text-align: center;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #2563eb;
    font-weight: 700;
}

p {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 2rem;
}

.getting-started {
    text-align: left;
    background: #f8fafc;
    padding: 2rem;
    border-radius: 15px;
    margin-top: 2rem;
}

.getting-started h2 {
    color: #1e293b;
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

.getting-started ul {
    list-style: none;
    padding: 0;
}

.getting-started li {
    padding: 0.5rem 0;
    color: #475569;
    position: relative;
    padding-left: 2rem;
}

.getting-started li:before {
    content: "✨";
    position: absolute;
    left: 0;
    top: 0.5rem;
}`,
      "script.js": `// Welcome to your blank canvas!
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
});`
    }
  }
};

export function getTemplate(templateId: string): Template | null {
  return templates[templateId] || null;
}