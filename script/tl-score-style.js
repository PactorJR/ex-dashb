const performanceData = {
            'emily-rodriguez': {
                '1. Team Target & Performance': {
                    'Score/Evaluation/NPS : Team Performance': {
                        current: 85,
                        previous: 78
                    },
                    'Score/Evaluation/NPS : Team Members Performance': {
                        current: 82,
                        previous: 75
                    },
                    '% Score : Project/Work Orders': {
                        current: 88,
                        previous: 82
                    },
                    '# of Team\'s I.C.A.R.E (Audit Findings)': {
                        current: 92,
                        previous: 88
                    }
                },
                '2. Team Budget and Expenses Management': {
                    '% Within the Team\'s Budget': {
                        current: 95,
                        previous: 90
                    }
                },
                '3. LotusOS (RP+Lotuszen+PT+KDB [PM+F]) Development, Innovation, and Performance': {
                    'Score/Evaluation/NPS : SMD Projects': {
                        current: 87,
                        previous: 80
                    },
                    'Score/Evaluation/NPS : SID Projects': {
                        current: 84,
                        previous: 79
                    },
                    'Score/Evaluation/NPS : LotusOS NPS': {
                        current: 86,
                        previous: 81
                    }
                }
            },
            'sarah-mitchell': {
                '1. Team Target & Performance': {
                    '1a. System Uptime Score': {
                        current: 99.9,
                        previous: 99.5
                    },
                    '1b. Code Quality Score': {
                        current: 92,
                        previous: 88
                    },
                    '1c. Sprint Completion Rate': {
                        current: 96,
                        previous: 91
                    },
                    '1d. Bug Resolution Time': {
                        current: 89,
                        previous: 85
                    }
                }
            }
        };

        // Define which KPIs are Critical Numbers
        const criticalNumberTypes = {
            'emily-rodriguez': {
                'Score/Evaluation/NPS : SMD Projects': 'TL CN (Lead)',
                'Score/Evaluation/NPS : SID Projects': 'TL CN (Lead)'
            }
        };

        const teamDropdownData = {
            'emily-rodriguez': {
                '1. Team Target & Performance': [
                    {
                        kpi: 'Score/Evaluation/NPS : Team Performance',
                        target: '85%',
                        weight: '5%',
                        overallWeight: '5%'
                    },
                    {
                        kpi: 'Score/Evaluation/NPS : Team Members Performance',
                        target: '82%',
                        weight: '5%',
                        overallWeight: '5%'
                    },
                    {
                        kpi: '% Score : Project/Work Orders',
                        target: '88%',
                        weight: '5%',
                        overallWeight: '5%'
                    },
                    {
                        kpi: '# of Team\'s I.C.A.R.E (Audit Findings)',
                        target: '92%',
                        weight: '10%',
                        overallWeight: '10%'
                    }
                ],
                '2. Team Budget and Expenses Management': [
                    {
                        kpi: '% Within the Team\'s Budget',
                        target: '95%',
                        weight: '25%',
                        overallWeight: '25%'
                    }
                ],
                '3. LotusOS (RP+Lotuszen+PT+KDB [PM+F]) Development, Innovation, and Performance': [
                    {
                        kpi: 'Score/Evaluation/NPS : SMD Projects',
                        target: '87%',
                        weight: '40%',
                        overallWeight: '20%',
                        cnType: 'TL CN (Lead)'
                    },
                    {
                        kpi: 'Score/Evaluation/NPS : SID Projects',
                        target: '84%',
                        weight: '40%',
                        overallWeight: '20%',
                        cnType: 'TL CN (Lead)'
                    },
                    {
                        kpi: 'Score/Evaluation/NPS : LotusOS NPS',
                        target: '86%',
                        weight: '20%',
                        overallWeight: '10%'
                    },
                ]
            },
            'sarah-mitchell': {
                '1. Team Target & Performance': [
                    {
                        kpi: '1a. System Uptime Score',
                        target: '99.9%',
                        weight: '5%',
                        overallWeight: '5%'
                    },
                    {
                        kpi: '1b. Code Quality Score',
                        target: '90%',
                        weight: '5%',
                        overallWeight: '5%'
                    },
                    {
                        kpi: '1c. Sprint Completion Rate',
                        target: '95%',
                        weight: '5%',
                        overallWeight: '5%'
                    },
                    {
                        kpi: '1d. Bug Resolution Time',
                        target: '24hrs',
                        weight: '10%',
                        overallWeight: '10%'
                    }
                ],
            }
        };

        const weightComparisonData = {
            'emily-rodriguez': {
                '1. Team Target & Performance': {
                    'Score/Evaluation/NPS : Team Performance': {
                        weight: 5,
                        overallWeight: 5
                    },
                    'Score/Evaluation/NPS : Team Members Performance': {
                        weight: 5,
                        overallWeight: 5
                    },
                    '% Score : Project/Work Orders': {
                        weight: 5,
                        overallWeight: 5
                    },
                    '# of Team\'s I.C.A.R.E (Audit Findings)': {
                        weight: 10,
                        overallWeight: 10
                    }
                },
                '2. Team Budget and Expenses Management': {
                    '% Within the Team\'s Budget': {
                        weight: 25,
                        overallWeight: 25
                    }
                },
                '3. LotusOS (RP+Lotuszen+PT+KDB [PM+F]) Development, Innovation, and Performance': {
                    'Score/Evaluation/NPS : SMD Projects': {
                        weight: 40,
                        overallWeight: 20
                    },
                    'Score/Evaluation/NPS : SID Projects': {
                        weight: 40,
                        overallWeight: 20
                    },
                    'Score/Evaluation/NPS : LotusOS NPS': {
                        weight: 20,
                        overallWeight: 10
                    }
                }
            }
        };

        const teamOperationsData = {
            'sarah-mitchell': [
                { role: 'System Architecture', owner: 'John Smith', kra: 'Infrastructure Design' },
                { role: 'Code Review', owner: 'Emma Davis', kra: 'Quality Assurance' },
                { role: 'DevOps', owner: 'Michael Brown', kra: 'Deployment Automation' },
                { role: 'Security', owner: 'Sarah Johnson', kra: 'Security Compliance' }
            ],
            'marcus-chen': [
                { role: 'Budget Planning', owner: 'David Lee', kra: 'Financial Forecasting' },
                { role: 'Financial Reporting', owner: 'Lisa Wang', kra: 'Monthly Reports' },
                { role: 'Audit Coordination', owner: 'James Park', kra: 'Compliance' }
            ],
            'james-peterson': [
                { role: 'Research Analysis', owner: 'Alex Turner', kra: 'Data Collection' },
                { role: 'Technical Writing', owner: 'Sophie Chen', kra: 'Documentation' },
                { role: 'Testing', owner: 'Mark Stevens', kra: 'Quality Testing' }
            ],
            'emily-rodriguez': [
                    { role: '1. Team Target & Performance', owner: 'Robert Taylor', kra: '-' },
                    { role: '2. Team Budget and Expenses Management', owner: 'Maria Garcia', kra: '-' },
                    { role: '3. LotusOS (RP+Lotuszen+PT+KDB [PM+F]) Development, Innovation, and Performance', owner: 'Chris Wilson', kra: '-' }
                ],
            'david-patterson': [
                { role: 'Infrastructure Management', owner: 'Tom Anderson', kra: 'Server Maintenance' },
                { role: 'Network Operations', owner: 'Susan Martinez', kra: 'Network Security' },
                { role: 'Disaster Recovery', owner: 'Paul Robinson', kra: 'Backup Systems' }
            ],
            'jennifer-lee': [
                { role: 'IT Strategy', owner: 'Kevin Chen', kra: 'Technology Planning' },
                { role: 'System Integration', owner: 'Amy Liu', kra: 'Platform Integration' },
                { role: 'User Support', owner: 'Brian Kim', kra: 'Help Desk Management' }
            ],
            'robert-thompson': [
                { role: 'Business Development', owner: 'Rachel Green', kra: 'Client Acquisition' },
                { role: 'Partnership Management', owner: 'Steve Rogers', kra: 'Strategic Alliances' },
                { role: 'Market Research', owner: 'Diana Prince', kra: 'Market Analysis' }
            ],
            'amanda-white': [
                { role: 'Campaign Management', owner: 'Tony Stark', kra: 'Marketing Campaigns' },
                { role: 'Brand Strategy', owner: 'Natasha Romanoff', kra: 'Brand Development' },
                { role: 'Content Creation', owner: 'Bruce Banner', kra: 'Content Strategy' }
            ],
            'michael-johnson': [
                { role: 'Internal Audits', owner: 'Peter Parker', kra: 'Compliance Auditing' },
                { role: 'Risk Assessment', owner: 'Wanda Maximoff', kra: 'Risk Management' },
                { role: 'Regulatory Compliance', owner: 'Vision AI', kra: 'Policy Adherence' }
            ],
            'lisa-anderson': [
                { role: 'Data Analysis', owner: 'Carol Danvers', kra: 'Analytics' },
                { role: 'Reporting', owner: 'Scott Lang', kra: 'Business Intelligence' },
                { role: 'Data Governance', owner: 'Hope Van Dyne', kra: 'Data Quality' }
            ],
            'kevin-martinez': [
                { role: 'Process Optimization', owner: 'Sam Wilson', kra: 'Workflow Improvement' },
                { role: 'Resource Planning', owner: 'Bucky Barnes', kra: 'Resource Allocation' },
                { role: 'Performance Monitoring', owner: 'Nick Fury', kra: 'KPI Tracking' }
            ]
        };

        function updatePerformanceGraph(leaderId, operationRole, kpiName) {
        const performanceChartData = performanceData[leaderId]?.[operationRole]?.[kpiName];
        const weightData = weightComparisonData[leaderId]?.[operationRole]?.[kpiName];
        
        if (!performanceChartData) {
            console.log('No performance data available');
            return;
        }

        const currentValue = performanceChartData.current;
        const previousValue = performanceChartData.previous;
        
        // Update the first chart (Team Performance Report)
        const performanceChartSvg = document.querySelectorAll('.line-chart')[0];
        
        const currentY = 120 - (currentValue * 1.2);
        const previousY = 120 - (previousValue * 1.2);
        
        const currentPath = `M 0,${currentY} L 50,${currentY-5} L 100,${currentY+3} L 150,${currentY-2} L 200,${currentY+5} L 250,${currentY-8} L 300,${currentY}`;
        const previousPath = `M 0,${previousY} L 50,${previousY-3} L 100,${previousY+5} L 150,${previousY-4} L 200,${previousY+2} L 250,${previousY-6} L 300,${previousY}`;
        
        performanceChartSvg.innerHTML = `
            <defs>
                <linearGradient id="currentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#96a840;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#96a840;stop-opacity:0" />
                </linearGradient>
                <linearGradient id="previousGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#e5bb22;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#e5bb22;stop-opacity:0" />
                </linearGradient>
            </defs>
            
            <path class="chart-area" d="${previousPath} L 300,120 L 0,120 Z" fill="url(#previousGradient)" />
            <path class="chart-line" d="${previousPath}" 
                style="stroke: #e5bb22; stroke-width: 2; fill: none; stroke-dasharray: 5,5;" />
            
            <path class="chart-area" d="${currentPath} L 300,120 L 0,120 Z" fill="url(#currentGradient)" />
            <path class="chart-line recover-line" d="${currentPath}" />
            
            <circle cx="0" cy="${currentY}" r="4" fill="#96a840" />
            <circle cx="300" cy="${currentY}" r="4" fill="#96a840" />
            <circle cx="0" cy="${previousY}" r="3" fill="#e5bb22" />
            <circle cx="300" cy="${previousY}" r="3" fill="#e5bb22" />
        `;
        
        const performanceReportTitle = document.querySelectorAll('.report-title')[0];
        performanceReportTitle.innerHTML = `
            Team Performance Report - ${kpiName}
            <div style="font-size: 12px; margin-top: 10px; display: flex; gap: 20px;">
                <span style="color: #96a840;">● Current: ${currentValue}%</span>
                <span style="color: #e5bb22;">● Previous: ${previousValue}%</span>
                <span style="color: ${currentValue >= previousValue ? '#4ade80' : '#f87171'};">
                    ${currentValue >= previousValue ? '↑' : '↓'} ${Math.abs(currentValue - previousValue).toFixed(1)}%
                </span>
            </div>
        `;

        // Update the second chart (Team Metrics Overview) with weight comparison
        if (weightData) {
            const metricsChartSvg = document.querySelectorAll('.line-chart')[1];
            const weight = weightData.weight;
            const overallWeight = weightData.overallWeight;
            
            const weightY = 120 - (weight * 1.2);
            const overallWeightY = 120 - (overallWeight * 1.2);
            
            const weightPath = `M 0,${weightY} L 50,${weightY-3} L 100,${weightY+5} L 150,${weightY-2} L 200,${weightY+3} L 250,${weightY-5} L 300,${weightY}`;
            const overallWeightPath = `M 0,${overallWeightY} L 50,${overallWeightY-5} L 100,${overallWeightY+3} L 150,${overallWeightY-4} L 200,${overallWeightY+6} L 250,${overallWeightY-3} L 300,${overallWeightY}`;
            
            metricsChartSvg.innerHTML = `
                <defs>
                    <linearGradient id="weightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#667eea;stop-opacity:0" />
                    </linearGradient>
                    <linearGradient id="overallWeightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#f093fb;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#f093fb;stop-opacity:0" />
                    </linearGradient>
                </defs>
                
                <path class="chart-area" d="${overallWeightPath} L 300,120 L 0,120 Z" fill="url(#overallWeightGradient)" />
                <path class="chart-line" d="${overallWeightPath}" 
                    style="stroke: #f093fb; stroke-width: 2; fill: none; stroke-dasharray: 5,5;" />
                
                <path class="chart-area" d="${weightPath} L 300,120 L 0,120 Z" fill="url(#weightGradient)" />
                <path class="chart-line" d="${weightPath}" 
                    style="stroke: #667eea; stroke-width: 3; fill: none;" />
                
                <circle cx="0" cy="${weightY}" r="4" fill="#667eea" />
                <circle cx="300" cy="${weightY}" r="4" fill="#667eea" />
                <circle cx="0" cy="${overallWeightY}" r="3" fill="#f093fb" />
                <circle cx="300" cy="${overallWeightY}" r="3" fill="#f093fb" />
            `;
            
            const metricsReportTitle = document.querySelectorAll('.report-title')[1];
            metricsReportTitle.innerHTML = `
                Team Metrics Overview - ${kpiName}
                <div style="font-size: 12px; margin-top: 10px; display: flex; gap: 20px;">
                    <span style="color: #667eea;">● Operational KPI Weight: ${weight}%</span>
                    <span style="color: #f093fb;">● Overall Weight: ${overallWeight}%</span>
                    <span style="color: ${weight >= overallWeight ? '#4ade80' : '#f87171'};">
                        ${weight >= overallWeight ? '↑' : '↓'} ${Math.abs(weight - overallWeight).toFixed(1)}%
                    </span>
                </div>
            `;
        }
    }

        let currentView = 'operations';
        let selectedLeader = null;
        let selectedLeaderData = null;

        function initializeReports() {
            const reportCards = document.querySelectorAll('.report-card');
            reportCards.forEach((card, index) => {
                if (index === 0 || index === 2) {
                    card.style.display = 'none';
                }
                if (index === 1) {
                    card.style.display = 'block';
                }
            });
        }

        function showReportCards() {
            const reportCards = document.querySelectorAll('.report-card');
            reportCards.forEach((card, index) => {
                if (index === 0 || index === 2) {
                    card.style.display = 'block';
                }
                if (index === 1) {
                    card.style.display = 'none';
                }
            });
        }

        function showLegendOnly() {
            const reportCards = document.querySelectorAll('.report-card');
            reportCards.forEach((card, index) => {
                if (index === 0 || index === 2) {
                    card.style.display = 'none';
                }
                if (index === 1) {
                    card.style.display = 'block';
                }
            });
        }

        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        const sectionSwitch = document.getElementById('sectionSwitch');
        const sectionSwitch2 = document.getElementById('sectionSwitch2');
        const operationsSection = document.getElementById('operationsSection');
        const profileSection = document.getElementById('profileSection');

        function toggleSections() {
            currentView = currentView === 'operations' ? 'profile' : 'operations';
            
            sectionSwitch.classList.toggle('active');
            sectionSwitch2.classList.toggle('active');
            
            if (currentView === 'operations') {
                operationsSection.classList.remove('hidden');
                profileSection.classList.add('hidden');
                if (selectedLeader) {
                    showReportCards();
                } else {
                    showLegendOnly();
                }
            } else {
                operationsSection.classList.add('hidden');
                profileSection.classList.remove('hidden');
                showLegendOnly();
            }
        }

        sectionSwitch.addEventListener('click', toggleSections);
        sectionSwitch2.addEventListener('click', toggleSections);

        const leaderCards = document.querySelectorAll('.leader-card');
        
        leaderCards.forEach(card => {
            card.addEventListener('click', function() {
                leaderCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                
                selectedLeader = this.getAttribute('data-leader');
                selectedLeaderData = {
                    name: this.getAttribute('data-name'),
                    title: this.getAttribute('data-title'),
                    roles: this.getAttribute('data-roles'),
                    contributions: this.getAttribute('data-contributions'),
                    icon: this.getAttribute('data-icon')
                };
                
                if (currentView === 'operations') {
                    showReportCards();
                } else {
                    showLegendOnly();
                }
                
                updateOperationsSection(selectedLeader, selectedLeaderData.title);
                updateProfileSection(selectedLeaderData);
            });
        });

        function updateOperationsSection(leaderId, teamName) {
        const operationsContent = document.getElementById('operationsContent');
        const operations = teamOperationsData[leaderId] || [];
        
        if (operations.length === 0) {
            operationsContent.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <div class="empty-state-text">No operations data available</div>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="Search operations...">
            </div>
            <div class="table-header">
                <div>Operational KPI</div>
                <div>Role Owner</div>
                <div>Set Target</div>
                <div>% Operational KPI Weight</div>
            </div>
            <div id="membersList">
        `;
        
        operations.forEach((op, index) => {
            const hasDropdown = teamDropdownData[leaderId] && teamDropdownData[leaderId][op.role];
            const dropdownClass = hasDropdown ? 'has-dropdown' : '';
            
            html += `
                <div class="member-row ${dropdownClass}" data-name="${op.owner.toLowerCase()}" data-team="${teamName.toLowerCase()}" data-index="${index}">
                    <div class="member-info">
                        <div class="member-name">${op.role}</div>
                    </div>
                    <div>${op.owner}</div>
                    <div>${op.kra}</div>
                    <div><span class="dropdown-arrow">▼</span></div>
                </div>
            `;
            
            if (hasDropdown) {
                const dropdownItems = teamDropdownData[leaderId][op.role];
                html += `
                    <div class="sub-operations" id="dropdown-${index}">
                `;
                
                dropdownItems.forEach(item => {
                    const isCN = item.cnType !== undefined;
                    const cnBadge = isCN ? `<span class="cn-badge">${item.cnType}</span>` : '';
                    
                    html += `
                        <div class="sub-operation-item">
                            <div class="sub-operation-label">${item.kpi}${cnBadge}</div>
                            <div>-</div>
                            <div><span class="target-badge">${item.target}</span></div>
                            <div><span class="weight-badge">${item.weight}</span></div>
                            <div><span class="weight-overall-badge">${item.overallWeight}</span></div>
                        </div>
                    `;
                });
                
                html += `</div>`;
            }
        });
        
        html += '</div>';
        operationsContent.innerHTML = html;
        
        attachSearchFunctionality();
        attachDropdownFunctionality(leaderId);
    }

        function attachDropdownFunctionality(leaderId) {
            const memberRows = document.querySelectorAll('.member-row.has-dropdown');
            
            memberRows.forEach(row => {
                row.addEventListener('click', function(e) {
                    const index = this.getAttribute('data-index');
                    const dropdown = document.getElementById(`dropdown-${index}`);
                    const operationRole = this.querySelector('.member-name').textContent;
                    
                    if (dropdown) {
                        const isExpanded = this.classList.contains('expanded');
                        
                        document.querySelectorAll('.member-row.has-dropdown').forEach(r => {
                            r.classList.remove('expanded');
                        });
                        document.querySelectorAll('.sub-operations').forEach(d => {
                            d.classList.remove('show');
                        });
                        
                        if (!isExpanded) {
                            this.classList.add('expanded');
                            dropdown.classList.add('show');
                            
                            const subItems = dropdown.querySelectorAll('.sub-operation-item');
                            subItems.forEach(item => {
                                item.style.cursor = 'pointer';
                                item.addEventListener('click', function(e) {
                                    e.stopPropagation();
                                    
                                    subItems.forEach(i => i.style.background = '');
                                    
                                    this.style.background = 'rgba(229, 187, 34, 0.15)';
                                    
                                    const kpiName = this.querySelector('.sub-operation-label').textContent.replace('→', '').trim();
                                    const kpiNameClean = kpiName.replace(/TL CN \(Lead\)/g, '').replace(/TL CN \(Lag\)/g, '').replace(/Company CN \(Lead\)/g, '').replace(/Company CN \(Lag\)/g, '').trim();
                                    updatePerformanceGraph(leaderId, operationRole, kpiNameClean);
                                });
                            });
                        }
                    }
                });
            });
        }

        function updateProfileSection(data) {
            const profileContent = document.getElementById('profileContent');
            
            const gradients = [
                'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
                'linear-gradient(135deg, #4ecdc4, #44a6a0)',
                'linear-gradient(135deg, #95e1d3, #6ec4b8)',
                'linear-gradient(135deg, #74b9ff, #0984e3)',
                'linear-gradient(135deg, #a29bfe, #6c5ce7)',
                'linear-gradient(135deg, #fdcb6e, #f39c12)',
                'linear-gradient(135deg, #fd79a8, #e84393)',
                'linear-gradient(135deg, #00b894, #00cec9)',
                'linear-gradient(135deg, #d63031, #c0392b)',
                'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                'linear-gradient(135deg, #ff7675, #d63031)'
            ];
            
            const cardIndex = Array.from(leaderCards).findIndex(card => 
                card.getAttribute('data-leader') === selectedLeader
            );
            const gradientStyle = gradients[cardIndex] || gradients[0];
            
            profileContent.innerHTML = `
                <div class="profile-content">
                    <div class="profile-header">
                        <div class="profile-avatar" style="background: ${gradientStyle}">
                            ${data.icon}
                        </div>
                        <div class="profile-header-info">
                            <div class="profile-header-name">${data.name}</div>
                            <div class="profile-header-title">${data.title}</div>
                            <div class="profile-stats">
                                <div class="profile-stat">
                                    <div class="profile-stat-value">4.8</div>
                                    <div class="profile-stat-label">Rating</div>
                                </div>
                                <div class="profile-stat">
                                    <div class="profile-stat-value">5+</div>
                                    <div class="profile-stat-label">Years Exp</div>
                                </div>
                                <div class="profile-stat">
                                    <div class="profile-stat-value">12</div>
                                    <div class="profile-stat-label">Team Size</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-details">
                        <div class="profile-item">
                            <div class="profile-label">Role Title(s)</div>
                            <div class="profile-value">${data.roles}</div>
                        </div>
                        <div class="profile-item">
                            <div class="profile-label">Key Contributions</div>
                            <div class="profile-value">${data.contributions}</div>
                        </div>
                        <div class="profile-item">
                            <div class="profile-label">Department</div>
                            <div class="profile-value">${data.title}</div>
                        </div>
                        <div class="profile-item">
                            <div class="profile-label">Contact</div>
                            <div class="profile-value">${data.name.toLowerCase().replace(' ', '.')}@company.com</div>
                        </div>
                    </div>
                </div>
            `;
        }

        function attachSearchFunctionality() {
            const searchInput = document.getElementById('searchInput');
            if (!searchInput) return;
            
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();
                const memberRows = document.querySelectorAll('.member-row');

                memberRows.forEach(row => {
                    const name = row.getAttribute('data-name');
                    const team = row.getAttribute('data-team');
                    
                    if (name.includes(searchTerm) || team.includes(searchTerm)) {
                        row.classList.remove('hidden');
                    } else {
                        row.classList.add('hidden');
                    }
                });
            });
        }

        window.addEventListener('DOMContentLoaded', initializeReports);