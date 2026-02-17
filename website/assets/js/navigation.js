/**
 * navigation.js
 * Lunaris Navigation - Highlight active page, smooth scrolling, mobile menu toggle
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Highlight active page
    highlightActivePage();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize mobile menu
    initMobileMenu();
});

/**
 * Highlight the current page in navigation
 */
function highlightActivePage() {
    // Get current page path
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Find all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // Check if this link is for the current page
        if (linkPath === currentPage || (currentPage === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            // Toggle nav list visibility
            navList.classList.toggle('active');
            
            // Animate hamburger menu
            this.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navList.contains(e.target)) {
                navList.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
        
        // Close menu when window is resized to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navList.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
}

/**
 * Scroll to top of page
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        highlightActivePage,
        initSmoothScrolling,
        initMobileMenu,
        scrollToTop
    };
}
