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

        // Carousel functionality
        const carousel = document.getElementById('statsCarousel');
        const carouprevBtn = document.getElementById('carouprevBtn');
        const carounextBtn = document.getElementById('carounextBtn');
        const caroupageIndicator = document.getElementById('caroupageIndicator');

        let currentPage = 0;
        const cardsPerPage = 4;
        const totalCards = carousel.children.length;
        const totalPages = Math.ceil(totalCards / cardsPerPage);

        function updateCarousel() {
            const offset = currentPage * cardsPerPage;
            const cardWidth = carousel.children[0].offsetWidth;
            const gap = 20; // Gap between cards
            const translateX = -(offset * (cardWidth + gap));
            
            carousel.style.transform = `translateX(${translateX}px)`;
            caroupageIndicator.textContent = `${currentPage + 1} / ${totalPages}`;
            
            // Disable buttons at boundaries
            carouprevBtn.disabled = currentPage === 0;
            carounextBtn.disabled = currentPage === totalPages - 1;
        }

        carouprevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                updateCarousel();
            }
        });

        carounextBtn.addEventListener('click', () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
                updateCarousel();
            }
        });

        // Initialize
        updateCarousel();

        // Handle window resize
        window.addEventListener('resize', updateCarousel);

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

        // Smooth animated scroll with section pauses and toggle control
        let isAutoScrolling = false;
        let currentSectionIndex = 0;

        // Configuration: Customize pause duration for each section (in milliseconds)
        const SECTION_CONFIG = {
            pauseDuration: 3000, // Default pause duration (3 seconds)
            scrollSpeed: 2500,   // Milliseconds per viewport height
            pauseAtBottom: 3000, // Pause duration at bottom before rewinding (3 seconds)
            rewindSpeed: 1,   // Milliseconds per viewport height when rewinding (faster)
            sectionPauses: {
                'home': 4000,      // 4 seconds at Net Profit section
                'dashboard': 4500,     // 4.5 seconds at Gross Revenue section
                'ten-year-plan': 4000, // 4 seconds at Collection Performance section
                'three-year-plan': 4000       // 4 seconds at Rental Income section
            }
        };

        // Toggle auto-scroll on/off
        function toggleAutoScroll() {
            const btn = document.getElementById('playBtn');
            const icon = btn.querySelector('svg');
            
            if (isAutoScrolling) {
                // Stop scrolling
                stopAutoScroll();
                // Change to play icon
                icon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
                btn.classList.remove('playing');
            } else {
                // Start scrolling
                scrollDownManually();
                // Change to stop icon (square)
                icon.innerHTML = '<rect x="6" y="6" width="12" height="12"></rect>';
                btn.classList.add('playing');
            }
        }

        function scrollDownManually() {
            if (isAutoScrolling) return;
            
            isAutoScrolling = true;
            currentSectionIndex = 0;
            
            const sections = document.querySelectorAll('.dashboard-section');
            
            if (sections.length === 0) {
                // Fallback to original behavior if no sections found
                scrollToBottom();
                return;
            }
            
            scrollToNextSection(sections);
        }

        function scrollToNextSection(sections) {
            if (!isAutoScrolling) return; // Stop if toggle was pressed
            
            if (currentSectionIndex >= sections.length) {
                // All sections visited, scroll to absolute bottom
                scrollToBottom(() => {
                    if (!isAutoScrolling) return; // Check again before pausing
                    // Pause at bottom before rewinding
                    setTimeout(() => {
                        if (!isAutoScrolling) return; // Check before rewinding
                        rewindToTop();
                    }, SECTION_CONFIG.pauseAtBottom);
                });
                return;
            }
            
            const section = sections[currentSectionIndex];
            const sectionId = section.id;
            const pauseDuration = SECTION_CONFIG.sectionPauses[sectionId] || SECTION_CONFIG.pauseDuration;
            
            // Scroll to current section
            scrollToElement(section, () => {
                if (!isAutoScrolling) return; // Stop if toggle was pressed
                // Pause at this section
                setTimeout(() => {
                    if (!isAutoScrolling) return; // Check before continuing
                    currentSectionIndex++;
                    scrollToNextSection(sections);
                }, pauseDuration);
            });
        }

        function scrollToElement(element, callback) {
            const startPosition = window.scrollY || window.pageYOffset;
            const targetPosition = element.offsetTop;
            const distance = targetPosition - startPosition;
            
            if (Math.abs(distance) < 10) {
                // Already at target, execute callback immediately
                if (callback) callback();
                return;
            }
            
            const windowHeight = window.innerHeight;
            const viewportsToScroll = Math.abs(distance) / windowHeight;
            const duration = viewportsToScroll * SECTION_CONFIG.scrollSpeed;
            
            let startTime = null;

            function animation(currentTime) {
                if (!isAutoScrolling) return; // Stop animation if toggled off
                
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Easing function for smooth acceleration and deceleration
                const easeInOutQuad = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                window.scrollTo(0, startPosition + (distance * easeInOutQuad));
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    if (callback) callback();
                }
            }
            
            requestAnimationFrame(animation);
        }

        function scrollToBottom(callback) {
            const startPosition = window.scrollY || window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const targetPosition = documentHeight - windowHeight;
            const distance = targetPosition - startPosition;
            
            if (distance <= 0) {
                if (callback) callback();
                return;
            }
            
            const viewportsToScroll = distance / windowHeight;
            const duration = viewportsToScroll * SECTION_CONFIG.scrollSpeed;
            
            let startTime = null;

            function animation(currentTime) {
                if (!isAutoScrolling) return; // Stop animation if toggled off
                
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                const easeInOutQuad = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                window.scrollTo(0, startPosition + (distance * easeInOutQuad));
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    if (callback) callback();
                }
            }
            
            requestAnimationFrame(animation);
        }

        // Rewind to top function with loop restart
        function rewindToTop() {
            const startPosition = window.scrollY || window.pageYOffset;
            const targetPosition = 0;
            const distance = startPosition; // Distance to top
            
            if (distance <= 0) {
                // Restart the loop if still auto-scrolling
                if (isAutoScrolling) {
                    currentSectionIndex = 0;
                    setTimeout(() => {
                        if (isAutoScrolling) {
                            scrollDownManually();
                        }
                    }, 1000); // Small pause before restarting
                }
                return;
            }
            
            const windowHeight = window.innerHeight;
            const viewportsToScroll = distance / windowHeight;
            const duration = viewportsToScroll * SECTION_CONFIG.rewindSpeed;
            
            let startTime = null;

            function animation(currentTime) {
                if (!isAutoScrolling) return; // Stop animation if toggled off
                
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Easing function for smooth rewind
                const easeInOutQuad = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                window.scrollTo(0, startPosition - (distance * easeInOutQuad));
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    // Restart the loop if still auto-scrolling
                    if (isAutoScrolling) {
                        currentSectionIndex = 0;
                        setTimeout(() => {
                            if (isAutoScrolling) {
                                const sections = document.querySelectorAll('.dashboard-section');
                                scrollToNextSection(sections);
                            }
                        }, 1000); // Small pause before restarting
                    }
                }
            }
            
            requestAnimationFrame(animation);
        }

        // Function to stop auto-scrolling
        function stopAutoScroll() {
            isAutoScrolling = false;
            currentSectionIndex = 0;
        }

        // Optional: Add keyboard shortcut to stop scrolling (ESC key)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isAutoScrolling) {
                toggleAutoScroll();
            }
        });

        // Observe all animated elements
        document.addEventListener('DOMContentLoaded', () => {
            const animatedElements = document.querySelectorAll('.slide-in-up, .slide-in-left, .slide-in-right, .fade-in-scale, .stat-card');
            animatedElements.forEach(el => observer.observe(el));
        });

        // Presentation controls
        let isPlaying = true;
        let presentationInterval;
        // Sections cache used by presentation controls
        const sections = document.querySelectorAll('.dashboard-section');

        const PRESENTATION_CONFIG = {
            autoPlayInterval: 5000, // Time each section is shown (in milliseconds)
            transitionDuration: 800 // Match this with CSS transition duration
        };

        // Initialize presentation
        function initPresentation() {
            showSection(0);
            startAutoPlay();
        }

        function showSection(index) {
            const sections = document.querySelectorAll('.dashboard-section');
            sections.forEach((section, i) => {
                section.classList.remove('section-visible', 'section-previous');
                if (i === index) {
                    section.classList.add('section-visible');
                } else if (i < index) {
                    section.classList.add('section-previous');
                }
            });
            currentSectionIndex = index;
            updateNavigationButtons();
        }

        function updateNavigationButtons() {
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            
            prevBtn.style.opacity = currentSectionIndex === 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentSectionIndex === sections.length - 1 ? '0.5' : '1';
            prevBtn.disabled = currentSectionIndex === 0;
            nextBtn.disabled = currentSectionIndex === sections.length - 1;
        }

        function nextSection() {
            const sections = document.querySelectorAll('.dashboard-section');
            if (currentSectionIndex < sections.length - 1) {
                showSection(currentSectionIndex + 1);
            } else if (isPlaying) {
                // If auto-playing and we reach the end, restart from beginning
                restartPresentation();
            }
        }

        function previousSection() {
            if (currentSectionIndex > 0) {
                showSection(currentSectionIndex - 1);
            }
        }

        function startAutoPlay() {
            isPlaying = true;
            updatePlayButton();
            clearInterval(presentationInterval);
            presentationInterval = setInterval(() => {
                if (currentSectionIndex === sections.length - 1) {
                    restartPresentation();
                } else {
                    nextSection();
                }
            }, PRESENTATION_CONFIG.autoPlayInterval);
        }

        function stopAutoPlay() {
            isPlaying = false;
            updatePlayButton();
            clearInterval(presentationInterval);
        }

        function togglePlay() {
            if (isPlaying) {
                stopAutoPlay();
            } else {
                startAutoPlay();
            }
        }

        function updatePlayButton() {
            const playIcon = document.querySelector('.play-icon');
            const pauseIcon = document.querySelector('.pause-icon');
            
            if (isPlaying) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        }

        function restartPresentation() {
            showSection(0);
            if (isPlaying) {
                startAutoPlay();
            }
        }

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case 'PageDown':
                    nextSection();
                    break;
                case 'ArrowLeft':
                case 'PageUp':
                    previousSection();
                    break;
                case ' ':
                    togglePlay();
                    break;
                case 'Home':
                    restartPresentation();
                    break;
            }
        });

        // Initialize when the page loads
        window.addEventListener('load', () => {
            initPresentation();
        });

        // Nav handle toggle: allow clicking the small handle to open/close nav on small screens
        document.addEventListener('DOMContentLoaded', () => {
            const navHover = document.querySelector('.nav-hover-zone');
            const navHandle = document.querySelector('.nav-handle');
            if (!navHover || !navHandle) return;

            navHandle.addEventListener('click', (e) => {
                // toggle 'nav-open' class to keep nav visible
                navHover.classList.toggle('nav-open');
                // move focus to play button for keyboard users
                const play = document.getElementById('playBtn') || document.querySelector('.play-btn');
                if (play) play.focus();
            });

            // close nav when clicking outside of buttons
            document.addEventListener('click', (e) => {
                if (!navHover.contains(e.target)) {
                    navHover.classList.remove('nav-open');
                }
            });
        });

