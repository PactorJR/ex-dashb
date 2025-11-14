        // Auto-hiding navbar functionality
        document.addEventListener('DOMContentLoaded', function() {
            const navbar = document.querySelector('.navbar');
            
            // Hide navbar initially
            navbar.style.transform = 'translateY(-100%)';
            navbar.style.transition = 'transform 0.3s ease-in-out';
            
            // Show navbar on hover
            navbar.addEventListener('mouseenter', function() {
                navbar.style.transform = 'translateY(0)';
            });
            
            // Hide navbar when mouse leaves
            navbar.addEventListener('mouseleave', function() {
                navbar.style.transform = 'translateY(-100%)';
            });
        
        });

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

        // Auto-hiding navbar functionality
        document.addEventListener('DOMContentLoaded', function() {
            const navbar = document.querySelector('.navbar');
            
            // Hide navbar initially
            navbar.style.transform = 'translateY(-100%)';
            navbar.style.transition = 'transform 0.3s ease-in-out';
            
            // Show navbar on hover
            navbar.addEventListener('mouseenter', function() {
                navbar.style.transform = 'translateY(0)';
            });
            
            // Hide navbar when mouse leaves
            navbar.addEventListener('mouseleave', function() {
                navbar.style.transform = 'translateY(-100%)';
            });

            document.addEventListener('mousemove', function(e) {
                // Show navbar when mouse is within 50px of the top
                if (e.clientY < 50) {
                    navbar.style.transform = 'translateY(0)';
                } else if (e.clientY > navbar.offsetHeight + 20) {
                    navbar.style.transform = 'translateY(-100%)';
                }
            });
        });
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
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

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

        // Smooth scroll to section
        function scrollToSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }


        // Observe all animated elements
        document.addEventListener('DOMContentLoaded', () => {
            const animatedElements = document.querySelectorAll('.slide-in-up, .slide-in-left, .slide-in-right, .fade-in-scale, .stat-card');
            animatedElements.forEach(el => observer.observe(el));
        });


