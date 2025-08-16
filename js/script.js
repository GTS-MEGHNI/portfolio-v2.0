// Portfolio Website JavaScript

class PortfolioApp {
    constructor() {
        this.themeManager = new ThemeManager();
        this.navigationHandler = new NavigationHandler();
        this.projectFilter = new ProjectFilter();
        this.techStackAnimator = new TechStackAnimator();
        this.contactFormHandler = new ContactFormHandler();
        this.scrollAnimations = new ScrollAnimations();
        
        this.init();
    }

    init() {
        // Initialize all components
        this.themeManager.init();
        this.navigationHandler.init();
        this.projectFilter.init();
        this.techStackAnimator.init();
        this.contactFormHandler.init();
        this.scrollAnimations.init();
        
        // Add event listeners
        this.addEventListeners();
        
        console.log('Portfolio website initialized successfully');
    }

    addEventListeners() {
        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    handleScroll() {
        this.navigationHandler.updateActiveNav();
        this.scrollAnimations.checkVisibility();
    }

    handleResize() {
        // Handle responsive adjustments
        this.techStackAnimator.handleResize();
    }

    handleKeydown(event) {
        // Handle keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'k':
                    event.preventDefault();
                    // Focus search or contact form
                    document.getElementById('name')?.focus();
                    break;
            }
        }
    }
}

class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.themeToggle = null;
        this.themeIcon = null;
    }

    init() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        
        // Load saved theme or default to dark
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.applyTheme(this.currentTheme);
        
        // Add event listener
        this.themeToggle?.addEventListener('click', this.toggleTheme.bind(this));
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeIcon(theme);
    }

    updateThemeIcon(theme) {
        if (!this.themeIcon) return;
        
        if (theme === 'dark') {
            // Sun icon for light mode toggle
            this.themeIcon.innerHTML = `
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
            `;
        } else {
            // Moon icon for dark mode toggle
            this.themeIcon.innerHTML = `
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            `;
        }
    }
}

class NavigationHandler {
    constructor() {
        this.navLinks = [];
        this.sections = [];
        this.currentSection = '';
    }

    init() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        
        // Add click listeners to nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });
    }

    handleNavClick(event) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.setActiveNav(sectionId);
            }
        });
    }

    setActiveNav(sectionId) {
        if (this.currentSection === sectionId) return;
        
        this.currentSection = sectionId;
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
}

class ProjectFilter {
    constructor() {
        this.projects = [];
        this.activeFilter = 'all';
        this.filterButtons = [];
        this.projectsGrid = null;
    }

    init() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectsGrid = document.getElementById('projects-grid');
        this.projects = document.querySelectorAll('.project-card');
        
        // Add event listeners to filter buttons
        this.filterButtons.forEach(button => {
            button.addEventListener('click', this.handleFilterClick.bind(this));
        });
    }

    handleFilterClick(event) {
        const filter = event.target.getAttribute('data-filter');
        this.setActiveFilter(filter);
        this.filterProjects(filter);
    }

    setActiveFilter(filter) {
        this.activeFilter = filter;
        
        this.filterButtons.forEach(button => {
            button.classList.remove('active', 'btn-primary');
            button.classList.add('btn-outline');
            
            if (button.getAttribute('data-filter') === filter) {
                button.classList.add('active', 'btn-primary');
                button.classList.remove('btn-outline');
            }
        });
    }

    filterProjects(category) {
        this.projects.forEach(project => {
            const projectCategories = project.getAttribute('data-category').split(' ');
            const shouldShow = category === 'all' || projectCategories.includes(category);
            
            if (shouldShow) {
                project.style.display = 'block';
                project.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                project.style.display = 'none';
            }
        });
    }
}

class TechStackAnimator {
    constructor() {
        this.techItems = [];
        this.animationInterval = null;
    }

    init() {
        this.techItems = document.querySelectorAll('.tech-item');
        this.startRandomAnimations();
        
        // Add hover effects
        this.techItems.forEach(item => {
            item.addEventListener('mouseenter', this.handleTechHover.bind(this));
            item.addEventListener('mouseleave', this.handleTechLeave.bind(this));
        });
    }

    startRandomAnimations() {
        // Randomly animate tech icons every few seconds
        this.animationInterval = setInterval(() => {
            this.animateRandomTech();
        }, 3000);
    }

    animateRandomTech() {
        const randomIndex = Math.floor(Math.random() * this.techItems.length);
        const techItem = this.techItems[randomIndex];
        const techIcon = techItem.querySelector('.tech-icon');
        
        if (techIcon) {
            techIcon.style.animation = 'pulse-glow 1s ease-in-out';
            setTimeout(() => {
                techIcon.style.animation = '';
            }, 1000);
        }
    }

    handleTechHover(event) {
        const techIcon = event.currentTarget.querySelector('.tech-icon');
        if (techIcon) {
            techIcon.style.animation = 'rotate 0.5s ease-in-out';
        }
    }

    handleTechLeave(event) {
        const techIcon = event.currentTarget.querySelector('.tech-icon');
        if (techIcon) {
            setTimeout(() => {
                techIcon.style.animation = '';
            }, 500);
        }
    }

    handleResize() {
        // Adjust animations for mobile
        if (window.innerWidth < 768) {
            clearInterval(this.animationInterval);
        } else if (!this.animationInterval) {
            this.startRandomAnimations();
        }
    }
}

class ContactFormHandler {
    constructor() {
        this.form = null;
        this.formMessage = null;
        this.isSubmitting = false;
    }

    init() {
        this.form = document.getElementById('contact-form');
        this.formMessage = document.getElementById('form-message');
        
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            
            // Add real-time validation
            const inputs = this.form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateField.bind(this));
                input.addEventListener('input', this.clearFieldError.bind(this));
            });
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitting) return;
        
        if (!this.validateForm()) {
            this.showMessage('Please fix the errors below.', 'error');
            return;
        }
        
        this.isSubmitting = true;
        this.showLoadingState(true);
        
        try {
            const formData = this.getFormData();
            
            // Simulate API call (replace with actual endpoint)
            await this.simulateFormSubmission(formData);
            
            this.showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
            this.resetForm();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            this.isSubmitting = false;
            this.showLoadingState(false);
        }
    }

    validateForm() {
        const fields = ['name', 'email', 'subject', 'message'];
        let isValid = true;
        
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!this.validateField({ target: field })) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous error
        this.clearFieldError(event);
        
        // Required field validation
        if (!value) {
            errorMessage = `${this.getFieldLabel(fieldName)} is required.`;
            isValid = false;
        } else {
            // Specific field validations
            switch (fieldName) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        errorMessage = 'Please enter a valid email address.';
                        isValid = false;
                    }
                    break;
                case 'name':
                    if (value.length < 2) {
                        errorMessage = 'Name must be at least 2 characters long.';
                        isValid = false;
                    }
                    break;
                case 'subject':
                    if (value.length < 5) {
                        errorMessage = 'Subject must be at least 5 characters long.';
                        isValid = false;
                    }
                    break;
                case 'message':
                    if (value.length < 10) {
                        errorMessage = 'Message must be at least 10 characters long.';
                        isValid = false;
                    }
                    break;
            }
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.showFieldSuccess(field);
        }
        
        return isValid;
    }

    clearFieldError(event) {
        const field = event.target;
        const errorElement = field.parentNode.querySelector('.error-message');
        
        field.classList.remove('error', 'success');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
    }

    showFieldError(field, message) {
        const errorElement = field.parentNode.querySelector('.error-message');
        
        field.classList.add('error');
        field.classList.remove('success');
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    showFieldSuccess(field) {
        field.classList.add('success');
        field.classList.remove('error');
    }

    getFieldLabel(fieldName) {
        const labels = {
            name: 'Name',
            email: 'Email',
            subject: 'Subject',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }

    getFormData() {
        return {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toISOString()
        };
    }

    async simulateFormSubmission(formData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real application, you would send this to your backend
        console.log('Form submission:', formData);
        
        // Simulate occasional errors for testing
        if (Math.random() < 0.1) {
            throw new Error('Simulated network error');
        }
    }

    showLoadingState(isLoading) {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const spinner = submitButton.querySelector('.loading-spinner');
        const buttonText = submitButton.querySelector('span:not(.loading-spinner)') || submitButton;
        
        if (isLoading) {
            submitButton.disabled = true;
            spinner?.classList.remove('hidden');
            if (buttonText.textContent) {
                buttonText.textContent = 'Sending...';
            }
        } else {
            submitButton.disabled = false;
            spinner?.classList.add('hidden');
            if (buttonText.textContent) {
                buttonText.textContent = 'Send Message';
            }
        }
    }

    showMessage(message, type) {
        if (!this.formMessage) return;
        
        const messageText = this.formMessage.querySelector('#form-message-text');
        
        this.formMessage.className = `alert alert-${type === 'error' ? 'error' : 'success'}`;
        this.formMessage.classList.remove('hidden');
        
        if (messageText) {
            messageText.textContent = message;
        }
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                this.formMessage.classList.add('hidden');
            }, 5000);
        }
    }

    resetForm() {
        this.form.reset();
        
        // Clear all field states
        const fields = this.form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            field.classList.remove('error', 'success');
            const errorElement = field.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.classList.add('hidden');
            }
        });
    }
}

class ScrollAnimations {
    constructor() {
        this.animatedElements = [];
    }

    init() {
        // Add fade-in-up class to elements that should animate
        const elementsToAnimate = document.querySelectorAll('.card, .tech-card, .project-card');
        elementsToAnimate.forEach(element => {
            element.classList.add('fade-in-up');
        });
        
        this.animatedElements = document.querySelectorAll('.fade-in-up');
        this.checkVisibility();
    }

    checkVisibility() {
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        
        this.animatedElements.forEach(element => {
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;
            
            // Check if element is in viewport
            if (scrollTop + windowHeight > elementTop + 100 && 
                scrollTop < elementTop + elementHeight) {
                element.classList.add('visible');
            }
        });
    }
}

window.openProjectModal = function(projectId) {
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-content');
    const project = projectData[projectId];
    
    if (!project || !modal || !modalContent) return;
    
    modalContent.innerHTML = `
        <h3 class="text-2xl font-bold mb-4">${project.title}</h3>
        <p class="text-base-content/80 mb-6">${project.description}</p>
        
        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div>
                <h4 class="text-lg font-semibold mb-3 text-primary">Technologies Used</h4>
                <div class="flex flex-wrap gap-2">
                    ${project.technologies.map(tech => 
                        `<div class="badge badge-primary">${tech}</div>`
                    ).join('')}
                </div>
            </div>
            
            <div>
                <h4 class="text-lg font-semibold mb-3 text-secondary">Key Features</h4>
                <ul class="list-disc list-inside space-y-1 text-sm">
                    ${project.features.map(feature => 
                        `<li>${feature}</li>`
                    ).join('')}
                </ul>
            </div>
        </div>
        
        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div>
                <h4 class="text-lg font-semibold mb-3 text-accent">Challenges</h4>
                <ul class="list-disc list-inside space-y-1 text-sm">
                    ${project.challenges.map(challenge => 
                        `<li>${challenge}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div>
                <h4 class="text-lg font-semibold mb-3 text-success">Results</h4>
                <ul class="list-disc list-inside space-y-1 text-sm">
                    ${project.results.map(result => 
                        `<li>${result}</li>`
                    ).join('')}
                </ul>
            </div>
        </div>
        
        <div class="flex gap-4 justify-center">
            ${project.github ? `
                <a href="${project.github}" target="_blank" class="btn btn-primary">
                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View Code
                </a>
            ` : ''}
            ${project.demo ? `
                <a href="${project.demo}" target="_blank" class="btn btn-secondary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                    Live Demo
                </a>
            ` : ''}
        </div>
    `;
    
    modal.showModal();
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Export for potential module usage
export { PortfolioApp, ThemeManager, NavigationHandler, ProjectFilter, TechStackAnimator, ContactFormHandler };