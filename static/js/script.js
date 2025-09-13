/**
 * Enhanced JavaScript for Skybound Academy website
 * Includes improved error handling, accessibility, and performance optimizations
 */

// Utility functions
const utils = {
    /**
     * Get CSRF token from meta tag or cookie
     */
    getCSRFToken() {
        const metaToken = document.querySelector("meta[name='csrf-token']");
        if (metaToken) {
            return metaToken.getAttribute('content');
        }
        
        // Fallback to cookie
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return value;
            }
        }
        return null;
    },

    /**
     * Show user-friendly notifications
     */
    showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                font-weight: 600;
                z-index: 10000;
                max-width: 400px;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            `;
            document.body.appendChild(notification);
        }

        // Set notification style based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#007bff'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;
        
        // Show notification
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
        
        // Hide after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
        }, 5000);
    },

    /**
     * Debounce function to limit function calls
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Mobile menu functionality
class MobileMenu {
    constructor() {
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.menu = document.querySelector('.nav-menu');
        this.links = document.querySelectorAll('.nav-menu a');
        
        if (this.toggle && this.menu) {
            this.init();
        }
    }

    init() {
        this.toggle.addEventListener('click', this.toggleMenu.bind(this));
        
        // Close menu when clicking on links
        this.links.forEach(link => {
            link.addEventListener('click', this.closeMenu.bind(this));
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.menu.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const isActive = this.menu.classList.toggle('active');
        this.toggle.classList.toggle('active');
        this.toggle.setAttribute('aria-expanded', String(isActive));
        
        if (isActive) {
            this.menu.querySelector('a')?.focus();
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMenu() {
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
        this.toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

// Exit intent popup functionality
class ExitIntentPopup {
    constructor() {
        this.popup = document.getElementById('exitPopup');
        this.form = document.getElementById('popupForm');
        this.closeBtn = document.querySelector('.close-popup');
        this.emailInput = document.getElementById('popupEmail');
        
        this.hasShown = localStorage.getItem('popupShown') === 'true';
        this.exitIntentTimeout = null;
        
        if (this.popup) {
            this.init();
        }
    }

    init() {
        // Exit intent detection
        document.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        
        // Close button
        this.closeBtn?.addEventListener('click', this.closePopup.bind(this));
        
        // Close on outside click
        this.popup.addEventListener('click', (e) => {
            if (e.target === this.popup) {
                this.closePopup();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.popup.style.display === 'flex') {
                this.closePopup();
            }
        });

        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    handleMouseLeave(e) {
        if (e.clientY <= 0 && !this.hasShown && !this.exitIntentTimeout) {
            this.exitIntentTimeout = setTimeout(() => {
                this.openPopup();
                this.hasShown = true;
                localStorage.setItem('popupShown', 'true');
            }, 250);
        }
    }

    openPopup() {
        if (!this.popup) return;
        
        this.popup.style.display = 'flex';
        this.popup.setAttribute('aria-hidden', 'false');
        
        // Focus on email input
        setTimeout(() => {
            this.emailInput?.focus();
        }, 100);
        
        document.body.style.overflow = 'hidden';
    }

    closePopup() {
        if (!this.popup) return;
        
        this.popup.style.display = 'none';
        this.popup.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        if (this.exitIntentTimeout) {
            clearTimeout(this.exitIntentTimeout);
            this.exitIntentTimeout = null;
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const email = this.emailInput?.value?.trim();
        if (!email) {
            utils.showNotification('Пожалуйста, введите email', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            utils.showNotification('Пожалуйста, введите корректный email', 'error');
            return;
        }

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn?.textContent;
        
        try {
            // Show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправка...';
            }

            const response = await fetch('/api/subscribe/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': utils.getCSRFToken(),
                },
                body: JSON.stringify({
                    email: email.toLowerCase(),
                    source: 'popup'
                }),
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                utils.showNotification(
                    data.message || `Спасибо! Промокод отправлен на ${email}`,
                    'success'
                );
                this.form.reset();
                this.closePopup();
            } else {
                utils.showNotification(
                    data.error || 'Произошла ошибка. Попробуйте позже.',
                    'error'
                );
            }
        } catch (error) {
            console.error('Subscription error:', error);
            utils.showNotification(
                'Сеть недоступна. Проверьте подключение к интернету.',
                'error'
            );
        } finally {
            // Restore button state
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    }
}

// Hero slider functionality
class HeroSlider {
    constructor() {
        this.slider = document.querySelector('.hero-slider');
        this.slides = Array.from(document.querySelectorAll('.hero-slide'));
        this.prevBtn = document.querySelector('.hero-control.prev');
        this.nextBtn = document.querySelector('.hero-control.next');
        this.dotsContainer = document.querySelector('.hero-dots');
        
        this.currentSlide = 0;
        this.autoplayTimer = null;
        this.autoplayDelay = 6000;
        this.isPlaying = false;
        
        if (this.slider && this.slides.length > 0) {
            this.init();
        }
    }

    init() {
        this.createDots();
        this.goToSlide(0);
        this.bindEvents();
        this.startAutoplay();
    }

    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);
            dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
            dot.setAttribute('tabindex', index === 0 ? '0' : '-1');
            dot.classList.add('hero-dot');
            
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.restartAutoplay();
            });
            
            this.dotsContainer.appendChild(dot);
        });
    }

    bindEvents() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => {
            this.prevSlide();
            this.restartAutoplay();
        });
        
        this.nextBtn?.addEventListener('click', () => {
            this.nextSlide();
            this.restartAutoplay();
        });

        // Pause on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
        this.slider.addEventListener('mouseleave', () => this.startAutoplay());

        // Keyboard navigation
        this.slider.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    this.restartAutoplay();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    this.restartAutoplay();
                    break;
            }
        });

        // Pause when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoplay();
            } else {
                this.startAutoplay();
            }
        });
    }

    goToSlide(index) {
        if (!this.slides.length) return;
        
        this.currentSlide = (index + this.slides.length) % this.slides.length;
        
        this.slides.forEach((slide, i) => {
            const isActive = i === this.currentSlide;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', String(!isActive));
        });

        // Update dots
        if (this.dotsContainer) {
            const dots = this.dotsContainer.children;
            Array.from(dots).forEach((dot, i) => {
                const isActive = i === this.currentSlide;
                dot.setAttribute('aria-selected', String(isActive));
                dot.setAttribute('tabindex', isActive ? '0' : '-1');
            });
        }
    }

    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    }

    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    }

    startAutoplay() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.autoplayTimer = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
        this.isPlaying = false;
    }

    restartAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

// Performance optimizations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Optimize scroll events
        this.optimizeScrollEvents();
        
        // Preload critical resources
        this.preloadCriticalResources();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    optimizeScrollEvents() {
        let ticking = false;
        
        const handleScroll = () => {
            // Add scroll-based functionality here
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        });
    }

    preloadCriticalResources() {
        // Preload critical CSS and fonts
        const criticalResources = [
            '/static/css/style.css',
            '/static/css/components.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize core components
        new MobileMenu();
        new ExitIntentPopup();
        new HeroSlider();
        new PerformanceOptimizer();
        
        // Initialize page-specific modules
        // These will only initialize if their respective elements exist
        if (document.querySelector('[data-counter]')) {
            // Counter animation will auto-initialize
        }
        if (document.getElementById('basic') && document.getElementById('advanced')) {
            // Pricing toggle will auto-initialize
        }
        if (document.getElementById('contactPhone')) {
            // Contact form will auto-initialize
        }
        if (document.querySelector('.gallery-thumb')) {
            // Gallery will auto-initialize
        }
        if (document.querySelector('a[href^="#"]')) {
            // Smooth scroll will auto-initialize
        }
        if (document.querySelector('[data-bs-toggle="tooltip"]')) {
            // Tooltips will auto-initialize
        }
        if (document.getElementById('newsletterForm')) {
            // Newsletter will auto-initialize
        }
        if (document.querySelector('.error-illustration')) {
            // Error pages will auto-initialize
        }
        
        console.log('Skybound Academy: All components initialized successfully');
    } catch (error) {
        console.error('Skybound Academy: Error initializing components:', error);
    }
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations and timers when page is hidden
        console.log('Page hidden - pausing animations');
    } else {
        // Resume when page becomes visible
        console.log('Page visible - resuming animations');
    }
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // You could send this to a logging service in production
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // You could send this to a logging service in production
});
