        // Smooth scroll to section
        function scrollToSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // Smooth scroll to team section
        function scrollToTeamSection(teamName) {
            const teamSectionMap = {
                'accounting': 'accounting-team-section',
                'opportunity': 'opportunity-team-section',
                'gathering': 'gathering-team-section',
                'operations': 'operations-team-section'
            };

            const sectionId = teamSectionMap[teamName];
            if (sectionId) {
                const section = document.getElementById(sectionId);
                if (section) {
                    // Calculate offset for fixed navbar (approximately 75px)
                    const offset = 100;
                    const elementPosition = section.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }

        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Setup carousel card click handlers for team navigation
        function setupTeamCarouselNavigation() {
            const carouselCards = document.querySelectorAll('.stat-card-carousel[data-team]');
            
            carouselCards.forEach(card => {
                card.addEventListener('click', function() {
                    const teamName = this.getAttribute('data-team');
                    if (teamName) {
                        scrollToTeamSection(teamName);
                    }
                });

                // Add keyboard support for accessibility
                card.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        const teamName = this.getAttribute('data-team');
                        if (teamName) {
                            scrollToTeamSection(teamName);
                        }
                    }
                });

                // Make cards focusable for keyboard navigation
                if (!card.hasAttribute('tabindex')) {
                    card.setAttribute('tabindex', '0');
                }
            });
        }

        document.addEventListener('DOMContentLoaded', function() {
            applyIncomingHighlight();
            setupVarianceCardNavigation();
            setupTeamCarouselNavigation();
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

        const formatMillionsLabel = (value) => {
            const numeric = Number(value);
            if (Number.isNaN(numeric)) {
                return '';
            }
            return `₱${numeric.toLocaleString('en-PH', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            })}M`;
        };

        const resolveDataLabelColor = (color, index) => {
            if (Array.isArray(color)) {
                return color[index] || color[0] || '#525552';
            }
            if (typeof color === 'string' && color.trim() !== '') {
                return color;
            }
            return '#525552';
        };

        // Store hovered elements per chart
        const chartHoveredElements = new WeakMap();

        function createBarDataLabelsPlugin(pluginId) {
            return {
                id: pluginId,
                afterDatasetsDraw: function(chart) {
                    const ctx = chart.ctx;
                    ctx.save();
                    ctx.font = '11px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    
                    const labelLineHeight = 14;
                    const minVerticalSpacing = 4;
                    const labelOffset = 5;
                    const maxLabelDistance = 25;
                    
                    // Collect all bar labels with their positions
                    const allLabels = [];
                    
                    chart.data.datasets.forEach((dataset, datasetIndex) => {
                        const meta = chart.getDatasetMeta(datasetIndex);
                        if (!meta || meta.type !== 'bar') {
                            return;
                        }
                        meta.data.forEach((bar, index) => {
                            const data = dataset.data[index];
                            if (data !== null && data !== undefined && typeof bar.height === 'number' && bar.height > 0) {
                                const customFormatter = dataset.dataLabelFormatter;
                                const value = typeof customFormatter === 'function'
                                    ? customFormatter(data, index, dataset)
                                    : formatMillionsLabel(data);
                                if (!value) {
                                    return;
                                }
                                allLabels.push({
                                    value,
                                    barY: bar.y,
                                    barHeight: bar.height,
                                    barX: bar.x,
                                    barTop: bar.y,
                                    categoryIndex: index,
                                    datasetIndex: datasetIndex,
                                    labelColor: resolveDataLabelColor(dataset.dataLabelColor || dataset.backgroundColor, index)
                                });
                            }
                        });
                    });
                    
                    // Sort all labels by category, then by bar height (tallest first within category)
                    allLabels.sort((a, b) => {
                        if (a.categoryIndex !== b.categoryIndex) {
                            return a.categoryIndex - b.categoryIndex;
                        }
                        return a.barY - b.barY;
                    });
                    
                    // Calculate final label positions with collision detection
                    const labelPositions = [];
                    
                    allLabels.forEach((label) => {
                        let labelY = label.barTop - labelOffset;
                        const textWidth = ctx.measureText(label.value).width;
                        let requiredY = labelY;
                        
                        for (let i = 0; i < labelPositions.length; i++) {
                            const prev = labelPositions[i];
                            const sameCategory = label.categoryIndex === prev.categoryIndex;
                            
                            const labelLeft = label.barX - textWidth / 2;
                            const labelRight = label.barX + textWidth / 2;
                            const prevLeft = prev.x - prev.textWidth / 2;
                            const prevRight = prev.x + prev.textWidth / 2;
                            const horizontalOverlap = !(labelRight < prevLeft || labelLeft > prevRight);
                            
                            let collision = false;
                            
                            if (sameCategory) {
                                const verticalDistInitial = Math.abs(labelY - prev.y);
                                if (verticalDistInitial < (labelLineHeight + minVerticalSpacing)) {
                                    collision = true;
                                }
                            } else {
                                if (horizontalOverlap) {
                                    const verticalDistInitial = Math.abs(labelY - prev.y);
                                    if (verticalDistInitial < (labelLineHeight + minVerticalSpacing)) {
                                        collision = true;
                                    }
                                }
                            }
                            
                            if (collision) {
                                const neededY = prev.y - (labelLineHeight + minVerticalSpacing);
                                if (neededY < requiredY) {
                                    requiredY = neededY;
                                }
                            }
                        }
                        
                        labelY = requiredY;
                        
                        const minY = label.barTop - labelOffset - maxLabelDistance;
                        if (labelY < minY) {
                            labelY = minY;
                        }
                        
                        labelPositions.push({
                            x: label.barX,
                            y: labelY,
                            value: label.value,
                            categoryIndex: label.categoryIndex,
                            textWidth: textWidth,
                            labelColor: label.labelColor
                        });
                    });
                    
                    // Draw all labels at their calculated positions
                    labelPositions.forEach((pos) => {
                        ctx.fillStyle = pos.labelColor;
                        ctx.fillText(pos.value, pos.x, pos.y);
                    });
                    
                    ctx.restore();
                }
            };
        }

        const lineDataLabelsPlugin = {
            id: 'lineDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'line') {
                        return;
                    }

                    meta.data.forEach((point, index) => {
                        const data = dataset.data[index];
                        if (data === null || data === undefined) {
                            return;
                        }

                        const customFormatter = dataset.dataLabelFormatter;
                        const label = typeof customFormatter === 'function'
                            ? customFormatter(data, index, dataset)
                            : formatMillionsLabel(data);
                        if (!label) {
                            return;
                        }
                        const color = resolveDataLabelColor(dataset.dataLabelColor || dataset.borderColor, index);
                        const offset = dataset.dataLabelOffset || 10;
                        ctx.fillStyle = color;
                        ctx.fillText(label, point.x, point.y - offset);
                    });
                });

                ctx.restore();
            }
        };

        // ============================================
        // REVENUE SECTIONS (1-8)
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
                    enabled: false,
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
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: [9.2, 9.6, 9.4, 8.5, 9.0, 9.4, 9.7, 9.4, 10.8, 9.5, 9.8, 9.4],
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: [11.8, 9.3, 10.6, 8.6, 8.7, 10.7, 11.7, 8.7, 12.2, 10.5, 9.6, 8.7],
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Current Year Target',
                    type: 'line',
                    order: 3,
                    data: [8.8, 9.2, 8.6, 7.1, 8.1, 8.8, 10.8, 10.2, 10.5, 11.2, 9.7, 9.2],
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const profitBarConfig = {
            type: 'bar',
            data: profitBarData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#525552',
                    bodyColor: '#525552',
                    borderColor: '#f0f0f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                            return `${context.dataset.label}: ${formatMillionsLabel(value)}`;
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
                                return formatMillionsLabel(value);
                            }
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
            plugins: [
                createBarDataLabelsPlugin('profitBarDataLabels'),
                lineDataLabelsPlugin
            ]
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
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: [33.2, 32.9, 33.3, 32.8, 34.4, 34.4, 34.7, 34.7, 35.2, 34.7, 35.1, 35.3],
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: [36.3, 35.3, 35.8, 34.9, 36.0, 36.6, 37.7, 36.0, 37.7, 35.9, 36.6, 36.3],
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Current Year Target',
                    type: 'line',
                    order: 3,
                    data: [31.3, 31.1, 31.4, 30.4, 32.8, 32.2, 33.2, 33.3, 33.5, 35.6, 34.4, 34.8],
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const revenueBarConfig = {
            type: 'bar',
            data: revenueBarData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#525552',
                    bodyColor: '#525552',
                    borderColor: '#f0f0f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                            return `${context.dataset.label}: ${formatMillionsLabel(value)}`;
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
                                return formatMillionsLabel(value);
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
            },
            plugins: [
                createBarDataLabelsPlugin('revenueBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        // ============================================
        // SECTION 3: COLLECTION CHARTS
        // ============================================

        // Monthly Collection Data (in millions)
        const monthlyCollectionData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Total Receivables',
                    data: [13.2, 13.1, 12.5, 12.6, 13.0, 12.2, 12.7, 12.5, 13.6, 13.7, 12.8, 0],
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    borderWidth: 0,
                    borderRadius: 4,
                    barPercentage: 0.7,
                    categoryPercentage: 0.8
                },
                {
                    label: 'Total Collected',
                    data: [10.7, 10.4, 13.4, 7.0, 6.7, 6.1, 9.4, 8.6, 6.5, 5.4, 0.6805, 0],
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    borderWidth: 0,
                    borderRadius: 4,
                    barPercentage: 0.7,
                    categoryPercentage: 0.8
                }
            ]
        };

        const COLLECTION_SUMMARY_METRICS = {
            targetRate: 100,
            averageReceivables: 12.8,
            averageCollected: 8.1
        };

        // Custom plugin for collection chart data labels
        const collectionDataLabelsPlugin = {
            id: 'collectionDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                
                const labelOffset = 5; // Base distance above bar
                
                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'bar') {
                        return;
                    }
                    meta.data.forEach((bar, index) => {
                        const data = dataset.data[index];
                        
                        if (data !== null && data !== undefined && typeof bar.height === 'number' && bar.height > 0 && data > 0) {
                            let value;
                            if (data < 1) {
                                value = '₱' + (data * 1000).toFixed(1) + 'K';
                            } else {
                                value = '₱' + data.toFixed(1) + 'M';
                            }
                            
                            const labelColor = resolveDataLabelColor(dataset.dataLabelColor || dataset.backgroundColor, index);
                            const labelY = bar.y - labelOffset;
                            
                            ctx.fillStyle = labelColor;
                            ctx.fillText(value, bar.x, labelY);
                        }
                    });
                });
                
                ctx.restore();
            }
        };

        const monthlyCollectionConfig = {
            type: 'bar',
            data: monthlyCollectionData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false,
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
                    },
                    datalabels: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 16,
                        grid: {
                            color: '#f0f0f0',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
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
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            },
            plugins: [
                collectionDataLabelsPlugin
            ]
        };

        // ============================================
        // EXPENSES SECTIONS (9+)
        // ============================================
        // SECTION 9: TOTAL OPERATING EXPENSE CHARTS
        // ============================================

        // Monthly data for Total Operating Expense - values in millions
        const monthlyTotalOperatingExpenseData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [20.5, 19.9, 20.4, 20.8, 21.9, 21.6, 21.5, 21.8, 21.0, 21.8, 22.0, 22.5],
            year2024: [19.1, 18.5, 19.4, 19.9, 21.2, 20.0, 19.1, 19.8, 19.6, 20.9, 21.3, 22.3],
            year2025: [20.8, 22.2, 21.5, 22.5, 23.6, 22.1, 22.1, 23.4, 21.6, 23.4, 22.9, 23.5]
        };

        // Total Operating Expense Comparison Bar Chart
        const totalOperatingExpenseChartData = {
            labels: monthlyTotalOperatingExpenseData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyTotalOperatingExpenseData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: monthlyTotalOperatingExpenseData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Current Year Target',
                    type: 'line',
                    order: 3,
                    data: monthlyTotalOperatingExpenseData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const totalOperatingExpenseChartConfig = {
            type: 'bar',
            data: totalOperatingExpenseChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#525552',
                    bodyColor: '#525552',
                    borderColor: '#f0f0f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                            return `${context.dataset.label}: ${formatMillionsLabel(value)}`;
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
                                return formatMillionsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Total Operating Expense (Millions ₱)',
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
            plugins: [
                createBarDataLabelsPlugin('totalOperatingExpenseBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        // Initialize the total operating expense chart
        const totalOperatingExpenseChart = new Chart(
            document.getElementById('totalOperatingExpenseChart'),
            totalOperatingExpenseChartConfig
        );

        // ============================================
        // SECTION 4: RENTAL INCOME CHARTS
        // ============================================

        // Monthly data for rental income
        const monthlyRentalData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [18.9, 18.8, 18.9, 18.9, 18.8, 18.8, 18.9, 18.9, 18.9, 18.8, 18.9, 18.8],
            year2024: [17.7, 17.4, 17.4, 17.1, 17.7, 17.3, 17.4, 17.7, 17.9, 20.0, 18.9, 19.0],
            year2025: [19.1, 18.6, 19.2, 18.8, 18.7, 18.7, 19.3, 18.9, 19.3, 18.7, 19.4, 18.7]
        };

        // Rental Income Comparison Bar Chart
        const rentalComparisonData = {
            labels: monthlyRentalData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyRentalData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: monthlyRentalData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Current Year Target',
                    type: 'line',
                    order: 3,
                    data: monthlyRentalData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const rentalComparisonConfig = {
            type: 'bar',
            data: rentalComparisonData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#525552',
                    bodyColor: '#525552',
                    borderColor: '#f0f0f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                            return `${context.dataset.label}: ${formatMillionsLabel(value)}`;
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
                                return formatMillionsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Rental Income (Millions ₱)',
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
            plugins: [
                createBarDataLabelsPlugin('rentalBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        // Initialize the chart
        const rentalComparisonChart = new Chart(
            document.getElementById('rentalComparisonChart'),
            rentalComparisonConfig
        );

        // ============================================
        // SECTION 5: VENUE (P-VALUE) CHARTS
        // ============================================

        // Helper function to format thousands (data is already in K units)
        const formatThousandsLabel = (value) => {
            const numeric = Number(value);
            if (Number.isNaN(numeric) || numeric === 0) {
                return '';
            }
            return `₱${numeric.toLocaleString('en-PH', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            })}K`;
        };

        // Monthly data for venue (P-Value) - values in thousands
        const monthlyVenueData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [81.6, 81.6, 81.6, 81.6, 81.6, 81.6, 81.6, 81.6, 81.6, 81.6, 81.6, 81.6], // Constant target
            year2024: [36.8, 25.0, 44.1, 56.3, 72.1, 79.1, 82.3, 72.9, 34.7, 60.8, 44.1, 51.3],
            year2025: [6.9, 27.2, 4.4, 76.1, 33.4, 10.0, 12.2, 9.6, 34.5, 13.5, 0, 0]
        };

        // Venue (P-Value) Comparison Bar Chart
        const venueChartData = {
            labels: monthlyVenueData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyVenueData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: monthlyVenueData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Current (60%) Target',
                    type: 'line',
                    order: 3,
                    data: monthlyVenueData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        // Custom plugin for venue chart data labels (handles K format, labels above bars)
        const venueDataLabelsPlugin = {
            id: 'venueDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                const chartArea = chart.chartArea;
                
                ctx.save();
                ctx.font = 'bold 10px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                
                const labelOffset = 4; // Distance above bar top
                
                // Draw labels directly above each bar
                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'bar') {
                        return;
                    }
                    meta.data.forEach((bar, index) => {
                        const data = dataset.data[index];
                        if (data !== null && data !== undefined && data > 0 && typeof bar.height === 'number' && bar.height > 0) {
                            const value = formatThousandsLabel(data);
                            if (value) {
                                // Position label directly above this bar
                                const barTop = bar.y - bar.height;
                                let labelY = barTop - labelOffset;
                                
                                // Ensure label is within chart area (with some margin)
                                const minY = chartArea.top + 5;
                                if (labelY < minY) {
                                    labelY = minY;
                                }
                                
                                // Only draw if within chart bounds
                                if (bar.x >= chartArea.left && bar.x <= chartArea.right && 
                                    labelY >= chartArea.top && labelY <= chartArea.bottom) {
                                    const labelColor = resolveDataLabelColor(dataset.dataLabelColor || dataset.backgroundColor, index);
                                    ctx.fillStyle = labelColor;
                                    ctx.fillText(value, bar.x, labelY);
                                }
                            }
                        }
                    });
                });
                
                ctx.restore();
            }
        };

        // Custom line labels plugin for venue chart (uses K format)
        const venueLineDataLabelsPlugin = {
            id: 'venueLineDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'line') {
                        return;
                    }

                    // Only show label for one point (e.g., first month) to avoid clutter
                    const point = meta.data[0];
                    if (!point) {
                        return;
                    }
                    const data = dataset.data[0];
                    if (data === null || data === undefined) {
                        return;
                    }

                    const label = formatThousandsLabel(data);
                    if (!label) {
                        return;
                    }
                    const color = resolveDataLabelColor(dataset.dataLabelColor || dataset.borderColor, 0);
                    const offset = dataset.dataLabelOffset || 12;
                    ctx.fillStyle = color;
                    ctx.fillText(label, point.x, point.y - offset);
                });

                ctx.restore();
            }
        };

        const venueChartConfig = {
            type: 'bar',
            data: venueChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                if (context.dataset.type === 'line') {
                                    return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
                                }
                                return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
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
                                return formatMillionsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Venue (P-Value) (Thousands ₱)',
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
            plugins: [
                venueDataLabelsPlugin,
                venueLineDataLabelsPlugin
            ]
        };

        // Initialize the venue chart
        const venueChart = new Chart(
            document.getElementById('venueChart'),
            venueChartConfig
        );

        // ============================================
        // SECTION 6: STUDIO (P-VALUE) CHARTS
        // ============================================

        // Monthly data for Studio (P-Value) - values in thousands
        const monthlyStudioData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60], // Current (60%) Target - approximately 60K based on image
            year2024: [58.6, 74.4, 83.2, 52.6, 41.4, 40.6, 48.9, 58.4, 57.4, 72.9, 43.3, 36.8],
            year2025: [76.1, 88.5, 71.5, 52.2, 94.0, 146.7, 113.1, 103.9, 54.5, 69.3, null, null] // Nov and Dec have no data
        };

        // Studio (P-Value) Comparison Bar Chart
        const studioChartData = {
            labels: monthlyStudioData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyStudioData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: monthlyStudioData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Current (60%) Target',
                    type: 'line',
                    order: 3,
                    data: monthlyStudioData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const studioChartConfig = {
            type: 'bar',
            data: studioChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                if (value === null || value === undefined) {
                                    return `${context.dataset.label}: No data`;
                                }
                                return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
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
                                return formatThousandsLabel(value) || '₱0K';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Studio (P-Value) (Thousands ₱)',
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
            plugins: [
                venueDataLabelsPlugin,
                venueLineDataLabelsPlugin
            ]
        };

        // Initialize the studio chart
        const studioChart = new Chart(
            document.getElementById('studioChart'),
            studioChartConfig
        );

        // ============================================
        // SECTION 7: SPORTS ARENA (P-VALUE) CHARTS
        // ============================================

        // Monthly data for Sports Arena (P-Value) - values in thousands
        const monthlySportsArenaData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [401.8, 401.8, 401.8, 401.8, 401.8, 401.8, 401.8, 401.8, 401.8, 401.8, 401.8, 401.8], // Current (60%) Target - 401.8K
            year2024: [212.0, 147.3, 344.9, 346.5, 262.6, 235.9, 195.2, 248.9, 194.6, 253.5, 388.3, 411.9],
            year2025: [334.5, 354.2, 341.6, 360.8, 431.5, 445.0, 477.1, 433.4, 385.4, 452.0, 11.5, null] // Dec has no data
        };

        // Sports Arena (P-Value) Comparison Bar Chart
        const sportsArenaChartData = {
            labels: monthlySportsArenaData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlySportsArenaData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: monthlySportsArenaData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Current (60%) Target',
                    type: 'line',
                    order: 3,
                    data: monthlySportsArenaData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const sportsArenaChartConfig = {
            type: 'bar',
            data: sportsArenaChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                if (value === null || value === undefined) {
                                    return `${context.dataset.label}: No data`;
                                }
                                return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
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
                                return formatThousandsLabel(value) || '₱0K';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Sports Arena (P-Value) (Thousands ₱)',
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
            plugins: [
                venueDataLabelsPlugin,
                venueLineDataLabelsPlugin
            ]
        };

        // Initialize the sports arena chart
        const sportsArenaChart = new Chart(
            document.getElementById('sportsArenaChart'),
            sportsArenaChartConfig
        );

        // ============================================
        // SECTION 8: PARKING INCOME CHARTS
        // ============================================

        // Monthly data for Parking Income - values in millions
        const monthlyParkingIncomeData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4], // Target line: 1.3M for Jan-Jun, 1.4M for Jul-Dec
            year2024: [1.3, 1.2, 1.3, 1.2, 1.3, 1.3, 1.4, 1.4, 1.1, 1.0, 1.0, 1.1],
            year2025: [1.5, 1.4, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.4, 1.6, 1.2, 1.6]
        };

        // Parking Income Comparison Bar Chart
        const parkingIncomeChartData = {
            labels: monthlyParkingIncomeData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyParkingIncomeData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: monthlyParkingIncomeData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Current Year Target',
                    type: 'line',
                    order: 3,
                    data: monthlyParkingIncomeData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const parkingIncomeChartConfig = {
            type: 'bar',
            data: parkingIncomeChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#525552',
                    bodyColor: '#525552',
                    borderColor: '#f0f0f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                            return `${context.dataset.label}: ${formatMillionsLabel(value)}`;
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
                                return formatMillionsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Parking Income (Millions ₱)',
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
            plugins: [
                createBarDataLabelsPlugin('parkingIncomeBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        // Initialize the parking income chart
        const parkingIncomeChart = new Chart(
            document.getElementById('parkingIncomeChart'),
            parkingIncomeChartConfig
        );

        // ============================================
        // SECTION 9: ELECTRICITY EXPENSE CHARTS
        // ============================================

        // Monthly data for Electricity Expense - values in millions
        const monthlyElectricityExpenseData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [7.0, 7.0, 7.0, 7.5, 8.4, 8.4, 7.9, 7.9, 7.9, 8.1, 8.3, 8.3],
            year2024: [7.4, 6.9, 7.4, 8.2, 9.8, 8.9, 7.8, 7.9, 7.7, 8.4, 7.7, 7.6],
            year2025: [7.2, 7.2, 8.0, 8.8, 9.9, 8.2, 7.9, 9.5, 8.2, 7.9, 8.4, 7.4]
        };

        // Electricity Expense Comparison Bar Chart
        const electricityExpenseChartData = {
            labels: monthlyElectricityExpenseData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyElectricityExpenseData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: monthlyElectricityExpenseData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Current Year Target',
                    type: 'line',
                    order: 3,
                    data: monthlyElectricityExpenseData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const electricityExpenseChartConfig = {
            type: 'bar',
            data: electricityExpenseChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#525552',
                    bodyColor: '#525552',
                    borderColor: '#f0f0f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                            return `${context.dataset.label}: ${formatMillionsLabel(value)}`;
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
                            text: 'Electricity Expense (Millions ₱)',
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
            plugins: [
                createBarDataLabelsPlugin('electricityExpenseBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        // Initialize the electricity expense chart
        const electricityExpenseChart = new Chart(
            document.getElementById('electricityExpenseChart'),
            electricityExpenseChartConfig
        );

        // ============================================
        // SECTION 10: WATER EXPENSE CHARTS
        // ============================================

        // Monthly data for Water Expense - values in thousands
        const monthlyWaterExpenseData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [296.2, 322.5, 323.1, 269.0, 220.2, 243.0, 250.1, 227.3, 184.5, 218.0, 220.1, 222.2],
            year2024: [288.3, 318.0, 314.8, 261.3, 213.0, 235.6, 242.6, 168.4, 209.2, 229.2, 213.8, 209.9],
            year2025: [232.2, 228.9, 229.4, 210.1, 248.7, 219.1, 225.9, 224.0, 217.3, 238.3, 260.6, 235.4]
        };

        // Water Expense Comparison Bar Chart
        const waterExpenseChartData = {
            labels: monthlyWaterExpenseData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyWaterExpenseData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: monthlyWaterExpenseData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Current Year Target',
                    type: 'line',
                    order: 3,
                    data: monthlyWaterExpenseData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        // Custom plugin for water expense chart data labels (handles K format, labels inside bars)
        const waterExpenseDataLabelsPlugin = {
            id: 'waterExpenseDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                
                const labelLineHeight = 14;
                const minVerticalSpacing = 4;
                const labelOffset = 5;
                const maxLabelDistance = 25;
                
                // Collect all bar labels with their positions
                const allLabels = [];
                
                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'bar') {
                        return;
                    }
                    meta.data.forEach((bar, index) => {
                        const data = dataset.data[index];
                        if (data !== null && data !== undefined && typeof bar.height === 'number' && bar.height > 0) {
                            const value = formatThousandsLabel(data);
                            if (!value) {
                                return;
                            }
                            allLabels.push({
                                value: value,
                                barY: bar.y,
                                barHeight: bar.height,
                                barX: bar.x,
                                barTop: bar.y,
                                categoryIndex: index,
                                datasetIndex: datasetIndex,
                                labelColor: resolveDataLabelColor(dataset.dataLabelColor || dataset.backgroundColor, index)
                            });
                        }
                    });
                });
                
                // Sort all labels by category, then by bar height (tallest first within category)
                allLabels.sort((a, b) => {
                    if (a.categoryIndex !== b.categoryIndex) {
                        return a.categoryIndex - b.categoryIndex;
                    }
                    return a.barY - b.barY;
                });
                
                // Calculate final label positions with collision detection
                const labelPositions = [];
                
                allLabels.forEach((label) => {
                    let labelY = label.barTop - labelOffset;
                    const textWidth = ctx.measureText(label.value).width;
                    let requiredY = labelY;
                    
                    for (let i = 0; i < labelPositions.length; i++) {
                        const prev = labelPositions[i];
                        const sameCategory = label.categoryIndex === prev.categoryIndex;
                        
                        const labelLeft = label.barX - textWidth / 2;
                        const labelRight = label.barX + textWidth / 2;
                        const prevLeft = prev.x - prev.textWidth / 2;
                        const prevRight = prev.x + prev.textWidth / 2;
                        const horizontalOverlap = !(labelRight < prevLeft || labelLeft > prevRight);
                        
                        let collision = false;
                        
                        if (sameCategory) {
                            const verticalDistInitial = Math.abs(labelY - prev.y);
                            if (verticalDistInitial < (labelLineHeight + minVerticalSpacing)) {
                                collision = true;
                            }
                        } else {
                            if (horizontalOverlap) {
                                const verticalDistInitial = Math.abs(labelY - prev.y);
                                if (verticalDistInitial < (labelLineHeight + minVerticalSpacing)) {
                                    collision = true;
                                }
                            }
                        }
                        
                        if (collision) {
                            const neededY = prev.y - (labelLineHeight + minVerticalSpacing);
                            if (neededY < requiredY) {
                                requiredY = neededY;
                            }
                        }
                    }
                    
                    labelY = requiredY;
                    
                    const minY = label.barTop - labelOffset - maxLabelDistance;
                    if (labelY < minY) {
                        labelY = minY;
                    }
                    
                    labelPositions.push({
                        x: label.barX,
                        y: labelY,
                        value: label.value,
                        categoryIndex: label.categoryIndex,
                        textWidth: textWidth,
                        labelColor: label.labelColor
                    });
                });
                
                // Draw all labels at their calculated positions
                labelPositions.forEach((pos) => {
                    ctx.fillStyle = pos.labelColor;
                    ctx.fillText(pos.value, pos.x, pos.y);
                });
                
                ctx.restore();
            }
        };

        // Custom line labels plugin for water expense chart (uses K format)
        const waterExpenseLineDataLabelsPlugin = {
            id: 'waterExpenseLineDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'line') {
                        return;
                    }

                    meta.data.forEach((point, index) => {
                        const data = dataset.data[index];
                        if (data === null || data === undefined) {
                            return;
                        }

                        const label = formatThousandsLabel(data);
                        if (!label) {
                            return;
                        }
                        const color = resolveDataLabelColor(dataset.dataLabelColor || dataset.borderColor, index);
                        const offset = dataset.dataLabelOffset || 12;
                        ctx.fillStyle = color;
                        ctx.fillText(label, point.x, point.y - offset);
                    });
                });

                ctx.restore();
            }
        };

        const waterExpenseChartConfig = {
            type: 'bar',
            data: waterExpenseChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#525552',
                    bodyColor: '#525552',
                    borderColor: '#f0f0f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                            return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
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
                                return formatThousandsLabel(value) || '₱0K';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Water Expense (Thousands ₱)',
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
            plugins: [
                waterExpenseDataLabelsPlugin,
                waterExpenseLineDataLabelsPlugin
            ]
        };

        // Initialize the water expense chart
        const waterExpenseChart = new Chart(
            document.getElementById('waterExpenseChart'),
            waterExpenseChartConfig
        );

        // ============================================
        // SECTION 11: SECURITY EXPENSE CHARTS
        // ============================================

        // Monthly data for Security Expense - values in millions
        const monthlySecurityExpenseData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [3.4, 3.2, 3.5, 3.4, 3.4, 3.3, 3.4, 3.5, 3.1, 3.4, 3.4, 3.5],
            year2024: [3.1, 3.1, 3.5, 3.3, 3.1, 3.0, 3.0, 2.9, 3.0, 3.2, 3.4, 3.4],
            year2025: [3.6, 3.4, 3.4, 3.4, 3.4, 3.5, 3.5, 3.5, 3.1, 3.4, 3.6, 3.5]
        };

        // Security Expense Comparison Bar Chart
        const securityExpenseChartData = {
            labels: monthlySecurityExpenseData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlySecurityExpenseData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: monthlySecurityExpenseData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Current Year Target',
                    type: 'line',
                    order: 3,
                    data: monthlySecurityExpenseData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const securityExpenseChartConfig = {
            type: 'bar',
            data: securityExpenseChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#525552',
                    bodyColor: '#525552',
                    borderColor: '#f0f0f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                            return `${context.dataset.label}: ${formatMillionsLabel(value)}`;
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
                            text: 'Security Expense (Millions ₱)',
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
            plugins: [
                createBarDataLabelsPlugin('securityExpenseBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        // Initialize the security expense chart
        const securityExpenseChart = new Chart(
            document.getElementById('securityExpenseChart'),
            securityExpenseChartConfig
        );

        // ============================================
        // SECTION 12: AGENCY EXPENSE CHARTS
        // ============================================

        // Monthly data for Agency Expense - values in millions
        const monthlyAgencyExpenseData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [3.2, 3.0, 3.4, 3.2, 3.2, 3.1, 3.1, 3.3, 3.0, 3.1, 3.2, 3.4],
            year2025: [3.3, 3.4, 3.5, 3.6, 3.6, 3.5, 3.4, 3.4, 2.9, 2.9, 3.2, 3.3]
        };

        // Agency Expense Comparison Bar Chart
        const agencyExpenseChartData = {
            labels: monthlyAgencyExpenseData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyAgencyExpenseData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Current Year Target',
                    type: 'line',
                    order: 2,
                    data: monthlyAgencyExpenseData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const agencyExpenseChartConfig = {
            type: 'bar',
            data: agencyExpenseChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#525552',
                    bodyColor: '#525552',
                    borderColor: '#f0f0f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                            return `${context.dataset.label}: ${formatMillionsLabel(value)}`;
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
                            text: 'Agency Expense (Millions ₱)',
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
            plugins: [
                createBarDataLabelsPlugin('agencyExpenseBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        // Initialize the agency expense chart
        const agencyExpenseChart = new Chart(
            document.getElementById('agencyExpenseChart'),
            agencyExpenseChartConfig
        );

        // ============================================
        // SECTION 13: SALARY EXPENSE CHARTS
        // ============================================

        // Monthly data for Salary Expense - values in millions
        const monthlySalaryExpenseData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [3.1, 3.0, 2.8, 3.0, 3.2, 3.2, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5],
            year2024: [2.4, 2.5, 2.5, 2.4, 2.4, 2.4, 2.5, 2.7, 2.4, 2.5, 2.8, 3.4],
            year2025: [2.6, 2.5, 2.4, 2.7, 2.5, 2.6, 2.5, 2.9, 2.8, 2.8, 3.1, 4.1]
        };

        // Salary Expense Comparison Bar Chart
        const salaryExpenseChartData = {
            labels: monthlySalaryExpenseData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlySalaryExpenseData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: monthlySalaryExpenseData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Current Year Target',
                    type: 'line',
                    order: 3,
                    data: monthlySalaryExpenseData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const salaryExpenseChartConfig = {
            type: 'bar',
            data: salaryExpenseChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#525552',
                    bodyColor: '#525552',
                    borderColor: '#f0f0f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                            return `${context.dataset.label}: ${formatMillionsLabel(value)}`;
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
                            text: 'Salary Expense (Millions ₱)',
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
            plugins: [
                createBarDataLabelsPlugin('salaryExpenseBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        // Initialize the salary expense chart
        const salaryExpenseChart = new Chart(
            document.getElementById('salaryExpenseChart'),
            salaryExpenseChartConfig
        );

        // ============================================
        // SECTION 14: MARKETING EXPENSE CHARTS
        // ============================================

        // Monthly data for Marketing Expense - values in thousands
        const monthlyMarketingExpenseData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [-155.8, -155.8, -155.8, -155.8, -155.8, -155.8, -155.8, -155.8, -155.8, -155.8, -155.8, -155.8],
            year2025: [48.2, 59.9, 2.9, 20.2, 0, -3.5, 42.0, 50.0, 1.3, -9.4, 592.3, 577.2]
        };

        // Marketing Expense Comparison Bar Chart
        const marketingExpenseChartData = {
            labels: monthlyMarketingExpenseData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyMarketingExpenseData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Current Year Target',
                    type: 'line',
                    order: 2,
                    data: monthlyMarketingExpenseData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        // Custom plugin for marketing expense chart data labels (handles K format and negative values)
        const marketingExpenseDataLabelsPlugin = {
            id: 'marketingExpenseDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                
                const labelOffset = 5;
                
                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'bar') {
                        return;
                    }
                    meta.data.forEach((bar, index) => {
                        const data = dataset.data[index];
                        if (data !== null && data !== undefined && typeof bar.height === 'number') {
                            const value = formatThousandsLabel(Math.abs(data));
                            if (!value || data === 0) {
                                return;
                            }
                            
                            // Position label above bar for positive values, below for negative
                            const labelY = data >= 0 ? bar.y - labelOffset : bar.y + labelOffset + 12;
                            const labelColor = resolveDataLabelColor(dataset.dataLabelColor || dataset.backgroundColor, index);
                            
                            ctx.fillStyle = labelColor;
                            ctx.textBaseline = data >= 0 ? 'bottom' : 'top';
                            
                            // Add negative sign if needed
                            const displayValue = data < 0 ? '-' + value : value;
                            ctx.fillText(displayValue, bar.x, labelY);
                        }
                    });
                });
                
                ctx.restore();
            }
        };

        // Custom line labels plugin for marketing expense chart (uses K format)
        const marketingExpenseLineDataLabelsPlugin = {
            id: 'marketingExpenseLineDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'line') {
                        return;
                    }

                    // Only show label for one point to avoid clutter
                    const point = meta.data[0];
                    if (!point) {
                        return;
                    }
                    const data = dataset.data[0];
                    if (data === null || data === undefined) {
                        return;
                    }

                    const label = formatThousandsLabel(Math.abs(data));
                    if (!label) {
                        return;
                    }
                    const color = resolveDataLabelColor(dataset.dataLabelColor || dataset.borderColor, 0);
                    const offset = dataset.dataLabelOffset || 12;
                    ctx.fillStyle = color;
                    const displayValue = data < 0 ? '-' + label : label;
                    ctx.fillText(displayValue, point.x, point.y - offset);
                });

                ctx.restore();
            }
        };

        const marketingExpenseChartConfig = {
            type: 'bar',
            data: marketingExpenseChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#525552',
                    bodyColor: '#525552',
                    borderColor: '#f0f0f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                            return `${context.dataset.label}: ${formatThousandsLabel(Math.abs(value))}${value < 0 ? ' (negative)' : ''}`;
                        }
                    }
                }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return formatThousandsLabel(value) || '₱0K';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Marketing Expense (Thousands ₱)',
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
            plugins: [
                marketingExpenseDataLabelsPlugin,
                marketingExpenseLineDataLabelsPlugin
            ]
        };

        // Initialize the marketing expense chart
        const marketingExpenseChart = new Chart(
            document.getElementById('marketingExpenseChart'),
            marketingExpenseChartConfig
        );

        // ============================================
        // SECTION 15: MARKETING EXPENSE (GATHERING) CHARTS
        // ============================================

        // Monthly data for Marketing Expense (Gathering) - values in thousands
        const monthlyMarketingExpenseGatheringData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [73.5, 73.5, 73.5, 73.5, 73.5, 73.5, 73.5, 73.5, 73.5, 73.5, 73.5, 73.5],
            year2025: [72.2, 148.5, 86.4, 62.5, 220.1, 81.3, 84.2, 93.1, 125.6, 218.9, 209.9, 179.2]
        };

        // Marketing Expense (Gathering) Comparison Bar Chart
        const marketingExpenseGatheringChartData = {
            labels: monthlyMarketingExpenseGatheringData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyMarketingExpenseGatheringData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Current Year Target',
                    type: 'line',
                    order: 2,
                    data: monthlyMarketingExpenseGatheringData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        // Custom plugin for marketing expense gathering chart data labels (handles K format)
        const marketingExpenseGatheringDataLabelsPlugin = {
            id: 'marketingExpenseGatheringDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                
                const labelLineHeight = 14;
                const minVerticalSpacing = 4;
                const labelOffset = 5;
                const maxLabelDistance = 25;
                
                // Collect all bar labels with their positions
                const allLabels = [];
                
                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'bar') {
                        return;
                    }
                    meta.data.forEach((bar, index) => {
                        const data = dataset.data[index];
                        if (data !== null && data !== undefined && typeof bar.height === 'number' && bar.height > 0) {
                            const value = formatThousandsLabel(data);
                            if (!value) {
                                return;
                            }
                            allLabels.push({
                                value: value,
                                barY: bar.y,
                                barHeight: bar.height,
                                barX: bar.x,
                                barTop: bar.y,
                                categoryIndex: index,
                                datasetIndex: datasetIndex,
                                labelColor: resolveDataLabelColor(dataset.dataLabelColor || dataset.backgroundColor, index)
                            });
                        }
                    });
                });
                
                // Sort all labels by category, then by bar height (tallest first within category)
                allLabels.sort((a, b) => {
                    if (a.categoryIndex !== b.categoryIndex) {
                        return a.categoryIndex - b.categoryIndex;
                    }
                    return a.barY - b.barY;
                });
                
                // Calculate final label positions with collision detection
                const labelPositions = [];
                
                allLabels.forEach((label) => {
                    let labelY = label.barTop - labelOffset;
                    const textWidth = ctx.measureText(label.value).width;
                    let requiredY = labelY;
                    
                    for (let i = 0; i < labelPositions.length; i++) {
                        const prev = labelPositions[i];
                        const sameCategory = label.categoryIndex === prev.categoryIndex;
                        
                        const labelLeft = label.barX - textWidth / 2;
                        const labelRight = label.barX + textWidth / 2;
                        const prevLeft = prev.x - prev.textWidth / 2;
                        const prevRight = prev.x + prev.textWidth / 2;
                        const horizontalOverlap = !(labelRight < prevLeft || labelLeft > prevRight);
                        
                        let collision = false;
                        
                        if (sameCategory) {
                            const verticalDistInitial = Math.abs(labelY - prev.y);
                            if (verticalDistInitial < (labelLineHeight + minVerticalSpacing)) {
                                collision = true;
                            }
                        } else {
                            if (horizontalOverlap) {
                                const verticalDistInitial = Math.abs(labelY - prev.y);
                                if (verticalDistInitial < (labelLineHeight + minVerticalSpacing)) {
                                    collision = true;
                                }
                            }
                        }
                        
                        if (collision) {
                            const neededY = prev.y - (labelLineHeight + minVerticalSpacing);
                            if (neededY < requiredY) {
                                requiredY = neededY;
                            }
                        }
                    }
                    
                    labelY = requiredY;
                    
                    const minY = label.barTop - labelOffset - maxLabelDistance;
                    if (labelY < minY) {
                        labelY = minY;
                    }
                    
                    labelPositions.push({
                        x: label.barX,
                        y: labelY,
                        value: label.value,
                        categoryIndex: label.categoryIndex,
                        textWidth: textWidth,
                        labelColor: label.labelColor
                    });
                });
                
                // Draw all labels at their calculated positions
                labelPositions.forEach((pos) => {
                    ctx.fillStyle = pos.labelColor;
                    ctx.fillText(pos.value, pos.x, pos.y);
                });
                
                ctx.restore();
            }
        };

        // Custom line labels plugin for marketing expense gathering chart (uses K format)
        const marketingExpenseGatheringLineDataLabelsPlugin = {
            id: 'marketingExpenseGatheringLineDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'line') {
                        return;
                    }

                    // Only show label for one point to avoid clutter
                    const point = meta.data[0];
                    if (!point) {
                        return;
                    }
                    const data = dataset.data[0];
                    if (data === null || data === undefined) {
                        return;
                    }

                    const label = formatThousandsLabel(data);
                    if (!label) {
                        return;
                    }
                    const color = resolveDataLabelColor(dataset.dataLabelColor || dataset.borderColor, 0);
                    const offset = dataset.dataLabelOffset || 12;
                    ctx.fillStyle = color;
                    ctx.fillText(label, point.x, point.y - offset);
                });

                ctx.restore();
            }
        };

        const marketingExpenseGatheringChartConfig = {
            type: 'bar',
            data: marketingExpenseGatheringChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#525552',
                    bodyColor: '#525552',
                    borderColor: '#f0f0f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                            return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
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
                                return formatThousandsLabel(value) || '₱0K';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Marketing Expense (Thousands ₱)',
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
            plugins: [
                marketingExpenseGatheringDataLabelsPlugin,
                marketingExpenseGatheringLineDataLabelsPlugin
            ]
        };

        // Initialize the marketing expense gathering chart
        const marketingExpenseGatheringChart = new Chart(
            document.getElementById('marketingExpenseGatheringChart'),
            marketingExpenseGatheringChartConfig
        );

        // ============================================
        // SECTION 17: REPAIRS & MAINTENANCE (LABOR) CHARTS - DC TEAM
        // ============================================

        // Monthly data for Repairs & Maintenance (Labor) - values in thousands
        const monthlyRepairsMaintenanceLaborData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [93.9, 93.9, 93.9, 93.9, 93.9, 93.9, 93.9, 93.9, 93.9, 93.9, 93.9, 93.9],
            year2025: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };

        // Repairs & Maintenance (Labor) Comparison Bar Chart
        const repairsMaintenanceLaborChartData = {
            labels: monthlyRepairsMaintenanceLaborData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyRepairsMaintenanceLaborData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Current Year Target',
                    type: 'line',
                    order: 2,
                    data: monthlyRepairsMaintenanceLaborData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        // Custom plugin for repairs & maintenance labor chart data labels (handles K format)
        const repairsMaintenanceLaborDataLabelsPlugin = {
            id: 'repairsMaintenanceLaborDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                
                const labelLineHeight = 14;
                const minVerticalSpacing = 4;
                const labelOffset = 5;
                const maxLabelDistance = 25;
                
                // Collect all bar labels with their positions
                const allLabels = [];
                
                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'bar') {
                        return;
                    }
                    meta.data.forEach((bar, index) => {
                        const data = dataset.data[index];
                        if (data !== null && data !== undefined && typeof bar.height === 'number' && bar.height > 0) {
                            const value = formatThousandsLabel(data);
                            if (!value) {
                                return;
                            }
                            allLabels.push({
                                value: value,
                                barY: bar.y,
                                barHeight: bar.height,
                                barX: bar.x,
                                barTop: bar.y,
                                categoryIndex: index,
                                datasetIndex: datasetIndex,
                                labelColor: resolveDataLabelColor(dataset.dataLabelColor || dataset.backgroundColor, index)
                            });
                        }
                    });
                });
                
                // Sort all labels by category, then by bar height (tallest first within category)
                allLabels.sort((a, b) => {
                    if (a.categoryIndex !== b.categoryIndex) {
                        return a.categoryIndex - b.categoryIndex;
                    }
                    return a.barY - b.barY;
                });
                
                // Calculate final label positions with collision detection
                const labelPositions = [];
                
                allLabels.forEach((label) => {
                    let labelY = label.barTop - labelOffset;
                    const textWidth = ctx.measureText(label.value).width;
                    let requiredY = labelY;
                    
                    for (let i = 0; i < labelPositions.length; i++) {
                        const prev = labelPositions[i];
                        const sameCategory = label.categoryIndex === prev.categoryIndex;
                        
                        const labelLeft = label.barX - textWidth / 2;
                        const labelRight = label.barX + textWidth / 2;
                        const prevLeft = prev.x - prev.textWidth / 2;
                        const prevRight = prev.x + prev.textWidth / 2;
                        const horizontalOverlap = !(labelRight < prevLeft || labelLeft > prevRight);
                        
                        let collision = false;
                        
                        if (sameCategory) {
                            const verticalDistInitial = Math.abs(labelY - prev.y);
                            if (verticalDistInitial < (labelLineHeight + minVerticalSpacing)) {
                                collision = true;
                            }
                        } else {
                            if (horizontalOverlap) {
                                const verticalDistInitial = Math.abs(labelY - prev.y);
                                if (verticalDistInitial < (labelLineHeight + minVerticalSpacing)) {
                                    collision = true;
                                }
                            }
                        }
                        
                        if (collision) {
                            const neededY = prev.y - (labelLineHeight + minVerticalSpacing);
                            if (neededY < requiredY) {
                                requiredY = neededY;
                            }
                        }
                    }
                    
                    labelY = requiredY;
                    
                    const minY = label.barTop - labelOffset - maxLabelDistance;
                    if (labelY < minY) {
                        labelY = minY;
                    }
                    
                    labelPositions.push({
                        x: label.barX,
                        y: labelY,
                        value: label.value,
                        categoryIndex: label.categoryIndex,
                        textWidth: textWidth,
                        labelColor: label.labelColor
                    });
                });
                
                // Draw all labels at their calculated positions
                labelPositions.forEach((pos) => {
                    ctx.fillStyle = pos.labelColor;
                    ctx.fillText(pos.value, pos.x, pos.y);
                });
                
                ctx.restore();
            }
        };

        // Custom line labels plugin for repairs & maintenance labor chart (uses K format)
        const repairsMaintenanceLaborLineDataLabelsPlugin = {
            id: 'repairsMaintenanceLaborLineDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'line') {
                        return;
                    }

                    // Only show label for one point to avoid clutter
                    const point = meta.data[0];
                    if (!point) {
                        return;
                    }
                    const data = dataset.data[0];
                    if (data === null || data === undefined) {
                        return;
                    }

                    const label = formatThousandsLabel(data);
                    if (!label) {
                        return;
                    }
                    const color = resolveDataLabelColor(dataset.dataLabelColor || dataset.borderColor, 0);
                    const offset = dataset.dataLabelOffset || 12;
                    ctx.fillStyle = color;
                    ctx.fillText(label, point.x, point.y - offset);
                });

                ctx.restore();
            }
        };

        const repairsMaintenanceLaborChartConfig = {
            type: 'bar',
            data: repairsMaintenanceLaborChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#525552',
                    bodyColor: '#525552',
                    borderColor: '#f0f0f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                            return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
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
                                return formatThousandsLabel(value) || '₱0K';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Repairs & Maintenance (Labor) (Thousands ₱)',
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
            plugins: [
                repairsMaintenanceLaborDataLabelsPlugin,
                repairsMaintenanceLaborLineDataLabelsPlugin
            ]
        };

        // Initialize the repairs & maintenance labor chart
        const repairsMaintenanceLaborChart = new Chart(
            document.getElementById('repairsMaintenanceLaborChart'),
            repairsMaintenanceLaborChartConfig
        );

        // ============================================
        // SECTION 18: REPAIRS & MAINTENANCE (MATERIALS) CHARTS - DC TEAM
        // ============================================

        // Monthly data for Repairs & Maintenance (Materials) - values in thousands
        const monthlyRepairsMaintenanceMaterialsData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [32.08, 32.08, 32.08, 32.08, 32.08, 32.08, 32.08, 32.08, 32.08, 32.08, 32.08, 32.08],
            year2025: [55.8, 120.4, 190.4, 50.3, 36.2, 33.0, 69.7, 63.9, 55.0, 60.7, 32.1, 8.5]
        };

        // Repairs & Maintenance (Materials) Comparison Bar Chart
        const repairsMaintenanceMaterialsChartData = {
            labels: monthlyRepairsMaintenanceMaterialsData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyRepairsMaintenanceMaterialsData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Current Year Target',
                    type: 'line',
                    order: 2,
                    data: monthlyRepairsMaintenanceMaterialsData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        // Custom plugin for repairs & maintenance materials chart data labels (handles K format)
        const repairsMaintenanceMaterialsDataLabelsPlugin = {
            id: 'repairsMaintenanceMaterialsDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                
                const labelLineHeight = 14;
                const minVerticalSpacing = 4;
                const labelOffset = 5;
                const maxLabelDistance = 25;
                
                // Collect all bar labels with their positions
                const allLabels = [];
                
                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'bar') {
                        return;
                    }
                    meta.data.forEach((bar, index) => {
                        const data = dataset.data[index];
                        if (data !== null && data !== undefined && typeof bar.height === 'number' && bar.height > 0) {
                            const value = formatThousandsLabel(data);
                            if (!value) {
                                return;
                            }
                            allLabels.push({
                                value: value,
                                barY: bar.y,
                                barHeight: bar.height,
                                barX: bar.x,
                                barTop: bar.y,
                                categoryIndex: index,
                                datasetIndex: datasetIndex,
                                labelColor: resolveDataLabelColor(dataset.dataLabelColor || dataset.backgroundColor, index)
                            });
                        }
                    });
                });
                
                // Sort all labels by category, then by bar height (tallest first within category)
                allLabels.sort((a, b) => {
                    if (a.categoryIndex !== b.categoryIndex) {
                        return a.categoryIndex - b.categoryIndex;
                    }
                    return a.barY - b.barY;
                });
                
                // Calculate final label positions with collision detection
                const labelPositions = [];
                
                allLabels.forEach((label) => {
                    let labelY = label.barTop - labelOffset;
                    const textWidth = ctx.measureText(label.value).width;
                    let requiredY = labelY;
                    
                    for (let i = 0; i < labelPositions.length; i++) {
                        const prev = labelPositions[i];
                        const sameCategory = label.categoryIndex === prev.categoryIndex;
                        
                        const labelLeft = label.barX - textWidth / 2;
                        const labelRight = label.barX + textWidth / 2;
                        const prevLeft = prev.x - prev.textWidth / 2;
                        const prevRight = prev.x + prev.textWidth / 2;
                        const horizontalOverlap = !(labelRight < prevLeft || labelLeft > prevRight);
                        
                        let collision = false;
                        
                        if (sameCategory) {
                            const verticalDistInitial = Math.abs(labelY - prev.y);
                            if (verticalDistInitial < (labelLineHeight + minVerticalSpacing)) {
                                collision = true;
                            }
                        } else {
                            if (horizontalOverlap) {
                                const verticalDistInitial = Math.abs(labelY - prev.y);
                                if (verticalDistInitial < (labelLineHeight + minVerticalSpacing)) {
                                    collision = true;
                                }
                            }
                        }
                        
                        if (collision) {
                            const neededY = prev.y - (labelLineHeight + minVerticalSpacing);
                            if (neededY < requiredY) {
                                requiredY = neededY;
                            }
                        }
                    }
                    
                    labelY = requiredY;
                    
                    const minY = label.barTop - labelOffset - maxLabelDistance;
                    if (labelY < minY) {
                        labelY = minY;
                    }
                    
                    labelPositions.push({
                        x: label.barX,
                        y: labelY,
                        value: label.value,
                        categoryIndex: label.categoryIndex,
                        textWidth: textWidth,
                        labelColor: label.labelColor
                    });
                });
                
                // Draw all labels at their calculated positions
                labelPositions.forEach((pos) => {
                    ctx.fillStyle = pos.labelColor;
                    ctx.fillText(pos.value, pos.x, pos.y);
                });
                
                ctx.restore();
            }
        };

        // Custom line labels plugin for repairs & maintenance materials chart (uses K format)
        const repairsMaintenanceMaterialsLineDataLabelsPlugin = {
            id: 'repairsMaintenanceMaterialsLineDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'line') {
                        return;
                    }

                    // Only show label for one point to avoid clutter
                    const point = meta.data[0];
                    if (!point) {
                        return;
                    }
                    const data = dataset.data[0];
                    if (data === null || data === undefined) {
                        return;
                    }

                    const label = formatThousandsLabel(data);
                    if (!label) {
                        return;
                    }
                    const color = resolveDataLabelColor(dataset.dataLabelColor || dataset.borderColor, 0);
                    const offset = dataset.dataLabelOffset || 12;
                    ctx.fillStyle = color;
                    ctx.fillText(label, point.x, point.y - offset);
                });

                ctx.restore();
            }
        };

        const repairsMaintenanceMaterialsChartConfig = {
            type: 'bar',
            data: repairsMaintenanceMaterialsChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#525552',
                    bodyColor: '#525552',
                    borderColor: '#f0f0f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                            return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
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
                                return formatThousandsLabel(value) || '₱0K';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Repairs & Maintenance (Materials) (Thousands ₱)',
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
            plugins: [
                repairsMaintenanceMaterialsDataLabelsPlugin,
                repairsMaintenanceMaterialsLineDataLabelsPlugin
            ]
        };

        // Initialize the repairs & maintenance materials chart
        const repairsMaintenanceMaterialsChart = new Chart(
            document.getElementById('repairsMaintenanceMaterialsChart'),
            repairsMaintenanceMaterialsChartConfig
        );

        // ============================================
        // SECTION 19: REPAIRS & MAINTENANCE (LABOR) CHARTS - TECHNICAL TEAM
        // ============================================

        // Monthly data for Repairs & Maintenance (Labor) - Technical Team - values in thousands
        const monthlyRepairsMaintenanceLaborTechnicalData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [167.5, 167.5, 167.5, 167.5, 167.5, 167.5, 167.5, 167.5, 167.5, 167.5, 167.5, 167.5],
            year2025: [119.0, 119.4, 130.6, 143.1, 246.4, 131.0, 292.5, 165.9, 166.8, 182.0, 167.5, 117.9]
        };

        // Repairs & Maintenance (Labor) - Technical Team Comparison Bar Chart
        const repairsMaintenanceLaborTechnicalChartData = {
            labels: monthlyRepairsMaintenanceLaborTechnicalData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyRepairsMaintenanceLaborTechnicalData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Current Year Target',
                    type: 'line',
                    order: 2,
                    data: monthlyRepairsMaintenanceLaborTechnicalData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        // Custom plugin for repairs & maintenance labor technical chart data labels (handles K format)
        const repairsMaintenanceLaborTechnicalDataLabelsPlugin = {
            id: 'repairsMaintenanceLaborTechnicalDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                
                const labelLineHeight = 14;
                const minVerticalSpacing = 4;
                const labelOffset = 5;
                const maxLabelDistance = 25;
                
                // Collect all bar labels with their positions
                const allLabels = [];
                
                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'bar') {
                        return;
                    }
                    meta.data.forEach((bar, index) => {
                        const data = dataset.data[index];
                        if (data !== null && data !== undefined && typeof bar.height === 'number' && bar.height > 0) {
                            const value = formatThousandsLabel(data);
                            if (!value) {
                                return;
                            }
                            allLabels.push({
                                value: value,
                                barY: bar.y,
                                barHeight: bar.height,
                                barX: bar.x,
                                barTop: bar.y,
                                categoryIndex: index,
                                datasetIndex: datasetIndex,
                                labelColor: resolveDataLabelColor(dataset.dataLabelColor || dataset.backgroundColor, index)
                            });
                        }
                    });
                });
                
                // Sort all labels by category, then by bar height (tallest first within category)
                allLabels.sort((a, b) => {
                    if (a.categoryIndex !== b.categoryIndex) {
                        return a.categoryIndex - b.categoryIndex;
                    }
                    return a.barY - b.barY;
                });
                
                // Calculate final label positions with collision detection
                const labelPositions = [];
                
                allLabels.forEach((label) => {
                    let labelY = label.barTop - labelOffset;
                    const textWidth = ctx.measureText(label.value).width;
                    let requiredY = labelY;
                    
                    for (let i = 0; i < labelPositions.length; i++) {
                        const prev = labelPositions[i];
                        const sameCategory = label.categoryIndex === prev.categoryIndex;
                        
                        const labelLeft = label.barX - textWidth / 2;
                        const labelRight = label.barX + textWidth / 2;
                        const prevLeft = prev.x - prev.textWidth / 2;
                        const prevRight = prev.x + prev.textWidth / 2;
                        const horizontalOverlap = !(labelRight < prevLeft || labelLeft > prevRight);
                        
                        let collision = false;
                        
                        if (sameCategory) {
                            const verticalDistInitial = Math.abs(labelY - prev.y);
                            if (verticalDistInitial < (labelLineHeight + minVerticalSpacing)) {
                                collision = true;
                            }
                        } else {
                            if (horizontalOverlap) {
                                const verticalDistInitial = Math.abs(labelY - prev.y);
                                if (verticalDistInitial < (labelLineHeight + minVerticalSpacing)) {
                                    collision = true;
                                }
                            }
                        }
                        
                        if (collision) {
                            const neededY = prev.y - (labelLineHeight + minVerticalSpacing);
                            if (neededY < requiredY) {
                                requiredY = neededY;
                            }
                        }
                    }
                    
                    labelY = requiredY;
                    
                    const minY = label.barTop - labelOffset - maxLabelDistance;
                    if (labelY < minY) {
                        labelY = minY;
                    }
                    
                    labelPositions.push({
                        x: label.barX,
                        y: labelY,
                        value: label.value,
                        categoryIndex: label.categoryIndex,
                        textWidth: textWidth,
                        labelColor: label.labelColor
                    });
                });
                
                // Draw all labels at their calculated positions
                labelPositions.forEach((pos) => {
                    ctx.fillStyle = pos.labelColor;
                    ctx.fillText(pos.value, pos.x, pos.y);
                });
                
                ctx.restore();
            }
        };

        // Custom line labels plugin for repairs & maintenance labor technical chart (uses K format)
        const repairsMaintenanceLaborTechnicalLineDataLabelsPlugin = {
            id: 'repairsMaintenanceLaborTechnicalLineDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'line') {
                        return;
                    }

                    // Only show label for one point to avoid clutter
                    const point = meta.data[0];
                    if (!point) {
                        return;
                    }
                    const data = dataset.data[0];
                    if (data === null || data === undefined) {
                        return;
                    }

                    const label = formatThousandsLabel(data);
                    if (!label) {
                        return;
                    }
                    const color = resolveDataLabelColor(dataset.dataLabelColor || dataset.borderColor, 0);
                    const offset = dataset.dataLabelOffset || 12;
                    ctx.fillStyle = color;
                    ctx.fillText(label, point.x, point.y - offset);
                });

                ctx.restore();
            }
        };

        const repairsMaintenanceLaborTechnicalChartConfig = {
            type: 'bar',
            data: repairsMaintenanceLaborTechnicalChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#525552',
                    bodyColor: '#525552',
                    borderColor: '#f0f0f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                            return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
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
                                return formatThousandsLabel(value) || '₱0K';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Repairs & Maintenance (Labor) (Thousands ₱)',
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
            plugins: [
                repairsMaintenanceLaborTechnicalDataLabelsPlugin,
                repairsMaintenanceLaborTechnicalLineDataLabelsPlugin
            ]
        };

        // Initialize the repairs & maintenance labor technical chart
        const repairsMaintenanceLaborTechnicalChart = new Chart(
            document.getElementById('repairsMaintenanceLaborTechnicalChart'),
            repairsMaintenanceLaborTechnicalChartConfig
        );

        // ============================================
        // SECTION 20: REPAIRS & MAINTENANCE (MATERIALS) CHARTS - TECHNICAL TEAM
        // ============================================

        // Monthly data for Repairs & Maintenance (Materials) - Technical Team - values in thousands
        const monthlyRepairsMaintenanceMaterialsTechnicalData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [187.8, 187.8, 187.8, 187.8, 187.8, 187.8, 187.8, 187.8, 187.8, 187.8, 187.8, 187.8],
            year2025: [95.3, 117.6, 92.1, 116.9, 275.0, 310.2, 291.7, 314.6, 453.0, 192.0, 126.5, 177.7]
        };

        // Repairs & Maintenance (Materials) - Technical Team Comparison Bar Chart
        const repairsMaintenanceMaterialsTechnicalChartData = {
            labels: monthlyRepairsMaintenanceMaterialsTechnicalData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyRepairsMaintenanceMaterialsTechnicalData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Current Year Target',
                    type: 'line',
                    order: 2,
                    data: monthlyRepairsMaintenanceMaterialsTechnicalData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        // Custom plugin for repairs & maintenance materials technical chart data labels (handles K format)
        const repairsMaintenanceMaterialsTechnicalDataLabelsPlugin = {
            id: 'repairsMaintenanceMaterialsTechnicalDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                
                const labelLineHeight = 14;
                const minVerticalSpacing = 4;
                const labelOffset = 5;
                const maxLabelDistance = 25;
                
                // Collect all bar labels with their positions
                const allLabels = [];
                
                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'bar') {
                        return;
                    }
                    meta.data.forEach((bar, index) => {
                        const data = dataset.data[index];
                        if (data !== null && data !== undefined && typeof bar.height === 'number' && bar.height > 0) {
                            const value = formatThousandsLabel(data);
                            if (!value) {
                                return;
                            }
                            allLabels.push({
                                value: value,
                                barY: bar.y,
                                barHeight: bar.height,
                                barX: bar.x,
                                barTop: bar.y,
                                categoryIndex: index,
                                datasetIndex: datasetIndex,
                                labelColor: resolveDataLabelColor(dataset.dataLabelColor || dataset.backgroundColor, index)
                            });
                        }
                    });
                });
                
                // Sort all labels by category, then by bar height (tallest first within category)
                allLabels.sort((a, b) => {
                    if (a.categoryIndex !== b.categoryIndex) {
                        return a.categoryIndex - b.categoryIndex;
                    }
                    return a.barY - b.barY;
                });
                
                // Calculate final label positions with collision detection
                const labelPositions = [];
                
                allLabels.forEach((label) => {
                    let labelY = label.barTop - labelOffset;
                    const textWidth = ctx.measureText(label.value).width;
                    let requiredY = labelY;
                    
                    for (let i = 0; i < labelPositions.length; i++) {
                        const prev = labelPositions[i];
                        const sameCategory = label.categoryIndex === prev.categoryIndex;
                        
                        const labelLeft = label.barX - textWidth / 2;
                        const labelRight = label.barX + textWidth / 2;
                        const prevLeft = prev.x - prev.textWidth / 2;
                        const prevRight = prev.x + prev.textWidth / 2;
                        const horizontalOverlap = !(labelRight < prevLeft || labelLeft > prevRight);
                        
                        let collision = false;
                        
                        if (sameCategory) {
                            const verticalDistInitial = Math.abs(labelY - prev.y);
                            if (verticalDistInitial < (labelLineHeight + minVerticalSpacing)) {
                                collision = true;
                            }
                        } else {
                            if (horizontalOverlap) {
                                const verticalDistInitial = Math.abs(labelY - prev.y);
                                if (verticalDistInitial < (labelLineHeight + minVerticalSpacing)) {
                                    collision = true;
                                }
                            }
                        }
                        
                        if (collision) {
                            const neededY = prev.y - (labelLineHeight + minVerticalSpacing);
                            if (neededY < requiredY) {
                                requiredY = neededY;
                            }
                        }
                    }
                    
                    labelY = requiredY;
                    
                    const minY = label.barTop - labelOffset - maxLabelDistance;
                    if (labelY < minY) {
                        labelY = minY;
                    }
                    
                    labelPositions.push({
                        x: label.barX,
                        y: labelY,
                        value: label.value,
                        categoryIndex: label.categoryIndex,
                        textWidth: textWidth,
                        labelColor: label.labelColor
                    });
                });
                
                // Draw all labels at their calculated positions
                labelPositions.forEach((pos) => {
                    ctx.fillStyle = pos.labelColor;
                    ctx.fillText(pos.value, pos.x, pos.y);
                });
                
                ctx.restore();
            }
        };

        // Custom line labels plugin for repairs & maintenance materials technical chart (uses K format)
        const repairsMaintenanceMaterialsTechnicalLineDataLabelsPlugin = {
            id: 'repairsMaintenanceMaterialsTechnicalLineDataLabels',
            afterDatasetsDraw: function(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.type !== 'line') {
                        return;
                    }

                    // Only show label for one point to avoid clutter
                    const point = meta.data[0];
                    if (!point) {
                        return;
                    }
                    const data = dataset.data[0];
                    if (data === null || data === undefined) {
                        return;
                    }

                    const label = formatThousandsLabel(data);
                    if (!label) {
                        return;
                    }
                    const color = resolveDataLabelColor(dataset.dataLabelColor || dataset.borderColor, 0);
                    const offset = dataset.dataLabelOffset || 12;
                    ctx.fillStyle = color;
                    ctx.fillText(label, point.x, point.y - offset);
                });

                ctx.restore();
            }
        };

        const repairsMaintenanceMaterialsTechnicalChartConfig = {
            type: 'bar',
            data: repairsMaintenanceMaterialsTechnicalChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#525552',
                    bodyColor: '#525552',
                    borderColor: '#f0f0f0',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                            return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
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
                                return formatThousandsLabel(value) || '₱0K';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Repairs & Maintenance (Materials) (Thousands ₱)',
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
            plugins: [
                repairsMaintenanceMaterialsTechnicalDataLabelsPlugin,
                repairsMaintenanceMaterialsTechnicalLineDataLabelsPlugin
            ]
        };

        // Initialize the repairs & maintenance materials technical chart
        const repairsMaintenanceMaterialsTechnicalChart = new Chart(
            document.getElementById('repairsMaintenanceMaterialsTechnicalChart'),
            repairsMaintenanceMaterialsTechnicalChartConfig
        );

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

        // ============================================
        // SECTION: OCCUPANCY RATE (UNIT) CHARTS - COMPANY LAG
        // ============================================

        // Monthly data for Occupancy Rate (Unit) - Company Lag - values in units
        const monthlyOccupancyRateLagData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [1047, 1048, 1058, 1077, 982, 962, 984, 948, 926, 879, 881, 881],
            year2024: [894, 868, 850, 818, 802, 802, 807, 803, 785, 790, 792, 791],
            year2025: [778, 766, 758, 763, 757, 763, 772, 765, 760, 755, 756, null]
        };

        // Occupancy Rate (Unit) - Company Lag Comparison Bar Chart
        const occupancyRateLagChartData = {
            labels: monthlyOccupancyRateLagData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyOccupancyRateLagData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: monthlyOccupancyRateLagData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Target (Max Units)',
                    type: 'line',
                    order: 3,
                    data: monthlyOccupancyRateLagData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const occupancyRateLagChartConfig = {
            type: 'bar',
            data: occupancyRateLagChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: false
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
                            text: 'Occupancy Rate (Units)',
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
            plugins: [
                venueDataLabelsPlugin,
                venueLineDataLabelsPlugin
            ]
        };

        // Initialize the occupancy rate lag chart (if element exists)
        let occupancyRateLagChart = null;
        const occupancyRateLagChartElement = document.getElementById('occupancyRateLagChart');
        if (occupancyRateLagChartElement) {
            occupancyRateLagChart = new Chart(
                occupancyRateLagChartElement,
                occupancyRateLagChartConfig
            );
        }

        // ============================================
        // SECTION: OCCUPANCY RATE (UNIT) CHARTS - COMPANY LEAD
        // ============================================

        // Monthly data for Occupancy Rate (Unit) - Company Lead - values in units
        // Note: This is example data - replace with actual Company Lead data
        const monthlyOccupancyRateLeadData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [1047, 1048, 1058, 1077, 982, 962, 984, 948, 926, 879, 881, 881],
            year2024: [894, 868, 850, 818, 802, 802, 807, 803, 785, 790, 792, 791],
            year2025: [900, 920, 950, 980, 970, 975, 990, 985, 980, 975, 970, null] // Example Company Lead data
        };

        // Occupancy Rate (Unit) - Company Lead Comparison Bar Chart
        const occupancyRateLeadChartData = {
            labels: monthlyOccupancyRateLeadData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyOccupancyRateLeadData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: monthlyOccupancyRateLeadData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Target (Max Units)',
                    type: 'line',
                    order: 3,
                    data: monthlyOccupancyRateLeadData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const occupancyRateLeadChartConfig = {
            type: 'bar',
            data: occupancyRateLeadChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: false
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
                            text: 'Occupancy Rate (Units)',
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
            plugins: [
                venueDataLabelsPlugin,
                venueLineDataLabelsPlugin
            ]
        };

        // Initialize the occupancy rate lead chart (if element exists)
        let occupancyRateLeadChart = null;
        const occupancyRateLeadChartElement = document.getElementById('occupancyRateLeadChart');
        if (occupancyRateLeadChartElement) {
            occupancyRateLeadChart = new Chart(
                occupancyRateLeadChartElement,
                occupancyRateLeadChartConfig
            );
        }

        // ============================================
        // SECTION: OCCUPANCY RATE (AREA) CHARTS - COMPANY LEAD
        // ============================================

        // Monthly data for Occupancy Rate (Area) - Company Lead - values in thousands
        const monthlyOccupancyRateAreaLeadData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [117.7, 104.2, 104.3, 104.3, 103.6, 103.4, 108.4, 108.3, null, null, null, null],
            year2024: [74.7, 74.7, 74.7, 74.7, 74.6, 74.6, 74.8, 81.2, 81.7, 82.9, 79.5, 81.4],
            year2025: [112.3, 98.5, 97.9, 97.7, 97.7, 97.3, 101.3, 100.5, null, null, null, null]
        };

        // Occupancy Rate (Area) - Company Lead Comparison Bar Chart
        const occupancyRateAreaLeadChartData = {
            labels: monthlyOccupancyRateAreaLeadData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyOccupancyRateAreaLeadData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: monthlyOccupancyRateAreaLeadData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Target (Max Area)',
                    type: 'line',
                    order: 3,
                    data: monthlyOccupancyRateAreaLeadData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const occupancyRateAreaLeadChartConfig = {
            type: 'bar',
            data: occupancyRateAreaLeadChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                if (context.dataset.type === 'line') {
                                    return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
                                }
                                return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
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
                            text: 'Occupancy Rate (Area) (Thousands)',
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
            plugins: [
                venueDataLabelsPlugin,
                venueLineDataLabelsPlugin
            ]
        };

        // Initialize the occupancy rate area lead chart (if element exists)
        let occupancyRateAreaLeadChart = null;
        const occupancyRateAreaLeadChartElement = document.getElementById('occupancyRateAreaLeadChart');
        if (occupancyRateAreaLeadChartElement) {
            occupancyRateAreaLeadChart = new Chart(
                occupancyRateAreaLeadChartElement,
                occupancyRateAreaLeadChartConfig
            );
        }

        // ============================================
        // SECTION: OCCUPANCY RATE (P-VALUE) CHARTS - COMPANY LEAD
        // ============================================

        // Monthly data for Occupancy Rate (P-Value) - Company Lead - values in millions
        const monthlyOccupancyRatePValueLeadData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [22.5, 22.7, 22.7, 22.7, 22.4, 22.4, 23.0, 22.9, null, null, null, null],
            year2024: [19.0, 18.8, 18.7, 18.8, 18.6, 18.5, 18.6, 19.5, 19.8, 20.2, 20.5, 20.7],
            year2025: [20.8, 20.7, 20.6, 20.4, 20.4, 20.3, 20.5, 20.4, null, null, null, null]
        };

        // Occupancy Rate (P-Value) - Company Lead Comparison Bar Chart
        const occupancyRatePValueLeadChartData = {
            labels: monthlyOccupancyRatePValueLeadData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: monthlyOccupancyRatePValueLeadData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: monthlyOccupancyRatePValueLeadData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Target (Max P-Value)',
                    type: 'line',
                    order: 3,
                    data: monthlyOccupancyRatePValueLeadData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const occupancyRatePValueLeadChartConfig = {
            type: 'bar',
            data: occupancyRatePValueLeadChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatMillionsLabel(value)}`;
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
                            text: 'Occupancy Rate (P-Value) (Millions ₱)',
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
            plugins: [
                createBarDataLabelsPlugin('occupancyRatePValueBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        // Initialize the occupancy rate p-value lead chart (if element exists)
        let occupancyRatePValueLeadChart = null;
        const occupancyRatePValueLeadChartElement = document.getElementById('occupancyRatePValueLeadChart');
        if (occupancyRatePValueLeadChartElement) {
            occupancyRatePValueLeadChart = new Chart(
                occupancyRatePValueLeadChartElement,
                occupancyRatePValueLeadChartConfig
            );
        }

        // ============================================
        // SECTION: FOOT TRAFFIC PER SITE - LOTUS MALL (COMPANY LEAD)
        // ============================================

        const lotusFootTrafficData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [13.8, 13.9, 14.0, 13.9, 13.7, 13.8, 13.9, 14.1, 13.9, 13.8, 13.8, 13.9],
            year2024: [14.2, 14.1, 14.0, 13.8, 13.9, 13.7, 13.8, 14.0, 13.9, 13.8, 13.9, 14.0],
            year2025: [12.9, 12.6, 12.2, 11.9, 11.7, 11.4, 11.6, 11.5, 11.7, 11.6, 11.5, 11.3]
        };

        const lotusFootTrafficChartData = {
            labels: lotusFootTrafficData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: lotusFootTrafficData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: lotusFootTrafficData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Target',
                    type: 'line',
                    order: 3,
                    data: lotusFootTrafficData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const lotusFootTrafficChartConfig = {
            type: 'bar',
            data: lotusFootTrafficChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 10,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return formatThousandsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Foot Traffic (Thousands Visitors)',
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
            plugins: [
                createBarDataLabelsPlugin('lotusFootTrafficBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let lotusFootTrafficChart = null;
        const lotusFootTrafficChartElement = document.getElementById('lotusFootTrafficChart');
        if (lotusFootTrafficChartElement) {
            lotusFootTrafficChart = new Chart(
                lotusFootTrafficChartElement,
                lotusFootTrafficChartConfig
            );
        }

        // Portal Mall Foot Traffic
        const portalFootTrafficData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [4.9, 5.0, 4.8, 5.1, 4.8, 4.9, 5.0, 5.1, 5.0, 5.0, 4.9, 5.0],
            year2024: [5.2, 5.1, 5.0, 5.0, 4.9, 5.0, 5.1, 5.2, 5.1, 5.0, 5.1, 5.0],
            year2025: [6.8, 7.1, 7.5, 7.9, 8.2, 8.5, 8.9, 9.2, 9.0, 9.1, 9.3, 9.4]
        };

        const portalFootTrafficChartData = {
            labels: portalFootTrafficData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: portalFootTrafficData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: portalFootTrafficData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Target',
                    type: 'line',
                    order: 3,
                    data: portalFootTrafficData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const portalFootTrafficChartConfig = {
            type: 'bar',
            data: portalFootTrafficChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 4,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return formatThousandsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Foot Traffic (Thousands Visitors)',
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
            plugins: [
                createBarDataLabelsPlugin('portalFootTrafficBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let portalFootTrafficChart = null;
        const portalFootTrafficChartElement = document.getElementById('portalFootTrafficChart');
        if (portalFootTrafficChartElement) {
            portalFootTrafficChart = new Chart(
                portalFootTrafficChartElement,
                portalFootTrafficChartConfig
            );
        }

        // Stadium Shopping Strip Foot Traffic
        const stadiumFootTrafficData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [7.1, 7.0, 7.2, 7.1, 7.0, 7.1, 7.2, 7.0, 7.1, 7.0, 7.1, 7.1],
            year2024: [7.2, 7.1, 7.0, 6.9, 7.0, 7.1, 7.0, 7.1, 7.0, 7.1, 7.0, 7.0],
            year2025: [6.9, 6.6, 6.3, 6.1, 5.9, 5.7, 5.6, 5.5, 5.4, 5.5, 5.6, 5.5]
        };

        const stadiumFootTrafficChartData = {
            labels: stadiumFootTrafficData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: stadiumFootTrafficData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: stadiumFootTrafficData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Target',
                    type: 'line',
                    order: 3,
                    data: stadiumFootTrafficData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const stadiumFootTrafficChartConfig = {
            type: 'bar',
            data: stadiumFootTrafficChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 4.5,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return formatThousandsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Foot Traffic (Thousands Visitors)',
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
            plugins: [
                createBarDataLabelsPlugin('stadiumFootTrafficBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let stadiumFootTrafficChart = null;
        const stadiumFootTrafficChartElement = document.getElementById('stadiumFootTrafficChart');
        if (stadiumFootTrafficChartElement) {
            stadiumFootTrafficChart = new Chart(
                stadiumFootTrafficChartElement,
                stadiumFootTrafficChartConfig
            );
        }

        // ySpacio Creative Park Carbag Foot Traffic
        const yspacioFootTrafficData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [0.58, 0.59, 0.57, 0.56, 0.58, 0.57, 0.58, 0.59, 0.58, 0.57, 0.58, 0.58],
            year2024: [0.51, 0.54, 0.53, 0.52, 0.55, 0.57, 0.59, 0.60, 0.58, 0.57, 0.58, 0.59],
            year2025: [0.32, 0.28, 0.18, 0.12, 0.06, 0.04, 0.02, 0.01, 0.00, 0.00, 0.00, 0.00]
        };

        const yspacioFootTrafficChartData = {
            labels: yspacioFootTrafficData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: yspacioFootTrafficData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: yspacioFootTrafficData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Target',
                    type: 'line',
                    order: 3,
                    data: yspacioFootTrafficData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const yspacioFootTrafficChartConfig = {
            type: 'bar',
            data: yspacioFootTrafficChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 0.7,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return formatThousandsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Foot Traffic (Thousands Visitors)',
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
            plugins: [
                createBarDataLabelsPlugin('yspacioFootTrafficBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let yspacioFootTrafficChart = null;
        const yspacioFootTrafficChartElement = document.getElementById('yspacioFootTrafficChart');
        if (yspacioFootTrafficChartElement) {
            yspacioFootTrafficChart = new Chart(
                yspacioFootTrafficChartElement,
                yspacioFootTrafficChartConfig
            );
        }

        // ySpacio Creative Park Alapan Foot Traffic
        const yspacioAlapanFootTrafficData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [4.4, 4.4, 4.4, 4.4, 4.4, 4.4, 4.4, 4.4, 4.4, 4.4, 4.4, 4.4],
            year2024: [4.2, 4.3, 4.4, 4.5, 4.2, 4.3, 4.5, 4.4, 4.5, 4.4, 4.3, 4.4],
            year2025: [3.9, 3.7, 3.5, 3.4, 3.3, 3.2, 3.1, 3.0, 2.9, 2.8, 2.8, 2.7]
        };

        const yspacioAlapanFootTrafficChartData = {
            labels: yspacioAlapanFootTrafficData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: yspacioAlapanFootTrafficData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: yspacioAlapanFootTrafficData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Target',
                    type: 'line',
                    order: 3,
                    data: yspacioAlapanFootTrafficData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const yspacioAlapanFootTrafficChartConfig = {
            type: 'bar',
            data: yspacioAlapanFootTrafficChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 2.0,
                        max: 5.0,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return formatThousandsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Foot Traffic (Thousands Visitors)',
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
            plugins: [
                createBarDataLabelsPlugin('yspacioAlapanFootTrafficBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let yspacioAlapanFootTrafficChart = null;
        const yspacioAlapanFootTrafficChartElement = document.getElementById('yspacioAlapanFootTrafficChart');
        if (yspacioAlapanFootTrafficChartElement) {
            yspacioAlapanFootTrafficChart = new Chart(
                yspacioAlapanFootTrafficChartElement,
                yspacioAlapanFootTrafficChartConfig
            );
        }

        // Lumina Foot Traffic
        const luminaFootTrafficData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [11.3, 11.4, 11.2, 11.3, 11.4, 11.3, 11.3, 11.2, 11.3, 11.4, 11.3, 11.3],
            year2024: [11.1, 11.2, 11.3, 11.4, 11.1, 11.2, 11.3, 11.2, 11.3, 11.4, 11.3, 11.2],
            year2025: [12.5, 12.8, 13.0, 13.5, 13.8, 14.1, 14.3, 14.6, 14.7, 14.8, 14.7, 14.6]
        };

        const luminaFootTrafficChartData = {
            labels: luminaFootTrafficData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: luminaFootTrafficData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: luminaFootTrafficData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Target',
                    type: 'line',
                    order: 3,
                    data: luminaFootTrafficData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const luminaFootTrafficChartConfig = {
            type: 'bar',
            data: luminaFootTrafficChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 10,
                        max: 16,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return formatThousandsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Foot Traffic (Thousands Visitors)',
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
            plugins: [
                createBarDataLabelsPlugin('luminaFootTrafficBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let luminaFootTrafficChart = null;
        const luminaFootTrafficChartElement = document.getElementById('luminaFootTrafficChart');
        if (luminaFootTrafficChartElement) {
            luminaFootTrafficChart = new Chart(
                luminaFootTrafficChartElement,
                luminaFootTrafficChartConfig
            );
        }

        // ============================================
        // SECTION: LOTUS MALL PAX PER EVENT (COMPANY LEAD)
        // ============================================

        const lotusPaxData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
            year2024: [0.48, 0.5, 0.52, 0.51, 0.49, 0.5, 0.52, 0.53, 0.54, 0.53, 0.52, 0.51],
            year2025: [1.1, 1.2, 1.0, 1.1, 1.05, 1.08, 1.12, 1.15, 1.18, 1.16, 1.12, 1.09]
        };

        const lotusPaxChartData = {
            labels: lotusPaxData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: lotusPaxData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: lotusPaxData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Target',
                    type: 'line',
                    order: 3,
                    data: lotusPaxData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const lotusPaxChartConfig = {
            type: 'bar',
            data: lotusPaxChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 1.4,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return formatThousandsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'PAX (Thousands)',
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
            plugins: [
                createBarDataLabelsPlugin('lotusPaxBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let lotusPaxChart = null;
        const lotusPaxChartElement = document.getElementById('lotusPaxChart');
        if (lotusPaxChartElement) {
            lotusPaxChart = new Chart(
                lotusPaxChartElement,
                lotusPaxChartConfig
            );
        }

        // ============================================
        // SECTION: PORTAL MALL PAX PER EVENT (COMPANY LEAD)
        // ============================================

        const portalPaxData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
            year2024: [0.42, 0.44, 0.47, 0.45, 0.46, 0.48, 0.5, 0.49, 0.48, 0.5, 0.52, 0.51],
            year2025: [0.95, 1.0, 1.05, 1.08, 1.12, 1.15, 1.18, 1.22, 1.25, 1.28, 1.24, 1.2]
        };

        const portalPaxChartData = {
            labels: portalPaxData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: portalPaxData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: portalPaxData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Target',
                    type: 'line',
                    order: 3,
                    data: portalPaxData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const portalPaxChartConfig = {
            type: 'bar',
            data: portalPaxChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 1.4,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return formatThousandsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'PAX (Thousands)',
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
            plugins: [
                createBarDataLabelsPlugin('portalPaxBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let portalPaxChart = null;
        const portalPaxChartElement = document.getElementById('portalPaxChart');
        if (portalPaxChartElement) {
            portalPaxChart = new Chart(
                portalPaxChartElement,
                portalPaxChartConfig
            );
        }

        // ============================================
        // SECTION: STADIUM SHOPPING STRIP PAX PER EVENT (COMPANY LEAD)
        // ============================================

        const stadiumPaxData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            target: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
            year2024: [0.44, 0.46, 0.47, 0.48, 0.5, 0.52, 0.53, 0.54, 0.55, 0.56, 0.57, 0.58],
            year2025: [1.02, 1.05, 1.08, 1.1, 1.12, 1.15, 1.18, 1.2, 1.23, 1.25, 1.2, 1.18]
        };

        const stadiumPaxChartData = {
            labels: stadiumPaxData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: stadiumPaxData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: stadiumPaxData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Target',
                    type: 'line',
                    order: 3,
                    data: stadiumPaxData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const stadiumPaxChartConfig = {
            type: 'bar',
            data: stadiumPaxChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatThousandsLabel(value)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 1.4,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return formatThousandsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'PAX (Thousands)',
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
            plugins: [
                createBarDataLabelsPlugin('stadiumPaxBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let stadiumPaxChart = null;
        const stadiumPaxChartElement = document.getElementById('stadiumPaxChart');
        if (stadiumPaxChartElement) {
            stadiumPaxChart = new Chart(
                stadiumPaxChartElement,
                stadiumPaxChartConfig
            );
        }

        // ============================================
        // SECTION: OPPORTUNITY TEAM BLANK P-VALUE CHARTS (COMPANY LEAD)
        // ============================================

        // SECTION: OPPORTUNITY TEAM BLANK P-VALUE CHARTS (COMPANY LEAD)

        // ============================================
        // SECTION: OPPORTUNITY TEAM BLANK P-VALUE CHARTS (COMPANY LEAD)
        // ============================================

        const opportunityBlankLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const createOpportunityPValueChartConfig = (chartData, barPluginId, yAxisTitle) => ({
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatMillionsLabel(value || 0)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 20,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: (value) => formatMillionsLabel(value)
                        },
                        title: {
                            display: true,
                            text: yAxisTitle,
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
            plugins: [
                createBarDataLabelsPlugin(barPluginId),
                lineDataLabelsPlugin
            ]
        });

        const closedInquiriesLeadChartData = {
            labels: opportunityBlankLabels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: [12.4, 12.9, 13.3, 13.6, 13.1, 13.8, 14.1, 13.9, 13.5, 13.2, 13.0, 12.8],
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: [10.8, 11.0, 11.3, 11.5, 11.2, 11.4, 11.8, 12.0, 11.7, 11.5, 11.2, 11.0],
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Target (Max P-Value)',
                    type: 'line',
                    order: 3,
                    data: new Array(opportunityBlankLabels.length).fill(15),
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const offlineInquiriesLeadChartData = {
            labels: opportunityBlankLabels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: [72, 74, 73, 71, 69, 68, 66, 64, 62, 60, 55, 50],
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: [58, 59, 60, 61, 60, 59, 58, 57, 56, 55, 54, 53],
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Target (%)',
                    type: 'line',
                    order: 3,
                    data: new Array(opportunityBlankLabels.length).fill(60),
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12,
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                }
            ]
        };

        const pulloutAversionLeadChartData = {
            labels: opportunityBlankLabels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: [5.2, 5.4, 5.6, 5.8, 5.5, 5.7, 5.9, 6.0, 5.8, 5.6, 5.4, 5.2],
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840'
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: [4.1, 4.2, 4.3, 4.4, 4.3, 4.4, 4.5, 4.6, 4.5, 4.4, 4.3, 4.1],
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Target (Max P-Value)',
                    type: 'line',
                    order: 3,
                    data: new Array(opportunityBlankLabels.length).fill(7),
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12
                }
            ]
        };

        const closedInquiriesLeadChartConfig = createOpportunityPValueChartConfig(
            closedInquiriesLeadChartData,
            'closedInquiriesLeadBarDataLabels',
            'Closed Inquiries (Millions ₱)'
        );

        const offlineInquiriesLeadChartConfig = createOpportunityPValueChartConfig(
            offlineInquiriesLeadChartData,
            'offlineInquiriesLeadBarDataLabels',
            'Offline Inquiries (%)'
        );
        offlineInquiriesLeadChartConfig.options.scales.y.max = 110;
        offlineInquiriesLeadChartConfig.options.scales.y.ticks.callback = (value) => `${value}%`;
        offlineInquiriesLeadChartConfig.options.plugins.tooltip.callbacks.label = function(context) {
            const parsedValue = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
            return `${context.dataset.label}: ${formatPercentage(Number(parsedValue))}`;
        };

        // ============================================
        // SECTION: FB PAGE FOLLOWERS (COMPANY LEAD)
        // ============================================

        const fbFollowersData = {
            labels: opportunityBlankLabels,
            target: new Array(opportunityBlankLabels.length).fill(60),
            year2024: [34, 35, 36, 38, 39, 40, 41, 42, 43, 44, 45, 46],
            year2025: [38, 39, 41, 42, 44, 45, 47, 48, 49, 50, 48, 46]
        };

        const fbFollowersChartData = {
            labels: fbFollowersData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: fbFollowersData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: fbFollowersData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Target (%)',
                    type: 'line',
                    order: 3,
                    data: fbFollowersData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12,
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                }
            ]
        };

        const fbFollowersChartConfig = {
            type: 'bar',
            data: fbFollowersChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatPercentage(Number(value) || 0)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 70,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return `${value}%`;
                            }
                        },
                        title: {
                            display: true,
                            text: 'Followers Growth (%)',
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
            plugins: [
                createBarDataLabelsPlugin('fbFollowersBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let fbFollowersChart = null;
        const fbFollowersChartElement = document.getElementById('fbFollowersChart');
        if (fbFollowersChartElement) {
            fbFollowersChart = new Chart(
                fbFollowersChartElement,
                fbFollowersChartConfig
            );
        }

        // ============================================
        // SECTION: I.C.A.R.E. (ALL TEAMS) - AUDIT (COMPANY LEAD)
        // ============================================

        const icareData = {
            labels: opportunityBlankLabels,
            target: new Array(opportunityBlankLabels.length).fill(10),
            year2024: [8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17],
            year2025: [18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40]
        };

        const icareChartData = {
            labels: icareData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: icareData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: icareData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Target (%)',
                    type: 'line',
                    order: 3,
                    data: icareData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12,
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                }
            ]
        };

        const icareChartConfig = {
            type: 'bar',
            data: icareChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatPercentage(Number(value) || 0)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 50,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return `${value}%`;
                            }
                        },
                        title: {
                            display: true,
                            text: 'Compliance Rate (%)',
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
            plugins: [
                createBarDataLabelsPlugin('icareBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let icareChart = null;
        const icareChartElement = document.getElementById('icareChart');
        if (icareChartElement) {
            icareChart = new Chart(
                icareChartElement,
                icareChartConfig
            );
        }

        // ============================================
        // SECTION: SITE QUALITY MONITORING (GATHERING) - COMPANY LEAD
        // ============================================

        const siteQualityData = {
            labels: opportunityBlankLabels,
            target: new Array(opportunityBlankLabels.length).fill(20),
            year2024: [22, 24, 23, 25, 26, 27, 28, 29, 30, 32, 31, 30],
            year2025: [28, 30, 32, 34, 36, 38, 39, 41, 43, 45, 47, 50]
        };

        const siteQualityChartData = {
            labels: siteQualityData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: siteQualityData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: siteQualityData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Target (%)',
                    type: 'line',
                    order: 3,
                    data: siteQualityData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12,
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                }
            ]
        };

        const siteQualityChartConfig = {
            type: 'bar',
            data: siteQualityChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatPercentage(Number(value) || 0)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 60,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return `${value}%`;
                            }
                        },
                        title: {
                            display: true,
                            text: 'Quality Compliance (%)',
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
            plugins: [
                createBarDataLabelsPlugin('siteQualityBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let siteQualityChart = null;
        const siteQualityChartElement = document.getElementById('siteQualityChart');
        if (siteQualityChartElement) {
            siteQualityChart = new Chart(
                siteQualityChartElement,
                siteQualityChartConfig
            );
        }

        // ============================================
        // SECTION: INSURANCE CLAIM MONITORING (GATHERING) - COMPANY LEAD
        // ============================================

        const insuranceClaimData = {
            labels: opportunityBlankLabels,
            target: new Array(opportunityBlankLabels.length).fill(30),
            year2024: [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
            year2025: [45, 46, 48, 50, 52, 54, 56, 58, 60, 62, 65, 70]
        };

        const insuranceClaimChartData = {
            labels: insuranceClaimData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: insuranceClaimData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: insuranceClaimData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Target (%)',
                    type: 'line',
                    order: 3,
                    data: insuranceClaimData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12,
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                }
            ]
        };

        const insuranceClaimChartConfig = {
            type: 'bar',
            data: insuranceClaimChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatPercentage(Number(value) || 0)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 80,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return `${value}%`;
                            }
                        },
                        title: {
                            display: true,
                            text: 'Claim Resolution (%)',
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
            plugins: [
                createBarDataLabelsPlugin('insuranceClaimBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let insuranceClaimChart = null;
        const insuranceClaimChartElement = document.getElementById('insuranceClaimChart');
        if (insuranceClaimChartElement) {
            insuranceClaimChart = new Chart(
                insuranceClaimChartElement,
                insuranceClaimChartConfig
            );
        }

        // ============================================
        // SECTION: REGULAR EVENTS PLAN (LRAD) - COMPANY LEAD
        // ============================================

        const regularEventsData = {
            labels: opportunityBlankLabels,
            target: new Array(opportunityBlankLabels.length).fill(40),
            year2024: [38, 39, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
            year2025: [52, 54, 55, 57, 58, 60, 62, 63, 64, 65, 63, 61]
        };

        const regularEventsChartData = {
            labels: regularEventsData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: regularEventsData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: regularEventsData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Target (%)',
                    type: 'line',
                    order: 3,
                    data: regularEventsData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12,
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                }
            ]
        };

        const regularEventsChartConfig = {
            type: 'bar',
            data: regularEventsChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatPercentage(Number(value) || 0)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 70,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return `${value}%`;
                            }
                        },
                        title: {
                            display: true,
                            text: 'Plan Coverage (%)',
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
            plugins: [
                createBarDataLabelsPlugin('regularEventsBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let regularEventsChart = null;
        const regularEventsChartElement = document.getElementById('regularEventsChart');
        if (regularEventsChartElement) {
            regularEventsChart = new Chart(
                regularEventsChartElement,
                regularEventsChartConfig
            );
        }

        // ============================================
        // SECTION: CULTURE DEVELOPMENT ACTIVITIES PLAN (LRAD) - COMPANY LEAD
        // ============================================

        const cultureDevData = {
            labels: opportunityBlankLabels,
            target: new Array(opportunityBlankLabels.length).fill(10),
            year2024: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18],
            year2025: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
        };

        const cultureDevChartData = {
            labels: cultureDevData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: cultureDevData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: cultureDevData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Target (%)',
                    type: 'line',
                    order: 3,
                    data: cultureDevData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12,
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                }
            ]
        };

        const cultureDevChartConfig = {
            type: 'bar',
            data: cultureDevChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatPercentage(Number(value) || 0)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 30,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return `${value}%`;
                            }
                        },
                        title: {
                            display: true,
                            text: 'Activity Completion (%)',
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
            plugins: [
                createBarDataLabelsPlugin('cultureDevBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let cultureDevChart = null;
        const cultureDevChartElement = document.getElementById('cultureDevChart');
        if (cultureDevChartElement) {
            cultureDevChart = new Chart(
                cultureDevChartElement,
                cultureDevChartConfig
            );
        }

        // ============================================
        // SECTION: SMD PROJECTS (LRAD) - COMPANY LEAD
        // ============================================

        const smdProjectsData = {
            labels: opportunityBlankLabels,
            target: new Array(opportunityBlankLabels.length).fill(70),
            year2024: [62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73],
            year2025: [48, 50, 52, 54, 55, 57, 58, 59, 60, 61, 58, 55]
        };

        const smdProjectsChartData = {
            labels: smdProjectsData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: smdProjectsData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: smdProjectsData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Target (%)',
                    type: 'line',
                    order: 3,
                    data: smdProjectsData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12,
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                }
            ]
        };

        const smdProjectsChartConfig = {
            type: 'bar',
            data: smdProjectsChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatPercentage(Number(value) || 0)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 80,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return `${value}%`;
                            }
                        },
                        title: {
                            display: true,
                            text: 'Project Delivery (%)',
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
            plugins: [
                createBarDataLabelsPlugin('smdProjectsBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let smdProjectsChart = null;
        const smdProjectsChartElement = document.getElementById('smdProjectsChart');
        if (smdProjectsChartElement) {
            smdProjectsChart = new Chart(
                smdProjectsChartElement,
                smdProjectsChartConfig
            );
        }

        // ============================================
        // SECTION: BUDGET PROJECTS (DESIGN & CONSTRUCTION) - COMPANY LEAD
        // ============================================

        const budgetProjectsData = {
            labels: opportunityBlankLabels,
            target: new Array(opportunityBlankLabels.length).fill(50),
            year2024: [18, 17, 16, 15, 14, 13, 12, 11, 12, 13, 14, 15],
            year2025: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        };

        const budgetProjectsChartData = {
            labels: budgetProjectsData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: budgetProjectsData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: budgetProjectsData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Target (%)',
                    type: 'line',
                    order: 3,
                    data: budgetProjectsData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12,
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                }
            ]
        };

        const budgetProjectsChartConfig = {
            type: 'bar',
            data: budgetProjectsChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatPercentage(Number(value) || 0)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 60,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return `${value}%`;
                            }
                        },
                        title: {
                            display: true,
                            text: 'Budget Utilization (%)',
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
            plugins: [
                createBarDataLabelsPlugin('budgetProjectsBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let budgetProjectsChart = null;
        const budgetProjectsChartElement = document.getElementById('budgetProjectsChart');
        if (budgetProjectsChartElement) {
            budgetProjectsChart = new Chart(
                budgetProjectsChartElement,
                budgetProjectsChartConfig
            );
        }

        // ============================================
        // SECTION: TEAM/SECTION TARGETS (DESIGN & CONSTRUCTION) - COMPANY LEAD
        // ============================================

        const teamTargetsData = {
            labels: opportunityBlankLabels,
            target: new Array(opportunityBlankLabels.length).fill(30),
            year2024: [16, 17, 18, 18, 19, 18, 17, 16, 17, 18, 19, 20],
            year2025: [18, 19, 20, 21, 22, 23, 24, 25, 24, 23, 22, 21]
        };

        const teamTargetsChartData = {
            labels: teamTargetsData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: teamTargetsData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: teamTargetsData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Target (%)',
                    type: 'line',
                    order: 3,
                    data: teamTargetsData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12,
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                }
            ]
        };

        const teamTargetsChartConfig = {
            type: 'bar',
            data: teamTargetsChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatPercentage(Number(value) || 0)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 40,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return `${value}%`;
                            }
                        },
                        title: {
                            display: true,
                            text: 'Target Completion (%)',
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
            plugins: [
                createBarDataLabelsPlugin('teamTargetsBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let teamTargetsChart = null;
        const teamTargetsChartElement = document.getElementById('teamTargetsChart');
        if (teamTargetsChartElement) {
            teamTargetsChart = new Chart(
                teamTargetsChartElement,
                teamTargetsChartConfig
            );
        }

        // ============================================
        // SECTION: NUMBER OF BREAKDOWNS (TECHNICAL TEAM) - COMPANY LEAD
        // ============================================

        const breakdownsData = {
            labels: opportunityBlankLabels,
            target: new Array(opportunityBlankLabels.length).fill(23),
            year2024: [32, 34, 33, 35, 36, 38, 37, 36, 34, 33, 32, 31],
            year2025: [58, 60, 62, 64, 66, 68, 70, 72, 74, 73, 71, 69]
        };

        const breakdownsChartData = {
            labels: breakdownsData.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: breakdownsData.year2025,
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: breakdownsData.year2024,
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22',
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                },
                {
                    label: 'Target (%)',
                    type: 'line',
                    order: 3,
                    data: breakdownsData.target,
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12,
                    dataLabelFormatter: (value) => formatPercentage(Number(value) || 0)
                }
            ]
        };

        const breakdownsChartConfig = {
            type: 'bar',
            data: breakdownsChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 50,
                        right: 12,
                        left: 8,
                        bottom: 8
                    }
                },
                datasets: {
                    bar: {
                        barThickness: 26,
                        maxBarThickness: 26,
                        categoryPercentage: 0.82,
                        barPercentage: 0.9
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                            font: { size: 12, weight: '600' },
                            boxWidth: 12,
                            boxHeight: 12,
                            borderRadius: 6,
                            padding: 16,
                            color: '#4a4a4a',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#525552',
                        bodyColor: '#525552',
                        borderColor: '#f0f0f0',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                return `${context.dataset.label}: ${formatPercentage(Number(value) || 0)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 80,
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                return `${value}%`;
                            }
                        },
                        title: {
                            display: true,
                            text: 'Breakdowns Reported (%)',
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
            plugins: [
                createBarDataLabelsPlugin('breakdownsBarDataLabels'),
                lineDataLabelsPlugin
            ]
        };

        let breakdownsChart = null;
        const breakdownsChartElement = document.getElementById('breakdownsChart');
        if (breakdownsChartElement) {
            breakdownsChart = new Chart(
                breakdownsChartElement,
                breakdownsChartConfig
            );
        }

        const pulloutAversionLeadChartConfig = createOpportunityPValueChartConfig(
            pulloutAversionLeadChartData,
            'pulloutAversionLeadBarDataLabels',
            'Pullout Aversion (Millions ₱)'
        );

        let closedInquiriesLeadChart = null;
        const closedInquiriesLeadChartElement = document.getElementById('closedInquiriesLeadChart');
        if (closedInquiriesLeadChartElement) {
            closedInquiriesLeadChart = new Chart(
                closedInquiriesLeadChartElement,
                closedInquiriesLeadChartConfig
            );
        }

        let offlineInquiriesLeadChart = null;
        const offlineInquiriesLeadChartElement = document.getElementById('offlineInquiriesLeadChart');
        if (offlineInquiriesLeadChartElement) {
            offlineInquiriesLeadChart = new Chart(
                offlineInquiriesLeadChartElement,
                offlineInquiriesLeadChartConfig
            );
        }

        let pulloutAversionLeadChart = null;
        const pulloutAversionLeadChartElement = document.getElementById('pulloutAversionLeadChart');
        if (pulloutAversionLeadChartElement) {
            pulloutAversionLeadChart = new Chart(
                pulloutAversionLeadChartElement,
                pulloutAversionLeadChartConfig
            );
        }

        // ============================================
        // COMPANY LAG/LEAD TOGGLE FUNCTIONALITY
        // ============================================

        const COMPANY_VIEW_STORAGE_KEY = 'companyViewPreference';
        let currentCompanyView = 'lag';

        function persistCompanyView(viewType) {
            try {
                localStorage.setItem(COMPANY_VIEW_STORAGE_KEY, viewType);
            } catch (error) {
                console.warn('Unable to persist company view preference:', error);
            }
        }

        function getStoredCompanyView() {
            try {
                return localStorage.getItem(COMPANY_VIEW_STORAGE_KEY);
            } catch (error) {
                console.warn('Unable to read company view preference:', error);
                return null;
            }
        }

        const teamSectionConfig = {
            // Lag-only teams
            accounting: { 
                lag: { sectionId: 'accounting-team-section', viewType: 'lag' }
            },
            operations: { 
                lag: { sectionId: 'operations-team-section', viewType: 'lag' }
            },
            // Lead-only teams
            opportunity: { 
                lead: { sectionId: 'opportunity-team-section-lead', viewType: 'lead' }
            },
            quality: { 
                lead: { sectionId: 'quality-team-section-lead', viewType: 'lead' }
            },
            audit: { 
                lead: { sectionId: 'audit-team-section-lead', viewType: 'lead' }
            },
            // Teams that appear in both Lag and Lead
            gathering: { 
                lag: { sectionId: 'gathering-team-section-expenses', viewType: 'lag' },
                lead: { sectionId: 'gathering-team-section-lead', viewType: 'lead' }
            },
            tech: { 
                lag: { sectionId: 'technical-team-section-expenses', viewType: 'lag' },
                lead: { sectionId: 'technical-team-section-lead', viewType: 'lead' }
            },
            lrad: { 
                lag: { sectionId: 'lrad-team-section-expenses', viewType: 'lag' },
                lead: { sectionId: 'lrad-team-section-lead', viewType: 'lead' }
            },
            marcom: { 
                lag: { sectionId: 'marcom-team-section-expenses', viewType: 'lag' },
                lead: { sectionId: 'marcom-team-section-lead', viewType: 'lead' }
            },
            dc: { 
                lag: { sectionId: 'dc-team-section-expenses', viewType: 'lag' },
                lead: { sectionId: 'dc-team-section-lead', viewType: 'lead' }
            }
        };

        function highlightTeamSection(sectionEl) {
            if (!sectionEl) return;
            sectionEl.classList.add('team-section-highlight');
            setTimeout(() => {
                sectionEl.classList.remove('team-section-highlight');
            }, 1500);
        }

        function focusTeamSection(teamKey) {
            const config = teamSectionConfig[teamKey];
            if (!config) return;
            
            // Check if team exists in both views
            const hasBothViews = config.lag && config.lead;
            
            if (hasBothViews) {
                // Team exists in both views - prioritize current view
                const currentViewConfig = config[currentCompanyView];
                if (currentViewConfig) {
                    const sectionEl = document.getElementById(currentViewConfig.sectionId);
                    if (sectionEl) {
                        sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        highlightTeamSection(sectionEl);
                    }
                }
            } else {
                // Team exists in only one view
                const singleConfig = config.lag || config.lead;
                if (!singleConfig) return;
                
                // If the team section is in a different view, switch to that view first
                if (singleConfig.viewType !== currentCompanyView) {
                    toggleCompanyView(singleConfig.viewType);
                    // Wait a bit for the view to switch, then scroll
                    setTimeout(() => {
                        const sectionEl = document.getElementById(singleConfig.sectionId);
                        if (sectionEl) {
                            sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            highlightTeamSection(sectionEl);
                        }
                    }, 100);
                    return;
                }
                
                const sectionEl = document.getElementById(singleConfig.sectionId);
                if (!sectionEl) return;
                sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                highlightTeamSection(sectionEl);
            }
        }

        function updateTeamCardState() {
            const cards = document.querySelectorAll('.clickable-stat-card-carousel');
            cards.forEach(card => {
                const teamKey = card.dataset.team;
                const config = teamSectionConfig[teamKey];
                const requiredView = card.dataset.teamType;
                
                if (!config) {
                    // No config found, disable card
                    card.classList.add('team-card-disabled');
                    return;
                }
                
                // Check if team exists in both views
                const hasBothViews = config.lag && config.lead;
                
                if (hasBothViews) {
                    // Team exists in both views - always enabled since it can navigate to current view
                    card.classList.remove('team-card-disabled');
                    card.setAttribute('tabindex', '0');
                } else {
                    // Team exists in only one view - enable only when in matching view
                    if (!requiredView || requiredView === currentCompanyView) {
                        card.classList.remove('team-card-disabled');
                        card.setAttribute('tabindex', '0');
                    } else {
                        // Still clickable, but visually disabled to show it's in a different view
                        // The click handler will switch views automatically
                        card.classList.add('team-card-disabled');
                        card.setAttribute('tabindex', '0'); // Keep tabindex so it's still accessible
                    }
                }
            });
        }

        function initializeTeamCardNavigation() {
            const cards = document.querySelectorAll('.clickable-stat-card-carousel');
            cards.forEach(card => {
                card.addEventListener('click', () => {
                    const teamKey = card.dataset.team;
                    const teamConfig = teamSectionConfig[teamKey];
                    if (!teamConfig) {
                        return;
                    }
                    // Allow navigation even if view doesn't match - it will switch views automatically
                    focusTeamSection(teamKey);
                });

                card.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        const teamKey = card.dataset.team;
                        const teamConfig = teamSectionConfig[teamKey];
                        if (!teamConfig) {
                            return;
                        }
                        // Allow navigation even if view doesn't match - it will switch views automatically
                        focusTeamSection(teamKey);
                    }
                });
            });
            updateTeamCardState();
        }

        // Function to toggle between Company Lag and Company Lead
        function toggleCompanyView(viewType) {
            const lagElements = document.querySelectorAll('[data-company-type="lag"]');
            const leadElements = document.querySelectorAll('[data-company-type="lead"]');
            const toggleButtons = document.querySelectorAll('.company-toggle-btn');
            
            if (viewType === 'lag') {
                // Show Company Lag (Revenue through Expenses)
                lagElements.forEach(el => {
                    if (el.classList.contains('dashboard-grid')) {
                        el.style.display = 'grid';
                    } else {
                        el.style.display = '';
                    }
                });
                // Hide Company Lead (Occupancy Rate)
                leadElements.forEach(el => {
                    if (el.classList.contains('dashboard-grid')) {
                        el.style.display = 'none';
                    } else {
                        el.style.display = 'none';
                    }
                });
                // Update button states
                toggleButtons.forEach(btn => {
                    if (btn.dataset.view === 'lag') {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            } else if (viewType === 'lead') {
                // Hide Company Lag (Revenue through Expenses)
                lagElements.forEach(el => {
                    if (el.classList.contains('dashboard-grid')) {
                        el.style.display = 'none';
                    } else {
                        el.style.display = 'none';
                    }
                });
                // Show Company Lead (Occupancy Rate)
                leadElements.forEach(el => {
                    if (el.classList.contains('dashboard-grid')) {
                        el.style.display = 'grid';
                    } else {
                        el.style.display = '';
                    }
                });
                // Update button states
                toggleButtons.forEach(btn => {
                    if (btn.dataset.view === 'lead') {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }

            currentCompanyView = viewType;
            persistCompanyView(viewType);
            updateTeamCardState();
        }

        // Initialize toggle buttons (run after DOM is ready)
        function initializeCompanyToggle() {
            const toggleButtons = document.querySelectorAll('.company-toggle-btn');
            toggleButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const viewType = this.dataset.view;
                    toggleCompanyView(viewType);
                });
            });
            
            const initialView = getStoredCompanyView() || 'lag';
            toggleCompanyView(initialView);
        }

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeCompanyToggle);
        } else {
            // DOM is already ready
            initializeCompanyToggle();
            initializeTeamCardNavigation();
        }


        function formatPercentage(value) {
            if (typeof value !== 'number' || Number.isNaN(value)) {
                return '--';
            }
            return `${value.toFixed(1)}%`;
        }

        function colorVarianceAndYoYGrowthValues() {
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
        }

        function updateCollectionSummary() {
            const targetEl = document.querySelector('[data-metric="collection-target"]');
            const actualEl = document.querySelector('[data-metric="collection-actual"]');
            const varianceEl = document.querySelector('[data-metric="collection-variance"]');

            if (!targetEl || !actualEl || !varianceEl) {
                return;
            }

            const { targetRate, averageReceivables, averageCollected } = COLLECTION_SUMMARY_METRICS;

            if (!averageReceivables || !averageCollected) {
                return;
            }

            const actualRate = (averageCollected / averageReceivables) * 100;
            const varianceRate = actualRate - targetRate;

            targetEl.textContent = formatPercentage(targetRate);
            actualEl.textContent = formatPercentage(actualRate);
            varianceEl.textContent = formatPercentage(varianceRate);

            colorVarianceAndYoYGrowthValues();
        }

        document.addEventListener('DOMContentLoaded', colorVarianceAndYoYGrowthValues);

        // Initialize when the page loads
        window.addEventListener('load', () => {
            updateCollectionSummary();
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            const topBtnContainer = document.getElementById('topBtnContainer');
            
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
                if (topBtnContainer) {
                    topBtnContainer.classList.add('visible');
                }
            } else {
                navbar.classList.remove('scrolled');
                if (topBtnContainer) {
                    topBtnContainer.classList.remove('visible');
                }
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

        // Carousel functionality
        const carousel = document.getElementById('statsCarousel');
        const carouprevBtn = document.getElementById('carouprevBtn');
        const carounextBtn = document.getElementById('carounextBtn');
        const caroupageIndicator = document.getElementById('caroupageIndicator');

        if (carousel && carouprevBtn && carounextBtn && caroupageIndicator) {
            let currentPage = 0;
            const cardsPerPage = 4;

            function updateCarousel() {
                const totalCards = carousel.children.length;
                const totalPages = Math.ceil(totalCards / cardsPerPage);
                
                const offset = currentPage * cardsPerPage;
                const cardWidth = 300;
                const gap = 20;
                const translateX = -(offset * (cardWidth + gap));
                
                carousel.style.transform = `translateX(${translateX}px)`;
                caroupageIndicator.textContent = `${currentPage + 1} / ${totalPages}`;
                
                carouprevBtn.disabled = currentPage === 0;
                carounextBtn.disabled = currentPage >= totalPages - 1;
                
                if (carouprevBtn.disabled) {
                    carouprevBtn.style.opacity = '0.5';
                    carouprevBtn.style.cursor = 'not-allowed';
                } else {
                    carouprevBtn.style.opacity = '1';
                    carouprevBtn.style.cursor = 'pointer';
                }
                
                if (carounextBtn.disabled) {
                    carounextBtn.style.opacity = '0.5';
                    carounextBtn.style.cursor = 'not-allowed';
                } else {
                    carounextBtn.style.opacity = '1';
                    carounextBtn.style.cursor = 'pointer';
                }
            }

            carouprevBtn.addEventListener('click', () => {
                if (currentPage > 0) {
                    currentPage--;
                    updateCarousel();
                }
            });

            carounextBtn.addEventListener('click', () => {
                const totalCards = carousel.children.length;
                const totalPages = Math.ceil(totalCards / cardsPerPage);
                if (currentPage < totalPages - 1) {
                    currentPage++;
                    updateCarousel();
                }
            });

            // Function to update progress bars based on stat values
            function updateProgressBars() {
                const statCards = document.querySelectorAll('.stat-card');
                
                statCards.forEach(card => {
                    const statValueElement = card.querySelector('.stat-value');
                    const progressFill = card.querySelector('.progress-fill');
                    
                    if (statValueElement) {
                        const percentageText = statValueElement.textContent.trim();
                        const percentage = parseFloat(percentageText.replace('%', ''));
                        
                        // Get the team class from stat-value or progress-fill
                        const teamClass = statValueElement.className.split(' ').find(cls => 
                            ['tech', 'acc', 'lrad', 'qual', 'dc', 'it', 'opp', 'marc', 'aud', 'gath', 'oper'].includes(cls)
                        ) || progressFill?.className.split(' ').find(cls => 
                            ['tech', 'acc', 'lrad', 'qual', 'dc', 'it', 'opp', 'marc', 'aud', 'gath', 'oper'].includes(cls)
                        );
                        
                        // Add team class to card if found
                        if (teamClass) {
                            card.classList.add(teamClass);
                        }
                        
                        if (!isNaN(percentage)) {
                            card.style.setProperty('--fill-width', `${percentage}%`);
                            if (progressFill) {
                                progressFill.style.width = `${percentage}%`;
                            }
                        }
                    }
                });
            }

            // Initialize carousel when DOM is ready
            function initializeCarousel() {
                updateProgressBars();
                updateCarousel();
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeCarousel);
            } else {
                initializeCarousel();
            }

            window.addEventListener('resize', () => {
                updateCarousel();
            });
        }


