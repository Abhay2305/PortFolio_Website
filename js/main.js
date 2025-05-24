// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initNavigation();
    initScrollAnimation();
    initFormValidation();
    initScrollSpy();
    initRevealAnimations();
    
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init("Kohv-FPeE9m7Q1-Vh");
    }
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Add scrolled class to header on scroll
function initScrollAnimation() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Form validation
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Simple validation
            if (name === '' || email === '' || message === '') {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Email validation
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            try {
                // Check if EmailJS is properly initialized
                if (typeof emailjs === 'undefined') {
                    throw new Error('EmailJS is not loaded. Please check your internet connection.');
                }

                // Prepare template parameters
                const templateParams = {
                    from_name: name,
                    from_email: email,
                    subject: subject || 'Contact Form Submission',
                    message: message
                };

                // Send email using EmailJS
                const response = await emailjs.send(
                    'service_zxptkjw', 
                    'template_4tgsx2e', 
                    templateParams, 
                    'Kohv-FPeE9m7Q1-Vh'  // Add public key as fourth parameter
                );
                
                console.log('Email sent successfully:', response);
                console.log('Complete response details:', JSON.stringify(response));
                showNotification('Your message has been sent successfully!', 'success');
                contactForm.reset();
            } catch (error) {
                console.error('Detailed EmailJS Error:', {
                    message: error.message,
                    text: error.text,
                    name: error.name,
                    stack: error.stack
                });
                
                let errorMessage = 'Failed to send message. ';
                if (error.message.includes('service_zxptkjw')) {
                    errorMessage += 'Invalid service ID. ';
                }
                if (error.message.includes('template_4tgsx2e')) {
                    errorMessage += 'Invalid template ID. ';
                }
                if (error.message.includes('publicKey')) {
                    errorMessage += 'Invalid public key. ';
                }
                
                showNotification(errorMessage + 'Please try again later.', 'error');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
}

// Helper function for email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to show notifications
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add notification to the DOM
    document.body.appendChild(notification);
    
    // Add shown class for animation
    setTimeout(() => {
        notification.classList.add('shown');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('shown');
        
        // Remove from DOM after fade-out animation
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Scroll spy functionality
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Reveal animations on scroll
function initRevealAnimations() {
    // Add reveal class to all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('reveal');
    });
    
    // Reveal elements as they come into view
    const revealElements = document.querySelectorAll('.reveal');
    
    function revealOnScroll() {
        for (let i = 0; i < revealElements.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                revealElements[i].classList.add('active');
            }
        }
    }
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on initial load
}

// Modify the CSS for animation
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 9999;
    }
    
    .notification.shown {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification.success {
        background: linear-gradient(135deg, #4CAF50, #8BC34A);
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
    }
    
    .notification.error {
        background: linear-gradient(135deg, #F44336, #FF5252);
        box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
    }
    
    .reveal {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s ease;
    }
    
    .reveal.active {
        opacity: 1;
        transform: translateY(0);
    }
`;

// Append style to head
document.head.appendChild(style); 