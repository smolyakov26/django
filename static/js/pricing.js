/**
 * Pricing Module
 * Handles pricing plan switching and modal functionality
 */

class PricingManager {
    constructor() {
        this.basicRadio = document.getElementById('basic');
        this.advancedRadio = document.getElementById('advanced');
        this.basicPrices = document.querySelectorAll('.basic-price');
        this.advancedPrices = document.querySelectorAll('.advanced-price');
        this.init();
    }

    init() {
        if (!this.basicRadio || !this.advancedRadio) return;

        // Add event listeners for pricing toggle
        this.basicRadio.addEventListener('change', () => this.togglePrices('basic'));
        this.advancedRadio.addEventListener('change', () => this.togglePrices('advanced'));

        // Initialize with default state
        this.togglePrices('basic');

        // Setup modals
        this.setupModals();
        this.setupForms();
    }

    togglePrices(plan) {
        if (plan === 'basic') {
            this.basicPrices.forEach(price => {
                price.classList.remove('d-none');
            });
            this.advancedPrices.forEach(price => {
                price.classList.add('d-none');
            });
        } else {
            this.basicPrices.forEach(price => {
                price.classList.add('d-none');
            });
            this.advancedPrices.forEach(price => {
                price.classList.remove('d-none');
            });
        }
    }

    setupModals() {
        // Package modal
        const packageModal = document.getElementById('packageModal');
        if (packageModal) {
            packageModal.addEventListener('show.bs.modal', (event) => {
                const button = event.relatedTarget;
                const pkg = button.getAttribute('data-package');
                
                const packageNames = {
                    'tandem': 'Тандем-прыжок',
                    'aff': 'Курс AFF',
                    'flight': 'Полётное обучение'
                };
                
                const basicPrices = {
                    'tandem': '15,000 ₽',
                    'aff': '85,000 ₽',
                    'flight': '45,000 ₽'
                };
                
                const advancedPrices = {
                    'tandem': '12,750 ₽',
                    'aff': '72,250 ₽',
                    'flight': '38,250 ₽'
                };
                
                document.getElementById('packageName').textContent = packageNames[pkg];
                
                const isAdvanced = this.advancedRadio.checked;
                const priceText = isAdvanced ? advancedPrices[pkg] : basicPrices[pkg];
                const typeText = isAdvanced ? ' (продвинутый)' : '';
                
                document.getElementById('packagePrice').textContent = `${priceText}${typeText}`;
            });
        }

        // Service modal
        const serviceModal = document.getElementById('serviceModal');
        if (serviceModal) {
            serviceModal.addEventListener('show.bs.modal', (event) => {
                const button = event.relatedTarget;
                const service = button.getAttribute('data-service');
                const price = button.getAttribute('data-price');
                
                document.getElementById('serviceName').textContent = service;
                document.getElementById('servicePrice').textContent = price;
            });
        }

        // Offer modal
        const offerModal = document.getElementById('offerModal');
        if (offerModal) {
            offerModal.addEventListener('show.bs.modal', (event) => {
                const button = event.relatedTarget;
                const offer = button.getAttribute('data-offer');
                
                const offerInfo = {
                    'group': {
                        title: 'Групповой прыжок -20%',
                        description: 'Скидка для групп от 4 человек на тандем-прыжки'
                    },
                    'first': {
                        title: 'Первый прыжок + видео бесплатно',
                        description: 'Съёмка первого тандема в подарок'
                    },
                    'referral': {
                        title: 'Приведи друга - 5000 ₽',
                        description: 'Скидка за каждого приведённого друга'
                    },
                    'weather': {
                        title: 'Гарантия погоды 100%',
                        description: 'Возврат или перенос при плохой погоде'
                    }
                };
                
                const info = offerInfo[offer];
                document.getElementById('offerTitle').textContent = info.title;
                document.getElementById('offerDescription').textContent = info.description;
                
                // Show/hide group fields
                const groupFields = document.getElementById('groupFields');
                if (offer === 'group') {
                    groupFields.style.display = 'block';
                    document.getElementById('offerGroupSize').required = true;
                } else {
                    groupFields.style.display = 'none';
                    document.getElementById('offerGroupSize').required = false;
                }
            });
        }
    }

    setupForms() {
        const forms = ['packageForm', 'serviceForm', 'offerForm'];
        
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    if (form.checkValidity()) {
                        const modal = form.closest('.modal');
                        alert('Спасибо! Ваша заявка отправлена. Мы свяжемся в ближайшее время.');
                        bootstrap.Modal.getInstance(modal).hide();
                        form.reset();
                    }
                    form.classList.add('was-validated');
                });
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PricingManager();
});
