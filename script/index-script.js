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
    
    // Alternative: Show navbar when hovering near the top of the page
    // Uncomment this section if you prefer this behavior
    /*
    document.addEventListener('mousemove', function(e) {
        // Show navbar when mouse is within 50px of the top
        if (e.clientY < 50) {
            navbar.style.transform = 'translateY(0)';
        } else if (e.clientY > navbar.offsetHeight + 20) {
            navbar.style.transform = 'translateY(-100%)';
        }
    });
    */
});

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