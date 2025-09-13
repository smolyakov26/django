/**
 * Contact Form Module
 * Handles contact form functionality including phone mask, message counter, and working status
 */

class ContactForm {
    constructor() {
        this.phoneInput = document.getElementById('contactPhone');
        this.contactForm = document.getElementById('contactForm');
        this.messageTextarea = document.getElementById('contactMessage');
        this.messageCounter = document.getElementById('messageCounter');
        this.successMessage = document.getElementById('successMessage');
        this.errorMessage = document.getElementById('errorMessage');
        this.init();
    }

    init() {
        if (this.phoneInput) {
            this.setupPhoneMask();
        }
        
        if (this.contactForm) {
            this.setupFormValidation();
            this.setupFormReset();
        }

        if (this.messageTextarea && this.messageCounter) {
            this.setupMessageCounter();
        }

        this.updateWorkingStatus();
        setInterval(() => this.updateWorkingStatus(), 60000); // Update every minute

        this.handleUrlParameters();
    }

    setupPhoneMask() {
        this.phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('7')) value = value.substring(1);
            if (value.startsWith('8')) value = value.substring(1);
            
            let formattedValue = '+7';
            if (value.length > 0) {
                formattedValue += ' (' + value.substring(0, 3);
                if (value.length > 3) {
                    formattedValue += ') ' + value.substring(3, 6);
                    if (value.length > 6) {
                        formattedValue += '-' + value.substring(6, 8);
                        if (value.length > 8) {
                            formattedValue += '-' + value.substring(8, 10);
                        }
                    }
                }
            }
            
            e.target.value = formattedValue;
        });
    }

    setupMessageCounter() {
        this.messageTextarea.addEventListener('input', () => {
            const length = this.messageTextarea.value.length;
            this.messageCounter.textContent = length;
            
            if (length > 1000) {
                this.messageCounter.parentElement.classList.add('text-danger');
                this.messageTextarea.classList.add('is-invalid');
            } else {
                this.messageCounter.parentElement.classList.remove('text-danger');
                this.messageTextarea.classList.remove('is-invalid');
            }
        });
    }

    updateWorkingStatus() {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const hour = now.getHours();
        const statusElement = document.getElementById('workingStatus');
        
        if (!statusElement) return;
        
        let isOpen = false;
        
        if (day >= 1 && day <= 5) { // Monday to Friday
            isOpen = hour >= 6 && hour < 23;
        } else { // Saturday and Sunday
            isOpen = hour >= 8 && hour < 22;
        }
        
        if (isOpen) {
            statusElement.className = 'badge bg-success';
            statusElement.innerHTML = '<i class="bi bi-circle-fill me-1" aria-hidden="true"></i>Открыто';
        } else {
            statusElement.className = 'badge bg-danger';
            statusElement.innerHTML = '<i class="bi bi-circle-fill me-1" aria-hidden="true"></i>Закрыто';
        }
    }

    setupFormValidation() {
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Hide previous messages
            if (this.successMessage) this.successMessage.classList.add('d-none');
            if (this.errorMessage) this.errorMessage.classList.add('d-none');
            
            if (this.contactForm.checkValidity()) {
                // Show loading state
                const submitBtn = this.contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Отправка...';
                
                // Simulate form submission
                setTimeout(() => {
                    // Reset button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    
                    // Show success message
                    if (this.successMessage) {
                        this.successMessage.classList.remove('d-none');
                        this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    
                    // Reset form
                    this.contactForm.reset();
                    this.contactForm.classList.remove('was-validated');
                    if (this.messageCounter) this.messageCounter.textContent = '0';
                }, 2000);
            }
            
            this.contactForm.classList.add('was-validated');
        });
    }

    setupFormReset() {
        this.contactForm.addEventListener('reset', () => {
            this.contactForm.classList.remove('was-validated');
            if (this.successMessage) this.successMessage.classList.add('d-none');
            if (this.errorMessage) this.errorMessage.classList.add('d-none');
            if (this.messageCounter) this.messageCounter.textContent = '0';
        });
    }

    handleUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Auto-fill subject based on URL parameters
        const subject = urlParams.get('subject');
        if (subject) {
            const subjectSelect = document.getElementById('contactSubject');
            if (subjectSelect && subjectSelect.querySelector(`option[value="${subject}"]`)) {
                subjectSelect.value = subject;
            }
        }
        
        // Auto-fill message based on URL parameters
        const message = urlParams.get('message');
        if (message && this.messageTextarea) {
            this.messageTextarea.value = decodeURIComponent(message);
            this.messageTextarea.dispatchEvent(new Event('input'));
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});
