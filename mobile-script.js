// Mobile UI Management
class MobileManager {
    constructor() {
        // Prevent execution on desktop
        if (window.innerWidth > 768) return;

        // 1. Navigation Init (Always)
        this.menuBtn = document.getElementById('mobile-menu-btn');
        this.navOverlay = document.getElementById('mobile-nav');
        this.initMenu();

        // 3. Popup Init (Always check if popup exists)
        this.initPopup();

        // 2. Slide Init (Only if container exists)
        this.slidesContainer = document.querySelector('.slides-container');
        if (this.slidesContainer) {
            this.slides = document.querySelectorAll('.slide');
            this.indicators = document.querySelectorAll('.indicator');
            this.currentSlide = 0;
            this.isScrolling = false;
            this.initSlides();
        }
    }

    initMenu() {
        // Toggle Mobile Menu
        if (this.menuBtn && this.navOverlay) {
            this.menuBtn.addEventListener('click', () => {
                this.menuBtn.classList.toggle('active');
                this.navOverlay.classList.toggle('active');
            });
        }
    }

    initPopup() {
        // Mobile Popup Logic
        const popupOverlay = document.getElementById('mobile-popup');
        const imagePopupOverlay = document.getElementById('mobile-image-popup');

        if (!popupOverlay) return;

        const cards = document.querySelectorAll('.party-card, .figure-card');
        const popupName = popupOverlay.querySelector('.popup-name-mobile');
        const popupInfo = popupOverlay.querySelector('.popup-info-mobile');
        const popupDesc = popupOverlay.querySelector('.popup-desc-mobile');
        const popupContent = popupOverlay.querySelector('.popup-content-mobile');
        const galleryImages = popupOverlay.querySelectorAll('.popup-gallery-img-mobile');
        const largeImg = document.getElementById('mobile-large-img');

        // 1. Open Detail Popup
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const name = card.getAttribute('data-name');
                const info = card.getAttribute('data-info');
                const desc = card.getAttribute('data-desc');

                if (popupName) popupName.textContent = name;
                if (popupInfo) popupInfo.textContent = info;
                if (popupDesc) popupDesc.textContent = desc;

                popupOverlay.classList.add('active');
            });
        });

        // 2. Open Image Popup (2nd Depth)
        if (imagePopupOverlay && largeImg) {
            galleryImages.forEach(img => {
                img.addEventListener('click', (e) => {
                    e.stopPropagation(); // Don't close parent popup
                    largeImg.src = img.src;
                    imagePopupOverlay.classList.add('active');
                });
            });

            // Close Image Popup
            imagePopupOverlay.addEventListener('click', (e) => {
                if (e.target === imagePopupOverlay || e.target === largeImg) {
                    imagePopupOverlay.classList.remove('active');
                }
            });
        }

        // 3. Close Detail Popup (Clicking background)
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) {
                popupOverlay.classList.remove('active');
            }
        });

        // Prevent closing when clicking content
        if (popupContent) {
            popupContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    initSlides() {
        // Add scroll event listener
        this.slidesContainer.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });

        // Add click listeners to indicators
        if (this.indicators) {
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });
        }

        // Touch swipe support
        this.addTouchSupport();

        // Keyboard navigation
        this.addKeyboardSupport();

        // Update on load
        this.updateActiveIndicator();

        // Parallax effect
        this.addParallaxEffect();
    }

    handleScroll() {
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }

        this.scrollTimeout = setTimeout(() => {
            const scrollTop = this.slidesContainer.scrollTop;
            const slideHeight = window.innerHeight;
            const newSlide = Math.round(scrollTop / slideHeight);

            if (newSlide !== this.currentSlide) {
                this.currentSlide = newSlide;
                this.updateActiveIndicator();
            }
        }, 100);
    }

    updateActiveIndicator() {
        this.indicators.forEach((indicator, index) => {
            if (index === this.currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.currentSlide = index;
            const targetScroll = index * window.innerHeight;

            this.slidesContainer.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });

            this.updateActiveIndicator();
        }
    }

    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    addTouchSupport() {
        let touchStartY = 0;
        let touchEndY = 0;

        this.slidesContainer.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        this.slidesContainer.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(touchStartY, touchEndY);
        }, { passive: true });
    }

    handleSwipe(startY, endY) {
        const swipeThreshold = 50;
        const difference = startY - endY;

        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                // Swipe up - next slide
                this.nextSlide();
            } else {
                // Swipe down - previous slide
                this.prevSlide();
            }
        }
    }

    addKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowDown':
                case 'PageDown':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.slides.length - 1);
                    break;
            }
        });
    }
    addParallaxEffect() {
        if (!this.slidesContainer) return;

        this.slidesContainer.addEventListener('scroll', () => {
            const scrollTop = this.slidesContainer.scrollTop;

            this.slides.forEach((slide, index) => {
                const slideTop = index * window.innerHeight;
                const offset = scrollTop - slideTop;
                const background = slide.querySelector('.slide-bg');

                if (background) {
                    const parallaxSpeed = 0.5;
                    background.style.transform = `translateY(${offset * parallaxSpeed}px)`;
                }
            });
        }, { passive: true });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const mobileManager = new MobileManager();
});
