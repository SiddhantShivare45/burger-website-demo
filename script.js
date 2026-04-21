// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar && window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
    } else if (navbar) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    }
});

// Active nav link on scroll (Improved)
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === current || href.includes(current) || (current === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// Form Validation & Submission
document.addEventListener('DOMContentLoaded', function () {

    // Booking Form Validation
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', validateBookingForm);
        setupRealTimeValidation(bookingForm);
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', validateContactForm);
        setupRealTimeValidation(contactForm);
    }
});

// Real-time validation setup
function setupRealTimeValidation(form) {
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearError);
    });
}

// Generic field validation
function validateField(e) {
    const field = e.target;
    const errorSpan = field.parentNode.querySelector('.error') || field.nextElementSibling;
    let isValid = true;
    let errorMsg = '';

    switch (field.id) {
        case 'name':
        case 'contactName':
            if (field.value.trim().length < 2) {
                errorMsg = 'Name must be at least 2 characters';
                isValid = false;
            }
            break;

        case 'phone':
        case 'contactPhone':
            if (field.value && !/^\+?[\d\s\-\$\$]{10,}$/.test(field.value)) {
                errorMsg = 'Please enter a valid phone number';
                isValid = false;
            }
            break;

        case 'email':
        case 'contactEmail':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (field.value && !emailRegex.test(field.value)) {
                errorMsg = 'Please enter a valid email address';
                isValid = false;
            }
            break;

        case 'date':
            const today = new Date().toISOString().split('T')[0];
            if (field.value < today) {
                errorMsg = 'Please select a future date';
                isValid = false;
            }
            break;

        case 'contactSubject':
            if (!field.value) {
                errorMsg = 'Please select a subject';
                isValid = false;
            }
            break;
    }

    if (!isValid) {
        showError(field, errorMsg);
    }
}

// Show error message
function showError(field, message) {
    let errorSpan = field.parentNode.querySelector('.error');
    if (!errorSpan) {
        errorSpan = document.createElement('span');
        errorSpan.className = 'error';
        field.parentNode.appendChild(errorSpan);
    }
    errorSpan.textContent = message;
    field.style.borderColor = '#e74c3c';
    field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
}

// Clear error message
function clearError(e) {
    const field = e.target;
    const errorSpan = field.parentNode.querySelector('.error');
    if (errorSpan) {
        errorSpan.textContent = '';
    }
    field.style.borderColor = '#e1e5e9';
    field.style.boxShadow = 'none';
}

// Booking Form Validation
function validateBookingForm(e) {
    e.preventDefault();

    const form = e.target;
    let isValid = true;

    // Clear previous errors
    form.querySelectorAll('.error').forEach(span => span.textContent = '');

    // Validate all required fields
    const requiredFields = ['name', 'date', 'time', 'guests', 'phone'];
    requiredFields.forEach(fieldId => {
        const field = form.querySelector(`[name="${fieldId}"]`);
        if (!field.value.trim()) {
            showError(field, `${getFieldName(fieldId)} is required`);
            isValid = false;
        }
    });

    // Additional validations
    const dateField = form.querySelector('[name="date"]');
    const today = new Date().toISOString().split('T')[0];
    if (dateField.value < today) {
        showError(dateField, 'Please select a future date');
        isValid = false;
    }

    if (isValid) {
        showSuccess(form, 'Booking request sent successfully! We will contact you soon.');
        form.reset();
    }
}

// Contact Form Validation
function validateContactForm(e) {
    e.preventDefault();

    const form = e.target;
    let isValid = true;

    // Clear previous errors
    form.querySelectorAll('.error').forEach(span => span.textContent = '');

    // Validate required fields
    const requiredFields = ['contactName', 'contactEmail', 'contactSubject', 'contactMessage'];
    requiredFields.forEach(fieldId => {
        const field = form.querySelector(`#${fieldId}`);
        if (!field.value.trim()) {
            showError(field, `${getFieldName(fieldId)} is required`);
            isValid = false;
        }
    });

    // Email validation
    const emailField = form.querySelector('#contactEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value)) {
        showError(emailField, 'Please enter a valid email address');
        isValid = false;
    }

    if (isValid) {
        showSuccess(form, 'Thank you! Your message has been sent. We will get back to you soon!');
        form.reset();
    }
}

// Helper function to get readable field names
function getFieldName(fieldId) {
    const names = {
        'name': 'Full Name',
        'contactName': 'Full Name',
        'email': 'Email',
        'contactEmail': 'Email',
        'phone': 'Phone',
        'contactPhone': 'Phone',
        'date': 'Date',
        'time': 'Time',
        'guests': 'Number of Guests',
        'contactSubject': 'Subject',
        'contactMessage': 'Message'
    };
    return names[fieldId] || fieldId;
}

// Show success message
function showSuccess(form, message) {
    // Remove existing success message
    const existingSuccess = form.parentNode.querySelector('.success');
    if (existingSuccess) {
        existingSuccess.remove();
    }

    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <strong>${message}</strong>
    `;

    // Insert before form
    form.parentNode.insertBefore(successDiv, form);

    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Auto-hide after 5 seconds
    setTimeout(() => {
        successDiv.style.transition = 'opacity 0.5s ease';
        successDiv.style.opacity = '0';
        setTimeout(() => successDiv.remove(), 500);
    }, 5000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.animate-slide-up, .animate-slide-left, .animate-slide-right').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease';
    observer.observe(el);
});

// Counter animation (for stats section)
function animateCounters() {
    const counters = document.querySelectorAll('.stat h3');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const increment = target / 100;
        let current = 0;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current) + (target > 1000 ? 'k+' : '');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = counter.textContent;
            }
        };

        observer.observe(counter.parentNode);
    });
}

// Initialize counters when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stats')?.forEach(stats => {
    statsObserver.observe(stats);
});

// Menu hover effects
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px) scale(1.02)';
    });
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
    });
});

// Preloader (Optional)
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Back to top button
function createBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    btn.className = 'back-to-top';
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #ff6b35;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(255,107,53,0.4);
    `;

    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

createBackToTop();