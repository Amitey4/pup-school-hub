// PUP Event Management System Script
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const menuBtn = document.getElementById('menuBtn');
    const navMenu = document.getElementById('navMenu');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    const notificationClose = notification.querySelector('.notification-close');
    const navLinks = document.querySelectorAll('.nav-link');
    const registerBtn = document.querySelector('.pup-btn.primary');
    const allButtons = document.querySelectorAll('.pup-btn');

    // Mobile Menu Toggle
    menuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        showNotification('Navigation menu ' + (navMenu.classList.contains('active') ? 'opened' : 'closed'));
    });

    // Navigation Link Click Handler
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
            
            // Show notification
            const sectionName = this.querySelector('span').textContent;
            showNotification(`Navigated to ${sectionName}`);
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Event Registration Simulation
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const originalHTML = this.innerHTML;
            const originalText = this.querySelector('span') ? this.querySelector('span').textContent : 'Register Now';
            
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Registered Successfully!';
                this.classList.remove('primary');
                this.classList.add('outline');
                showNotification('Successfully registered for PUP 120th Foundation Week Celebration!');
                
                // Revert after 3 seconds
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.disabled = false;
                    this.classList.remove('outline');
                    this.classList.add('primary');
                }, 3000);
            }, 1500);
        });
    }

    // Button Click Handlers
    allButtons.forEach(button => {
        if (!button.classList.contains('primary')) {
            button.addEventListener('click', function() {
                const buttonText = this.textContent.trim();
                showNotification(`Action: ${buttonText}`);
                
                // Add ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = event.clientX - rect.left - size / 2;
                const y = event.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.7);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    width: ${size}px;
                    height: ${size}px;
                    top: ${y}px;
                    left: ${x}px;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        }
    });

    // Notification System
    function showNotification(message) {
        notificationText.textContent = message;
        notification.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    notificationClose.addEventListener('click', () => {
        notification.classList.remove('show');
    });

    // Academic Year Display
    function updateAcademicInfo() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        
        let academicYear, semester;
        
        if (month >= 6 && month <= 10) {
            academicYear = `${year}-${year + 1}`;
            semester = 'First Semester';
        } else if (month >= 11 || month <= 3) {
            academicYear = `${year}-${year + 1}`;
            semester = 'Second Semester';
        } else {
            academicYear = `${year - 1}-${year}`;
            semester = 'Summer Term';
        }
        
        const academicBadge = document.querySelector('.academic-badge');
        const semesterSpan = document.querySelector('.semester');
        
        if (academicBadge) academicBadge.textContent = `Academic Year ${academicYear}`;
        if (semesterSpan) semesterSpan.textContent = semester;
    }

    // Update event dates to be relative
    function updateEventDates() {
        const eventDates = document.querySelectorAll('.event-date');
        const today = new Date();
        
        eventDates.forEach(dateElement => {
            const originalDate = dateElement.textContent;
            const eventDate = new Date(originalDate);
            
            if (!isNaN(eventDate)) {
                const diffTime = eventDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays === 0) {
                    dateElement.innerHTML += ' <span class="today-badge">Today</span>';
                } else if (diffDays === 1) {
                    dateElement.innerHTML += ' <span class="tomorrow-badge">Tomorrow</span>';
                } else if (diffDays > 0 && diffDays <= 7) {
                    dateElement.innerHTML += ` <span class="upcoming-badge">In ${diffDays} days</span>`;
                }
            }
        });
    }

    // Initialize counter animation
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '');
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
                }
            };
            
            // Start animation when element is in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    // Add CSS for date badges
    const style = document.createElement('style');
    style.textContent = `
        .today-badge {
            background: var(--pup-danger);
            color: white;
            padding: 0.125rem 0.5rem;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 600;
            margin-left: 0.5rem;
        }
        
        .tomorrow-badge {
            background: var(--pup-warning);
            color: white;
            padding: 0.125rem 0.5rem;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 600;
            margin-left: 0.5rem;
        }
        
        .upcoming-badge {
            background: var(--pup-success);
            color: white;
            padding: 0.125rem 0.5rem;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 600;
            margin-left: 0.5rem;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        // Escape key closes menus
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            notification.classList.remove('show');
        }
        
        // Tab navigation highlight
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('click', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Initialize functions
    updateAcademicInfo();
    updateEventDates();
    animateCounters();
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to PUP Event Management System! Check out our featured events.');
    }, 1000);
    
    // PUP motto display
    console.log('%c Polytechnic University of the Philippines ', 'background: #8B0000; color: #FFD700; font-size: 16px; font-weight: bold; padding: 10px;');
    console.log('%c "Tanglaw ng Bayan" - Est. 1904 ', 'background: #003366; color: white; font-size: 14px; padding: 8px;');
});