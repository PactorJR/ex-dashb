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
                'profit': 4000,      // 4 seconds at Net Profit section
                'revenue': 4500,     // 4.5 seconds at Gross Revenue section
                'collections': 4000, // 4 seconds at Collection Performance section
                'rental': 4000       // 4 seconds at Rental Income section
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

        // Auto-start on page load
        window.addEventListener('load', () => {
            // Small delay to ensure everything is loaded
            setTimeout(() => {
                toggleAutoScroll();
            }, 500);
        });


        // Section visibility on scroll (with reverse animation)
        function handleSectionVisibility() {
            const sections = document.querySelectorAll('.dashboard-section');
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY || window.pageYOffset;

            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const sectionBottom = sectionTop + sectionHeight;

                if (scrollY + windowHeight > sectionTop + 200 && scrollY < sectionBottom - 100) {
                    section.classList.add('section-visible');
                } else {
                    section.classList.remove('section-visible');
                }
            });
        }

        window.addEventListener('load', () => {
            setTimeout(() => {
                const firstSection = document.querySelector('.dashboard-section');
                if (firstSection) {
                    firstSection.classList.add('section-visible');
                }
            }, 3000);
        });

        window.addEventListener('scroll', handleSectionVisibility);


        // Intersection Observer for scroll animations
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
        document.addEventListener('DOMContentLoaded', () => {
            const animatedElements = document.querySelectorAll('.slide-in-up, .slide-in-left, .slide-in-right, .fade-in-scale, .stat-card');
            animatedElements.forEach(el => observer.observe(el));
        });

        // Update active nav item on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('.dashboard-section');
            const navItems = document.querySelectorAll('.nav-item');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('onclick')?.includes(current)) {
                    item.classList.add('active');
                }
            });
        });

        // ============================================
        // SECTION 1: NET PROFIT CHARTS
        // ============================================

        const profitPieData = {
        labels: ['Target', 'Actual', 'Variance'],
        datasets: [
            {
                // Outer ring
                label: 'Net Profit',
                data: [9766410.44, 9866410, 0],
                backgroundColor: [
                    'rgba(88, 103, 64, 0.85)',    // Blue
                    'rgba(229, 187, 34, 0.85)',    // Orange
                    'rgba(150, 168, 64, 0.85)'
                ],
                borderColor: [
                    'rgba(88, 103, 64, 1)',
                    'rgba(229, 187, 34, 1)',
                    'rgba(150, 168, 64, 1)'
                ],
                borderWidth: 2,
                spacing: 2
            },
            {
                // Inner circle - Variance (solid fill)
                label: 'Variance',
                data: [100000],  // Single value fills entire inner circle
                backgroundColor: 'rgba(150, 168, 64, 0.85)',
                borderColor: 'rgba(150, 168, 64, 0)',
                borderWidth: 2
            }
        ]
    };

    const profitPieConfig = {
        type: 'doughnut',
        data: profitPieData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '0%',  // Adjust this to control ring thickness
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { size: 12, weight: '500' },
                        padding: 15,
                        color: '#525552',
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#525552',
                    bodyColor: '#525552',
                    borderColor: '#f0f0f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            let value = context.parsed || 0;
                            let label = context.datasetIndex === 0 ? context.label : 'Variance';
                            
                            return label + ': ₱' + value.toLocaleString('en-PH', {
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2
                            });
                        }
                    }
                }
            }
        }
    };

        // Profit Bar Chart Data
        const profitBarData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Current Year Target',
                    data: [8.8, 9.2, 8.6, 7.1, 8.1, 8.8, 10.8, 10.2, 10.5, 11.2, 9.7, 9.2],
                    backgroundColor: 'rgba(88, 103, 64, 0.85)',
                    borderColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 0,
                    borderRadius: 8
                },
                {
                    label: 'Year 2024',
                    data: [9.2, 9.6, 9.4, 8.5, 9.0, 9.4, 9.7, 9.4, 10.8, 9.5, 9.8, 9.4],
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    borderWidth: 0,
                    borderRadius: 8
                }
            ]
        };

        const profitBarConfig = {
            type: 'bar',
            data: profitBarData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            font: { size: 12, weight: '500' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 15,
                            color: '#525552'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ₱' + context.parsed.y + 'M';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 }
                        },
                        title: {
                            display: true,
                            text: 'Net Profit (Millions ₱)',
                            color: '#525552',
                            font: { size: 12, weight: '500' }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 }
                        }
                    }
                }
            }
        };

        // ============================================
        // SECTION 2: GROSS REVENUE CHARTS
        // ============================================

        // Revenue Pie Chart Data (based on image)
        const revenuePieData = {
            labels: ['Nov 2025 Actual', 'Nov 2024 Actual'],
            datasets: [{
                label: 'Gross Revenue',
                data: [35061227.17, 34000000], // Nov 2025: 35.06M, Nov 2024: ~34.0M (estimated from chart)
                backgroundColor: [
                    'rgba(88, 103, 64, 0.85)',
                    'rgba(229, 187, 34, 0.85)'
                ],
                borderColor: [
                    'rgba(88, 103, 64, 1)',
                    'rgba(229, 187, 34, 1)'
                ],
                borderWidth: 2
            }]
        };

        const revenuePieConfig = {
            type: 'doughnut',
            data: revenuePieData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 12, weight: '500' },
                            padding: 15,
                            color: '#525552'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                let value = context.parsed || 0;
                                return label + ': ₱' + value.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                            }
                        }
                    }
                }
            }
        };

        // Revenue Bar Chart Data (from image - exact values)
        const revenueBarData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Current Year Target',
                    data: [31.3, 31.1, 31.74, 30.4, 32.8, 32.2, 33.2, 33.3, 33.5, 35.6, 34.4, 34.8],
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    borderWidth: 0,
                    borderRadius: 8
                },
                {
                    label: 'Year 2024',
                    data: [33.2, 32.9, 33.3, 32.8, 34.4, 34.4, 34.7, 34.7, 35.2, 34.7, 35.1, 35.3],
                    backgroundColor: 'rgba(88, 103, 64, 0.85)',
                    borderColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 0,
                    borderRadius: 8
                }
            ]
        };

        const revenueBarConfig = {
            type: 'bar',
            data: revenueBarData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            font: { size: 12, weight: '500' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 15,
                            color: '#525552'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ₱' + context.parsed.y.toFixed(1) + 'M';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return '₱' + value + 'M';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Gross Revenue (Millions ₱)',
                            color: '#525552',
                            font: { size: 12, weight: '500' }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 }
                        }
                    }
                }
            }
        };

        // ============================================
        // SECTION 3: COLLECTION CHARTS
        // ============================================

        // Monthly Collection Data (converted to millions for consistency)
        const monthlyCollectionData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Total Receivables',
                    data: [13.2, 13.1, 12.5, 12.6, 13.0, 12.2, 12.7, 12.5, 13.6, 13.7, 8.6, 0],
                    borderColor: 'rgba(88, 103, 64, 0.85)',
                    backgroundColor: 'rgba(106, 47, 107, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: 'rgba(88, 103, 64, 0.85)',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2,
                    fill: false
                },
                {
                    label: 'Total Collected',
                    data: [10.7, 10.4, 13.4, 7.0, 6.7, 6.1, 9.4, 8.6, 6.5, 5.4, 0.6805, 0], // Changed 680.5 to 0.6805 (millions)
                    borderColor: 'rgba(229, 187, 34, 0.85)',
                    backgroundColor: 'rgba(226, 135, 67, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: 'rgba(229, 187, 34, 0.85)',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2,
                    fill: false
                }
            ]
        };

        const monthlyCollectionConfig = {
            type: 'line',
            data: monthlyCollectionData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 13, weight: '600' },
                            boxWidth: 15,
                            boxHeight: 15,
                            padding: 15,
                            color: '#5a5a7a',
                            usePointStyle: true,
                            pointStyle: 'rect'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#e0e0e0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                let value = context.parsed.y;
                                if (value === 0) {
                                    return context.dataset.label + ': No data';
                                }
                                // If value is less than 1 million, show in K
                                if (value < 1) {
                                    return context.dataset.label + ': ₱' + (value * 1000).toFixed(1) + 'K';
                                }
                                // Otherwise show in M
                                return context.dataset.label + ': ₱' + value.toFixed(1) + 'M';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 20,
                        grid: {
                            color: '#f0f0f0',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#666',
                            font: { size: 11 },
                            stepSize: 2,
                            callback: function(value) {
                                if (value === 0) return '₱0';
                                return '₱' + value + 'M';
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: '#f0f0f0',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#666',
                            font: { size: 11 }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        };

        // ============================================
        // SECTION 4: RENTAL INCOME CHARTS
        // ============================================

        // Monthly data for all three datasets
        const monthlyData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            year2025: [19.1, 18.6, 19.2, 18.8, 18.7, 18.7, 19.3, 18.9, 19.3, 19.7, 19.4, 18.7],
            year2024: [18.9, 18.8, 18.9, 18.9, 18.7, 18.7, 18.9, 18.9, 18.7, 18.9, 18.7, 18.7],
            target: [17.7, 17.4, 17.4, 17.1, 17.7, 17.3, 17.4, 17.7, 17.9, 20.0, 18.9, 19.0]
        };

        let currentMonthIndex = 0; // Start from January (index 0)

        // Function to get 3 consecutive months of data
        function getThreeMonthsData(startIndex) {
            const indices = [];
            const labels = [];
            const data2025 = [];
            const data2024 = [];
            const dataTarget = [];
            
            for (let i = 0; i < 1; i++) {
                const index = (startIndex + i) % 12; // Wrap around to beginning
                indices.push(index);
                labels.push(monthlyData.labels[index]);
                data2025.push(monthlyData.year2025[index]);
                data2024.push(monthlyData.year2024[index]);
                dataTarget.push(monthlyData.target[index]);
            }
            
            return { labels, data2025, data2024, dataTarget };
        }

        // Rental Income Composition Over Time (3-Month Summary Bar Chart)
        const rentalAreaCtx = document.getElementById('rentalAreaChart').getContext('2d');
        const initialData = getThreeMonthsData(currentMonthIndex);

        const rentalAreaChart = new Chart(rentalAreaCtx, {
            type: 'bar',
            data: {
                labels: initialData.labels,
                datasets: [{
                    label: 'Year 2025',
                    data: initialData.data2025,
                    backgroundColor: 'rgba(88, 103, 64, 0.85)',
                    borderColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 1
                }, {
                    label: 'Year 2024',
                    data: initialData.data2024,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    borderWidth: 1
                }, {
                    label: 'Current Year Target',
                    data: initialData.dataTarget,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: false,
                        min: 15,
                        max: 22,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return '₱' + value + 'M';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'start',
                        labels: {
                            boxWidth: 15,
                            boxHeight: 15,
                            padding: 15,
                            font: {
                                size: 11
                            }
                        }
                    },
                    title: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ₱' + context.parsed.y + 'M';
                            }
                        }
                    }
                }
            },
            plugins: [{
                id: 'customDataLabels',
                afterDatasetsDraw: function(chart) {
                    const ctx = chart.ctx;
                    chart.data.datasets.forEach((dataset, datasetIndex) => {
                        const meta = chart.getDatasetMeta(datasetIndex);
                        meta.data.forEach((bar, index) => {
                            const value = dataset.data[index];
                            ctx.fillStyle = '#333';
                            ctx.font = 'bold 9px Arial';
                            ctx.textAlign = 'center';
                            ctx.fillText(value + 'M', bar.x, bar.y - 5);
                        });
                    });
                }
            }]
        });

        // Auto-slide function to update the chart every 3 seconds
        function updateRentalAreaChart() {
            currentMonthIndex = (currentMonthIndex + 1) % 12; // Move to next month, wrap around
            const newData = getThreeMonthsData(currentMonthIndex);
            
            // Update chart data
            rentalAreaChart.data.labels = newData.labels;
            rentalAreaChart.data.datasets[0].data = newData.data2025;
            rentalAreaChart.data.datasets[1].data = newData.data2024;
            rentalAreaChart.data.datasets[2].data = newData.dataTarget;
            
            // Animate the update
            rentalAreaChart.update('active');
        }

        // Start auto-sliding every 3 seconds
        setInterval(updateRentalAreaChart, 3000);

        // Rental Income Monthly Comparison Bar Chart
        const rentalComparisonCtx = document.getElementById('rentalComparisonChart').getContext('2d');
        const rentalComparisonChart = new Chart(rentalComparisonCtx, {
            type: 'bar',
            data: {
                labels: monthlyData.labels,
                datasets: [
                    {
                        label: 'Year 2025',
                        data: monthlyData.year2025,
                        backgroundColor: 'rgba(88, 103, 64, 0.85)',
                        borderColor: 'rgba(88, 103, 64, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Year 2024',
                        data: monthlyData.year2024,
                        backgroundColor: 'rgba(150, 168, 64, 0.85)',
                        borderColor: 'rgba(150, 168, 64, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Current Year Target',
                        data: monthlyData.target,
                        backgroundColor: 'rgba(229, 187, 34, 0.85)',
                        borderColor: 'rgba(229, 187, 34, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: false,
                        min: 15,
                        max: 22,
                        ticks: {
                            callback: function(value) {
                                return '₱' + value + 'M';
                            },
                            stepSize: 1
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        align: 'start',
                        labels: {
                            boxWidth: 15,
                            boxHeight: 15,
                            padding: 15,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ₱' + context.parsed.y + 'M';
                            }
                        }
                    }
                }
            },
            plugins: [{
                id: 'customDataLabels',
                afterDatasetsDraw: function(chart) {
                    const ctx = chart.ctx;
                    chart.data.datasets.forEach((dataset, datasetIndex) => {
                        const meta = chart.getDatasetMeta(datasetIndex);
                        meta.data.forEach((bar, index) => {
                            const value = dataset.data[index];
                            ctx.fillStyle = '#333';
                            ctx.font = 'bold 9px Arial';
                            ctx.textAlign = 'center';
                            ctx.fillText(value + 'M', bar.x, bar.y - 5);
                        });
                    });
                }
            }]
        });

        // Show/hide scroll to top button based on scroll position
        window.addEventListener('scroll', () => {
            const topBtnContainer = document.getElementById('topBtnContainer');
            if (window.scrollY > 300) {
                topBtnContainer.classList.add('visible');
            } else {
                topBtnContainer.classList.remove('visible');
            }
        });

        // Initialize the chart
        const monthlyCollectionChart = new Chart(
            document.getElementById('monthlyCollectionChart'),
            monthlyCollectionConfig
        );

        // Initialize all charts
        const revenuePieChart = new Chart(
            document.getElementById('revenuePieChart'),
            revenuePieConfig
        );

        const revenueBarChart = new Chart(
            document.getElementById('revenueBarChart'),
            revenueBarConfig
        );

        const profitPieChart = new Chart(
            document.getElementById('profitPieChart'),
            profitPieConfig
        );

        const profitBarChart = new Chart(
            document.getElementById('profitBarChart'),
            profitBarConfig
        );
