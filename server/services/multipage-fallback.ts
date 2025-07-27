// Additional page generation methods for multi-page fallback support

export function generateFallbackAboutHTML(appName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - ${appName}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <h1 class="app-title">${appName}</h1>
            <nav class="header-nav">
                <a href="/preview/index.html" class="nav-link">Home</a>
                <a href="/preview/features.html" class="nav-link">Features</a>
                <a href="/preview/contact.html" class="nav-link">Contact</a>
            </nav>
        </header>
        
        <div class="app-layout">
            <aside class="sidebar">
                <nav class="sidebar-nav">
                    <ul>
                        <li><a href="/preview/index.html" class="nav-item">Dashboard</a></li>
                        <li><a href="/preview/features.html" class="nav-item">Features</a></li>
                        <li><a href="/preview/about.html" class="nav-item active">About</a></li>
                        <li><a href="/preview/contact.html" class="nav-item">Contact</a></li>
                    </ul>
                </nav>
            </aside>
            
            <main class="main-content">
                <div class="content-section">
                    <h2>About ${appName}</h2>
                    <div class="about-content">
                        <div class="about-card">
                            <h3>Our Mission</h3>
                            <p>This multi-page application demonstrates comprehensive web development with professional structure and navigation.</p>
                        </div>
                        
                        <div class="about-card">
                            <h3>Key Features</h3>
                            <ul>
                                <li>Multi-page application structure</li>
                                <li>Responsive design with CSS Grid</li>
                                <li>Modern UI/UX patterns</li>
                                <li>Professional styling system</li>
                            </ul>
                        </div>
                        
                        <div class="about-card">
                            <h3>Technology Stack</h3>
                            <p>Built with HTML5, CSS3, and JavaScript using modern best practices and responsive design principles.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
}

export function generateFallbackFeaturesHTML(appName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Features - ${appName}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <h1 class="app-title">${appName}</h1>
            <nav class="header-nav">
                <a href="/preview/index.html" class="nav-link">Home</a>
                <a href="/preview/about.html" class="nav-link">About</a>
                <a href="/preview/contact.html" class="nav-link">Contact</a>
            </nav>
        </header>
        
        <div class="app-layout">
            <aside class="sidebar">
                <nav class="sidebar-nav">
                    <ul>
                        <li><a href="/preview/index.html" class="nav-item">Dashboard</a></li>
                        <li><a href="/preview/features.html" class="nav-item active">Features</a></li>
                        <li><a href="/preview/about.html" class="nav-item">About</a></li>
                        <li><a href="/preview/contact.html" class="nav-item">Contact</a></li>
                    </ul>
                </nav>
            </aside>
            
            <main class="main-content">
                <div class="content-section">
                    <h2>Application Features</h2>
                    <div class="features-grid">
                        <div class="feature-showcase">
                            <h3>Multi-Page Architecture</h3>
                            <p>Complete application with multiple interconnected pages and smooth navigation.</p>
                            <div class="feature-status">✅ Active</div>
                        </div>
                        
                        <div class="feature-showcase">
                            <h3>Responsive Design</h3>
                            <p>Mobile-first approach ensuring perfect display across all device sizes.</p>
                            <div class="feature-status">✅ Active</div>
                        </div>
                        
                        <div class="feature-showcase">
                            <h3>Navigation System</h3>
                            <p>Intuitive navigation with active states and breadcrumb support.</p>
                            <div class="feature-status">✅ Active</div>
                        </div>
                        
                        <div class="feature-showcase">
                            <h3>Dynamic Theming</h3>
                            <p>Color schemes that automatically adapt to application type and purpose.</p>
                            <div class="feature-status">✅ Active</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
}

export function generateFallbackContactHTML(appName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact - ${appName}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <h1 class="app-title">${appName}</h1>
            <nav class="header-nav">
                <a href="/preview/index.html" class="nav-link">Home</a>
                <a href="/preview/about.html" class="nav-link">About</a>
                <a href="/preview/features.html" class="nav-link">Features</a>
            </nav>
        </header>
        
        <div class="app-layout">
            <aside class="sidebar">
                <nav class="sidebar-nav">
                    <ul>
                        <li><a href="/preview/index.html" class="nav-item">Dashboard</a></li>
                        <li><a href="/preview/features.html" class="nav-item">Features</a></li>
                        <li><a href="/preview/about.html" class="nav-item">About</a></li>
                        <li><a href="/preview/contact.html" class="nav-item active">Contact</a></li>
                    </ul>
                </nav>
            </aside>
            
            <main class="main-content">
                <div class="content-section">
                    <h2>Contact Information</h2>
                    <div class="contact-content">
                        <div class="contact-form-section">
                            <h3>Get in Touch</h3>
                            <form class="contact-form">
                                <div class="form-group">
                                    <label for="name">Name</label>
                                    <input type="text" id="name" name="name" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="email">Email</label>
                                    <input type="email" id="email" name="email" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="subject">Subject</label>
                                    <input type="text" id="subject" name="subject" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="message">Message</label>
                                    <textarea id="message" name="message" rows="5" required></textarea>
                                </div>
                                
                                <button type="submit" class="submit-btn">Send Message</button>
                            </form>
                        </div>
                        
                        <div class="contact-info-section">
                            <h3>Application Information</h3>
                            <div class="info-card">
                                <h4>Multi-Page Template</h4>
                                <p>Comprehensive application structure with multiple interconnected pages.</p>
                            </div>
                            
                            <div class="info-card">
                                <h4>Features</h4>
                                <ul>
                                    <li>Responsive multi-page design</li>
                                    <li>Professional layout structure</li>
                                    <li>Interactive navigation system</li>
                                    <li>Form handling capabilities</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
}