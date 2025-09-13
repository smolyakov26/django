/**
 * Smooth Scroll Module
 * Handles smooth scrolling for anchor links
 */

class SmoothScroll {
    constructor() {
        this.anchorLinks = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        if (this.anchorLinks.length === 0) return;

        this.anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTarget(anchor.getAttribute('href'));
            });
        });
    }

    scrollToTarget(target) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        const headerHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SmoothScroll();
});
