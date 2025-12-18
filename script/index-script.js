
        // Initialize sliders when DOM is loaded
        document.addEventListener('DOMContentLoaded', initTestimonialSliders);

        // Re-initialize when tabs change
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(initTestimonialSliders, 3000);
            });
        });


        document.addEventListener('DOMContentLoaded', function() {
            setupSummaryNavigation();
        });

        function setupSummaryNavigation() {
            const teamCardMap = {
                'accounting team': {
                    highlight: 'acc-variance'
                }
            };

            const statCards = document.querySelectorAll('.stats-row .stat-card');

            statCards.forEach(card => {
                const header = card.querySelector('.stat-header h3');
                if (!header) return;

                const teamKey = header.textContent.trim().toLowerCase();
                const targetConfig = teamCardMap[teamKey];

                if (!targetConfig || card.dataset.summaryNavBound === 'true') {
                    return;
                }

                const navigateToSummary = () => {
                    const targetUrl = new URL('lag-lead-summ.html', window.location.href);
                    targetUrl.search = '';
                    if (targetConfig.highlight) {
                        targetUrl.searchParams.set('highlight', targetConfig.highlight);
                    }
                    window.location.href = targetUrl.toString();
                };

                card.dataset.summaryNavBound = 'true';
                card.classList.add('clickable-stat-card');
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');

                card.addEventListener('click', navigateToSummary);
                card.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        navigateToSummary();
                    }
                });
            });
        }

        // Initialize everything when DOM is ready
        function initialize() {
            setupSummaryNavigation();
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }

        // Scroll Animation Observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-in').forEach(el => {
            observer.observe(el);
        });

        // Navbar scroll effect
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.addEventListener('scroll', () => {
                const navbar = document.querySelector('.navbar');
                if (mainContent.scrollTop > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }

        // Animate progress bars when visible
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.progress-fill');
                    if (progressBar) {
                        const width = progressBar.style.width;
                        progressBar.style.width = '0';
                        setTimeout(() => {
                            progressBar.style.width = width;
                        }, 100);
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.stat-card').forEach(card => {
            progressObserver.observe(card);
        });

        // Scroll to Top Functionality
        document.addEventListener('DOMContentLoaded', function() {
            const mainContent = document.querySelector('.main-content');
            const scrollTopBtn = document.getElementById('scrollToTopBtn');
        
            if (mainContent && scrollTopBtn) {
                
                // Function to get the current scroll position from either the mainContent div OR the window
                // This handles both the mobile layout (where .main-content scrolls) and desktop (where window/body scrolls)
                const getScrollPosition = () => {
                    return mainContent.scrollTop || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
                };
        
                // Logic to Show/Hide button
                const toggleVisibility = () => {
                    if (getScrollPosition() > 300) {
                        scrollTopBtn.classList.add('visible');
                    } else {
                        scrollTopBtn.classList.remove('visible');
                    }
                };
        
                // 1. Check immediately on page load
                toggleVisibility();
        
                // 2. Check continuously while scrolling
                // Attach listener to BOTH the container and the window to catch all scroll events
                mainContent.addEventListener('scroll', toggleVisibility);
                window.addEventListener('scroll', toggleVisibility);
        
                // 3. Scroll to Top Action
                scrollTopBtn.addEventListener('click', () => {
                    // Attempt to scroll both the element and the window to cover all bases
                    mainContent.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
        });

        // Tab Switching Functionality
        document.addEventListener('DOMContentLoaded', function() {
            const tabBtns = document.querySelectorAll('.tab-btn');
            const tabContents = document.querySelectorAll('.plan-tab-content');
            
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabNumber = btn.getAttribute('data-tab');
                    
                    // Remove active class from all buttons and contents
                    tabBtns.forEach(b => b.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked button and corresponding content
                    btn.classList.add('active');
                    document.querySelector(`[data-content="${tabNumber}"]`).classList.add('active');
                });
            });
        });

        // Image Slider for Sages and Essentialists tabs
        function initTestimonialSliders() {
            const sliders = document.querySelectorAll('.testimonial-slider');
            
            sliders.forEach(slider => {
                const images = slider.querySelectorAll('.testimonial-img');
                let currentIndex = 0;
                
                // Auto-rotate images every 4 seconds
                setInterval(() => {
                    images[currentIndex].classList.remove('active');
                    currentIndex = (currentIndex + 1) % images.length;
                    images[currentIndex].classList.add('active');
                }, 4000);
            });
        }


        // Observe all animated elements
        document.addEventListener('DOMContentLoaded', () => {
            const animatedElements = document.querySelectorAll('.slide-in-up, .slide-in-left, .slide-in-right, .fade-in-scale, .stat-card');
            animatedElements.forEach(el => observer.observe(el));
        });

        // Scroll Lock Functionality
        (function() {
            let isScrollLocked = false;
            let scrollLockTimeout = null;
            const scrollLockDuration = 1500; // Duration in milliseconds (1 second)
            const mainContent = document.querySelector('.main-content');
            
            if (!mainContent) return;

            let lastScrollTop = mainContent.scrollTop;

            function lockScroll() {
                isScrollLocked = true;
                
                // Clear existing timeout if any
                if (scrollLockTimeout) {
                    clearTimeout(scrollLockTimeout);
                }
                
                // Unlock after duration
                scrollLockTimeout = setTimeout(() => {
                    isScrollLocked = false;
                }, scrollLockDuration);
            }

            function handleScroll(e) {
                if (isScrollLocked) {
                    // Prevent scrolling during lock period
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }

                const currentScrollTop = mainContent.scrollTop;
                const scrollDelta = currentScrollTop - lastScrollTop;
                
                // Only lock if there's actual scroll movement
                if (Math.abs(scrollDelta) > 5) {
                    lockScroll();
                }
                
                lastScrollTop = currentScrollTop;
            }

            // Listen to scroll events on main-content
            mainContent.addEventListener('scroll', handleScroll, { passive: false });
            
            // Also handle wheel events to prevent rapid scrolling
            mainContent.addEventListener('wheel', function(e) {
                if (isScrollLocked) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            }, { passive: false });

            mainContent.addEventListener('touchmove', function(e) {
                if (isScrollLocked) {
                    e.preventDefault();
                    return false;
                }
            }, { passive: false });
        })();

        

