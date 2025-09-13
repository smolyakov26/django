/**
 * Error Pages Module
 * Handles functionality for 404, 500, and other error pages
 */

class ErrorPages {
    constructor() {
        this.init();
    }

    init() {
        this.setupSearchForm();
        this.animateErrorIllustration();
    }

    setupSearchForm() {
        const searchForm = document.querySelector('form');
        if (!searchForm) return;

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchInput = searchForm.querySelector('input[type="search"]');
            if (searchInput && searchInput.value.trim()) {
                // Redirect to search results or home page with search query
                window.location.href = `/?search=${encodeURIComponent(searchInput.value.trim())}`;
            }
        });
    }

    animateErrorIllustration() {
        const illustration = document.querySelector('.error-illustration i');
        if (!illustration) return;

        illustration.style.transition = 'transform 0.3s ease';
        
        // Add hover effect
        illustration.addEventListener('mouseenter', () => {
            illustration.style.transform = 'scale(1.1) rotate(5deg)';
        });

        illustration.addEventListener('mouseleave', () => {
            illustration.style.transform = 'scale(1) rotate(0deg)';
        });

        // Add periodic animation
        setInterval(() => {
            illustration.style.transform = 'scale(1.05) rotate(2deg)';
            setTimeout(() => {
                illustration.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ErrorPages();
});
