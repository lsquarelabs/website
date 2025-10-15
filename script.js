/**
 * Animated LOCOMOTION title - walking effect
 * Only L, O, O, N move (positions 0, 1, 2, 9)
 * L and N move together in one direction
 * Both O's move together in the opposite direction
 * Title moves horizontally left/right while walking
 */
(function() {
    'use strict';

    const titleElement = document.getElementById('locomotion-title');

    if (!titleElement) {
        console.error('Locomotion title element not found');
        return;
    }

    // Get the text content - "LOCOMOTION"
    // Positions: L(0) O(1) C(2) O(3) M(4) O(5) T(6) I(7) O(8) N(9)
    const text = titleElement.textContent;

    // Clear the element
    titleElement.textContent = '';

    // Create spans for each letter
    text.split('').forEach((letter, index) => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = letter;

        // L(0) and N(9) - move together (group 1: -6px to +6px)
        if (index === 0 || index === 9) {
            span.classList.add('walk-group-1');
        }
        // O(1) and O(8) - move together opposite to L/N (group 2: +6px to -6px)
        else if (index === 1 || index === 8) {
            span.classList.add('walk-group-2');
        }
        // Middle letters C(2), O(3), M(4), O(5), T(6), I(7) - rock motion (group 3: -2px to +2px)
        else if (index >= 2 && index <= 7) {
            span.classList.add('walk-group-3');
        }

        titleElement.appendChild(span);
    });

    // Scroll detection to stop animation
    let isAnimating = true;
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
    const scrollThreshold = (window.innerHeight * headerHeight / 100) / 2; // Half of header height

    function handleScroll() {
        const scrollY = window.scrollY || window.pageYOffset;

        if (scrollY > scrollThreshold && isAnimating) {
            // Stop animation
            isAnimating = false;
            titleElement.classList.add('static');

            // Remove animation classes from all letters
            const letters = titleElement.querySelectorAll('.letter');
            letters.forEach(letter => {
                letter.classList.remove('walk-group-1', 'walk-group-2', 'walk-group-3');
            });
        } else if (scrollY <= scrollThreshold && !isAnimating) {
            // Resume animation
            isAnimating = true;
            titleElement.classList.remove('static');

            // Re-add animation classes
            const letters = titleElement.querySelectorAll('.letter');
            letters.forEach((letter, index) => {
                // L(0) and N(9) - move together (group 1: -6px to +6px)
                if (index === 0 || index === 9) {
                    letter.classList.add('walk-group-1');
                }
                // O(1) and O(8) - move together opposite to L/N (group 2: +6px to -6px)
                else if (index === 1 || index === 8) {
                    letter.classList.add('walk-group-2');
                }
                // Middle letters C(2), O(3), M(4), O(5), T(6), I(7) - rock motion (group 3: -2px to +2px)
                else if (index >= 2 && index <= 7) {
                    letter.classList.add('walk-group-3');
                }
            });
        }
    }

    // Add scroll event listener with throttling for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial check
    handleScroll();

})();

/**
 * Carousel/Gallery functionality
 */
(function() {
    'use strict';

    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        const container = carousel.querySelector('.carousel-container');
        const images = carousel.querySelectorAll('.carousel-img');
        const leftBtn = carousel.querySelector('.carousel-btn-left');
        const rightBtn = carousel.querySelector('.carousel-btn-right');
        const indicatorsContainer = carousel.querySelector('.carousel-indicators');

        if (!images.length) return;

        let currentIndex = 0;

        // Create indicators
        images.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        const indicators = carousel.querySelectorAll('.carousel-indicator');

        function updateCarousel() {
            // Update images
            images.forEach((img, index) => {
                img.classList.toggle('active', index === currentIndex);
            });

            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % images.length; // Wrap to start
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + images.length) % images.length; // Wrap to end
            updateCarousel();
        }

        // Event listeners
        leftBtn.addEventListener('click', prevSlide);
        rightBtn.addEventListener('click', nextSlide);

        // Keyboard navigation
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });

        // Optional: Auto-play (commented out by default)
        // setInterval(nextSlide, 5000);
    });

})();

/**
 * Smooth scroll navigation for project links
 */
(function() {
    'use strict';

    const projectLinks = document.querySelectorAll('.project-nav-card');

    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Get header height for offset
                const headerHeight = document.querySelector('.logo').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
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
