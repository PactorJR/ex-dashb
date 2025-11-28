// Mapping from old leader IDs to team names (for backward compatibility if needed)
const leaderIdToTeamName = {
    'sarah-mitchell': 'Technical Team',
    'marcus-chen': 'Accounting Team',
    'james-peterson': 'LRAD Team',
    'emily-rodriguez': 'Quality Team',
    'david-patterson': 'DC Team',
    'jennifer-lee': 'IT Team',
    'robert-thompson': 'Opportunity Team',
    'amanda-white': 'Marcom Team',
    'michael-johnson': 'Audit Team',
    'lisa-anderson': 'Gathering Team',
    'kevin-martinez': 'Operations Team'
};

// Helper function to normalize team name to key format
function normalizeTeamName(teamName) {
    if (!teamName) return null;
    return teamName.trim();
}

// Helper function to setup search container in section-header
function setupSearchContainer(placeholder = 'Search operations...', containerId = 'operationsSearchContainer', inputId = 'searchInput') {
    const searchContainer = document.getElementById(containerId);
    if (searchContainer) {
        searchContainer.style.display = 'block';
        const existingInput = searchContainer.querySelector(`#${inputId}`);
        if (!existingInput) {
            searchContainer.innerHTML = `<input type="text" id="${inputId}" placeholder="${placeholder}">`;
        } else {
            existingInput.placeholder = placeholder;
        }
    }
}

function resetReportCardToInstruction(view) {
    // 1. Destroy existing chart instances
    if (teamPerformanceChart) {
        teamPerformanceChart.destroy();
        teamPerformanceChart = null;
    }
    if (teamMemberChart) {
        teamMemberChart.destroy();
        teamMemberChart = null;
    }

    // 2. Select elements
    const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
    const reportTitle = document.querySelector('.performance-report-card .report-title');
    const reportLegend = document.querySelector('.performance-report-card .report-legend');
    const quarterFilter = document.querySelector('.quarter-filter-container');
    const reportSubtitle = document.querySelector('.performance-report-card .report-card-subtitle');
    const canvas = document.getElementById('teamPerformanceChart');

    // 3. Clear/Hide Elements
    if (chartContainer) {
        chartContainer.innerHTML = ''; // Removes the chart/canvas/svg
        chartContainer.style.display = 'none'; // Hides the container div completely
    }
    
    // Explicitly hide the canvas if selected separately
    if (canvas) {
        canvas.style.display = 'none';
    }

    if (reportLegend) reportLegend.style.display = 'none';
    if (quarterFilter) quarterFilter.remove();
    if (reportSubtitle) reportSubtitle.textContent = '';

    // 4. Set the Default Message
    if (reportTitle) {
        // Determine text based on which view we are switching TO
        const isMembers = view === 'members'; 
        
        reportTitle.innerHTML = `
            Team Performance Report
            <div style="font-size: 12px; margin-top: 10px; color: #9ca3af;">
                ${isMembers ? 'Click a Team Member to show the graph' : 'Click an Operation KPI to show the graph'}
            </div>
        `;
    }
}

const performanceData = {
            'Quality Team': {
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
            'Marcom Team': {
                'Team Budget and Expenses Management': {
                    '% Within the Team\'s Budget': {
                        current: 60,
                        previous: 60
                    },
                    'FS Target : Marketing Expense': {
                        current: null,
                        previous: null,
                    }
                }
            },
            'Accounting Team': {
                '1. Team Target & Performance': {
                    'Score/Evaluation/NPS : Team Performance': {
                        current: 80,
                        previous: null
                    },
                    'Score/Evaluation/NPS : Team Members Performance': {
                        current: 80,
                        previous: null,
                    },
                    '% Score : Project/Work Orders': {
                        current: 85,
                        previous: null,
                    },
                    '# of Team\'s I.C.A.R.E (Audit Findings)': {
                        current: 0,
                        previous: null,
                    }
                },
                '2. Team Budget and Expenses Management': {
                    '% Within the Team\'s Budget': {
                        current: 100,
                        previous: 100
                    },
                    'FS Target : Total Operating Expense': {
                        current: 22956972.14,
                        previous: null,
                    },
                    'FS Target : Total Gross Revenue': {
                        current: 37264091.75,
                        previous: null,
                    },
                    'FS Target : Net Profit': {
                        current: 10455576.64,
                        previous: null,
                    }
                }
            },
        };

        const teamDropdownData = {
            'Quality Team': {
                '1. Team Target & Performance': [
                    {
                        kpi: 'Score/Evaluation/NPS : Team Performance',
                        target: '85%',
                        weight: '5%'
                    },
                    {
                        kpi: 'Score/Evaluation/NPS : Team Members Performance',
                        target: '82%',
                        weight: '5%'
                    },
                    {
                        kpi: '% Score : Project/Work Orders',
                        target: '88%',
                        weight: '5%'
                    },
                    {
                        kpi: '# of Team\'s I.C.A.R.E (Audit Findings)',
                        target: '92%',
                        weight: '10%'
                    }
                ],
                '2. Team Budget and Expenses Management': [
                    {
                        kpi: '% Within the Team\'s Budget',
                        target: '95%',
                        weight: '25%'
                    }
                ],
                '3. LotusOS (RP+Lotuszen+PT+KDB [PM+F]) Development, Innovation, and Performance': [
                    {
                        kpi: 'Score/Evaluation/NPS : SMD Projects',
                        target: '87%',
                        weight: '20%'
                    },
                    {
                        kpi: 'Score/Evaluation/NPS : SID Projects',
                        target: '84%',
                        weight: '20%'
                    },
                    {
                        kpi: 'Score/Evaluation/NPS : LotusOS NPS',
                        target: '86%',
                        weight: '10%'
                    },
                ]
            },
            'Marcom Team': {
                '1. Team Budget and Expenses Management': [
                    {
                        kpi: '% Within the Team\'s Budget',
                        target: '60%/60',
                        weight: '5%'
                    },
                    {
                        kpi: 'FS Target : Marketing Expense',
                        target: 'Pull from GMPT',
                        weight: '5%'
                    },
                ],
            },
            'Accounting Team': {
                '1. Team Target & Performance': [
                    {
                        kpi: 'Score/Evaluation/NPS : Team Performance',
                        target: '80%/80%',
                        weight: '5%'
                    },
                    {
                        kpi: 'Score/Evaluation/NPS : Team Members Performance',
                        target: '80%/80%',
                        weight: '5%'
                    },
                    {
                        kpi: '% Score : Project/Work Orders',
                        target: '85%/85%',
                        weight: '5%'
                    },
                    {
                        kpi: '# of Team\'s I.C.A.R.E (Audit Findings)',
                        target: '0.00/0.00',
                        weight: '5%'
                    },
                ],
                '2. Team Budget and Expenses Management': [
                    {
                        kpi: '% Within the Team\'s Budget',
                        target: '100%/100',
                        weight: '20%'
                    },
                    {
                        kpi: 'FS Target : Total Operating Expense',
                        target: '322,956,972.14',
                        weight: '20%'
                    },
                    {
                        kpi: 'FS Target : Total Gross Revenue',
                        target: '37,264,091.75',
                        weight: '20%'
                    },
                    {
                        kpi: 'FS Target : Net Profit',
                        target: '10,455,576.64',
                        weight: '20%'
                    },
                ],
            }

        };

        function parseNumericValue(value) {
            if (value === null || value === undefined) {
                return null;
            }

            if (typeof value === 'number') {
                return Number.isFinite(value) ? value : null;
            }

            if (typeof value === 'string') {
                const trimmed = value.trim();
                if (!trimmed || trimmed.toLowerCase().includes('pull from')) {
                    return null;
                }

                const sanitized = trimmed
                    .replace(/₱/g, '')
                    .replace(/,/g, '')
                    .replace(/\s+/g, '');

                if (sanitized === '' || Number.isNaN(Number(sanitized))) {
                    return null;
                }

                return Number(sanitized);
            }

            return null;
        }

        function escapeAttributeValue(value) {
            if (value === null || value === undefined) {
                return '';
            }
            return String(value).replace(/"/g, '&quot;');
        }

        function formatPesoIfNeeded(value, force = false) {
            if (value === null || value === undefined) {
                return typeof value === 'string' ? value : '';
            }

            if (typeof value === 'string') {
                const trimmed = value.trim();
                if (!trimmed) {
                    return '';
                }

                const hasPesoMarker = trimmed.includes('₱') || trimmed.toLowerCase().includes('php');
                const hasAlphaOrPercent = /[a-zA-Z%/]/.test(trimmed);

                if (!force && hasPesoMarker) {
                    return trimmed;
                }

                if (!force && hasAlphaOrPercent) {
                    return trimmed;
                }
            }

            const numericValue = parseNumericValue(value);

            if (numericValue === null) {
                return typeof value === 'string' ? value : String(value);
            }

            const shouldFormat = force || Math.abs(numericValue) >= 1000;

            if (!shouldFormat) {
                if (typeof value === 'string') {
                    return value;
                }

                return numericValue.toLocaleString('en-US', {
                    minimumFractionDigits: numericValue % 1 === 0 ? 0 : 2,
                    maximumFractionDigits: 2
                });
            }

            const formattedNumber = numericValue.toLocaleString('en-PH', {
                minimumFractionDigits: numericValue % 1 === 0 ? 0 : 2,
                maximumFractionDigits: 2
            });

            return `₱${formattedNumber}`;
        }

        function formatMetricValueForDisplay(value) {
            if (value === null || value === undefined) {
                return 'N/A';
            }

            const numericValue = parseNumericValue(value);

            if (numericValue === null) {
                if (typeof value === 'string' && value.trim() !== '') {
                    return value;
                }
                return 'N/A';
            }

            if (Math.abs(numericValue) >= 1000) {
                return formatPesoIfNeeded(numericValue, true);
            }

            const formattedPercent = numericValue.toLocaleString('en-US', {
                minimumFractionDigits: numericValue % 1 === 0 ? 0 : 2,
                maximumFractionDigits: 2
            });

            return `${formattedPercent}%`;
        }

        function formatValueForDisplay(value, isPercentage = false) {
            // Check if value is currency (>= 1000) or just a number
            if (value >= 1000) {
                return formatPesoIfNeeded(value);
            } else {
                // For smaller numbers, format as number
                const formatted = value.toLocaleString('en-US', {
                    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
                    maximumFractionDigits: 2
                });
                // Add % sign if it's a percentage
                return isPercentage ? `${formatted}%` : formatted;
            }
        }
        // Role owners mapping for Technical Team
        const technicalTeamRoleOwners = {
            'Technical Team': {
                'I. Technical Adviser': 'MELVIN BONDOC',
                'II. Technical Team Leader': 'MARIA BABY KLYRE CATIBOG'
            }
        };

        // Role owners mapping for Accounting Team
        const accountingTeamRoleOwners = {
            'Accounting Team': {
                'I. Accounting Team Leader': 'MARCUS CHEN',
                'II. Accounting Integrator': 'SARAH JOHNSON'
            }
        };

        // Role owners mapping for LRAD Team
        const lradTeamRoleOwners = {
            'LRAD Team': {
                'I. Lotuszen Relations & Development Team Leader': 'JAMES PETERSON',
                'VIII. Lotuszen Development Integrator': 'ALEXANDRA MARTINEZ',
                'IX. Lotuszen Master Database Custodian': 'MICHAEL TAN'
            }
        };

        // Role owners mapping for Quality Team
        const qualityTeamRoleOwners = {
            'Quality Team': {
                'I. Quality Team Leader': 'EMILY RODRIGUEZ',
                'II. System Management Integrator': 'ROBERT CHANG',
                'IV. System Innovation Integrator': 'JENNIFER PARK'
            }
        };

        // Role owners mapping for DC Team
        const dcTeamRoleOwners = {
            'DC Team': {
                'I. Design & Construction Development Team Leader': 'DAVID PATTERSON',
                'II. DCD Integrator - Planning & Design': 'SOPHIA LEE',
                'III. DCD Integrator - Construction': 'JAMES WILSON'
            }
        };

        // Role owners mapping for Opportunity Team
        const opportunityTeamRoleOwners = {
            'Opportunity Team': {
                'I. Opportunity Team Leader': 'ROBERT THOMPSON',
                'II. Account Specialist Integrator - Commercial': 'NATALIE BROWN',
                'III. Account Specialist - Commercial': 'CHRIS ANDERSON',
                'V. Community Specialist Coordinator - Commercial': 'MELISSA TAYLOR',
                'VI. Community Specialist - Commercial': 'RYAN MARTINEZ',
                'VIII. Account Document Custodian': 'JESSICA WHITE'
            }
        };

        // Role owners mapping for IT Team
        const itTeamRoleOwners = {
            'IT Team': {
                'I. IT Team Leader': 'JENNIFER LEE',
                'II. IT Integrator': 'CHRISTOPHER BROWN'
            }
        };

        // Role owners mapping for Marcom Team
        const marcomTeamRoleOwners = {
            'Marcom Team': {
                'I. Marketing Communications Team Leader': 'AMANDA WHITE',
                'III. Marketing Specialist': 'DANIEL FOSTER'
            }
        };

        // Role owners mapping for Operations Team
        const operationsTeamRoleOwners = {
            'Operations Team': {
                'I. Building Admin. - Operations Team Leader': 'KEVIN MARTINEZ',
                'II. Building Admin. - Operations Integrator': 'OLIVIA NGUYEN',
                'III. Tenant Relations & Operations Coordinator': 'ROBERT KIM'
            }
        };

        // Role owners mapping for Audit Team
        const auditTeamRoleOwners = {
            'Audit Team': {
                'VI. iCARE Custodian': 'MICHAEL JOHNSON',
                'VI. PropMan Custodian': 'MICHAEL JOHNSON'
            }
        };

        // Role owners mapping for Gathering Team
        const gatheringTeamRoleOwners = {
            'Gathering Team': {
                'I. Gathering Team Leader': 'LISA ANDERSON',
                'III. Gathering Specialist': 'LISA ANDERSON'
            }
        };

        // New structure for Technical Team grouped by owner and KRA
        const technicalTeamByOwner = {
            'Technical Team': {
                'I. Technical Adviser': [
                    {
                        kra: '1. Provide Technical Advise and Guidance',
                        kpis: [
                            { kpi: '% On time & Accurate - Response', target: '100%', weight: '50%' },
                            { kpi: '% On time Completion - Projects (Special)', target: '100%', weight: '50%' }
                        ]
                    }
                ],
                'II. Technical Team Leader': [
                    {
                        kra: '1. Team Target & Performance',
                        kpis: [
                            { kpi: 'Score/Evaluation/NPS: Team Performance', target: '80%', weight: '4%' },
                            { kpi: 'Score/Evaluation/NPS: Team Members Performance', target: '80%', weight: '4%' },
                            { kpi: '% Score: Project/Work Orders', target: '85%', weight: '4%' },
                            { kpi: '# of Team\'s I.C.A.R.E (Audit Findings)', target: '0.00', weight: '3%' }
                        ]
                    },
                    {
                        kra: '2. Team Budget and Expenses Management',
                        kpis: [
                            { kpi: '% Within the Team\'s Budget', target: '5750000%', weight: '5%' },
                            { kpi: 'FS Target: Repairs & Maintenance (Labor) (TECHNICAL) Expense', target: '26,950.00', weight: '5%' },
                            { kpi: 'FS Target: Repairs & Maintenance (Materials) (TECHNICAL) Expense', target: 'Pull from GMPT', weight: '5%' }
                        ]
                    },
                    {
                        kra: '3. Project Planning and Management: Technical & Engineering',
                        kpis: [
                            { kpi: '% Planned vs Actual : Projects (Technical)', target: '100%', weight: '3%' },
                            { kpi: '% Planned vs Actual : Projects (Engineering)', target: '100%', weight: '3%' },
                            { kpi: '% Planned vs Actual : Projects (Special)', target: '100%', weight: '3%' },
                            { kpi: '% On time Completion : Projects (Technical)', target: '100%', weight: '3%' },
                            { kpi: '% On time Completion : Projects (Engineering)', target: '100%', weight: '3%' }
                        ]
                    },
                    {
                        kra: '4. Project Budget Management: Technical & Engineering',
                        kpis: [
                            { kpi: '% Within Budget : Projects (Technical)', target: '100%', weight: '7%' },
                            { kpi: '% Within Budget : Projects (Engineering)', target: '100%', weight: '7%' },
                            { kpi: '% Within Budget : Projects (Special)', target: '100%', weight: '6%' }
                        ]
                    },
                    {
                        kra: '5. Project Completed Performance & Evaluation: Technical & Engineering',
                        kpis: [
                            { kpi: 'Score/Evaluation/NPS: Projects (Technical)', target: '80%', weight: '5%' },
                            { kpi: 'Score/Evaluation/NPS: Projects (Engineering)', target: '80%', weight: '5%' },
                            { kpi: 'Score/Evaluation/NPS: Projects (Special)', target: '80%', weight: '5%' }
                        ]
                    },
                    {
                        kra: '6. Updated Site Facility Masterlist (SFML) (Site Asbuilts+Site EFML)',
                        kpis: [
                            { kpi: '% Accurate & Updated: SFML PT', target: '100%', weight: '10%' }
                        ]
                    }
                ]
            }
        };

        // New structure for Accounting Team grouped by owner and KRA
        const accountingTeamByOwner = {
            'Accounting Team': {
                'I. Accounting Team Leader': [
                    {
                        kra: '1. Team Target & Performance',
                        kpis: [
                            { kpi: 'Score/Evaluation/NPS : Team Performance', target: '80%', weight: '5%' },
                            { kpi: 'Score/Evaluation/NPS : Team Members Performance', target: '80%', weight: '5%' },
                            { kpi: '% Score : Project/Work Orders', target: '85%', weight: '5%' },
                            { kpi: '# of Team\'s I.C.A.R.E (Audit Findings)', target: '0.00', weight: '5%' }
                        ]
                    },
                    {
                        kra: '2. Team Budget and Expenses Management',
                        kpis: [
                            { kpi: '% Within the Team\'s Budget', target: '100%', weight: '20%' },
                            { kpi: 'FS Target : Total Operating Expense', target: '322,956,972.14', weight: '20%' },
                            { kpi: 'FS Target : Total Gross Revenue', target: '37,264,091.75', weight: '20%' },
                            { kpi: 'FS Target : Net Profit', target: '10,455,576.64', weight: '20%' }
                        ]
                    }
                ],
                'II. Accounting Integrator': [
                    {
                        kra: '3. Financial Collection & Management',
                        kpis: [
                            { kpi: '% Collection : All Sites', target: '90%', weight: '30%' },
                            { kpi: '% On time Payment Processing', target: '95%', weight: '25%' },
                            { kpi: '% Accurate Financial Reporting', target: '98%', weight: '25%' },
                            { kpi: '# of Financial Discrepancies Resolved', target: '100%', weight: '20%' }
                        ]
                    }
                ]
            }
        };

        // New structure for LRAD Team grouped by owner and KRA
        const lradTeamByOwner = {
            'LRAD Team': {
                'I. Lotuszen Relations & Development Team Leader': [
                    {
                        kra: '1. Team Budget and Expenses Management',
                        kpis: [
                            { kpi: '% Within the Team\'s Budget', target: '95%', weight: '30%' },
                            { kpi: 'FS Target : Salary Expense', target: '1,850,000.00', weight: '40%' },
                            { kpi: '% Budget Compliance', target: '98%', weight: '30%' }
                        ]
                    }
                ],
                'VIII. Lotuszen Development Integrator': [
                    {
                        kra: '2. Lotuszen Development & Planning',
                        kpis: [
                            { kpi: '% Planned vs Actual - Regular Events Plan: Lotuszen', target: '90%', weight: '35%' },
                            { kpi: '% Planned vs Actual - Culture Dev\'t Activities Plan: Lotuszen', target: '92%', weight: '35%' },
                            { kpi: '% Complete & Updated : LMDB', target: '95%', weight: '30%' }
                        ]
                    }
                ],
                'IX. Lotuszen Master Database Custodian': [
                    {
                        kra: '3. Database Management & Accuracy',
                        kpis: [
                            { kpi: '% On time & Accurate - LMDB', target: '96%', weight: '35%' },
                            { kpi: '% On time & Accurate - Recorded: Scores (KPI)', target: '94%', weight: '35%' },
                            { kpi: '% On time & Accurate - Recorded: Stories', target: '90%', weight: '30%' }
                        ]
                    }
                ]
            }
        };

        // New structure for Quality Team grouped by owner and KRA
        const qualityTeamByOwner = {
            'Quality Team': {
                'I. Quality Team Leader': [
                    {
                        kra: '1. Team Target & Performance',
                        kpis: [
                            { kpi: 'Score/Evaluation/NPS : Team Performance', target: '85%', weight: '5%' },
                            { kpi: 'Score/Evaluation/NPS : Team Members Performance', target: '82%', weight: '5%' },
                            { kpi: '% Score : Project/Work Orders', target: '88%', weight: '5%' },
                            { kpi: '# of Team\'s I.C.A.R.E (Audit Findings)', target: '92%', weight: '10%' }
                        ]
                    },
                    {
                        kra: '2. Team Budget and Expenses Management',
                        kpis: [
                            { kpi: '% Within the Team\'s Budget', target: '95%', weight: '25%' }
                        ]
                    },
                    {
                        kra: '3. LotusOS (RP+Lotuszen+PT+KDB [PM+F]) Development, Innovation, and Performance',
                        kpis: [
                            { kpi: 'Score/Evaluation/NPS : SMD Projects', target: '87%', weight: '20%' },
                            { kpi: 'Score/Evaluation/NPS : SID Projects', target: '84%', weight: '20%' },
                            { kpi: 'Score/Evaluation/NPS : LotusOS NPS', target: '86%', weight: '10%' }
                        ]
                    }
                ],
                'II. System Management Integrator': [
                    {
                        kra: '4. System Management & Planning',
                        kpis: [
                            { kpi: '% Planned vs Actual : SMD Projects', target: '90%', weight: '50%' },
                            { kpi: '% System Management Compliance', target: '92%', weight: '50%' }
                        ]
                    }
                ],
                'IV. System Innovation Integrator': [
                    {
                        kra: '5. System Innovation & Development',
                        kpis: [
                            { kpi: '% Planned vs Actual : SID Projects', target: '88%', weight: '50%' },
                            { kpi: '% Innovation Implementation Rate', target: '85%', weight: '50%' }
                        ]
                    }
                ]
            }
        };

        // New structure for DC Team grouped by owner and KRA
        const dcTeamByOwner = {
            'DC Team': {
                'I. Design & Construction Development Team Leader': [
                    {
                        kra: '1. Project Budget Management',
                        kpis: [
                            { kpi: '% Within Budget : Projects (E&D)', target: '92%', weight: '20%' },
                            { kpi: '% Within Budget : Projects (IP)', target: '89%', weight: '20%' },
                            { kpi: '% Within Budget : Projects (PMR)', target: '86%', weight: '20%' },
                            { kpi: '% Within Budget : Projects (Construction)', target: '90%', weight: '20%' },
                            { kpi: '% Within Budget : Projects (Landscape)', target: '87%', weight: '20%' }
                        ]
                    },
                    {
                        kra: '2. Team Budget and Expenses Management',
                        kpis: [
                            { kpi: 'FS Target : Repairs & Maintenance (Labor) (DCD) Expense', target: '145,000.00', weight: '50%' },
                            { kpi: 'FS Target : Repairs & Maintenance (Materials) (DCD) Expense', target: '100,000.00', weight: '50%' }
                        ]
                    }
                ],
                'II. DCD Integrator - Planning & Design': [
                    {
                        kra: '3. Project Planning & Design Management',
                        kpis: [
                            { kpi: '% Planned vs Actual : Projects (E&D)', target: '85%', weight: '20%' },
                            { kpi: '% Planned vs Actual : Projects (IP)', target: '83%', weight: '20%' },
                            { kpi: '% Planned vs Actual : Projects (PMR)', target: '81%', weight: '20%' },
                            { kpi: '% Planned vs Actual : Projects (Construction)', target: '84%', weight: '20%' },
                            { kpi: '% Planned vs Actual : Projects (Landscape)', target: '82%', weight: '20%' }
                        ]
                    }
                ],
                'III. DCD Integrator - Construction': [
                    {
                        kra: '4. Construction & Job Order Management',
                        kpis: [
                            { kpi: '% Planned vs Actual : JO (MST)', target: '88%', weight: '50%' },
                            { kpi: '% Planned vs Actual : JO (E&D Fab)', target: '86%', weight: '50%' }
                        ]
                    }
                ]
            }
        };

        // New structure for Opportunity Team grouped by owner and KRA
        const opportunityTeamByOwner = {
            'Opportunity Team': {
                'I. Opportunity Team Leader': [
                    {
                        kra: '1. Commercial Occupancy & Revenue Management',
                        kpis: [
                            { kpi: '% Occupancy: Commercial (Units)', target: '87%', weight: '25%' },
                            { kpi: '% Occupancy: Commercial (Area)', target: '85%', weight: '25%' },
                            { kpi: '% Occupancy: Commercial (PValue)', target: '82%', weight: '25%' },
                            { kpi: 'FS Target : Rental Income', target: '12,500,000.00', weight: '25%' }
                        ]
                    }
                ],
                'II. Account Specialist Integrator - Commercial': [
                    {
                        kra: '2. Tenant Mix & Planning',
                        kpis: [
                            { kpi: '% Planned vs Actual - Tenant Mix Plan', target: '90%', weight: '100%' }
                        ]
                    }
                ],
                'III. Account Specialist - Commercial': [
                    {
                        kra: '3. Commercial Inquiry Management',
                        kpis: [
                            { kpi: '# of Closed Inquiry/Offline Inquiries Received: Commercial', target: '45', weight: '100%' }
                        ]
                    }
                ],
                'V. Community Specialist Coordinator - Commercial': [
                    {
                        kra: '4. Anchor Tenant Management',
                        kpis: [
                            { kpi: '# of Closed Prospects/Target Prospects: (Commercial) Anchor', target: '8', weight: '50%' },
                            { kpi: '# of Closed Prospects/Priority Vacant Spaces: Anchor', target: '5', weight: '50%' }
                        ]
                    }
                ],
                'VI. Community Specialist - Commercial': [
                    {
                        kra: '5. Regular Tenant Management',
                        kpis: [
                            { kpi: '# of Closed Prospects/Target Prospects: (Commercial) Regular', target: '15', weight: '50%' },
                            { kpi: '# of Closed Prospects/Priority Vacant Spaces: Regular', target: '12', weight: '50%' }
                        ]
                    }
                ],
                'VIII. Account Document Custodian': [
                    {
                        kra: '6. Document & Tenant Retention Management',
                        kpis: [
                            { kpi: '% Complete & Updated: Tenant Requirements', target: '95%', weight: '50%' },
                            { kpi: '% Pull Out - Aversion', target: '88%', weight: '50%' }
                        ]
                    }
                ]
            }
        };

        // New structure for IT Team grouped by owner and KRA
        const itTeamByOwner = {
            'IT Team': {
                'I. IT Team Leader': [
                    {
                        kra: '1. IT Infrastructure & System Management',
                        kpis: [
                            { kpi: '% System Uptime', target: '99.5%', weight: '30%' },
                            { kpi: '% Network Availability', target: '98%', weight: '25%' },
                            { kpi: '% Security Compliance', target: '100%', weight: '25%' },
                            { kpi: '% On time System Maintenance', target: '95%', weight: '20%' }
                        ]
                    }
                ],
                'II. IT Integrator': [
                    {
                        kra: '2. IT Operations & Incident Management',
                        kpis: [
                            { kpi: '# of Breakdowns : IT', target: '8', weight: '40%' },
                            { kpi: '% Incident Resolution Time', target: '92%', weight: '30%' },
                            { kpi: '% System Performance Compliance', target: '95%', weight: '30%' }
                        ]
                    }
                ]
            }
        };

        // New structure for Marcom Team grouped by owner and KRA
        const marcomTeamByOwner = {
            'Marcom Team': {
                'I. Marketing Communications Team Leader': [
                    {
                        kra: '1. Team Budget and Expenses Management',
                        kpis: [
                            { kpi: '% Within the Team\'s Budget', target: '95%', weight: '25%' },
                            { kpi: 'FS Target : Marketing Expense (+Gifts & Decor) (MARCOM)', target: '150,000.00', weight: '30%' },
                            { kpi: '% Budget Compliance', target: '98%', weight: '20%' },
                            { kpi: '% Cost per Campaign', target: '85%', weight: '25%' }
                        ]
                    },
                    {
                        kra: '2. Marketing Campaign Performance',
                        kpis: [
                            { kpi: '% Increase : Facebook Page Reach (per Month per Page)', target: '15%', weight: '20%' },
                            { kpi: '% Increase : Facebook Page Followers (per Month per Page)', target: '12%', weight: '20%' },
                            { kpi: '% Campaign Engagement Rate', target: '8%', weight: '20%' },
                            { kpi: '% Conversion Rate : Marketing Campaigns', target: '5%', weight: '20%' },
                            { kpi: '# of Qualified Leads Generated', target: '150', weight: '20%' }
                        ]
                    }
                ],
                'III. Marketing Specialist': [
                    {
                        kra: '3. Lead Generation & Inquiry Management',
                        kpis: [
                            { kpi: '# of Inquiries : Offline for (Commercial Spaces)', target: '45', weight: '30%' },
                            { kpi: '# of Inquiries : Offline for Gatherings (Event Venues)', target: '35', weight: '30%' },
                            { kpi: '# of Inquiries : Offline for Gatherings (Sports Arena)', target: '25', weight: '25%' },
                            { kpi: '% Inquiry Response Time', target: '95%', weight: '15%' }
                        ]
                    }
                ]
            }
        };

        // New structure for Operations Team grouped by owner and KRA
        const operationsTeamByOwner = {
            'Operations Team': {
                'I. Building Admin. - Operations Team Leader': [
                    {
                        kra: '1. Team Budget and Expenses Management',
                        kpis: [
                            { kpi: '% Within the Team\'s Budget', target: '95%', weight: '20%' },
                            { kpi: 'FS Target : Electricity Expense', target: '85,000.00', weight: '20%' },
                            { kpi: 'FS Target : Water Expense', target: '25,000.00', weight: '15%' },
                            { kpi: 'FS Target : Security Expense', target: '120,000.00', weight: '20%' },
                            { kpi: 'FS Target : Agency Expense', target: '45,000.00', weight: '15%' },
                            { kpi: 'FS Target : Parking Income', target: '180,000.00', weight: '10%' }
                        ]
                    },
                    {
                        kra: '2. Facility Operations & Maintenance',
                        kpis: [
                            { kpi: '% Facility Uptime', target: '98%', weight: '25%' },
                            { kpi: '% Maintenance Completion Rate', target: '95%', weight: '25%' },
                            { kpi: '% Energy Efficiency', target: '90%', weight: '20%' },
                            { kpi: '# of Facility Issues Resolved', target: '50', weight: '15%' },
                            { kpi: '% Vendor Performance Compliance', target: '92%', weight: '15%' }
                        ]
                    }
                ],
                'II. Building Admin. - Operations Integrator': [
                    {
                        kra: '3. Quality & Compliance Management',
                        kpis: [
                            { kpi: '% Addressed : Team/Section\'s I.C.A.R.E', target: '100%', weight: '30%' },
                            { kpi: '% Score : Site Quality (by Auditor)', target: '90%', weight: '30%' },
                            { kpi: '% Insurance Claimed vs Reported', target: '95%', weight: '25%' },
                            { kpi: '% Compliance : Safety Standards', target: '98%', weight: '15%' }
                        ]
                    }
                ],
                'III. Tenant Relations & Operations Coordinator': [
                    {
                        kra: '4. Tenant Relations & Onboarding',
                        kpis: [
                            { kpi: '% Onboarded Tenants : All Tenants/Reserved (New + Existing)', target: '100%', weight: '40%' },
                            { kpi: '% Tenant Satisfaction Score', target: '85%', weight: '30%' },
                            { kpi: '% On time Tenant Services Delivery', target: '95%', weight: '30%' }
                        ]
                    }
                ]
            }
        };

        // New structure for Audit Team grouped by owner and KRA
        const auditTeamByOwner = {
            'Audit Team': {
                'VI. iCARE Custodian': [
                    {
                        kra: '1. I.C.A.R.E Compliance & Management',
                        kpis: [
                            { kpi: '% Addressed : I.C.A.R.E (All Teams)', target: '100%', weight: '100%' }
                        ]
                    }
                ],
                'VI. PropMan Custodian': [
                    {
                        kra: '2. PropMan Module Management',
                        kpis: [
                            { kpi: '% On time & Accurate : PropMan Module', target: '95%', weight: '100%' }
                        ]
                    }
                ]
            }
        };

        // New structure for Gathering Team grouped by owner and KRA
        const gatheringTeamByOwner = {
            'Gathering Team': {
                'I. Gathering Team Leader': [
                    {
                        kra: '1. Venue Occupancy & Performance',
                        kpis: [
                            { kpi: '% Occupancy: Venue (Hours)', target: '75%', weight: '20%' },
                            { kpi: '% Occupancy: Venue (PValue)', target: '72%', weight: '20%' },
                            { kpi: '% Occupancy: Studio (Hours)', target: '68%', weight: '15%' },
                            { kpi: '% Occupancy: Studio (PValue)', target: '65%', weight: '15%' },
                            { kpi: '% Occupancy: Sports Arena (Hours)', target: '80%', weight: '15%' },
                            { kpi: '% Occupancy: Sports Arena (PValue)', target: '77%', weight: '15%' }
                        ]
                    },
                    {
                        kra: '2. Event Management & Traffic',
                        kpis: [
                            { kpi: '# of Average Daily Foot Traffic', target: '450', weight: '30%' },
                            { kpi: '# of 500 pax or more Event/month (All Sites)', target: '8', weight: '35%' },
                            { kpi: '# of Closed Inquiry/Offline Inquiries Received: Gathering', target: '35', weight: '35%' }
                        ]
                    },
                    {
                        kra: '3. Budget & Expense Management',
                        kpis: [
                            { kpi: 'FS Target : Marketing Expense (+Gifts & Decor) (GATHERING)', target: '650,000.00', weight: '100%' }
                        ]
                    }
                ]
            }
        };

        const teamOperationsData = {
            'Technical Team': [
                { role: 'FS Target : Repairs & Maintenance (Labor) (TECHNICAL) Expense', owner: 'II. Technical Team Leader', kra: '-' },
                { role: 'FS Target : Repairs & Maintenance (Materials) (TECHNICAL) Expense', owner: 'II. Technical Team Leader', kra: '-' }
            ],
            'Accounting Team': [
                { role: 'FS Target : Total Operating Expense', owner: 'I. Accounting Team Leader', kra: '-' },
                { role: 'FS Target : Total Gross Revenue', owner: 'I. Accounting Team Leader', kra: '-' },
                { role: 'FS Target : Net Profit', owner: 'I. Accounting Team Leader', kra: '-' },
                { role: '% Collection : All Sites', owner: 'II. Accounting Integrator', kra: '-' }
            ],
            'LRAD Team': [
                { role: 'FS Target : Salary Expense', owner: 'I. Lotuszen Relations & Development Team Leader', kra: '-' }
            ],
            'Quality Team': [],
            'DC Team': [
                { role: 'FS Target : Repairs & Maintenance (Labor) (DCD) Expense', owner: 'I. Design & Construction Development Team Leader', kra: '-' },
                { role: 'FS Target : Repairs & Maintenance (Materials) (DCD) Expense', owner: 'I. Design & Construction Development Team Leader', kra: '-' }
            ],
            'IT Team': [],
            'Opportunity Team': [
                { role: '% Occupancy: Commercial (Units)', owner: 'I. Opportunity Team Leader', kra: '-' },
                { role: '% Occupancy: Commercial (Area)', owner: 'I. Opportunity Team Leader', kra: '-' },
                { role: '% Occupancy: Commercial (PValue)', owner: 'I. Opportunity Team Leader', kra: '-' },
                { role: 'FS Target : Rental Income', owner: 'I. Opportunity Team Leader', kra: '-' }
            ],
            'Marcom Team': [
                { role: 'FS Target : Marketing Expense (+Gifts & Decor) (MARCOM)', owner: 'I. Marketing Communications Team Leader', kra: '-' }
            ],
            'Audit Team': [],
            'Gathering Team': [
                { role: '% Occupancy: Venue (Hours)', owner: 'I. Gathering Team Leader', kra: '-' },
                { role: '% Occupancy: Venue (PValue)', owner: 'I. Gathering Team Leader', kra: '-' },
                { role: '% Occupancy: Studio (Hours)', owner: 'I. Gathering Team Leader', kra: '-' },
                { role: '% Occupancy: Studio (PValue)', owner: 'I. Gathering Team Leader', kra: '-' },
                { role: '% Occupancy: Sports Arena (Hours)', owner: 'I. Gathering Team Leader', kra: '-' },
                { role: '% Occupancy: Sports Arena (PValue)', owner: 'I. Gathering Team Leader', kra: '-' },
                { role: 'FS Target : Marketing Expense (+Gifts & Decor) (GATHERING)', owner: 'I. Gathering Team Leader', kra: '-' }
            ],
            'Operations Team': [
                { role: 'FS Target : Electricity Expense', owner: 'I. Building Admin. - Operations Team Leader', kra: '-' },
                { role: 'FS Target : Water Expense', owner: 'I. Building Admin. - Operations Team Leader', kra: '-' },
                { role: 'FS Target : Security Expense', owner: 'I. Building Admin. - Operations Team Leader', kra: '-' },
                { role: 'FS Target : Agency Expense', owner: 'I. Building Admin. - Operations Team Leader', kra: '-' },
                { role: 'FS Target : Parking Income', owner: 'I. Building Admin. - Operations Team Leader', kra: '-' }
            ]
        };

        // Team members data will be fetched from Google Sheets
        let teamMembersData = {};
        let teamMembersDataPromise = null;

        // Google Sheets fetch function for team members data
        async function fetchTeamMembersData() {
            if (teamMembersDataPromise) {
                return teamMembersDataPromise;
            }
            
            teamMembersDataPromise = (async () => {
                try {
                    // Use the same URL pattern as lag-lead-script.js
                    // TODO: Replace with your actual Google Apps Script URL for team members data
                    const url = 'https://script.google.com/macros/s/AKfycbxs05sSpRPjnxI_NBi3XN-wycjM4hEtHhsKDm98ryPTRG-YGZjNLV4rzeE_t2CNgzMm/exec';
                    console.log('Fetching team members data from:', url);
                
                    const res = await fetch(url);
                    console.log('Team members response status:', res.status);
                
                    const text = await res.text();
                    console.log('Team members raw response:', text);
                
                    const payload = JSON.parse(text);
                    console.log('Parsed team members payload:', payload);
                
                    // Transform the payload into the expected format
                    // Expected format: { 'Team Name': [{ name, role, kpi, targetValue, targetLabel, actualValue, actualLabel, monthlyData: { target: [], actual: [] } }] }
                    const transformedData = {};
                    
                    if (payload && typeof payload === 'object') {
                        // If payload has teamMembers property
                        if (payload.teamMembers) {
                            Object.keys(payload.teamMembers).forEach(teamName => {
                                transformedData[teamName] = payload.teamMembers[teamName];
                            });
                        } else {
                            // If payload is already in the correct format
                            transformedData = payload;
                        }
                    }
                
                    teamMembersData = transformedData;
                    return transformedData;
                } catch (error) {
                    console.error('Error fetching team members data:', error);
                    return {};
                }
            })();
            
            return teamMembersDataPromise;
        }

        const leadKpiData = {
            'Technical Team': [
                { role: '# of Breakdowns : Engineering Department', owner: 'III. Engineering Integrator - Actual', kra: '-' },
                { role: '% Predictive Maintenance Compliance', owner: 'III. Engineering Integrator - Actual', kra: '-' },
                { role: '% Emergency Response Within SLA', owner: 'III. Engineering Integrator - Actual', kra: '-' }
            ],
            'LRAD Team': [
                { role: '% On time & Accurate - LMDB', owner: 'IX. Lotuszen Master Database Custodian', kra: '-' },
                { role: '% On time & Accurate - Recorded: Scores (KPI)', owner: 'IX. Lotuszen Master Database Custodian', kra: '-' },
                { role: '% On time & Accurate - Recorded: Stories', owner: 'IX. Lotuszen Master Database Custodian', kra: '-' },
                { role: '% Planned vs Actual - Regular Events Plan: Lotuszen', owner: 'VIII. Lotuszen Development Integrator', kra: '-' },
                { role: '% Planned vs Actual - Culture Dev\'t Activities Plan: Lotuszen', owner: 'VIII. Lotuszen Development Integrator', kra: '-' },
                { role: '% Complete & Updated : LMDB', owner: 'VIII. Lotuszen Development Integrator', kra: '-' }
            ],
            'Quality Team': [
                { role: 'Score/Evaluation/NPS : SMD Projects', owner: 'I. Quality Team Leader', kra: '-' },
                { role: 'Score/Evaluation/NPS : SID Projects', owner: 'I. Quality Team Leader', kra: '-' },
                { role: '% Planned vs Actual : SMD Projects', owner: 'II. System Management Integrator', kra: '-' },
                { role: '% Planned vs Actual : SID Projects', owner: 'IV. System Innovation Integrator', kra: '-' }
                ],
            'DC Team': [
                { role: '% Within Budget : Projects (E&D)', owner: 'I. Design & Construction Development Team Leader', kra: '-' },
                { role: '% Within Budget : Projects (IP)', owner: 'I. Design & Construction Development Team Leader', kra: '-' },
                { role: '% Within Budget : Projects (PMR)', owner: 'I. Design & Construction Development Team Leader', kra: '-' },
                { role: '% Within Budget : Projects (Construction)', owner: 'I. Design & Construction Development Team Leader', kra: '-' },
                { role: '% Within Budget : Projects (Landscape)', owner: 'I. Design & Construction Development Team Leader', kra: '-' },
                { role: '% Planned vs Actual : Projects (E&D)', owner: 'II. DCD Integrator - Planning & Design', kra: '-' },
                { role: '% Planned vs Actual : Projects (IP)', owner: 'II. DCD Integrator - Planning & Design', kra: '-' },
                { role: '% Planned vs Actual : Projects (PMR)', owner: 'II. DCD Integrator - Planning & Design', kra: '-' },
                { role: '% Planned vs Actual : Projects (Construction)', owner: 'II. DCD Integrator - Planning & Design', kra: '-' },
                { role: '% Planned vs Actual : Projects (Landscape)', owner: 'II. DCD Integrator - Planning & Design', kra: '-' },
                { role: '% Planned vs Actual : JO (MST)', owner: 'III. DCD Integrator - Construction', kra: '-' },
                { role: '% Planned vs Actual : JO (E&D Fab)', owner: 'III. DCD Integrator - Construction', kra: '-' }
            ],
            'IT Team': [
                { role: '# of Breakdowns : IT', owner: 'II. IT Integrator', kra: '-' }
            ],
            'Opportunity Team': [
                { role: '% Planned vs Actual - Tenant Mix Plan', owner: 'II. Account Specialist Integrator - Commercial', kra: '-' },
                { role: '# of Closed Inquiry/Offline Inquiries Received: Commercial', owner: 'III. Account Specialist - Commercial', kra: '-' },
                { role: '# of Closed Prospects/Target Prospects: (Commercial) Anchor', owner: 'V. Community Specialist Coordinator - Commercial', kra: '-' },
                { role: '# of Closed Prospects/Priority Vacant Spaces: Anchor', owner: 'V. Community Specialist Coordinator - Commercial', kra: '-' },
                { role: '# of Closed Prospects/Target Prospects: (Commercial) Regular', owner: 'VI. Community Specialist - Commercial', kra: '-' },
                { role: '# of Closed Prospects/Priority Vacant Spaces: Regular', owner: 'VI. Community Specialist - Commercial', kra: '-' },
                { role: '% Complete & Updated: Tenant Requirements', owner: 'VIII. Account Document Custodian', kra: '-' },
                { role: '% Pull Out - Aversion', owner: 'VIII. Account Document Custodian', kra: '-' }
            ],
            'Marcom Team': [
                { role: '% Increase : Facebook Page Reach (per Month per Page)', owner: 'I. Marketing Communications Team Leader', kra: '-' },
                { role: '% Increase : Facebook Page Followers (per Month per Page)', owner: 'I. Marketing Communications Team Leader', kra: '-' },
                { role: '# of Inquiries : Offline for (Commercial Spaces)', owner: 'III. Marketing Specialist', kra: '-' },
                { role: '# of Inquiries : Offline for Gatherings (Event Venues)', owner: 'III. Marketing Specialist', kra: '-' },
                { role: '# of Inquiries : Offline for Gatherings (Sports Arena)', owner: 'III. Marketing Specialist', kra: '-' },
                { role: '# of Inquiries : Offline for Gatherings (Handaan)', owner: 'III. Marketing Specialist', kra: '-' },
                { role: '# of Inquiries : Offline for Gatherings (SS)', owner: 'III. Marketing Specialist', kra: '-' },
                { role: '# of Inquiries : Offline for Gatherings (KS)', owner: 'III. Marketing Specialist', kra: '-' },
                { role: '# of Inquiries : Offline for Gatherings (Studio)', owner: 'III. Marketing Specialist', kra: '-' }
            ],
            'Audit Team': [
                { role: '% Addressed : I.C.A.R.E (All Teams)', owner: 'VI. iCARE Custodian', kra: '-' },
                { role: '% On time & Accurate : PropMan Module', owner: 'VI. PropMan Custodian', kra: '-' }
            ],
            'Gathering Team': [
                { role: '# of Average Daily Foot Traffic', owner: 'I. Gathering Team Leader', kra: '-' },
                { role: '# of 500 pax or more Event/month (All Sites)', owner: 'I. Gathering Team Leader', kra: '-' },
                { role: '# of Closed Inquiry/Offline Inquiries Received: Gathering', owner: 'III. Gathering Specialist', kra: '-' }
            ],
            'Operations Team': [
                { role: '% Addressed : Team/Section\'s I.C.A.R.E', owner: 'II. Building Admin. - Operations Integrator', kra: '-' },
                { role: '% Score : Site Quality (by Auditor)', owner: 'II. Building Admin. - Operations Integrator', kra: '-' },
                { role: '% Insurance Claimed vs Reported', owner: 'II. Building Admin. - Operations Integrator', kra: '-' },
                { role: '% Onboarded Tenants : All Tenants/Reserved (New + Existing)', owner: 'III. Tenant Relations & Operations Coordinator', kra: '-' }
            ]
        };

        // Technical expenses data by period (year-month) - Lag KPIs
        const DEFAULT_PERIOD_KEY = '2025-11';
        const chartMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Google Sheets fetch function for lag KPI data
        let lagKpiDataPromise = null;

        async function fetchLagKpiData() {
            if (lagKpiDataPromise) {
                return lagKpiDataPromise;
            }
            
            lagKpiDataPromise = (async () => {
                try {
                    const url = 'https://script.google.com/macros/s/AKfycbxs05sSpRPjnxI_NBi3XN-wycjM4hEtHhsKDm98ryPTRG-YGZjNLV4rzeE_t2CNgzMm/exec';                    console.log('Fetching lag KPI data from:', url);
                
                    const res = await fetch(url);
                    console.log('Lag KPI response status:', res.status);
                
                    const text = await res.text();
                    console.log('Lag KPI raw response:', text);
                
                    const payload = JSON.parse(text);
                    console.log('Parsed lag KPI payload:', payload);
                
                    return payload ?? {};
                } catch (error) {
                    console.error('Error fetching lag KPI data:', error);
                    return {};
                }
            })();
            
            return lagKpiDataPromise;
        }

        // Google Sheets fetch function for lead KPI data
        let leadKpiDataPromise = null;

        async function fetchLeadKpiData() {
            if (leadKpiDataPromise) {
                return leadKpiDataPromise;
            }
            
            leadKpiDataPromise = (async () => {
                try {
                    // TODO: Replace with your actual Google Apps Script URL for lead KPI data
                    // Can use the same URL as lag KPIs if they're in the same sheet, or a different one
                    const url = 'https://script.google.com/macros/s/AKfycbxs05sSpRPjnxI_NBi3XN-wycjM4hEtHhsKDm98ryPTRG-YGZjNLV4rzeE_t2CNgzMm/exec';
                    console.log('Fetching lead KPI data from:', url);
                
                    const res = await fetch(url);
                    console.log('Lead KPI response status:', res.status);
                
                    const text = await res.text();
                    console.log('Lead KPI raw response:', text);
                
                    const payload = JSON.parse(text);
                    console.log('Parsed lead KPI payload:', payload);
                
                    return payload ?? {};
                } catch (error) {
                    console.error('Error fetching lead KPI data:', error);
                    return {};
                }
            })();
            
            return leadKpiDataPromise;
        }

        // Helper function to extract numeric values from Google Sheets data
        function extractNumericValues(data) {
            if (!Array.isArray(data)) {
                return [];
            }
            return data.map(item => {
                if (typeof item === 'number') {
                    return Number.isFinite(item) ? item : 0;
                }
                if (typeof item === 'string') {
                    const cleaned = item.replace(/[^\d.-]/g, '');
                    const parsed = Number(cleaned);
                    return Number.isFinite(parsed) ? parsed : 0;
                }
                return 0;
            });
        }

        // Chart structure functions (from lag-lead-script.js pattern)
        const formatMillionsLabel = (value) => {
            const numeric = Number(value);
            if (Number.isNaN(numeric)) {
                return 'P0.00';
            }
            const actualValue = numeric * 1000000;
            return `P${actualValue.toLocaleString('en-PH', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        };

        const formatThousandsLabel = (value) => {
            const numeric = Number(value);
            if (Number.isNaN(numeric)) {
                return 'P0.00';
            }
            const actualValue = numeric * 1000;
            return `P${actualValue.toLocaleString('en-PH', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        };

        const formatPercentageLabel = (value) => {
            const numeric = Number(value);
            if (Number.isNaN(numeric)) {
                return '0%';
            }
            return `${numeric.toFixed(1)}%`;
        };

        function resolveDataLabelColor(color, index) {
            if (typeof color === 'function') {
                return color(index);
            }
            return color || '#525552';
        }

        function createBarDataLabelsPlugin(pluginId) {
            return {
                id: pluginId,
                afterDatasetsDraw: (chart) => {
                    const { ctx, data, chartArea } = chart;
                    ctx.save();

                    data.datasets.forEach((dataset, datasetIndex) => {
                        if (dataset.type !== 'bar' || !dataset.data) {
                            return;
                        }

                        const meta = chart.getDatasetMeta(datasetIndex);
                        meta.data.forEach((point, index) => {
                            if (point.skip) {
                                return;
                            }

                            const data = dataset.data[index];
                            if (data === null || data === undefined) {
                                return;
                            }

                            const customFormatter = dataset.dataLabelFormatter;
                            let label;
                            if (typeof customFormatter === 'function') {
                                label = customFormatter(data, index, dataset);
                            } else if (dataset.valueType === 'percentage') {
                                label = formatPercentageLabel(data);
                            } else if (dataset.valueType === 'thousands') {
                                label = formatThousandsLabel(data);
                            } else {
                                label = formatMillionsLabel(data);
                            }
                            
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
        }

        function createStandardBarOptions(
            yAxisTitle,
            {
                valueFormatter = formatMillionsLabel,
                zeroLabel = 'P0.00',
                axisBounds = { min: 0, max: 100 },
                beginAtZero = true
            } = {}
        ) {
            const { min, max } = axisBounds || {};
            return {
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
                                return `${context.dataset.label}: ${valueFormatter(value)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero,
                        ...(typeof min === 'number' ? { min } : {}),
                        ...(typeof max === 'number' ? { max } : {}),
                        grid: {
                            color: '#f5f5f5',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#525552',
                            font: { size: 11 },
                            callback: function(value) {
                                if (value === 0 || value === '0') {
                                    return zeroLabel;
                                }
                                return valueFormatter(value);
                            }
                        },
                        title: {
                            display: false,
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
            };
        }

        function createComparisonBarDataset({
            label,
            data = [],
            order = 1,
            backgroundColor = 'rgba(150, 168, 64, 0.85)',
            hoverBackgroundColor = 'rgba(150, 168, 64, 0.95)',
            borderColor = 'rgba(150, 168, 64, 1)',
            borderRadius = 8,
            dataLabelColor = '#525552'
        }) {
            return {
                label,
                type: 'bar',
                order,
                data: [...data],
                backgroundColor,
                borderColor,
                hoverBackgroundColor,
                borderWidth: 0,
                borderRadius,
                dataLabelColor
            };
        }

        function createTargetLineDataset({
            label = 'Current Year Target',
            data = [],
            dataLabelColor = '#586740',
            dataLabelOffset = 12,
            tension = 0,
            stepped = 'middle',
            lineColor = 'rgba(88, 103, 64, 1)',
            fillColor = 'rgba(88, 103, 64, 0.18)',
            showFill = true
        }) {
            return {
                label,
                type: 'line',
                order: 3,
                data: [...data],
                borderColor: lineColor,
                backgroundColor: fillColor,
                borderWidth: 2.5,
                pointBackgroundColor: lineColor,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 5,
                tension,
                stepped,
                fill: showFill ? 'origin' : false,
                dataLabelColor,
                dataLabelOffset
            };
        }

        function createComparisonChartStructures({
            labels = MONTH_LABELS,
            yAxisTitle,
            barPluginId,
            currentLabel = 'Year 2025',
            previousLabel = 'Year 2024',
            targetLabel = 'Current Year Target',
            currentDataset = [],
            previousDataset = [],
            targetDataset = [],
            includeTarget = true,
            includeBarLabels = true,
            valueFormatter = formatMillionsLabel,
            zeroLabel = 'P0.00',
            axisBounds = { min: 0, max: 100 },
            beginAtZero = true,
            valueType = 'thousands'
        }) {
            const data = {
                labels: [...labels],
                datasets: [
                    createComparisonBarDataset({
                        label: currentLabel,
                        order: 1,
                        data: currentDataset,
                        dataLabelColor: '#96a840',
                        backgroundColor: 'rgba(150, 168, 64, 0.85)',
                        hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                        borderColor: 'rgba(150, 168, 64, 1)'
                    }),
                    createComparisonBarDataset({
                        label: previousLabel,
                        order: 2,
                        data: previousDataset,
                        dataLabelColor: '#e5bb22',
                        backgroundColor: 'rgba(229, 187, 34, 0.85)',
                        hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                        borderColor: 'rgba(229, 187, 34, 1)'
                    })
                ]
            };

            // Add valueType to datasets for formatting
            data.datasets.forEach(dataset => {
                dataset.valueType = valueType;
            });

            if (includeTarget) {
                const initialTargetData = Array.isArray(targetDataset) && targetDataset.length
                    ? [...targetDataset]
                    : Array(labels.length).fill(null);

                data.datasets.push(createTargetLineDataset({
                    label: targetLabel,
                    data: initialTargetData
                }));
            }

            const plugins = [];
            if (includeBarLabels) {
                plugins.push(createBarDataLabelsPlugin(barPluginId));
            }

            const config = {
                type: 'bar',
                data,
                options: createStandardBarOptions(yAxisTitle, {
                    valueFormatter,
                    zeroLabel,
                    axisBounds,
                    beginAtZero
                }),
                plugins
            };

            return { data, config };
        }

        function randomIntInRange(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function randomFloatInRange(min, max, decimals = 1) {
            const factor = 10 ** decimals;
            return Math.round((Math.random() * (max - min) + min) * factor) / factor;
        }

        // Removed: generateTechnicalLagKpiData - now fetched from Google Sheets

        // Removed: generateTechnicalLeadKpiData - now fetched from Google Sheets

        // Removed: generateAccountingLagKpiData - now fetched from Google Sheets

        // Removed: generateLradLagKpiData - now fetched from Google Sheets

        // Removed: generateDcLagKpiData - now fetched from Google Sheets

        // Removed: generateOpportunityLagKpiData - now fetched from Google Sheets

        // Removed: generateMarcomLagKpiData - now fetched from Google Sheets

        // Removed: generateGatheringLagKpiData - now fetched from Google Sheets

        // Removed: generateOperationsLagKpiData - now fetched from Google Sheets

        // Removed: generateOperationsLagKpiData - now fetched from Google Sheets

        // Removed: generateLradLeadKpiData - now fetched from Google Sheets

        // Removed: generateQualityLeadKpiData - now fetched from Google Sheets

        // Removed: generateDcLeadKpiData - now fetched from Google Sheets

        // Removed: generateItLeadKpiData - now fetched from Google Sheets

        // Removed: generateOpportunityLeadKpiData - now fetched from Google Sheets

        // Removed: generateMarcomLeadKpiData - now fetched from Google Sheets

        // Removed: generateAuditLeadKpiData - now fetched from Google Sheets

        // Removed: generateGatheringLeadKpiData - now fetched from Google Sheets
        // Removed: generateOperationsLeadKpiData - now fetched from Google Sheets

        // Function to create monthly series from Google Sheets data
        async function createMonthlySeriesFromSheets(kpiName, teamName = null, isLeadKpi = false) {
            try {
                // Use appropriate fetch function based on KPI type
                const payload = isLeadKpi ? await fetchLeadKpiData() : await fetchLagKpiData();
                const labels = [...chartMonths];
                
                // Determine value type based on KPI name
                const isPercentage = /%|percent/i.test(kpiName);
                const isCount = /#|number|count/i.test(kpiName);
                const valueType = isPercentage ? 'percentage' : (isCount ? 'count' : 'thousands');
                const decimals = isPercentage ? 1 : 0;
                
                // Try to get data from payload
                let targetData = [];
                let actualData = [];
                let previousData = [];
                
                // Try team-specific path first
                if (teamName && payload[teamName]?.[kpiName]) {
                    const kpiData = payload[teamName][kpiName];
                    targetData = extractNumericValues(kpiData.target || []);
                    actualData = extractNumericValues(kpiData.actual || []);
                    previousData = extractNumericValues(kpiData.previous || []);
                } else if (payload[kpiName]) {
                    // Try direct KPI path
                    const kpiData = payload[kpiName];
                    targetData = extractNumericValues(kpiData.target || []);
                    actualData = extractNumericValues(kpiData.actual || []);
                    previousData = extractNumericValues(kpiData.previous || []);
                }
                
                // Ensure we have 12 months of data
                while (targetData.length < 12) targetData.push(0);
                while (actualData.length < 12) actualData.push(0);
                while (previousData.length < 12) previousData.push(0);
                
                // Trim to 12 months
                targetData = targetData.slice(0, 12);
                actualData = actualData.slice(0, 12);
                previousData = previousData.slice(0, 12);
                
                const totalTarget = Number(targetData.reduce((sum, value) => sum + value, 0).toFixed(decimals));
                const totalActual = Number(actualData.reduce((sum, value) => sum + value, 0).toFixed(decimals));
                
                return {
                    labels,
                    target: targetData,
                    actual: actualData,
                    previous: previousData,
                    totalTarget,
                    totalActual,
                    valueType
                };
            } catch (error) {
                console.error(`Error creating monthly series for ${kpiName}:`, error);
                // Return empty series on error
                return {
                    labels: [...chartMonths],
                    target: Array(12).fill(0),
                    actual: Array(12).fill(0),
                    previous: Array(12).fill(0),
                    totalTarget: 0,
                    totalActual: 0,
                    valueType: 'thousands'
                };
            }
        }

        // Legacy function for backward compatibility (now uses Google Sheets)
        function generateMonthlySeries({
            targetRange = [0, 0],
            actualRange = [0, 0],
            decimals = 0,
            valueType = 'thousands'
        } = {}) {
            // This function is deprecated - use createMonthlySeriesFromSheets instead
            // Keeping for backward compatibility but returning empty data
            const labels = [...chartMonths];
            return {
                labels,
                target: Array(12).fill(0),
                actual: Array(12).fill(0),
                previous: Array(12).fill(0),
                totalTarget: 0,
                totalActual: 0,
                valueType
            };
        }

        // Function to generate quarterly data for Operational KPIs
        function generateQuarterlyData({
            targetRange = [0, 0],
            actualRange = [0, 0],
            decimals = 0,
            valueType = 'thousands'
        } = {}) {
            const quarters = {
                'Q1': { months: ['Jan', 'Feb', 'Mar'], indices: [0, 1, 2] },
                'Q2': { months: ['Apr', 'May', 'Jun'], indices: [3, 4, 5] },
                'Q3': { months: ['Jul', 'Aug', 'Sep'], indices: [6, 7, 8] },
                'Q4': { months: ['Oct', 'Nov', 'Dec'], indices: [9, 10, 11] }
            };

            const useFloat = decimals > 0;
            const generateValue = (min, max) => {
                return useFloat
                    ? randomFloatInRange(min, max, decimals)
                    : randomIntInRange(min, max);
            };

            const quarterlyData = {};
            
            Object.keys(quarters).forEach(quarter => {
                const { months, indices } = quarters[quarter];
                quarterlyData[quarter] = {
                    labels: months,
                    target: indices.map(() => generateValue(targetRange[0], targetRange[1])),
                    actual: indices.map(() => generateValue(actualRange[0], actualRange[1])),
                    valueType
                };
            });

            return quarterlyData;
        }

        // Store quarterly data for Technical Team Operational KPIs
        const technicalOperationalKpiQuarterlyData = {};

        // Store quarterly data for Accounting Team Operational KPIs
        const accountingOperationalKpiQuarterlyData = {};

        // Store quarterly data for LRAD Team Operational KPIs
        const lradOperationalKpiQuarterlyData = {};

        // Store quarterly data for Quality Team Operational KPIs
        const qualityOperationalKpiQuarterlyData = {};

        // Store quarterly data for DC Team Operational KPIs
        const dcOperationalKpiQuarterlyData = {};

        // Store quarterly data for IT Team Operational KPIs
        const itOperationalKpiQuarterlyData = {};

        // Store quarterly data for Opportunity Team Operational KPIs
        const opportunityOperationalKpiQuarterlyData = {};

        // Store quarterly data for Marcom Team Operational KPIs
        const marcomOperationalKpiQuarterlyData = {};

        // Store quarterly data for Audit Team Operational KPIs
        const auditOperationalKpiQuarterlyData = {};

        // Store quarterly data for Gathering Team Operational KPIs
        const gatheringOperationalKpiQuarterlyData = {};

        // Store quarterly data for Operations Team Operational KPIs
        const operationsOperationalKpiQuarterlyData = {};

        // Monthly series objects - will be populated from Google Sheets
        const technicalMonthlySeries = {};
        const accountingMonthlySeries = {};
        const lradMonthlySeries = {};
        const dcMonthlySeries = {};
        const opportunityMonthlySeries = {};
        const marcomMonthlySeries = {};
        const gatheringMonthlySeries = {};
        const operationsMonthlySeries = {};
        
        // Initialize monthly series from Google Sheets
        async function initializeMonthlySeries() {
            try {
                // Technical Team
                technicalMonthlySeries['FS Target : Repairs & Maintenance (Labor) (TECHNICAL) Expense'] = await createMonthlySeriesFromSheets('FS Target : Repairs & Maintenance (Labor) (TECHNICAL) Expense', 'Technical Team');
                technicalMonthlySeries['FS Target : Repairs & Maintenance (Materials) (TECHNICAL) Expense'] = await createMonthlySeriesFromSheets('FS Target : Repairs & Maintenance (Materials) (TECHNICAL) Expense', 'Technical Team');
                technicalMonthlySeries['# of Breakdowns : Engineering Department'] = await createMonthlySeriesFromSheets('# of Breakdowns : Engineering Department', 'Technical Team');
                technicalMonthlySeries['% Predictive Maintenance Compliance'] = await createMonthlySeriesFromSheets('% Predictive Maintenance Compliance', 'Technical Team');
                technicalMonthlySeries['% Emergency Response Within SLA'] = await createMonthlySeriesFromSheets('% Emergency Response Within SLA', 'Technical Team');
                
                // Accounting Team (Lag KPIs)
                accountingMonthlySeries['FS Target : Total Operating Expense'] = await createMonthlySeriesFromSheets('FS Target : Total Operating Expense', 'Accounting Team', false);
                accountingMonthlySeries['FS Target : Total Gross Revenue'] = await createMonthlySeriesFromSheets('FS Target : Total Gross Revenue', 'Accounting Team', false);
                accountingMonthlySeries['FS Target : Net Profit'] = await createMonthlySeriesFromSheets('FS Target : Net Profit', 'Accounting Team', false);
                accountingMonthlySeries['% Collection : All Sites'] = await createMonthlySeriesFromSheets('% Collection : All Sites', 'Accounting Team', false);
                
                // LRAD Team (Lag KPIs)
                lradMonthlySeries['FS Target : Salary Expense'] = await createMonthlySeriesFromSheets('FS Target : Salary Expense', 'LRAD Team', false);
                
                // DC Team (Lag KPIs)
                dcMonthlySeries['FS Target : Repairs & Maintenance (Labor) (DCD) Expense'] = await createMonthlySeriesFromSheets('FS Target : Repairs & Maintenance (Labor) (DCD) Expense', 'DC Team', false);
                dcMonthlySeries['FS Target : Repairs & Maintenance (Materials) (DCD) Expense'] = await createMonthlySeriesFromSheets('FS Target : Repairs & Maintenance (Materials) (DCD) Expense', 'DC Team', false);
                
                // Opportunity Team (Lag KPIs)
                opportunityMonthlySeries['% Occupancy: Commercial (Units)'] = await createMonthlySeriesFromSheets('% Occupancy: Commercial (Units)', 'Opportunity Team', false);
                opportunityMonthlySeries['% Occupancy: Commercial (Area)'] = await createMonthlySeriesFromSheets('% Occupancy: Commercial (Area)', 'Opportunity Team', false);
                opportunityMonthlySeries['% Occupancy: Commercial (PValue)'] = await createMonthlySeriesFromSheets('% Occupancy: Commercial (PValue)', 'Opportunity Team', false);
                opportunityMonthlySeries['FS Target : Rental Income'] = await createMonthlySeriesFromSheets('FS Target : Rental Income', 'Opportunity Team', false);
                
                // Marcom Team (Lag KPIs)
                marcomMonthlySeries['% Within the Team\'s Budget'] = await createMonthlySeriesFromSheets('% Within the Team\'s Budget', 'Marcom Team', false);
                marcomMonthlySeries['FS Target : Marketing Expense (+Gifts & Decor) (MARCOM)'] = await createMonthlySeriesFromSheets('FS Target : Marketing Expense (+Gifts & Decor) (MARCOM)', 'Marcom Team', false);
                
                // Gathering Team (Lag KPIs)
                gatheringMonthlySeries['% Occupancy: Venue (Hours)'] = await createMonthlySeriesFromSheets('% Occupancy: Venue (Hours)', 'Gathering Team', false);
                gatheringMonthlySeries['% Occupancy: Venue (PValue)'] = await createMonthlySeriesFromSheets('% Occupancy: Venue (PValue)', 'Gathering Team', false);
                gatheringMonthlySeries['% Occupancy: Studio (Hours)'] = await createMonthlySeriesFromSheets('% Occupancy: Studio (Hours)', 'Gathering Team', false);
                gatheringMonthlySeries['% Occupancy: Studio (PValue)'] = await createMonthlySeriesFromSheets('% Occupancy: Studio (PValue)', 'Gathering Team', false);
                gatheringMonthlySeries['% Occupancy: Sports Arena (Hours)'] = await createMonthlySeriesFromSheets('% Occupancy: Sports Arena (Hours)', 'Gathering Team', false);
                gatheringMonthlySeries['% Occupancy: Sports Arena (PValue)'] = await createMonthlySeriesFromSheets('% Occupancy: Sports Arena (PValue)', 'Gathering Team', false);
                gatheringMonthlySeries['FS Target : Marketing Expense (+Gifts & Decor) (GATHERING)'] = await createMonthlySeriesFromSheets('FS Target : Marketing Expense (+Gifts & Decor) (GATHERING)', 'Gathering Team', false);
                
                // Operations Team (Lag KPIs)
                operationsMonthlySeries['% Within the Team\'s Budget'] = await createMonthlySeriesFromSheets('% Within the Team\'s Budget', 'Operations Team', false);
                operationsMonthlySeries['FS Target : Electricity Expense'] = await createMonthlySeriesFromSheets('FS Target : Electricity Expense', 'Operations Team', false);
                operationsMonthlySeries['FS Target : Water Expense'] = await createMonthlySeriesFromSheets('FS Target : Water Expense', 'Operations Team', false);
                operationsMonthlySeries['FS Target : Security Expense'] = await createMonthlySeriesFromSheets('FS Target : Security Expense', 'Operations Team', false);
                operationsMonthlySeries['FS Target : Agency Expense'] = await createMonthlySeriesFromSheets('FS Target : Agency Expense', 'Operations Team', false);
                operationsMonthlySeries['FS Target : Parking Income'] = await createMonthlySeriesFromSheets('FS Target : Parking Income', 'Operations Team', false);
                operationsMonthlySeries['% Facility Uptime'] = await createMonthlySeriesFromSheets('% Facility Uptime', 'Operations Team', false);
                operationsMonthlySeries['% Maintenance Completion Rate'] = await createMonthlySeriesFromSheets('% Maintenance Completion Rate', 'Operations Team', false);
                operationsMonthlySeries['% Energy Efficiency'] = await createMonthlySeriesFromSheets('% Energy Efficiency', 'Operations Team', false);
                
                // Lead KPI Monthly Series - fetch from Google Sheets
                // LRAD Team Lead KPIs
                lradLeadMonthlySeries['% On time & Accurate - LMDB'] = await createMonthlySeriesFromSheets('% On time & Accurate - LMDB', 'LRAD Team', true);
                lradLeadMonthlySeries['% On time & Accurate - Recorded: Scores (KPI)'] = await createMonthlySeriesFromSheets('% On time & Accurate - Recorded: Scores (KPI)', 'LRAD Team', true);
                lradLeadMonthlySeries['% On time & Accurate - Recorded: Stories'] = await createMonthlySeriesFromSheets('% On time & Accurate - Recorded: Stories', 'LRAD Team', true);
                lradLeadMonthlySeries['% Planned vs Actual - Regular Events Plan: Lotuszen'] = await createMonthlySeriesFromSheets('% Planned vs Actual - Regular Events Plan: Lotuszen', 'LRAD Team', true);
                lradLeadMonthlySeries['% Planned vs Actual - Culture Dev\'t Activities Plan: Lotuszen'] = await createMonthlySeriesFromSheets('% Planned vs Actual - Culture Dev\'t Activities Plan: Lotuszen', 'LRAD Team', true);
                lradLeadMonthlySeries['% Complete & Updated : LMDB'] = await createMonthlySeriesFromSheets('% Complete & Updated : LMDB', 'LRAD Team', true);
                
                // Quality Team Lead KPIs
                qualityLeadMonthlySeries['Score/Evaluation/NPS : SMD Projects'] = await createMonthlySeriesFromSheets('Score/Evaluation/NPS : SMD Projects', 'Quality Team', true);
                qualityLeadMonthlySeries['Score/Evaluation/NPS : SID Projects'] = await createMonthlySeriesFromSheets('Score/Evaluation/NPS : SID Projects', 'Quality Team', true);
                qualityLeadMonthlySeries['% Planned vs Actual : SMD Projects'] = await createMonthlySeriesFromSheets('% Planned vs Actual : SMD Projects', 'Quality Team', true);
                qualityLeadMonthlySeries['% Planned vs Actual : SID Projects'] = await createMonthlySeriesFromSheets('% Planned vs Actual : SID Projects', 'Quality Team', true);
                
                // DC Team Lead KPIs
                dcLeadMonthlySeries['% Within Budget : Projects (E&D)'] = await createMonthlySeriesFromSheets('% Within Budget : Projects (E&D)', 'DC Team', true);
                dcLeadMonthlySeries['% Within Budget : Projects (IP)'] = await createMonthlySeriesFromSheets('% Within Budget : Projects (IP)', 'DC Team', true);
                dcLeadMonthlySeries['% Within Budget : Projects (PMR)'] = await createMonthlySeriesFromSheets('% Within Budget : Projects (PMR)', 'DC Team', true);
                dcLeadMonthlySeries['% Within Budget : Projects (Construction)'] = await createMonthlySeriesFromSheets('% Within Budget : Projects (Construction)', 'DC Team', true);
                dcLeadMonthlySeries['% Within Budget : Projects (Landscape)'] = await createMonthlySeriesFromSheets('% Within Budget : Projects (Landscape)', 'DC Team', true);
                dcLeadMonthlySeries['% Planned vs Actual : Projects (E&D)'] = await createMonthlySeriesFromSheets('% Planned vs Actual : Projects (E&D)', 'DC Team', true);
                dcLeadMonthlySeries['% Planned vs Actual : Projects (IP)'] = await createMonthlySeriesFromSheets('% Planned vs Actual : Projects (IP)', 'DC Team', true);
                dcLeadMonthlySeries['% Planned vs Actual : Projects (PMR)'] = await createMonthlySeriesFromSheets('% Planned vs Actual : Projects (PMR)', 'DC Team', true);
                dcLeadMonthlySeries['% Planned vs Actual : Projects (Construction)'] = await createMonthlySeriesFromSheets('% Planned vs Actual : Projects (Construction)', 'DC Team', true);
                dcLeadMonthlySeries['% Planned vs Actual : Projects (Landscape)'] = await createMonthlySeriesFromSheets('% Planned vs Actual : Projects (Landscape)', 'DC Team', true);
                dcLeadMonthlySeries['% Planned vs Actual : JO (MST)'] = await createMonthlySeriesFromSheets('% Planned vs Actual : JO (MST)', 'DC Team', true);
                dcLeadMonthlySeries['% Planned vs Actual : JO (E&D Fab)'] = await createMonthlySeriesFromSheets('% Planned vs Actual : JO (E&D Fab)', 'DC Team', true);
                
                // IT Team Lead KPIs
                itLeadMonthlySeries['# of Breakdowns : IT'] = await createMonthlySeriesFromSheets('# of Breakdowns : IT', 'IT Team', true);
                
                // Opportunity Team Lead KPIs
                opportunityLeadMonthlySeries['% Planned vs Actual - Tenant Mix Plan'] = await createMonthlySeriesFromSheets('% Planned vs Actual - Tenant Mix Plan', 'Opportunity Team', true);
                opportunityLeadMonthlySeries['# of Closed Inquiry/Offline Inquiries Received: Commercial'] = await createMonthlySeriesFromSheets('# of Closed Inquiry/Offline Inquiries Received: Commercial', 'Opportunity Team', true);
                opportunityLeadMonthlySeries['# of Closed Prospects/Target Prospects: (Commercial) Anchor'] = await createMonthlySeriesFromSheets('# of Closed Prospects/Target Prospects: (Commercial) Anchor', 'Opportunity Team', true);
                opportunityLeadMonthlySeries['# of Closed Prospects/Priority Vacant Spaces: Anchor'] = await createMonthlySeriesFromSheets('# of Closed Prospects/Priority Vacant Spaces: Anchor', 'Opportunity Team', true);
                opportunityLeadMonthlySeries['# of Closed Prospects/Target Prospects: (Commercial) Regular'] = await createMonthlySeriesFromSheets('# of Closed Prospects/Target Prospects: (Commercial) Regular', 'Opportunity Team', true);
                opportunityLeadMonthlySeries['# of Closed Prospects/Priority Vacant Spaces: Regular'] = await createMonthlySeriesFromSheets('# of Closed Prospects/Priority Vacant Spaces: Regular', 'Opportunity Team', true);
                opportunityLeadMonthlySeries['% Complete & Updated: Tenant Requirements'] = await createMonthlySeriesFromSheets('% Complete & Updated: Tenant Requirements', 'Opportunity Team', true);
                opportunityLeadMonthlySeries['% Pull Out - Aversion'] = await createMonthlySeriesFromSheets('% Pull Out - Aversion', 'Opportunity Team', true);
                
                // Marcom Team Lead KPIs
                marcomLeadMonthlySeries['% Increase : Facebook Page Reach (per Month per Page)'] = await createMonthlySeriesFromSheets('% Increase : Facebook Page Reach (per Month per Page)', 'Marcom Team', true);
                marcomLeadMonthlySeries['% Increase : Facebook Page Followers (per Month per Page)'] = await createMonthlySeriesFromSheets('% Increase : Facebook Page Followers (per Month per Page)', 'Marcom Team', true);
                marcomLeadMonthlySeries['# of Inquiries : Offline for (Commercial Spaces)'] = await createMonthlySeriesFromSheets('# of Inquiries : Offline for (Commercial Spaces)', 'Marcom Team', true);
                marcomLeadMonthlySeries['# of Inquiries : Offline for Gatherings (Event Venues)'] = await createMonthlySeriesFromSheets('# of Inquiries : Offline for Gatherings (Event Venues)', 'Marcom Team', true);
                marcomLeadMonthlySeries['# of Inquiries : Offline for Gatherings (Sports Arena)'] = await createMonthlySeriesFromSheets('# of Inquiries : Offline for Gatherings (Sports Arena)', 'Marcom Team', true);
                marcomLeadMonthlySeries['# of Inquiries : Offline for Gatherings (Handaan)'] = await createMonthlySeriesFromSheets('# of Inquiries : Offline for Gatherings (Handaan)', 'Marcom Team', true);
                marcomLeadMonthlySeries['# of Inquiries : Offline for Gatherings (SS)'] = await createMonthlySeriesFromSheets('# of Inquiries : Offline for Gatherings (SS)', 'Marcom Team', true);
                marcomLeadMonthlySeries['# of Inquiries : Offline for Gatherings (KS)'] = await createMonthlySeriesFromSheets('# of Inquiries : Offline for Gatherings (KS)', 'Marcom Team', true);
                marcomLeadMonthlySeries['# of Inquiries : Offline for Gatherings (Studio)'] = await createMonthlySeriesFromSheets('# of Inquiries : Offline for Gatherings (Studio)', 'Marcom Team', true);
                
                // Audit Team Lead KPIs
                auditLeadMonthlySeries['% Addressed : I.C.A.R.E (All Teams)'] = await createMonthlySeriesFromSheets('% Addressed : I.C.A.R.E (All Teams)', 'Audit Team', true);
                auditLeadMonthlySeries['% On time & Accurate : PropMan Module'] = await createMonthlySeriesFromSheets('% On time & Accurate : PropMan Module', 'Audit Team', true);
                
                // Gathering Team Lead KPIs
                gatheringLeadMonthlySeries['# of Average Daily Foot Traffic'] = await createMonthlySeriesFromSheets('# of Average Daily Foot Traffic', 'Gathering Team', true);
                gatheringLeadMonthlySeries['# of 500 pax or more Event/month (All Sites)'] = await createMonthlySeriesFromSheets('# of 500 pax or more Event/month (All Sites)', 'Gathering Team', true);
                gatheringLeadMonthlySeries['# of Closed Inquiry/Offline Inquiries Received: Gathering'] = await createMonthlySeriesFromSheets('# of Closed Inquiry/Offline Inquiries Received: Gathering', 'Gathering Team', true);
                
                // Operations Team Lead KPIs
                operationsLeadMonthlySeries['% Addressed : Team/Section\'s I.C.A.R.E'] = await createMonthlySeriesFromSheets('% Addressed : Team/Section\'s I.C.A.R.E', 'Operations Team', true);
                operationsLeadMonthlySeries['% Score : Site Quality (by Auditor)'] = await createMonthlySeriesFromSheets('% Score : Site Quality (by Auditor)', 'Operations Team', true);
                operationsLeadMonthlySeries['% Insurance Claimed vs Reported'] = await createMonthlySeriesFromSheets('% Insurance Claimed vs Reported', 'Operations Team', true);
                operationsLeadMonthlySeries['% Onboarded Tenants : All Tenants/Reserved (New + Existing)'] = await createMonthlySeriesFromSheets('% Onboarded Tenants : All Tenants/Reserved (New + Existing)', 'Operations Team', true);
                
                console.log('Monthly series (lag and lead) initialized from Google Sheets');
            } catch (error) {
                console.error('Error initializing monthly series:', error);
            }
        }
        
        // Call initialization on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeMonthlySeries);
        } else {
            initializeMonthlySeries();
        }

        // Removed: Old monthly series declarations - now populated from Google Sheets in initializeMonthlySeries()

        // Lead monthly series objects - will be populated from Google Sheets
        const lradLeadMonthlySeries = {};
        const qualityLeadMonthlySeries = {};
        const dcLeadMonthlySeries = {};
        const itLeadMonthlySeries = {};
        const opportunityLeadMonthlySeries = {};
        const marcomLeadMonthlySeries = {};
        const auditLeadMonthlySeries = {};
        const gatheringLeadMonthlySeries = {};
        const operationsLeadMonthlySeries = {};

        function formatAggregateValue(value, valueType = 'thousands') {
            if (value === null || value === undefined || Number.isNaN(Number(value))) {
                return '-';
            }
            if (valueType === 'percentage') {
                const numeric = Number(value);
                const fixed = numeric.toFixed(1);
                return `${fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed}%`;
            }
            if (valueType === 'count') {
                return Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 });
            }
            return formatPesoIfNeeded(value, true);
        }

        function getAggregateDisplayData(kpiName, targetNumeric, actualNumeric, isPercentageKpi = false, leaderId = null) {
            const monthlySeries = technicalMonthlySeries[kpiName] 
                || accountingMonthlySeries[kpiName]
                || lradMonthlySeries[kpiName]
                || dcMonthlySeries[kpiName]
                || opportunityMonthlySeries[kpiName]
                || marcomMonthlySeries[kpiName]
                || gatheringMonthlySeries[kpiName]
                || operationsMonthlySeries[kpiName]
                || lradLeadMonthlySeries[kpiName]
                || qualityLeadMonthlySeries[kpiName]
                || dcLeadMonthlySeries[kpiName]
                || itLeadMonthlySeries[kpiName]
                || opportunityLeadMonthlySeries[kpiName]
                || marcomLeadMonthlySeries[kpiName]
                || auditLeadMonthlySeries[kpiName]
                || gatheringLeadMonthlySeries[kpiName]
                || operationsLeadMonthlySeries[kpiName];
            let aggregateTarget = targetNumeric;
            let aggregateActual = actualNumeric;
            let valueType = isPercentageKpi ? 'percentage' : 'thousands';

            if (monthlySeries) {
                aggregateTarget = monthlySeries.totalTarget;
                aggregateActual = monthlySeries.totalActual;
                valueType = monthlySeries.valueType;
            }

            return {
                aggregateTarget: typeof aggregateTarget === 'number' ? aggregateTarget : null,
                aggregateActual: typeof aggregateActual === 'number' ? aggregateActual : null,
                valueType,
                targetLabel: formatAggregateValue(aggregateTarget, valueType),
                actualLabel: formatAggregateValue(aggregateActual, valueType)
            };
        }

        // Cached technical expenses data (populated asynchronously)
        let technicalExpensesDataCache = {
            'Technical Team': {},
            'Accounting Team': {},
            'LRAD Team': {},
            'DC Team': {},
            'Opportunity Team': {},
            'Marcom Team': {},
            'Gathering Team': {},
            'Operations Team': {}
        };

        // Async function to fetch lag KPI data from Google Sheets
        async function getTechnicalExpensesData(periodKey = DEFAULT_PERIOD_KEY) {
            try {
                const payload = await fetchLagKpiData();
                
                // Map Google Sheets data to the expected structure
                // Expected payload structure: { teamName: { kpiName: { target: [...], actual: [...], previous: [...] } } }
                // Or: { kpiName: { target: [...], actual: [...], previous: [...] } } for all teams
                
                const result = {
                    'Technical Team': {},
                    'Accounting Team': {},
                    'LRAD Team': {},
                    'DC Team': {},
                    'Opportunity Team': {},
                    'Marcom Team': {},
                    'Gathering Team': {},
                    'Operations Team': {}
                };

                // Helper to extract period data from payload
                const getKpiData = (teamName, kpiName) => {
                    // Try team-specific path first
                    const teamData = payload[teamName]?.[kpiName];
                    if (teamData) {
                        return {
                            [periodKey]: {
                                target: teamData.target?.[0] || 0,
                                actual: teamData.actual?.[0] || 0
                            }
                        };
                    }
                    
                    // Try direct KPI path
                    const kpiData = payload[kpiName];
                    if (kpiData) {
                        return {
                            [periodKey]: {
                                target: kpiData.target?.[0] || 0,
                                actual: kpiData.actual?.[0] || 0
                            }
                        };
                    }
                    
                    return {
                        [periodKey]: {
                            target: 0,
                            actual: 0
                        }
                    };
                };

                // Technical Team KPIs
                result['Technical Team']['FS Target : Repairs & Maintenance (Labor) (TECHNICAL) Expense'] = getKpiData('Technical Team', 'FS Target : Repairs & Maintenance (Labor) (TECHNICAL) Expense');
                result['Technical Team']['FS Target : Repairs & Maintenance (Materials) (TECHNICAL) Expense'] = getKpiData('Technical Team', 'FS Target : Repairs & Maintenance (Materials) (TECHNICAL) Expense');

                // Accounting Team KPIs
                result['Accounting Team']['FS Target : Total Operating Expense'] = getKpiData('Accounting Team', 'FS Target : Total Operating Expense');
                result['Accounting Team']['FS Target : Total Gross Revenue'] = getKpiData('Accounting Team', 'FS Target : Total Gross Revenue');
                result['Accounting Team']['FS Target : Net Profit'] = getKpiData('Accounting Team', 'FS Target : Net Profit');
                result['Accounting Team']['% Collection : All Sites'] = getKpiData('Accounting Team', '% Collection : All Sites');

                // LRAD Team KPIs
                result['LRAD Team']['FS Target : Salary Expense'] = getKpiData('LRAD Team', 'FS Target : Salary Expense');

                // DC Team KPIs
                result['DC Team']['FS Target : Repairs & Maintenance (Labor) (DCD) Expense'] = getKpiData('DC Team', 'FS Target : Repairs & Maintenance (Labor) (DCD) Expense');
                result['DC Team']['FS Target : Repairs & Maintenance (Materials) (DCD) Expense'] = getKpiData('DC Team', 'FS Target : Repairs & Maintenance (Materials) (DCD) Expense');

                // Opportunity Team KPIs
                result['Opportunity Team']['% Occupancy: Commercial (Units)'] = getKpiData('Opportunity Team', '% Occupancy: Commercial (Units)');
                result['Opportunity Team']['% Occupancy: Commercial (Area)'] = getKpiData('Opportunity Team', '% Occupancy: Commercial (Area)');
                result['Opportunity Team']['% Occupancy: Commercial (PValue)'] = getKpiData('Opportunity Team', '% Occupancy: Commercial (PValue)');
                result['Opportunity Team']['FS Target : Rental Income'] = getKpiData('Opportunity Team', 'FS Target : Rental Income');

                // Marcom Team KPIs
                result['Marcom Team']['% Within the Team\'s Budget'] = getKpiData('Marcom Team', '% Within the Team\'s Budget');
                result['Marcom Team']['FS Target : Marketing Expense (+Gifts & Decor) (MARCOM)'] = getKpiData('Marcom Team', 'FS Target : Marketing Expense (+Gifts & Decor) (MARCOM)');
                result['Marcom Team']['% Budget Compliance'] = getKpiData('Marcom Team', '% Budget Compliance');
                result['Marcom Team']['% Cost per Campaign'] = getKpiData('Marcom Team', '% Cost per Campaign');
                result['Marcom Team']['% Increase : Facebook Page Reach (per Month per Page)'] = getKpiData('Marcom Team', '% Increase : Facebook Page Reach (per Month per Page)');
                result['Marcom Team']['% Increase : Facebook Page Followers (per Month per Page)'] = getKpiData('Marcom Team', '% Increase : Facebook Page Followers (per Month per Page)');
                result['Marcom Team']['% Campaign Engagement Rate'] = getKpiData('Marcom Team', '% Campaign Engagement Rate');
                result['Marcom Team']['% Conversion Rate : Marketing Campaigns'] = getKpiData('Marcom Team', '% Conversion Rate : Marketing Campaigns');
                result['Marcom Team']['# of Qualified Leads Generated'] = getKpiData('Marcom Team', '# of Qualified Leads Generated');
                result['Marcom Team']['# of Inquiries : Offline for (Commercial Spaces)'] = getKpiData('Marcom Team', '# of Inquiries : Offline for (Commercial Spaces)');
                result['Marcom Team']['# of Inquiries : Offline for Gatherings (Event Venues)'] = getKpiData('Marcom Team', '# of Inquiries : Offline for Gatherings (Event Venues)');
                result['Marcom Team']['# of Inquiries : Offline for Gatherings (Sports Arena)'] = getKpiData('Marcom Team', '# of Inquiries : Offline for Gatherings (Sports Arena)');
                result['Marcom Team']['% Inquiry Response Time'] = getKpiData('Marcom Team', '% Inquiry Response Time');

                // Gathering Team KPIs
                result['Gathering Team']['% Occupancy: Venue (Hours)'] = getKpiData('Gathering Team', '% Occupancy: Venue (Hours)');
                result['Gathering Team']['% Occupancy: Venue (PValue)'] = getKpiData('Gathering Team', '% Occupancy: Venue (PValue)');
                result['Gathering Team']['% Occupancy: Studio (Hours)'] = getKpiData('Gathering Team', '% Occupancy: Studio (Hours)');
                result['Gathering Team']['% Occupancy: Studio (PValue)'] = getKpiData('Gathering Team', '% Occupancy: Studio (PValue)');
                result['Gathering Team']['% Occupancy: Sports Arena (Hours)'] = getKpiData('Gathering Team', '% Occupancy: Sports Arena (Hours)');
                result['Gathering Team']['% Occupancy: Sports Arena (PValue)'] = getKpiData('Gathering Team', '% Occupancy: Sports Arena (PValue)');
                result['Gathering Team']['FS Target : Marketing Expense (+Gifts & Decor) (GATHERING)'] = getKpiData('Gathering Team', 'FS Target : Marketing Expense (+Gifts & Decor) (GATHERING)');

                // Operations Team KPIs
                result['Operations Team']['% Within the Team\'s Budget'] = getKpiData('Operations Team', '% Within the Team\'s Budget');
                result['Operations Team']['FS Target : Electricity Expense'] = getKpiData('Operations Team', 'FS Target : Electricity Expense');
                result['Operations Team']['FS Target : Water Expense'] = getKpiData('Operations Team', 'FS Target : Water Expense');
                result['Operations Team']['FS Target : Security Expense'] = getKpiData('Operations Team', 'FS Target : Security Expense');
                result['Operations Team']['FS Target : Agency Expense'] = getKpiData('Operations Team', 'FS Target : Agency Expense');
                result['Operations Team']['FS Target : Parking Income'] = getKpiData('Operations Team', 'FS Target : Parking Income');
                result['Operations Team']['% Facility Uptime'] = getKpiData('Operations Team', '% Facility Uptime');
                result['Operations Team']['% Maintenance Completion Rate'] = getKpiData('Operations Team', '% Maintenance Completion Rate');
                result['Operations Team']['% Energy Efficiency'] = getKpiData('Operations Team', '% Energy Efficiency');

                // Update cache
                technicalExpensesDataCache = result;
                return result;
            } catch (error) {
                console.error('Error in getTechnicalExpensesData:', error);
                // Return empty structure on error
                const emptyResult = {
                    'Technical Team': {},
                    'Accounting Team': {},
                    'LRAD Team': {},
                    'DC Team': {},
                    'Opportunity Team': {},
                    'Marcom Team': {},
                    'Gathering Team': {},
                    'Operations Team': {}
                };
                technicalExpensesDataCache = emptyResult;
                return emptyResult;
            }
        }

        // Initialize technical expenses data on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                getTechnicalExpensesData();
            });
        } else {
            getTechnicalExpensesData();
        }

        // For backward compatibility, use cached data synchronously
        const technicalExpensesData = new Proxy({}, {
            get(target, teamName) {
                return technicalExpensesDataCache[teamName] || {};
            }
        });

        // Lead KPI data by period (year-month)

        // Cached lead KPI expenses data (populated asynchronously)
        let leadKpiExpensesDataCache = {
            'Technical Team': {},
            'LRAD Team': {},
            'Quality Team': {},
            'DC Team': {},
            'IT Team': {},
            'Opportunity Team': {},
            'Marcom Team': {},
            'Audit Team': {},
            'Gathering Team': {},
            'Operations Team': {}
        };

        // Async function to fetch lead KPI data from Google Sheets
        async function getLeadKpiExpensesData(periodKey = DEFAULT_PERIOD_KEY) {
            try {
                const payload = await fetchLeadKpiData();
                
                const result = {
                    'Technical Team': {},
                    'LRAD Team': {},
                    'Quality Team': {},
                    'DC Team': {},
                    'IT Team': {},
                    'Opportunity Team': {},
                    'Marcom Team': {},
                    'Audit Team': {},
                    'Gathering Team': {},
                    'Operations Team': {}
                };

                // Helper to extract period data from payload
                const getKpiData = (teamName, kpiName) => {
                    const teamData = payload[teamName]?.[kpiName];
                    if (teamData) {
                        return {
                            [periodKey]: {
                                target: teamData.target?.[0] || 0,
                                actual: teamData.actual?.[0] || 0
                            }
                        };
                    }
                    
                    const kpiData = payload[kpiName];
                    if (kpiData) {
                        return {
                            [periodKey]: {
                                target: kpiData.target?.[0] || 0,
                                actual: kpiData.actual?.[0] || 0
                            }
                        };
                    }
                    
                    return {
                        [periodKey]: {
                            target: 0,
                            actual: 0
                        }
                    };
                };

                // Technical Team Lead KPIs
                result['Technical Team']['# of Breakdowns : Engineering Department'] = getKpiData('Technical Team', '# of Breakdowns : Engineering Department');
                result['Technical Team']['% Predictive Maintenance Compliance'] = getKpiData('Technical Team', '% Predictive Maintenance Compliance');
                result['Technical Team']['% Emergency Response Within SLA'] = getKpiData('Technical Team', '% Emergency Response Within SLA');

                // LRAD Team Lead KPIs
                result['LRAD Team']['% On time & Accurate - LMDB'] = getKpiData('LRAD Team', '% On time & Accurate - LMDB');
                result['LRAD Team']['% On time & Accurate - Recorded: Scores (KPI)'] = getKpiData('LRAD Team', '% On time & Accurate - Recorded: Scores (KPI)');
                result['LRAD Team']['% On time & Accurate - Recorded: Stories'] = getKpiData('LRAD Team', '% On time & Accurate - Recorded: Stories');
                result['LRAD Team']['% Planned vs Actual - Regular Events Plan: Lotuszen'] = getKpiData('LRAD Team', '% Planned vs Actual - Regular Events Plan: Lotuszen');
                result['LRAD Team']['% Planned vs Actual - Culture Dev\'t Activities Plan: Lotuszen'] = getKpiData('LRAD Team', '% Planned vs Actual - Culture Dev\'t Activities Plan: Lotuszen');
                result['LRAD Team']['% Complete & Updated : LMDB'] = getKpiData('LRAD Team', '% Complete & Updated : LMDB');

                // Quality Team Lead KPIs
                result['Quality Team']['Score/Evaluation/NPS : SMD Projects'] = getKpiData('Quality Team', 'Score/Evaluation/NPS : SMD Projects');
                result['Quality Team']['Score/Evaluation/NPS : SID Projects'] = getKpiData('Quality Team', 'Score/Evaluation/NPS : SID Projects');
                result['Quality Team']['% Planned vs Actual : SMD Projects'] = getKpiData('Quality Team', '% Planned vs Actual : SMD Projects');
                result['Quality Team']['% Planned vs Actual : SID Projects'] = getKpiData('Quality Team', '% Planned vs Actual : SID Projects');

                // DC Team Lead KPIs (add all from generateDcLeadKpiData)
                result['DC Team']['% Within Budget : Projects (E&D)'] = getKpiData('DC Team', '% Within Budget : Projects (E&D)');
                result['DC Team']['% Within Budget : Projects (IP)'] = getKpiData('DC Team', '% Within Budget : Projects (IP)');
                result['DC Team']['% Within Budget : Projects (PMR)'] = getKpiData('DC Team', '% Within Budget : Projects (PMR)');
                result['DC Team']['% Within Budget : Projects (Construction)'] = getKpiData('DC Team', '% Within Budget : Projects (Construction)');
                result['DC Team']['% Within Budget : Projects (Landscape)'] = getKpiData('DC Team', '% Within Budget : Projects (Landscape)');
                result['DC Team']['% Planned vs Actual : Projects (E&D)'] = getKpiData('DC Team', '% Planned vs Actual : Projects (E&D)');
                result['DC Team']['% Planned vs Actual : Projects (IP)'] = getKpiData('DC Team', '% Planned vs Actual : Projects (IP)');
                result['DC Team']['% Planned vs Actual : Projects (PMR)'] = getKpiData('DC Team', '% Planned vs Actual : Projects (PMR)');
                result['DC Team']['% Planned vs Actual : Projects (Construction)'] = getKpiData('DC Team', '% Planned vs Actual : Projects (Construction)');
                result['DC Team']['% Planned vs Actual : Projects (Landscape)'] = getKpiData('DC Team', '% Planned vs Actual : Projects (Landscape)');
                result['DC Team']['% Planned vs Actual : JO (MST)'] = getKpiData('DC Team', '% Planned vs Actual : JO (MST)');
                result['DC Team']['% Planned vs Actual : JO (E&D Fab)'] = getKpiData('DC Team', '% Planned vs Actual : JO (E&D Fab)');

                // IT Team Lead KPIs
                result['IT Team']['# of Breakdowns : IT'] = getKpiData('IT Team', '# of Breakdowns : IT');

                // Opportunity Team Lead KPIs
                result['Opportunity Team']['% Planned vs Actual - Tenant Mix Plan'] = getKpiData('Opportunity Team', '% Planned vs Actual - Tenant Mix Plan');
                result['Opportunity Team']['# of Closed Inquiry/Offline Inquiries Received: Commercial'] = getKpiData('Opportunity Team', '# of Closed Inquiry/Offline Inquiries Received: Commercial');
                result['Opportunity Team']['# of Closed Prospects/Target Prospects: (Commercial) Anchor'] = getKpiData('Opportunity Team', '# of Closed Prospects/Target Prospects: (Commercial) Anchor');
                result['Opportunity Team']['# of Closed Prospects/Priority Vacant Spaces: Anchor'] = getKpiData('Opportunity Team', '# of Closed Prospects/Priority Vacant Spaces: Anchor');
                result['Opportunity Team']['# of Closed Prospects/Target Prospects: (Commercial) Regular'] = getKpiData('Opportunity Team', '# of Closed Prospects/Target Prospects: (Commercial) Regular');
                result['Opportunity Team']['# of Closed Prospects/Priority Vacant Spaces: Regular'] = getKpiData('Opportunity Team', '# of Closed Prospects/Priority Vacant Spaces: Regular');
                result['Opportunity Team']['% Complete & Updated: Tenant Requirements'] = getKpiData('Opportunity Team', '% Complete & Updated: Tenant Requirements');
                result['Opportunity Team']['% Pull Out - Aversion'] = getKpiData('Opportunity Team', '% Pull Out - Aversion');

                // Marcom Team Lead KPIs
                result['Marcom Team']['% Increase : Facebook Page Reach (per Month per Page)'] = getKpiData('Marcom Team', '% Increase : Facebook Page Reach (per Month per Page)');
                result['Marcom Team']['% Increase : Facebook Page Followers (per Month per Page)'] = getKpiData('Marcom Team', '% Increase : Facebook Page Followers (per Month per Page)');
                result['Marcom Team']['# of Inquiries : Offline for (Commercial Spaces)'] = getKpiData('Marcom Team', '# of Inquiries : Offline for (Commercial Spaces)');
                result['Marcom Team']['# of Inquiries : Offline for Gatherings (Event Venues)'] = getKpiData('Marcom Team', '# of Inquiries : Offline for Gatherings (Event Venues)');
                result['Marcom Team']['# of Inquiries : Offline for Gatherings (Sports Arena)'] = getKpiData('Marcom Team', '# of Inquiries : Offline for Gatherings (Sports Arena)');
                result['Marcom Team']['# of Inquiries : Offline for Gatherings (Handaan)'] = getKpiData('Marcom Team', '# of Inquiries : Offline for Gatherings (Handaan)');
                result['Marcom Team']['# of Inquiries : Offline for Gatherings (SS)'] = getKpiData('Marcom Team', '# of Inquiries : Offline for Gatherings (SS)');
                result['Marcom Team']['# of Inquiries : Offline for Gatherings (KS)'] = getKpiData('Marcom Team', '# of Inquiries : Offline for Gatherings (KS)');
                result['Marcom Team']['# of Inquiries : Offline for Gatherings (Studio)'] = getKpiData('Marcom Team', '# of Inquiries : Offline for Gatherings (Studio)');

                // Audit Team Lead KPIs
                result['Audit Team']['% Addressed : I.C.A.R.E (All Teams)'] = getKpiData('Audit Team', '% Addressed : I.C.A.R.E (All Teams)');
                result['Audit Team']['% On time & Accurate : PropMan Module'] = getKpiData('Audit Team', '% On time & Accurate : PropMan Module');

                // Gathering Team Lead KPIs
                result['Gathering Team']['# of Average Daily Foot Traffic'] = getKpiData('Gathering Team', '# of Average Daily Foot Traffic');
                result['Gathering Team']['# of 500 pax or more Event/month (All Sites)'] = getKpiData('Gathering Team', '# of 500 pax or more Event/month (All Sites)');
                result['Gathering Team']['# of Closed Inquiry/Offline Inquiries Received: Gathering'] = getKpiData('Gathering Team', '# of Closed Inquiry/Offline Inquiries Received: Gathering');

                // Operations Team Lead KPIs
                result['Operations Team']['% Addressed : Team/Section\'s I.C.A.R.E'] = getKpiData('Operations Team', '% Addressed : Team/Section\'s I.C.A.R.E');
                result['Operations Team']['% Score : Site Quality (by Auditor)'] = getKpiData('Operations Team', '% Score : Site Quality (by Auditor)');
                result['Operations Team']['% Insurance Claimed vs Reported'] = getKpiData('Operations Team', '% Insurance Claimed vs Reported');
                result['Operations Team']['% Onboarded Tenants : All Tenants/Reserved (New + Existing)'] = getKpiData('Operations Team', '% Onboarded Tenants : All Tenants/Reserved (New + Existing)');

                // Update cache
                leadKpiExpensesDataCache = result;
                return result;
            } catch (error) {
                console.error('Error in getLeadKpiExpensesData:', error);
                const emptyResult = {
                    'Technical Team': {},
                    'LRAD Team': {},
                    'Quality Team': {},
                    'DC Team': {},
                    'IT Team': {},
                    'Opportunity Team': {},
                    'Marcom Team': {},
                    'Audit Team': {},
                    'Gathering Team': {},
                    'Operations Team': {}
                };
                leadKpiExpensesDataCache = emptyResult;
                return emptyResult;
            }
        }

        // Initialize lead KPI expenses data on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                getLeadKpiExpensesData();
            });
        } else {
            getLeadKpiExpensesData();
        }

        // For backward compatibility, use cached data synchronously
        const leadKpiExpensesData = new Proxy({}, {
            get(target, teamName) {
                return leadKpiExpensesDataCache[teamName] || {};
            }
        });

        // Helpers to compute weights and render the Team Metrics Overview chart
        function parsePercentToNumber(text) {
            if (typeof text !== 'string') return 0;
            const match = text.match(/-?\d+(\.\d+)?/);
            return match ? Number(match[0]) : 0;
        }

        function computeWeightsSummary(teamName) {
            const roles = teamOperationsData[teamName] || [];
            const roleToWeight = {};
            let overall = 0;

            roles.forEach(r => {
                const items = teamDropdownData[teamName]?.[r.role] || [];
                const roleSum = items.reduce((sum, it) => sum + parsePercentToNumber(it.weight), 0);
                roleToWeight[r.role] = roleSum;
                overall += roleSum;
            });

            return { overall, roleToWeight };
        }

        function updateWeightsOverview(teamName, selectedRole = null) {
            // Find the "Team Metrics Overview" card's SVG (third report-card)
            const reportCards = document.querySelectorAll('.report-card');
            const metricsCard = reportCards[2];
            if (!metricsCard) return;
            const svg = metricsCard.querySelector('svg.line-chart');
            if (!svg) return;

            const { overall, roleToWeight } = computeWeightsSummary(teamName);
            const selectedValue = selectedRole ? (roleToWeight[selectedRole] || 0) : null;

            // SVG helpers
            const toY = v => 120 - (v * 1.0); // 0–100 -> approx fit to 120px height
            const buildPath = y => `M 0,${y} L 50,${y-5} L 100,${y+3} L 150,${y-2} L 200,${y+5} L 250,${y-8} L 300,${y}`;

            const defs = `
                <defs>
                    <linearGradient id="overallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#ff6b6b;stop-opacity:0" />
                    </linearGradient>
                </defs>
            `;

            const overallY = toY(Math.max(0, Math.min(100, overall)));
            const overallPath = buildPath(overallY);

            const parts = [
                defs,
                `<path class="chart-area" d="${overallPath} L 300,120 L 0,120 Z" fill="url(#overallGradient)" />`,
                `<path class="chart-line" d="${overallPath}" style="stroke:#ff6b6b;stroke-width:3;fill:none;" />`
            ];

            if (selectedValue !== null) {
                const sel = Math.max(0, Math.min(100, selectedValue));
                const selY = toY(sel);
                const selPath = buildPath(selY);
                parts.push(
                    `<path class="chart-line" d="${selPath}" style="stroke:#586740;stroke-width:3;fill:none;" />`
                );
            }

            svg.innerHTML = parts.join('');

            // Update the title with quick legend
            const title = metricsCard.querySelector('.report-title');
            if (title) {
                const overallLabel = `${overall}%`;
                const legendItems = [
                    `<span style="color:#ff6b6b;">● Total Weight: ${overallLabel}</span>`
                ];
                if (selectedValue !== null) {
                    legendItems.push(
                        `<span style="color:#586740;">● ${selectedRole}: ${selectedValue}%</span>`
                    );
                }
                title.innerHTML = `
                    Team Metrics Overview
                    <div style="font-size: 12px; margin-top: 10px; display: flex; gap: 20px;">
                        ${legendItems.join('')}
                    </div>
                `;
            }
        }

        function updatePerformanceGraph(teamName, operationRole, kpiName) {
        const data = performanceData[teamName]?.[operationRole]?.[kpiName];
        if (!data) {
            console.log('No data available');
            return;
        }

        // Coerce non-numeric (e.g., strings like "Pull from GMPT") to null
        const rawCurrent = data.current;
        const rawPrevious = data.previous;
        const currentValue = (typeof rawCurrent === 'number' && isFinite(rawCurrent)) ? rawCurrent : null;
        const previousValue = (typeof rawPrevious === 'number' && isFinite(rawPrevious)) ? rawPrevious : null;

        if (currentValue === null && previousValue === null) {
            console.log('No numeric data available');
            const chartSvg = document.querySelector('.line-chart');
            if (chartSvg) chartSvg.innerHTML = '';
            const reportTitle = document.querySelector('.report-title');
            if (reportTitle) {
                reportTitle.innerHTML = `
                     - ${kpiName}
                    <div style="font-size: 12px; margin-top: 10px; display: flex; gap: 20px;">
                        <span style="color: #96a840;">● Current: N/A</span>
                        <span style="color: #e5bb22;">● Previous: N/A</span>
                        <span style="color: #9ca3af;">Δ N/A</span>
                    </div>
                `;
            }
            return;
        }

        const chartSvg = document.querySelector('.line-chart');
        if (!chartSvg) return;

        // Helpers
        const toY = v => 120 - (v * 1.2); // 0–100 -> fit 120px height, invert for SVG
        const buildPath = y => `M 0,${y} L 50,${y-5} L 100,${y+3} L 150,${y-2} L 200,${y+5} L 250,${y-8} L 300,${y}`;

        const defs = `
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
        `;

        let parts = [defs];

        // Previous series (if available)
        if (previousValue !== null) {
            const previousY = toY(previousValue);
            const previousPath = buildPath(previousY);
            parts.push(`
                <path class="chart-area" d="${previousPath} L 300,120 L 0,120 Z" fill="url(#previousGradient)" />
                <path class="chart-line" d="${previousPath}" style="stroke: #e5bb22; stroke-width: 2; fill: none; stroke-dasharray: 5,5;" />
                <circle cx="0" cy="${previousY}" r="3" fill="#e5bb22" />
                <circle cx="300" cy="${previousY}" r="3" fill="#e5bb22" />
            `);
        }

        // Current series (if available)
        if (currentValue !== null) {
            const currentY = toY(currentValue);
            const currentPath = buildPath(currentY);
            parts.push(`
                <path class="chart-area" d="${currentPath} L 300,120 L 0,120 Z" fill="url(#currentGradient)" />
                <path class="chart-line recover-line" d="${currentPath}" />
                <circle cx="0" cy="${currentY}" r="4" fill="#96a840" />
                <circle cx="300" cy="${currentY}" r="4" fill="#96a840" />
            `);
        }

        chartSvg.innerHTML = parts.join('');

        // Title + legend
        const reportTitle = document.querySelector('.report-title');
        if (reportTitle) {
            const isCurrencyMetric = (currentValue !== null && Math.abs(currentValue) >= 1000) ||
                (previousValue !== null && Math.abs(previousValue) >= 1000);

            const currentLabel = formatMetricValueForDisplay(currentValue);
            const previousLabel = formatMetricValueForDisplay(previousValue);

            let deltaText = 'Δ N/A';
            let deltaColor = '#9ca3af';

            if (currentValue !== null && previousValue !== null) {
                const diff = currentValue - previousValue;
                const up = diff >= 0;
                deltaColor = up ? '#4ade80' : '#f87171';

                if (isCurrencyMetric) {
                    const formattedDiff = formatPesoIfNeeded(Math.abs(diff), true);
                    deltaText = `${up ? '↑' : '↓'} ${formattedDiff}`;
                } else {
                    const formattedDiff = Math.abs(diff).toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                    });
                    deltaText = `${up ? '↑' : '↓'} ${formattedDiff}%`;
                }
            }

            reportTitle.innerHTML = `
                KPI Target and Actual - ${kpiName}  
                <div style="font-size: 12px; margin-top: 10px; display: flex; gap: 20px;">
                    <span style="color: #96a840;">● Current: ${currentLabel}</span>
                    <span style="color: #e5bb22;">● Previous: ${previousLabel}</span>
                    <span style="color: ${deltaColor};">${deltaText}</span>
                </div>
            `;
        }
    }

        // State management
        let currentView = 'operations';
        let currentOperationsView = 'lag';
        let selectedTeam = null;
        let selectedTeamData = null;
        let selectedYear = 2025;
        let selectedMonth = 10; // November (0-11, 10 = November)

        // Ensure report cards are visible on load
        function initializeReports() {
            const reportCards = document.querySelectorAll('.report-card');
            reportCards.forEach(card => {
                card.style.display = 'block';
            });
        }

        // Show report cards (kept for compatibility with existing flow)
        function showReportCards() {
            const reportCards = document.querySelectorAll('.report-card');
            reportCards.forEach(card => {
                card.style.display = 'block';
                const chartSvg = card.querySelector('svg.line-chart');
                const reportTitle = card.querySelector('.report-title');
                if (chartSvg && reportTitle && !chartSvg.querySelector('g')) {
                    chartSvg.innerHTML = '';
                    reportTitle.innerHTML = `
                        Team Performance Report
                        <div style="font-size: 12px; margin-top: 10px; color: #9ca3af;">
                            Click an Operation KPI to show the graph
                        </div>
                    `;
                }
            });
        }

        // Maintain legend state without hiding the card
        function showLegendOnly() {
            const reportCards = document.querySelectorAll('.report-card');
            reportCards.forEach(card => {
                card.style.display = 'block';
                const chartSvg = card.querySelector('svg.line-chart');
                const reportTitle = card.querySelector('.report-title');
                if (chartSvg && reportTitle) {
                    chartSvg.innerHTML = '';
                    reportTitle.innerHTML = `
                        Team Performance Report
                        <div style="font-size: 12px; margin-top: 10px; color: #9ca3af;">
                            Click an Operation KPI to show the graph
                        </div>
                    `;
                }
            });
        }

        let scoreboardToggleButtons = [];

        function initScoreboardToggle() {
            scoreboardToggleButtons = Array.from(document.querySelectorAll('.scoreboard-toggle-btn'));
            if (!scoreboardToggleButtons.length) {
                return;
            }

            scoreboardToggleButtons.forEach(button => {
                button.addEventListener('click', () => {
                    if (button.disabled) {
                        return;
                    }

                    const target = button.dataset.target === 'members' ? 'members' : 'lag';

                    // Reset the report card to its default instructional state
                    resetReportCardToInstruction(target);
                    
                    if (currentOperationsView === target) {
                        return;
                    }

                    // If switching to members view and section switch is on profile (active), switch back to operations
                    if (target === 'members' && currentView === 'profile') {
                        toggleSections();
                    }

                    currentOperationsView = target;
                    refreshOperationsContent();
                    updateScoreboardToggleState();
                });
            });

            updateScoreboardToggleState();
        }

        function updateScoreboardToggleState() {
            if (!scoreboardToggleButtons.length) {
                return;
            }

            scoreboardToggleButtons.forEach(button => {
                const target = button.dataset.target === 'members' ? 'members' : 'lag';
                const isActive = currentOperationsView === target;
                button.classList.toggle('active', isActive);
            });
        }

        // Navigation bar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Section switch functionality
        const sectionSwitch = document.getElementById('sectionSwitch');
        const sectionSwitch2 = document.getElementById('sectionSwitch2');
        const operationsSection = document.getElementById('operationsSection');
        const profileSection = document.getElementById('profileSection');
        const operationsSectionTitle = document.getElementById('operationsSectionTitle');
        const operationsSectionSubtitle = document.getElementById('operationsSectionSubtitle');
        const profileSectionSubtitle = document.getElementById('profileSectionSubtitle');

        function toggleSections() {
            currentView = currentView === 'operations' ? 'profile' : 'operations';
            
            sectionSwitch.classList.toggle('active');
            sectionSwitch2.classList.toggle('active');
            
                if (currentView === 'operations') {
                operationsSection.classList.remove('hidden');
                profileSection.classList.add('hidden');
                if (selectedTeam) {
                    showReportCards();
                    // Reset to instruction message when switching
                    const reportCards = document.querySelectorAll('.report-card');
                    const performanceCard = reportCards[0];
                    if (performanceCard) {
                        const chartSvg = performanceCard.querySelector('svg.line-chart');
                        const reportTitle = performanceCard.querySelector('.report-title');
                        if (chartSvg && reportTitle) {
                            chartSvg.innerHTML = '';
                            reportTitle.innerHTML = `
                                Team Performance Report
                                <div style="font-size: 12px; margin-top: 10px; color: #9ca3af;">
                                    Click an Operation KPI to show the graph
                                </div>
                            `;
                        }
                    }
                } else {
                    showLegendOnly();
                }
                refreshOperationsContent();
            } else {
                operationsSection.classList.add('hidden');
                profileSection.classList.remove('hidden');
                if (selectedTeam && selectedTeamData) {
                    // Update subtitle when switching to profile view with team selected
                    if (profileSectionSubtitle) {
                        profileSectionSubtitle.textContent = `${selectedTeamData.title} lead KPIs`;
                    }
                    showReportCards();
                    // Reset to instruction message when switching
                    const reportCards = document.querySelectorAll('.report-card');
                    const performanceCard = reportCards[0];
                    if (performanceCard) {
                        const chartSvg = performanceCard.querySelector('svg.line-chart');
                        const reportTitle = performanceCard.querySelector('.report-title');
                        if (chartSvg && reportTitle) {
                            chartSvg.innerHTML = '';
                            reportTitle.innerHTML = `
                                Team Performance Report
                                <div style="font-size: 12px; margin-top: 10px; color: #9ca3af;">
                                    Click an Operation KPI to show the graph
                                </div>
                            `;
                        }
                    }
                } else {
                    // Clear subtitle when no team is selected
                    if (profileSectionSubtitle) {
                        profileSectionSubtitle.textContent = '';
                    }
                    showLegendOnly();
                }
            }
        }

        sectionSwitch.addEventListener('click', toggleSections);
        sectionSwitch2.addEventListener('click', toggleSections);

        // Team Leader selection functionality
        const leaderCards = document.querySelectorAll('.leader-card');
        
        leaderCards.forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');

            card.addEventListener('click', function() {
                leaderCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                
                selectedTeam = normalizeTeamName(this.getAttribute('data-team'));
                selectedTeamData = {
                    name: this.getAttribute('data-name'),
                    title: this.getAttribute('data-title'),
                    roles: this.getAttribute('data-roles'),
                    contributions: this.getAttribute('data-contributions'),
                    icon: this.getAttribute('data-icon')
                };

                const teamShortNames = {
                    'Technical Team': 'Technical',
                    'Accounting Team': 'Accounting',
                    'LRAD Team': 'LRAD',
                    'DC Team': 'DC',
                    'Opportunity Team': 'Opportunity',
                    'Marcom Team': 'Marcom',
                    'Gathering Team': 'Gathering',
                    'Operations Team': 'Operations'
                };
                
                const teamShortName = teamShortNames[selectedTeam] || '';
                if (teamShortName) {
                    resetTeamPerformanceVisuals({
                        infoMessage: `Select a ${teamShortName} Team KPI to view its detailed monthly breakdown.`
                    });
                } else {
                    resetTeamPerformanceVisuals({
                        infoMessage: 'Select a KPI to view its detailed monthly breakdown.'
                    });
                }
                
                if (currentView === 'operations') {
                    showReportCards();
                } else {
                    showLegendOnly();
                }
                
                // Reset to instruction message when selecting a team
                const reportCards = document.querySelectorAll('.report-card');
                const performanceCard = reportCards[0];
                if (performanceCard) {
                    const chartSvg = performanceCard.querySelector('svg.line-chart');
                    const reportTitle = performanceCard.querySelector('.report-title');
                    if (chartSvg && reportTitle) {
                        chartSvg.innerHTML = '';
                        reportTitle.innerHTML = `
                            Team Performance Report
                            <div style="font-size: 12px; margin-top: 10px; color: #9ca3af;">
                                Click an Operation KPI to show the graph
                            </div>
                        `;
                    }
                }
                
                refreshOperationsContent();
                updateLeadKpiSection(selectedTeam, selectedTeamData.title);
            });

            card.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.click();
                }
            });
        });

        const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                           'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

        function updateOperationsSection(teamName, teamTitle) {
        const operationsContent = document.getElementById('operationsContent');
        const operations = teamOperationsData[teamName] || [];
        
        if (operations.length === 0) {
            // Hide search container and table header when no data
            const searchContainer = document.getElementById('operationsSearchContainer');
            if (searchContainer) {
                searchContainer.style.display = 'none';
            }
            const tableHeaderContainer = document.getElementById('operationsTableHeader');
            if (tableHeaderContainer) {
                tableHeaderContainer.style.display = 'none';
            }
            operationsContent.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <div class="empty-state-text">No Lag KPIs data available</div>
                </div>
            `;
            return;
        }
        
        // Show and populate search container in section-header
        setupSearchContainer('Search operations...');
        
        // Place table-header outside operationsContent
        const tableHeaderContainer = document.getElementById('operationsTableHeader');
        if (tableHeaderContainer) {
            tableHeaderContainer.innerHTML = `
                <div class="table-header">
                    <div>Operation KPI</div>
                    <div>KPI Owner</div>
                    <div class="header-group">
                        <div class="header-main">TARGET</div>
                    </div>
                    <div class="header-group">
                        <div class="header-main">ACTUAL</div>
                    </div>
                </div>
            `;
            tableHeaderContainer.style.display = 'block';
        }
        
        let html = `
            <div id="membersList">
        `;
        
        operations.forEach((op, index) => {
            const hasDropdown = teamDropdownData[teamName] && teamDropdownData[teamName][op.role];
            const dropdownClass = hasDropdown ? 'has-dropdown' : '';
            
            // Get period data if available
            const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
            const periodData = technicalExpensesData[teamName]?.[op.role]?.[periodKey];
            
            const targetNumeric = periodData ? periodData.target : null;
            const actualNumeric = periodData ? periodData.actual : null;
            const isPercentageKpi = op.role.includes('%') || op.role.toLowerCase().includes('percent');
            const targetValue = periodData ? formatValueForDisplay(periodData.target, isPercentageKpi) : '-';
            const actualValue = periodData ? formatValueForDisplay(periodData.actual, isPercentageKpi) : '-';
            
            html += `
                <div class="member-row ${dropdownClass}" 
                     data-name="${op.owner.toLowerCase()}" 
                     data-team="${teamName.toLowerCase()}" 
                     data-index="${index}"
                     data-operation="${op.role}"
                     data-target="${targetNumeric !== null ? targetNumeric : ''}"
                     data-actual="${actualNumeric !== null ? actualNumeric : ''}"
                     style="cursor: pointer;">
                    <div class="member-info">
                        <div class="member-name">${op.role}</div>
                    </div>
                    <div>${op.owner}</div>
                    <div class="target-group">
                        <div>${targetValue}</div>
                    </div>
                    <div class="actual-group">
                        <div>${actualValue}</div>
                    </div>
                </div>
            `;
            
            // Add dropdown content if available
            if (hasDropdown) {
                const dropdownItems = teamDropdownData[teamName][op.role];
                html += `
                    <div class="sub-operations" id="dropdown-${index}">
                `;
                
                dropdownItems.forEach(item => {
                    const targetValue = item.hasOwnProperty('target') ? formatPesoIfNeeded(item.target) : '-';
                    const weightValue = item.hasOwnProperty('weight') ? item.weight : '-';
                    html += `
                        <div class="sub-operation-item">
                            <div class="sub-operation-label">${item.kpi}</div>
                            <div>-</div>
                            <div class="target-group">
                                <div><span class="target-badge">${targetValue || '-'}</span></div>
                                <div>-</div>
                            </div>
                            <div class="actual-group">
                                <div><span class="weight-badge">${weightValue || '-'}</span></div>
                                <div>-</div>
                            </div>
                        </div>
                    `;
                });
                
                html += `</div>`;
            }
        });
        
        html += '</div>';
        operationsContent.innerHTML = html;
        
        attachSearchFunctionality();
        attachDropdownFunctionality(teamName);
        attachMemberRowClickHandlers();
    }


        function generateInitials(name = '') {
            return name
                .split(' ')
                .filter(part => part.trim() !== '')
                .slice(0, 2)
                .map(part => part.charAt(0).toUpperCase())
                .join('') || 'TM';
        }

        async function updateTeamMembersSection(teamName, teamTitle) {
            const operationsContent = document.getElementById('operationsContent');
            if (!operationsContent) {
                return;
            }
            
            // Special handling for Technical Team with new structure
            if (teamName === 'Technical Team' && technicalTeamByOwner[teamName]) {
                const technicalData = technicalTeamByOwner[teamName];
                const owners = Object.keys(technicalData);
                
                if (owners.length === 0) {
                    // Hide search container when no data
                    const searchContainer = document.getElementById('operationsSearchContainer');
                    if (searchContainer) {
                        searchContainer.style.display = 'none';
                    }
                    operationsContent.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">👥</div>
                            <div class="empty-state-text">No team members data available for ${teamTitle || teamName}</div>
                        </div>
                    `;
                    return;
                }
                
                // Show and populate search container in section-header
                setupSearchContainer('Search team members...');
                
                // Place table-header outside operationsContent
                const tableHeaderContainer = document.getElementById('operationsTableHeader');
                if (tableHeaderContainer) {
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>Operational KRA</div>
                            <div class="header-group">
                                <div class="header-main">TARGET</div>
                            </div>
                            <div class="header-group">
                                <div class="header-main">ACTUAL</div>
                            </div>
                            <div>% Operational KPI Weight</div>
                        </div>
                    `;
                    tableHeaderContainer.style.display = 'block';
                }
                
                let html = `
                    <div id="membersList">
                `;
                
                let globalIndex = 0;
                const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
                const roleOwners = technicalTeamRoleOwners[teamName] || {};
                
                owners.forEach(owner => {
                    const kras = technicalData[owner];
                    const roleOwner = roleOwners[owner] || '-';
                    
                    kras.forEach(kraData => {
                        const hasDropdown = kraData.kpis && kraData.kpis.length > 0;
                        const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                        
                        // Generate random target and actual values for the KRA
                        // Calculate total weight for this KRA (sum of all KPI weights)
                        const totalKraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                weightValue = parseFloat(weightStr) || 0;
                            }
                            return sum + weightValue;
                        }, 0) : 0;
                        
                        const kpiWeightsData = hasDropdown ? kraData.kpis.map(kpi => {
                            // Parse weight value, handling percentage signs
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                // Remove % sign and any whitespace, then parse
                                const weightStr = String(kpi.weight).replace(/%/g, '').replace(/,/g, '').trim();
                                weightValue = parseFloat(weightStr);
                                // If parseFloat returns NaN, default to 0
                                if (isNaN(weightValue)) {
                                    weightValue = 0;
                                }
                            }
                            return {
                                name: kpi.kpi,
                                weight: weightValue
                            };
                        }) : [];
                        
                        // Generate random target and actual (for display purposes)
                        const baseTarget = 100; // Base value
                        const targetValue = baseTarget + randomIntInRange(-10, 10);
                        const actualValue = baseTarget + randomIntInRange(-15, 15);
                        
                        // Properly escape JSON for HTML attribute (escape quotes and HTML entities)
                        const kpiWeightsJson = JSON.stringify(kpiWeightsData);
                        // Escape double quotes for HTML attribute (since we're using double quotes for the attribute)
                        const kpiWeightsEscaped = kpiWeightsJson.replace(/"/g, '&quot;');
                        
                        html += `
                            <div class="member-row technical-team-kra-row ${dropdownClass}" 
                                 data-name="${owner.toLowerCase()}" 
                                 data-team="${teamName.toLowerCase()}" 
                                 data-index="${globalIndex}"
                                 data-operation="${escapeAttributeValue(kraData.kra)}"
                                 data-owner="${escapeAttributeValue(owner)}"
                                 data-target="${targetValue}"
                                 data-actual="${actualValue}"
                                 data-weight="${totalKraWeight}"
                                 data-kpi-weights="${kpiWeightsEscaped}"
                                 style="cursor: pointer;">
                                <div>${roleOwner}</div>
                                <div class="member-info">
                                    <div class="member-name">${owner}</div>
                                </div>
                                <div>${kraData.kra}</div>
                                <div class="target-group">
                                    <div>${targetValue}</div>
                                </div>
                                <div class="actual-group">
                                    <div>${actualValue}</div>
                                </div>
                                <div>-</div>
                            </div>
                        `;
                        
                        // Add dropdown content with Operational KPIs
                        if (hasDropdown) {
                            html += `
                                <div class="sub-operations" id="dropdown-${globalIndex}">
                            `;
                            
                            kraData.kpis.forEach(kpiItem => {
                                // Get actual value from period data if available
                                const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                const actualNumeric = periodData ? periodData.actual : null;
                                const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                
                                // Parse target for data attribute first (before formatting)
                                let targetNumericForData = null;
                                if (kpiItem.target && kpiItem.target !== '-') {
                                    targetNumericForData = parseNumericValue(kpiItem.target);
                                }
                                
                                // Format target value for display
                                let targetDisplay = kpiItem.target || '-';
                                if (targetNumericForData !== null) {
                                    if (targetNumericForData >= 1000) {
                                        targetDisplay = formatPesoIfNeeded(targetNumericForData, true);
                                    } else if (isPercentageKpi) {
                                        targetDisplay = `${targetNumericForData}%`;
                                    } else {
                                        targetDisplay = targetNumericForData.toString();
                                    }
                                }
                                
                                // Format actual value
                                let actualDisplay = '-';
                                if (actualNumeric !== null) {
                                    actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                }
                                
                                html += `
                                    <div class="sub-operation-item" 
                                         data-kpi="${kpiItem.kpi}"
                                         data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                         data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                        <div class="sub-operation-label">${kpiItem.kpi}</div>
                                        <div><span class="target-badge">${targetDisplay}</span></div>
                                        <div><span class="target-badge">${actualDisplay}</span></div>
                                        <div><span class="weight-badge">${kpiItem.weight || '-'}</span></div>
                                    </div>
                                `;
                            });
                            
                            html += `</div>`;
                        }
                        
                        globalIndex++;
                    });
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('technical-team-view');
                
                attachSearchFunctionality();
                attachDropdownFunctionality(teamName);
                attachMemberRowClickHandlers();
                return;
            }
            
            // Special handling for Accounting Team with new structure
            if (teamName === 'Accounting Team' && accountingTeamByOwner[teamName]) {
                const accountingData = accountingTeamByOwner[teamName];
                const owners = Object.keys(accountingData);
                
                if (owners.length === 0) {
                    // Hide search container when no data
                    const searchContainer = document.getElementById('operationsSearchContainer');
                    if (searchContainer) {
                        searchContainer.style.display = 'none';
                    }
                    operationsContent.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">👥</div>
                            <div class="empty-state-text">No team members data available for ${teamTitle || teamName}</div>
                        </div>
                    `;
                    return;
                }
                
                // Show and populate search container in section-header
                setupSearchContainer('Search team members...');
                
                // Place table-header outside operationsContent
                const tableHeaderContainer = document.getElementById('operationsTableHeader');
                if (tableHeaderContainer) {
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>Operational KRA</div>
                            <div class="header-group">
                                <div class="header-main">TARGET</div>
                            </div>
                            <div class="header-group">
                                <div class="header-main">ACTUAL</div>
                            </div>
                            <div>% Operational KPI Weight</div>
                        </div>
                    `;
                    tableHeaderContainer.style.display = 'block';
                }
                
                let html = `
                    <div id="membersList">
                `;
                
                let globalIndex = 0;
                const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
                const roleOwners = accountingTeamRoleOwners[teamName] || {};
                
                owners.forEach(owner => {
                    const kras = accountingData[owner];
                    const roleOwner = roleOwners[owner] || '-';
                    
                    kras.forEach(kraData => {
                        const hasDropdown = kraData.kpis && kraData.kpis.length > 0;
                        const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                        
                        // Generate random target and actual values for the KRA
                        // Calculate total weight for this KRA (sum of all KPI weights)
                        const totalKraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                weightValue = parseFloat(weightStr) || 0;
                            }
                            return sum + weightValue;
                        }, 0) : 0;
                        
                        const kpiWeightsData = hasDropdown ? kraData.kpis.map(kpi => {
                            // Parse weight value, handling percentage signs
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                // Remove % sign and any whitespace, then parse
                                const weightStr = String(kpi.weight).replace(/%/g, '').replace(/,/g, '').trim();
                                weightValue = parseFloat(weightStr);
                                // If parseFloat returns NaN, default to 0
                                if (isNaN(weightValue)) {
                                    weightValue = 0;
                                }
                            }
                            return {
                                name: kpi.kpi,
                                weight: weightValue
                            };
                        }) : [];
                        
                        // Generate random target and actual (for display purposes)
                        const baseTarget = 100; // Base value
                        const targetValue = baseTarget + randomIntInRange(-10, 10);
                        const actualValue = baseTarget + randomIntInRange(-15, 15);
                        
                        // Properly escape JSON for HTML attribute (escape quotes and HTML entities)
                        const kpiWeightsJson = JSON.stringify(kpiWeightsData);
                        // Escape double quotes for HTML attribute (since we're using double quotes for the attribute)
                        const kpiWeightsEscaped = kpiWeightsJson.replace(/"/g, '&quot;');
                        
                        html += `
                            <div class="member-row accounting-team-kra-row ${dropdownClass}" 
                                 data-name="${owner.toLowerCase()}" 
                                 data-team="${teamName.toLowerCase()}" 
                                 data-index="${globalIndex}"
                                 data-operation="${escapeAttributeValue(kraData.kra)}"
                                 data-owner="${escapeAttributeValue(owner)}"
                                 data-target="${targetValue}"
                                 data-actual="${actualValue}"
                                 data-weight="${totalKraWeight}"
                                 data-kpi-weights="${kpiWeightsEscaped}"
                                 style="cursor: pointer;">
                                <div>${roleOwner}</div>
                                <div class="member-info">
                                    <div class="member-name">${owner}</div>
                                </div>
                                <div>${kraData.kra}</div>
                                <div class="target-group">
                                    <div>${targetValue}</div>
                                </div>
                                <div class="actual-group">
                                    <div>${actualValue}</div>
                                </div>
                                <div>-</div>
                            </div>
                        `;
                        
                        // Add dropdown content with Operational KPIs
                        if (hasDropdown) {
                            html += `
                                <div class="sub-operations" id="dropdown-${globalIndex}">
                            `;
                            
                            kraData.kpis.forEach(kpiItem => {
                                // Get actual value from period data if available
                                const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                const actualNumeric = periodData ? periodData.actual : null;
                                const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                
                                // Parse target for data attribute first (before formatting)
                                let targetNumericForData = null;
                                if (kpiItem.target && kpiItem.target !== '-') {
                                    targetNumericForData = parseNumericValue(kpiItem.target);
                                }
                                
                                // Format target value for display
                                let targetDisplay = kpiItem.target || '-';
                                if (targetNumericForData !== null) {
                                    if (targetNumericForData >= 1000) {
                                        targetDisplay = formatPesoIfNeeded(targetNumericForData, true);
                                    } else if (isPercentageKpi) {
                                        targetDisplay = `${targetNumericForData}%`;
                                    } else {
                                        targetDisplay = targetNumericForData.toString();
                                    }
                                }
                                
                                // Format actual value
                                let actualDisplay = '-';
                                if (actualNumeric !== null) {
                                    actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                }
                                
                                html += `
                                    <div class="sub-operation-item" 
                                         data-kpi="${kpiItem.kpi}"
                                         data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                         data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                        <div class="sub-operation-label">${kpiItem.kpi}</div>
                                        <div><span class="target-badge">${targetDisplay}</span></div>
                                        <div><span class="target-badge">${actualDisplay}</span></div>
                                        <div><span class="weight-badge">${kpiItem.weight || '-'}</span></div>
                                    </div>
                                `;
                            });
                            
                            html += `</div>`;
                        }
                        
                        globalIndex++;
                    });
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('accounting-team-view');
                
                attachSearchFunctionality();
                attachDropdownFunctionality(teamName);
                attachMemberRowClickHandlers();
                return;
            }
            
            // Special handling for LRAD Team with new structure
            if (teamName === 'LRAD Team' && lradTeamByOwner[teamName]) {
                const lradData = lradTeamByOwner[teamName];
                const owners = Object.keys(lradData);
                
                if (owners.length === 0) {
                    // Hide search container when no data
                    const searchContainer = document.getElementById('operationsSearchContainer');
                    if (searchContainer) {
                        searchContainer.style.display = 'none';
                    }
                    operationsContent.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">👥</div>
                            <div class="empty-state-text">No team members data available for ${teamTitle || teamName}</div>
                        </div>
                    `;
                    return;
                }
                
                // Show and populate search container in section-header
                setupSearchContainer('Search team members...');
                
                // Place table-header outside operationsContent
                const tableHeaderContainer = document.getElementById('operationsTableHeader');
                if (tableHeaderContainer) {
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>Operational KRA</div>
                            <div class="header-group">
                                <div class="header-main">TARGET</div>
                            </div>
                            <div class="header-group">
                                <div class="header-main">ACTUAL</div>
                            </div>
                            <div>% Operational KPI Weight</div>
                        </div>
                    `;
                    tableHeaderContainer.style.display = 'block';
                }
                
                let html = `
                    <div id="membersList">
                `;
                
                let globalIndex = 0;
                const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
                const roleOwners = lradTeamRoleOwners[teamName] || {};
                
                owners.forEach(owner => {
                    const kras = lradData[owner];
                    const roleOwner = roleOwners[owner] || '-';
                    
                    kras.forEach(kraData => {
                        const hasDropdown = kraData.kpis && kraData.kpis.length > 0;
                        const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                        
                        // Generate random target and actual values for the KRA
                        // Calculate total weight for this KRA (sum of all KPI weights)
                        const totalKraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                weightValue = parseFloat(weightStr) || 0;
                            }
                            return sum + weightValue;
                        }, 0) : 0;
                        
                        const kpiWeightsData = hasDropdown ? kraData.kpis.map(kpi => {
                            // Parse weight value, handling percentage signs
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                // Remove % sign and any whitespace, then parse
                                const weightStr = String(kpi.weight).replace(/%/g, '').replace(/,/g, '').trim();
                                weightValue = parseFloat(weightStr);
                                // If parseFloat returns NaN, default to 0
                                if (isNaN(weightValue)) {
                                    weightValue = 0;
                                }
                            }
                            return {
                                name: kpi.kpi,
                                weight: weightValue
                            };
                        }) : [];
                        
                        // Generate random target and actual (for display purposes)
                        const baseTarget = 100; // Base value
                        const targetValue = baseTarget + randomIntInRange(-10, 10);
                        const actualValue = baseTarget + randomIntInRange(-15, 15);
                        
                        // Properly escape JSON for HTML attribute (escape quotes and HTML entities)
                        const kpiWeightsJson = JSON.stringify(kpiWeightsData);
                        // Escape double quotes for HTML attribute (since we're using double quotes for the attribute)
                        const kpiWeightsEscaped = kpiWeightsJson.replace(/"/g, '&quot;');
                        
                        html += `
                            <div class="member-row lrad-team-kra-row ${dropdownClass}" 
                                 data-name="${owner.toLowerCase()}" 
                                 data-team="${teamName.toLowerCase()}" 
                                 data-index="${globalIndex}"
                                 data-operation="${escapeAttributeValue(kraData.kra)}"
                                 data-owner="${escapeAttributeValue(owner)}"
                                 data-target="${targetValue}"
                                 data-actual="${actualValue}"
                                 data-weight="${totalKraWeight}"
                                 data-kpi-weights="${kpiWeightsEscaped}"
                                 style="cursor: pointer;">
                                <div>${roleOwner}</div>
                                <div class="member-info">
                                    <div class="member-name">${owner}</div>
                                </div>
                                <div>${kraData.kra}</div>
                                <div class="target-group">
                                    <div>${targetValue}</div>
                                </div>
                                <div class="actual-group">
                                    <div>${actualValue}</div>
                                </div>
                                <div>-</div>
                            </div>
                        `;
                        
                        // Add dropdown content with Operational KPIs
                        if (hasDropdown) {
                            html += `
                                <div class="sub-operations" id="dropdown-${globalIndex}">
                            `;
                            
                            kraData.kpis.forEach(kpiItem => {
                                // Get actual value from period data if available
                                const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                const actualNumeric = periodData ? periodData.actual : null;
                                const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                
                                // Parse target for data attribute first (before formatting)
                                let targetNumericForData = null;
                                if (kpiItem.target && kpiItem.target !== '-') {
                                    targetNumericForData = parseNumericValue(kpiItem.target);
                                }
                                
                                // Format target value for display
                                let targetDisplay = kpiItem.target || '-';
                                if (targetNumericForData !== null) {
                                    if (targetNumericForData >= 1000) {
                                        targetDisplay = formatPesoIfNeeded(targetNumericForData, true);
                                    } else if (isPercentageKpi) {
                                        targetDisplay = `${targetNumericForData}%`;
                                    } else {
                                        targetDisplay = targetNumericForData.toString();
                                    }
                                }
                                
                                // Format actual value
                                let actualDisplay = '-';
                                if (actualNumeric !== null) {
                                    actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                }
                                
                                html += `
                                    <div class="sub-operation-item" 
                                         data-kpi="${kpiItem.kpi}"
                                         data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                         data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                        <div class="sub-operation-label">${kpiItem.kpi}</div>
                                        <div><span class="target-badge">${targetDisplay}</span></div>
                                        <div><span class="target-badge">${actualDisplay}</span></div>
                                        <div><span class="weight-badge">${kpiItem.weight || '-'}</span></div>
                                    </div>
                                `;
                            });
                            
                            html += `</div>`;
                        }
                        
                        globalIndex++;
                    });
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('lrad-team-view');
                
                attachSearchFunctionality();
                attachDropdownFunctionality(teamName);
                attachMemberRowClickHandlers();
                return;
            }
            
            // Special handling for Quality Team with new structure
            if (teamName === 'Quality Team' && qualityTeamByOwner[teamName]) {
                const qualityData = qualityTeamByOwner[teamName];
                const owners = Object.keys(qualityData);
                
                if (owners.length === 0) {
                    // Hide search container when no data
                    const searchContainer = document.getElementById('operationsSearchContainer');
                    if (searchContainer) {
                        searchContainer.style.display = 'none';
                    }
                    operationsContent.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">👥</div>
                            <div class="empty-state-text">No team members data available for ${teamTitle || teamName}</div>
                        </div>
                    `;
                    return;
                }
                
                // Show and populate search container in section-header
                setupSearchContainer('Search team members...');
                
                // Place table-header outside operationsContent
                const tableHeaderContainer = document.getElementById('operationsTableHeader');
                if (tableHeaderContainer) {
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>Operational KRA</div>
                            <div class="header-group">
                                <div class="header-main">TARGET</div>
                            </div>
                            <div class="header-group">
                                <div class="header-main">ACTUAL</div>
                            </div>
                            <div>% Operational KPI Weight</div>
                        </div>
                    `;
                    tableHeaderContainer.style.display = 'block';
                }
                
                let html = `
                    <div id="membersList">
                `;
                
                let globalIndex = 0;
                const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
                const roleOwners = qualityTeamRoleOwners[teamName] || {};
                
                owners.forEach(owner => {
                    const kras = qualityData[owner];
                    const roleOwner = roleOwners[owner] || '-';
                    
                    kras.forEach(kraData => {
                        const hasDropdown = kraData.kpis && kraData.kpis.length > 0;
                        const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                        
                        // Generate random target and actual values for the KRA
                        // Calculate total weight for this KRA (sum of all KPI weights)
                        const totalKraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                weightValue = parseFloat(weightStr) || 0;
                            }
                            return sum + weightValue;
                        }, 0) : 0;
                        
                        const kpiWeightsData = hasDropdown ? kraData.kpis.map(kpi => {
                            // Parse weight value, handling percentage signs
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                // Remove % sign and any whitespace, then parse
                                const weightStr = String(kpi.weight).replace(/%/g, '').replace(/,/g, '').trim();
                                weightValue = parseFloat(weightStr);
                                // If parseFloat returns NaN, default to 0
                                if (isNaN(weightValue)) {
                                    weightValue = 0;
                                }
                            }
                            return {
                                name: kpi.kpi,
                                weight: weightValue
                            };
                        }) : [];
                        
                        // Generate random target and actual (for display purposes)
                        const baseTarget = 100; // Base value
                        const targetValue = baseTarget + randomIntInRange(-10, 10);
                        const actualValue = baseTarget + randomIntInRange(-15, 15);
                        
                        // Properly escape JSON for HTML attribute (escape quotes and HTML entities)
                        const kpiWeightsJson = JSON.stringify(kpiWeightsData);
                        // Escape double quotes for HTML attribute (since we're using double quotes for the attribute)
                        const kpiWeightsEscaped = kpiWeightsJson.replace(/"/g, '&quot;');
                        
                        html += `
                            <div class="member-row quality-team-kra-row ${dropdownClass}" 
                                 data-name="${owner.toLowerCase()}" 
                                 data-team="${teamName.toLowerCase()}" 
                                 data-index="${globalIndex}"
                                 data-operation="${escapeAttributeValue(kraData.kra)}"
                                 data-owner="${escapeAttributeValue(owner)}"
                                 data-target="${targetValue}"
                                 data-actual="${actualValue}"
                                 data-weight="${totalKraWeight}"
                                 data-kpi-weights="${kpiWeightsEscaped}"
                                 style="cursor: pointer;">
                                <div>${roleOwner}</div>
                                <div class="member-info">
                                    <div class="member-name">${owner}</div>
                                </div>
                                <div>${kraData.kra}</div>
                                <div class="target-group">
                                    <div>${targetValue}</div>
                                </div>
                                <div class="actual-group">
                                    <div>${actualValue}</div>
                                </div>
                                <div>-</div>
                            </div>
                        `;
                        
                        // Add dropdown content with Operational KPIs
                        if (hasDropdown) {
                            html += `
                                <div class="sub-operations" id="dropdown-${globalIndex}">
                            `;
                            
                            kraData.kpis.forEach(kpiItem => {
                                // Get actual value from period data if available
                                const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                const actualNumeric = periodData ? periodData.actual : null;
                                const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                
                                // Parse target for data attribute first (before formatting)
                                let targetNumericForData = null;
                                if (kpiItem.target && kpiItem.target !== '-') {
                                    targetNumericForData = parseNumericValue(kpiItem.target);
                                }
                                
                                // Format target value for display
                                let targetDisplay = kpiItem.target || '-';
                                if (targetNumericForData !== null) {
                                    if (targetNumericForData >= 1000) {
                                        targetDisplay = formatPesoIfNeeded(targetNumericForData, true);
                                    } else if (isPercentageKpi) {
                                        targetDisplay = `${targetNumericForData}%`;
                                    } else {
                                        targetDisplay = targetNumericForData.toString();
                                    }
                                }
                                
                                // Format actual value
                                let actualDisplay = '-';
                                if (actualNumeric !== null) {
                                    actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                }
                                
                                html += `
                                    <div class="sub-operation-item" 
                                         data-kpi="${kpiItem.kpi}"
                                         data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                         data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                        <div class="sub-operation-label">${kpiItem.kpi}</div>
                                        <div><span class="target-badge">${targetDisplay}</span></div>
                                        <div><span class="target-badge">${actualDisplay}</span></div>
                                        <div><span class="weight-badge">${kpiItem.weight || '-'}</span></div>
                                    </div>
                                `;
                            });
                            
                            html += `</div>`;
                        }
                        
                        globalIndex++;
                    });
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('quality-team-view');
                
                attachSearchFunctionality();
                attachDropdownFunctionality(teamName);
                attachMemberRowClickHandlers();
                return;
            }
            
            // Special handling for DC Team with new structure
            if (teamName === 'DC Team' && dcTeamByOwner[teamName]) {
                const dcData = dcTeamByOwner[teamName];
                const owners = Object.keys(dcData);
                
                if (owners.length === 0) {
                    // Hide search container when no data
                    const searchContainer = document.getElementById('operationsSearchContainer');
                    if (searchContainer) {
                        searchContainer.style.display = 'none';
                    }
                    operationsContent.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">👥</div>
                            <div class="empty-state-text">No team members data available for ${teamTitle || teamName}</div>
                        </div>
                    `;
                    return;
                }
                
                // Show and populate search container in section-header
                setupSearchContainer('Search team members...');
                
                // Place table-header outside operationsContent
                const tableHeaderContainer = document.getElementById('operationsTableHeader');
                if (tableHeaderContainer) {
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>Operational KRA</div>
                            <div class="header-group">
                                <div class="header-main">TARGET</div>
                            </div>
                            <div class="header-group">
                                <div class="header-main">ACTUAL</div>
                            </div>
                            <div>% Operational KPI Weight</div>
                        </div>
                    `;
                    tableHeaderContainer.style.display = 'block';
                }
                
                let html = `
                    <div id="membersList">
                `;
                
                let globalIndex = 0;
                const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
                const roleOwners = dcTeamRoleOwners[teamName] || {};
                
                owners.forEach(owner => {
                    const kras = dcData[owner];
                    const roleOwner = roleOwners[owner] || '-';
                    
                    kras.forEach(kraData => {
                        const hasDropdown = kraData.kpis && kraData.kpis.length > 0;
                        const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                        
                        const totalKraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                weightValue = parseFloat(weightStr) || 0;
                            }
                            return sum + weightValue;
                        }, 0) : 0;
                        
                        const kpiWeightsData = hasDropdown ? kraData.kpis.map(kpi => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').replace(/,/g, '').trim();
                                weightValue = parseFloat(weightStr);
                                if (isNaN(weightValue)) {
                                    weightValue = 0;
                                }
                            }
                            return {
                                name: kpi.kpi,
                                weight: weightValue
                            };
                        }) : [];
                        
                        const baseTarget = 100;
                        const targetValue = baseTarget + randomIntInRange(-10, 10);
                        const actualValue = baseTarget + randomIntInRange(-15, 15);
                        
                        const kpiWeightsJson = JSON.stringify(kpiWeightsData);
                        const kpiWeightsEscaped = kpiWeightsJson.replace(/"/g, '&quot;');
                        
                        html += `
                            <div class="member-row dc-team-kra-row ${dropdownClass}" 
                                 data-name="${owner.toLowerCase()}" 
                                 data-team="${teamName.toLowerCase()}" 
                                 data-index="${globalIndex}"
                                 data-operation="${escapeAttributeValue(kraData.kra)}"
                                 data-owner="${escapeAttributeValue(owner)}"
                                 data-target="${targetValue}"
                                 data-actual="${actualValue}"
                                 data-weight="${totalKraWeight}"
                                 data-kpi-weights="${kpiWeightsEscaped}"
                                 style="cursor: pointer;">
                                <div>${roleOwner}</div>
                                <div class="member-info">
                                    <div class="member-name">${owner}</div>
                                </div>
                                <div>${kraData.kra}</div>
                                <div class="target-group">
                                    <div>${targetValue}</div>
                                </div>
                                <div class="actual-group">
                                    <div>${actualValue}</div>
                                </div>
                                <div>-</div>
                            </div>
                        `;
                        
                        if (hasDropdown) {
                            html += `
                                <div class="sub-operations" id="dropdown-${globalIndex}">
                            `;
                            
                            kraData.kpis.forEach(kpiItem => {
                                const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                const actualNumeric = periodData ? periodData.actual : null;
                                const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                
                                let targetNumericForData = null;
                                if (kpiItem.target && kpiItem.target !== '-') {
                                    targetNumericForData = parseNumericValue(kpiItem.target);
                                }
                                
                                let targetDisplay = kpiItem.target || '-';
                                if (targetNumericForData !== null) {
                                    if (targetNumericForData >= 1000) {
                                        targetDisplay = formatPesoIfNeeded(targetNumericForData, true);
                                    } else if (isPercentageKpi) {
                                        targetDisplay = `${targetNumericForData}%`;
                                    } else {
                                        targetDisplay = targetNumericForData.toString();
                                    }
                                }
                                
                                let actualDisplay = '-';
                                if (actualNumeric !== null) {
                                    actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                }
                                
                                html += `
                                    <div class="sub-operation-item" 
                                         data-kpi="${kpiItem.kpi}"
                                         data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                         data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                        <div class="sub-operation-label">${kpiItem.kpi}</div>
                                        <div><span class="target-badge">${targetDisplay}</span></div>
                                        <div><span class="target-badge">${actualDisplay}</span></div>
                                        <div><span class="weight-badge">${kpiItem.weight || '-'}</span></div>
                                    </div>
                                `;
                            });
                            
                            html += `</div>`;
                        }
                        
                        globalIndex++;
                    });
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('dc-team-view');
                
                attachSearchFunctionality();
                attachDropdownFunctionality(teamName);
                attachMemberRowClickHandlers();
                return;
            }
            
            // Special handling for Opportunity Team with new structure
            if (teamName === 'Opportunity Team' && opportunityTeamByOwner[teamName]) {
                const opportunityData = opportunityTeamByOwner[teamName];
                const owners = Object.keys(opportunityData);
                
                if (owners.length === 0) {
                    // Hide search container when no data
                    const searchContainer = document.getElementById('operationsSearchContainer');
                    if (searchContainer) {
                        searchContainer.style.display = 'none';
                    }
                    operationsContent.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">👥</div>
                            <div class="empty-state-text">No team members data available for ${teamTitle || teamName}</div>
                        </div>
                    `;
                    return;
                }
                
                // Show and populate search container in section-header
                setupSearchContainer('Search team members...');
                
                // Place table-header outside operationsContent
                const tableHeaderContainer = document.getElementById('operationsTableHeader');
                if (tableHeaderContainer) {
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>Operational KRA</div>
                            <div class="header-group">
                                <div class="header-main">TARGET</div>
                            </div>
                            <div class="header-group">
                                <div class="header-main">ACTUAL</div>
                            </div>
                            <div>% Operational KPI Weight</div>
                        </div>
                    `;
                    tableHeaderContainer.style.display = 'block';
                }
                
                let html = `
                    <div id="membersList">
                `;
                
                let globalIndex = 0;
                const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
                const roleOwners = opportunityTeamRoleOwners[teamName] || {};
                
                owners.forEach(owner => {
                    const kras = opportunityData[owner];
                    const roleOwner = roleOwners[owner] || '-';
                    
                    kras.forEach(kraData => {
                        const hasDropdown = kraData.kpis && kraData.kpis.length > 0;
                        const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                        
                        const totalKraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                weightValue = parseFloat(weightStr) || 0;
                            }
                            return sum + weightValue;
                        }, 0) : 0;
                        
                        const kpiWeightsData = hasDropdown ? kraData.kpis.map(kpi => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').replace(/,/g, '').trim();
                                weightValue = parseFloat(weightStr);
                                if (isNaN(weightValue)) {
                                    weightValue = 0;
                                }
                            }
                            return {
                                name: kpi.kpi,
                                weight: weightValue
                            };
                        }) : [];
                        
                        const baseTarget = 100;
                        const targetValue = baseTarget + randomIntInRange(-10, 10);
                        const actualValue = baseTarget + randomIntInRange(-15, 15);
                        
                        const kpiWeightsJson = JSON.stringify(kpiWeightsData);
                        const kpiWeightsEscaped = kpiWeightsJson.replace(/"/g, '&quot;');
                        
                        html += `
                            <div class="member-row opportunity-team-kra-row ${dropdownClass}" 
                                 data-name="${owner.toLowerCase()}" 
                                 data-team="${teamName.toLowerCase()}" 
                                 data-index="${globalIndex}"
                                 data-operation="${escapeAttributeValue(kraData.kra)}"
                                 data-owner="${escapeAttributeValue(owner)}"
                                 data-target="${targetValue}"
                                 data-actual="${actualValue}"
                                 data-weight="${totalKraWeight}"
                                 data-kpi-weights="${kpiWeightsEscaped}"
                                 style="cursor: pointer;">
                                <div>${roleOwner}</div>
                                <div class="member-info">
                                    <div class="member-name">${owner}</div>
                                </div>
                                <div>${kraData.kra}</div>
                                <div class="target-group">
                                    <div>${targetValue}</div>
                                </div>
                                <div class="actual-group">
                                    <div>${actualValue}</div>
                                </div>
                                <div>-</div>
                            </div>
                        `;
                        
                        if (hasDropdown) {
                            html += `
                                <div class="sub-operations" id="dropdown-${globalIndex}">
                            `;
                            
                            kraData.kpis.forEach(kpiItem => {
                                const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                const actualNumeric = periodData ? periodData.actual : null;
                                const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                
                                let targetNumericForData = null;
                                if (kpiItem.target && kpiItem.target !== '-') {
                                    targetNumericForData = parseNumericValue(kpiItem.target);
                                }
                                
                                let targetDisplay = kpiItem.target || '-';
                                if (targetNumericForData !== null) {
                                    if (targetNumericForData >= 1000) {
                                        targetDisplay = formatPesoIfNeeded(targetNumericForData, true);
                                    } else if (isPercentageKpi) {
                                        targetDisplay = `${targetNumericForData}%`;
                                    } else {
                                        targetDisplay = targetNumericForData.toString();
                                    }
                                }
                                
                                let actualDisplay = '-';
                                if (actualNumeric !== null) {
                                    actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                }
                                
                                html += `
                                    <div class="sub-operation-item" 
                                         data-kpi="${kpiItem.kpi}"
                                         data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                         data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                        <div class="sub-operation-label">${kpiItem.kpi}</div>
                                        <div><span class="target-badge">${targetDisplay}</span></div>
                                        <div><span class="target-badge">${actualDisplay}</span></div>
                                        <div><span class="weight-badge">${kpiItem.weight || '-'}</span></div>
                                    </div>
                                `;
                            });
                            
                            html += `</div>`;
                        }
                        
                        globalIndex++;
                    });
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('opportunity-team-view');
                
                attachSearchFunctionality();
                attachDropdownFunctionality(teamName);
                attachMemberRowClickHandlers();
                return;
            }
            
            // Special handling for IT Team with new structure
            if (teamName === 'IT Team' && itTeamByOwner[teamName]) {
                const itData = itTeamByOwner[teamName];
                const owners = Object.keys(itData);
                
                if (owners.length === 0) {
                    // Hide search container when no data
                    const searchContainer = document.getElementById('operationsSearchContainer');
                    if (searchContainer) {
                        searchContainer.style.display = 'none';
                    }
                    operationsContent.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">👥</div>
                            <div class="empty-state-text">No team members data available for ${teamTitle || teamName}</div>
                        </div>
                    `;
                    return;
                }
                
                // Show and populate search container in section-header
                setupSearchContainer('Search team members...');
                
                // Place table-header outside operationsContent
                const tableHeaderContainer = document.getElementById('operationsTableHeader');
                if (tableHeaderContainer) {
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>Operational KRA</div>
                            <div class="header-group">
                                <div class="header-main">TARGET</div>
                            </div>
                            <div class="header-group">
                                <div class="header-main">ACTUAL</div>
                            </div>
                            <div>% Operational KPI Weight</div>
                        </div>
                    `;
                    tableHeaderContainer.style.display = 'block';
                }
                
                let html = `
                    <div id="membersList">
                `;
                
                let globalIndex = 0;
                const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
                const roleOwners = itTeamRoleOwners[teamName] || {};
                
                owners.forEach(owner => {
                    const kras = itData[owner];
                    const roleOwner = roleOwners[owner] || '-';
                    
                    kras.forEach(kraData => {
                        const hasDropdown = kraData.kpis && kraData.kpis.length > 0;
                        const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                        
                        const totalKraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                weightValue = parseFloat(weightStr) || 0;
                            }
                            return sum + weightValue;
                        }, 0) : 0;
                        
                        const kpiWeightsData = hasDropdown ? kraData.kpis.map(kpi => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').replace(/,/g, '').trim();
                                weightValue = parseFloat(weightStr);
                                if (isNaN(weightValue)) {
                                    weightValue = 0;
                                }
                            }
                            return {
                                name: kpi.kpi,
                                weight: weightValue
                            };
                        }) : [];
                        
                        const baseTarget = 100;
                        const targetValue = baseTarget + randomIntInRange(-10, 10);
                        const actualValue = baseTarget + randomIntInRange(-15, 15);
                        
                        const kpiWeightsJson = JSON.stringify(kpiWeightsData);
                        const kpiWeightsEscaped = kpiWeightsJson.replace(/"/g, '&quot;');
                        
                        html += `
                            <div class="member-row it-team-kra-row ${dropdownClass}" 
                                 data-name="${owner.toLowerCase()}" 
                                 data-team="${teamName.toLowerCase()}" 
                                 data-index="${globalIndex}"
                                 data-operation="${escapeAttributeValue(kraData.kra)}"
                                 data-owner="${escapeAttributeValue(owner)}"
                                 data-target="${targetValue}"
                                 data-actual="${actualValue}"
                                 data-weight="${totalKraWeight}"
                                 data-kpi-weights="${kpiWeightsEscaped}"
                                 style="cursor: pointer;">
                                <div>${roleOwner}</div>
                                <div class="member-info">
                                    <div class="member-name">${owner}</div>
                                </div>
                                <div>${kraData.kra}</div>
                                <div class="target-group">
                                    <div>${targetValue}</div>
                                </div>
                                <div class="actual-group">
                                    <div>${actualValue}</div>
                                </div>
                                <div>-</div>
                            </div>
                        `;
                        
                        if (hasDropdown) {
                            html += `
                                <div class="sub-operations" id="dropdown-${globalIndex}">
                            `;
                            
                            kraData.kpis.forEach(kpiItem => {
                                const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                const actualNumeric = periodData ? periodData.actual : null;
                                const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                
                                let targetNumericForData = null;
                                if (kpiItem.target && kpiItem.target !== '-') {
                                    targetNumericForData = parseNumericValue(kpiItem.target);
                                }
                                
                                let targetDisplay = kpiItem.target || '-';
                                if (targetNumericForData !== null) {
                                    if (targetNumericForData >= 1000) {
                                        targetDisplay = formatPesoIfNeeded(targetNumericForData, true);
                                    } else if (isPercentageKpi) {
                                        targetDisplay = `${targetNumericForData}%`;
                                    } else {
                                        targetDisplay = targetNumericForData.toString();
                                    }
                                }
                                
                                let actualDisplay = '-';
                                if (actualNumeric !== null) {
                                    actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                }
                                
                                html += `
                                    <div class="sub-operation-item" 
                                         data-kpi="${kpiItem.kpi}"
                                         data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                         data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                        <div class="sub-operation-label">${kpiItem.kpi}</div>
                                        <div><span class="target-badge">${targetDisplay}</span></div>
                                        <div><span class="target-badge">${actualDisplay}</span></div>
                                        <div><span class="weight-badge">${kpiItem.weight || '-'}</span></div>
                                    </div>
                                `;
                            });
                            
                            html += `</div>`;
                        }
                        
                        globalIndex++;
                    });
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('it-team-view');
                
                attachSearchFunctionality();
                attachDropdownFunctionality(teamName);
                attachMemberRowClickHandlers();
                return;
            }
            
            // Special handling for Marcom Team with new structure
            if (teamName === 'Marcom Team' && marcomTeamByOwner[teamName]) {
                const marcomData = marcomTeamByOwner[teamName];
                const owners = Object.keys(marcomData);
                
                if (owners.length === 0) {
                    // Hide search container when no data
                    const searchContainer = document.getElementById('operationsSearchContainer');
                    if (searchContainer) {
                        searchContainer.style.display = 'none';
                    }
                    operationsContent.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">👥</div>
                            <div class="empty-state-text">No team members data available for ${teamTitle || teamName}</div>
                        </div>
                    `;
                    return;
                }
                
                // Show and populate search container in section-header
                setupSearchContainer('Search team members...');
                
                // Place table-header outside operationsContent
                const tableHeaderContainer = document.getElementById('operationsTableHeader');
                if (tableHeaderContainer) {
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>Operational KRA</div>
                            <div class="header-group">
                                <div class="header-main">TARGET</div>
                            </div>
                            <div class="header-group">
                                <div class="header-main">ACTUAL</div>
                            </div>
                            <div>% Operational KPI Weight</div>
                        </div>
                    `;
                    tableHeaderContainer.style.display = 'block';
                }
                
                let html = `
                    <div id="membersList">
                `;
                
                let globalIndex = 0;
                const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
                const roleOwners = marcomTeamRoleOwners[teamName] || {};
                
                owners.forEach(owner => {
                    const kras = marcomData[owner];
                    const roleOwner = roleOwners[owner] || '-';
                    
                    kras.forEach(kraData => {
                        const hasDropdown = kraData.kpis && kraData.kpis.length > 0;
                        const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                        
                        // Calculate total weight for this KRA (sum of all KPI weights)
                        const totalKraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                weightValue = parseFloat(weightStr) || 0;
                            }
                            return sum + weightValue;
                        }, 0) : 0;
                        
                        const kpiWeightsData = hasDropdown ? kraData.kpis.map(kpi => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').replace(/,/g, '').trim();
                                weightValue = parseFloat(weightStr);
                                if (isNaN(weightValue)) {
                                    weightValue = 0;
                                }
                            }
                            return {
                                name: kpi.kpi,
                                weight: weightValue
                            };
                        }) : [];
                        
                        // Generate random target and actual (for display purposes)
                        const baseTarget = 100;
                        const targetValue = baseTarget + randomIntInRange(-10, 10);
                        const actualValue = baseTarget + randomIntInRange(-15, 15);
                        
                        const kpiWeightsJson = JSON.stringify(kpiWeightsData);
                        const kpiWeightsEscaped = kpiWeightsJson.replace(/"/g, '&quot;');
                        
                        html += `
                            <div class="member-row marcom-team-kra-row ${dropdownClass}" 
                                 data-name="${owner.toLowerCase()}" 
                                 data-team="${teamName.toLowerCase()}" 
                                 data-index="${globalIndex}"
                                 data-operation="${escapeAttributeValue(kraData.kra)}"
                                 data-owner="${escapeAttributeValue(owner)}"
                                 data-target="${targetValue}"
                                 data-actual="${actualValue}"
                                 data-weight="${totalKraWeight}"
                                 data-kpi-weights="${kpiWeightsEscaped}"
                                 style="cursor: pointer;">
                                <div>${roleOwner}</div>
                                <div class="member-info">
                                    <div class="member-name">${owner}</div>
                                </div>
                                <div>${kraData.kra}</div>
                                <div class="target-group">
                                    <div>${targetValue}</div>
                                </div>
                                <div class="actual-group">
                                    <div>${actualValue}</div>
                                </div>
                                <div>-</div>
                            </div>
                        `;
                        
                        if (hasDropdown) {
                            html += `
                                <div class="sub-operations" id="dropdown-${globalIndex}">
                            `;
                            
                            kraData.kpis.forEach(kpiItem => {
                                const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                const actualNumeric = periodData ? periodData.actual : null;
                                const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                
                                let targetNumericForData = null;
                                if (kpiItem.target && kpiItem.target !== '-') {
                                    targetNumericForData = parseNumericValue(kpiItem.target);
                                }
                                
                                let targetDisplay = kpiItem.target || '-';
                                if (targetNumericForData !== null) {
                                    if (targetNumericForData >= 1000) {
                                        targetDisplay = formatPesoIfNeeded(targetNumericForData, true);
                                    } else if (isPercentageKpi) {
                                        targetDisplay = `${targetNumericForData}%`;
                                    } else {
                                        targetDisplay = targetNumericForData.toString();
                                    }
                                }
                                
                                let actualDisplay = '-';
                                if (actualNumeric !== null) {
                                    actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                }
                                
                                html += `
                                    <div class="sub-operation-item" 
                                         data-kpi="${kpiItem.kpi}"
                                         data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                         data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                        <div class="sub-operation-label">${kpiItem.kpi}</div>
                                        <div><span class="target-badge">${targetDisplay}</span></div>
                                        <div><span class="target-badge">${actualDisplay}</span></div>
                                        <div><span class="weight-badge">${kpiItem.weight || '-'}</span></div>
                                    </div>
                                `;
                            });
                            
                            html += `</div>`;
                        }
                        
                        globalIndex++;
                    });
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('marcom-team-view');
                
                attachSearchFunctionality();
                attachDropdownFunctionality(teamName);
                attachMemberRowClickHandlers();
                return;
            }
            
            // Special handling for Operations Team with new structure
            if (teamName === 'Operations Team' && operationsTeamByOwner[teamName]) {
                const operationsData = operationsTeamByOwner[teamName];
                const owners = Object.keys(operationsData);
                
                if (owners.length === 0) {
                    // Hide search container when no data
                    const searchContainer = document.getElementById('operationsSearchContainer');
                    if (searchContainer) {
                        searchContainer.style.display = 'none';
                    }
                    operationsContent.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">👥</div>
                            <div class="empty-state-text">No team members data available for ${teamTitle || teamName}</div>
                        </div>
                    `;
                    return;
                }
                
                // Show and populate search container in section-header
                setupSearchContainer('Search team members...');
                
                // Place table-header outside operationsContent
                const tableHeaderContainer = document.getElementById('operationsTableHeader');
                if (tableHeaderContainer) {
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>Operational KRA</div>
                            <div class="header-group">
                                <div class="header-main">TARGET</div>
                            </div>
                            <div class="header-group">
                                <div class="header-main">ACTUAL</div>
                            </div>
                            <div>% Operational KPI Weight</div>
                        </div>
                    `;
                    tableHeaderContainer.style.display = 'block';
                }
                
                let html = `
                    <div id="membersList">
                `;
                
                let globalIndex = 0;
                const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
                const roleOwners = operationsTeamRoleOwners[teamName] || {};
                
                owners.forEach(owner => {
                    const kras = operationsData[owner];
                    const roleOwner = roleOwners[owner] || '-';
                    
                    kras.forEach(kraData => {
                        const hasDropdown = kraData.kpis && kraData.kpis.length > 0;
                        const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                        
                        // Calculate total weight for this KRA (sum of all KPI weights)
                        const totalKraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                weightValue = parseFloat(weightStr) || 0;
                            }
                            return sum + weightValue;
                        }, 0) : 0;
                        
                        const kpiWeightsData = hasDropdown ? kraData.kpis.map(kpi => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').replace(/,/g, '').trim();
                                weightValue = parseFloat(weightStr);
                                if (isNaN(weightValue)) {
                                    weightValue = 0;
                                }
                            }
                            return {
                                name: kpi.kpi,
                                weight: weightValue
                            };
                        }) : [];
                        
                        // Generate random target and actual (for display purposes)
                        const baseTarget = 100;
                        const targetValue = baseTarget + randomIntInRange(-10, 10);
                        const actualValue = baseTarget + randomIntInRange(-15, 15);
                        
                        const kpiWeightsJson = JSON.stringify(kpiWeightsData);
                        const kpiWeightsEscaped = kpiWeightsJson.replace(/"/g, '&quot;');
                        
                        html += `
                            <div class="member-row operations-team-kra-row ${dropdownClass}" 
                                 data-name="${owner.toLowerCase()}" 
                                 data-team="${teamName.toLowerCase()}" 
                                 data-index="${globalIndex}"
                                 data-operation="${escapeAttributeValue(kraData.kra)}"
                                 data-owner="${escapeAttributeValue(owner)}"
                                 data-target="${targetValue}"
                                 data-actual="${actualValue}"
                                 data-weight="${totalKraWeight}"
                                 data-kpi-weights="${kpiWeightsEscaped}"
                                 style="cursor: pointer;">
                                <div>${roleOwner}</div>
                                <div class="member-info">
                                    <div class="member-name">${owner}</div>
                                </div>
                                <div>${kraData.kra}</div>
                                <div class="target-group">
                                    <div>${targetValue}</div>
                                </div>
                                <div class="actual-group">
                                    <div>${actualValue}</div>
                                </div>
                                <div>-</div>
                            </div>
                        `;
                        
                        if (hasDropdown) {
                            html += `
                                <div class="sub-operations" id="dropdown-${globalIndex}">
                            `;
                            
                            kraData.kpis.forEach(kpiItem => {
                                const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                const actualNumeric = periodData ? periodData.actual : null;
                                const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                
                                let targetNumericForData = null;
                                if (kpiItem.target && kpiItem.target !== '-') {
                                    targetNumericForData = parseNumericValue(kpiItem.target);
                                }
                                
                                let targetDisplay = kpiItem.target || '-';
                                if (targetNumericForData !== null) {
                                    if (targetNumericForData >= 1000) {
                                        targetDisplay = formatPesoIfNeeded(targetNumericForData, true);
                                    } else if (isPercentageKpi) {
                                        targetDisplay = `${targetNumericForData}%`;
                                    } else {
                                        targetDisplay = targetNumericForData.toString();
                                    }
                                }
                                
                                let actualDisplay = '-';
                                if (actualNumeric !== null) {
                                    actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                }
                                
                                html += `
                                    <div class="sub-operation-item" 
                                         data-kpi="${kpiItem.kpi}"
                                         data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                         data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                        <div class="sub-operation-label">${kpiItem.kpi}</div>
                                        <div><span class="target-badge">${targetDisplay}</span></div>
                                        <div><span class="target-badge">${actualDisplay}</span></div>
                                        <div><span class="weight-badge">${kpiItem.weight || '-'}</span></div>
                                    </div>
                                `;
                            });
                            
                            html += `</div>`;
                        }
                        
                        globalIndex++;
                    });
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('operations-team-view');
                
                attachSearchFunctionality();
                attachDropdownFunctionality(teamName);
                attachMemberRowClickHandlers();
                return;
            }
            
            // Special handling for Audit Team with new structure
            if (teamName === 'Audit Team' && auditTeamByOwner[teamName]) {
                const auditData = auditTeamByOwner[teamName];
                const owners = Object.keys(auditData);
                
                if (owners.length === 0) {
                    // Hide search container when no data
                    const searchContainer = document.getElementById('operationsSearchContainer');
                    if (searchContainer) {
                        searchContainer.style.display = 'none';
                    }
                    operationsContent.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">👥</div>
                            <div class="empty-state-text">No team members data available for ${teamTitle || teamName}</div>
                        </div>
                    `;
                    return;
                }
                
                // Show and populate search container in section-header
                setupSearchContainer('Search team members...');
                
                // Place table-header outside operationsContent
                const tableHeaderContainer = document.getElementById('operationsTableHeader');
                if (tableHeaderContainer) {
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>Operational KRA</div>
                            <div class="header-group">
                                <div class="header-main">TARGET</div>
                            </div>
                            <div class="header-group">
                                <div class="header-main">ACTUAL</div>
                            </div>
                            <div>% Operational KPI Weight</div>
                        </div>
                    `;
                    tableHeaderContainer.style.display = 'block';
                }
                
                let html = `
                    <div id="membersList">
                `;
                
                let globalIndex = 0;
                const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
                const roleOwners = auditTeamRoleOwners[teamName] || {};
                
                owners.forEach(owner => {
                    const kras = auditData[owner];
                    const roleOwner = roleOwners[owner] || '-';
                    
                    kras.forEach(kraData => {
                        const hasDropdown = kraData.kpis && kraData.kpis.length > 0;
                        const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                        
                        const totalKraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                weightValue = parseFloat(weightStr) || 0;
                            }
                            return sum + weightValue;
                        }, 0) : 0;
                        
                        const kpiWeightsData = hasDropdown ? kraData.kpis.map(kpi => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').replace(/,/g, '').trim();
                                weightValue = parseFloat(weightStr);
                                if (isNaN(weightValue)) {
                                    weightValue = 0;
                                }
                            }
                            return {
                                name: kpi.kpi,
                                weight: weightValue
                            };
                        }) : [];
                        
                        const baseTarget = 100;
                        const targetValue = baseTarget + randomIntInRange(-10, 10);
                        const actualValue = baseTarget + randomIntInRange(-15, 15);
                        
                        const kpiWeightsJson = JSON.stringify(kpiWeightsData);
                        const kpiWeightsEscaped = kpiWeightsJson.replace(/"/g, '&quot;');
                        
                        html += `
                            <div class="member-row audit-team-kra-row ${dropdownClass}" 
                                 data-name="${owner.toLowerCase()}" 
                                 data-team="${teamName.toLowerCase()}" 
                                 data-index="${globalIndex}"
                                 data-operation="${escapeAttributeValue(kraData.kra)}"
                                 data-owner="${escapeAttributeValue(owner)}"
                                 data-target="${targetValue}"
                                 data-actual="${actualValue}"
                                 data-weight="${totalKraWeight}"
                                 data-kpi-weights="${kpiWeightsEscaped}"
                                 style="cursor: pointer;">
                                <div>${roleOwner}</div>
                                <div class="member-info">
                                    <div class="member-name">${owner}</div>
                                </div>
                                <div>${kraData.kra}</div>
                                <div class="target-group">
                                    <div>${targetValue}</div>
                                </div>
                                <div class="actual-group">
                                    <div>${actualValue}</div>
                                </div>
                                <div>-</div>
                            </div>
                        `;
                        
                        if (hasDropdown) {
                            html += `
                                <div class="sub-operations" id="dropdown-${globalIndex}">
                            `;
                            
                            kraData.kpis.forEach(kpiItem => {
                                const periodData = leadKpiExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                const actualNumeric = periodData ? periodData.actual : null;
                                const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                
                                let targetNumericForData = null;
                                if (kpiItem.target && kpiItem.target !== '-') {
                                    targetNumericForData = parseNumericValue(kpiItem.target);
                                }
                                
                                let targetDisplay = kpiItem.target || '-';
                                if (targetNumericForData !== null) {
                                    if (targetNumericForData >= 1000) {
                                        targetDisplay = formatPesoIfNeeded(targetNumericForData, true);
                                    } else if (isPercentageKpi) {
                                        targetDisplay = `${targetNumericForData}%`;
                                    } else {
                                        targetDisplay = targetNumericForData.toString();
                                    }
                                }
                                
                                let actualDisplay = '-';
                                if (actualNumeric !== null) {
                                    actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                }
                                
                                html += `
                                    <div class="sub-operation-item" 
                                         data-kpi="${kpiItem.kpi}"
                                         data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                         data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                        <div class="sub-operation-label">${kpiItem.kpi}</div>
                                        <div><span class="target-badge">${targetDisplay}</span></div>
                                        <div><span class="target-badge">${actualDisplay}</span></div>
                                        <div><span class="weight-badge">${kpiItem.weight || '-'}</span></div>
                                    </div>
                                `;
                            });
                            
                            html += `</div>`;
                        }
                        
                        globalIndex++;
                    });
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('audit-team-view');
                
                attachSearchFunctionality();
                attachDropdownFunctionality(teamName);
                attachMemberRowClickHandlers();
                return;
            }
            
            // Special handling for Gathering Team with new structure
            if (teamName === 'Gathering Team' && gatheringTeamByOwner[teamName]) {
                const gatheringData = gatheringTeamByOwner[teamName];
                const owners = Object.keys(gatheringData);
                
                if (owners.length === 0) {
                    // Hide search container when no data
                    const searchContainer = document.getElementById('operationsSearchContainer');
                    if (searchContainer) {
                        searchContainer.style.display = 'none';
                    }
                    operationsContent.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">👥</div>
                            <div class="empty-state-text">No team members data available for ${teamTitle || teamName}</div>
                        </div>
                    `;
                    return;
                }
                
                // Show and populate search container in section-header
                setupSearchContainer('Search team members...');
                
                // Place table-header outside operationsContent
                const tableHeaderContainer = document.getElementById('operationsTableHeader');
                if (tableHeaderContainer) {
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>Operational KRA</div>
                            <div class="header-group">
                                <div class="header-main">TARGET</div>
                            </div>
                            <div class="header-group">
                                <div class="header-main">ACTUAL</div>
                            </div>
                            <div>% Operational KPI Weight</div>
                        </div>
                    `;
                    tableHeaderContainer.style.display = 'block';
                }
                
                let html = `
                    <div id="membersList">
                `;
                
                let globalIndex = 0;
                const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
                const roleOwners = gatheringTeamRoleOwners[teamName] || {};
                
                owners.forEach(owner => {
                    const kras = gatheringData[owner];
                    const roleOwner = roleOwners[owner] || '-';
                    
                    kras.forEach(kraData => {
                        const hasDropdown = kraData.kpis && kraData.kpis.length > 0;
                        const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                        
                        const totalKraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                weightValue = parseFloat(weightStr) || 0;
                            }
                            return sum + weightValue;
                        }, 0) : 0;
                        
                        const kpiWeightsData = hasDropdown ? kraData.kpis.map(kpi => {
                            let weightValue = 0;
                            if (kpi.weight && kpi.weight !== '-') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').replace(/,/g, '').trim();
                                weightValue = parseFloat(weightStr);
                                if (isNaN(weightValue)) {
                                    weightValue = 0;
                                }
                            }
                            return {
                                name: kpi.kpi,
                                weight: weightValue
                            };
                        }) : [];
                        
                        const baseTarget = 100;
                        const targetValue = baseTarget + randomIntInRange(-10, 10);
                        const actualValue = baseTarget + randomIntInRange(-15, 15);
                        
                        const kpiWeightsJson = JSON.stringify(kpiWeightsData);
                        const kpiWeightsEscaped = kpiWeightsJson.replace(/"/g, '&quot;');
                        
                        html += `
                            <div class="member-row gathering-team-kra-row ${dropdownClass}" 
                                 data-name="${owner.toLowerCase()}" 
                                 data-team="${teamName.toLowerCase()}" 
                                 data-index="${globalIndex}"
                                 data-operation="${escapeAttributeValue(kraData.kra)}"
                                 data-owner="${escapeAttributeValue(owner)}"
                                 data-target="${targetValue}"
                                 data-actual="${actualValue}"
                                 data-weight="${totalKraWeight}"
                                 data-kpi-weights="${kpiWeightsEscaped}"
                                 style="cursor: pointer;">
                                <div>${roleOwner}</div>
                                <div class="member-info">
                                    <div class="member-name">${owner}</div>
                                </div>
                                <div>${kraData.kra}</div>
                                <div class="target-group">
                                    <div>${targetValue}</div>
                                </div>
                                <div class="actual-group">
                                    <div>${actualValue}</div>
                                </div>
                                <div>-</div>
                            </div>
                        `;
                        
                        if (hasDropdown) {
                            html += `
                                <div class="sub-operations" id="dropdown-${globalIndex}">
                            `;
                            
                            kraData.kpis.forEach(kpiItem => {
                                const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey] || leadKpiExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                const actualNumeric = periodData ? periodData.actual : null;
                                const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                
                                let targetNumericForData = null;
                                if (kpiItem.target && kpiItem.target !== '-') {
                                    targetNumericForData = parseNumericValue(kpiItem.target);
                                }
                                
                                let targetDisplay = kpiItem.target || '-';
                                if (targetNumericForData !== null) {
                                    if (targetNumericForData >= 1000) {
                                        targetDisplay = formatPesoIfNeeded(targetNumericForData, true);
                                    } else if (isPercentageKpi) {
                                        targetDisplay = `${targetNumericForData}%`;
                                    } else {
                                        targetDisplay = targetNumericForData.toString();
                                    }
                                }
                                
                                let actualDisplay = '-';
                                if (actualNumeric !== null) {
                                    actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                }
                                
                                html += `
                                    <div class="sub-operation-item" 
                                         data-kpi="${kpiItem.kpi}"
                                         data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                         data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                        <div class="sub-operation-label">${kpiItem.kpi}</div>
                                        <div><span class="target-badge">${targetDisplay}</span></div>
                                        <div><span class="target-badge">${actualDisplay}</span></div>
                                        <div><span class="weight-badge">${kpiItem.weight || '-'}</span></div>
                                    </div>
                                `;
                            });
                            
                            html += `</div>`;
                        }
                        
                        globalIndex++;
                    });
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('gathering-team-view');
                
                attachSearchFunctionality();
                attachDropdownFunctionality(teamName);
                attachMemberRowClickHandlers();
                return;
            }
            
            // Original logic for other teams
            operationsContent.classList.remove('technical-team-view');
            
            // Fetch team members data from Google Sheets
            await fetchTeamMembersData();
            const members = teamMembersData[teamName] || [];

            if (members.length === 0) {
                operationsContent.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">👥</div>
                        <div class="empty-state-text">No team members data available for ${teamTitle || teamName}</div>
                    </div>
                `;
                return;
            }

            // Place table-header outside operationsContent for team members view
            const tableHeaderContainer = document.getElementById('operationsTableHeader');
            if (tableHeaderContainer) {
                tableHeaderContainer.innerHTML = `
                    <div class="table-header">
                        <div>Emp Name</div>
                        <div>Role</div>
                        <div>KPI</div>
                        <div>Target</div>
                        <div>Actual</div>
                    </div>
                `;
                tableHeaderContainer.style.display = 'block';
            }
            
            let html = `
                <div id="membersList">
            `;

            members.forEach(member => {
                const initials = generateInitials(member.name);
                const targetValue = typeof member.targetValue === 'number' ? member.targetValue : '';
                const actualValue = typeof member.actualValue === 'number' ? member.actualValue : '';
                const targetLabel = member.targetLabel ?? (targetValue !== '' ? targetValue : '-');
                const actualLabel = member.actualLabel ?? (actualValue !== '' ? actualValue : '-');
                
                // Get monthly data if available
                const monthlyTarget = member.monthlyData?.target || Array(12).fill(null);
                const monthlyActual = member.monthlyData?.actual || Array(12).fill(null);
                const monthlyTargetJson = JSON.stringify(monthlyTarget);
                const monthlyActualJson = JSON.stringify(monthlyActual);

                html += `
                    <div class="member-row member-view-row"
                         data-name="${member.name.toLowerCase()}"
                         data-team="${teamName.toLowerCase()}"
                         data-kpi="${member.kpi}"
                         data-operation="${member.kpi}"
                         data-target="${targetValue}"
                         data-actual="${actualValue}"
                         data-monthly-target="${escapeAttributeValue(monthlyTargetJson)}"
                         data-monthly-actual="${escapeAttributeValue(monthlyActualJson)}"
                         style="cursor: pointer;">
                        <div class="member-info">
                            <div class="member-avatar">${initials}</div>
                            <div class="member-name">${member.name}</div>
                        </div>
                        <div>${member.role}</div>
                        <div>${member.kpi}</div>
                        <div>${targetLabel}</div>
                        <div>${actualLabel}</div>
                    </div>
                `;
            });

            html += '</div>';
            operationsContent.innerHTML = html;

            attachSearchFunctionality();
            attachMemberRowClickHandlers();
        }

        function refreshOperationsContent() {
            const operationsContent = document.getElementById('operationsContent');
            if (!operationsContent) {
                return;
            }

            const isMembersView = currentOperationsView === 'members';

            if (!selectedTeam || !selectedTeamData) {
                operationsSection?.classList.toggle('members-view-active', isMembersView);
                if (operationsSectionTitle) {
                    operationsSectionTitle.textContent = isMembersView ? 'Team Members' : 'Lag KPIs';
                }
                if (operationsSectionSubtitle) {
                    operationsSectionSubtitle.textContent = isMembersView
                        ? 'Select a team to view their team members'
                        : '';
                }
                operationsContent.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">👥</div>
                        <div class="empty-state-text">${isMembersView
                            ? 'Select a team to view their team members'
                            : 'Select a team to view lag KPIs or their team members'}</div>
                    </div>
                `;
                
                updateScoreboardToggleState();
                return;
            }

            operationsSection?.classList.toggle('members-view-active', isMembersView);

            if (operationsSectionTitle) {
                operationsSectionTitle.textContent = isMembersView ? 'Team Members' : 'Lag KPIs';
            }

            if (operationsSectionSubtitle) {
                if (isMembersView) {
                    operationsSectionSubtitle.textContent = '';
                } else {
                    // Check switch state: 'profile' = Lead KPIs, 'operations' = Lag KPIs
                    operationsSectionSubtitle.textContent = currentView === 'profile'
                        ? `${selectedTeamData.title} lead KPIs`
                        : `${selectedTeamData.title} lag KPIs`;
                }
            }

            if (isMembersView) {
                updateTeamMembersSection(selectedTeam, selectedTeamData.title).catch(err => {
                    console.error('Error updating team members section:', err);
                });
            } else {
                updateOperationsSection(selectedTeam, selectedTeamData.title);
            }

            updateScoreboardToggleState();
        }

        function updateLeadKpiSection(teamName, teamTitle) {
            const profileContent = document.getElementById('profileContent');
            const leadKpis = leadKpiData[teamName] || [];
            
            // Update subtitle when team is selected
            if (profileSectionSubtitle && selectedTeamData) {
                profileSectionSubtitle.textContent = `${selectedTeamData.title} lead KPIs`;
            }
            
            if (leadKpis.length === 0) {
                // Hide search container and table header when no data
                const searchContainer = document.getElementById('profileSearchContainer');
                if (searchContainer) {
                    searchContainer.style.display = 'none';
                }
                const tableHeaderContainer = document.getElementById('profileTableHeader');
                if (tableHeaderContainer) {
                    tableHeaderContainer.style.display = 'none';
                }
                profileContent.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">📊</div>
                            <div class="empty-state-text">No Lead KPIs data available</div>
                    </div>
                `;
                return;
            }
        
            // Show and populate search container in section-header
            setupSearchContainer('Search operations...', 'profileSearchContainer', 'searchInputLead');
            
            // Place table-header outside profileContent
            const tableHeaderContainer = document.getElementById('profileTableHeader');
            if (tableHeaderContainer) {
                tableHeaderContainer.innerHTML = `
                    <div class="table-header">
                        <div>Operation KPI</div>
                        <div>KPI Owner</div>
                        <div class="header-group">
                            <div class="header-main">TARGET</div>
                        </div>
                        <div class="header-group">
                            <div class="header-main">ACTUAL</div>
                        </div>
                    </div>
                `;
                tableHeaderContainer.style.display = 'block';
            }
            
            let html = `
                <div id="leadKpiList">
            `;
            
            leadKpis.forEach((kpi, index) => {
            // Get period data if available
            const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
            const periodData = leadKpiExpensesData[teamName]?.[kpi.role]?.[periodKey];
            
            const targetNumeric = periodData ? periodData.target : null;
            const actualNumeric = periodData ? periodData.actual : null;
            const isPercentageKpi = kpi.role.includes('%') || kpi.role.toLowerCase().includes('percent');
            const targetValue = periodData ? formatValueForDisplay(periodData.target, isPercentageKpi) : '-';
            const actualValue = periodData ? formatValueForDisplay(periodData.actual, isPercentageKpi) : '-';
            
                html += `
                <div class="member-row" 
                     data-name="${kpi.owner.toLowerCase()}" 
                     data-team="${teamName.toLowerCase()}" 
                     data-index="${index}"
                     data-operation="${kpi.role}"
                     data-target="${targetNumeric !== null ? targetNumeric : ''}"
                     data-actual="${actualNumeric !== null ? actualNumeric : ''}"
                     style="cursor: pointer;">
                        <div class="member-info">
                            <div class="member-name">${kpi.role}</div>
                        </div>
                        <div>${kpi.owner}</div>
                        <div class="target-group">
                        <div>${targetValue}</div>
                        </div>
                        <div class="actual-group">
                        <div>${actualValue}</div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            profileContent.innerHTML = html;
        
        attachSearchFunctionalityLead();
        attachMemberRowClickHandlersLead();
    }

        const performanceReportCopy = {
            defaultTitle: '--',
            defaultSubtitle: ''
        };

        const defaultTeamPerformanceSeries = {
            title: performanceReportCopy.defaultTitle,
            subtitle: performanceReportCopy.defaultSubtitle,
            labels: [...chartMonths],
            target: new Array(chartMonths.length).fill(0),
            actual: new Array(chartMonths.length).fill(0),
            narrative: 'Select a KPI to load data.',
            valueType: 'thousands'
        };

        // Initialize chart data using dynamic design pattern from lag-lead-script.js
        const initialChartStructure = createComparisonChartStructures({
            labels: [...defaultTeamPerformanceSeries.labels],
            yAxisTitle: '',
            barPluginId: 'teamPerformanceBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current Year Target',
            currentDataset: [...defaultTeamPerformanceSeries.actual],
            previousDataset: Array(defaultTeamPerformanceSeries.labels.length).fill(0),
            targetDataset: [...defaultTeamPerformanceSeries.target],
            includeTarget: true,
            includeBarLabels: false,
            valueFormatter: formatMillionsLabel,
            zeroLabel: 'P0.00',
            axisBounds: {},
            beginAtZero: true,
            valueType: 'thousands'
        });

        const teamPerformanceChartData = initialChartStructure.data;

        let activeTeamPerformanceSeries = defaultTeamPerformanceSeries;
        let currentValueFormat = 'thousands'; // 'thousands' | 'percentage' | 'count'

        function computeDatasetMaxValue() {
            const values = [];
            teamPerformanceChartData.datasets.forEach(dataset => {
                if (Array.isArray(dataset.data)) {
                    dataset.data.forEach(value => {
                        if (typeof value === 'number' && Number.isFinite(value)) {
                            values.push(value);
                        }
                    });
                }
            });
            if (!values.length) {
                return 0;
            }
            return Math.max(...values);
        }


        function updatePerformanceCardCopy(series = defaultTeamPerformanceSeries) {
            const titleEl = document.querySelector('.performance-report-card .report-title');
            const subtitleEl = document.querySelector('.performance-report-card .report-card-subtitle');
            if (titleEl) {
                titleEl.textContent = series?.title || performanceReportCopy.defaultTitle;
            }
            if (subtitleEl) {
                subtitleEl.textContent = series?.subtitle || performanceReportCopy.defaultSubtitle;
            }
        }

        function applyTeamPerformanceSeries(series = defaultTeamPerformanceSeries) {
            activeTeamPerformanceSeries = series || defaultTeamPerformanceSeries;
            const labels = (activeTeamPerformanceSeries.labels && activeTeamPerformanceSeries.labels.length)
                ? [...activeTeamPerformanceSeries.labels]
                : [...defaultTeamPerformanceSeries.labels];

            const targetData = (activeTeamPerformanceSeries.target && activeTeamPerformanceSeries.target.length)
                ? [...activeTeamPerformanceSeries.target]
                : new Array(labels.length).fill(0);
            const actualData = (activeTeamPerformanceSeries.actual && activeTeamPerformanceSeries.actual.length)
                ? [...activeTeamPerformanceSeries.actual]
                : new Array(labels.length).fill(0);
            // Get previous year data if available (from monthlySeries.previous)
            const previousData = (activeTeamPerformanceSeries.previous && activeTeamPerformanceSeries.previous.length)
                ? [...activeTeamPerformanceSeries.previous]
                : new Array(labels.length).fill(0);

            teamPerformanceChartData.labels = labels;

            // Update datasets - using dynamic design structure: [current (2025), previous (2024), target (line)]
            const [currentDataset, previousDataset, targetDataset] = teamPerformanceChartData.datasets;
            if (currentDataset) {
                currentDataset.data = actualData;
                currentDataset.valueType = series?.valueType || 'thousands';
            }
            if (previousDataset) {
                previousDataset.data = previousData;
                previousDataset.valueType = series?.valueType || 'thousands';
            }
            if (targetDataset) {
                targetDataset.data = targetData;
            }

            if (series?.valueType === 'percentage') {
                currentValueFormat = 'percentage';
            } else if (series?.valueType === 'count') {
                currentValueFormat = 'count';
            } else {
                currentValueFormat = 'thousands';
            }

            if (teamPerformanceChart) {
                // Update value formatter based on value type
                const valueFormatter = currentValueFormat === 'percentage' 
                    ? formatPercentageLabel 
                    : (currentValueFormat === 'count' 
                        ? (v) => Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 })
                        : formatThousandsLabel);
                
                // Update chart options to use correct formatter
                if (teamPerformanceChart.options?.scales?.y?.ticks) {
                    teamPerformanceChart.options.scales.y.ticks.callback = function(value) {
                        if (value === 0 || value === '0') {
                            return currentValueFormat === 'percentage' ? '0%' : (currentValueFormat === 'count' ? '0' : 'P0.00');
                        }
                        return valueFormatter(value);
                    };
                }
                
                if (teamPerformanceChart.options?.plugins?.tooltip?.callbacks?.label) {
                    teamPerformanceChart.options.plugins.tooltip.callbacks.label = function(context) {
                        const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                        return `${context.dataset.label}: ${valueFormatter(value)}`;
                    };
                }

                const yScale = teamPerformanceChart.options?.scales?.y;
                if (yScale) {
                    const maxValue = computeDatasetMaxValue();
                    const paddedMax = maxValue > 0 ? maxValue * 1.25 : 1;
                    yScale.suggestedMax = paddedMax;
                    yScale.beginAtZero = true;
                }
                teamPerformanceChart.update();
            }
        }

        function clearTeamPerformanceChart() {
            teamPerformanceChartData.labels = [...defaultTeamPerformanceSeries.labels];
            const [targetDataset, actualDataset] = teamPerformanceChartData.datasets;
            targetDataset.data = [...defaultTeamPerformanceSeries.target];
            actualDataset.data = [...defaultTeamPerformanceSeries.actual];
            currentValueFormat = 'thousands';
            if (teamPerformanceChart) {
                teamPerformanceChart.update();
            }
        }

        function resetTeamPerformanceVisuals(insightContext) {
            clearTeamPerformanceChart();
            // Show canvas again and clear any SVG
            const canvas = document.getElementById('teamPerformanceChart');
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            if (canvas) {
                canvas.style.display = 'block';
            }
            if (chartContainer) {
                const svg = chartContainer.querySelector('svg.line-chart');
                if (svg) {
                    svg.remove();
                }
            }
            
            // Remove quarter filter if it exists
            const reportCard = document.querySelector('.performance-report-card');
            const quarterFilter = reportCard?.querySelector('.quarter-filter-container');
            if (quarterFilter) {
                quarterFilter.remove();
            }
            

            setPerformanceReportCardMode('bar');
            
            updatePerformanceCardCopy();
            updateTeamPerformanceInsight(insightContext || {
                infoMessage: 'Select a KPI to view its target vs actual comparison.'
            });
        }

        function setPerformanceReportCardMode(mode = 'bar') {
            // Function kept for compatibility, but doughnut mode is no longer supported
            const reportCard = document.querySelector('.performance-report-card');
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            if (!reportCard || !chartContainer) {
                return;
            }
            // Remove doughnut-mode class if it exists
            reportCard.classList.remove('doughnut-mode');
            chartContainer.classList.remove('doughnut-mode');
        }

        function average(values) {
            const valid = values.filter(value => typeof value === 'number' && !Number.isNaN(value));
            if (!valid.length) {
                return null;
            }
            return valid.reduce((sum, value) => sum + value, 0) / valid.length;
        }

        function updateTeamPerformanceInsight(context = {}) {
            const insightElement = document.getElementById('teamPerformanceInsight');
            if (!insightElement) {
                return;
            }

            if (context.infoMessage) {
                insightElement.textContent = context.infoMessage;
                return;
            }

            const sentences = [];
            const operationName = context.operationName;
            const leaderName = context.leaderName;
            const isPercentage = context.isPercentage ?? (operationName ? /%|percent/i.test(operationName.toLowerCase()) : false);
            const valueFormat = context.valueFormat || (isPercentage ? 'percentage' : 'thousands');

            const targetValue = (context.targetValue ?? null) !== null
                ? context.targetValue
                : teamPerformanceChartData.datasets[0]?.data?.[0];
            const actualValue = (context.actualValue ?? null) !== null
                ? context.actualValue
                : teamPerformanceChartData.datasets[1]?.data?.[0];

            const formatValue = (value) => {
                if (value === null || value === undefined) {
                    return 'N/A';
                }
                if (valueFormat === 'percentage') {
                    const numeric = Number(value);
                    if (Number.isNaN(numeric)) {
                        return 'N/A';
                    }
                    const fixed = numeric.toFixed(1);
                    return `${fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed}%`;
                }
                if (valueFormat === 'count') {
                    const numeric = Number(value);
                    if (Number.isNaN(numeric)) {
                        return 'N/A';
                    }
                    return numeric.toLocaleString('en-US', { maximumFractionDigits: 0 });
                }
                return formatPesoIfNeeded(value, true);
            };

            if (operationName) {
                const leaderText = leaderName ? ` - ${leaderName}` : '';
                sentences.push(`<strong>${operationName}</strong>${leaderText}`);
            }

            if (actualValue !== null && actualValue !== undefined && targetValue !== null && targetValue !== undefined) {
                const variance = actualValue - targetValue;
                const varianceMagnitude = Math.abs(variance);
                let varianceLabel;
                if (valueFormat === 'percentage') {
                    const fixed = varianceMagnitude.toFixed(1);
                    varianceLabel = `${variance >= 0 ? '+' : '-'}${fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed}%`;
                } else if (valueFormat === 'count') {
                    varianceLabel = `${variance >= 0 ? '+' : '-'}${varianceMagnitude.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
                } else {
                    varianceLabel = `${variance >= 0 ? '+' : '-'}${formatPesoIfNeeded(varianceMagnitude, true)}`;
                }
                sentences.push(`Actual is ${formatValue(actualValue)} vs target ${formatValue(targetValue)} (${varianceLabel}).`);
            } else if (actualValue !== null && actualValue !== undefined) {
                sentences.push(`Actual value: ${formatValue(actualValue)}.`);
            } else if (targetValue !== null && targetValue !== undefined) {
                sentences.push(`Target value: ${formatValue(targetValue)}.`);
            }

            if (context.additionalNarrative) {
                sentences.push(context.additionalNarrative);
            }

            if (!sentences.length) {
                sentences.push('Select a KPI to view its target vs actual details.');
            }

            insightElement.innerHTML = sentences.join(' ');
        }

        let teamPerformanceChart = null;

        function initTeamPerformanceChart() {
            if (typeof Chart === 'undefined') {
                return;
            }

            const canvas = document.getElementById('teamPerformanceChart');
            if (!canvas) {
                return;
            }

            if (teamPerformanceChart) {
                teamPerformanceChart.destroy();
            }

            // Use dynamic chart structure from createComparisonChartStructures
            const chartConfig = createComparisonChartStructures({
                labels: teamPerformanceChartData.labels,
                yAxisTitle: '',
                barPluginId: 'teamPerformanceBarDataLabels',
                currentLabel: 'Year 2025',
                previousLabel: 'Year 2024',
                targetLabel: 'Current Year Target',
                currentDataset: teamPerformanceChartData.datasets[0]?.data || [],
                previousDataset: teamPerformanceChartData.datasets[1]?.data || [],
                targetDataset: teamPerformanceChartData.datasets[2]?.data || [],
                includeTarget: true,
                includeBarLabels: false,
                valueFormatter: formatThousandsLabel,
                zeroLabel: 'P0.00',
                axisBounds: {},
                beginAtZero: true,
                valueType: currentValueFormat
            });

            // Merge with custom options for this specific chart
            chartConfig.config.options = {
                ...chartConfig.config.options,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                animation: {
                    duration: 900,
                    easing: 'cubicBezier(0.33, 1, 0.68, 1)',
                    delay(context) {
                        if (context.type === 'data' && context.mode === 'default' && context.dataIndex !== undefined) {
                            return context.dataIndex * 40;
                        }
                        return 0;
                    }
                },
                plugins: {
                    ...chartConfig.config.options.plugins,
                    legend: {
                        ...chartConfig.config.options.plugins.legend,
                        display: true // Show legend for dynamic design
                    }
                },
                scales: {
                    ...chartConfig.config.options.scales,
                    y: {
                        ...chartConfig.config.options.scales.y,
                        grid: {
                            color: '#e4e8d7',
                            drawTicks: false
                        },
                        border: {
                            display: false
                        }
                    },
                    x: {
                        ...chartConfig.config.options.scales.x,
                        ticks: {
                            color: '#6b7280',
                            font: {
                                weight: 600
                            }
                        }
                    }
                }
            };

            teamPerformanceChart = new Chart(canvas, chartConfig.config);

            applyTeamPerformanceSeries(activeTeamPerformanceSeries);
            updateTeamPerformanceInsight();
        }

        function updateTeamPerformanceBarChart(operationName, target, actual) {
            const chartWrapper = document.querySelector('.chart-wrapper');
            
            // Show canvas and hide any SVG
            const canvas = document.getElementById('teamPerformanceChart');
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            
            // If canvas doesn't exist, recreate it
            let canvasElement = canvas;
            let needsReinit = false;
            if (!canvasElement && chartContainer) {
                chartContainer.innerHTML = '';
                canvasElement = document.createElement('canvas');
                canvasElement.id = 'teamPerformanceChart';
                chartContainer.appendChild(canvasElement);
                needsReinit = true;
            } else if (chartContainer) {
                // Clear any SVG
                const svg = chartContainer.querySelector('svg.line-chart');
                if (svg) {
                    chartContainer.innerHTML = '';
                    if (!canvasElement) {
                        canvasElement = document.createElement('canvas');
                        canvasElement.id = 'teamPerformanceChart';
                        chartContainer.appendChild(canvasElement);
                        needsReinit = true;
                    } else {
                        chartContainer.appendChild(canvasElement);
                    }
                }
            }
            
            if (canvasElement) {
                canvasElement.style.display = 'block';
            }
            
            // Re-initialize chart if canvas was recreated
            if (needsReinit) {
                initTeamPerformanceChart();
            }
            setPerformanceReportCardMode('bar');
            
            // Show bar chart elements (legend and y-axis label)
            if (reportLegend) {
                reportLegend.style.display = 'flex';
            }
            setPerformanceReportCardMode('bar');

            const teamName = selectedTeam;
            const teamMemberName = selectedTeamData?.name || '';
            const teamTitle = selectedTeamData?.title || 'Team';

            if (!operationName) {
                resetTeamPerformanceVisuals();
                return;
            }

            // Check if this KPI has monthly series data (both Lag and Lead KPIs)
            const monthlySeries = technicalMonthlySeries[operationName] 
                || accountingMonthlySeries[operationName]
                || lradMonthlySeries[operationName]
                || dcMonthlySeries[operationName]
                || opportunityMonthlySeries[operationName]
                || marcomMonthlySeries[operationName]
                || gatheringMonthlySeries[operationName]
                || operationsMonthlySeries[operationName]
                || lradLeadMonthlySeries[operationName]
                || qualityLeadMonthlySeries[operationName]
                || dcLeadMonthlySeries[operationName]
                || itLeadMonthlySeries[operationName]
                || opportunityLeadMonthlySeries[operationName]
                || marcomLeadMonthlySeries[operationName]
                || auditLeadMonthlySeries[operationName]
                || gatheringLeadMonthlySeries[operationName]
                || operationsLeadMonthlySeries[operationName];

            // If monthly series data exists, use it
            if (monthlySeries) {
                // Remove quarter filter if it exists (for when switching from quarterly to monthly)
                const quarterFilter = reportCard?.querySelector('.quarter-filter-container');
                if (quarterFilter) {
                    quarterFilter.remove();
                }
                
                applyTeamPerformanceSeries({
                    labels: monthlySeries.labels,
                    target: monthlySeries.target,
                    actual: monthlySeries.actual,
                    previous: monthlySeries.previous || Array(monthlySeries.labels.length).fill(0),
                    valueType: monthlySeries.valueType
                });

                updatePerformanceCardCopy({
                    title: operationName,
                    subtitle: teamMemberName ? `${teamMemberName} • ${teamTitle}` : teamTitle
                });

                const isPercentageSeries = monthlySeries.valueType === 'percentage';
                updateTeamPerformanceInsight({
                    operationName,
                    leaderName: teamMemberName,
                    targetValue: target ?? monthlySeries.totalTarget,
                    actualValue: actual ?? monthlySeries.totalActual,
                    isPercentage: isPercentageSeries || /%|percent/i.test(operationName.toLowerCase()),
                    valueFormat: monthlySeries.valueType
                });
                return;
            }

            // Check if this is a Technical Team Operational KPI (needs quarterly filtering)
            const isTechnicalOperationalKpi = teamName === 'Technical Team' && 
                !monthlySeries && 
                (target !== null && target !== undefined && actual !== null && actual !== undefined);

            if (isTechnicalOperationalKpi) {
                // Generate quarterly data if it doesn't exist
                if (!technicalOperationalKpiQuarterlyData[operationName]) {
                    const isPercentage = /%|percent/i.test(operationName.toLowerCase());
                    const isCount = /#|number|count/i.test(operationName.toLowerCase());
                    
                    let targetRange, actualRange, decimals, valueType;
                    
                    if (isPercentage) {
                        targetRange = [Math.max(0, target * 0.85), target * 1.15];
                        actualRange = [Math.max(0, actual * 0.85), actual * 1.15];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [Math.max(0, Math.floor(target * 0.8)), Math.ceil(target * 1.2)];
                        actualRange = [Math.max(0, Math.floor(actual * 0.8)), Math.ceil(actual * 1.2)];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        // For monetary values, use thousands
                        targetRange = [target * 0.9, target * 1.1];
                        actualRange = [actual * 0.9, actual * 1.1];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                    
                    technicalOperationalKpiQuarterlyData[operationName] = generateQuarterlyData({
                        targetRange,
                        actualRange,
                        decimals,
                        valueType
                    });
                }

                // Add quarter dropdown to report card header
                const reportCardHeader = reportCard?.querySelector('.report-card-header');
                if (reportCardHeader) {
                    // Remove existing quarter filter if any
                    const existingFilter = reportCardHeader.querySelector('.quarter-filter-container');
                    if (existingFilter) {
                        existingFilter.remove();
                    }

                    // Create quarter filter dropdown
                    const filterContainer = document.createElement('div');
                    filterContainer.className = 'quarter-filter-container';
                    filterContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-left: auto;';
                    
                    const filterLabel = document.createElement('label');
                    filterLabel.textContent = 'Quarter:';
                    filterLabel.style.cssText = 'font-size: 12px; color: #525552; font-weight: 500;';
                    
                    const filterSelect = document.createElement('select');
                    filterSelect.id = 'quarterFilter';
                    filterSelect.style.cssText = 'padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; background: white; color: #525552; cursor: pointer;';
                    filterSelect.innerHTML = `
                        <option value="Q1">Q1 (Jan-Mar)</option>
                        <option value="Q2">Q2 (Apr-Jun)</option>
                        <option value="Q3">Q3 (Jul-Sep)</option>
                        <option value="Q4">Q4 (Oct-Dec)</option>
                    `;
                    
                    // Set default to current quarter (or Q1)
                    const currentMonth = new Date().getMonth();
                    const currentQuarter = Math.floor(currentMonth / 3) + 1;
                    filterSelect.value = `Q${currentQuarter}`;
                    
                    filterContainer.appendChild(filterLabel);
                    filterContainer.appendChild(filterSelect);
                    reportCardHeader.appendChild(filterContainer);

                    // Function to update chart based on selected quarter
                    const updateQuarterlyChart = (selectedQuarter) => {
                        const quarterlyData = technicalOperationalKpiQuarterlyData[operationName][selectedQuarter];
                        if (quarterlyData) {
                            applyTeamPerformanceSeries({
                                labels: quarterlyData.labels,
                                target: quarterlyData.target,
                                actual: quarterlyData.actual,
                                valueType: quarterlyData.valueType
                            });

                            const isPercentageKpi = quarterlyData.valueType === 'percentage';
                            const totalTarget = quarterlyData.target.reduce((sum, val) => sum + val, 0);
                            const totalActual = quarterlyData.actual.reduce((sum, val) => sum + val, 0);
                            
                            updateTeamPerformanceInsight({
                                operationName,
                                leaderName: teamMemberName,
                                targetValue: totalTarget,
                                actualValue: totalActual,
                                isPercentage: isPercentageKpi,
                                valueFormat: quarterlyData.valueType
                            });
                        }
                    };

                    // Initial load with default quarter
                    updateQuarterlyChart(filterSelect.value);

                    // Add change event listener
                    filterSelect.addEventListener('change', (e) => {
                        updateQuarterlyChart(e.target.value);
                    });
                }

                updatePerformanceCardCopy({
                    title: operationName,
                    subtitle: teamMemberName ? `${teamMemberName} • ${teamTitle}` : teamTitle
                });

                return;
            }

            // For other teams or KPIs without monthly series, use single value bar chart

            if (target === null || target === undefined || actual === null || actual === undefined) {
                resetTeamPerformanceVisuals({
                    infoMessage: 'No actual vs target values are available for this KPI.'
                });
                return;
            }

            const isPercentage = /%|percent/i.test(operationName.toLowerCase());

            const series = {
                labels: ['KPI Value'],
                target: [target],
                actual: [actual],
                valueType: isPercentage ? 'percentage' : 'thousands'
            };

            applyTeamPerformanceSeries(series);
            updatePerformanceCardCopy({
                title: operationName,
                subtitle: teamMemberName ? `${teamMemberName} • ${teamTitle}` : teamTitle
            });

            updateTeamPerformanceInsight({
                operationName,
                leaderName: teamMemberName,
                targetValue: target,
                actualValue: actual,
                isPercentage
            });
        }

        // Store team member chart instance
        let teamMemberChart = null;
        let currentTeamMemberView = 'monthly'; // 'monthly' or 'quarterly'

        function updateMemberPerformanceChart(kpiName, target, actual, monthlyTarget = null, monthlyActual = null) {
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            if (!chartContainer) return;

            // Ensure canvas exists, recreate if necessary
            let canvas = document.getElementById('teamPerformanceChart'); // Renamed from 'canvas' to avoid conflict
            if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
                chartContainer.innerHTML = ''; // Clear container
                canvas = document.createElement('canvas');
                canvas.id = 'teamPerformanceChart';
                chartContainer.appendChild(canvas);
            }

            chartContainer.style.display = 'block';

            const reportTitle = document.querySelector('.performance-report-card .report-title');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');

            // Show canvas and bar chart elements
            if (canvas) {
                canvas.style.display = 'block';
            }
            if (reportLegend) {
                reportLegend.style.display = 'flex';
            }

            // If no data, show empty state
            if (target === null || actual === null || kpiName === null) {
                if (teamMemberChart) {
                    teamMemberChart.destroy();
                    teamMemberChart = null;
                }
                chartContainer.innerHTML = '';
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

            // Prepare monthly data - use provided data or create from target/actual
            const targetData = monthlyTarget && Array.isArray(monthlyTarget) && monthlyTarget.length === 12
                ? monthlyTarget.map(v => v !== null && v !== undefined ? Number(v) : null)
                : Array(12).fill(null);
            const actualData = monthlyActual && Array.isArray(monthlyActual) && monthlyActual.length === 12
                ? monthlyActual.map(v => v !== null && v !== undefined ? Number(v) : null)
                : Array(12).fill(null);

            // Determine value formatter based on KPI type
            const isPercentageKpi = kpiName && (kpiName.includes('%') || kpiName.toLowerCase().includes('percent') || 
                                 kpiName.toLowerCase().includes('rate') || kpiName.toLowerCase().includes('uptime') ||
                                 kpiName.toLowerCase().includes('compliance') || kpiName.toLowerCase().includes('accuracy') ||
                                 kpiName.toLowerCase().includes('efficiency') || kpiName.toLowerCase().includes('quality'));
            
            const valueFormatter = isPercentageKpi 
                ? (value) => `${Number(value).toFixed(1)}%`
                : formatThousandsLabel;

            // Create chart structure with quarterly support
            const { data: chartData, config: chartConfig } = createComparisonChartStructures({
                labels: currentTeamMemberView === 'quarterly' 
                    ? ['Q1', 'Q2', 'Q3', 'Q4']
                    : MONTH_LABELS,
                yAxisTitle: kpiName,
                barPluginId: 'teamMemberBarDataLabels',
                currentLabel: 'Actual',
                previousLabel: 'Target',
                targetLabel: '',
                currentDataset: currentTeamMemberView === 'quarterly'
                    ? convertToQuarterly(actualData)
                    : actualData,
                previousDataset: currentTeamMemberView === 'quarterly'
                    ? convertToQuarterly(targetData)
                    : targetData,
                targetDataset: [],
                includeTarget: false,
                includeBarLabels: true,
                valueFormatter: valueFormatter,
                zeroLabel: isPercentageKpi ? '0%' : '0',
                axisBounds: {},
                beginAtZero: true,
                valueType: isPercentageKpi ? 'percentage' : 'thousands'
            });

            // Destroy existing chart if it exists
            if (teamMemberChart) {
                teamMemberChart.destroy();
            }

            // Create new chart
            if (canvas) {
                teamMemberChart = new Chart(canvas, chartConfig);
            }

            // Update title
            if (reportTitle) {
                const shortName = kpiName.length > 50 ? kpiName.substring(0, 50) + '...' : kpiName;
                reportTitle.innerHTML = `
                    Team Performance Report - ${shortName}
                    <div style="margin-top: 15px;">
                        <button id="quarterlyToggle" class="quarterly-toggle-btn" style="padding: 6px 12px; border: 1px solid #ddd; border-radius: 4px; background: ${currentTeamMemberView === 'quarterly' ? '#96a840' : '#fff'}; color: ${currentTeamMemberView === 'quarterly' ? '#fff' : '#525552'}; cursor: pointer;">
                            ${currentTeamMemberView === 'quarterly' ? 'Monthly View' : 'Quarterly View'}
                        </button>
                    </div>
                `;

                // Add toggle button handler
                const toggleBtn = document.getElementById('quarterlyToggle');
                if (toggleBtn) {
                    toggleBtn.addEventListener('click', () => {
                        currentTeamMemberView = currentTeamMemberView === 'quarterly' ? 'monthly' : 'quarterly';
                        updateMemberPerformanceChart(kpiName, target, actual, monthlyTarget, monthlyActual);
                    });
                }
            }
        }

        // Helper function to convert monthly data to quarterly
        function convertToQuarterly(monthlyData) {
            if (!Array.isArray(monthlyData) || monthlyData.length !== 12) {
                return [null, null, null, null];
            }
            
            const quarters = [
                [0, 1, 2],   // Q1: Jan, Feb, Mar
                [3, 4, 5],   // Q2: Apr, May, Jun
                [6, 7, 8],   // Q3: Jul, Aug, Sep
                [9, 10, 11]  // Q4: Oct, Nov, Dec
            ];

            return quarters.map(quarterIndices => {
                const quarterValues = quarterIndices
                    .map(idx => monthlyData[idx])
                    .filter(val => val !== null && val !== undefined && !isNaN(val));
                
                if (quarterValues.length === 0) return null;
                
                // Calculate average for the quarter
                const sum = quarterValues.reduce((acc, val) => acc + Number(val), 0);
                return sum / quarterValues.length;
            });
        }

        function updateTechnicalTeamKraCharts(kraName, target, actual, owner) {
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportTitle = document.querySelector('.performance-report-card .report-title');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            if (!chartContainer) return;

            // Clear chart container
            chartContainer.innerHTML = '';
            setPerformanceReportCardMode('bar');

            // Update title
            if (reportTitle) {
                const shortName = kraName.length > 50 ? kraName.substring(0, 50) + '...' : kraName;
                reportTitle.innerHTML = `
                    ${shortName}
                    <div style="font-size: 12px; margin-top: 10px; color: #9ca3af;">
                        ${owner}
                    </div>
                `;
            }

            // Update insight
            updateTeamPerformanceInsight({
                operationName: kraName,
                leaderName: owner,
                targetValue: target,
                actualValue: actual,
                isPercentage: false
            });
        }

        function updateAccountingTeamKraCharts(kraName, target, actual, owner) {
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportTitle = document.querySelector('.performance-report-card .report-title');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            if (!chartContainer) return;

            // Clear chart container
            chartContainer.innerHTML = '';
            setPerformanceReportCardMode('bar');

            // Update title
            if (reportTitle) {
                const shortName = kraName.length > 50 ? kraName.substring(0, 50) + '...' : kraName;
                reportTitle.innerHTML = `
                    ${shortName}
                    <div style="font-size: 12px; margin-top: 10px; color: #9ca3af;">
                        ${owner}
                    </div>
                `;
            }

            // Update insight
            updateTeamPerformanceInsight({
                operationName: kraName,
                leaderName: owner,
                targetValue: target,
                actualValue: actual,
                isPercentage: false
            });
        }

        function updateLradTeamKraCharts(kraName, target, actual, owner) {
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportTitle = document.querySelector('.performance-report-card .report-title');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            if (!chartContainer) return;

            // Clear chart container
            chartContainer.innerHTML = '';
            setPerformanceReportCardMode('bar');

            // Update title
            if (reportTitle) {
                const shortName = kraName.length > 50 ? kraName.substring(0, 50) + '...' : kraName;
                reportTitle.innerHTML = `
                    ${shortName}
                    <div style="font-size: 12px; margin-top: 10px; color: #9ca3af;">
                        ${owner}
                    </div>
                `;
            }

            // Update insight
            updateTeamPerformanceInsight({
                operationName: kraName,
                leaderName: owner,
                targetValue: target,
                actualValue: actual,
                isPercentage: false
            });
        }

        function updateQualityTeamKraCharts(kraName, target, actual, owner) {
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportTitle = document.querySelector('.performance-report-card .report-title');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            if (!chartContainer) return;

            // Clear chart container
            chartContainer.innerHTML = '';
            setPerformanceReportCardMode('bar');

            // Update title
            if (reportTitle) {
                const shortName = kraName.length > 50 ? kraName.substring(0, 50) + '...' : kraName;
                reportTitle.innerHTML = `
                    ${shortName}
                    <div style="font-size: 12px; margin-top: 10px; color: #9ca3af;">
                        ${owner}
                    </div>
                `;
            }

            // Update insight
            updateTeamPerformanceInsight({
                operationName: kraName,
                leaderName: owner,
                targetValue: target,
                actualValue: actual,
                isPercentage: false
            });
        }

        // Generic function to update team KRA charts (reusable for DC Team, Opportunity Team, etc.)
        function updateTeamKraChartsGeneric(teamName, teamDataVar, kraName, target, actual, owner) {
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportTitle = document.querySelector('.performance-report-card .report-title');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            if (!chartContainer) return;

            // Clear chart container
            chartContainer.innerHTML = '';
            setPerformanceReportCardMode('bar');

            if (reportTitle) {
                const shortName = kraName.length > 50 ? kraName.substring(0, 50) + '...' : kraName;
                reportTitle.innerHTML = `
                    ${shortName}
                    <div style="font-size: 12px; margin-top: 10px; color: #9ca3af;">
                        ${owner}
                    </div>
                `;
            }

            updateTeamPerformanceInsight({
                operationName: kraName,
                leaderName: owner,
                targetValue: target,
                actualValue: actual,
                isPercentage: false
            });
        }

        function updateDcTeamKraCharts(kraName, target, actual, owner) {
            updateTeamKraChartsGeneric('DC Team', dcTeamByOwner, kraName, target, actual, owner);
        }

        function updateOpportunityTeamKraCharts(kraName, target, actual, owner) {
            updateTeamKraChartsGeneric('Opportunity Team', opportunityTeamByOwner, kraName, target, actual, owner);
        }

        function updateItTeamKraCharts(kraName, target, actual, owner) {
            updateTeamKraChartsGeneric('IT Team', itTeamByOwner, kraName, target, actual, owner);
        }

        function updateMarcomTeamKraCharts(kraName, target, actual, owner) {
            updateTeamKraChartsGeneric('Marcom Team', marcomTeamByOwner, kraName, target, actual, owner);
        }

        function updateOperationsTeamKraCharts(kraName, target, actual, owner) {
            updateTeamKraChartsGeneric('Operations Team', operationsTeamByOwner, kraName, target, actual, owner);
        }

        function updateAuditTeamKraCharts(kraName, target, actual, owner) {
            updateTeamKraChartsGeneric('Audit Team', auditTeamByOwner, kraName, target, actual, owner);
        }

        function updateGatheringTeamKraCharts(kraName, target, actual, owner) {
            updateTeamKraChartsGeneric('Gathering Team', gatheringTeamByOwner, kraName, target, actual, owner);
        }

        function updateTechnicalTeamOperationalKpiChart(kpiName, target, actual) {
            // Show canvas and hide any SVG
            const canvas = document.getElementById('teamPerformanceChart');
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            
            // If canvas doesn't exist, recreate it
            let canvasElement = canvas;
            let needsReinit = false;
            if (!canvasElement && chartContainer) {
                chartContainer.innerHTML = '';
                canvasElement = document.createElement('canvas');
                canvasElement.id = 'teamPerformanceChart';
                chartContainer.appendChild(canvasElement);
                needsReinit = true;
            } else if (chartContainer) {
                // Clear any SVG
                const svg = chartContainer.querySelector('svg.line-chart');
                if (svg) {
                    chartContainer.innerHTML = '';
                    if (!canvasElement) {
                        canvasElement = document.createElement('canvas');
                        canvasElement.id = 'teamPerformanceChart';
                        chartContainer.appendChild(canvasElement);
                        needsReinit = true;
                    } else {
                        chartContainer.appendChild(canvasElement);
                    }
                }
            }
            
            if (canvasElement) {
                canvasElement.style.display = 'block';
            }
            
            // Re-initialize chart if canvas was recreated
            if (needsReinit) {
                initTeamPerformanceChart();
            }
            
            // Show bar chart elements (legend and y-axis label)
            if (reportLegend) {
                reportLegend.style.display = 'flex';
            }
            setPerformanceReportCardMode('bar');


            if (!kpiName) {
                resetTeamPerformanceVisuals();
                return;
            }

            // Generate quarterly data if it doesn't exist
            if (!technicalOperationalKpiQuarterlyData[kpiName]) {
                const isPercentage = /%|percent/i.test(kpiName.toLowerCase());
                const isCount = /#|number|count/i.test(kpiName.toLowerCase());
                
                let targetRange, actualRange, decimals, valueType;
                
                if (target !== null && actual !== null) {
                    if (isPercentage) {
                        targetRange = [Math.max(0, target * 0.85), target * 1.15];
                        actualRange = [Math.max(0, actual * 0.85), actual * 1.15];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [Math.max(0, Math.floor(target * 0.8)), Math.ceil(target * 1.2)];
                        actualRange = [Math.max(0, Math.floor(actual * 0.8)), Math.ceil(actual * 1.2)];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        // For monetary values, use thousands
                        targetRange = [target * 0.9, target * 1.1];
                        actualRange = [actual * 0.9, actual * 1.1];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                } else {
                    // Default ranges if target/actual are not available
                    if (isPercentage) {
                        targetRange = [80, 100];
                        actualRange = [75, 95];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [10, 50];
                        actualRange = [8, 45];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        targetRange = [10000, 50000];
                        actualRange = [9000, 48000];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                }
                
                technicalOperationalKpiQuarterlyData[kpiName] = generateQuarterlyData({
                    targetRange,
                    actualRange,
                    decimals,
                    valueType
                });
            }

            // Add quarter dropdown to report card header
            const reportCardHeader = reportCard?.querySelector('.report-card-header');
            if (reportCardHeader) {
                // Remove existing quarter filter if any
                const existingFilter = reportCardHeader.querySelector('.quarter-filter-container');
                if (existingFilter) {
                    existingFilter.remove();
                }

                // Create quarter filter dropdown
                const filterContainer = document.createElement('div');
                filterContainer.className = 'quarter-filter-container';
                filterContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-left: auto;';
                
                const filterLabel = document.createElement('label');
                filterLabel.textContent = 'Quarter:';
                filterLabel.style.cssText = 'font-size: 12px; color: #525552; font-weight: 500;';
                
                const filterSelect = document.createElement('select');
                filterSelect.id = 'quarterFilter';
                filterSelect.style.cssText = 'padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; background: white; color: #525552; cursor: pointer;';
                filterSelect.innerHTML = `
                    <option value="Q1">Q1 (Jan-Mar)</option>
                    <option value="Q2">Q2 (Apr-Jun)</option>
                    <option value="Q3">Q3 (Jul-Sep)</option>
                    <option value="Q4">Q4 (Oct-Dec)</option>
                `;
                
                // Set default to current quarter (or Q1)
                const currentMonth = new Date().getMonth();
                const currentQuarter = Math.floor(currentMonth / 3) + 1;
                filterSelect.value = `Q${currentQuarter}`;
                
                filterContainer.appendChild(filterLabel);
                filterContainer.appendChild(filterSelect);
                reportCardHeader.appendChild(filterContainer);

                // Function to update chart based on selected quarter
                const updateQuarterlyChart = (selectedQuarter) => {
                    const quarterlyData = technicalOperationalKpiQuarterlyData[kpiName][selectedQuarter];
                    if (quarterlyData) {
                        applyTeamPerformanceSeries({
                            labels: quarterlyData.labels,
                            target: quarterlyData.target,
                            actual: quarterlyData.actual,
                            valueType: quarterlyData.valueType
                        });

                        const isPercentageKpi = quarterlyData.valueType === 'percentage';
                        const totalTarget = quarterlyData.target.reduce((sum, val) => sum + val, 0);
                        const totalActual = quarterlyData.actual.reduce((sum, val) => sum + val, 0);
                        
                        updateTeamPerformanceInsight({
                            operationName: kpiName,
                            leaderName: '',
                            targetValue: totalTarget,
                            actualValue: totalActual,
                            isPercentage: isPercentageKpi,
                            valueFormat: quarterlyData.valueType
                        });
                    }
                };

                // Initial load with default quarter
                updateQuarterlyChart(filterSelect.value);

                // Add change event listener
                filterSelect.addEventListener('change', (e) => {
                    updateQuarterlyChart(e.target.value);
                });
            }

            updatePerformanceCardCopy({
                title: kpiName,
                subtitle: 'Technical Team • Operational KPI'
            });
        }

        function updateAccountingTeamOperationalKpiChart(kpiName, target, actual) {
            // Show canvas and hide any SVG
            const canvas = document.getElementById('teamPerformanceChart');
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            
            // If canvas doesn't exist, recreate it
            let canvasElement = canvas;
            let needsReinit = false;
            if (!canvasElement && chartContainer) {
                chartContainer.innerHTML = '';
                canvasElement = document.createElement('canvas');
                canvasElement.id = 'teamPerformanceChart';
                chartContainer.appendChild(canvasElement);
                needsReinit = true;
            } else if (chartContainer) {
                // Clear any SVG
                const svg = chartContainer.querySelector('svg.line-chart');
                if (svg) {
                    chartContainer.innerHTML = '';
                    if (!canvasElement) {
                        canvasElement = document.createElement('canvas');
                        canvasElement.id = 'teamPerformanceChart';
                        chartContainer.appendChild(canvasElement);
                        needsReinit = true;
                    } else {
                        chartContainer.appendChild(canvasElement);
                    }
                }
            }
            
            if (canvasElement) {
                canvasElement.style.display = 'block';
            }
            
            // Re-initialize chart if canvas was recreated
            if (needsReinit) {
                initTeamPerformanceChart();
            }
            
            // Show bar chart elements (legend and y-axis label)
            if (reportLegend) {
                reportLegend.style.display = 'flex';
            }
            setPerformanceReportCardMode('bar');


            if (!kpiName) {
                resetTeamPerformanceVisuals();
                return;
            }

            // Generate quarterly data if it doesn't exist
            if (!accountingOperationalKpiQuarterlyData[kpiName]) {
                const isPercentage = /%|percent/i.test(kpiName.toLowerCase());
                const isCount = /#|number|count/i.test(kpiName.toLowerCase());
                
                let targetRange, actualRange, decimals, valueType;
                
                if (target !== null && actual !== null) {
                    if (isPercentage) {
                        targetRange = [Math.max(0, target * 0.85), target * 1.15];
                        actualRange = [Math.max(0, actual * 0.85), actual * 1.15];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [Math.max(0, Math.floor(target * 0.8)), Math.ceil(target * 1.2)];
                        actualRange = [Math.max(0, Math.floor(actual * 0.8)), Math.ceil(actual * 1.2)];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        // For monetary values, use thousands
                        targetRange = [target * 0.9, target * 1.1];
                        actualRange = [actual * 0.9, actual * 1.1];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                } else {
                    // Default ranges if target/actual are not available
                    if (isPercentage) {
                        targetRange = [80, 100];
                        actualRange = [75, 95];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [10, 50];
                        actualRange = [8, 45];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        targetRange = [10000, 50000];
                        actualRange = [9000, 48000];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                }
                
                accountingOperationalKpiQuarterlyData[kpiName] = generateQuarterlyData({
                    targetRange,
                    actualRange,
                    decimals,
                    valueType
                });
            }

            // Add quarter dropdown to report card header
            const reportCardHeader = reportCard?.querySelector('.report-card-header');
            if (reportCardHeader) {
                // Remove existing quarter filter if any
                const existingFilter = reportCardHeader.querySelector('.quarter-filter-container');
                if (existingFilter) {
                    existingFilter.remove();
                }

                // Create quarter filter dropdown
                const filterContainer = document.createElement('div');
                filterContainer.className = 'quarter-filter-container';
                filterContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-left: auto;';
                
                const filterLabel = document.createElement('label');
                filterLabel.textContent = 'Quarter:';
                filterLabel.style.cssText = 'font-size: 12px; color: #525552; font-weight: 500;';
                
                const filterSelect = document.createElement('select');
                filterSelect.id = 'quarterFilter';
                filterSelect.style.cssText = 'padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; background: white; color: #525552; cursor: pointer;';
                filterSelect.innerHTML = `
                    <option value="Q1">Q1 (Jan-Mar)</option>
                    <option value="Q2">Q2 (Apr-Jun)</option>
                    <option value="Q3">Q3 (Jul-Sep)</option>
                    <option value="Q4">Q4 (Oct-Dec)</option>
                `;
                
                // Set default to current quarter (or Q1)
                const currentMonth = new Date().getMonth();
                const currentQuarter = Math.floor(currentMonth / 3) + 1;
                filterSelect.value = `Q${currentQuarter}`;
                
                filterContainer.appendChild(filterLabel);
                filterContainer.appendChild(filterSelect);
                reportCardHeader.appendChild(filterContainer);

                // Function to update chart based on selected quarter
                const updateQuarterlyChart = (selectedQuarter) => {
                    const quarterlyData = accountingOperationalKpiQuarterlyData[kpiName][selectedQuarter];
                    if (quarterlyData) {
                        applyTeamPerformanceSeries({
                            labels: quarterlyData.labels,
                            target: quarterlyData.target,
                            actual: quarterlyData.actual,
                            valueType: quarterlyData.valueType
                        });

                        const isPercentageKpi = quarterlyData.valueType === 'percentage';
                        const totalTarget = quarterlyData.target.reduce((sum, val) => sum + val, 0);
                        const totalActual = quarterlyData.actual.reduce((sum, val) => sum + val, 0);
                        
                        updateTeamPerformanceInsight({
                            operationName: kpiName,
                            leaderName: '',
                            targetValue: totalTarget,
                            actualValue: totalActual,
                            isPercentage: isPercentageKpi,
                            valueFormat: quarterlyData.valueType
                        });
                    }
                };

                // Initial load with default quarter
                updateQuarterlyChart(filterSelect.value);

                // Add change event listener
                filterSelect.addEventListener('change', (e) => {
                    updateQuarterlyChart(e.target.value);
                });
            }

            updatePerformanceCardCopy({
                title: kpiName,
                subtitle: 'Accounting Team • Operational KPI'
            });
        }

        function updateLradTeamOperationalKpiChart(kpiName, target, actual) {
            // Show canvas and hide any SVG
            const canvas = document.getElementById('teamPerformanceChart');
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            
            // If canvas doesn't exist, recreate it
            let canvasElement = canvas;
            let needsReinit = false;
            if (!canvasElement && chartContainer) {
                chartContainer.innerHTML = '';
                canvasElement = document.createElement('canvas');
                canvasElement.id = 'teamPerformanceChart';
                chartContainer.appendChild(canvasElement);
                needsReinit = true;
            } else if (chartContainer) {
                // Clear any SVG
                const svg = chartContainer.querySelector('svg.line-chart');
                if (svg) {
                    chartContainer.innerHTML = '';
                    if (!canvasElement) {
                        canvasElement = document.createElement('canvas');
                        canvasElement.id = 'teamPerformanceChart';
                        chartContainer.appendChild(canvasElement);
                        needsReinit = true;
                    } else {
                        chartContainer.appendChild(canvasElement);
                    }
                }
            }
            
            if (canvasElement) {
                canvasElement.style.display = 'block';
            }
            
            // Re-initialize chart if canvas was recreated
            if (needsReinit) {
                initTeamPerformanceChart();
            }
            
            // Show bar chart elements (legend and y-axis label)
            if (reportLegend) {
                reportLegend.style.display = 'flex';
            }
            setPerformanceReportCardMode('bar');


            if (!kpiName) {
                resetTeamPerformanceVisuals();
                return;
            }

            // Generate quarterly data if it doesn't exist
            if (!lradOperationalKpiQuarterlyData[kpiName]) {
                const isPercentage = /%|percent/i.test(kpiName.toLowerCase());
                const isCount = /#|number|count/i.test(kpiName.toLowerCase());
                
                let targetRange, actualRange, decimals, valueType;
                
                if (target !== null && actual !== null) {
                    if (isPercentage) {
                        targetRange = [Math.max(0, target * 0.85), target * 1.15];
                        actualRange = [Math.max(0, actual * 0.85), actual * 1.15];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [Math.max(0, Math.floor(target * 0.8)), Math.ceil(target * 1.2)];
                        actualRange = [Math.max(0, Math.floor(actual * 0.8)), Math.ceil(actual * 1.2)];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        // For monetary values, use thousands
                        targetRange = [target * 0.9, target * 1.1];
                        actualRange = [actual * 0.9, actual * 1.1];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                } else {
                    // Default ranges if target/actual are not available
                    if (isPercentage) {
                        targetRange = [80, 100];
                        actualRange = [75, 95];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [10, 50];
                        actualRange = [8, 45];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        targetRange = [10000, 50000];
                        actualRange = [9000, 48000];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                }
                
                lradOperationalKpiQuarterlyData[kpiName] = generateQuarterlyData({
                    targetRange,
                    actualRange,
                    decimals,
                    valueType
                });
            }

            // Add quarter dropdown to report card header
            const reportCardHeader = reportCard?.querySelector('.report-card-header');
            if (reportCardHeader) {
                // Remove existing quarter filter if any
                const existingFilter = reportCardHeader.querySelector('.quarter-filter-container');
                if (existingFilter) {
                    existingFilter.remove();
                }

                // Create quarter filter dropdown
                const filterContainer = document.createElement('div');
                filterContainer.className = 'quarter-filter-container';
                filterContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-left: auto;';
                
                const filterLabel = document.createElement('label');
                filterLabel.textContent = 'Quarter:';
                filterLabel.style.cssText = 'font-size: 12px; color: #525552; font-weight: 500;';
                
                const filterSelect = document.createElement('select');
                filterSelect.id = 'quarterFilter';
                filterSelect.style.cssText = 'padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; background: white; color: #525552; cursor: pointer;';
                filterSelect.innerHTML = `
                    <option value="Q1">Q1 (Jan-Mar)</option>
                    <option value="Q2">Q2 (Apr-Jun)</option>
                    <option value="Q3">Q3 (Jul-Sep)</option>
                    <option value="Q4">Q4 (Oct-Dec)</option>
                `;
                
                // Set default to current quarter (or Q1)
                const currentMonth = new Date().getMonth();
                const currentQuarter = Math.floor(currentMonth / 3) + 1;
                filterSelect.value = `Q${currentQuarter}`;
                
                filterContainer.appendChild(filterLabel);
                filterContainer.appendChild(filterSelect);
                reportCardHeader.appendChild(filterContainer);

                // Function to update chart based on selected quarter
                const updateQuarterlyChart = (selectedQuarter) => {
                    const quarterlyData = lradOperationalKpiQuarterlyData[kpiName][selectedQuarter];
                    if (quarterlyData) {
                        applyTeamPerformanceSeries({
                            labels: quarterlyData.labels,
                            target: quarterlyData.target,
                            actual: quarterlyData.actual,
                            valueType: quarterlyData.valueType
                        });

                        const isPercentageKpi = quarterlyData.valueType === 'percentage';
                        const totalTarget = quarterlyData.target.reduce((sum, val) => sum + val, 0);
                        const totalActual = quarterlyData.actual.reduce((sum, val) => sum + val, 0);
                        
                        updateTeamPerformanceInsight({
                            operationName: kpiName,
                            leaderName: '',
                            targetValue: totalTarget,
                            actualValue: totalActual,
                            isPercentage: isPercentageKpi,
                            valueFormat: quarterlyData.valueType
                        });
                    }
                };

                // Initial load with default quarter
                updateQuarterlyChart(filterSelect.value);

                // Add change event listener
                filterSelect.addEventListener('change', (e) => {
                    updateQuarterlyChart(e.target.value);
                });
            }

            updatePerformanceCardCopy({
                title: kpiName,
                subtitle: 'LRAD Team • Operational KPI'
            });
        }

        function updateQualityTeamOperationalKpiChart(kpiName, target, actual) {
            // Show canvas and hide any SVG
            const canvas = document.getElementById('teamPerformanceChart');
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            
            // If canvas doesn't exist, recreate it
            let canvasElement = canvas;
            let needsReinit = false;
            if (!canvasElement && chartContainer) {
                chartContainer.innerHTML = '';
                canvasElement = document.createElement('canvas');
                canvasElement.id = 'teamPerformanceChart';
                chartContainer.appendChild(canvasElement);
                needsReinit = true;
            } else if (chartContainer) {
                // Clear any SVG
                const svg = chartContainer.querySelector('svg.line-chart');
                if (svg) {
                    chartContainer.innerHTML = '';
                    if (!canvasElement) {
                        canvasElement = document.createElement('canvas');
                        canvasElement.id = 'teamPerformanceChart';
                        chartContainer.appendChild(canvasElement);
                        needsReinit = true;
                    } else {
                        chartContainer.appendChild(canvasElement);
                    }
                }
            }
            
            if (canvasElement) {
                canvasElement.style.display = 'block';
            }
            
            // Re-initialize chart if canvas was recreated
            if (needsReinit) {
                initTeamPerformanceChart();
            }
            
            // Show bar chart elements (legend and y-axis label)
            if (reportLegend) {
                reportLegend.style.display = 'flex';
            }
            setPerformanceReportCardMode('bar');


            if (!kpiName) {
                resetTeamPerformanceVisuals();
                return;
            }

            // Generate quarterly data if it doesn't exist
            if (!qualityOperationalKpiQuarterlyData[kpiName]) {
                const isPercentage = /%|percent/i.test(kpiName.toLowerCase());
                const isCount = /#|number|count/i.test(kpiName.toLowerCase());
                
                let targetRange, actualRange, decimals, valueType;
                
                if (target !== null && actual !== null) {
                    if (isPercentage) {
                        targetRange = [Math.max(0, target * 0.85), target * 1.15];
                        actualRange = [Math.max(0, actual * 0.85), actual * 1.15];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [Math.max(0, Math.floor(target * 0.8)), Math.ceil(target * 1.2)];
                        actualRange = [Math.max(0, Math.floor(actual * 0.8)), Math.ceil(actual * 1.2)];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        // For monetary values, use thousands
                        targetRange = [target * 0.9, target * 1.1];
                        actualRange = [actual * 0.9, actual * 1.1];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                } else {
                    // Default ranges if target/actual are not available
                    if (isPercentage) {
                        targetRange = [80, 100];
                        actualRange = [75, 95];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [10, 50];
                        actualRange = [8, 45];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        targetRange = [10000, 50000];
                        actualRange = [9000, 48000];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                }
                
                qualityOperationalKpiQuarterlyData[kpiName] = generateQuarterlyData({
                    targetRange,
                    actualRange,
                    decimals,
                    valueType
                });
            }

            // Add quarter dropdown to report card header
            const reportCardHeader = reportCard?.querySelector('.report-card-header');
            if (reportCardHeader) {
                // Remove existing quarter filter if any
                const existingFilter = reportCardHeader.querySelector('.quarter-filter-container');
                if (existingFilter) {
                    existingFilter.remove();
                }

                // Create quarter filter dropdown
                const filterContainer = document.createElement('div');
                filterContainer.className = 'quarter-filter-container';
                filterContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-left: auto;';
                
                const filterLabel = document.createElement('label');
                filterLabel.textContent = 'Quarter:';
                filterLabel.style.cssText = 'font-size: 12px; color: #525552; font-weight: 500;';
                
                const filterSelect = document.createElement('select');
                filterSelect.id = 'quarterFilter';
                filterSelect.style.cssText = 'padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; background: white; color: #525552; cursor: pointer;';
                filterSelect.innerHTML = `
                    <option value="Q1">Q1 (Jan-Mar)</option>
                    <option value="Q2">Q2 (Apr-Jun)</option>
                    <option value="Q3">Q3 (Jul-Sep)</option>
                    <option value="Q4">Q4 (Oct-Dec)</option>
                `;
                
                // Set default to current quarter (or Q1)
                const currentMonth = new Date().getMonth();
                const currentQuarter = Math.floor(currentMonth / 3) + 1;
                filterSelect.value = `Q${currentQuarter}`;
                
                filterContainer.appendChild(filterLabel);
                filterContainer.appendChild(filterSelect);
                reportCardHeader.appendChild(filterContainer);

                // Function to update chart based on selected quarter
                const updateQuarterlyChart = (selectedQuarter) => {
                    const quarterlyData = qualityOperationalKpiQuarterlyData[kpiName][selectedQuarter];
                    if (quarterlyData) {
                        applyTeamPerformanceSeries({
                            labels: quarterlyData.labels,
                            target: quarterlyData.target,
                            actual: quarterlyData.actual,
                            valueType: quarterlyData.valueType
                        });

                        const isPercentageKpi = quarterlyData.valueType === 'percentage';
                        const totalTarget = quarterlyData.target.reduce((sum, val) => sum + val, 0);
                        const totalActual = quarterlyData.actual.reduce((sum, val) => sum + val, 0);
                        
                        updateTeamPerformanceInsight({
                            operationName: kpiName,
                            leaderName: '',
                            targetValue: totalTarget,
                            actualValue: totalActual,
                            isPercentage: isPercentageKpi,
                            valueFormat: quarterlyData.valueType
                        });
                    }
                };

                // Initial load with default quarter
                updateQuarterlyChart(filterSelect.value);

                // Add change event listener
                filterSelect.addEventListener('change', (e) => {
                    updateQuarterlyChart(e.target.value);
                });
            }

            updatePerformanceCardCopy({
                title: kpiName,
                subtitle: 'Quality Team • Operational KPI'
            });
        }

        function updateDcTeamOperationalKpiChart(kpiName, target, actual) {
            // Show canvas and hide any SVG
            const canvas = document.getElementById('teamPerformanceChart');
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            
            // If canvas doesn't exist, recreate it
            let canvasElement = canvas;
            let needsReinit = false;
            if (!canvasElement && chartContainer) {
                chartContainer.innerHTML = '';
                canvasElement = document.createElement('canvas');
                canvasElement.id = 'teamPerformanceChart';
                chartContainer.appendChild(canvasElement);
                needsReinit = true;
            } else if (chartContainer) {
                // Clear any SVG
                const svg = chartContainer.querySelector('svg.line-chart');
                if (svg) {
                    chartContainer.innerHTML = '';
                    if (!canvasElement) {
                        canvasElement = document.createElement('canvas');
                        canvasElement.id = 'teamPerformanceChart';
                        chartContainer.appendChild(canvasElement);
                        needsReinit = true;
                    } else {
                        chartContainer.appendChild(canvasElement);
                    }
                }
            }
            
            if (canvasElement) {
                canvasElement.style.display = 'block';
            }
            
            // Re-initialize chart if canvas was recreated
            if (needsReinit) {
                initTeamPerformanceChart();
            }
            
            // Show bar chart elements (legend and y-axis label)
            if (reportLegend) {
                reportLegend.style.display = 'flex';
            }
            setPerformanceReportCardMode('bar');


            if (!kpiName) {
                resetTeamPerformanceVisuals();
                return;
            }

            // Generate quarterly data if it doesn't exist
            if (!dcOperationalKpiQuarterlyData[kpiName]) {
                const isPercentage = /%|percent/i.test(kpiName.toLowerCase());
                const isCount = /#|number|count/i.test(kpiName.toLowerCase());
                
                let targetRange, actualRange, decimals, valueType;
                
                if (target !== null && actual !== null) {
                    if (isPercentage) {
                        targetRange = [Math.max(0, target * 0.85), target * 1.15];
                        actualRange = [Math.max(0, actual * 0.85), actual * 1.15];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [Math.max(0, Math.floor(target * 0.8)), Math.ceil(target * 1.2)];
                        actualRange = [Math.max(0, Math.floor(actual * 0.8)), Math.ceil(actual * 1.2)];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        // For monetary values, use thousands
                        targetRange = [target * 0.9, target * 1.1];
                        actualRange = [actual * 0.9, actual * 1.1];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                } else {
                    // Default ranges if target/actual are not available
                    if (isPercentage) {
                        targetRange = [80, 100];
                        actualRange = [75, 95];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [10, 50];
                        actualRange = [8, 45];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        targetRange = [10000, 50000];
                        actualRange = [9000, 48000];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                }
                
                dcOperationalKpiQuarterlyData[kpiName] = generateQuarterlyData({
                    targetRange,
                    actualRange,
                    decimals,
                    valueType
                });
            }

            // Add quarter dropdown to report card header
            const reportCardHeader = reportCard?.querySelector('.report-card-header');
            if (reportCardHeader) {
                // Remove existing quarter filter if any
                const existingFilter = reportCardHeader.querySelector('.quarter-filter-container');
                if (existingFilter) {
                    existingFilter.remove();
                }

                // Create quarter filter dropdown
                const filterContainer = document.createElement('div');
                filterContainer.className = 'quarter-filter-container';
                filterContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-left: auto;';
                
                const filterLabel = document.createElement('label');
                filterLabel.textContent = 'Quarter:';
                filterLabel.style.cssText = 'font-size: 12px; color: #525552; font-weight: 500;';
                
                const filterSelect = document.createElement('select');
                filterSelect.id = 'quarterFilter';
                filterSelect.style.cssText = 'padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; background: white; color: #525552; cursor: pointer;';
                filterSelect.innerHTML = `
                    <option value="Q1">Q1 (Jan-Mar)</option>
                    <option value="Q2">Q2 (Apr-Jun)</option>
                    <option value="Q3">Q3 (Jul-Sep)</option>
                    <option value="Q4">Q4 (Oct-Dec)</option>
                `;
                
                // Set default to current quarter (or Q1)
                const currentMonth = new Date().getMonth();
                const currentQuarter = Math.floor(currentMonth / 3) + 1;
                filterSelect.value = `Q${currentQuarter}`;
                
                filterContainer.appendChild(filterLabel);
                filterContainer.appendChild(filterSelect);
                reportCardHeader.appendChild(filterContainer);

                // Function to update chart based on selected quarter
                const updateQuarterlyChart = (selectedQuarter) => {
                    const quarterlyData = dcOperationalKpiQuarterlyData[kpiName][selectedQuarter];
                    if (quarterlyData) {
                        applyTeamPerformanceSeries({
                            labels: quarterlyData.labels,
                            target: quarterlyData.target,
                            actual: quarterlyData.actual,
                            valueType: quarterlyData.valueType
                        });

                        const isPercentageKpi = quarterlyData.valueType === 'percentage';
                        const totalTarget = quarterlyData.target.reduce((sum, val) => sum + val, 0);
                        const totalActual = quarterlyData.actual.reduce((sum, val) => sum + val, 0);
                        
                        updateTeamPerformanceInsight({
                            operationName: kpiName,
                            leaderName: '',
                            targetValue: totalTarget,
                            actualValue: totalActual,
                            isPercentage: isPercentageKpi,
                            valueFormat: quarterlyData.valueType
                        });
                    }
                };

                // Initial load with default quarter
                updateQuarterlyChart(filterSelect.value);

                // Add change event listener
                filterSelect.addEventListener('change', (e) => {
                    updateQuarterlyChart(e.target.value);
                });
            }

            updatePerformanceCardCopy({
                title: kpiName,
                subtitle: 'DC Team • Operational KPI'
            });
        }

        function updateItTeamOperationalKpiChart(kpiName, target, actual) {
            // Show canvas and hide any SVG
            const canvas = document.getElementById('teamPerformanceChart');
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            
            // If canvas doesn't exist, recreate it
            let canvasElement = canvas;
            let needsReinit = false;
            if (!canvasElement && chartContainer) {
                chartContainer.innerHTML = '';
                canvasElement = document.createElement('canvas');
                canvasElement.id = 'teamPerformanceChart';
                chartContainer.appendChild(canvasElement);
                needsReinit = true;
            } else if (chartContainer) {
                // Clear any SVG
                const svg = chartContainer.querySelector('svg.line-chart');
                if (svg) {
                    chartContainer.innerHTML = '';
                    if (!canvasElement) {
                        canvasElement = document.createElement('canvas');
                        canvasElement.id = 'teamPerformanceChart';
                        chartContainer.appendChild(canvasElement);
                        needsReinit = true;
                    } else {
                        chartContainer.appendChild(canvasElement);
                    }
                }
            }
            
            if (canvasElement) {
                canvasElement.style.display = 'block';
            }
            
            // Re-initialize chart if canvas was recreated
            if (needsReinit) {
                initTeamPerformanceChart();
            }
            
            // Show bar chart elements (legend and y-axis label)
            if (reportLegend) {
                reportLegend.style.display = 'flex';
            }
            setPerformanceReportCardMode('bar');


            if (!kpiName) {
                resetTeamPerformanceVisuals();
                return;
            }

            // Generate quarterly data if it doesn't exist
            if (!itOperationalKpiQuarterlyData[kpiName]) {
                const isPercentage = /%|percent/i.test(kpiName.toLowerCase());
                const isCount = /#|number|count/i.test(kpiName.toLowerCase());
                
                let targetRange, actualRange, decimals, valueType;
                
                if (target !== null && actual !== null) {
                    if (isPercentage) {
                        targetRange = [Math.max(0, target * 0.85), target * 1.15];
                        actualRange = [Math.max(0, actual * 0.85), actual * 1.15];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [Math.max(0, Math.floor(target * 0.8)), Math.ceil(target * 1.2)];
                        actualRange = [Math.max(0, Math.floor(actual * 0.8)), Math.ceil(actual * 1.2)];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        // For monetary values, use thousands
                        targetRange = [target * 0.9, target * 1.1];
                        actualRange = [actual * 0.9, actual * 1.1];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                } else {
                    // Default ranges if target/actual are not available
                    if (isPercentage) {
                        targetRange = [80, 100];
                        actualRange = [75, 95];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [10, 50];
                        actualRange = [8, 45];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        targetRange = [10000, 50000];
                        actualRange = [9000, 48000];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                }
                
                itOperationalKpiQuarterlyData[kpiName] = generateQuarterlyData({
                    targetRange,
                    actualRange,
                    decimals,
                    valueType
                });
            }

            // Add quarter dropdown to report card header
            const reportCardHeader = reportCard?.querySelector('.report-card-header');
            if (reportCardHeader) {
                // Remove existing quarter filter if any
                const existingFilter = reportCardHeader.querySelector('.quarter-filter-container');
                if (existingFilter) {
                    existingFilter.remove();
                }

                // Create quarter filter dropdown
                const filterContainer = document.createElement('div');
                filterContainer.className = 'quarter-filter-container';
                filterContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-left: auto;';
                
                const filterLabel = document.createElement('label');
                filterLabel.textContent = 'Quarter:';
                filterLabel.style.cssText = 'font-size: 12px; color: #525552; font-weight: 500;';
                
                const filterSelect = document.createElement('select');
                filterSelect.id = 'quarterFilter';
                filterSelect.style.cssText = 'padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; background: white; color: #525552; cursor: pointer;';
                filterSelect.innerHTML = `
                    <option value="Q1">Q1 (Jan-Mar)</option>
                    <option value="Q2">Q2 (Apr-Jun)</option>
                    <option value="Q3">Q3 (Jul-Sep)</option>
                    <option value="Q4">Q4 (Oct-Dec)</option>
                `;
                
                // Set default to current quarter (or Q1)
                const currentMonth = new Date().getMonth();
                const currentQuarter = Math.floor(currentMonth / 3) + 1;
                filterSelect.value = `Q${currentQuarter}`;
                
                filterContainer.appendChild(filterLabel);
                filterContainer.appendChild(filterSelect);
                reportCardHeader.appendChild(filterContainer);

                // Function to update chart based on selected quarter
                const updateQuarterlyChart = (selectedQuarter) => {
                    const quarterlyData = itOperationalKpiQuarterlyData[kpiName][selectedQuarter];
                    if (quarterlyData) {
                        applyTeamPerformanceSeries({
                            labels: quarterlyData.labels,
                            target: quarterlyData.target,
                            actual: quarterlyData.actual,
                            valueType: quarterlyData.valueType
                        });

                        const isPercentageKpi = quarterlyData.valueType === 'percentage';
                        const totalTarget = quarterlyData.target.reduce((sum, val) => sum + val, 0);
                        const totalActual = quarterlyData.actual.reduce((sum, val) => sum + val, 0);
                        
                        updateTeamPerformanceInsight({
                            operationName: kpiName,
                            leaderName: '',
                            targetValue: totalTarget,
                            actualValue: totalActual,
                            isPercentage: isPercentageKpi,
                            valueFormat: quarterlyData.valueType
                        });
                    }
                };

                // Initial load with default quarter
                updateQuarterlyChart(filterSelect.value);

                // Add change event listener
                filterSelect.addEventListener('change', (e) => {
                    updateQuarterlyChart(e.target.value);
                });
            }

            updatePerformanceCardCopy({
                title: kpiName,
                subtitle: 'IT Team • Operational KPI'
            });
        }

        function updateOpportunityTeamOperationalKpiChart(kpiName, target, actual) {
            // Show canvas and hide any SVG
            const canvas = document.getElementById('teamPerformanceChart');
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            
            // If canvas doesn't exist, recreate it
            let canvasElement = canvas;
            let needsReinit = false;
            if (!canvasElement && chartContainer) {
                chartContainer.innerHTML = '';
                canvasElement = document.createElement('canvas');
                canvasElement.id = 'teamPerformanceChart';
                chartContainer.appendChild(canvasElement);
                needsReinit = true;
            } else if (chartContainer) {
                // Clear any SVG
                const svg = chartContainer.querySelector('svg.line-chart');
                if (svg) {
                    chartContainer.innerHTML = '';
                    if (!canvasElement) {
                        canvasElement = document.createElement('canvas');
                        canvasElement.id = 'teamPerformanceChart';
                        chartContainer.appendChild(canvasElement);
                        needsReinit = true;
                    } else {
                        chartContainer.appendChild(canvasElement);
                    }
                }
            }
            
            if (canvasElement) {
                canvasElement.style.display = 'block';
            }
            
            // Re-initialize chart if canvas was recreated
            if (needsReinit) {
                initTeamPerformanceChart();
            }
            
            // Show bar chart elements (legend and y-axis label)
            if (reportLegend) {
                reportLegend.style.display = 'flex';
            }
            setPerformanceReportCardMode('bar');


            if (!kpiName) {
                resetTeamPerformanceVisuals();
                return;
            }

            // Generate quarterly data if it doesn't exist
            if (!opportunityOperationalKpiQuarterlyData[kpiName]) {
                const isPercentage = /%|percent/i.test(kpiName.toLowerCase());
                const isCount = /#|number|count/i.test(kpiName.toLowerCase());
                
                let targetRange, actualRange, decimals, valueType;
                
                if (target !== null && actual !== null) {
                    if (isPercentage) {
                        targetRange = [Math.max(0, target * 0.85), target * 1.15];
                        actualRange = [Math.max(0, actual * 0.85), actual * 1.15];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [Math.max(0, Math.floor(target * 0.8)), Math.ceil(target * 1.2)];
                        actualRange = [Math.max(0, Math.floor(actual * 0.8)), Math.ceil(actual * 1.2)];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        // For monetary values, use thousands
                        targetRange = [target * 0.9, target * 1.1];
                        actualRange = [actual * 0.9, actual * 1.1];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                } else {
                    // Default ranges if target/actual are not available
                    if (isPercentage) {
                        targetRange = [80, 100];
                        actualRange = [75, 95];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [10, 50];
                        actualRange = [8, 45];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        targetRange = [10000, 50000];
                        actualRange = [9000, 48000];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                }
                
                opportunityOperationalKpiQuarterlyData[kpiName] = generateQuarterlyData({
                    targetRange,
                    actualRange,
                    decimals,
                    valueType
                });
            }

            // Add quarter dropdown to report card header
            const reportCardHeader = reportCard?.querySelector('.report-card-header');
            if (reportCardHeader) {
                // Remove existing quarter filter if any
                const existingFilter = reportCardHeader.querySelector('.quarter-filter-container');
                if (existingFilter) {
                    existingFilter.remove();
                }

                // Create quarter filter dropdown
                const filterContainer = document.createElement('div');
                filterContainer.className = 'quarter-filter-container';
                filterContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-left: auto;';
                
                const filterLabel = document.createElement('label');
                filterLabel.textContent = 'Quarter:';
                filterLabel.style.cssText = 'font-size: 12px; color: #525552; font-weight: 500;';
                
                const filterSelect = document.createElement('select');
                filterSelect.id = 'quarterFilter';
                filterSelect.style.cssText = 'padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; background: white; color: #525552; cursor: pointer;';
                filterSelect.innerHTML = `
                    <option value="Q1">Q1 (Jan-Mar)</option>
                    <option value="Q2">Q2 (Apr-Jun)</option>
                    <option value="Q3">Q3 (Jul-Sep)</option>
                    <option value="Q4">Q4 (Oct-Dec)</option>
                `;
                
                // Set default to current quarter (or Q1)
                const currentMonth = new Date().getMonth();
                const currentQuarter = Math.floor(currentMonth / 3) + 1;
                filterSelect.value = `Q${currentQuarter}`;
                
                filterContainer.appendChild(filterLabel);
                filterContainer.appendChild(filterSelect);
                reportCardHeader.appendChild(filterContainer);

                // Function to update chart based on selected quarter
                const updateQuarterlyChart = (selectedQuarter) => {
                    const quarterlyData = opportunityOperationalKpiQuarterlyData[kpiName][selectedQuarter];
                    if (quarterlyData) {
                        applyTeamPerformanceSeries({
                            labels: quarterlyData.labels,
                            target: quarterlyData.target,
                            actual: quarterlyData.actual,
                            valueType: quarterlyData.valueType
                        });

                        const isPercentageKpi = quarterlyData.valueType === 'percentage';
                        const totalTarget = quarterlyData.target.reduce((sum, val) => sum + val, 0);
                        const totalActual = quarterlyData.actual.reduce((sum, val) => sum + val, 0);
                        
                        updateTeamPerformanceInsight({
                            operationName: kpiName,
                            leaderName: '',
                            targetValue: totalTarget,
                            actualValue: totalActual,
                            isPercentage: isPercentageKpi,
                            valueFormat: quarterlyData.valueType
                        });
                    }
                };

                // Initial load with default quarter
                updateQuarterlyChart(filterSelect.value);

                // Add change event listener
                filterSelect.addEventListener('change', (e) => {
                    updateQuarterlyChart(e.target.value);
                });
            }

            updatePerformanceCardCopy({
                title: kpiName,
                subtitle: 'Opportunity Team • Operational KPI'
            });
        }

        function updateMarcomTeamOperationalKpiChart(kpiName, target, actual) {
            // Show canvas and hide any SVG
            const canvas = document.getElementById('teamPerformanceChart');
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            
            // If canvas doesn't exist, recreate it
            let canvasElement = canvas;
            let needsReinit = false;
            if (!canvasElement && chartContainer) {
                chartContainer.innerHTML = '';
                canvasElement = document.createElement('canvas');
                canvasElement.id = 'teamPerformanceChart';
                chartContainer.appendChild(canvasElement);
                needsReinit = true;
            } else if (chartContainer) {
                // Clear any SVG
                const svg = chartContainer.querySelector('svg.line-chart');
                if (svg) {
                    chartContainer.innerHTML = '';
                    if (!canvasElement) {
                        canvasElement = document.createElement('canvas');
                        canvasElement.id = 'teamPerformanceChart';
                        chartContainer.appendChild(canvasElement);
                        needsReinit = true;
                    } else {
                        chartContainer.appendChild(canvasElement);
                    }
                }
            }
            
            if (canvasElement) {
                canvasElement.style.display = 'block';
            }
            
            // Re-initialize chart if canvas was recreated
            if (needsReinit) {
                initTeamPerformanceChart();
            }
            
            // Show bar chart elements (legend and y-axis label)
            if (reportLegend) {
                reportLegend.style.display = 'flex';
            }
            setPerformanceReportCardMode('bar');


            if (!kpiName) {
                resetTeamPerformanceVisuals();
                return;
            }

            // Generate quarterly data if it doesn't exist
            if (!marcomOperationalKpiQuarterlyData[kpiName]) {
                const isPercentage = /%|percent/i.test(kpiName.toLowerCase());
                const isCount = /#|number|count/i.test(kpiName.toLowerCase());
                
                let targetRange, actualRange, decimals, valueType;
                
                if (target !== null && actual !== null) {
                    if (isPercentage) {
                        targetRange = [Math.max(0, target * 0.85), target * 1.15];
                        actualRange = [Math.max(0, actual * 0.85), actual * 1.15];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [Math.max(0, Math.floor(target * 0.8)), Math.ceil(target * 1.2)];
                        actualRange = [Math.max(0, Math.floor(actual * 0.8)), Math.ceil(actual * 1.2)];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        // For monetary values, use thousands
                        targetRange = [target * 0.9, target * 1.1];
                        actualRange = [actual * 0.9, actual * 1.1];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                } else {
                    // Default ranges if target/actual are not available
                    if (isPercentage) {
                        targetRange = [80, 100];
                        actualRange = [75, 95];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [10, 50];
                        actualRange = [8, 45];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        targetRange = [10000, 50000];
                        actualRange = [9000, 48000];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                }
                
                marcomOperationalKpiQuarterlyData[kpiName] = generateQuarterlyData({
                    targetRange,
                    actualRange,
                    decimals,
                    valueType
                });
            }

            // Add quarter dropdown to report card header
            const reportCardHeader = reportCard?.querySelector('.report-card-header');
            if (reportCardHeader) {
                // Remove existing quarter filter if any
                const existingFilter = reportCardHeader.querySelector('.quarter-filter-container');
                if (existingFilter) {
                    existingFilter.remove();
                }

                // Create quarter filter dropdown
                const filterContainer = document.createElement('div');
                filterContainer.className = 'quarter-filter-container';
                filterContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-left: auto;';
                
                const filterLabel = document.createElement('label');
                filterLabel.textContent = 'Quarter:';
                filterLabel.style.cssText = 'font-size: 12px; color: #525552; font-weight: 500;';
                
                const filterSelect = document.createElement('select');
                filterSelect.id = 'quarterFilter';
                filterSelect.style.cssText = 'padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; background: white; color: #525552; cursor: pointer;';
                filterSelect.innerHTML = `
                    <option value="Q1">Q1 (Jan-Mar)</option>
                    <option value="Q2">Q2 (Apr-Jun)</option>
                    <option value="Q3">Q3 (Jul-Sep)</option>
                    <option value="Q4">Q4 (Oct-Dec)</option>
                `;
                
                // Set default to current quarter (or Q1)
                const currentMonth = new Date().getMonth();
                const currentQuarter = Math.floor(currentMonth / 3) + 1;
                filterSelect.value = `Q${currentQuarter}`;
                
                filterContainer.appendChild(filterLabel);
                filterContainer.appendChild(filterSelect);
                reportCardHeader.appendChild(filterContainer);

                // Function to update chart based on selected quarter
                const updateQuarterlyChart = (selectedQuarter) => {
                    const quarterlyData = marcomOperationalKpiQuarterlyData[kpiName][selectedQuarter];
                    if (quarterlyData) {
                        applyTeamPerformanceSeries({
                            labels: quarterlyData.labels,
                            target: quarterlyData.target,
                            actual: quarterlyData.actual,
                            valueType: quarterlyData.valueType
                        });

                        const isPercentageKpi = quarterlyData.valueType === 'percentage';
                        const totalTarget = quarterlyData.target.reduce((sum, val) => sum + val, 0);
                        const totalActual = quarterlyData.actual.reduce((sum, val) => sum + val, 0);
                        
                        updateTeamPerformanceInsight({
                            operationName: kpiName,
                            leaderName: '',
                            targetValue: totalTarget,
                            actualValue: totalActual,
                            isPercentage: isPercentageKpi,
                            valueFormat: quarterlyData.valueType
                        });
                    }
                };

                // Initial load with default quarter
                updateQuarterlyChart(filterSelect.value);

                // Add change event listener
                filterSelect.addEventListener('change', (e) => {
                    updateQuarterlyChart(e.target.value);
                });
            }

            updatePerformanceCardCopy({
                title: kpiName,
                subtitle: 'Marcom Team • Operational KPI'
            });
        }

        function updateAuditTeamOperationalKpiChart(kpiName, target, actual) {
            // Show canvas and hide any SVG
            const canvas = document.getElementById('teamPerformanceChart');
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            
            // If canvas doesn't exist, recreate it
            let canvasElement = canvas;
            let needsReinit = false;
            if (!canvasElement && chartContainer) {
                chartContainer.innerHTML = '';
                canvasElement = document.createElement('canvas');
                canvasElement.id = 'teamPerformanceChart';
                chartContainer.appendChild(canvasElement);
                needsReinit = true;
            } else if (chartContainer) {
                // Clear any SVG
                const svg = chartContainer.querySelector('svg.line-chart');
                if (svg) {
                    chartContainer.innerHTML = '';
                    if (!canvasElement) {
                        canvasElement = document.createElement('canvas');
                        canvasElement.id = 'teamPerformanceChart';
                        chartContainer.appendChild(canvasElement);
                        needsReinit = true;
                    } else {
                        chartContainer.appendChild(canvasElement);
                    }
                }
            }
            
            if (canvasElement) {
                canvasElement.style.display = 'block';
            }
            
            // Re-initialize chart if canvas was recreated
            if (needsReinit) {
                initTeamPerformanceChart();
            }
            
            // Show bar chart elements (legend and y-axis label)
            if (reportLegend) {
                reportLegend.style.display = 'flex';
            }
            setPerformanceReportCardMode('bar');


            if (!kpiName) {
                resetTeamPerformanceVisuals();
                return;
            }

            // Generate quarterly data if it doesn't exist
            if (!auditOperationalKpiQuarterlyData[kpiName]) {
                const isPercentage = /%|percent/i.test(kpiName.toLowerCase());
                const isCount = /#|number|count/i.test(kpiName.toLowerCase());
                
                let targetRange, actualRange, decimals, valueType;
                
                if (target !== null && actual !== null) {
                    if (isPercentage) {
                        targetRange = [Math.max(0, target * 0.85), target * 1.15];
                        actualRange = [Math.max(0, actual * 0.85), actual * 1.15];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [Math.max(0, Math.floor(target * 0.8)), Math.ceil(target * 1.2)];
                        actualRange = [Math.max(0, Math.floor(actual * 0.8)), Math.ceil(actual * 1.2)];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        // For monetary values, use thousands
                        targetRange = [target * 0.9, target * 1.1];
                        actualRange = [actual * 0.9, actual * 1.1];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                } else {
                    // Default ranges if target/actual are not available
                    if (isPercentage) {
                        targetRange = [80, 100];
                        actualRange = [75, 95];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [10, 50];
                        actualRange = [8, 45];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        targetRange = [10000, 50000];
                        actualRange = [9000, 48000];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                }
                
                auditOperationalKpiQuarterlyData[kpiName] = generateQuarterlyData({
                    targetRange,
                    actualRange,
                    decimals,
                    valueType
                });
            }

            // Add quarter dropdown to report card header
            const reportCardHeader = reportCard?.querySelector('.report-card-header');
            if (reportCardHeader) {
                // Remove existing quarter filter if any
                const existingFilter = reportCardHeader.querySelector('.quarter-filter-container');
                if (existingFilter) {
                    existingFilter.remove();
                }

                // Create quarter filter dropdown
                const filterContainer = document.createElement('div');
                filterContainer.className = 'quarter-filter-container';
                filterContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-left: auto;';
                
                const filterLabel = document.createElement('label');
                filterLabel.textContent = 'Quarter:';
                filterLabel.style.cssText = 'font-size: 12px; color: #525552; font-weight: 500;';
                
                const filterSelect = document.createElement('select');
                filterSelect.id = 'quarterFilter';
                filterSelect.style.cssText = 'padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; background: white; color: #525552; cursor: pointer;';
                filterSelect.innerHTML = `
                    <option value="Q1">Q1 (Jan-Mar)</option>
                    <option value="Q2">Q2 (Apr-Jun)</option>
                    <option value="Q3">Q3 (Jul-Sep)</option>
                    <option value="Q4">Q4 (Oct-Dec)</option>
                `;
                
                // Set default to current quarter (or Q1)
                const currentMonth = new Date().getMonth();
                const currentQuarter = Math.floor(currentMonth / 3) + 1;
                filterSelect.value = `Q${currentQuarter}`;
                
                filterContainer.appendChild(filterLabel);
                filterContainer.appendChild(filterSelect);
                reportCardHeader.appendChild(filterContainer);

                // Function to update chart based on selected quarter
                const updateQuarterlyChart = (selectedQuarter) => {
                    const quarterlyData = auditOperationalKpiQuarterlyData[kpiName][selectedQuarter];
                    if (quarterlyData) {
                        applyTeamPerformanceSeries({
                            labels: quarterlyData.labels,
                            target: quarterlyData.target,
                            actual: quarterlyData.actual,
                            valueType: quarterlyData.valueType
                        });

                        const isPercentageKpi = quarterlyData.valueType === 'percentage';
                        const totalTarget = quarterlyData.target.reduce((sum, val) => sum + val, 0);
                        const totalActual = quarterlyData.actual.reduce((sum, val) => sum + val, 0);
                        
                        updateTeamPerformanceInsight({
                            operationName: kpiName,
                            leaderName: '',
                            targetValue: totalTarget,
                            actualValue: totalActual,
                            isPercentage: isPercentageKpi,
                            valueFormat: quarterlyData.valueType
                        });
                    }
                };

                // Initial load with default quarter
                updateQuarterlyChart(filterSelect.value);

                // Add change event listener
                filterSelect.addEventListener('change', (e) => {
                    updateQuarterlyChart(e.target.value);
                });
            }

            updatePerformanceCardCopy({
                title: kpiName,
                subtitle: 'Audit Team • Operational KPI'
            });
        }

        function updateGatheringTeamOperationalKpiChart(kpiName, target, actual) {
            // Show canvas and hide any SVG
            const canvas = document.getElementById('teamPerformanceChart');
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            
            // If canvas doesn't exist, recreate it
            let canvasElement = canvas;
            let needsReinit = false;
            if (!canvasElement && chartContainer) {
                chartContainer.innerHTML = '';
                canvasElement = document.createElement('canvas');
                canvasElement.id = 'teamPerformanceChart';
                chartContainer.appendChild(canvasElement);
                needsReinit = true;
            } else if (chartContainer) {
                // Clear any SVG
                const svg = chartContainer.querySelector('svg.line-chart');
                if (svg) {
                    chartContainer.innerHTML = '';
                    if (!canvasElement) {
                        canvasElement = document.createElement('canvas');
                        canvasElement.id = 'teamPerformanceChart';
                        chartContainer.appendChild(canvasElement);
                        needsReinit = true;
                    } else {
                        chartContainer.appendChild(canvasElement);
                    }
                }
            }
            
            if (canvasElement) {
                canvasElement.style.display = 'block';
            }
            
            // Re-initialize chart if canvas was recreated
            if (needsReinit) {
                initTeamPerformanceChart();
            }
            
            // Show bar chart elements (legend and y-axis label)
            if (reportLegend) {
                reportLegend.style.display = 'flex';
            }
            setPerformanceReportCardMode('bar');


            if (!kpiName) {
                resetTeamPerformanceVisuals();
                return;
            }

            // Generate quarterly data if it doesn't exist
            if (!gatheringOperationalKpiQuarterlyData[kpiName]) {
                const isPercentage = /%|percent/i.test(kpiName.toLowerCase());
                const isCount = /#|number|count/i.test(kpiName.toLowerCase());
                
                let targetRange, actualRange, decimals, valueType;
                
                if (target !== null && actual !== null) {
                    if (isPercentage) {
                        targetRange = [Math.max(0, target * 0.85), target * 1.15];
                        actualRange = [Math.max(0, actual * 0.85), actual * 1.15];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [Math.max(0, Math.floor(target * 0.8)), Math.ceil(target * 1.2)];
                        actualRange = [Math.max(0, Math.floor(actual * 0.8)), Math.ceil(actual * 1.2)];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        // For monetary values, use thousands
                        targetRange = [target * 0.9, target * 1.1];
                        actualRange = [actual * 0.9, actual * 1.1];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                } else {
                    // Default ranges if target/actual are not available
                    if (isPercentage) {
                        targetRange = [80, 100];
                        actualRange = [75, 95];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [10, 50];
                        actualRange = [8, 45];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        targetRange = [10000, 50000];
                        actualRange = [9000, 48000];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                }
                
                gatheringOperationalKpiQuarterlyData[kpiName] = generateQuarterlyData({
                    targetRange,
                    actualRange,
                    decimals,
                    valueType
                });
            }

            // Add quarter dropdown to report card header
            const reportCardHeader = reportCard?.querySelector('.report-card-header');
            if (reportCardHeader) {
                // Remove existing quarter filter if any
                const existingFilter = reportCardHeader.querySelector('.quarter-filter-container');
                if (existingFilter) {
                    existingFilter.remove();
                }

                // Create quarter filter dropdown
                const filterContainer = document.createElement('div');
                filterContainer.className = 'quarter-filter-container';
                filterContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-left: auto;';
                
                const filterLabel = document.createElement('label');
                filterLabel.textContent = 'Quarter:';
                filterLabel.style.cssText = 'font-size: 12px; color: #525552; font-weight: 500;';
                
                const filterSelect = document.createElement('select');
                filterSelect.id = 'quarterFilter';
                filterSelect.style.cssText = 'padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; background: white; color: #525552; cursor: pointer;';
                filterSelect.innerHTML = `
                    <option value="Q1">Q1 (Jan-Mar)</option>
                    <option value="Q2">Q2 (Apr-Jun)</option>
                    <option value="Q3">Q3 (Jul-Sep)</option>
                    <option value="Q4">Q4 (Oct-Dec)</option>
                `;
                
                // Set default to current quarter (or Q1)
                const currentMonth = new Date().getMonth();
                const currentQuarter = Math.floor(currentMonth / 3) + 1;
                filterSelect.value = `Q${currentQuarter}`;
                
                filterContainer.appendChild(filterLabel);
                filterContainer.appendChild(filterSelect);
                reportCardHeader.appendChild(filterContainer);

                // Function to update chart based on selected quarter
                const updateQuarterlyChart = (selectedQuarter) => {
                    const quarterlyData = gatheringOperationalKpiQuarterlyData[kpiName][selectedQuarter];
                    if (quarterlyData) {
                        applyTeamPerformanceSeries({
                            labels: quarterlyData.labels,
                            target: quarterlyData.target,
                            actual: quarterlyData.actual,
                            valueType: quarterlyData.valueType
                        });

                        const isPercentageKpi = quarterlyData.valueType === 'percentage';
                        const totalTarget = quarterlyData.target.reduce((sum, val) => sum + val, 0);
                        const totalActual = quarterlyData.actual.reduce((sum, val) => sum + val, 0);
                        
                        updateTeamPerformanceInsight({
                            operationName: kpiName,
                            leaderName: '',
                            targetValue: totalTarget,
                            actualValue: totalActual,
                            isPercentage: isPercentageKpi,
                            valueFormat: quarterlyData.valueType
                        });
                    }
                };

                // Initial load with default quarter
                updateQuarterlyChart(filterSelect.value);

                // Add change event listener
                filterSelect.addEventListener('change', (e) => {
                    updateQuarterlyChart(e.target.value);
                });
            }

            updatePerformanceCardCopy({
                title: kpiName,
                subtitle: 'Gathering Team • Operational KPI'
            });
        }

        function updateOperationsTeamOperationalKpiChart(kpiName, target, actual) {
            // Show canvas and hide any SVG
            const canvas = document.getElementById('teamPerformanceChart');
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            
            // If canvas doesn't exist, recreate it
            let canvasElement = canvas;
            let needsReinit = false;
            if (!canvasElement && chartContainer) {
                chartContainer.innerHTML = '';
                canvasElement = document.createElement('canvas');
                canvasElement.id = 'teamPerformanceChart';
                chartContainer.appendChild(canvasElement);
                needsReinit = true;
            } else if (chartContainer) {
                // Clear any SVG
                const svg = chartContainer.querySelector('svg.line-chart');
                if (svg) {
                    chartContainer.innerHTML = '';
                    if (!canvasElement) {
                        canvasElement = document.createElement('canvas');
                        canvasElement.id = 'teamPerformanceChart';
                        chartContainer.appendChild(canvasElement);
                        needsReinit = true;
                    } else {
                        chartContainer.appendChild(canvasElement);
                    }
                }
            }
            
            if (canvasElement) {
                canvasElement.style.display = 'block';
            }
            
            // Re-initialize chart if canvas was recreated
            if (needsReinit) {
                initTeamPerformanceChart();
            }
            
            // Show bar chart elements (legend and y-axis label)
            if (reportLegend) {
                reportLegend.style.display = 'flex';
            }
            setPerformanceReportCardMode('bar');


            if (!kpiName) {
                resetTeamPerformanceVisuals();
                return;
            }

            // Generate quarterly data if it doesn't exist
            if (!operationsOperationalKpiQuarterlyData[kpiName]) {
                const isPercentage = /%|percent/i.test(kpiName.toLowerCase());
                const isCount = /#|number|count/i.test(kpiName.toLowerCase());
                
                let targetRange, actualRange, decimals, valueType;
                
                if (target !== null && actual !== null) {
                    if (isPercentage) {
                        targetRange = [Math.max(0, target * 0.85), target * 1.15];
                        actualRange = [Math.max(0, actual * 0.85), actual * 1.15];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [Math.max(0, Math.floor(target * 0.8)), Math.ceil(target * 1.2)];
                        actualRange = [Math.max(0, Math.floor(actual * 0.8)), Math.ceil(actual * 1.2)];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        // For monetary values, use thousands
                        targetRange = [target * 0.9, target * 1.1];
                        actualRange = [actual * 0.9, actual * 1.1];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                } else {
                    // Default ranges if target/actual are not available
                    if (isPercentage) {
                        targetRange = [80, 100];
                        actualRange = [75, 95];
                        decimals = 1;
                        valueType = 'percentage';
                    } else if (isCount) {
                        targetRange = [10, 50];
                        actualRange = [8, 45];
                        decimals = 0;
                        valueType = 'count';
                    } else {
                        targetRange = [10000, 50000];
                        actualRange = [9000, 48000];
                        decimals = 0;
                        valueType = 'thousands';
                    }
                }
                
                operationsOperationalKpiQuarterlyData[kpiName] = generateQuarterlyData({
                    targetRange,
                    actualRange,
                    decimals,
                    valueType
                });
            }

            // Add quarter dropdown to report card header
            const reportCardHeader = reportCard?.querySelector('.report-card-header');
            if (reportCardHeader) {
                // Remove existing quarter filter if any
                const existingFilter = reportCardHeader.querySelector('.quarter-filter-container');
                if (existingFilter) {
                    existingFilter.remove();
                }

                // Create quarter filter dropdown
                const filterContainer = document.createElement('div');
                filterContainer.className = 'quarter-filter-container';
                filterContainer.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-left: auto;';
                
                const filterLabel = document.createElement('label');
                filterLabel.textContent = 'Quarter:';
                filterLabel.style.cssText = 'font-size: 12px; color: #525552; font-weight: 500;';
                
                const filterSelect = document.createElement('select');
                filterSelect.id = 'quarterFilter';
                filterSelect.style.cssText = 'padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; background: white; color: #525552; cursor: pointer;';
                filterSelect.innerHTML = `
                    <option value="Q1">Q1 (Jan-Mar)</option>
                    <option value="Q2">Q2 (Apr-Jun)</option>
                    <option value="Q3">Q3 (Jul-Sep)</option>
                    <option value="Q4">Q4 (Oct-Dec)</option>
                `;
                
                // Set default to current quarter (or Q1)
                const currentMonth = new Date().getMonth();
                const currentQuarter = Math.floor(currentMonth / 3) + 1;
                filterSelect.value = `Q${currentQuarter}`;
                
                filterContainer.appendChild(filterLabel);
                filterContainer.appendChild(filterSelect);
                reportCardHeader.appendChild(filterContainer);

                // Function to update chart based on selected quarter
                const updateQuarterlyChart = (selectedQuarter) => {
                    const quarterlyData = operationsOperationalKpiQuarterlyData[kpiName][selectedQuarter];
                    if (quarterlyData) {
                        applyTeamPerformanceSeries({
                            labels: quarterlyData.labels,
                            target: quarterlyData.target,
                            actual: quarterlyData.actual,
                            valueType: quarterlyData.valueType
                        });

                        const isPercentageKpi = quarterlyData.valueType === 'percentage';
                        const totalTarget = quarterlyData.target.reduce((sum, val) => sum + val, 0);
                        const totalActual = quarterlyData.actual.reduce((sum, val) => sum + val, 0);
                        
                        updateTeamPerformanceInsight({
                            operationName: kpiName,
                            leaderName: '',
                            targetValue: totalTarget,
                            actualValue: totalActual,
                            isPercentage: isPercentageKpi,
                            valueFormat: quarterlyData.valueType
                        });
                    }
                };

                // Initial load with default quarter
                updateQuarterlyChart(filterSelect.value);

                // Add change event listener
                filterSelect.addEventListener('change', (e) => {
                    updateQuarterlyChart(e.target.value);
                });
            }

            updatePerformanceCardCopy({
                title: kpiName,
                subtitle: 'Operations Team • Operational KPI'
            });
        }

        function attachMemberRowClickHandlers() {
            const memberRows = document.querySelectorAll('.member-row:not(.has-dropdown)');
            
            memberRows.forEach(row => {
                row.addEventListener('click', function(e) {
                    // Don't trigger if clicking on a link or button
                    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                        return;
                    }

                    // Remove active class from all rows
                    document.querySelectorAll('.member-row').forEach(r => r.classList.remove('row-active'));
                    // Add active class to clicked row
                    this.classList.add('row-active');

                    const operationName = this.getAttribute('data-operation');
                    const targetStr = this.getAttribute('data-target');
                    const actualStr = this.getAttribute('data-actual');
                    const owner = this.getAttribute('data-owner');
                    
                    const target = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                    const actual = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                    
                    // Check if this is a Technical Team, Accounting Team, LRAD Team, Quality Team, DC Team, Opportunity Team, IT Team, Marcom Team, or Operations Team KRA row
                    const isTechnicalTeamKra = this.classList.contains('technical-team-kra-row');
                    const isAccountingTeamKra = this.classList.contains('accounting-team-kra-row');
                    const isLradTeamKra = this.classList.contains('lrad-team-kra-row');
                    const isQualityTeamKra = this.classList.contains('quality-team-kra-row');
                    const isDcTeamKra = this.classList.contains('dc-team-kra-row');
                    const isOpportunityTeamKra = this.classList.contains('opportunity-team-kra-row');
                    const isItTeamKra = this.classList.contains('it-team-kra-row');
                    const isMarcomTeamKra = this.classList.contains('marcom-team-kra-row');
                    const isOperationsTeamKra = this.classList.contains('operations-team-kra-row');
                    
                    if (isTechnicalTeamKra && owner) {
                        updateTechnicalTeamKraCharts(operationName, target, actual, owner);
                    } else if (isAccountingTeamKra && owner) {
                        updateAccountingTeamKraCharts(operationName, target, actual, owner);
                    } else if (isLradTeamKra && owner) {
                        updateLradTeamKraCharts(operationName, target, actual, owner);
                    } else if (isQualityTeamKra && owner) {
                        updateQualityTeamKraCharts(operationName, target, actual, owner);
                    } else if (isDcTeamKra && owner) {
                        updateDcTeamKraCharts(operationName, target, actual, owner);
                    } else if (isOpportunityTeamKra && owner) {
                        updateOpportunityTeamKraCharts(operationName, target, actual, owner);
                    } else if (isItTeamKra && owner) {
                        updateItTeamKraCharts(operationName, target, actual, owner);
                    } else if (isMarcomTeamKra && owner) {
                        updateMarcomTeamKraCharts(operationName, target, actual, owner);
                    } else if (isOperationsTeamKra && owner) {
                        updateOperationsTeamKraCharts(operationName, target, actual, owner);
                    } else if (this.classList.contains('audit-team-kra-row') && owner) {
                        updateAuditTeamKraCharts(operationName, target, actual, owner);
                    } else if (this.classList.contains('gathering-team-kra-row') && owner) {
                        updateGatheringTeamKraCharts(operationName, target, actual, owner);
                    } else {
                        // Check if this is a team member row (has member-view-row class)
                        const isTeamMember = this.classList.contains('member-view-row');
                        
                        if (isTeamMember) {
                            // Use dynamic chart for team members with monthly/quarterly view
                            if (target !== null && actual !== null) {
                                // Get monthly data from data attributes
                                const monthlyTargetStr = this.getAttribute('data-monthly-target');
                                const monthlyActualStr = this.getAttribute('data-monthly-actual');
                                
                                let monthlyTarget = null;
                                let monthlyActual = null;
                                
                                try {
                                    if (monthlyTargetStr) {
                                        monthlyTarget = JSON.parse(monthlyTargetStr);
                                    }
                                    if (monthlyActualStr) {
                                        monthlyActual = JSON.parse(monthlyActualStr);
                                    }
                                } catch (e) {
                                    console.warn('Error parsing monthly data:', e);
                                }
                                
                                updateMemberPerformanceChart(operationName, target, actual, monthlyTarget, monthlyActual);
                            } else {
                                updateMemberPerformanceChart(operationName, null, null);
                            }
                        } else {
                            // Use bar chart for team leader KPIs (Lag/Lead KPIs from operations section)
                            if (target !== null && actual !== null) {
                                updateTeamPerformanceBarChart(operationName, target, actual);
                            } else {
                                updateTeamPerformanceBarChart(operationName, null, null);
                            }
                        }
                    }
                });
            });
        }

        function attachDateSelectorFunctionality(section) {
            const isLead = section === 'lead';
            const monthSelectId = isLead ? 'periodMonthSelectLead' : 'periodMonthSelect';
            const yearSelectId = isLead ? 'periodYearSelectLead' : 'periodYearSelect';
            const targetDisplayId = isLead ? 'targetPeriodDisplayLead' : 'targetPeriodDisplay';
            const actualDisplayId = isLead ? 'actualPeriodDisplayLead' : 'actualPeriodDisplay';
            
            const periodMonthSelect = document.getElementById(monthSelectId);
            const periodYearSelect = document.getElementById(yearSelectId);
            const targetPeriodDisplay = document.getElementById(targetDisplayId);
            const actualPeriodDisplay = document.getElementById(actualDisplayId);
            
            const updatePeriodDisplay = () => {
                const monthName = monthNames[selectedMonth];
                const periodText = `${monthName} ${selectedYear}`;
                if (targetPeriodDisplay) targetPeriodDisplay.textContent = periodText;
                if (actualPeriodDisplay) actualPeriodDisplay.textContent = periodText;
                
                // Refresh the appropriate section to show updated data for the new period
                if (selectedTeam && selectedTeamData) {
                    if (isLead) {
                        updateLeadKpiSection(selectedTeam, selectedTeamData.title);
                    } else {
                        refreshOperationsContent();
                    }
                }
            };
            
            if (periodMonthSelect) {
                periodMonthSelect.addEventListener('change', function() {
                    selectedMonth = parseInt(this.value);
                    updatePeriodDisplay();
                });
            }
            
            if (periodYearSelect) {
                periodYearSelect.addEventListener('change', function() {
                    selectedYear = parseInt(this.value);
                    updatePeriodDisplay();
                });
            }
        }

        function attachSearchFunctionalityLead() {
            const searchInput = document.getElementById('searchInputLead');
            if (!searchInput) return;
            
            // Remove any existing event listeners by cloning the element
            const newSearchInput = searchInput.cloneNode(true);
            searchInput.parentNode.replaceChild(newSearchInput, searchInput);
            
            newSearchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();
                const profileContent = document.getElementById('profileContent');
                if (!profileContent) return;
                
                const memberRows = profileContent.querySelectorAll('.member-row');

                memberRows.forEach(row => {
                    const name = row.getAttribute('data-name') || '';
                    const team = row.getAttribute('data-team') || '';
                    const operation = row.getAttribute('data-operation') || '';
                    const memberName = row.querySelector('.member-name')?.textContent || '';
                    
                    const nameMatch = name.toLowerCase().includes(searchTerm);
                    const teamMatch = team.toLowerCase().includes(searchTerm);
                    const operationMatch = operation.toLowerCase().includes(searchTerm);
                    const memberNameMatch = memberName.toLowerCase().includes(searchTerm);
                    
                    if (nameMatch || teamMatch || operationMatch || memberNameMatch || searchTerm === '') {
                        row.classList.remove('hidden');
                    } else {
                        row.classList.add('hidden');
                    }
                });
            });
        }

        function attachMemberRowClickHandlersLead() {
            const memberRows = document.querySelectorAll('#leadKpiList .member-row');
            
            memberRows.forEach(row => {
                row.addEventListener('click', function(e) {
                    // Don't trigger if clicking on a link or button
                    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                        return;
                    }

                    // Remove active class from all rows
                    document.querySelectorAll('.member-row').forEach(r => r.classList.remove('row-active'));
                    // Add active class to clicked row
                    this.classList.add('row-active');

                    const operationName = this.getAttribute('data-operation');
                    const targetStr = this.getAttribute('data-target');
                    const actualStr = this.getAttribute('data-actual');
                    
                    const target = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                    const actual = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                    
                    if (target !== null && actual !== null) {
                        updateTeamPerformanceBarChart(operationName, target, actual);
                    } else {
                        // Show empty state
                        updateTeamPerformanceBarChart(operationName, null, null);
                    }
                });
            });
        }


        // Update the dropdown functionality to trigger graph update
        function attachDropdownFunctionality(teamName) {
            const memberRows = document.querySelectorAll('.member-row.has-dropdown');
            
            memberRows.forEach(row => {
                row.addEventListener('click', function(e) {
                    // Don't trigger if clicking on a link or button
                    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                        return;
                    }

                    const index = this.getAttribute('data-index');
                    const dropdown = document.getElementById(`dropdown-${index}`);
                    const operationRole = this.querySelector('.member-name').textContent;
                    
                    // Check if this is a Technical Team, Accounting Team, LRAD Team, Quality Team, DC Team, Opportunity Team, IT Team, Marcom Team, Operations Team, Audit Team, or Gathering Team KRA row
                    const isTechnicalTeamKra = this.classList.contains('technical-team-kra-row');
                    const isAccountingTeamKra = this.classList.contains('accounting-team-kra-row');
                    const isLradTeamKra = this.classList.contains('lrad-team-kra-row');
                    const isQualityTeamKra = this.classList.contains('quality-team-kra-row');
                    const isDcTeamKra = this.classList.contains('dc-team-kra-row');
                    const isOpportunityTeamKra = this.classList.contains('opportunity-team-kra-row');
                    const isItTeamKra = this.classList.contains('it-team-kra-row');
                    const isMarcomTeamKra = this.classList.contains('marcom-team-kra-row');
                    const isOperationsTeamKra = this.classList.contains('operations-team-kra-row');
                    const isAuditTeamKra = this.classList.contains('audit-team-kra-row');
                    const isGatheringTeamKra = this.classList.contains('gathering-team-kra-row');
                    const owner = this.getAttribute('data-owner');
                    const operationName = this.getAttribute('data-operation');
                    const targetStr = this.getAttribute('data-target');
                    const actualStr = this.getAttribute('data-actual');
                    const target = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                    const actual = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                    
                    if (isTechnicalTeamKra && teamName === 'Technical Team' && owner) {
                        // Remove active class from all rows
                        document.querySelectorAll('.member-row').forEach(r => r.classList.remove('row-active'));
                        // Add active class to clicked row
                        this.classList.add('row-active');
                        updateTechnicalTeamKraCharts(operationName, target, actual, owner);
                    }
                    
                    if (isAccountingTeamKra && teamName === 'Accounting Team' && owner) {
                        // Remove active class from all rows
                        document.querySelectorAll('.member-row').forEach(r => r.classList.remove('row-active'));
                        // Add active class to clicked row
                        this.classList.add('row-active');
                        updateAccountingTeamKraCharts(operationName, target, actual, owner);
                    }
                    
                    if (isLradTeamKra && teamName === 'LRAD Team' && owner) {
                        // Remove active class from all rows
                        document.querySelectorAll('.member-row').forEach(r => r.classList.remove('row-active'));
                        // Add active class to clicked row
                        this.classList.add('row-active');
                        updateLradTeamKraCharts(operationName, target, actual, owner);
                    }
                    
                    if (isQualityTeamKra && teamName === 'Quality Team' && owner) {
                        // Remove active class from all rows
                        document.querySelectorAll('.member-row').forEach(r => r.classList.remove('row-active'));
                        // Add active class to clicked row
                        this.classList.add('row-active');
                        updateQualityTeamKraCharts(operationName, target, actual, owner);
                    }
                    
                    if (isDcTeamKra && teamName === 'DC Team' && owner) {
                        // Remove active class from all rows
                        document.querySelectorAll('.member-row').forEach(r => r.classList.remove('row-active'));
                        // Add active class to clicked row
                        this.classList.add('row-active');
                        updateDcTeamKraCharts(operationName, target, actual, owner);
                    }
                    
                    if (isOpportunityTeamKra && teamName === 'Opportunity Team' && owner) {
                        // Remove active class from all rows
                        document.querySelectorAll('.member-row').forEach(r => r.classList.remove('row-active'));
                        // Add active class to clicked row
                        this.classList.add('row-active');
                        updateOpportunityTeamKraCharts(operationName, target, actual, owner);
                    }
                    
                    if (isItTeamKra && teamName === 'IT Team' && owner) {
                        // Remove active class from all rows
                        document.querySelectorAll('.member-row').forEach(r => r.classList.remove('row-active'));
                        // Add active class to clicked row
                        this.classList.add('row-active');
                        updateItTeamKraCharts(operationName, target, actual, owner);
                    }
                    
                    if (isMarcomTeamKra && teamName === 'Marcom Team' && owner) {
                        // Remove active class from all rows
                        document.querySelectorAll('.member-row').forEach(r => r.classList.remove('row-active'));
                        // Add active class to clicked row
                        this.classList.add('row-active');
                        updateMarcomTeamKraCharts(operationName, target, actual, owner);
                    }
                    
                    if (isOperationsTeamKra && teamName === 'Operations Team' && owner) {
                        // Remove active class from all rows
                        document.querySelectorAll('.member-row').forEach(r => r.classList.remove('row-active'));
                        // Add active class to clicked row
                        this.classList.add('row-active');
                        updateOperationsTeamKraCharts(operationName, target, actual, owner);
                    }
                    
                    if (dropdown) {
                        const isExpanded = this.classList.contains('expanded');
                        
                        // Close all other dropdowns
                        document.querySelectorAll('.member-row.has-dropdown').forEach(r => {
                            r.classList.remove('expanded');
                        });
                        document.querySelectorAll('.sub-operations').forEach(d => {
                            d.classList.remove('show');
                        });
                        
                        // Toggle current
                        if (!isExpanded) {
                            this.classList.add('expanded');
                            dropdown.classList.add('show');
                            
                            if (teamName === 'Technical Team' || teamName === 'Accounting Team' || teamName === 'LRAD Team' || teamName === 'Quality Team' || teamName === 'DC Team' || teamName === 'Opportunity Team' || teamName === 'IT Team' || teamName === 'Marcom Team' || teamName === 'Operations Team' || teamName === 'Audit Team' || teamName === 'Gathering Team') {
                                let kpiWeightsJson = this.getAttribute('data-kpi-weights');
                                if (kpiWeightsJson) {
                                    try {
                                        // Unescape HTML entities before parsing
                                        kpiWeightsJson = kpiWeightsJson.replace(/&apos;/g, "'").replace(/&quot;/g, '"');
                                        const kpiWeights = JSON.parse(kpiWeightsJson);
                                        const kraName = this.getAttribute('data-operation');
                                        const owner = this.getAttribute('data-owner');
                                        // Debug: log the weights to verify they're correct
                                        console.log('KPI Weights from data attribute:', kpiWeights);
                                    } catch (e) {
                                        console.error('Error parsing KPI weights:', e, 'Raw JSON:', kpiWeightsJson);
                                    }
                                } else {
                                    console.warn('No KPI weights data found for row');
                                }
                            }
                            
                            // Add click handlers to sub-operation items
                            const subItems = dropdown.querySelectorAll('.sub-operation-item');
                            subItems.forEach(item => {
                                item.style.cursor = 'pointer';
                                item.addEventListener('click', function(e) {
                                    e.stopPropagation();
                                    
                                    // Remove active class from all items
                                    subItems.forEach(i => i.style.background = '');
                                    
                                    // Highlight selected item
                                    this.style.background = 'rgba(229, 187, 34, 0.15)';
                                    
                                    const kpiName = this.querySelector('.sub-operation-label').textContent.replace('→', '').trim();
                                    
                                    // Handle Technical Team, Accounting Team, LRAD Team, Quality Team, DC Team, Opportunity Team, IT Team, Marcom Team, and Operations Team differently
                                    if (teamName === 'Technical Team') {
                                        // Get target and actual from data attributes
                                        const targetStr = this.getAttribute('data-target');
                                        const actualStr = this.getAttribute('data-actual');
                                        
                                        const targetValue = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                                        const actualValue = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                                        
                                        // For Technical Team Operational KPIs, always show quarterly data
                                        updateTechnicalTeamOperationalKpiChart(kpiName, targetValue, actualValue);
                                    } else if (teamName === 'Accounting Team') {
                                        // Get target and actual from data attributes
                                        const targetStr = this.getAttribute('data-target');
                                        const actualStr = this.getAttribute('data-actual');
                                        
                                        const targetValue = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                                        const actualValue = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                                        
                                        // For Accounting Team Operational KPIs, always show quarterly data
                                        updateAccountingTeamOperationalKpiChart(kpiName, targetValue, actualValue);
                                    } else if (teamName === 'LRAD Team') {
                                        // Get target and actual from data attributes
                                        const targetStr = this.getAttribute('data-target');
                                        const actualStr = this.getAttribute('data-actual');
                                        
                                        const targetValue = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                                        const actualValue = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                                        
                                        // For LRAD Team Operational KPIs, always show quarterly data
                                        updateLradTeamOperationalKpiChart(kpiName, targetValue, actualValue);
                                    } else if (teamName === 'Quality Team') {
                                        // Get target and actual from data attributes
                                        const targetStr = this.getAttribute('data-target');
                                        const actualStr = this.getAttribute('data-actual');
                                        
                                        const targetValue = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                                        const actualValue = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                                        
                                        // For Quality Team Operational KPIs, always show quarterly data
                                        updateQualityTeamOperationalKpiChart(kpiName, targetValue, actualValue);
                                    } else if (teamName === 'DC Team') {
                                        // Get target and actual from data attributes
                                        const targetStr = this.getAttribute('data-target');
                                        const actualStr = this.getAttribute('data-actual');
                                        
                                        const targetValue = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                                        const actualValue = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                                        
                                        // For DC Team Operational KPIs, always show quarterly data
                                        updateDcTeamOperationalKpiChart(kpiName, targetValue, actualValue);
                                    } else if (teamName === 'IT Team') {
                                        // Get target and actual from data attributes
                                        const targetStr = this.getAttribute('data-target');
                                        const actualStr = this.getAttribute('data-actual');
                                        
                                        const targetValue = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                                        const actualValue = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                                        
                                        // For IT Team Operational KPIs, always show quarterly data
                                        updateItTeamOperationalKpiChart(kpiName, targetValue, actualValue);
                                    } else if (teamName === 'Opportunity Team') {
                                        // Get target and actual from data attributes
                                        const targetStr = this.getAttribute('data-target');
                                        const actualStr = this.getAttribute('data-actual');
                                        
                                        const targetValue = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                                        const actualValue = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                                        
                                        // For Opportunity Team Operational KPIs, always show quarterly data
                                        updateOpportunityTeamOperationalKpiChart(kpiName, targetValue, actualValue);
                                    } else if (teamName === 'Marcom Team') {
                                        // Get target and actual from data attributes
                                        const targetStr = this.getAttribute('data-target');
                                        const actualStr = this.getAttribute('data-actual');
                                        
                                        const targetValue = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                                        const actualValue = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                                        
                                        // For Marcom Team Operational KPIs, always show quarterly data
                                        updateMarcomTeamOperationalKpiChart(kpiName, targetValue, actualValue);
                                    } else if (teamName === 'Audit Team') {
                                        // Get target and actual from data attributes
                                        const targetStr = this.getAttribute('data-target');
                                        const actualStr = this.getAttribute('data-actual');
                                        
                                        const targetValue = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                                        const actualValue = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                                        
                                        // For Audit Team Operational KPIs, always show quarterly data
                                        updateAuditTeamOperationalKpiChart(kpiName, targetValue, actualValue);
                                    } else if (teamName === 'Gathering Team') {
                                        // Get target and actual from data attributes
                                        const targetStr = this.getAttribute('data-target');
                                        const actualStr = this.getAttribute('data-actual');
                                        
                                        const targetValue = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                                        const actualValue = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                                        
                                        // For Gathering Team Operational KPIs, always show quarterly data
                                        updateGatheringTeamOperationalKpiChart(kpiName, targetValue, actualValue);
                                    } else if (teamName === 'Operations Team') {
                                        // Get target and actual from data attributes
                                        const targetStr = this.getAttribute('data-target');
                                        const actualStr = this.getAttribute('data-actual');
                                        
                                        const targetValue = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                                        const actualValue = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                                        
                                        // For Operations Team Operational KPIs, always show quarterly data
                                        updateOperationsTeamOperationalKpiChart(kpiName, targetValue, actualValue);
                                    } else {
                                        // Original logic for other teams
                                        updatePerformanceGraph(teamName, operationRole, kpiName);
                                    }
                                });
                            });
                        } else {
                            if (isTechnicalTeamKra && teamName === 'Technical Team' && owner) {
                                updateTechnicalTeamKraCharts(operationName, target, actual, owner);
                            } else if (isAccountingTeamKra && teamName === 'Accounting Team' && owner) {
                                updateAccountingTeamKraCharts(operationName, target, actual, owner);
                            } else if (isLradTeamKra && teamName === 'LRAD Team' && owner) {
                                updateLradTeamKraCharts(operationName, target, actual, owner);
                            } else if (isQualityTeamKra && teamName === 'Quality Team' && owner) {
                                updateQualityTeamKraCharts(operationName, target, actual, owner);
                            } else if (isDcTeamKra && teamName === 'DC Team' && owner) {
                                updateDcTeamKraCharts(operationName, target, actual, owner);
                            } else if (isOpportunityTeamKra && teamName === 'Opportunity Team' && owner) {
                                updateOpportunityTeamKraCharts(operationName, target, actual, owner);
                            } else if (isItTeamKra && teamName === 'IT Team' && owner) {
                                updateItTeamKraCharts(operationName, target, actual, owner);
                            } else if (isMarcomTeamKra && teamName === 'Marcom Team' && owner) {
                                updateMarcomTeamKraCharts(operationName, target, actual, owner);
                            } else if (isOperationsTeamKra && teamName === 'Operations Team' && owner) {
                                updateOperationsTeamKraCharts(operationName, target, actual, owner);
                            } else if (isAuditTeamKra && teamName === 'Audit Team' && owner) {
                                updateAuditTeamKraCharts(operationName, target, actual, owner);
                            } else if (isGatheringTeamKra && teamName === 'Gathering Team' && owner) {
                                updateGatheringTeamKraCharts(operationName, target, actual, owner);
                            } else if (teamName === 'Technical Team' || teamName === 'Accounting Team' || teamName === 'LRAD Team' || teamName === 'Quality Team' || teamName === 'DC Team' || teamName === 'Opportunity Team' || teamName === 'IT Team' || teamName === 'Marcom Team' || teamName === 'Operations Team' || teamName === 'Audit Team' || teamName === 'Gathering Team') {
                                let kpiWeightsJson = this.getAttribute('data-kpi-weights');
                                if (kpiWeightsJson) {
                                    try {
                                        // Unescape HTML entities before parsing
                                        kpiWeightsJson = kpiWeightsJson.replace(/&quot;/g, '"');
                                        const kpiWeights = JSON.parse(kpiWeightsJson);
                                        const kraName = this.getAttribute('data-operation');
                                        const owner = this.getAttribute('data-owner');
                                    } catch (e) {
                                        console.error('Error parsing KPI weights:', e, 'Raw JSON:', kpiWeightsJson);
                                    }
                                }
                            } else {
                                // For other teams, show bar chart for the row
                                const operationName = this.getAttribute('data-operation');
                                const targetStr = this.getAttribute('data-target');
                                const actualStr = this.getAttribute('data-actual');
                                
                                const targetValue = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                                const actualValue = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                                
                                if (targetValue !== null && actualValue !== null) {
                                    // Remove active class from all rows
                                    document.querySelectorAll('.member-row').forEach(r => r.classList.remove('row-active'));
                                    // Add active class to clicked row
                                    this.classList.add('row-active');
                                    updateTeamPerformanceBarChart(operationName, targetValue, actualValue);
                                }
                            }
                        }
                    }
                });
            });
        }


        function attachSearchFunctionality() {
            const searchInput = document.getElementById('searchInput');
            if (!searchInput) return;
            
            // Remove any existing event listeners by cloning the element
            const newSearchInput = searchInput.cloneNode(true);
            searchInput.parentNode.replaceChild(newSearchInput, searchInput);
            
            newSearchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();
                const operationsContent = document.getElementById('operationsContent');
                if (!operationsContent) return;
                
                const memberRows = operationsContent.querySelectorAll('.member-row');

                memberRows.forEach(row => {
                    const name = row.getAttribute('data-name') || '';
                    const team = row.getAttribute('data-team') || '';
                    const operation = row.getAttribute('data-operation') || '';
                    const owner = row.getAttribute('data-owner') || '';
                    const memberName = row.querySelector('.member-name')?.textContent || '';
                    
                    // Get Role Owner text - for opportunity/operations team rows, it's the first div
                    // For member-view-row, it's the second div after member-info
                    let roleOwner = '';
                    if (row.classList.contains('opportunity-team-kra-row') || row.classList.contains('operations-team-kra-row')) {
                        // First div is Role Owner
                        const firstDiv = row.children[0];
                        roleOwner = firstDiv && firstDiv.tagName === 'DIV' ? firstDiv.textContent.trim() : '';
                    } else if (row.classList.contains('member-view-row')) {
                        // Second div after member-info is the role
                        const children = Array.from(row.children);
                        const memberInfoIndex = children.findIndex(child => child.classList.contains('member-info'));
                        if (memberInfoIndex !== -1 && children[memberInfoIndex + 1]) {
                            roleOwner = children[memberInfoIndex + 1].textContent.trim();
                        }
                    }
                    
                    // Also get all visible text content from the row for comprehensive search
                    const rowText = row.textContent || '';
                    
                    const nameMatch = name.toLowerCase().includes(searchTerm);
                    const teamMatch = team.toLowerCase().includes(searchTerm);
                    const operationMatch = operation.toLowerCase().includes(searchTerm);
                    const ownerMatch = owner.toLowerCase().includes(searchTerm);
                    const memberNameMatch = memberName.toLowerCase().includes(searchTerm);
                    const roleOwnerMatch = roleOwner.toLowerCase().includes(searchTerm);
                    const rowTextMatch = rowText.toLowerCase().includes(searchTerm);
                    
                    if (nameMatch || teamMatch || operationMatch || ownerMatch || memberNameMatch || roleOwnerMatch || rowTextMatch || searchTerm === '') {
                        row.classList.remove('hidden');
                    } else {
                        row.classList.add('hidden');
                    }
                });
            });
        }

        function applyIncomingLeaderHighlight() {
            const params = new URLSearchParams(window.location.search);
            // Support both new highlightTeam and old highlightLeader for backward compatibility
            const teamParam = params.get('highlightTeam') || params.get('highlightLeader');
            const operationParam = params.get('highlightOperation');
            const kpiParam = params.get('highlightKpi');
            const autoClickKpiParam = params.get('autoClickKpi');
            const highlightViewParam = params.get('highlightView');

            if (!teamParam) {
                return;
            }

            // Support both old leader IDs and new team names
            let teamName = teamParam.trim();
            // Check if it's an old leader ID and convert to team name
            if (leaderIdToTeamName[teamName.toLowerCase()]) {
                teamName = leaderIdToTeamName[teamName.toLowerCase()];
            }
            
            if (!teamName) {
                return;
            }

            // Switch to profile section if highlightView=profile (for Lead KPIs)
            if (highlightViewParam === 'profile' && currentView !== 'profile') {
                toggleSections();
            }

            const targetCard = Array.from(leaderCards).find(card =>
                normalizeTeamName(card.getAttribute('data-team')) === teamName
            );

            if (!targetCard) {
                return;
            }

            const originalTabindex = targetCard.getAttribute('tabindex');

            const highlightCard = () => {
                const highlightedElements = new Set();
                const registerHighlight = (element) => {
                    if (!element) {
                        return;
                    }
                    element.classList.add('highlight-target');
                    highlightedElements.add(element);
                };

                registerHighlight(targetCard);
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

                targetCard.setAttribute('tabindex', '-1');

                requestAnimationFrame(() => {
                    targetCard.focus({ preventScroll: true });
                });

                if (!targetCard.classList.contains('active')) {
                    targetCard.click();
                }

                let cleanupRan = false;
                let fallbackTimeoutId = null;

                const cleanup = () => {
                    if (cleanupRan) {
                        return;
                    }
                    cleanupRan = true;

                    if (fallbackTimeoutId !== null) {
                        clearTimeout(fallbackTimeoutId);
                    }

                    highlightedElements.forEach(element => {
                        element.classList.remove('highlight-target');
                    });
                    highlightedElements.clear();

                    if (targetCard.getAttribute('tabindex') === '-1') {
                        targetCard.blur();
                        if (originalTabindex !== null) {
                            targetCard.setAttribute('tabindex', originalTabindex);
                        } else {
                            targetCard.removeAttribute('tabindex');
                        }
                    }

                    if (window.history && window.history.replaceState) {
                        const url = new URL(window.location.href);
                        url.searchParams.delete('highlightTeam');
                        url.searchParams.delete('highlightLeader'); // Also remove old parameter for backward compatibility
                        if (operationParam) {
                            url.searchParams.delete('highlightOperation');
                        }
                        if (kpiParam) {
                            url.searchParams.delete('highlightKpi');
                        }
                        if (autoClickKpiParam) {
                            url.searchParams.delete('autoClickKpi');
                        }
                        if (highlightViewParam) {
                            url.searchParams.delete('highlightView');
                        }
                        if (params.has('highlightSource')) {
                            url.searchParams.delete('highlightSource');
                        }
                        window.history.replaceState({}, document.title, url.toString());
                    }
                };

                const maybeHighlightOperation = () => {
                    if (!operationParam || !kpiParam) {
                        return;
                    }

                    const normalizedOperation = operationParam.trim().toLowerCase();
                    const normalizedKpi = kpiParam.trim().toLowerCase();
                    let operationHighlightComplete = false;

                    const locateOperationRow = (attempt = 0) => {
                        if (operationHighlightComplete || attempt > 15) {
                            return;
                        }

                        const operationsContent = document.getElementById('operationsContent');
                        if (!operationsContent) {
                            setTimeout(() => locateOperationRow(attempt + 1), 150);
                            return;
                        }

                        const operationRow = Array.from(operationsContent.querySelectorAll('.member-row.has-dropdown')).find(row => {
                            const label = row.querySelector('.member-name');
                            return label && label.textContent.trim().toLowerCase() === normalizedOperation;
                        });

                        if (!operationRow) {
                            setTimeout(() => locateOperationRow(attempt + 1), 150);
                            return;
                        }

                        registerHighlight(operationRow);

                        const expandAndSelectKpi = (innerAttempt = 0) => {
                            if (operationHighlightComplete || innerAttempt > 15) {
                                return;
                            }

                            if (!operationRow.classList.contains('expanded')) {
                                operationRow.click();
                            }

                            const dropdownId = operationRow.getAttribute('data-index');
                            const dropdown = dropdownId ? document.getElementById(`dropdown-${dropdownId}`) : null;

                            if (!dropdown || !dropdown.classList.contains('show')) {
                                setTimeout(() => expandAndSelectKpi(innerAttempt + 1), 150);
                                return;
                            }

                            const subOperationItems = Array.from(dropdown.querySelectorAll('.sub-operation-item'));
                            const targetSubOperation = subOperationItems.find(item => {
                                const label = item.querySelector('.sub-operation-label');
                                return label && label.textContent.trim().toLowerCase() === normalizedKpi;
                            });

                            if (!targetSubOperation) {
                                setTimeout(() => expandAndSelectKpi(innerAttempt + 1), 150);
                                return;
                            }

                            operationHighlightComplete = true;

                            registerHighlight(targetSubOperation);
                            targetSubOperation.scrollIntoView({ behavior: 'smooth', block: 'center' });

                            targetSubOperation.click();
                        };

                        setTimeout(() => expandAndSelectKpi(), 120);
                    };

                    locateOperationRow();
                };

                const animationEndHandler = () => {
                    cleanup();
                    targetCard.removeEventListener('animationend', animationEndHandler);
                };

                targetCard.addEventListener('animationend', animationEndHandler, { once: true });

                setTimeout(maybeHighlightOperation, 300);

                // Helper function to normalize KPI names for comparison
                const normalizeKpiForComparison = (kpiName) => {
                    if (!kpiName) return '';
                    return kpiName
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
                        .trim();
                };

                // Helper function to safely decode URL parameters (handles double-encoding)
                const safeDecodeURIComponent = (str) => {
                    if (!str) return '';
                    try {
                        // Try decoding once
                        let decoded = decodeURIComponent(str);
                        // If it still contains encoded characters, try decoding again (handles double-encoding)
                        if (decoded.includes('%')) {
                            try {
                                decoded = decodeURIComponent(decoded);
                            } catch (e) {
                                // If second decode fails, use first decode result
                            }
                        }
                        return decoded;
                    } catch (e) {
                        // If decode fails, return original string
                        return str;
                    }
                };

                // Handle auto-clicking a KPI row (for both non-dropdown and dropdown rows)
                const maybeAutoClickKpi = () => {
                    if (!autoClickKpiParam) {
                        return;
                    }

                    // Decode URL-encoded characters (e.g., %3A for colon, %25 for %)
                    const decodedKpiParam = safeDecodeURIComponent(autoClickKpiParam);
                    const normalizedKpi = normalizeKpiForComparison(decodedKpiParam);
                    let autoClickComplete = false;
                    
                    console.log(`[KPI Auto-Click] Looking for KPI: "${decodedKpiParam}" (normalized: "${normalizedKpi}")`);

                    const locateAndClickKpi = (attempt = 0) => {
                        if (autoClickComplete || attempt > 20) {
                            return;
                        }

                        // Check if we're in profile view (Lead KPIs) or operations view (Lag KPIs)
                        const isProfileView = currentView === 'profile';
                        const contentElement = isProfileView 
                            ? document.getElementById('profileContent')
                            : document.getElementById('operationsContent');
                        
                        if (!contentElement) {
                            setTimeout(() => locateAndClickKpi(attempt + 1), 150);
                            return;
                        }

                        // First, try to find the KPI as a direct row (non-dropdown)
                        // For Lead KPIs, use #leadKpiList, for Lag KPIs use #membersList or operationsContent
                        const listContainer = isProfileView 
                            ? document.getElementById('leadKpiList')
                            : contentElement.querySelector('#membersList') || contentElement;
                        
                        if (!listContainer) {
                            setTimeout(() => locateAndClickKpi(attempt + 1), 150);
                            return;
                        }
                        
                        let kpiRow = Array.from(listContainer.querySelectorAll('.member-row:not(.has-dropdown)')).find(row => {
                            const operationName = row.getAttribute('data-operation');
                            if (!operationName) return false;
                            
                            // Clean and normalize both strings for comparison
                            const cleanOperationName = operationName.trim();
                            const cleanDecodedParam = decodedKpiParam.trim();
                            
                            // Try multiple matching strategies
                            // 1. Exact match (case-insensitive)
                            const exactMatch = cleanOperationName.toLowerCase() === cleanDecodedParam.toLowerCase();
                            
                            // 2. Normalized match
                            const normalizedOperation = normalizeKpiForComparison(operationName);
                            const normalizedMatch = normalizedOperation === normalizedKpi;
                            
                            // 3. Normalized decoded param match
                            const decodedNormalized = normalizeKpiForComparison(decodedKpiParam);
                            const normalizedDecodedMatch = normalizedOperation === decodedNormalized;
                            
                            const matches = exactMatch || normalizedMatch || normalizedDecodedMatch;
                            
                            if (matches) {
                                console.log(`[KPI Match] ✓ Found KPI: "${operationName}" matches "${decodedKpiParam}"`);
                                console.log(`[KPI Match]   - Exact match: ${exactMatch}, Normalized match: ${normalizedMatch}, Decoded normalized match: ${normalizedDecodedMatch}`);
                            }
                            return matches;
                        });

                        if (kpiRow) {
                            // Found as direct row
                            autoClickComplete = true;
                            registerHighlight(kpiRow);
                            kpiRow.scrollIntoView({ behavior: 'smooth', block: 'center' });

                            // Click the row to trigger the graph update
                            setTimeout(() => {
                                kpiRow.click();
                            }, 200);
                            return;
                        } else if (attempt === 0) {
                            // Log available KPIs on first attempt for debugging
                            const availableKpis = Array.from(listContainer.querySelectorAll('.member-row:not(.has-dropdown)'))
                                .map(row => row.getAttribute('data-operation'))
                                .filter(Boolean);
                            console.log(`[KPI Match] Looking for: "${decodedKpiParam}" (normalized: "${normalizedKpi}")`);
                            console.log(`[KPI Match] Available KPIs:`, availableKpis);
                            console.log(`[KPI Match] Normalized available KPIs:`, availableKpis.map(kpi => normalizeKpiForComparison(kpi)));
                        }

                        // If not found as direct row, check if it's in a dropdown
                        const checkDropdowns = (dropdownIndex = 0) => {
                            if (autoClickComplete) return;
                            
                            const dropdownRows = Array.from(contentElement.querySelectorAll('.member-row.has-dropdown'));
                            
                            if (dropdownIndex >= dropdownRows.length) {
                                // Checked all dropdowns, retry if not found
                                if (!autoClickComplete) {
                                    setTimeout(() => locateAndClickKpi(attempt + 1), 150);
                                }
                                return;
                            }
                            
                            const dropdownRow = dropdownRows[dropdownIndex];
                            const rowIndex = dropdownRow.getAttribute('data-index');
                            const dropdown = rowIndex ? document.getElementById(`dropdown-${rowIndex}`) : null;
                            
                            if (!dropdown) {
                                // Check next dropdown
                                checkDropdowns(dropdownIndex + 1);
                                return;
                            }
                            
                            // Check if dropdown is already expanded
                            if (dropdownRow.classList.contains('expanded') && dropdown.classList.contains('show')) {
                                // Check for KPI in this dropdown
                                const subOperationItems = Array.from(dropdown.querySelectorAll('.sub-operation-item'));
                                const targetSubOperation = subOperationItems.find(item => {
                                    const label = item.querySelector('.sub-operation-label');
                                    if (!label) return false;
                                    const labelText = label.textContent.trim().replace(/→/g, '').trim();
                                    const normalizedLabel = normalizeKpiForComparison(labelText);
                                    // Try multiple matching strategies
                                    const exactMatch = normalizedLabel === normalizedKpi;
                                    const caseInsensitiveMatch = labelText.toLowerCase() === decodedKpiParam.trim().toLowerCase();
                                    const decodedNormalized = normalizeKpiForComparison(decodedKpiParam);
                                    const normalizedMatch = normalizedLabel === decodedNormalized;
                                    return exactMatch || caseInsensitiveMatch || normalizedMatch;
                                });
                                
                                if (targetSubOperation) {
                                    autoClickComplete = true;
                                    registerHighlight(dropdownRow);
                                    registerHighlight(targetSubOperation);
                                    targetSubOperation.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    
                                    setTimeout(() => {
                                        targetSubOperation.click();
                                    }, 200);
                                    return;
                                }
                            } else {
                                // Expand dropdown and check
                                dropdownRow.click();
                                setTimeout(() => {
                                    const subOperationItems = Array.from(dropdown.querySelectorAll('.sub-operation-item'));
                                const targetSubOperation = subOperationItems.find(item => {
                                    const label = item.querySelector('.sub-operation-label');
                                    if (!label) return false;
                                    const labelText = label.textContent.trim().replace(/→/g, '').trim();
                                    const normalizedLabel = normalizeKpiForComparison(labelText);
                                    // Try multiple matching strategies
                                    const exactMatch = normalizedLabel === normalizedKpi;
                                    const caseInsensitiveMatch = labelText.toLowerCase() === decodedKpiParam.trim().toLowerCase();
                                    const decodedNormalized = normalizeKpiForComparison(decodedKpiParam);
                                    const normalizedMatch = normalizedLabel === decodedNormalized;
                                    return exactMatch || caseInsensitiveMatch || normalizedMatch;
                                });
                                    
                                    if (targetSubOperation) {
                                        autoClickComplete = true;
                                        registerHighlight(dropdownRow);
                                        registerHighlight(targetSubOperation);
                                        targetSubOperation.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        
                                        setTimeout(() => {
                                            targetSubOperation.click();
                                        }, 200);
                                        return;
                                    }
                                    
                                    // Not found in this dropdown, check next
                                    checkDropdowns(dropdownIndex + 1);
                                }, 300);
                                return;
                            }
                            
                            // Not found in this dropdown, check next
                            checkDropdowns(dropdownIndex + 1);
                        };
                        
                        checkDropdowns();
                    };

                    // Wait a bit for the operations content to load after leader selection
                    // Increased delay to ensure content is fully rendered
                    setTimeout(() => locateAndClickKpi(), 800);
                };

                setTimeout(maybeAutoClickKpi, 600);

                const fallbackTimeoutMs = 5000;
                fallbackTimeoutId = setTimeout(() => {
                    cleanup();
                }, fallbackTimeoutMs);
            };

            setTimeout(highlightCard, 400);
        }

        window.addEventListener('DOMContentLoaded', () => {
            initializeReports();
            initTeamPerformanceChart();
            resetTeamPerformanceVisuals({
                infoMessage: 'Select a KPI to view its target vs actual details.'
            });
            refreshOperationsContent();
            initScoreboardToggle();
            applyIncomingLeaderHighlight();
        });

        