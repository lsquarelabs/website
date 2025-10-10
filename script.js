/**
 * Interactive square that moves opposite to cursor position
 */
(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        maxMove: 60, // Maximum pixels the square can move from center
        smoothingFactor: 1.5 // Higher = smoother but less movement
    };

    // Cache DOM elements
    const square = document.querySelector('.moving-square');
    const trailSquares = document.querySelectorAll('.square-trail');

    if (!square) {
        console.error('Moving square element not found');
        return;
    }

    /**
     * Calculate and apply square movement based on cursor position
     * @param {MouseEvent} event - Mouse move event
     */
    function handleMouseMove(event) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Calculate distance from center
        const deltaX = event.clientX - centerX;
        const deltaY = event.clientY - centerY;

        // Move square in opposite direction (inverse of cursor position)
        // Normalize based on window size and apply smoothing factor
        const moveX = -(deltaX / window.innerWidth) * CONFIG.maxMove * CONFIG.smoothingFactor;
        const moveY = -(deltaY / window.innerHeight) * CONFIG.maxMove * CONFIG.smoothingFactor;

        // Apply transform to main square
        square.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;

        // Apply transform to trail squares with same position (CSS handles the delay)
        trailSquares.forEach((trailSquare) => {
            trailSquare.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
        });
    }

    /**
     * Reset square position when mouse leaves the window
     */
    function handleMouseLeave() {
        square.style.transform = 'translate(-50%, -50%)';
        trailSquares.forEach((trailSquare) => {
            trailSquare.style.transform = 'translate(-50%, -50%)';
        });
    }

    // Event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
    });
})();
