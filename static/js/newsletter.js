/**
 * Newsletter Module
 * Handles newsletter subscription functionality
 */

class Newsletter {
    constructor() {
        this.newsletterForm = document.getElementById('newsletterForm');
        this.init();
    }

    init() {
        if (!this.newsletterForm) return;

        this.newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const email = this.newsletterForm.querySelector('input[type="email"]');
        const submitBtn = this.newsletterForm.querySelector('button[type="submit"]');
        
        if (!email || !email.value.trim()) {
            this.showMessage('Пожалуйста, введите email адрес', 'error');
            return;
        }

        if (!this.isValidEmail(email.value)) {
            this.showMessage('Пожалуйста, введите корректный email адрес', 'error');
            return;
        }

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Подписываем...';

        // Simulate API call
        setTimeout(() => {
            this.showMessage('Спасибо за подписку! Проверьте вашу почту.', 'success');
            this.newsletterForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Подписаться';
        }, 1500);
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = this.newsletterForm.querySelector('.newsletter-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `newsletter-message alert alert-${type === 'error' ? 'danger' : 'success'} mt-2`;
        messageDiv.textContent = message;
        
        this.newsletterForm.appendChild(messageDiv);

        // Auto-remove success messages
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Newsletter();
});
