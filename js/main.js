// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.aside-bar');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    // Toggle sidebar on menu button click
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Handle mobile navigation item clicks
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            mobileNavItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Close sidebar after clicking a nav item on mobile
            if (window.innerWidth <= 935) {
                sidebar.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 935) {
            sidebar.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Initialize tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);
    });

    function showTooltip(e) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);

        const rect = this.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        // Position tooltip
        tooltip.style.top = `${rect.top - tooltipRect.height - 10}px`;
        tooltip.style.left = `${rect.left + (rect.width - tooltipRect.width) / 2}px`;
    }

    function hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
});

// Lazy loading for images
if ('loading' in HTMLImageElement.prototype) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        // Only set src from data-src if provided
        if (img.dataset && img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Handle post interactions
document.addEventListener('click', function(e) {
    // Like button functionality
    if (e.target.closest('.like-button')) {
        const likeButton = e.target.closest('.like-button');
        likeButton.classList.toggle('liked');
        
        // Update like count
        const likeCount = likeButton.nextElementSibling;
        if (likeCount && likeCount.classList.contains('like-count')) {
            const currentLikes = parseInt(likeCount.textContent);
            likeCount.textContent = likeButton.classList.contains('liked') ? 
                currentLikes + 1 : 
                Math.max(0, currentLikes - 1);
        }
    }

    // Save post functionality
    if (e.target.closest('.save-button')) {
        const saveButton = e.target.closest('.save-button');
        saveButton.classList.toggle('saved');
        
        // Update save button icon
        const icon = saveButton.querySelector('svg');
        if (icon) {
            if (saveButton.classList.contains('saved')) {
                icon.innerHTML = '<path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path>';
            } else {
                icon.innerHTML = '<path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2Z"></path>';
            }
        }
    }
});

// Infinite scroll
let isLoading = false;
const loadMoreThreshold = 1000; // pixels from bottom

window.addEventListener('scroll', function() {
    if (isLoading) return;
    
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    
    if (pageHeight - scrollPosition < loadMoreThreshold) {
        loadMorePosts();
    }
});

async function loadMorePosts() {
    isLoading = true;
    
    // Show loading spinner
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    document.querySelector('main').appendChild(loadingSpinner);
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Here you would typically fetch more posts from an API
        // For now, we'll just duplicate existing posts as an example
        const postsContainer = document.querySelector('.columna-imagenes');
        const posts = postsContainer.innerHTML;
        postsContainer.insertAdjacentHTML('beforeend', posts);
        
    } catch (error) {
        console.error('Error loading more posts:', error);
    } finally {
        // Remove loading spinner
        if (document.body.contains(loadingSpinner)) {
            loadingSpinner.remove();
        }
        isLoading = false;
    }
}

// Handle image loading and error states
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading state
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // Handle image loading errors
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23f5f5f5%22%2F%3E%3Ctext%20x%3D%22100%22%20y%3D%22100%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23999%22%3EImage%20not%20found%3C%2Ftext%3E%3C%2Fsvg%3E';
            this.alt = 'Image not found';
            this.classList.add('error');
        });
        
        // Add loading class if image is not already loaded
        if (!img.complete) {
            img.classList.add('loading');
        } else if (img.naturalWidth === 0) {
            // Handle broken images that are already in cache
            img.dispatchEvent(new Event('error'));
        } else {
            img.classList.add('loaded');
        }
    });
});

// Handle dark mode toggle
document.addEventListener('DOMContentLoaded', function() {
    const themeToggleBtn = document.querySelector('.theme-toggle-btn');
    const themeIcon = document.querySelector('.theme-toggle .theme-icon');
    const themeText = document.querySelector('.theme-toggle .theme-text');
    
    // Check for saved user preference, if any, on load
    function updateThemeToggleUI(isDark) {
        if (!themeIcon || !themeText) return;
        if (isDark) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            themeText.textContent = 'Modo claro';
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            themeText.textContent = 'Modo oscuro';
        }
    }

    const isSavedDark = localStorage.getItem('darkMode') === 'enabled';
    if (isSavedDark) {
        document.body.classList.add('dark-mode');
    }
    updateThemeToggleUI(isSavedDark);
    
    // Toggle dark mode via button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const isDark = !document.body.classList.contains('dark-mode');
            if (isDark) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', null);
            }
            updateThemeToggleUI(isDark);
        });
    }
});
