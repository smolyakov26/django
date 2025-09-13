/**
 * Gallery Module
 * Handles image gallery functionality for product pages
 */

class Gallery {
    constructor() {
        this.thumbnails = document.querySelectorAll('.gallery-thumb');
        this.mainImage = document.querySelector('.col-lg-6 img');
        this.init();
    }

    init() {
        if (this.thumbnails.length === 0 || !this.mainImage) return;

        this.thumbnails.forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchImage(thumb);
            });
        });

        this.setupProductForms();
    }

    switchImage(thumbnail) {
        const newSrc = thumbnail.getAttribute('href') || thumbnail.querySelector('img').src;
        const newAlt = thumbnail.querySelector('img').alt;
        
        // Add fade effect
        this.mainImage.style.opacity = '0.5';
        
        setTimeout(() => {
            this.mainImage.src = newSrc;
            this.mainImage.alt = newAlt;
            this.mainImage.style.opacity = '1';
        }, 150);
        
        // Update active thumbnail
        this.thumbnails.forEach(thumb => {
            thumb.classList.remove('active');
        });
        thumbnail.classList.add('active');
    }

    setupProductForms() {
        // Consultation form
        const consultationForm = document.getElementById('consultationForm');
        if (consultationForm) {
            consultationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (consultationForm.checkValidity()) {
                    alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
                    bootstrap.Modal.getInstance(document.getElementById('consultationModal')).hide();
                    consultationForm.reset();
                }
                consultationForm.classList.add('was-validated');
            });
        }

        // Review form
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (reviewForm.checkValidity()) {
                    alert('Спасибо за отзыв! Он будет опубликован после модерации.');
                    bootstrap.Modal.getInstance(document.getElementById('reviewModal')).hide();
                    reviewForm.reset();
                }
                reviewForm.classList.add('was-validated');
            });
        }

        // Load more reviews
        const loadMoreReviews = document.getElementById('loadMoreReviews');
        if (loadMoreReviews) {
            loadMoreReviews.addEventListener('click', function() {
                this.textContent = 'Загрузка...';
                setTimeout(() => {
                    this.textContent = 'Все отзывы загружены';
                    this.disabled = true;
                }, 1000);
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Gallery();
});
