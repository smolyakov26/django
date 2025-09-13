/**
 * Tooltips Module
 * Initializes Bootstrap tooltips
 */

class TooltipManager {
    constructor() {
        this.tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        this.init();
    }

    init() {
        if (this.tooltipElements.length === 0) return;

        this.tooltipElements.forEach(tooltipTriggerEl => {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TooltipManager();
});
