/**
 * Programs Page Module
 * Handles program filtering, sorting, and view toggling
 */

class ProgramsPage {
    constructor() {
        this.filterButtons = document.querySelectorAll('[data-filter]');
        this.programItems = document.querySelectorAll('.program-item');
        this.noResults = document.getElementById('noResults');
        this.programsGrid = document.getElementById('programsGrid');
        this.sortSelect = document.getElementById('sortSelect');
        this.viewToggle = document.getElementById('viewToggle');
        this.init();
    }

    init() {
        this.setupFiltering();
        this.setupSorting();
        this.setupViewToggle();
    }

    setupFiltering() {
        if (this.filterButtons.length === 0) return;

        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterPrograms(filter, button);
            });
        });
    }

    setupSorting() {
        if (!this.sortSelect) return;

        this.sortSelect.addEventListener('change', () => {
            const sortBy = this.sortSelect.value;
            this.sortPrograms(sortBy);
        });
    }

    setupViewToggle() {
        if (!this.viewToggle) return;

        this.viewToggle.addEventListener('click', () => {
            const currentView = this.viewToggle.getAttribute('data-view');
            const newView = currentView === 'grid' ? 'list' : 'grid';
            this.toggleView(newView);
        });
    }

    filterPrograms(filter, activeButton) {
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
        
        // Filter items
        let visibleCount = 0;
        this.programItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const difficulty = item.getAttribute('data-difficulty');
            const featured = item.getAttribute('data-featured');
            
            let show = false;
            
            if (filter === 'all') {
                show = true;
            } else if (filter === 'beginner') {
                show = difficulty === 'beginner';
            } else if (filter === 'featured') {
                show = featured === 'true';
            } else {
                show = category === filter;
            }
            
            if (show) {
                item.classList.remove('d-none');
                item.style.animation = 'fadeInUp 0.3s ease forwards';
                visibleCount++;
            } else {
                item.classList.add('d-none');
            }
        });
        
        // Show/hide no results message
        if (visibleCount === 0) {
            this.noResults.classList.remove('d-none');
            this.programsGrid.classList.add('d-none');
        } else {
            this.noResults.classList.add('d-none');
            this.programsGrid.classList.remove('d-none');
        }
    }

    sortPrograms(sortBy) {
        const container = this.programsGrid;
        const items = Array.from(container.children).filter(item => 
            item.classList.contains('program-item')
        );
        
        items.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
                case 'price-desc':
                    return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
                case 'name':
                    return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
                case 'duration':
                    return parseFloat(b.getAttribute('data-duration')) - parseFloat(a.getAttribute('data-duration'));
                default:
                    return 0;
            }
        });
        
        items.forEach(item => container.appendChild(item));
    }

    toggleView(newView) {
        const container = this.programsGrid;
        const items = container.querySelectorAll('.program-item');
        
        this.viewToggle.setAttribute('data-view', newView);
        
        if (newView === 'list') {
            container.classList.add('list-view');
            this.viewToggle.innerHTML = '<i class="bi bi-grid-3x3-gap"></i> Сетка';
        } else {
            container.classList.remove('list-view');
            this.viewToggle.innerHTML = '<i class="bi bi-list"></i> Список';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProgramsPage();
});
