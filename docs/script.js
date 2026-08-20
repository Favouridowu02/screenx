// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for scroll animations (if elements aren't immediately visible)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    // Remove fade-in-up if it was added manually in HTML to let JS handle it on scroll
    // but in our case, the hero has it by default and features don't.
    observer.observe(card);
});

// Dynamic 3D Tilt Effect on the Mockup Window
const mockupWrapper = document.querySelector('.hero-image-wrapper');
const glassFrame = document.querySelector('.glass-frame');

if (mockupWrapper && glassFrame) {
    mockupWrapper.addEventListener('mousemove', (e) => {
        const rect = mockupWrapper.getBoundingClientRect();
        
        // Calculate mouse position relative to the center of the element (-1 to 1)
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        
        // Apply rotation (max 10 degrees)
        const rotateX = y * -10;
        const rotateY = x * 10;
        
        glassFrame.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        glassFrame.style.transition = 'transform 0.1s ease-out';
    });
    
    mockupWrapper.addEventListener('mouseleave', () => {
        // Reset to default tilt
        glassFrame.style.transform = 'rotateX(2deg) rotateY(0deg)';
        glassFrame.style.transition = 'transform 0.5s ease-out';
    });
}
