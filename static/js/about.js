/**
 * About Page Module
 * Handles animations and interactions specific to the about page
 */

class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupTimelineAnimations();
        this.setupTeamCardInteractions();
        this.setupAchievementAnimations();
        this.addAnimationStyles();
    }

    setupTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        if (timelineItems.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.1 });
        
        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'all 0.6s ease';
            observer.observe(item);
        });
    }

    setupTeamCardInteractions() {
        const teamCards = document.querySelectorAll('.team-card');
        if (teamCards.length === 0) return;

        teamCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    setupAchievementAnimations() {
        const achievements = document.querySelectorAll('.achievement-item');
        if (achievements.length === 0) return;

        const achievementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    achievementObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        achievements.forEach(achievement => {
            achievement.style.opacity = '0';
            achievement.style.transform = 'translateY(20px)';
            achievementObserver.observe(achievement);
        });
    }

    addAnimationStyles() {
        // Check if styles already exist
        if (document.getElementById('about-animations')) return;

        const style = document.createElement('style');
        style.id = 'about-animations';
        style.textContent = `
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AboutPage();
});
