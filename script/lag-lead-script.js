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

        document.addEventListener('DOMContentLoaded', function() {
            applyIncomingHighlight();
            setupVarianceCardNavigation();
        });

        function applyIncomingHighlight() {
            const params = new URLSearchParams(window.location.search);
            const highlightParam = params.get('highlight');

            if (!highlightParam) {
                removeVarianceHighlight();
                return;
            }

            const highlightKey = highlightParam.trim().toLowerCase();

            if (!highlightKey) {
                removeVarianceHighlight();
                return;
            }

            const highlightHandlers = {
                'acc-variance': highlightAccountingVarianceCard
            };

            const handler = highlightHandlers[highlightKey];
            if (typeof handler === 'function') {
                // Slight delay to ensure all layouts are ready
                setTimeout(handler, 5000);
            }
        }

        function removeVarianceHighlight() {
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach(card => {
                const label = card.querySelector('.stat-label');
                if (!label) return;

                if (label.textContent.trim().toLowerCase() === 'variance') {
                    card.classList.remove('highlight-variance');
                    if (card.getAttribute('tabindex') === '-1') {
                        card.removeAttribute('tabindex');
                    }
                }
            });
        }

        function highlightAccountingVarianceCard() {
            const statCards = document.querySelectorAll('.stat-card');
            let targetCard = null;

            statCards.forEach(card => {
                if (targetCard) return;

                const label = card.querySelector('.stat-label');
                const value = card.querySelector('.stat-value');

                if (!label || !value) return;

                const isVarianceLabel = label.textContent.trim().toLowerCase() === 'variance';
                const valueText = value.textContent.trim().replace(/\s+/g, '');
                const numericValue = parseFloat(valueText.replace(/[^\d.-]/g, ''));
                const isTargetValue = valueText.includes('-0.4') || numericValue === -0.4;

                if (isVarianceLabel && isTargetValue) {
                    targetCard = card;
                }
            });

            if (!targetCard) {
                return;
            }

            if (!targetCard.hasAttribute('tabindex')) {
                targetCard.setAttribute('tabindex', '-1');
            }

            targetCard.classList.add('highlight-variance');
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

            requestAnimationFrame(() => {
                targetCard.focus({ preventScroll: true });
            });

            const removeHighlight = () => {
                if (!targetCard.classList.contains('highlight-variance')) {
                    return;
                }

                targetCard.classList.remove('highlight-variance');
                if (targetCard.getAttribute('tabindex') === '-1') {
                    targetCard.blur();
                    targetCard.setAttribute('tabindex', '0');
                }

                if (window.history && window.history.replaceState) {
                    const url = new URL(window.location.href);
                    url.searchParams.delete('highlight');
                    window.history.replaceState({}, document.title, url.toString());
                }
            };

            const animationEndHandler = () => {
                removeHighlight();
                targetCard.removeEventListener('animationend', animationEndHandler);
            };

            targetCard.addEventListener('animationend', animationEndHandler, { once: true });

            const fallbackTimeoutMs = 5000;
            setTimeout(removeHighlight, fallbackTimeoutMs);
        }

        function setupVarianceCardNavigation() {
            const statCards = document.querySelectorAll('.stat-card');
            let varianceCard = null;

            statCards.forEach(card => {
                if (varianceCard) return;

                const label = card.querySelector('.stat-label');
                const value = card.querySelector('.stat-value');

                if (!label || !value) return;

                const isVarianceLabel = label.textContent.trim().toLowerCase() === 'variance';
                const valueText = value.textContent.trim().replace(/\s+/g, '');
                const numericValue = parseFloat(valueText.replace(/[^\d.-]/g, ''));
                const matchesTargetValue = valueText.includes('-0.4') || numericValue === -0.4;

                if (isVarianceLabel && matchesTargetValue) {
                    varianceCard = card;
                }
            });

            if (!varianceCard) {
                return;
            }

            varianceCard.classList.add('stat-card-link');
            varianceCard.setAttribute('role', 'link');
            varianceCard.setAttribute('tabindex', '0');

            const navigateToLeader = () => {
                const params = new URLSearchParams({
                    highlightLeader: 'marcus-chen',
                    highlightOperation: '2. Team Budget and Expenses Management',
                    highlightKpi: 'FS Target : Net Profit',
                    highlightSource: 'lag-lead-summ'
                });

                window.location.href = `tl-scoring.html?${params.toString()}`;
            };

            varianceCard.addEventListener('click', navigateToLeader);
            varianceCard.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigateToLeader();
                }
            });
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

        // (Removed scroll-based nav highlighting)

        function createBarDataLabelsPlugin(pluginId) {
            return {
                id: pluginId,
                afterDatasetsDraw: function(chart) {
                    const ctx = chart.ctx;
                    ctx.save();
                    ctx.font = '11px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillStyle = '#525552';
                    
                    const labelLineHeight = 14; // Height of one line of text
                    const minVerticalSpacing = 4; // Minimum vertical spacing between labels
                    const labelOffset = 5; // Base distance above bar
                    const maxLabelDistance = 25; // Max distance labels can move from bar top
                    
                    // Collect all bar labels with their positions
                    const allLabels = [];
                    
                    chart.data.datasets.forEach((dataset, datasetIndex) => {
                        const meta = chart.getDatasetMeta(datasetIndex);
                        meta.data.forEach((bar, index) => {
                            const data = dataset.data[index];
                            if (data !== null && data !== undefined && bar.height > 20) {
                                const value = '₱' + data + 'M';
                                
                                allLabels.push({
                                    value: value,
                                    barY: bar.y,
                                    barHeight: bar.height,
                                    barX: bar.x,
                                    barTop: bar.y,
                                    categoryIndex: index,
                                    datasetIndex: datasetIndex
                                });
                            }
                        });
                    });
                    
                    // Sort all labels by category, then by bar height (tallest first within category)
                    allLabels.sort((a, b) => {
                        if (a.categoryIndex !== b.categoryIndex) {
                            return a.categoryIndex - b.categoryIndex;
                        }
                        return a.barY - b.barY; // Lower y = taller bar
                    });
                    
                    // Calculate final label positions with collision detection
                    const labelPositions = [];
                    
                    // Process labels in order (by category, then by bar height)
                    allLabels.forEach((label) => {
                        // Start with label positioned directly above the bar
                        let labelY = label.barTop - labelOffset;
                        const textWidth = ctx.measureText(label.value).width;
                        
                        // Check for collisions with already placed labels
                        // Find the highest required position to avoid all collisions
                        let requiredY = labelY;
                        
                        for (let i = 0; i < labelPositions.length; i++) {
                            const prev = labelPositions[i];
                            const sameCategory = label.categoryIndex === prev.categoryIndex;
                            
                            // Calculate horizontal overlap based on text widths
                            // Text is centered on bar, so check if bounding boxes would overlap
                            const labelLeft = label.barX - textWidth / 2;
                            const labelRight = label.barX + textWidth / 2;
                            const prevLeft = prev.x - prev.textWidth / 2;
                            const prevRight = prev.x + prev.textWidth / 2;
                            const horizontalOverlap = !(labelRight < prevLeft || labelLeft > prevRight);
                            
                            // Determine if there's a collision
                            let collision = false;
                            
                            if (sameCategory) {
                                // Labels in same category must always be vertically separated
                                // Check against the initial position first
                                const verticalDistInitial = Math.abs(labelY - prev.y);
                                if (verticalDistInitial < (labelLineHeight + minVerticalSpacing)) {
                                    collision = true;
                                }
                            } else {
                                // Labels in different categories collide if they overlap both vertically AND horizontally
                                // Only check if they're horizontally close enough to potentially overlap
                                if (horizontalOverlap) {
                                    const verticalDistInitial = Math.abs(labelY - prev.y);
                                    if (verticalDistInitial < (labelLineHeight + minVerticalSpacing)) {
                                        collision = true;
                                    }
                                }
                            }
                            
                            if (collision) {
                                // Calculate required Y position to avoid this collision
                                const neededY = prev.y - (labelLineHeight + minVerticalSpacing);
                                // Use the highest required position (smallest y value)
                                if (neededY < requiredY) {
                                    requiredY = neededY;
                                }
                            }
                        }
                        
                        // Use the calculated required position
                        labelY = requiredY;
                        
                        // Ensure label doesn't go too high (stay within reasonable bounds)
                        const minY = label.barTop - labelOffset - maxLabelDistance;
                        if (labelY < minY) {
                            labelY = minY;
                        }
                        
                        // Store the final position
                        labelPositions.push({
                            x: label.barX,
                            y: labelY,
                            value: label.value,
                            categoryIndex: label.categoryIndex,
                            textWidth: textWidth
                        });
                    });
                    
                    // Draw all labels at their calculated positions
                    labelPositions.forEach((pos) => {
                        ctx.fillText(pos.value, pos.x, pos.y);
                    });
                    
                    ctx.restore();
                }
            };
        }

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
                    'rgba(88, 103, 64, 0.85)',   
                    'rgba(229, 187, 34, 0.85)',    
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
                },
                {
                    label: 'Year 2025',
                    data: [9.0, 9.4, 9.1, 8.0, 8.7, 9.0, 10.2, 10.0, 10.3, 11.0, 9.9, 9.5],
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
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
                datasets: {
                    bar: {
                      barThickness: 28,    
                      maxBarThickness: 25,    
                      categoryPercentage: 0.9,
                      barPercentage: 0.95
                    }
                  },
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
            },
            plugins: [createBarDataLabelsPlugin('profitBarDataLabels')]
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
                    backgroundColor: 'rgba(88, 103, 64, 0.85)',
                    borderColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 0,
                    borderRadius: 8
                },
                {
                    label: 'Year 2024',
                    data: [33.2, 32.9, 33.3, 32.8, 34.4, 34.4, 34.7, 34.7, 35.2, 34.7, 35.1, 35.3],
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    borderWidth: 0,
                    borderRadius: 8
                },
                {
                    label: 'Year 2025',
                    data: [33.2, 32.9, 33.3, 32.8, 34.4, 34.4, 34.7, 34.7, 35.2, 34.7, 35.1, 35.3],
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
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
                datasets: {
                    bar: {
                      barThickness: 28,    
                      maxBarThickness: 25,    
                      categoryPercentage: 0.9,
                      barPercentage: 0.95
                    }
                  },
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
            },
            plugins: [createBarDataLabelsPlugin('revenueBarDataLabels')]
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

        // Function to determine bar colors based on comparing values across datasets for the same month
        function getColorsForMonth(value2025, value2024, valueTarget) {
            // Find the minimum value among the three
            const minValue = Math.min(value2025, value2024, valueTarget);
            
            return {
                color2025: value2025 === minValue ? colors.year2025.red : colors.year2025.normal,
                border2025: value2025 === minValue ? colors.year2025.redBorder : colors.year2025.normalBorder,
                color2024: value2024 === minValue ? colors.year2024.red : colors.year2024.normal,
                border2024: value2024 === minValue ? colors.year2024.redBorder : colors.year2024.normalBorder,
                colorTarget: valueTarget === minValue ? colors.target.red : colors.target.normal,
                borderTarget: valueTarget === minValue ? colors.target.redBorder : colors.target.normalBorder
            };
        }

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

        // Define color schemes
        const colors = {
            year2025: {
                normal: 'rgba(88, 103, 64, 0.85)',
                normalBorder: 'rgba(88, 103, 64, 1)',
                red: 'rgba(220, 53, 69, 0.85)',
                redBorder: 'rgba(220, 53, 69, 1)'
            },
            year2024: {
                normal: 'rgba(150, 168, 64, 0.85)',
                normalBorder: 'rgba(150, 168, 64, 1)',
                red: 'rgba(220, 53, 69, 0.85)',
                redBorder: 'rgba(220, 53, 69, 1)'
            },
            target: {
                normal: 'rgba(229, 187, 34, 0.85)',
                normalBorder: 'rgba(229, 187, 34, 1)',
                red: 'rgba(220, 53, 69, 0.85)',
                redBorder: 'rgba(220, 53, 69, 1)'
            }
        };

        // Rental Income Composition Over Time (3-Month Summary Bar Chart)
        const rentalAreaCtx = document.getElementById('rentalAreaChart').getContext('2d');
        const initialData = getThreeMonthsData(currentMonthIndex);

        // Generate initial colors by comparing the three values
        const initialColors = getColorsForMonth(
            initialData.data2025[0],
            initialData.data2024[0],
            initialData.dataTarget[0]
        );

        const rentalAreaChart = new Chart(rentalAreaCtx, {
            type: 'bar',
            data: {
                labels: initialData.labels,
                datasets: [{
                    label: 'Year 2025',
                    data: initialData.data2025,
                    backgroundColor: [initialColors.color2025],
                    borderColor: [initialColors.border2025],
                    borderWidth: 1
                }, {
                    label: 'Year 2024',
                    data: initialData.data2024,
                    backgroundColor: [initialColors.color2024],
                    borderColor: [initialColors.border2024],
                    borderWidth: 1
                }, {
                    label: 'Current Year Target',
                    data: initialData.dataTarget,
                    backgroundColor: [initialColors.colorTarget],
                    borderColor: [initialColors.borderTarget],
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
                            // Color the label red if the bar is red
                            const barColor = Array.isArray(dataset.backgroundColor) 
                                ? dataset.backgroundColor[index] 
                                : dataset.backgroundColor;
                            ctx.fillStyle = barColor && barColor.includes('220, 53, 69') ? '#dc3545' : '#333';
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
            
            // Update colors by comparing the three values for the current month
            const monthColors = getColorsForMonth(
                newData.data2025[0],
                newData.data2024[0],
                newData.dataTarget[0]
            );
            
            rentalAreaChart.data.datasets[0].backgroundColor = [monthColors.color2025];
            rentalAreaChart.data.datasets[0].borderColor = [monthColors.border2025];
            
            rentalAreaChart.data.datasets[1].backgroundColor = [monthColors.color2024];
            rentalAreaChart.data.datasets[1].borderColor = [monthColors.border2024];
            
            rentalAreaChart.data.datasets[2].backgroundColor = [monthColors.colorTarget];
            rentalAreaChart.data.datasets[2].borderColor = [monthColors.borderTarget];
            
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
                            }
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

        // (Removed scroll-based show/hide for scroll-to-top button)

        // Initialize the chart
        const monthlyCollectionChart = new Chart(
            document.getElementById('monthlyCollectionChart'),
            monthlyCollectionConfig
        );

        const revenueBarChart = new Chart(
            document.getElementById('revenueBarChart'),
            revenueBarConfig
        );

        const profitBarChart = new Chart(
            document.getElementById('profitBarChart'),
            profitBarConfig
        );

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

        // Color variance and YoY Growth stat values based on sign: negative red, positive green, zero white
        document.addEventListener('DOMContentLoaded', () => {
            const statValues = document.querySelectorAll('.stat-value');
            statValues.forEach((el) => {
                const statCard = el.closest('.stat-card');
                if (!statCard) return;
                const labelEl = statCard.querySelector('.stat-label');
                const labelText = (labelEl ? labelEl.textContent : '').toLowerCase();
                const isVarianceMetric = labelText.includes('variance');
                const isYoYGrowthMetric = labelText.includes('yoy growth');
                if (!isVarianceMetric && !isYoYGrowthMetric) return;

                const text = (el.textContent || '').trim();
                // Detect explicit minus sign or parsed negative number
                const startsWithMinus = /^[\-\u2212]/.test(text);
                const numericValue = parseFloat(text.replace(/[^\d.\-]/g, ''));
                const isNegative = startsWithMinus || (!isNaN(numericValue) && numericValue < 0);
                if (isNegative) {
                    el.style.color = '#ff3146';
                    return;
                }
                if (!isNaN(numericValue)) {
                    if (numericValue > 0) {
                        el.style.color = '#81f31d';
                    } else if (numericValue === 0) {
                        el.style.color = '#ffffff';
                    }
                }
            });
        });
