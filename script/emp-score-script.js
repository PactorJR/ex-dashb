// Navigation bar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Team Leader selection functionality
    let selectedTeam = null;
    const leaderCards = document.querySelectorAll('.leader-card');
    const memberRows = document.querySelectorAll('.member-row');
    const searchInput = document.getElementById('searchInput');

    // Function to filter members by team
    function filterMembersByTeam() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        
        memberRows.forEach(row => {
            // Get team from the second direct child div (after member-info)
            // The structure is: member-info (1st), Team (2nd), Role (3rd), etc.
            const teamDiv = Array.from(row.children).find((child, index) => {
                // Skip the first child (member-info) and get the second child which is the Team
                return index === 1;
            });
            
            const team = teamDiv ? teamDiv.textContent.trim() : '';
            const name = row.getAttribute('data-name') || '';
            
            // Normalize team names for comparison (case-insensitive)
            const normalizedSelectedTeam = selectedTeam ? selectedTeam.toLowerCase().trim() : null;
            const normalizedTeam = team.toLowerCase().trim();
            
            // Check if team matches selected team (if one is selected)
            const teamMatches = !selectedTeam || normalizedTeam === normalizedSelectedTeam;
            
            // Check if search term matches (if search is active)
            const searchMatches = !searchTerm || 
                name.toLowerCase().includes(searchTerm) || 
                normalizedTeam.includes(searchTerm);
            
            // Show row if both conditions are met
            if (teamMatches && searchMatches) {
                row.style.display = '';
                row.classList.remove('hidden');
            } else {
                row.style.display = 'none';
                row.classList.add('hidden');
            }
        });
    }

    // Add click handlers to leader cards
    leaderCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            leaderCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            this.classList.add('active');
            
            // Get the team name from data-team attribute
            selectedTeam = this.getAttribute('data-team');
            
            // Filter member rows
            filterMembersByTeam();
        });
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterMembersByTeam();
        });
    }
    
    // Member row click functionality
    function attachMemberRowClickHandlers() {
        const allMemberRows = document.querySelectorAll('.member-row');
        
        allMemberRows.forEach(row => {
            row.addEventListener('click', function(e) {
                // Don't trigger if clicking on a link or button
                if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                    return;
                }

                // Remove active class from all rows
                allMemberRows.forEach(r => r.classList.remove('row-active'));
                // Add active class to clicked row
                this.classList.add('row-active');

                const kpi = this.getAttribute('data-kpi');
                const targetStr = this.getAttribute('data-target');
                const actualStr = this.getAttribute('data-actual');
                
                const target = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                const actual = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                
                if (target !== null && actual !== null) {
                    updateMemberPerformanceChart(kpi, target, actual);
                } else {
                    // Show empty state
                    updateMemberPerformanceChart(kpi, null, null);
                }
            });
        });
    }
    
    // Function to update the performance chart when a member is clicked
    function updateMemberPerformanceChart(kpiName, target, actual) {
        const reportCards = document.querySelectorAll('.report-card');
        const performanceCard = reportCards[0]; // First card is Team Performance Report
        if (!performanceCard) return;
        
        const chartSvg = performanceCard.querySelector('svg.line-chart');
        const reportTitle = performanceCard.querySelector('.report-title');
        if (!chartSvg) return;

        // If no data, show empty state
        if (target === null || actual === null) {
            chartSvg.innerHTML = '';
            if (reportTitle) {
                reportTitle.innerHTML = `
                    Team Performance Report
                    <div style="font-size: 12px; margin-top: 10px; color: #9ca3af;">
                        Click a Team Member to show the graph
                    </div>
                `;
            }
            return;
        }

        // Calculate difference
        const difference = actual - target;
        const diffPercent = ((difference / target) * 100).toFixed(1);
        const isPositive = difference >= 0;
        const isPercentageKpi = kpiName.includes('%') || kpiName.toLowerCase().includes('percent') || 
                                 kpiName.toLowerCase().includes('rate') || kpiName.toLowerCase().includes('uptime') ||
                                 kpiName.toLowerCase().includes('compliance') || kpiName.toLowerCase().includes('accuracy') ||
                                 kpiName.toLowerCase().includes('efficiency') || kpiName.toLowerCase().includes('quality');

        // Donut chart dimensions
        const chartWidth = 400;
        const chartHeight = 200;
        const centerX = chartWidth / 2;
        const centerY = chartHeight / 2;
        const outerRadius = 75;
        const innerRadius = 45;
        
        // Calculate proportions for donut segments
        const total = target + actual;
        const targetPercent = (target / total) * 100;
        const actualPercent = (actual / total) * 100;
        
        // Convert percentages to angles
        const targetAngle = (targetPercent / 100) * 360;
        const actualAngle = (actualPercent / 100) * 360;
        
        // Helper function to create donut segment
        const createDonutSegment = (startAngle, endAngle) => {
            const start = (startAngle - 90) * (Math.PI / 180);
            const end = (endAngle - 90) * (Math.PI / 180);
            const largeArc = endAngle - startAngle > 180 ? 1 : 0;
            
            const x1 = centerX + outerRadius * Math.cos(start);
            const y1 = centerY + outerRadius * Math.sin(start);
            const x2 = centerX + outerRadius * Math.cos(end);
            const y2 = centerY + outerRadius * Math.sin(end);
            const x3 = centerX + innerRadius * Math.cos(end);
            const y3 = centerY + innerRadius * Math.sin(end);
            const x4 = centerX + innerRadius * Math.cos(start);
            const y4 = centerY + innerRadius * Math.sin(start);
            
            return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} 
                    L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
        };
        
        const targetSegment = createDonutSegment(0, targetAngle);
        const actualSegment = createDonutSegment(targetAngle, targetAngle + actualAngle);

        const defs = `
            <defs>
                <filter id="donutShadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.15"/>
                </filter>
            </defs>
        `;

        // Format value for display
        const formatValue = (value) => {
            if (isPercentageKpi) {
                return value.toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits: 2}) + '%';
            } else if (value >= 1000) {
                if (value >= 1000000) {
                    return (value / 1000000).toFixed(1) + 'M';
                } else if (value >= 1000) {
                    return (value / 1000).toFixed(1) + 'K';
                }
            }
            return value.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2});
        };

        // Build chart
        const diffColor = isPositive ? '#4ade80' : '#f87171';
        const diffSymbol = isPositive ? '↑' : '↓';
        const diffDisplay = formatValue(Math.abs(difference));
        
        const chartHTML = `
            ${defs}
            <path id="targetSegment" d="${targetSegment}" 
                  fill="#96a840" 
                  filter="url(#donutShadow)"
                  style="cursor: pointer; transition: opacity 0.2s;"
                  data-value="${target}"
                  data-label="Target"
                  data-percent="${targetPercent.toFixed(1)}" />
            <path id="actualSegment" d="${actualSegment}" 
                  fill="#e5bb22" 
                  filter="url(#donutShadow)"
                  style="cursor: pointer; transition: opacity 0.2s;"
                  data-value="${actual}"
                  data-label="Actual"
                  data-percent="${actualPercent.toFixed(1)}" />
            <text x="${centerX}" y="${centerY - 5}" 
                  text-anchor="middle" font-size="16" fill="${diffColor}" font-weight="700">
                ${diffSymbol} ${diffDisplay}
            </text>
            <text x="${centerX}" y="${centerY + 12}" 
                  text-anchor="middle" font-size="11" fill="#6b7280" font-weight="500">
                ${Math.abs(diffPercent)}%
            </text>
        `;

        chartSvg.innerHTML = chartHTML;

        // Update title with KPI, Target, and Actual
        if (reportTitle) {
            const shortName = kpiName.length > 50 ? kpiName.substring(0, 50) + '...' : kpiName;
            
            reportTitle.innerHTML = `
                Team Performance Report - ${shortName}
                <div style="font-size: 12px; margin-top: 15px; display: flex; gap: 25px; align-items: center; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #96a840;"></span>
                        <span style="color: #525552;">Target: ${formatValue(target)}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #e5bb22;"></span>
                        <span style="color: #525552;">Actual: ${formatValue(actual)}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <span style="color: ${diffColor}; font-weight: 600;">${diffSymbol} ${diffDisplay} (${Math.abs(diffPercent)}%)</span>
                    </div>
                </div>
            `;
        }
    }
    
    // Attach click handlers to member rows
    attachMemberRowClickHandlers();
});