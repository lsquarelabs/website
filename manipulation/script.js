/**
 * Carousel/Gallery functionality
 */
(function() {
    'use strict';

    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        const container = carousel.querySelector('.carousel-container');
        const slides = carousel.querySelectorAll('.carousel-img');
        const leftBtn = carousel.querySelector('.carousel-btn-left');
        const rightBtn = carousel.querySelector('.carousel-btn-right');
        const indicatorsContainer = carousel.querySelector('.carousel-indicators');
        const captionElement = carousel.querySelector('.carousel-caption');

        if (!slides.length) return;

        let currentIndex = 0;

        // Create indicators only if there's more than one slide
        if (slides.length > 1) {
            slides.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.className = 'carousel-indicator';
                if (index === 0) indicator.classList.add('active');
                indicator.addEventListener('click', () => goToSlide(index));
                indicatorsContainer.appendChild(indicator);
            });
        }

        const indicators = carousel.querySelectorAll('.carousel-indicator');

        function updateCarousel() {
            // Update images
            slides.forEach((slide, index) => {
                const isActive = index === currentIndex;
                slide.classList.toggle('active', isActive);

                if (!isActive && slide.tagName === 'VIDEO') {
                    slide.pause();
                    slide.currentTime = 0;
                }
            });

            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });

            if (captionElement) {
                const activeSlide = slides[currentIndex];
                const caption = activeSlide?.dataset?.caption || activeSlide?.getAttribute('alt') || activeSlide?.getAttribute('aria-label') || '';
                captionElement.textContent = caption;
                captionElement.classList.toggle('hidden', !caption);
            }
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length; // Wrap to start
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length; // Wrap to end
            updateCarousel();
        }

        // Event listeners (only if buttons exist)
        if (leftBtn) {
            leftBtn.addEventListener('click', prevSlide);
        }
        if (rightBtn) {
            rightBtn.addEventListener('click', nextSlide);
        }

        // Keyboard navigation (only for multi-slide carousels)
        if (slides.length > 1) {
            carousel.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') prevSlide();
                if (e.key === 'ArrowRight') nextSlide();
            });
        }

        // Optional: Auto-play (commented out by default)
        // setInterval(nextSlide, 5000);

        // Initial render to ensure captions/indicators sync
        updateCarousel();
    });

})();

/**
 * Disable right-click and drag functionality
 */
(function() {
    'use strict';

    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable drag on images and links
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'A') {
            e.preventDefault();
            return false;
        }
    });

    // Disable selection drag
    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // Add CSS to prevent image dragging
    const style = document.createElement('style');
    style.textContent = `
        img {
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
            pointer-events: auto;
        }
    `;
    document.head.appendChild(style);

})();
