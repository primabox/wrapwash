// Hero Slider functionality
document.addEventListener('DOMContentLoaded', function() {
    const paginationDots = document.querySelectorAll('.pagination-dot');
    const heroContents = document.querySelectorAll('.hero-slide-content');
    const heroImages = document.querySelectorAll('.hero-background-image');
    let currentSlide = 0;
    let isAnimating = false;

    // Function to change slide
    function changeSlide(targetSlide) {
        if (isAnimating || targetSlide === currentSlide) return;
        
        isAnimating = true;
        
        // Get current and target elements
        const currentContent = document.querySelector(`.hero-slide-content[data-slide="${currentSlide}"]`);
        const targetContent = document.querySelector(`.hero-slide-content[data-slide="${targetSlide}"]`);
        const currentImage = document.querySelector(`.hero-background-image[data-slide="${currentSlide}"]`);
        const targetImage = document.querySelector(`.hero-background-image[data-slide="${targetSlide}"]`);
        
        // Fade out current content
        currentContent.classList.remove('fade-in');
        currentContent.classList.add('fade-out');
        
        // Fade out current image
        currentImage.classList.remove('fade-in');
        currentImage.classList.add('fade-out');
        
        // Wait for fade out animation
        setTimeout(() => {
            // Hide current content
            currentContent.style.opacity = '0';
            currentContent.style.pointerEvents = 'none';
            currentImage.style.opacity = '0';
            
            // Prepare target content
            targetContent.style.opacity = '0';
            targetContent.style.pointerEvents = 'auto';
            targetImage.style.opacity = '0';
            
            // Remove fade-out classes
            currentContent.classList.remove('fade-out');
            currentImage.classList.remove('fade-out');
            
            // Trigger reflow
            void targetContent.offsetWidth;
            void targetImage.offsetWidth;
            
            // Fade in target content and image
            targetContent.classList.add('fade-in');
            targetImage.classList.add('fade-in');
            targetContent.style.opacity = '1';
            targetImage.style.opacity = '1';
            
            // Update pagination dots
            paginationDots.forEach(dot => dot.classList.remove('active'));
            document.querySelector(`.pagination-dot[data-slide="${targetSlide}"]`).classList.add('active');
            
            // Update current slide
            currentSlide = targetSlide;
            
            // Reset animation flag
            setTimeout(() => {
                isAnimating = false;
            }, 100);
        }, 600);
    }

    // Add click event listeners to pagination dots
    paginationDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const targetSlide = parseInt(this.getAttribute('data-slide'));
            changeSlide(targetSlide);
        });
    });

    // Auto-slide functionality (optional - uncomment if you want auto-play)
    /*
    setInterval(() => {
        const nextSlide = (currentSlide + 1) % paginationDots.length;
        changeSlide(nextSlide);
    }, 5000); // Change slide every 5 seconds
    */
});
