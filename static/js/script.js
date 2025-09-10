// Переключение мобильного меню
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', String(isActive));
        if (isActive) {
            navMenu.querySelector('a')?.focus();
        }
    });
}

// Закрывать меню при клике по ссылке
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu?.classList.remove('active');
        mobileMenuToggle?.classList.remove('active');
        mobileMenuToggle?.setAttribute('aria-expanded', 'false');
    });
});

// Попап при попытке ухода
const exitPopup = document.getElementById('exitPopup');
const popupForm = document.getElementById('popupForm');

function openPopup() {
    if (!exitPopup) return;
    exitPopup.style.display = 'flex';
    exitPopup.querySelector('input,button,[href]')?.focus();
}

function closePopup() {
    if (!exitPopup) return;
    exitPopup.style.display = 'none';
    mobileMenuToggle?.focus();
}

let exitIntentTimeout;
document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 && !localStorage.getItem('popupShown')) {
        clearTimeout(exitIntentTimeout);
        exitIntentTimeout = setTimeout(() => {
            openPopup();
            localStorage.setItem('popupShown', 'true');
        }, 250);
    }
});

// Кнопка закрытия попапа
document.querySelector('.close-popup')?.addEventListener('click', closePopup);

// Закрыть по клику вне окна
exitPopup?.addEventListener('click', function(e) {
    if (e.target === this) {
        closePopup();
    }
});

// Закрыть по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopup();
});

// Отправка формы попапа
popupForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Ваш промокод отправлен!');
    closePopup();
});

// Слайдер героя (3 слайда)
const hero = document.querySelector('.hero');
const slider = document.querySelector('.hero-slider');
const slides = Array.from(document.querySelectorAll('.hero-slide'));
const prevBtn = document.querySelector('.hero-control.prev');
const nextBtn = document.querySelector('.hero-control.next');
const dotsContainer = document.querySelector('.hero-dots');

let currentSlide = 0;
let autoplayTimer;
const AUTOPLAY_MS = 6000;

function goToSlide(index) {
    if (!slides.length) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((s, i) => {
        const isActive = i === currentSlide;
        s.classList.toggle('is-active', isActive);
        s.setAttribute('aria-hidden', String(!isActive));
        dotsContainer?.children[i]?.setAttribute('aria-selected', String(isActive));
        dotsContainer?.children[i]?.setAttribute('tabindex', isActive ? '0' : '-1');
    });
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_MS);
}

function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
}

function initDots() {
    if (!dotsContainer || !slides.length) return;
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.setAttribute('tabindex', i === 0 ? '0' : '-1');
        btn.addEventListener('click', () => {
            goToSlide(i);
            startAutoplay();
        });
        dotsContainer.appendChild(btn);
    });
}

function initHeroSlider() {
    if (!slider || !slides.length) return;
    initDots();
    goToSlide(0);
    prevBtn?.addEventListener('click', () => { prevSlide(); startAutoplay(); });
    nextBtn?.addEventListener('click', () => { nextSlide(); startAutoplay(); });
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    startAutoplay();
}

initHeroSlider();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("popupForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("popupEmail").value;
      const csrfToken = document.querySelector("meta[name='csrf-token']").content;

      try {
        const res = await fetch("/api/subscribe/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (data.success) {
          alert("Спасибо! Мы отправили промокод на " + email);
          form.reset();
          document.getElementById("exitPopup").style.display = "none";
        } else {
          alert("Ошибка: " + (data.error || "попробуйте снова"));
        }
      } catch (err) {
        alert("Сеть недоступна, попробуйте позже.");
      }
    });
  }
});
