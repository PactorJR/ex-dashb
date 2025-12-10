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

        const teamMembersData = {
            'Technical Team': [
                {
                    name: 'Alex Thompson',
                    role: 'Senior Developer',
                    kpi: 'Code Quality',
                    targetValue: 95,
                    targetLabel: '95%',
                    actualValue: 92,
                    actualLabel: '92%'
                },
                {
                    name: 'Isabelle Cruz',
                    role: 'Automation Lead',
                    kpi: 'Deployment Stability',
                    targetValue: 99.5,
                    targetLabel: '99.5%',
                    actualValue: 99.1,
                    actualLabel: '99.1%'
                }
            ],
            'Accounting Team': [
                {
                    name: 'Ethan Morales',
                    role: 'Financial Analyst',
                    kpi: 'Budget Variance',
                    targetValue: 3.0,
                    targetLabel: '≤ 3%',
                    actualValue: 2.4,
                    actualLabel: '2.4%'
                },
                {
                    name: 'Grace Velasco',
                    role: 'Collections Lead',
                    kpi: 'Receivables Turnover',
                    targetValue: 45,
                    targetLabel: '45 days',
                    actualValue: 38,
                    actualLabel: '38 days'
                }
            ],
            'LRAD Team': [
                {
                    name: 'Rachel Kim',
                    role: 'Researcher',
                    kpi: 'Research Output',
                    targetValue: 10,
                    targetLabel: '10 studies',
                    actualValue: 12,
                    actualLabel: '12 studies'
                },
                {
                    name: 'Liam Ocampo',
                    role: 'Data Strategist',
                    kpi: 'Insights Published',
                    targetValue: 8,
                    targetLabel: '8 briefs',
                    actualValue: 9,
                    actualLabel: '9 briefs'
                }
            ],
            'Quality Team': [
                {
                    name: 'James Cooper',
                    role: 'QA Lead',
                    kpi: 'Defect Rate',
                    targetValue: 2,
                    targetLabel: '< 2%',
                    actualValue: 1.5,
                    actualLabel: '1.5%'
                }
            ],
            'DC Team': [
                {
                    name: 'Maria Santos',
                    role: 'Infrastructure Manager',
                    kpi: 'Uptime',
                    targetValue: 99.9,
                    targetLabel: '99.9%',
                    actualValue: 99.95,
                    actualLabel: '99.95%'
                }
            ],
            'IT Team': [
                {
                    name: 'Christopher Brown',
                    role: 'System Admin',
                    kpi: 'Response Time',
                    targetValue: 2,
                    targetLabel: '≤ 2s',
                    actualValue: 1.8,
                    actualLabel: '1.8s'
                }
            ],
            'Opportunity Team': [
                {
                    name: 'Nina Patel',
                    role: 'Business Developer',
                    kpi: 'New Leads',
                    targetValue: 50,
                    targetLabel: '50 leads',
                    actualValue: 58,
                    actualLabel: '58 leads'
                }
            ],
            'Marcom Team': [
                {
                    name: 'Daniel Foster',
                    role: 'Marketing Specialist',
                    kpi: 'Campaign Reach',
                    targetValue: 10000,
                    targetLabel: '10K',
                    actualValue: 12500,
                    actualLabel: '12.5K'
                }
            ],
            'Audit Team': [
                {
                    name: 'Sophie Zhang',
                    role: 'Auditor',
                    kpi: 'Compliance',
                    targetValue: 100,
                    targetLabel: '100%',
                    actualValue: 100,
                    actualLabel: '100%'
                }
            ],
            'Gathering Team': [
                {
                    name: 'Tyler Davis',
                    role: 'Data Analyst',
                    kpi: 'Data Accuracy',
                    targetValue: 98,
                    targetLabel: '98%',
                    actualValue: 99,
                    actualLabel: '99%'
                }
            ],
            'Operations Team': [
                {
                    name: 'Olivia Nguyen',
                    role: 'Ops Manager',
                    kpi: 'Efficiency',
                    targetValue: 90,
                    targetLabel: '90%',
                    actualValue: 93,
                    actualLabel: '93%'
                }
            ]
        };

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
        const chartFullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const chartMonthIndexToFullName = chartFullMonths.reduce((map, name, index) => {
            map[index] = name;
            return map;
        }, {});

        const quarterDefinitions = [
            { id: 'Q1', label: 'Q1 (Jan-Mar)', months: [0, 1, 2] },
            { id: 'Q2', label: 'Q2 (Apr-Jun)', months: [3, 4, 5] },
            { id: 'Q3', label: 'Q3 (Jul-Sep)', months: [6, 7, 8] },
            { id: 'Q4', label: 'Q4 (Oct-Dec)', months: [9, 10, 11] }
        ];

        const quarterDefinitionMap = quarterDefinitions.reduce((map, def) => {
            map[def.id] = def;
            return map;
        }, {});

        function randomIntInRange(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function randomFloatInRange(min, max, decimals = 1) {
            const factor = 10 ** decimals;
            return Math.round((Math.random() * (max - min) + min) * factor) / factor;
        }

        function generateTechnicalLagKpiData(periodKey = DEFAULT_PERIOD_KEY) {
            return {
                'FS Target : Repairs & Maintenance (Labor) (TECHNICAL) Expense': {
                    [periodKey]: {
                        target: randomIntInRange(120000, 135000),
                        actual: randomIntInRange(112000, 132000)
                    }
                },
                'FS Target : Repairs & Maintenance (Materials) (TECHNICAL) Expense': {
                    [periodKey]: {
                        target: randomIntInRange(85000, 90000),
                        actual: randomIntInRange(82000, 95000)
                    }
                }
            };
        }

        function generateTechnicalLeadKpiData(periodKey = DEFAULT_PERIOD_KEY) {
            return {
                '# of Breakdowns : Engineering Department': {
                    [periodKey]: {
                        target: randomIntInRange(4, 6),
                        actual: randomIntInRange(2, 5)
                    }
                },
                '% Predictive Maintenance Compliance': {
                    [periodKey]: {
                        target: randomFloatInRange(94, 97, 1),
                        actual: randomFloatInRange(92, 99, 1)
                    }
                },
                '% Emergency Response Within SLA': {
                    [periodKey]: {
                        target: randomFloatInRange(90, 94, 1),
                        actual: randomFloatInRange(88, 97, 1)
                    }
                }
            };
        }

        function generateAccountingLagKpiData(periodKey = DEFAULT_PERIOD_KEY) {
            return {
                'FS Target : Total Operating Expense': {
                    [periodKey]: {
                        target: randomIntInRange(22000000, 24000000),
                        actual: randomIntInRange(21000000, 23500000)
                    }
                },
                'FS Target : Total Gross Revenue': {
                    [periodKey]: {
                        target: randomIntInRange(36000000, 38000000),
                        actual: randomIntInRange(37000000, 39500000)
                    }
                },
                'FS Target : Net Profit': {
                    [periodKey]: {
                        target: randomIntInRange(10000000, 11000000),
                        actual: randomIntInRange(10500000, 12000000)
                    }
                },
                '% Collection : All Sites': {
                    [periodKey]: {
                        target: randomFloatInRange(85, 90, 1),
                        actual: randomFloatInRange(88, 95, 1)
                    }
                }
            };
        }

        function generateLradLagKpiData(periodKey = DEFAULT_PERIOD_KEY) {
            return {
                'FS Target : Salary Expense': {
                    [periodKey]: {
                        target: randomIntInRange(1800000, 1900000),
                        actual: randomIntInRange(1700000, 1850000)
                    }
                }
            };
            }
            
        function generateDcLagKpiData(periodKey = DEFAULT_PERIOD_KEY) {
            return {
                'FS Target : Repairs & Maintenance (Labor) (DCD) Expense': {
                    [periodKey]: {
                        target: randomIntInRange(140000, 150000),
                        actual: randomIntInRange(135000, 145000)
                    }
                },
                'FS Target : Repairs & Maintenance (Materials) (DCD) Expense': {
                    [periodKey]: {
                        target: randomIntInRange(95000, 100000),
                        actual: randomIntInRange(90000, 105000)
                    }
                }
            };
        }

        function generateOpportunityLagKpiData(periodKey = DEFAULT_PERIOD_KEY) {
            return {
                '% Occupancy: Commercial (Units)': {
                    [periodKey]: {
                        target: randomFloatInRange(85, 90, 1),
                        actual: randomFloatInRange(87, 92, 1)
                    }
                },
                '% Occupancy: Commercial (Area)': {
                    [periodKey]: {
                        target: randomFloatInRange(83, 88, 1),
                        actual: randomFloatInRange(85, 90, 1)
                    }
                },
                '% Occupancy: Commercial (PValue)': {
                    [periodKey]: {
                        target: randomFloatInRange(80, 85, 1),
                        actual: randomFloatInRange(82, 87, 1)
                    }
                },
                'FS Target : Rental Income': {
                    [periodKey]: {
                        target: randomIntInRange(12000000, 13000000),
                        actual: randomIntInRange(12500000, 13500000)
                    }
                }
            };
        }

        function generateMarcomLagKpiData(periodKey = DEFAULT_PERIOD_KEY) {
            return {
                '% Within the Team\'s Budget': {
                    [periodKey]: {
                        target: randomFloatInRange(93, 97, 1),
                        actual: randomFloatInRange(94, 98, 1)
                    }
                },
                'FS Target : Marketing Expense (+Gifts & Decor) (MARCOM)': {
                    [periodKey]: {
                        target: randomIntInRange(140000, 160000),
                        actual: randomIntInRange(135000, 155000)
                    }
                },
                '% Budget Compliance': {
                    [periodKey]: {
                        target: randomFloatInRange(96, 100, 1),
                        actual: randomFloatInRange(97, 99, 1)
                    }
                },
                '% Cost per Campaign': {
                    [periodKey]: {
                        target: randomFloatInRange(83, 87, 1),
                        actual: randomFloatInRange(84, 88, 1)
                    }
                },
                '% Increase : Facebook Page Reach (per Month per Page)': {
                    [periodKey]: {
                        target: randomFloatInRange(13, 17, 1),
                        actual: randomFloatInRange(14, 18, 1)
                    }
                },
                '% Increase : Facebook Page Followers (per Month per Page)': {
                    [periodKey]: {
                        target: randomFloatInRange(10, 14, 1),
                        actual: randomFloatInRange(11, 15, 1)
                    }
                },
                '% Campaign Engagement Rate': {
                    [periodKey]: {
                        target: randomFloatInRange(6, 10, 1),
                        actual: randomFloatInRange(7, 11, 1)
                    }
                },
                '% Conversion Rate : Marketing Campaigns': {
                    [periodKey]: {
                        target: randomFloatInRange(3, 7, 1),
                        actual: randomFloatInRange(4, 8, 1)
                    }
                },
                '# of Qualified Leads Generated': {
                    [periodKey]: {
                        target: randomIntInRange(140, 160),
                        actual: randomIntInRange(145, 165)
                    }
                },
                '# of Inquiries : Offline for (Commercial Spaces)': {
                    [periodKey]: {
                        target: randomIntInRange(40, 50),
                        actual: randomIntInRange(42, 52)
                    }
                },
                '# of Inquiries : Offline for Gatherings (Event Venues)': {
                    [periodKey]: {
                        target: randomIntInRange(30, 40),
                        actual: randomIntInRange(32, 42)
                    }
                },
                '# of Inquiries : Offline for Gatherings (Sports Arena)': {
                    [periodKey]: {
                        target: randomIntInRange(20, 30),
                        actual: randomIntInRange(22, 32)
                    }
                },
                '% Inquiry Response Time': {
                    [periodKey]: {
                        target: randomFloatInRange(93, 97, 1),
                        actual: randomFloatInRange(94, 98, 1)
                    }
                }
            };
        }

        function generateGatheringLagKpiData(periodKey = DEFAULT_PERIOD_KEY) {
            return {
                '% Occupancy: Venue (Hours)': {
                    [periodKey]: {
                        target: randomFloatInRange(73, 77, 1),
                        actual: randomFloatInRange(74, 78, 1)
                    }
                },
                '% Occupancy: Venue (PValue)': {
                    [periodKey]: {
                        target: randomFloatInRange(70, 74, 1),
                        actual: randomFloatInRange(71, 75, 1)
                    }
                },
                '% Occupancy: Studio (Hours)': {
                    [periodKey]: {
                        target: randomFloatInRange(66, 70, 1),
                        actual: randomFloatInRange(67, 71, 1)
                    }
                },
                '% Occupancy: Studio (PValue)': {
                    [periodKey]: {
                        target: randomFloatInRange(63, 67, 1),
                        actual: randomFloatInRange(64, 68, 1)
                    }
                },
                '% Occupancy: Sports Arena (Hours)': {
                    [periodKey]: {
                        target: randomFloatInRange(78, 82, 1),
                        actual: randomFloatInRange(79, 83, 1)
                    }
                },
                '% Occupancy: Sports Arena (PValue)': {
                    [periodKey]: {
                        target: randomFloatInRange(75, 79, 1),
                        actual: randomFloatInRange(76, 80, 1)
                    }
                },
                'FS Target : Marketing Expense (+Gifts & Decor) (GATHERING)': {
                    [periodKey]: {
                        target: randomIntInRange(640000, 660000),
                        actual: randomIntInRange(630000, 650000)
                    }
                }
            };
            }

        function generateOperationsLagKpiData(periodKey = DEFAULT_PERIOD_KEY) {
            return {
                '% Within the Team\'s Budget': {
                    [periodKey]: {
                        target: randomFloatInRange(93, 97, 1),
                        actual: randomFloatInRange(94, 98, 1)
                    }
                },
                'FS Target : Electricity Expense': {
                    [periodKey]: {
                        target: randomIntInRange(80000, 90000),
                        actual: randomIntInRange(75000, 85000)
                    }
                },
                'FS Target : Water Expense': {
                    [periodKey]: {
                        target: randomIntInRange(23000, 27000),
                        actual: randomIntInRange(22000, 26000)
                    }
                },
                'FS Target : Security Expense': {
                    [periodKey]: {
                        target: randomIntInRange(115000, 125000),
                        actual: randomIntInRange(110000, 120000)
                    }
                },
                'FS Target : Agency Expense': {
                    [periodKey]: {
                        target: randomIntInRange(42000, 48000),
                        actual: randomIntInRange(40000, 46000)
                    }
                },
                'FS Target : Parking Income': {
                    [periodKey]: {
                        target: randomIntInRange(175000, 185000),
                        actual: randomIntInRange(180000, 190000)
                    }
                },
                '% Facility Uptime': {
                    [periodKey]: {
                        target: randomFloatInRange(96, 100, 1),
                        actual: randomFloatInRange(97, 99, 1)
                    }
                },
                '% Maintenance Completion Rate': {
                    [periodKey]: {
                        target: randomFloatInRange(93, 97, 1),
                        actual: randomFloatInRange(94, 98, 1)
                    }
                },
                '% Energy Efficiency': {
                    [periodKey]: {
                        target: randomFloatInRange(88, 92, 1),
                        actual: randomFloatInRange(89, 93, 1)
                    }
                },
                '# of Facility Issues Resolved': {
                    [periodKey]: {
                        target: randomIntInRange(45, 55),
                        actual: randomIntInRange(48, 58)
                    }
                },
                '% Vendor Performance Compliance': {
                    [periodKey]: {
                        target: randomFloatInRange(90, 94, 1),
                        actual: randomFloatInRange(91, 95, 1)
                    }
                },
                '% Addressed : Team/Section\'s I.C.A.R.E': {
                    [periodKey]: {
                        target: randomFloatInRange(98, 100, 1),
                        actual: randomFloatInRange(99, 100, 1)
                    }
                },
                '% Score : Site Quality (by Auditor)': {
                    [periodKey]: {
                        target: randomFloatInRange(88, 92, 1),
                        actual: randomFloatInRange(89, 93, 1)
                    }
                },
                '% Insurance Claimed vs Reported': {
                    [periodKey]: {
                        target: randomFloatInRange(93, 97, 1),
                        actual: randomFloatInRange(94, 98, 1)
                    }
                },
                '% Compliance : Safety Standards': {
                    [periodKey]: {
                        target: randomFloatInRange(96, 100, 1),
                        actual: randomFloatInRange(97, 99, 1)
                    }
                },
                '% Onboarded Tenants : All Tenants/Reserved (New + Existing)': {
                    [periodKey]: {
                        target: randomFloatInRange(98, 100, 1),
                        actual: randomFloatInRange(99, 100, 1)
                    }
                },
                '% Tenant Satisfaction Score': {
                    [periodKey]: {
                        target: randomFloatInRange(83, 87, 1),
                        actual: randomFloatInRange(84, 88, 1)
                    }
                },
                '% On time Tenant Services Delivery': {
                    [periodKey]: {
                        target: randomFloatInRange(93, 97, 1),
                        actual: randomFloatInRange(94, 98, 1)
                    }
                }
            };
        }

        function generateLradLeadKpiData(periodKey = DEFAULT_PERIOD_KEY) {
            return {
                '% On time & Accurate - LMDB': {
                    [periodKey]: {
                        target: randomFloatInRange(93, 97, 1),
                        actual: randomFloatInRange(95, 99, 1)
                    }
                },
                '% On time & Accurate - Recorded: Scores (KPI)': {
                    [periodKey]: {
                        target: randomFloatInRange(90, 94, 1),
                        actual: randomFloatInRange(92, 96, 1)
                    }
                },
                '% On time & Accurate - Recorded: Stories': {
                    [periodKey]: {
                        target: randomFloatInRange(86, 90, 1),
                        actual: randomFloatInRange(88, 93, 1)
                    }
                },
                '% Planned vs Actual - Regular Events Plan: Lotuszen': {
                    [periodKey]: {
                        target: randomFloatInRange(83, 87, 1),
                        actual: randomFloatInRange(85, 89, 1)
                    }
                },
                '% Planned vs Actual - Culture Dev\'t Activities Plan: Lotuszen': {
                    [periodKey]: {
                        target: randomFloatInRange(88, 92, 1),
                        actual: randomFloatInRange(90, 94, 1)
                    }
                },
                '% Complete & Updated : LMDB': {
                    [periodKey]: {
                        target: randomFloatInRange(91, 95, 1),
                        actual: randomFloatInRange(93, 97, 1)
                    }
                }
            };
        }

        function generateQualityLeadKpiData(periodKey = DEFAULT_PERIOD_KEY) {
            return {
                'Score/Evaluation/NPS : SMD Projects': {
                    [periodKey]: {
                        target: randomFloatInRange(85, 89, 1),
                        actual: randomFloatInRange(87, 93, 1)
                    }
                },
                'Score/Evaluation/NPS : SID Projects': {
                    [periodKey]: {
                        target: randomFloatInRange(82, 86, 1),
                        actual: randomFloatInRange(84, 90, 1)
                    }
                },
                '% Planned vs Actual : SMD Projects': {
                    [periodKey]: {
                        target: randomFloatInRange(90, 94, 1),
                        actual: randomFloatInRange(92, 97, 1)
                    }
                },
                '% Planned vs Actual : SID Projects': {
                    [periodKey]: {
                        target: randomFloatInRange(87, 91, 1),
                        actual: randomFloatInRange(89, 94, 1)
                    }
                }
            };
        }

        function generateDcLeadKpiData(periodKey = DEFAULT_PERIOD_KEY) {
            return {
                '% Within Budget : Projects (E&D)': {
                    [periodKey]: {
                        target: randomFloatInRange(92, 96, 1),
                        actual: randomFloatInRange(94, 98, 1)
                    }
                },
                '% Within Budget : Projects (IP)': {
                    [periodKey]: {
                        target: randomFloatInRange(89, 93, 1),
                        actual: randomFloatInRange(91, 95, 1)
                    }
                },
                '% Within Budget : Projects (PMR)': {
                    [periodKey]: {
                        target: randomFloatInRange(86, 90, 1),
                        actual: randomFloatInRange(88, 92, 1)
                    }
                },
                '% Within Budget : Projects (Construction)': {
                    [periodKey]: {
                        target: randomFloatInRange(90, 94, 1),
                        actual: randomFloatInRange(92, 96, 1)
                        }
                    },
                '% Within Budget : Projects (Landscape)': {
                    [periodKey]: {
                        target: randomFloatInRange(87, 91, 1),
                        actual: randomFloatInRange(89, 93, 1)
                    }
                },
                '% Planned vs Actual : Projects (E&D)': {
                    [periodKey]: {
                        target: randomFloatInRange(85, 89, 1),
                        actual: randomFloatInRange(87, 91, 1)
                    }
                },
                '% Planned vs Actual : Projects (IP)': {
                    [periodKey]: {
                        target: randomFloatInRange(83, 87, 1),
                        actual: randomFloatInRange(85, 89, 1)
                    }
                },
                '% Planned vs Actual : Projects (PMR)': {
                    [periodKey]: {
                        target: randomFloatInRange(81, 85, 1),
                        actual: randomFloatInRange(83, 87, 1)
                    }
                },
                '% Planned vs Actual : Projects (Construction)': {
                    [periodKey]: {
                        target: randomFloatInRange(84, 88, 1),
                        actual: randomFloatInRange(86, 90, 1)
                    }
                },
                '% Planned vs Actual : Projects (Landscape)': {
                    [periodKey]: {
                        target: randomFloatInRange(82, 86, 1),
                        actual: randomFloatInRange(84, 88, 1)
                            }
                        },
                '% Planned vs Actual : JO (MST)': {
                    [periodKey]: {
                        target: randomFloatInRange(88, 92, 1),
                        actual: randomFloatInRange(90, 94, 1)
                        }
                    },
                '% Planned vs Actual : JO (E&D Fab)': {
                    [periodKey]: {
                        target: randomFloatInRange(86, 90, 1),
                        actual: randomFloatInRange(88, 92, 1)
                    }
                }
            };
        }

        function generateItLeadKpiData(periodKey = DEFAULT_PERIOD_KEY) {
            return {
                '# of Breakdowns : IT': {
                    [periodKey]: {
                        target: randomIntInRange(6, 10),
                        actual: randomIntInRange(3, 8)
                    }
                }
            };
        }

        function generateOpportunityLeadKpiData(periodKey = DEFAULT_PERIOD_KEY) {
            return {
                '% Planned vs Actual - Tenant Mix Plan': {
                    [periodKey]: {
                        target: randomFloatInRange(88, 92, 1),
                        actual: randomFloatInRange(90, 94, 1)
                    }
                },
                '# of Closed Inquiry/Offline Inquiries Received: Commercial': {
                    [periodKey]: {
                        target: randomIntInRange(40, 50),
                        actual: randomIntInRange(45, 55)
                    }
                },
                '# of Closed Prospects/Target Prospects: (Commercial) Anchor': {
                    [periodKey]: {
                        target: randomIntInRange(6, 10),
                        actual: randomIntInRange(8, 12)
                    }
                },
                '# of Closed Prospects/Priority Vacant Spaces: Anchor': {
                    [periodKey]: {
                        target: randomIntInRange(4, 7),
                        actual: randomIntInRange(5, 8)
                    }
                },
                '# of Closed Prospects/Target Prospects: (Commercial) Regular': {
                    [periodKey]: {
                        target: randomIntInRange(12, 18),
                        actual: randomIntInRange(15, 20)
                    }
                },
                '# of Closed Prospects/Priority Vacant Spaces: Regular': {
                    [periodKey]: {
                        target: randomIntInRange(10, 15),
                        actual: randomIntInRange(12, 17)
                    }
                },
                '% Complete & Updated: Tenant Requirements': {
                    [periodKey]: {
                        target: randomFloatInRange(93, 97, 1),
                        actual: randomFloatInRange(95, 99, 1)
                    }
                },
                '% Pull Out - Aversion': {
                    [periodKey]: {
                        target: randomFloatInRange(86, 90, 1),
                        actual: randomFloatInRange(88, 92, 1)
                    }
                }
            };
        }

        function generateMarcomLeadKpiData(periodKey = DEFAULT_PERIOD_KEY) {
            return {
                '% Increase : Facebook Page Reach (per Month per Page)': {
                    [periodKey]: {
                        target: randomFloatInRange(10, 15, 1),
                        actual: randomFloatInRange(12, 18, 1)
                    }
                },
                '% Increase : Facebook Page Followers (per Month per Page)': {
                    [periodKey]: {
                        target: randomFloatInRange(6, 10, 1),
                        actual: randomFloatInRange(8, 12, 1)
                    }
                },
                '# of Inquiries : Offline for (Commercial Spaces)': {
                    [periodKey]: {
                        target: randomIntInRange(20, 30),
                        actual: randomIntInRange(25, 35)
                    }
                },
                '# of Inquiries : Offline for Gatherings (Event Venues)': {
                    [periodKey]: {
                        target: randomIntInRange(15, 22),
                        actual: randomIntInRange(18, 25)
                    }
                },
                '# of Inquiries : Offline for Gatherings (Sports Arena)': {
                    [periodKey]: {
                        target: randomIntInRange(10, 15),
                        actual: randomIntInRange(12, 18)
                    }
                },
                '# of Inquiries : Offline for Gatherings (Handaan)': {
                    [periodKey]: {
                        target: randomIntInRange(18, 25),
                        actual: randomIntInRange(20, 28)
                    }
                },
                '# of Inquiries : Offline for Gatherings (SS)': {
                    [periodKey]: {
                        target: randomIntInRange(12, 18),
                        actual: randomIntInRange(15, 21)
                    }
                },
                '# of Inquiries : Offline for Gatherings (KS)': {
                    [periodKey]: {
                        target: randomIntInRange(8, 12),
                        actual: randomIntInRange(10, 15)
                    }
                },
                '# of Inquiries : Offline for Gatherings (Studio)': {
                    [periodKey]: {
                        target: randomIntInRange(6, 10),
                        actual: randomIntInRange(8, 13)
                    }
                }
            };
        }

        function generateAuditLeadKpiData(periodKey = DEFAULT_PERIOD_KEY) {
            return {
                '% Addressed : I.C.A.R.E (All Teams)': {
                    [periodKey]: {
                        target: randomFloatInRange(98, 100, 1),
                        actual: randomFloatInRange(99, 100, 1)
                    }
                },
                '% On time & Accurate : PropMan Module': {
                    [periodKey]: {
                        target: randomFloatInRange(93, 97, 1),
                        actual: randomFloatInRange(94, 98, 1)
                    }
                }
            };
        }

        function generateGatheringLeadKpiData(periodKey = DEFAULT_PERIOD_KEY) {
            return {
                '# of Average Daily Foot Traffic': {
                    [periodKey]: {
                        target: randomIntInRange(440, 460),
                        actual: randomIntInRange(445, 465)
                    }
                },
                '# of 500 pax or more Event/month (All Sites)': {
                    [periodKey]: {
                        target: randomIntInRange(7, 9),
                        actual: randomIntInRange(8, 10)
                    }
                },
                '# of Closed Inquiry/Offline Inquiries Received: Gathering': {
                    [periodKey]: {
                        target: randomIntInRange(33, 37),
                        actual: randomIntInRange(34, 38)
                    }
                }
            };
        }

        function generateOperationsLeadKpiData(periodKey = DEFAULT_PERIOD_KEY) {
                return {
                '% Addressed : Team/Section\'s I.C.A.R.E': {
                    [periodKey]: {
                        target: randomFloatInRange(94, 98, 1),
                        actual: randomFloatInRange(96, 99, 1)
                    }
                },
                '% Score : Site Quality (by Auditor)': {
                    [periodKey]: {
                        target: randomFloatInRange(88, 92, 1),
                        actual: randomFloatInRange(90, 94, 1)
                    }
                },
                '% Insurance Claimed vs Reported': {
                    [periodKey]: {
                        target: randomFloatInRange(83, 87, 1),
                        actual: randomFloatInRange(85, 90, 1)
                    }
                },
                '% Onboarded Tenants : All Tenants/Reserved (New + Existing)': {
                    [periodKey]: {
                        target: randomFloatInRange(86, 90, 1),
                        actual: randomFloatInRange(88, 93, 1)
                    }
                }
            };
        }

        function generateMonthlySeries({
            targetRange = [0, 0],
            actualRange = [0, 0],
            decimals = 0,
            valueType = 'thousands'
        } = {}) {
            const labels = [...chartMonths];
            const useFloat = decimals > 0;
            const generateValue = (min, max) => {
                return useFloat
                    ? randomFloatInRange(min, max, decimals)
                    : randomIntInRange(min, max);
            };

            const target = labels.map(() => generateValue(targetRange[0], targetRange[1]));
            const actual = labels.map(() => generateValue(actualRange[0], actualRange[1]));

            const totalTarget = Number(target.reduce((sum, value) => sum + value, 0).toFixed(decimals));
            const totalActual = Number(actual.reduce((sum, value) => sum + value, 0).toFixed(decimals));

            return {
                labels,
                target,
                actual,
                totalTarget,
                totalActual,
                valueType,
                decimals
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

        function sumSeriesValues(values = []) {
            if (!Array.isArray(values)) {
                return 0;
            }
            return values.reduce((sum, value) => {
                const numeric = Number(value);
                return Number.isFinite(numeric) ? sum + numeric : sum;
            }, 0);
        }

        function buildQuarterlySeriesFromMonthlySeries(monthlySeries = null) {
            if (!monthlySeries) {
                return null;
            }

            const { target = [], actual = [], valueType = 'thousands', decimals = 0 } = monthlySeries;
            if (!Array.isArray(target) || !Array.isArray(actual) || target.length < 4 || actual.length < 4) {
                return null;
            }

            const quarterGroups = [
                { label: 'Q1', indices: [0, 1, 2] },
                { label: 'Q2', indices: [3, 4, 5] },
                { label: 'Q3', indices: [6, 7, 8] },
                { label: 'Q4', indices: [9, 10, 11] }
            ];

            const aggregateSeries = (sourceArray) => quarterGroups.map(group => {
                const values = group.indices
                    .map(idx => Number(sourceArray[idx]))
                    .filter(value => Number.isFinite(value));
                if (!values.length) {
                    return 0;
                }
                const aggregatedValue = values.reduce((sum, value) => sum + value, 0);
                return Number(aggregatedValue.toFixed(decimals));
            });

            return {
                labels: quarterGroups.map(group => group.label),
                target: aggregateSeries(target),
                actual: aggregateSeries(actual),
                valueType
            };
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

        // Unified object mapping all team names to their quarterly data objects
        const allTeamsOperationalKpiQuarterlyData = {
            'Technical Team': technicalOperationalKpiQuarterlyData,
            'Accounting Team': accountingOperationalKpiQuarterlyData,
            'LRAD Team': lradOperationalKpiQuarterlyData,
            'Quality Team': qualityOperationalKpiQuarterlyData,
            'DC Team': dcOperationalKpiQuarterlyData,
            'IT Team': itOperationalKpiQuarterlyData,
            'Opportunity Team': opportunityOperationalKpiQuarterlyData,
            'Marcom Team': marcomOperationalKpiQuarterlyData,
            'Audit Team': auditOperationalKpiQuarterlyData,
            'Gathering Team': gatheringOperationalKpiQuarterlyData,
            'Operations Team': operationsOperationalKpiQuarterlyData
        };

        const technicalMonthlySeries = {
            'FS Target : Repairs & Maintenance (Labor) (TECHNICAL) Expense': generateMonthlySeries({
                targetRange: [120000, 135000],
                actualRange: [112000, 132000],
                valueType: 'thousands'
            }),
            'FS Target : Repairs & Maintenance (Materials) (TECHNICAL) Expense': generateMonthlySeries({
                targetRange: [85000, 95000],
                actualRange: [82000, 93000],
                valueType: 'thousands'
            }),
            '# of Breakdowns : Engineering Department': generateMonthlySeries({
                targetRange: [4, 6],
                actualRange: [2, 5],
                valueType: 'count'
            }),
            '% Predictive Maintenance Compliance': generateMonthlySeries({
                targetRange: [94, 97],
                actualRange: [92, 99],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Emergency Response Within SLA': generateMonthlySeries({
                targetRange: [90, 95],
                actualRange: [88, 97],
                decimals: 1,
                valueType: 'percentage'
            })
        };

        const accountingMonthlySeries = {
            'FS Target : Total Operating Expense': generateMonthlySeries({
                targetRange: [22000000, 24000000],
                actualRange: [21000000, 23500000],
                valueType: 'thousands'
            }),
            'FS Target : Total Gross Revenue': generateMonthlySeries({
                targetRange: [36000000, 38000000],
                actualRange: [37000000, 39500000],
                valueType: 'thousands'
            }),
            'FS Target : Net Profit': generateMonthlySeries({
                targetRange: [10000000, 11000000],
                actualRange: [10500000, 12000000],
                valueType: 'thousands'
            }),
            '% Collection : All Sites': generateMonthlySeries({
                targetRange: [85, 90],
                actualRange: [88, 95],
                decimals: 1,
                valueType: 'percentage'
            })
        };

        const lradMonthlySeries = {
            'FS Target : Salary Expense': generateMonthlySeries({
                targetRange: [1800000, 1900000],
                actualRange: [1700000, 1850000],
                valueType: 'thousands'
            })
        };

        const dcMonthlySeries = {
            'FS Target : Repairs & Maintenance (Labor) (DCD) Expense': generateMonthlySeries({
                targetRange: [140000, 150000],
                actualRange: [135000, 145000],
                valueType: 'thousands'
            }),
            'FS Target : Repairs & Maintenance (Materials) (DCD) Expense': generateMonthlySeries({
                targetRange: [95000, 100000],
                actualRange: [90000, 105000],
                valueType: 'thousands'
            })
        };

        const opportunityMonthlySeries = {
            '% Occupancy: Commercial (Units)': generateMonthlySeries({
                targetRange: [85, 90],
                actualRange: [87, 92],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Occupancy: Commercial (Area)': generateMonthlySeries({
                targetRange: [83, 88],
                actualRange: [85, 90],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Occupancy: Commercial (PValue)': generateMonthlySeries({
                targetRange: [80, 85],
                actualRange: [82, 87],
                decimals: 1,
                valueType: 'percentage'
            }),
            'FS Target : Rental Income': generateMonthlySeries({
                targetRange: [12000000, 13000000],
                actualRange: [12500000, 13500000],
                valueType: 'thousands'
            })
        };

        const marcomMonthlySeries = {
            'FS Target : Marketing Expense (+Gifts & Decor) (MARCOM)': generateMonthlySeries({
                targetRange: [800000, 900000],
                actualRange: [750000, 850000],
                valueType: 'thousands'
            })
        };

        const gatheringMonthlySeries = {
            '% Occupancy: Venue (Hours)': generateMonthlySeries({
                targetRange: [73, 78],
                actualRange: [75, 80],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Occupancy: Venue (PValue)': generateMonthlySeries({
                targetRange: [70, 75],
                actualRange: [72, 78],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Occupancy: Studio (Hours)': generateMonthlySeries({
                targetRange: [66, 71],
                actualRange: [68, 73],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Occupancy: Studio (PValue)': generateMonthlySeries({
                targetRange: [63, 68],
                actualRange: [65, 70],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Occupancy: Sports Arena (Hours)': generateMonthlySeries({
                targetRange: [78, 83],
                actualRange: [80, 85],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Occupancy: Sports Arena (PValue)': generateMonthlySeries({
                targetRange: [75, 80],
                actualRange: [77, 82],
                decimals: 1,
                valueType: 'percentage'
            }),
            'FS Target : Marketing Expense (+Gifts & Decor) (GATHERING)': generateMonthlySeries({
                targetRange: [600000, 700000],
                actualRange: [580000, 680000],
                valueType: 'thousands'
            })
        };

        const operationsMonthlySeries = {
            'FS Target : Electricity Expense': generateMonthlySeries({
                targetRange: [1200000, 1300000],
                actualRange: [1150000, 1250000],
                valueType: 'thousands'
            }),
            'FS Target : Water Expense': generateMonthlySeries({
                targetRange: [430000, 470000],
                actualRange: [410000, 450000],
                valueType: 'thousands'
            }),
            'FS Target : Security Expense': generateMonthlySeries({
                targetRange: [820000, 880000],
                actualRange: [800000, 860000],
                valueType: 'thousands'
            }),
            'FS Target : Agency Expense': generateMonthlySeries({
                targetRange: [300000, 340000],
                actualRange: [280000, 320000],
                valueType: 'thousands'
            }),
            'FS Target : Parking Income': generateMonthlySeries({
                targetRange: [2700000, 2900000],
                actualRange: [2800000, 3000000],
                valueType: 'thousands'
            })
        };
                
        // Lead KPI Monthly Series
        const lradLeadMonthlySeries = {
            '% On time & Accurate - LMDB': generateMonthlySeries({
                targetRange: [93, 97],
                actualRange: [95, 99],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% On time & Accurate - Recorded: Scores (KPI)': generateMonthlySeries({
                targetRange: [90, 94],
                actualRange: [92, 96],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% On time & Accurate - Recorded: Stories': generateMonthlySeries({
                targetRange: [86, 90],
                actualRange: [88, 93],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Planned vs Actual - Regular Events Plan: Lotuszen': generateMonthlySeries({
                targetRange: [83, 87],
                actualRange: [85, 89],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Planned vs Actual - Culture Dev\'t Activities Plan: Lotuszen': generateMonthlySeries({
                targetRange: [88, 92],
                actualRange: [90, 94],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Complete & Updated : LMDB': generateMonthlySeries({
                targetRange: [91, 95],
                actualRange: [93, 97],
                decimals: 1,
                valueType: 'percentage'
            })
        };

        const qualityLeadMonthlySeries = {
            'Score/Evaluation/NPS : SMD Projects': generateMonthlySeries({
                targetRange: [85, 89],
                actualRange: [87, 93],
                decimals: 1,
                valueType: 'percentage'
            }),
            'Score/Evaluation/NPS : SID Projects': generateMonthlySeries({
                targetRange: [82, 86],
                actualRange: [84, 90],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Planned vs Actual : SMD Projects': generateMonthlySeries({
                targetRange: [90, 94],
                actualRange: [92, 97],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Planned vs Actual : SID Projects': generateMonthlySeries({
                targetRange: [87, 91],
                actualRange: [89, 94],
                decimals: 1,
                valueType: 'percentage'
            })
        };

        const dcLeadMonthlySeries = {
            '% Within Budget : Projects (E&D)': generateMonthlySeries({
                targetRange: [92, 96],
                actualRange: [94, 98],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Within Budget : Projects (IP)': generateMonthlySeries({
                targetRange: [89, 93],
                actualRange: [91, 95],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Within Budget : Projects (PMR)': generateMonthlySeries({
                targetRange: [86, 90],
                actualRange: [88, 92],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Within Budget : Projects (Construction)': generateMonthlySeries({
                targetRange: [90, 94],
                actualRange: [92, 96],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Within Budget : Projects (Landscape)': generateMonthlySeries({
                targetRange: [87, 91],
                actualRange: [89, 93],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Planned vs Actual : Projects (E&D)': generateMonthlySeries({
                targetRange: [85, 89],
                actualRange: [87, 91],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Planned vs Actual : Projects (IP)': generateMonthlySeries({
                targetRange: [83, 87],
                actualRange: [85, 89],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Planned vs Actual : Projects (PMR)': generateMonthlySeries({
                targetRange: [81, 85],
                actualRange: [83, 87],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Planned vs Actual : Projects (Construction)': generateMonthlySeries({
                targetRange: [84, 88],
                actualRange: [86, 90],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Planned vs Actual : Projects (Landscape)': generateMonthlySeries({
                targetRange: [82, 86],
                actualRange: [84, 88],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Planned vs Actual : JO (MST)': generateMonthlySeries({
                targetRange: [88, 92],
                actualRange: [90, 94],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Planned vs Actual : JO (E&D Fab)': generateMonthlySeries({
                targetRange: [86, 90],
                actualRange: [88, 92],
                decimals: 1,
                valueType: 'percentage'
            })
        };

        const itLeadMonthlySeries = {
            '# of Breakdowns : IT': generateMonthlySeries({
                targetRange: [6, 10],
                actualRange: [3, 8],
                valueType: 'count'
            })
        };

        const opportunityLeadMonthlySeries = {
            '% Planned vs Actual - Tenant Mix Plan': generateMonthlySeries({
                targetRange: [88, 92],
                actualRange: [90, 94],
                decimals: 1,
                valueType: 'percentage'
            }),
            '# of Closed Inquiry/Offline Inquiries Received: Commercial': generateMonthlySeries({
                targetRange: [40, 50],
                actualRange: [45, 55],
                valueType: 'count'
            }),
            '# of Closed Prospects/Target Prospects: (Commercial) Anchor': generateMonthlySeries({
                targetRange: [6, 10],
                actualRange: [8, 12],
                valueType: 'count'
            }),
            '# of Closed Prospects/Priority Vacant Spaces: Anchor': generateMonthlySeries({
                targetRange: [4, 7],
                actualRange: [5, 8],
                valueType: 'count'
            }),
            '# of Closed Prospects/Target Prospects: (Commercial) Regular': generateMonthlySeries({
                targetRange: [12, 18],
                actualRange: [15, 20],
                valueType: 'count'
            }),
            '# of Closed Prospects/Priority Vacant Spaces: Regular': generateMonthlySeries({
                targetRange: [10, 15],
                actualRange: [12, 17],
                valueType: 'count'
            }),
            '% Complete & Updated: Tenant Requirements': generateMonthlySeries({
                targetRange: [93, 97],
                actualRange: [95, 99],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Pull Out - Aversion': generateMonthlySeries({
                targetRange: [86, 90],
                actualRange: [88, 92],
                decimals: 1,
                valueType: 'percentage'
            })
        };

        const marcomLeadMonthlySeries = {
            '% Increase : Facebook Page Reach (per Month per Page)': generateMonthlySeries({
                targetRange: [10, 15],
                actualRange: [12, 18],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Increase : Facebook Page Followers (per Month per Page)': generateMonthlySeries({
                targetRange: [6, 10],
                actualRange: [8, 12],
                decimals: 1,
                valueType: 'percentage'
            }),
            '# of Inquiries : Offline for (Commercial Spaces)': generateMonthlySeries({
                targetRange: [20, 30],
                actualRange: [25, 35],
                valueType: 'count'
            }),
            '# of Inquiries : Offline for Gatherings (Event Venues)': generateMonthlySeries({
                targetRange: [15, 22],
                actualRange: [18, 25],
                valueType: 'count'
            }),
            '# of Inquiries : Offline for Gatherings (Sports Arena)': generateMonthlySeries({
                targetRange: [10, 15],
                actualRange: [12, 18],
                valueType: 'count'
            }),
            '# of Inquiries : Offline for Gatherings (Handaan)': generateMonthlySeries({
                targetRange: [18, 25],
                actualRange: [20, 28],
                valueType: 'count'
            }),
            '# of Inquiries : Offline for Gatherings (SS)': generateMonthlySeries({
                targetRange: [12, 18],
                actualRange: [15, 21],
                valueType: 'count'
            }),
            '# of Inquiries : Offline for Gatherings (KS)': generateMonthlySeries({
                targetRange: [8, 12],
                actualRange: [10, 15],
                valueType: 'count'
            }),
            '# of Inquiries : Offline for Gatherings (Studio)': generateMonthlySeries({
                targetRange: [6, 10],
                actualRange: [8, 13],
                valueType: 'count'
            })
        };

        const auditLeadMonthlySeries = {
            '% Addressed : I.C.A.R.E (All Teams)': generateMonthlySeries({
                targetRange: [93, 97],
                actualRange: [95, 99],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% On time & Accurate : PropMan Module': generateMonthlySeries({
                targetRange: [90, 94],
                actualRange: [92, 96],
                decimals: 1,
                valueType: 'percentage'
            })
        };

        const gatheringLeadMonthlySeries = {
            '# of Average Daily Foot Traffic': generateMonthlySeries({
                targetRange: [400, 500],
                actualRange: [450, 550],
                valueType: 'count'
            }),
            '# of 500 pax or more Event/month (All Sites)': generateMonthlySeries({
                targetRange: [6, 10],
                actualRange: [8, 12],
                valueType: 'count'
            }),
            '# of Closed Inquiry/Offline Inquiries Received: Gathering': generateMonthlySeries({
                targetRange: [30, 40],
                actualRange: [35, 45],
                valueType: 'count'
            })
        };

        const operationsLeadMonthlySeries = {
            '% Addressed : Team/Section\'s I.C.A.R.E': generateMonthlySeries({
                targetRange: [94, 98],
                actualRange: [96, 99],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Score : Site Quality (by Auditor)': generateMonthlySeries({
                targetRange: [88, 92],
                actualRange: [90, 94],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Insurance Claimed vs Reported': generateMonthlySeries({
                targetRange: [83, 87],
                actualRange: [85, 90],
                decimals: 1,
                valueType: 'percentage'
            }),
            '% Onboarded Tenants : All Tenants/Reserved (New + Existing)': generateMonthlySeries({
                targetRange: [86, 90],
                actualRange: [88, 93],
                decimals: 1,
                valueType: 'percentage'
            })
        };

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

        const technicalExpensesData = {
            'Technical Team': generateTechnicalLagKpiData(),
            'Accounting Team': generateAccountingLagKpiData(),
            'LRAD Team': generateLradLagKpiData(),
            'DC Team': generateDcLagKpiData(),
            'Opportunity Team': generateOpportunityLagKpiData(),
            'Marcom Team': generateMarcomLagKpiData(),
            'Gathering Team': generateGatheringLagKpiData(),
            'Operations Team': generateOperationsLagKpiData()
        };

        // Lead KPI data by period (year-month)

        const leadKpiExpensesData = {
            'Technical Team': generateTechnicalLeadKpiData(),
            'LRAD Team': generateLradLeadKpiData(),
            'Quality Team': generateQualityLeadKpiData(),
            'DC Team': generateDcLeadKpiData(),
            'IT Team': generateItLeadKpiData(),
            'Opportunity Team': generateOpportunityLeadKpiData(),
            'Marcom Team': generateMarcomLeadKpiData(),
            'Audit Team': generateAuditLeadKpiData(),
            'Gathering Team': generateGatheringLeadKpiData(),
            'Operations Team': generateOperationsLeadKpiData()
        };

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
        let currentOperationsView = 'leaders';
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

        function ensureChartWrapperVisible() {
            const chartWrapper = document.querySelector('.chart-wrapper');
            if (chartWrapper) {
                chartWrapper.style.display = '';
            }
        }

        // Function to reset the right container (reports section) to blank state
        function resetReportsSection(targetView = null) {
            const reportCard = document.querySelector('.performance-report-card');
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportTitle = reportCard?.querySelector('.report-title');
            const reportSubtitle = reportCard?.querySelector('.report-card-subtitle');
            const reportLegend = reportCard?.querySelector('.report-legend');
            const yAxisLabel = reportCard?.querySelector('.y-axis-label');
            
            // Determine which view we're in (use parameter or current view)
            const view = targetView || currentOperationsView;
            const isMembersView = view === 'members';
            
            // Hide quarter-filter-container and chart-wrapper when switching to critical numbers section
            if (!isMembersView) {
                const quarterFilter = document.querySelector('.quarter-filter-container');
                const chartWrapper = document.querySelector('.chart-wrapper');
                if (quarterFilter) {
                    quarterFilter.style.display = 'none';
                }
                if (chartWrapper) {
                    chartWrapper.style.display = 'none';
                }
            }
            
            // Destroy any existing Chart.js instance before clearing
            try {
                if (typeof teamPerformanceChart !== 'undefined' && teamPerformanceChart !== null) {
                    teamPerformanceChart.destroy();
                    teamPerformanceChart = null;
                }
            } catch (e) {
                // Chart instance may not be initialized yet, which is fine
                console.debug('Chart instance not available for destruction:', e);
            }
            
            // Clear chart container - remove both canvas and SVG charts
            if (chartContainer) {
                chartContainer.innerHTML = '';
            }
            
            // Reset title based on section
            if (reportTitle) {
                if (isMembersView) {
                    reportTitle.innerHTML = 'Team Section';
                } else {
                    reportTitle.innerHTML = 'Critical Number Section';
                }
            }
            
            // Reset subtitle with graph icon based on section
            if (reportSubtitle) {
                if (isMembersView) {
                    reportSubtitle.innerHTML = 'Click a team member to view a graph <span style="display: block; margin-top: 8px; font-size: 24px;"></span>';
                } else {
                    reportSubtitle.innerHTML = 'Click a KPI to view a graph <span style="display: block; margin-top: 8px; font-size: 24px;"></span>';
                }
            }
            
            // Hide legend and y-axis label
            if (reportLegend) {
                reportLegend.style.display = 'none';
            }
            if (yAxisLabel) {
                yAxisLabel.style.display = 'none';
            }
            
            // Clear any chart insight
            const insightElement = document.getElementById('teamPerformanceInsight');
            if (insightElement) {
                insightElement.textContent = 'Loading insight…';
            }
        }

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

                    const target = button.dataset.target === 'members' ? 'members' : 'leaders';
                    if (currentOperationsView === target) {
                        return;
                    }

                    // Reset the right container (reports section) when switching between sections
                    resetReportsSection(target);

                    // If switching to members view and section switch is on profile (active), switch back to operations
                    if (target === 'members' && currentView === 'profile') {
                        toggleSections();
                    }

                    currentOperationsView = target;
                    refreshOperationsContent();
                    updateScoreboardToggleState();
                    updateTeamMembersMiniContainer();
                });
            });

            updateScoreboardToggleState();
        }

        function updateScoreboardToggleState() {
            if (!scoreboardToggleButtons.length) {
                return;
            }

            scoreboardToggleButtons.forEach(button => {
                const target = button.dataset.target === 'members' ? 'members' : 'leaders';
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
                    // Reset chart visuals when switching back to operations
                    resetTeamPerformanceVisuals({
                        infoMessage: 'Select a KPI to view its target vs actual details.'
                    });
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
                    // Reset chart visuals when switching to profile
                    resetTeamPerformanceVisuals({
                        infoMessage: 'Select a KPI to view its target vs actual details.'
                    });
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

        // Function to attach team leader selection functionality
        function attachLeaderCardHandlers() {
            const leaderCards = document.querySelectorAll('.leader-card:not([data-handlers-attached])');
            
            leaderCards.forEach(card => {
                card.setAttribute('data-handlers-attached', 'true');
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');

                card.addEventListener('click', function() {
                    const allCards = document.querySelectorAll('.leader-card');
                    allCards.forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    
                    selectedTeam = normalizeTeamName(this.getAttribute('data-team'));
                    selectedTeamData = {
                        name: this.getAttribute('data-name'),
                        title: this.getAttribute('data-title'),
                        roles: this.getAttribute('data-roles'),
                        contributions: this.getAttribute('data-contributions'),
                        icon: this.getAttribute('data-icon')
                    };

                    refreshOperationsContent();
                    updateLeadKpiSection(selectedTeam, selectedTeamData.title);
                    updateTeamMembersMiniContainer();
                });

                card.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        this.click();
                    }
                });
            });
        }

        // Initial attachment (will be called again after rendering cards)
        attachLeaderCardHandlers();

        // Helper function to calculate performance for a team member based on their KRAs
        function calculateMemberPerformance(teamName, roleTitle, kras, roleOwners, periodKey) {
            const memberName = roleOwners[roleTitle] || roleTitle;
            
            // Calculate overall performance across all KRAs
            let totalWeightedPerformance = 0;
            let totalWeight = 0;
            const defaultPeriodKey = '2025-11';
            
            kras.forEach(kraData => {
                if (kraData.kpis && kraData.kpis.length > 0) {
                    kraData.kpis.forEach(kpiItem => {
                        // Parse weight
                        let weight = 0;
                        if (kpiItem.weight && kpiItem.weight !== '-') {
                            const weightStr = String(kpiItem.weight).replace(/%/g, '').replace(/,/g, '').trim();
                            weight = parseFloat(weightStr) || 0;
                        }
                        
                        if (weight > 0) {
                            // Get actual and target from period data
                            // Try current period first, then default period as fallback
                            const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey] || 
                                              technicalExpensesData[teamName]?.[kpiItem.kpi]?.[defaultPeriodKey] ||
                                              leadKpiExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey] ||
                                              leadKpiExpensesData[teamName]?.[kpiItem.kpi]?.[defaultPeriodKey];
                            
                            const actualNumeric = periodData ? periodData.actual : null;
                            
                            // Parse target
                            let targetNumeric = null;
                            if (kpiItem.target && kpiItem.target !== '-') {
                                targetNumeric = parseNumericValue(kpiItem.target);
                            }
                            
                            // Calculate performance for this KPI
                            if (targetNumeric !== null && !isNaN(targetNumeric) && targetNumeric > 0 && 
                                actualNumeric !== null && !isNaN(actualNumeric)) {
                                // Calculate performance: (actual / target) * 100
                                const kpiPerformance = (actualNumeric / targetNumeric) * 100;
                                // Cap at 100% for display
                                const cappedPerformance = Math.min(100, Math.max(0, kpiPerformance));
                                
                                // Add weighted performance
                                totalWeightedPerformance += cappedPerformance * weight;
                                totalWeight += weight;
                            } else if (actualNumeric !== null && !isNaN(actualNumeric)) {
                                // If no target but have actual, use actual directly (capped at 100)
                                const cappedPerformance = Math.min(100, Math.max(0, actualNumeric));
                                totalWeightedPerformance += cappedPerformance * weight;
                                totalWeight += weight;
                            } else if (targetNumeric !== null && !isNaN(targetNumeric) && targetNumeric > 0) {
                                // If we have a target but no actual, assume 0% performance for this KPI
                                // This ensures we still count the weight but with 0 performance
                                totalWeight += weight;
                            }
                        }
                    });
                }
            });
            
            // Calculate overall percentage
            let progressPercentage = 45; // Default fallback
            if (totalWeight > 0) {
                progressPercentage = totalWeightedPerformance / totalWeight;
                // Ensure it's between 0 and 100
                progressPercentage = Math.min(100, Math.max(0, progressPercentage));
            }
            
            return {
                name: memberName,
                role: roleTitle,
                progressPercentage: progressPercentage
            };
        }

        // Function to update team members mini container
        function updateTeamMembersMiniContainer() {
            const container = document.getElementById('teamMembersMiniContainer');
            if (!container) {
                return;
            }

            // Only show if "Team Members" view is active and a team is selected
            if (currentOperationsView === 'members' && selectedTeam) {
                let members = [];
                const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
                
                // Map of teams to their data structures
                const teamDataMap = {
                    'Technical Team': { data: technicalTeamByOwner, roleOwners: technicalTeamRoleOwners },
                    'Accounting Team': { data: accountingTeamByOwner, roleOwners: accountingTeamRoleOwners },
                    'LRAD Team': { data: lradTeamByOwner, roleOwners: lradTeamRoleOwners },
                    'Quality Team': { data: qualityTeamByOwner, roleOwners: qualityTeamRoleOwners },
                    'DC Team': { data: dcTeamByOwner, roleOwners: dcTeamRoleOwners },
                    'Opportunity Team': { data: opportunityTeamByOwner, roleOwners: opportunityTeamRoleOwners },
                    'IT Team': { data: itTeamByOwner, roleOwners: itTeamRoleOwners },
                    'Marcom Team': { data: marcomTeamByOwner, roleOwners: marcomTeamRoleOwners },
                    'Operations Team': { data: operationsTeamByOwner, roleOwners: operationsTeamRoleOwners },
                    'Audit Team': { data: auditTeamByOwner, roleOwners: auditTeamRoleOwners },
                    'Gathering Team': { data: gatheringTeamByOwner, roleOwners: gatheringTeamRoleOwners }
                };
                
                // Check if this team has a ByOwner structure
                const teamConfig = teamDataMap[selectedTeam];
                if (teamConfig && teamConfig.data[selectedTeam]) {
                    const teamData = teamConfig.data[selectedTeam];
                    const roleOwners = teamConfig.roleOwners[selectedTeam] || {};
                    const owners = Object.keys(teamData);
                    
                    owners.forEach(roleTitle => {
                        const kras = teamData[roleTitle] || [];
                        const member = calculateMemberPerformance(selectedTeam, roleTitle, kras, roleOwners, periodKey);
                        members.push(member);
                    });
                } else {
                    // For other teams, use teamMembersData
                    const teamMembers = teamMembersData[selectedTeam] || [];
                    
                    teamMembers.forEach(member => {
                        // Calculate progress percentage based on actual vs target
                        let progressPercentage = 45; // Default fallback
                        
                        if (member.targetValue !== undefined && member.actualValue !== undefined) {
                            const target = typeof member.targetValue === 'number' ? member.targetValue : parseFloat(member.targetValue);
                            const actual = typeof member.actualValue === 'number' ? member.actualValue : parseFloat(member.actualValue);
                            
                            if (!isNaN(target) && !isNaN(actual) && target > 0) {
                                // Calculate percentage: (actual / target) * 100
                                // Cap at 100% for display purposes
                                progressPercentage = Math.min(100, Math.max(0, (actual / target) * 100));
                            } else if (!isNaN(actual) && isNaN(target)) {
                                // If only actual is available, use it directly (capped at 100)
                                progressPercentage = Math.min(100, Math.max(0, actual));
                            }
                        }
                        
                        members.push({
                            name: member.name,
                            role: member.role,
                            progressPercentage: progressPercentage
                        });
                    });
                }
                
                if (members.length === 0) {
                    container.classList.remove('show');
                    return;
                }

                // Add class based on member count for centering
                const memberCount = members.length;
                let listClass = 'team-members-mini-list';
                if (memberCount === 1) {
                    listClass += ' centered-single';
                } else if (memberCount === 2) {
                    listClass += ' centered-double';
                }
                
                let html = `<div class="${listClass}">`;
                
                members.forEach(member => {
                    // Generate initials for icon placeholder
                    const initials = generateInitials(member.name);
                    const progressPercentage = member.progressPercentage !== undefined ? member.progressPercentage : 45;
                    const roundedPercentage = Math.round(progressPercentage);

                    html += `
                        <div class="team-member-mini-item">
                            <div class="team-member-mini-icon">${initials}</div>
                            <div class="team-member-mini-name">${member.name}</div>
                            <div class="team-member-mini-progress-wrapper">
                                <div class="team-member-mini-percentage">${roundedPercentage}%</div>
                            </div>
                        </div>
                    `;
                });

                html += '</div>';
                container.innerHTML = html;
                container.classList.add('show');
            } else {
                container.classList.remove('show');
            }
        }

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
                    <div>
                        <div class="target">TARGET</div>
                    </div>
                    <div>
                        <div>ACTUAL</div>
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

        // Function to update KRA row data and replace loading indicators
        function updateKraRowData(teamName, periodKey) {
            const kraRows = document.querySelectorAll('.kra-row-item[data-loading="true"]');
            
            kraRows.forEach(kraRow => {
                const loadingWrapper = kraRow.querySelector('.loading-indicator-wrapper');
                
                if (!loadingWrapper) return;
                
                // Get data attributes
                const targetStr = kraRow.getAttribute('data-target');
                const actualStr = kraRow.getAttribute('data-actual');
                const target = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                const actual = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                
                // Step 1: Show loading spinner for 1.5 seconds
                // (Already showing, so we wait)
                
                // Step 2: After 1.5 seconds, show check icon
                setTimeout(() => {
                    loadingWrapper.innerHTML = `
                        <span class="check-icon">✓</span>
                        <span class="check-text">Data loaded</span>
                    `;
                    loadingWrapper.classList.add('check-visible');
                    
                    // Step 3: After check icon shows (0.5s), hide it and show "--"
                    setTimeout(() => {
                        loadingWrapper.style.display = 'none';
                        const parentDiv = loadingWrapper.parentElement;
                        if (parentDiv) {
                            parentDiv.innerHTML = '--';
                        }
                        
                        // Remove loading attribute
                        kraRow.removeAttribute('data-loading');
                    }, 500); // Show check icon for 0.5 seconds
                }, 1500); // Show loading for 1.5 seconds
            });
        }

        async function updateTeamMembersSection(teamName, teamTitle) {
            const operationsContent = document.getElementById('operationsContent');
            if (!operationsContent) {
                return;
            }
            
            // START OF TECHNICAL TEAM GRAPH CODE
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
                    // Primary header (no Operational KRA here)
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>
                                <div class="target">TOTAL TARGET</div>
                            </div>
                            <div>
                                <div>TOTAL ACTUAL</div>
                            </div>
                            <div>%KPI</div>
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
                    const roleOwner = roleOwners[owner] || '--';
                    
                    // Check if this owner has any KRAs with KPIs
                    const hasAnyKras = kras && kras.length > 0;
                    const hasDropdown = hasAnyKras;
                    const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                    
                    // Calculate totals across all KRAs for this role title
                    let totalWeight = 0;
                    let totalTarget = 0;
                    let totalActual = 0;
                    
                    kras.forEach(kraData => {
                        if (kraData.kpis && kraData.kpis.length > 0) {
                            const kraWeight = kraData.kpis.reduce((sum, kpi) => {
                                let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '--') {
                                    const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                    weightValue = parseFloat(weightStr) || 0;
                                }
                                return sum + weightValue;
                            }, 0);
                            totalWeight += kraWeight;
                            
                            // Calculate target and actual for this KRA
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            totalTarget += kraTarget;
                            totalActual += kraActual;
                        }
                    });
                    
                    // Create one row per role title (owner)
                    html += `
                        <div class="member-row technical-team-kra-row ${dropdownClass}" 
                             data-name="${owner.toLowerCase()}" 
                             data-team="${teamName.toLowerCase()}" 
                             data-index="${globalIndex}"
                             data-owner="${escapeAttributeValue(owner)}"
                             data-target="${totalTarget}"
                             data-actual="${totalActual}"
                             data-weight="${totalWeight}"
                             style="cursor: pointer;">
                            <div>${roleOwner}</div>
                            <div class="member-info">
                                <div class="member-name">${owner}</div>
                            </div>
                            <div class="target-group">
                                <div>${totalTarget}</div>
                            </div>
                            <div class="actual-group">
                                <div>${totalActual}</div>
                            </div>
                            <div>--</div>
                            <div>${hasDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                        </div>
                    `;
                    
                    // Add first-level dropdown content with Operational KRAs
                    if (hasDropdown) {
                        const roleTitleIndex = globalIndex;
                        html += `
                            <div class="sub-operations" id="dropdown-${roleTitleIndex}">
                                <div class="sub-operations-header">
                                    <div>Operational KRA</div>
                                    <div>Operational KPI</div>
                                    <div>
                                        <div class="target">TARGET</div>
                                    </div>
                                    <div>
                                        <div>ACTUAL</div>
                                    </div>
                                    <div>%KPI</div>
                                </div>
                        `;
                        
                        // Create a row for each KRA with nested dropdown for KPIs
                        kras.forEach((kraData, kraIndex) => {
                            const hasKpiDropdown = kraData.kpis && kraData.kpis.length > 0;
                            const kraDropdownClass = hasKpiDropdown ? 'has-dropdown' : '';
                            
                            // Calculate KRA totals
                            const kraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                                let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '-') {
                                    const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                    weightValue = parseFloat(weightStr) || 0;
                                }
                                return sum + weightValue;
                            }, 0) : 0;
                            
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            
                            const kraRowIndex = globalIndex + 1000 + kraIndex; // Use offset to avoid conflicts
                            
                            // Check if we need to fetch data for this KRA
                            const needsDataFetch = true; // Set to true initially to show loading
                            
                            html += `
                                <div class="sub-operation-item kra-row-item ${kraDropdownClass}" 
                                     data-kra="${escapeAttributeValue(kraData.kra)}"
                                     data-index="${kraRowIndex}"
                                     data-target="${kraTarget}"
                                     data-actual="${kraActual}"
                                     data-weight="${kraWeight}"
                                     data-loading="true"
                                     style="cursor: pointer;">
                                    <div class="sub-operation-kra">${kraData.kra}</div>
                                    <div>
                                        <div class="loading-indicator-wrapper">
                                            <span class="loading-spinner"></span>
                                            <span class="loading-text">Fetching data...</span>
                                        </div>
                                    </div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>${hasKpiDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                                </div>
                            `;
                            
                            // Add nested dropdown for KPIs under this KRA
                            if (hasKpiDropdown) {
                                html += `
                                    <div class="sub-operations nested-kpi-dropdown" id="dropdown-${kraRowIndex}">
                                `;
                                
                                kraData.kpis.forEach((kpiItem, kpiIndex) => {
                                    // Get actual value from period data if available
                                    const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                    const actualNumeric = periodData ? periodData.actual : null;
                                    const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                    
                                    // Parse target for data attribute first (before formatting)
                                    let targetNumericForData = null;
                                    if (kpiItem.target && kpiItem.target !== '--') {
                                        targetNumericForData = parseNumericValue(kpiItem.target);
                                    }
                                    
                                    // Format target value for display
                                    let targetDisplay = kpiItem.target || '--';
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
                                    let actualDisplay = '--';
                                    if (actualNumeric !== null) {
                                        actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                    }
                                    
                                    html += `
                                        <div class="sub-operation-item kpi-item" 
                                             data-kpi="${kpiItem.kpi}"
                                             data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                             data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                            <div class="sub-operation-label">${kpiItem.kpi}</div>
                                            <div class="target-group">
                                                <div><span class="target-badge">${targetDisplay}</span></div>
                                            </div>
                                            <div class="actual-group">
                                                <div><span class="actual-badge">${actualDisplay}</span></div>
                                            </div>
                                            <div><span class="weight-badge">${kpiItem.weight || '--'}</span></div>
                                        </div>
                                    `;
                                });
                                
                                html += `</div>`;
                            }
                        });
                        
                        html += `</div>`;
                    }
                    
                    globalIndex++;
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('technical-team-view');
                
                // Update loading indicators with actual data
                updateKraRowData(teamName, periodKey);
                
                attachSearchFunctionality();
                attachDropdownFunctionality(teamName);
                attachMemberRowClickHandlers();
                return;
            }
            // END OF TECHNICAL TEAM GRAPH CODE
            
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
                    // Primary header (no Operational KRA here)
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>
                                <div class="target">TOTAL TARGET</div>
                            </div>
                            <div>
                                <div>TOTAL ACTUAL</div>
                            </div>
                            <div>%KPI</div>
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
                    const roleOwner = roleOwners[owner] || '--';
                    
                    // Check if this owner has any KRAs with KPIs
                    const hasAnyKras = kras && kras.length > 0;
                    const hasDropdown = hasAnyKras;
                        const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                        
                    // Calculate totals across all KRAs for this role title
                    let totalWeight = 0;
                    let totalTarget = 0;
                    let totalActual = 0;
                    
                    kras.forEach(kraData => {
                        if (kraData.kpis && kraData.kpis.length > 0) {
                            const kraWeight = kraData.kpis.reduce((sum, kpi) => {
                            let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '--') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                weightValue = parseFloat(weightStr) || 0;
                            }
                            return sum + weightValue;
                            }, 0);
                            totalWeight += kraWeight;
                            
                            // Calculate target and actual for this KRA
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            totalTarget += kraTarget;
                            totalActual += kraActual;
                        }
                    });
                    
                    // Create one row per role title (owner)
                        html += `
                            <div class="member-row accounting-team-kra-row ${dropdownClass}" 
                                 data-name="${owner.toLowerCase()}" 
                                 data-team="${teamName.toLowerCase()}" 
                                 data-index="${globalIndex}"
                                 data-owner="${escapeAttributeValue(owner)}"
                             data-target="${totalTarget}"
                             data-actual="${totalActual}"
                             data-weight="${totalWeight}"
                                 style="cursor: pointer;">
                                <div>${roleOwner}</div>
                                <div class="member-info">
                                    <div class="member-name">${owner}</div>
                                </div>
                                <div class="target-group">
                                <div>${totalTarget}</div>
                                </div>
                                <div class="actual-group">
                                <div>${totalActual}</div>
                                </div>
                            <div>--</div>
                                <div>${hasDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                            </div>
                        `;
                        
                    // Add first-level dropdown content with Operational KRAs
                        if (hasDropdown) {
                        const roleTitleIndex = globalIndex;
                            html += `
                            <div class="sub-operations" id="dropdown-${roleTitleIndex}">
                                <div class="sub-operations-header">
                                    <div>Operational KRA</div>
                                    <div>Operational KPI</div>
                                    <div>
                                        <div class="target">TARGET</div>
                                    </div>
                                    <div>
                                        <div>ACTUAL</div>
                                    </div>
                                    <div>%KPI</div>
                                </div>
                        `;
                        
                        // Create a row for each KRA with nested dropdown for KPIs
                        kras.forEach((kraData, kraIndex) => {
                            const hasKpiDropdown = kraData.kpis && kraData.kpis.length > 0;
                            const kraDropdownClass = hasKpiDropdown ? 'has-dropdown' : '';
                            
                            // Calculate KRA totals
                            const kraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                                let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '-') {
                                    const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                    weightValue = parseFloat(weightStr) || 0;
                                }
                                return sum + weightValue;
                            }, 0) : 0;
                            
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            
                            const kraRowIndex = globalIndex + 1000 + kraIndex; // Use offset to avoid conflicts
                            
                            // Check if we need to fetch data for this KRA
                            const needsDataFetch = true; // Set to true initially to show loading
                            
                            html += `
                                <div class="sub-operation-item kra-row-item ${kraDropdownClass}" 
                                     data-kra="${escapeAttributeValue(kraData.kra)}"
                                     data-index="${kraRowIndex}"
                                     data-target="${kraTarget}"
                                     data-actual="${kraActual}"
                                     data-weight="${kraWeight}"
                                     data-loading="true"
                                     style="cursor: pointer;">
                                    <div class="sub-operation-kra">${kraData.kra}</div>
                                    <div>
                                        <div class="loading-indicator-wrapper">
                                            <span class="loading-spinner"></span>
                                            <span class="loading-text">Fetching data...</span>
                                        </div>
                                    </div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>${hasKpiDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                                </div>
                            `;
                            
                            // Add nested dropdown for KPIs under this KRA
                            if (hasKpiDropdown) {
                                html += `
                                    <div class="sub-operations nested-kpi-dropdown" id="dropdown-${kraRowIndex}">
                                `;
                                
                                kraData.kpis.forEach((kpiItem, kpiIndex) => {
                                // Get actual value from period data if available
                                const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                const actualNumeric = periodData ? periodData.actual : null;
                                const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                
                                // Parse target for data attribute first (before formatting)
                                let targetNumericForData = null;
                                if (kpiItem.target && kpiItem.target !== '--') {
                                    targetNumericForData = parseNumericValue(kpiItem.target);
                                }
                                
                                // Format target value for display
                                let targetDisplay = kpiItem.target || '--';
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
                                let actualDisplay = '--';
                                if (actualNumeric !== null) {
                                    actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                }
                                
                                html += `
                                        <div class="sub-operation-item kpi-item" 
                                         data-kpi="${kpiItem.kpi}"
                                         data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                         data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                        <div class="sub-operation-label">${kpiItem.kpi}</div>
                                            <div class="target-group">
                                        <div><span class="target-badge">${targetDisplay}</span></div>
                                            </div>
                                            <div class="actual-group">
                                                <div><span class="actual-badge">${actualDisplay}</span></div>
                                            </div>
                                        <div><span class="weight-badge">${kpiItem.weight || '--'}</span></div>
                                    </div>
                                `;
                                });
                                
                                html += `</div>`;
                            }
                            });
                            
                            html += `</div>`;
                        }
                        
                        globalIndex++;
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('technical-team-view');
                operationsContent.classList.add('accounting-team-view');
                
                // Update loading indicators with actual data
                updateKraRowData(teamName, periodKey);
                
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
                    // Primary header (no Operational KRA here)
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>
                                <div class="target">TOTAL TARGET</div>
                            </div>
                            <div>
                                <div>TOTAL ACTUAL</div>
                            </div>
                            <div>%KPI</div>
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
                    const roleOwner = roleOwners[owner] || '--';
                    
                    // Check if this owner has any KRAs with KPIs
                    const hasAnyKras = kras && kras.length > 0;
                    const hasDropdown = hasAnyKras;
                        const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                        
                    // Calculate totals across all KRAs for this role title
                    let totalWeight = 0;
                    let totalTarget = 0;
                    let totalActual = 0;
                    
                    kras.forEach(kraData => {
                        if (kraData.kpis && kraData.kpis.length > 0) {
                            const kraWeight = kraData.kpis.reduce((sum, kpi) => {
                            let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '--') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                weightValue = parseFloat(weightStr) || 0;
                            }
                            return sum + weightValue;
                            }, 0);
                            totalWeight += kraWeight;
                            
                            // Calculate target and actual for this KRA
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            totalTarget += kraTarget;
                            totalActual += kraActual;
                        }
                    });
                    
                    // Create one row per role title (owner)
                        html += `
                            <div class="member-row lrad-team-kra-row ${dropdownClass}" 
                                 data-name="${owner.toLowerCase()}" 
                                 data-team="${teamName.toLowerCase()}" 
                                 data-index="${globalIndex}"
                                 data-owner="${escapeAttributeValue(owner)}"
                             data-target="${totalTarget}"
                             data-actual="${totalActual}"
                             data-weight="${totalWeight}"
                                 style="cursor: pointer;">
                                <div>${roleOwner}</div>
                                <div class="member-info">
                                    <div class="member-name">${owner}</div>
                                </div>
                                <div class="target-group">
                                <div>${totalTarget}</div>
                                </div>
                                <div class="actual-group">
                                <div>${totalActual}</div>
                                </div>
                            <div>--</div>
                            <div>${hasDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                            </div>
                        `;
                        
                    // Add first-level dropdown content with Operational KRAs
                        if (hasDropdown) {
                        const roleTitleIndex = globalIndex;
                            html += `
                            <div class="sub-operations" id="dropdown-${roleTitleIndex}">
                                <div class="sub-operations-header">
                                    <div>Operational KRA</div>
                                    <div>Operational KPI</div>
                                    <div>
                                        <div class="target">TARGET</div>
                                    </div>
                                    <div>
                                        <div>ACTUAL</div>
                                    </div>
                                    <div>%KPI</div>
                                </div>
                        `;
                        
                        // Create a row for each KRA with nested dropdown for KPIs
                        kras.forEach((kraData, kraIndex) => {
                            const hasKpiDropdown = kraData.kpis && kraData.kpis.length > 0;
                            const kraDropdownClass = hasKpiDropdown ? 'has-dropdown' : '';
                            
                            // Calculate KRA totals
                            const kraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                                let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '-') {
                                    const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                    weightValue = parseFloat(weightStr) || 0;
                                }
                                return sum + weightValue;
                            }, 0) : 0;
                            
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            
                            const kraRowIndex = globalIndex + 1000 + kraIndex; // Use offset to avoid conflicts
                            
                            // Check if we need to fetch data for this KRA
                            const needsDataFetch = true; // Set to true initially to show loading
                            
                            html += `
                                <div class="sub-operation-item kra-row-item ${kraDropdownClass}" 
                                     data-kra="${escapeAttributeValue(kraData.kra)}"
                                     data-index="${kraRowIndex}"
                                     data-target="${kraTarget}"
                                     data-actual="${kraActual}"
                                     data-weight="${kraWeight}"
                                     data-loading="true"
                                     style="cursor: pointer;">
                                    <div class="sub-operation-kra">${kraData.kra}</div>
                                    <div>
                                        <div class="loading-indicator-wrapper">
                                            <span class="loading-spinner"></span>
                                            <span class="loading-text">Fetching data...</span>
                                        </div>
                                    </div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>${hasKpiDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                                </div>
                            `;
                            
                            // Add nested dropdown for KPIs under this KRA
                            if (hasKpiDropdown) {
                                html += `
                                    <div class="sub-operations nested-kpi-dropdown" id="dropdown-${kraRowIndex}">
                                `;
                                
                                kraData.kpis.forEach((kpiItem, kpiIndex) => {
                                // Get actual value from period data if available
                                const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                const actualNumeric = periodData ? periodData.actual : null;
                                const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                
                                // Parse target for data attribute first (before formatting)
                                let targetNumericForData = null;
                                    if (kpiItem.target && kpiItem.target !== '--') {
                                    targetNumericForData = parseNumericValue(kpiItem.target);
                                }
                                
                                // Format target value for display
                                    let targetDisplay = kpiItem.target || '--';
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
                                    let actualDisplay = '--';
                                if (actualNumeric !== null) {
                                    actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                }
                                
                                html += `
                                        <div class="sub-operation-item kpi-item" 
                                         data-kpi="${kpiItem.kpi}"
                                         data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                         data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                        <div class="sub-operation-label">${kpiItem.kpi}</div>
                                            <div class="target-group">
                                        <div><span class="target-badge">${targetDisplay}</span></div>
                                            </div>
                                            <div class="actual-group">
                                                <div><span class="actual-badge">${actualDisplay}</span></div>
                                            </div>
                                            <div><span class="weight-badge">${kpiItem.weight || '--'}</span></div>
                                    </div>
                                `;
                                });
                                
                                html += `</div>`;
                            }
                            });
                            
                            html += `</div>`;
                        }
                        
                        globalIndex++;
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('technical-team-view');
                operationsContent.classList.add('lrad-team-view');
                
                // Update loading indicators with actual data
                updateKraRowData(teamName, periodKey);
                
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
                    // Primary header (no Operational KRA here)
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>
                                <div class="target">TOTAL TARGET</div>
                            </div>
                            <div>
                                <div>TOTAL ACTUAL</div>
                            </div>
                            <div>%KPI</div>
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
                    const roleOwner = roleOwners[owner] || '--';
                    
                    // Check if this owner has any KRAs with KPIs
                    const hasAnyKras = kras && kras.length > 0;
                    const hasDropdown = hasAnyKras;
                        const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                        
                    // Calculate totals across all KRAs for this role title
                    let totalWeight = 0;
                    let totalTarget = 0;
                    let totalActual = 0;
                    
                    kras.forEach(kraData => {
                        if (kraData.kpis && kraData.kpis.length > 0) {
                            const kraWeight = kraData.kpis.reduce((sum, kpi) => {
                            let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '--') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                weightValue = parseFloat(weightStr) || 0;
                            }
                            return sum + weightValue;
                            }, 0);
                            totalWeight += kraWeight;
                            
                            // Calculate target and actual for this KRA
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            totalTarget += kraTarget;
                            totalActual += kraActual;
                        }
                    });
                    
                    // Create one row per role title (owner)
                        html += `
                            <div class="member-row quality-team-kra-row ${dropdownClass}" 
                                 data-name="${owner.toLowerCase()}" 
                                 data-team="${teamName.toLowerCase()}" 
                                 data-index="${globalIndex}"
                                 data-owner="${escapeAttributeValue(owner)}"
                             data-target="${totalTarget}"
                             data-actual="${totalActual}"
                             data-weight="${totalWeight}"
                                 style="cursor: pointer;">
                                <div>${roleOwner}</div>
                                <div class="member-info">
                                    <div class="member-name">${owner}</div>
                                </div>
                                <div class="target-group">
                                <div>${totalTarget}</div>
                                </div>
                                <div class="actual-group">
                                <div>${totalActual}</div>
                                </div>
                            <div>--</div>
                            <div>${hasDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                            </div>
                        `;
                        
                    // Add first-level dropdown content with Operational KRAs
                        if (hasDropdown) {
                        const roleTitleIndex = globalIndex;
                            html += `
                            <div class="sub-operations" id="dropdown-${roleTitleIndex}">
                                <div class="sub-operations-header">
                                    <div>Operational KRA</div>
                                    <div>Operational KPI</div>
                                    <div>
                                        <div class="target">TARGET</div>
                                    </div>
                                    <div>
                                        <div>ACTUAL</div>
                                    </div>
                                    <div>%KPI</div>
                                </div>
                        `;
                        
                        // Create a row for each KRA with nested dropdown for KPIs
                        kras.forEach((kraData, kraIndex) => {
                            const hasKpiDropdown = kraData.kpis && kraData.kpis.length > 0;
                            const kraDropdownClass = hasKpiDropdown ? 'has-dropdown' : '';
                            
                            // Calculate KRA totals
                            const kraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                                let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '-') {
                                    const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                    weightValue = parseFloat(weightStr) || 0;
                                }
                                return sum + weightValue;
                            }, 0) : 0;
                            
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            
                            const kraRowIndex = globalIndex + 1000 + kraIndex; // Use offset to avoid conflicts
                            
                            // Check if we need to fetch data for this KRA
                            const needsDataFetch = true; // Set to true initially to show loading
                            
                            html += `
                                <div class="sub-operation-item kra-row-item ${kraDropdownClass}" 
                                     data-kra="${escapeAttributeValue(kraData.kra)}"
                                     data-index="${kraRowIndex}"
                                     data-target="${kraTarget}"
                                     data-actual="${kraActual}"
                                     data-weight="${kraWeight}"
                                     data-loading="true"
                                     style="cursor: pointer;">
                                    <div class="sub-operation-kra">${kraData.kra}</div>
                                    <div>
                                        <div class="loading-indicator-wrapper">
                                            <span class="loading-spinner"></span>
                                            <span class="loading-text">Fetching data...</span>
                                        </div>
                                    </div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>${hasKpiDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                                </div>
                            `;
                            
                            // Add nested dropdown for KPIs under this KRA
                            if (hasKpiDropdown) {
                                html += `
                                    <div class="sub-operations nested-kpi-dropdown" id="dropdown-${kraRowIndex}">
                                `;
                                
                                kraData.kpis.forEach((kpiItem, kpiIndex) => {
                                // Get actual value from period data if available
                                const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                const actualNumeric = periodData ? periodData.actual : null;
                                const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                
                                // Parse target for data attribute first (before formatting)
                                let targetNumericForData = null;
                                    if (kpiItem.target && kpiItem.target !== '--') {
                                    targetNumericForData = parseNumericValue(kpiItem.target);
                                }
                                
                                // Format target value for display
                                    let targetDisplay = kpiItem.target || '--';
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
                                    let actualDisplay = '--';
                                if (actualNumeric !== null) {
                                    actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                }
                                
                                html += `
                                        <div class="sub-operation-item kpi-item" 
                                         data-kpi="${kpiItem.kpi}"
                                         data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                         data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                        <div class="sub-operation-label">${kpiItem.kpi}</div>
                                            <div class="target-group">
                                        <div><span class="target-badge">${targetDisplay}</span></div>
                                            </div>
                                            <div class="actual-group">
                                                <div><span class="actual-badge">${actualDisplay}</span></div>
                                            </div>
                                            <div><span class="weight-badge">${kpiItem.weight || '--'}</span></div>
                                    </div>
                                `;
                                });
                                
                                html += `</div>`;
                            }
                            });
                            
                            html += `</div>`;
                        }
                        
                        globalIndex++;
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('technical-team-view');
                operationsContent.classList.add('quality-team-view');
                
                // Update loading indicators with actual data
                updateKraRowData(teamName, periodKey);
                
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
                    // Primary header (no Operational KRA here)
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>
                                <div class="target">TOTAL TARGET</div>
                            </div>
                            <div>
                                <div>TOTAL ACTUAL</div>
                            </div>
                            <div>%KPI</div>
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
                    const roleOwner = roleOwners[owner] || '--';
                    
                    // Check if this owner has any KRAs with KPIs
                    const hasAnyKras = kras && kras.length > 0;
                    const hasDropdown = hasAnyKras;
                        const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                        
                    // Calculate totals across all KRAs for this role title
                    let totalWeight = 0;
                    let totalTarget = 0;
                    let totalActual = 0;
                    
                    kras.forEach(kraData => {
                        if (kraData.kpis && kraData.kpis.length > 0) {
                            const kraWeight = kraData.kpis.reduce((sum, kpi) => {
                            let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '--') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                weightValue = parseFloat(weightStr) || 0;
                            }
                            return sum + weightValue;
                            }, 0);
                            totalWeight += kraWeight;
                            
                            // Calculate target and actual for this KRA
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            totalTarget += kraTarget;
                            totalActual += kraActual;
                        }
                    });
                    
                    // Create one row per role title (owner)
                        html += `
                            <div class="member-row dc-team-kra-row ${dropdownClass}" 
                                 data-name="${owner.toLowerCase()}" 
                                 data-team="${teamName.toLowerCase()}" 
                                 data-index="${globalIndex}"
                                 data-owner="${escapeAttributeValue(owner)}"
                             data-target="${totalTarget}"
                             data-actual="${totalActual}"
                             data-weight="${totalWeight}"
                                 style="cursor: pointer;">
                                <div>${roleOwner}</div>
                                <div class="member-info">
                                    <div class="member-name">${owner}</div>
                                </div>
                                <div class="target-group">
                                <div>${totalTarget}</div>
                                </div>
                                <div class="actual-group">
                                <div>${totalActual}</div>
                                </div>
                            <div>--</div>
                            <div>${hasDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                            </div>
                        `;
                        
                    // Add first-level dropdown content with Operational KRAs
                        if (hasDropdown) {
                        const roleTitleIndex = globalIndex;
                            html += `
                            <div class="sub-operations" id="dropdown-${roleTitleIndex}">
                                <div class="sub-operations-header">
                                    <div>Operational KRA</div>
                                    <div>Operational KPI</div>
                                    <div>
                                        <div class="target">TARGET</div>
                                    </div>
                                    <div>
                                        <div>ACTUAL</div>
                                    </div>
                                    <div>%KPI</div>
                                </div>
                        `;
                        
                        // Create a row for each KRA with nested dropdown for KPIs
                        kras.forEach((kraData, kraIndex) => {
                            const hasKpiDropdown = kraData.kpis && kraData.kpis.length > 0;
                            const kraDropdownClass = hasKpiDropdown ? 'has-dropdown' : '';
                            
                            // Calculate KRA totals
                            const kraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                                let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '-') {
                                    const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                    weightValue = parseFloat(weightStr) || 0;
                                }
                                return sum + weightValue;
                            }, 0) : 0;
                            
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            
                            const kraRowIndex = globalIndex + 1000 + kraIndex; // Use offset to avoid conflicts
                            
                            // Check if we need to fetch data for this KRA
                            const needsDataFetch = true; // Set to true initially to show loading
                            
                            html += `
                                <div class="sub-operation-item kra-row-item ${kraDropdownClass}" 
                                     data-kra="${escapeAttributeValue(kraData.kra)}"
                                     data-index="${kraRowIndex}"
                                     data-target="${kraTarget}"
                                     data-actual="${kraActual}"
                                     data-weight="${kraWeight}"
                                     data-loading="true"
                                     style="cursor: pointer;">
                                    <div class="sub-operation-kra">${kraData.kra}</div>
                                    <div>
                                        <div class="loading-indicator-wrapper">
                                            <span class="loading-spinner"></span>
                                            <span class="loading-text">Fetching data...</span>
                                        </div>
                                    </div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>${hasKpiDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                                </div>
                            `;
                            
                            // Add nested dropdown for KPIs under this KRA
                            if (hasKpiDropdown) {
                                html += `
                                    <div class="sub-operations nested-kpi-dropdown" id="dropdown-${kraRowIndex}">
                                `;
                                
                                kraData.kpis.forEach((kpiItem, kpiIndex) => {
                                    // Get actual value from period data if available
                                const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                const actualNumeric = periodData ? periodData.actual : null;
                                const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                
                                    // Parse target for data attribute first (before formatting)
                                let targetNumericForData = null;
                                    if (kpiItem.target && kpiItem.target !== '--') {
                                    targetNumericForData = parseNumericValue(kpiItem.target);
                                }
                                
                                    // Format target value for display
                                    let targetDisplay = kpiItem.target || '--';
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
                                    let actualDisplay = '--';
                                if (actualNumeric !== null) {
                                    actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                }
                                
                                html += `
                                        <div class="sub-operation-item kpi-item" 
                                         data-kpi="${kpiItem.kpi}"
                                         data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                         data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                        <div class="sub-operation-label">${kpiItem.kpi}</div>
                                            <div class="target-group">
                                        <div><span class="target-badge">${targetDisplay}</span></div>
                                            </div>
                                            <div class="actual-group">
                                                <div><span class="actual-badge">${actualDisplay}</span></div>
                                            </div>
                                            <div><span class="weight-badge">${kpiItem.weight || '--'}</span></div>
                                    </div>
                                `;
                                });
                                
                                html += `</div>`;
                            }
                            });
                            
                            html += `</div>`;
                        }
                        
                        globalIndex++;
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('technical-team-view');
                operationsContent.classList.add('dc-team-view');
                
                // Update loading indicators with actual data
                updateKraRowData(teamName, periodKey);
                
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
                    // Primary header (no Operational KRA here)
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>
                                <div class="target">TOTAL TARGET</div>
                            </div>
                            <div>
                                <div>TOTAL ACTUAL</div>
                            </div>
                            <div>%KPI</div>
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
                    const roleOwner = roleOwners[owner] || '--';
                    
                    // Check if this owner has any KRAs with KPIs
                    const hasAnyKras = kras && kras.length > 0;
                    const hasDropdown = hasAnyKras;
                        const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                        
                    // Calculate totals across all KRAs for this role title
                    let totalWeight = 0;
                    let totalTarget = 0;
                    let totalActual = 0;
                    
                    kras.forEach(kraData => {
                        if (kraData.kpis && kraData.kpis.length > 0) {
                            const kraWeight = kraData.kpis.reduce((sum, kpi) => {
                            let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '--') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                weightValue = parseFloat(weightStr) || 0;
                            }
                            return sum + weightValue;
                            }, 0);
                            totalWeight += kraWeight;
                            
                            // Calculate target and actual for this KRA
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            totalTarget += kraTarget;
                            totalActual += kraActual;
                        }
                    });
                    
                    // Create one row per role title (owner)
                        html += `
                            <div class="member-row opportunity-team-kra-row ${dropdownClass}" 
                                 data-name="${owner.toLowerCase()}" 
                                 data-team="${teamName.toLowerCase()}" 
                                 data-index="${globalIndex}"
                                 data-owner="${escapeAttributeValue(owner)}"
                             data-target="${totalTarget}"
                             data-actual="${totalActual}"
                             data-weight="${totalWeight}"
                                 style="cursor: pointer;">
                                <div>${roleOwner}</div>
                                <div class="member-info">
                                    <div class="member-name">${owner}</div>
                                </div>
                                <div class="target-group">
                                <div>${totalTarget}</div>
                                </div>
                                <div class="actual-group">
                                <div>${totalActual}</div>
                                </div>
                            <div>--</div>
                            <div>${hasDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                            </div>
                        `;
                        
                    // Add first-level dropdown content with Operational KRAs
                        if (hasDropdown) {
                        const roleTitleIndex = globalIndex;
                            html += `
                            <div class="sub-operations" id="dropdown-${roleTitleIndex}">
                                <div class="sub-operations-header">
                                    <div>Operational KRA</div>
                                    <div>Operational KPI</div>
                                    <div>
                                        <div class="target">TARGET</div>
                                    </div>
                                    <div>
                                        <div>ACTUAL</div>
                                    </div>
                                    <div>%KPI</div>
                                </div>
                        `;
                        
                        // Create a row for each KRA with nested dropdown for KPIs
                        kras.forEach((kraData, kraIndex) => {
                            const hasKpiDropdown = kraData.kpis && kraData.kpis.length > 0;
                            const kraDropdownClass = hasKpiDropdown ? 'has-dropdown' : '';
                            
                            // Calculate KRA totals
                            const kraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                                let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '-') {
                                    const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                    weightValue = parseFloat(weightStr) || 0;
                                }
                                return sum + weightValue;
                            }, 0) : 0;
                            
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            
                            const kraRowIndex = globalIndex + 1000 + kraIndex; // Use offset to avoid conflicts
                            
                            // Check if we need to fetch data for this KRA
                            const needsDataFetch = true; // Set to true initially to show loading
                            
                            html += `
                                <div class="sub-operation-item kra-row-item ${kraDropdownClass}" 
                                     data-kra="${escapeAttributeValue(kraData.kra)}"
                                     data-index="${kraRowIndex}"
                                     data-target="${kraTarget}"
                                     data-actual="${kraActual}"
                                     data-weight="${kraWeight}"
                                     data-loading="true"
                                     style="cursor: pointer;">
                                    <div class="sub-operation-kra">${kraData.kra}</div>
                                    <div>
                                        <div class="loading-indicator-wrapper">
                                            <span class="loading-spinner"></span>
                                            <span class="loading-text">Fetching data...</span>
                                        </div>
                                    </div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>${hasKpiDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                                </div>
                            `;
                            
                            // Add nested dropdown for KPIs under this KRA
                            if (hasKpiDropdown) {
                                html += `
                                    <div class="sub-operations nested-kpi-dropdown" id="dropdown-${kraRowIndex}">
                                `;
                                
                                kraData.kpis.forEach((kpiItem, kpiIndex) => {
                                    // Get actual value from period data if available
                                const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                const actualNumeric = periodData ? periodData.actual : null;
                                const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                
                                    // Parse target for data attribute first (before formatting)
                                let targetNumericForData = null;
                                    if (kpiItem.target && kpiItem.target !== '--') {
                                    targetNumericForData = parseNumericValue(kpiItem.target);
                                }
                                
                                    // Format target value for display
                                    let targetDisplay = kpiItem.target || '--';
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
                                    let actualDisplay = '--';
                                if (actualNumeric !== null) {
                                    actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                }
                                
                                html += `
                                        <div class="sub-operation-item kpi-item" 
                                         data-kpi="${kpiItem.kpi}"
                                         data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                         data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                        <div class="sub-operation-label">${kpiItem.kpi}</div>
                                            <div class="target-group">
                                        <div><span class="target-badge">${targetDisplay}</span></div>
                                            </div>
                                            <div class="actual-group">
                                                <div><span class="actual-badge">${actualDisplay}</span></div>
                                            </div>
                                            <div><span class="weight-badge">${kpiItem.weight || '--'}</span></div>
                                    </div>
                                `;
                                });
                                
                                html += `</div>`;
                            }
                            });
                            
                            html += `</div>`;
                        }
                        
                        globalIndex++;
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('technical-team-view');
                operationsContent.classList.add('opportunity-team-view');
                
                // Update loading indicators with actual data
                updateKraRowData(teamName, periodKey);
                
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
                    // Primary header (no Operational KRA here)
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>
                                <div class="target">TOTAL TARGET</div>
                            </div>
                            <div>
                                <div>TOTAL ACTUAL</div>
                            </div>
                            <div>%KPI</div>
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
                    const roleOwner = roleOwners[owner] || '--';
                    
                    // Check if this owner has any KRAs with KPIs
                    const hasAnyKras = kras && kras.length > 0;
                    const hasDropdown = hasAnyKras;
                        const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                        
                    // Calculate totals across all KRAs for this role title
                    let totalWeight = 0;
                    let totalTarget = 0;
                    let totalActual = 0;
                    
                    kras.forEach(kraData => {
                        if (kraData.kpis && kraData.kpis.length > 0) {
                            const kraWeight = kraData.kpis.reduce((sum, kpi) => {
                            let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '--') {
                                const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                weightValue = parseFloat(weightStr) || 0;
                            }
                            return sum + weightValue;
                            }, 0);
                            totalWeight += kraWeight;
                            
                            // Calculate target and actual for this KRA
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            totalTarget += kraTarget;
                            totalActual += kraActual;
                        }
                    });
                    
                    // Create one row per role title (owner)
                        html += `
                            <div class="member-row it-team-kra-row ${dropdownClass}" 
                                 data-name="${owner.toLowerCase()}" 
                                 data-team="${teamName.toLowerCase()}" 
                                 data-index="${globalIndex}"
                                 data-owner="${escapeAttributeValue(owner)}"
                             data-target="${totalTarget}"
                             data-actual="${totalActual}"
                             data-weight="${totalWeight}"
                                 style="cursor: pointer;">
                                <div>${roleOwner}</div>
                                <div class="member-info">
                                    <div class="member-name">${owner}</div>
                                </div>
                                <div class="target-group">
                                <div>${totalTarget}</div>
                                </div>
                                <div class="actual-group">
                                <div>${totalActual}</div>
                                </div>
                            <div>--</div>
                            <div>${hasDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                            </div>
                        `;
                        
                    // Add first-level dropdown content with Operational KRAs
                        if (hasDropdown) {
                        const roleTitleIndex = globalIndex;
                            html += `
                            <div class="sub-operations" id="dropdown-${roleTitleIndex}">
                                <div class="sub-operations-header">
                                    <div>Operational KRA</div>
                                    <div>Operational KPI</div>
                                    <div>
                                        <div class="target">TARGET</div>
                                    </div>
                                    <div>
                                        <div>ACTUAL</div>
                                    </div>
                                    <div>%KPI</div>
                                </div>
                        `;
                        
                        // Create a row for each KRA with nested dropdown for KPIs
                        kras.forEach((kraData, kraIndex) => {
                            const hasKpiDropdown = kraData.kpis && kraData.kpis.length > 0;
                            const kraDropdownClass = hasKpiDropdown ? 'has-dropdown' : '';
                            
                            // Calculate KRA totals
                            const kraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                                let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '-') {
                                    const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                    weightValue = parseFloat(weightStr) || 0;
                                }
                                return sum + weightValue;
                            }, 0) : 0;
                            
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            
                            const kraRowIndex = globalIndex + 1000 + kraIndex; // Use offset to avoid conflicts
                            
                            // Check if we need to fetch data for this KRA
                            const needsDataFetch = true; // Set to true initially to show loading
                            
                            html += `
                                <div class="sub-operation-item kra-row-item ${kraDropdownClass}" 
                                     data-kra="${escapeAttributeValue(kraData.kra)}"
                                     data-index="${kraRowIndex}"
                                     data-target="${kraTarget}"
                                     data-actual="${kraActual}"
                                     data-weight="${kraWeight}"
                                     data-loading="true"
                                     style="cursor: pointer;">
                                    <div class="sub-operation-kra">${kraData.kra}</div>
                                    <div>
                                        <div class="loading-indicator-wrapper">
                                            <span class="loading-spinner"></span>
                                            <span class="loading-text">Fetching data...</span>
                                        </div>
                                    </div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>${hasKpiDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                                </div>
                            `;
                            
                            // Add nested dropdown for KPIs under this KRA
                            if (hasKpiDropdown) {
                                html += `
                                    <div class="sub-operations nested-kpi-dropdown" id="dropdown-${kraRowIndex}">
                                `;
                                
                                kraData.kpis.forEach((kpiItem, kpiIndex) => {
                                    // Get actual value from period data if available
                                const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                const actualNumeric = periodData ? periodData.actual : null;
                                const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                
                                    // Parse target for data attribute first (before formatting)
                                let targetNumericForData = null;
                                    if (kpiItem.target && kpiItem.target !== '--') {
                                    targetNumericForData = parseNumericValue(kpiItem.target);
                                }
                                
                                    // Format target value for display
                                    let targetDisplay = kpiItem.target || '--';
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
                                    let actualDisplay = '--';
                                if (actualNumeric !== null) {
                                    actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                }
                                
                                html += `
                                        <div class="sub-operation-item kpi-item" 
                                         data-kpi="${kpiItem.kpi}"
                                         data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                         data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                        <div class="sub-operation-label">${kpiItem.kpi}</div>
                                            <div class="target-group">
                                        <div><span class="target-badge">${targetDisplay}</span></div>
                                            </div>
                                            <div class="actual-group">
                                                <div><span class="actual-badge">${actualDisplay}</span></div>
                                            </div>
                                            <div><span class="weight-badge">${kpiItem.weight || '--'}</span></div>
                                    </div>
                                `;
                                });
                                
                                html += `</div>`;
                            }
                            });
                            
                            html += `</div>`;
                        }
                        
                        globalIndex++;
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('technical-team-view');
                operationsContent.classList.add('it-team-view');
                
                // Update loading indicators with actual data
                updateKraRowData(teamName, periodKey);
                
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
                    // Primary header (no Operational KRA here)
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>
                                <div class="target">TOTAL TARGET</div>
                            </div>
                            <div>
                                <div>TOTAL ACTUAL</div>
                            </div>
                            <div>%KPI</div>
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
                    const roleOwner = roleOwners[owner] || '--';
                    
                    // Check if this owner has any KRAs with KPIs
                    const hasAnyKras = kras && kras.length > 0;
                    const hasDropdown = hasAnyKras;
                    const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                    
                    // Calculate totals across all KRAs for this role title
                    let totalWeight = 0;
                    let totalTarget = 0;
                    let totalActual = 0;
                    
                    kras.forEach(kraData => {
                        if (kraData.kpis && kraData.kpis.length > 0) {
                            const kraWeight = kraData.kpis.reduce((sum, kpi) => {
                                let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '--') {
                                    const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                    weightValue = parseFloat(weightStr) || 0;
                                }
                                return sum + weightValue;
                            }, 0);
                            totalWeight += kraWeight;
                            
                            // Calculate target and actual for this KRA
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            totalTarget += kraTarget;
                            totalActual += kraActual;
                        }
                    });
                    
                    // Create one row per role title (owner)
                    html += `
                        <div class="member-row marcom-team-kra-row ${dropdownClass}" 
                             data-name="${owner.toLowerCase()}" 
                             data-team="${teamName.toLowerCase()}" 
                             data-index="${globalIndex}"
                             data-owner="${escapeAttributeValue(owner)}"
                             data-target="${totalTarget}"
                             data-actual="${totalActual}"
                             data-weight="${totalWeight}"
                             style="cursor: pointer;">
                            <div>${roleOwner}</div>
                            <div class="member-info">
                                <div class="member-name">${owner}</div>
                            </div>
                            <div class="target-group">
                                <div>${totalTarget}</div>
                            </div>
                            <div class="actual-group">
                                <div>${totalActual}</div>
                            </div>
                            <div>--</div>
                            <div>${hasDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                        </div>
                    `;
                    
                    // Add first-level dropdown content with Operational KRAs
                    if (hasDropdown) {
                        const roleTitleIndex = globalIndex;
                        html += `
                            <div class="sub-operations" id="dropdown-${roleTitleIndex}">
                                <div class="sub-operations-header">
                                    <div>Operational KRA</div>
                                    <div>Operational KPI</div>
                                    <div>
                                        <div class="target">TARGET</div>
                                    </div>
                                    <div>
                                        <div>ACTUAL</div>
                                    </div>
                                    <div>%KPI</div>
                                </div>
                        `;
                        
                        // Create a row for each KRA with nested dropdown for KPIs
                        kras.forEach((kraData, kraIndex) => {
                            const hasKpiDropdown = kraData.kpis && kraData.kpis.length > 0;
                            const kraDropdownClass = hasKpiDropdown ? 'has-dropdown' : '';
                            
                            // Calculate KRA totals
                            const kraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                                let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '-') {
                                    const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                    weightValue = parseFloat(weightStr) || 0;
                                }
                                return sum + weightValue;
                            }, 0) : 0;
                            
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            
                            const kraRowIndex = globalIndex + 1000 + kraIndex; // Use offset to avoid conflicts
                            
                            // Check if we need to fetch data for this KRA
                            const needsDataFetch = true; // Set to true initially to show loading
                            
                            html += `
                                <div class="sub-operation-item kra-row-item ${kraDropdownClass}" 
                                     data-kra="${escapeAttributeValue(kraData.kra)}"
                                     data-index="${kraRowIndex}"
                                     data-target="${kraTarget}"
                                     data-actual="${kraActual}"
                                     data-weight="${kraWeight}"
                                     data-loading="true"
                                     style="cursor: pointer;">
                                    <div class="sub-operation-kra">${kraData.kra}</div>
                                    <div>
                                        <div class="loading-indicator-wrapper">
                                            <span class="loading-spinner"></span>
                                            <span class="loading-text">Fetching data...</span>
                                        </div>
                                    </div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>${hasKpiDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                                </div>
                            `;
                            
                            // Add nested dropdown for KPIs under this KRA
                            if (hasKpiDropdown) {
                                html += `
                                    <div class="sub-operations nested-kpi-dropdown" id="dropdown-${kraRowIndex}">
                                `;
                                
                                kraData.kpis.forEach((kpiItem, kpiIndex) => {
                                    // Get actual value from period data if available
                                    const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                    const actualNumeric = periodData ? periodData.actual : null;
                                    const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                    
                                    // Parse target for data attribute first (before formatting)
                                    let targetNumericForData = null;
                                    if (kpiItem.target && kpiItem.target !== '--') {
                                        targetNumericForData = parseNumericValue(kpiItem.target);
                                    }
                                    
                                    // Format target value for display
                                    let targetDisplay = kpiItem.target || '--';
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
                                    let actualDisplay = '--';
                                    if (actualNumeric !== null) {
                                        actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                    }
                                    
                                    html += `
                                        <div class="sub-operation-item kpi-item" 
                                             data-kpi="${kpiItem.kpi}"
                                             data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                             data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                            <div class="sub-operation-label">${kpiItem.kpi}</div>
                                            <div class="target-group">
                                                <div><span class="target-badge">${targetDisplay}</span></div>
                                            </div>
                                            <div class="actual-group">
                                                <div><span class="actual-badge">${actualDisplay}</span></div>
                                            </div>
                                            <div><span class="weight-badge">${kpiItem.weight || '--'}</span></div>
                                        </div>
                                    `;
                                });
                                
                                html += `</div>`;
                            }
                        });
                        
                        html += `</div>`;
                    }
                    
                    globalIndex++;
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('technical-team-view');
                operationsContent.classList.add('marcom-team-view');
                
                // Update loading indicators with actual data
                updateKraRowData(teamName, periodKey);
                
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
                    // Primary header (no Operational KRA here)
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>
                                <div class="target">TOTAL TARGET</div>
                            </div>
                            <div>
                                <div>TOTAL ACTUAL</div>
                            </div>
                            <div>%KPI</div>
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
                    const roleOwner = roleOwners[owner] || '--';
                    
                    // Check if this owner has any KRAs with KPIs
                    const hasAnyKras = kras && kras.length > 0;
                    const hasDropdown = hasAnyKras;
                    const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                    
                    // Calculate totals across all KRAs for this role title
                    let totalWeight = 0;
                    let totalTarget = 0;
                    let totalActual = 0;
                    
                    kras.forEach(kraData => {
                        if (kraData.kpis && kraData.kpis.length > 0) {
                            const kraWeight = kraData.kpis.reduce((sum, kpi) => {
                                let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '--') {
                                    const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                    weightValue = parseFloat(weightStr) || 0;
                                }
                                return sum + weightValue;
                            }, 0);
                            totalWeight += kraWeight;
                            
                            // Calculate target and actual for this KRA
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            totalTarget += kraTarget;
                            totalActual += kraActual;
                        }
                    });
                    
                    // Create one row per role title (owner)
                    html += `
                        <div class="member-row operations-team-kra-row ${dropdownClass}" 
                             data-name="${owner.toLowerCase()}" 
                             data-team="${teamName.toLowerCase()}" 
                             data-index="${globalIndex}"
                             data-owner="${escapeAttributeValue(owner)}"
                             data-target="${totalTarget}"
                             data-actual="${totalActual}"
                             data-weight="${totalWeight}"
                             style="cursor: pointer;">
                            <div>${roleOwner}</div>
                            <div class="member-info">
                                <div class="member-name">${owner}</div>
                            </div>
                            <div class="target-group">
                                <div>${totalTarget}</div>
                            </div>
                            <div class="actual-group">
                                <div>${totalActual}</div>
                            </div>
                            <div>--</div>
                            <div>${hasDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                        </div>
                    `;
                    
                    // Add first-level dropdown content with Operational KRAs
                    if (hasDropdown) {
                        const roleTitleIndex = globalIndex;
                        html += `
                            <div class="sub-operations" id="dropdown-${roleTitleIndex}">
                                <div class="sub-operations-header">
                                    <div>Operational KRA</div>
                                    <div>Operational KPI</div>
                                    <div>
                                        <div class="target">TARGET</div>
                                    </div>
                                    <div>
                                        <div>ACTUAL</div>
                                    </div>
                                    <div>%KPI</div>
                                </div>
                        `;
                        
                        // Create a row for each KRA with nested dropdown for KPIs
                        kras.forEach((kraData, kraIndex) => {
                            const hasKpiDropdown = kraData.kpis && kraData.kpis.length > 0;
                            const kraDropdownClass = hasKpiDropdown ? 'has-dropdown' : '';
                            
                            // Calculate KRA totals
                            const kraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                                let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '-') {
                                    const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                    weightValue = parseFloat(weightStr) || 0;
                                }
                                return sum + weightValue;
                            }, 0) : 0;
                            
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            
                            const kraRowIndex = globalIndex + 1000 + kraIndex; // Use offset to avoid conflicts
                            
                            // Check if we need to fetch data for this KRA
                            const needsDataFetch = true; // Set to true initially to show loading
                            
                            html += `
                                <div class="sub-operation-item kra-row-item ${kraDropdownClass}" 
                                     data-kra="${escapeAttributeValue(kraData.kra)}"
                                     data-index="${kraRowIndex}"
                                     data-target="${kraTarget}"
                                     data-actual="${kraActual}"
                                     data-weight="${kraWeight}"
                                     data-loading="true"
                                     style="cursor: pointer;">
                                    <div class="sub-operation-kra">${kraData.kra}</div>
                                    <div>
                                        <div class="loading-indicator-wrapper">
                                            <span class="loading-spinner"></span>
                                            <span class="loading-text">Fetching data...</span>
                                        </div>
                                    </div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>${hasKpiDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                                </div>
                            `;
                            
                            // Add nested dropdown for KPIs under this KRA
                            if (hasKpiDropdown) {
                                html += `
                                    <div class="sub-operations nested-kpi-dropdown" id="dropdown-${kraRowIndex}">
                                `;
                                
                                kraData.kpis.forEach((kpiItem, kpiIndex) => {
                                    // Get actual value from period data if available
                                    const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                    const actualNumeric = periodData ? periodData.actual : null;
                                    const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                    
                                    // Parse target for data attribute first (before formatting)
                                    let targetNumericForData = null;
                                    if (kpiItem.target && kpiItem.target !== '--') {
                                        targetNumericForData = parseNumericValue(kpiItem.target);
                                    }
                                    
                                    // Format target value for display
                                    let targetDisplay = kpiItem.target || '--';
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
                                    let actualDisplay = '--';
                                    if (actualNumeric !== null) {
                                        actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                    }
                                    
                                    html += `
                                        <div class="sub-operation-item kpi-item" 
                                             data-kpi="${kpiItem.kpi}"
                                             data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                             data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                            <div class="sub-operation-label">${kpiItem.kpi}</div>
                                            <div class="target-group">
                                                <div><span class="target-badge">${targetDisplay}</span></div>
                                            </div>
                                            <div class="actual-group">
                                                <div><span class="actual-badge">${actualDisplay}</span></div>
                                            </div>
                                            <div><span class="weight-badge">${kpiItem.weight || '--'}</span></div>
                                        </div>
                                    `;
                                });
                                
                                html += `</div>`;
                            }
                        });
                        
                        html += `</div>`;
                    }
                    
                    globalIndex++;
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('technical-team-view');
                operationsContent.classList.add('operations-team-view');
                
                // Update loading indicators with actual data
                updateKraRowData(teamName, periodKey);
                
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
                    // Primary header (no Operational KRA here)
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>
                                <div class="target">TOTAL TARGET</div>
                            </div>
                            <div>
                                <div>TOTAL ACTUAL</div>
                            </div>
                            <div>%KPI</div>
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
                    const roleOwner = roleOwners[owner] || '--';
                    
                    // Check if this owner has any KRAs with KPIs
                    const hasAnyKras = kras && kras.length > 0;
                    const hasDropdown = hasAnyKras;
                    const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                    
                    // Calculate totals across all KRAs for this role title
                    let totalWeight = 0;
                    let totalTarget = 0;
                    let totalActual = 0;
                    
                    kras.forEach(kraData => {
                        if (kraData.kpis && kraData.kpis.length > 0) {
                            const kraWeight = kraData.kpis.reduce((sum, kpi) => {
                                let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '--') {
                                    const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                    weightValue = parseFloat(weightStr) || 0;
                                }
                                return sum + weightValue;
                            }, 0);
                            totalWeight += kraWeight;
                            
                            // Calculate target and actual for this KRA
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            totalTarget += kraTarget;
                            totalActual += kraActual;
                        }
                    });
                    
                    // Create one row per role title (owner)
                    html += `
                        <div class="member-row audit-team-kra-row ${dropdownClass}" 
                             data-name="${owner.toLowerCase()}" 
                             data-team="${teamName.toLowerCase()}" 
                             data-index="${globalIndex}"
                             data-owner="${escapeAttributeValue(owner)}"
                             data-target="${totalTarget}"
                             data-actual="${totalActual}"
                             data-weight="${totalWeight}"
                             style="cursor: pointer;">
                            <div>${roleOwner}</div>
                            <div class="member-info">
                                <div class="member-name">${owner}</div>
                            </div>
                            <div class="target-group">
                                <div>${totalTarget}</div>
                            </div>
                            <div class="actual-group">
                                <div>${totalActual}</div>
                            </div>
                            <div>--</div>
                            <div>${hasDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                        </div>
                    `;
                    
                    // Add first-level dropdown content with Operational KRAs
                    if (hasDropdown) {
                        const roleTitleIndex = globalIndex;
                        html += `
                            <div class="sub-operations" id="dropdown-${roleTitleIndex}">
                                <div class="sub-operations-header">
                                    <div>Operational KRA</div>
                                    <div>Operational KPI</div>
                                    <div>
                                        <div class="target">TARGET</div>
                                    </div>
                                    <div>
                                        <div>ACTUAL</div>
                                    </div>
                                    <div>%KPI</div>
                                </div>
                        `;
                        
                        // Create a row for each KRA with nested dropdown for KPIs
                        kras.forEach((kraData, kraIndex) => {
                            const hasKpiDropdown = kraData.kpis && kraData.kpis.length > 0;
                            const kraDropdownClass = hasKpiDropdown ? 'has-dropdown' : '';
                            
                            // Calculate KRA totals
                            const kraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                                let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '-') {
                                    const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                    weightValue = parseFloat(weightStr) || 0;
                                }
                                return sum + weightValue;
                            }, 0) : 0;
                            
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            
                            const kraRowIndex = globalIndex + 1000 + kraIndex; // Use offset to avoid conflicts
                            
                            // Check if we need to fetch data for this KRA
                            const needsDataFetch = true; // Set to true initially to show loading
                            
                            html += `
                                <div class="sub-operation-item kra-row-item ${kraDropdownClass}" 
                                     data-kra="${escapeAttributeValue(kraData.kra)}"
                                     data-index="${kraRowIndex}"
                                     data-target="${kraTarget}"
                                     data-actual="${kraActual}"
                                     data-weight="${kraWeight}"
                                     data-loading="true"
                                     style="cursor: pointer;">
                                    <div class="sub-operation-kra">${kraData.kra}</div>
                                    <div>
                                        <div class="loading-indicator-wrapper">
                                            <span class="loading-spinner"></span>
                                            <span class="loading-text">Fetching data...</span>
                                        </div>
                                    </div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>${hasKpiDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                                </div>
                            `;
                            
                            // Add nested dropdown for KPIs under this KRA
                            if (hasKpiDropdown) {
                                html += `
                                    <div class="sub-operations nested-kpi-dropdown" id="dropdown-${kraRowIndex}">
                                `;
                                
                                kraData.kpis.forEach((kpiItem, kpiIndex) => {
                                    // Get actual value from period data if available (Audit Team uses leadKpiExpensesData)
                                    const periodData = leadKpiExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                    const actualNumeric = periodData ? periodData.actual : null;
                                    const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                    
                                    // Parse target for data attribute first (before formatting)
                                    let targetNumericForData = null;
                                    if (kpiItem.target && kpiItem.target !== '--') {
                                        targetNumericForData = parseNumericValue(kpiItem.target);
                                    }
                                    
                                    // Format target value for display
                                    let targetDisplay = kpiItem.target || '--';
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
                                    let actualDisplay = '--';
                                    if (actualNumeric !== null) {
                                        actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                    }
                                    
                                    html += `
                                        <div class="sub-operation-item kpi-item" 
                                             data-kpi="${kpiItem.kpi}"
                                             data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                             data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                            <div class="sub-operation-label">${kpiItem.kpi}</div>
                                            <div class="target-group">
                                                <div><span class="target-badge">${targetDisplay}</span></div>
                                            </div>
                                            <div class="actual-group">
                                                <div><span class="actual-badge">${actualDisplay}</span></div>
                                            </div>
                                            <div><span class="weight-badge">${kpiItem.weight || '--'}</span></div>
                                        </div>
                                    `;
                                });
                                
                                html += `</div>`;
                            }
                        });
                        
                        html += `</div>`;
                    }
                    
                    globalIndex++;
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('technical-team-view');
                operationsContent.classList.add('audit-team-view');
                
                // Update loading indicators with actual data
                updateKraRowData(teamName, periodKey);
                
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
                    // Primary header (no Operational KRA here)
                    tableHeaderContainer.innerHTML = `
                        <div class="table-header">
                            <div>Role Owner</div>
                            <div>Role Title</div>
                            <div>
                                <div class="target">TOTAL TARGET</div>
                            </div>
                            <div>
                                <div>TOTAL ACTUAL</div>
                            </div>
                            <div>%KPI</div>
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
                    const roleOwner = roleOwners[owner] || '--';
                    
                    // Check if this owner has any KRAs with KPIs
                    const hasAnyKras = kras && kras.length > 0;
                    const hasDropdown = hasAnyKras;
                    const dropdownClass = hasDropdown ? 'has-dropdown' : '';
                    
                    // Calculate totals across all KRAs for this role title
                    let totalWeight = 0;
                    let totalTarget = 0;
                    let totalActual = 0;
                    
                    kras.forEach(kraData => {
                        if (kraData.kpis && kraData.kpis.length > 0) {
                            const kraWeight = kraData.kpis.reduce((sum, kpi) => {
                                let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '--') {
                                    const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                    weightValue = parseFloat(weightStr) || 0;
                                }
                                return sum + weightValue;
                            }, 0);
                            totalWeight += kraWeight;
                            
                            // Calculate target and actual for this KRA
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            totalTarget += kraTarget;
                            totalActual += kraActual;
                        }
                    });
                    
                    // Create one row per role title (owner)
                    html += `
                        <div class="member-row gathering-team-kra-row ${dropdownClass}" 
                             data-name="${owner.toLowerCase()}" 
                             data-team="${teamName.toLowerCase()}" 
                             data-index="${globalIndex}"
                             data-owner="${escapeAttributeValue(owner)}"
                             data-target="${totalTarget}"
                             data-actual="${totalActual}"
                             data-weight="${totalWeight}"
                             style="cursor: pointer;">
                            <div>${roleOwner}</div>
                            <div class="member-info">
                                <div class="member-name">${owner}</div>
                            </div>
                            <div class="target-group">
                                <div>${totalTarget}</div>
                            </div>
                            <div class="actual-group">
                                <div>${totalActual}</div>
                            </div>
                            <div>--</div>
                            <div>${hasDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                        </div>
                    `;
                    
                    // Add first-level dropdown content with Operational KRAs
                    if (hasDropdown) {
                        const roleTitleIndex = globalIndex;
                        html += `
                            <div class="sub-operations" id="dropdown-${roleTitleIndex}">
                                <div class="sub-operations-header">
                                    <div>Operational KRA</div>
                                    <div>Operational KPI</div>
                                    <div>
                                        <div class="target">TARGET</div>
                                    </div>
                                    <div>
                                        <div>ACTUAL</div>
                                    </div>
                                    <div>%KPI</div>
                                </div>
                        `;
                        
                        // Create a row for each KRA with nested dropdown for KPIs
                        kras.forEach((kraData, kraIndex) => {
                            const hasKpiDropdown = kraData.kpis && kraData.kpis.length > 0;
                            const kraDropdownClass = hasKpiDropdown ? 'has-dropdown' : '';
                            
                            // Calculate KRA totals
                            const kraWeight = kraData.kpis ? kraData.kpis.reduce((sum, kpi) => {
                                let weightValue = 0;
                                if (kpi.weight && kpi.weight !== '-') {
                                    const weightStr = String(kpi.weight).replace(/%/g, '').trim();
                                    weightValue = parseFloat(weightStr) || 0;
                                }
                                return sum + weightValue;
                            }, 0) : 0;
                            
                            const baseTarget = 100;
                            const kraTarget = baseTarget + randomIntInRange(-10, 10);
                            const kraActual = baseTarget + randomIntInRange(-15, 15);
                            
                            const kraRowIndex = globalIndex + 1000 + kraIndex; // Use offset to avoid conflicts
                            
                            // Check if we need to fetch data for this KRA
                            const needsDataFetch = true; // Set to true initially to show loading
                            
                            html += `
                                <div class="sub-operation-item kra-row-item ${kraDropdownClass}" 
                                     data-kra="${escapeAttributeValue(kraData.kra)}"
                                     data-index="${kraRowIndex}"
                                     data-target="${kraTarget}"
                                     data-actual="${kraActual}"
                                     data-weight="${kraWeight}"
                                     data-loading="true"
                                     style="cursor: pointer;">
                                    <div class="sub-operation-kra">${kraData.kra}</div>
                                    <div>
                                        <div class="loading-indicator-wrapper">
                                            <span class="loading-spinner"></span>
                                            <span class="loading-text">Fetching data...</span>
                                        </div>
                                    </div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>--</div>
                                    <div>${hasKpiDropdown ? '<span class="dropdown-arrow">▼</span>' : '--'}</div>
                                </div>
                            `;
                            
                            // Add nested dropdown for KPIs under this KRA
                            if (hasKpiDropdown) {
                                html += `
                                    <div class="sub-operations nested-kpi-dropdown" id="dropdown-${kraRowIndex}">
                                `;
                                
                                kraData.kpis.forEach((kpiItem, kpiIndex) => {
                                    // Get actual value from period data if available (Gathering Team uses both data sources)
                                    const periodData = technicalExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey] || leadKpiExpensesData[teamName]?.[kpiItem.kpi]?.[periodKey];
                                    const actualNumeric = periodData ? periodData.actual : null;
                                    const isPercentageKpi = kpiItem.kpi.includes('%') || kpiItem.kpi.toLowerCase().includes('percent');
                                    
                                    // Parse target for data attribute first (before formatting)
                                    let targetNumericForData = null;
                                    if (kpiItem.target && kpiItem.target !== '--') {
                                        targetNumericForData = parseNumericValue(kpiItem.target);
                                    }
                                    
                                    // Format target value for display
                                    let targetDisplay = kpiItem.target || '--';
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
                                    let actualDisplay = '--';
                                    if (actualNumeric !== null) {
                                        actualDisplay = formatValueForDisplay(actualNumeric, isPercentageKpi);
                                    }
                                    
                                    html += `
                                        <div class="sub-operation-item kpi-item" 
                                             data-kpi="${kpiItem.kpi}"
                                             data-target="${targetNumericForData !== null ? targetNumericForData : ''}"
                                             data-actual="${actualNumeric !== null ? actualNumeric : ''}">
                                            <div class="sub-operation-label">${kpiItem.kpi}</div>
                                            <div class="target-group">
                                                <div><span class="target-badge">${targetDisplay}</span></div>
                                            </div>
                                            <div class="actual-group">
                                                <div><span class="actual-badge">${actualDisplay}</span></div>
                                            </div>
                                            <div><span class="weight-badge">${kpiItem.weight || '--'}</span></div>
                                        </div>
                                    `;
                                });
                                
                                html += `</div>`;
                            }
                        });
                        
                        html += `</div>`;
                    }
                    
                    globalIndex++;
                });
                
                html += '</div>';
                operationsContent.innerHTML = html;
                operationsContent.classList.add('technical-team-view');
                operationsContent.classList.add('gathering-team-view');
                
                // Update loading indicators with actual data
                updateKraRowData(teamName, periodKey);
                
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
                        <div class="target">TARGET</div>
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
            updateTeamMembersMiniContainer();
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
                updateTeamMembersMiniContainer();
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
                updateTeamMembersMiniContainer();
            } else {
                updateOperationsSection(selectedTeam, selectedTeamData.title);
                updateTeamMembersMiniContainer();
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
                        <div>
                            <div class="target">TARGET</div>
                        </div>
                        <div>
                            <div>ACTUAL</div>
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

        // Initialize chart data
        const teamPerformanceChartData = {
            labels: [...defaultTeamPerformanceSeries.labels],
            datasets: [
                {
                    label: 'Target',
                    data: [...defaultTeamPerformanceSeries.target],
                    backgroundColor: '#e5bb22',
                    borderColor: '#e5bb22',
                    hoverBackgroundColor: '#f0c84a',
                    borderWidth: 0,
                    borderRadius: 10
                },
                {
                    label: 'Actual',
                    data: [...defaultTeamPerformanceSeries.actual],
                    backgroundColor: '#96a840',
                    borderColor: '#96a840',
                    hoverBackgroundColor: '#a8ba4a',
                    borderWidth: 0,
                    borderRadius: 10
                }
            ]
        };

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

        function updateYAxisLabel() {
            const labelElement = document.querySelector('.performance-report-card .y-axis-label');
            if (!labelElement) {
                return;
            }
            if (currentValueFormat === 'percentage') {
                labelElement.textContent = 'KPI Value (%)';
            } else if (currentValueFormat === 'count') {
                labelElement.textContent = 'KPI Value (Units)';
            } else {
                labelElement.textContent = 'KPI Value (₱ Thousands)';
            }
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

        function removeTimeframeToggle() {
            const reportCardHeader = document.querySelector('.performance-report-card .report-card-header');
            if (!reportCardHeader) {
                return;
            }
            const existingToggle = reportCardHeader.querySelector('.timeframe-toggle');
            if (existingToggle) {
                existingToggle.remove();
            }
        }

        function createTimeframeToggle({
            availableViews = ['annual', 'quarterly'],
            defaultView = 'annual',
            onChange = () => {}
        } = {}) {
            const reportCardHeader = document.querySelector('.performance-report-card .report-card-header');
            if (!reportCardHeader) {
                return null;
            }

            removeTimeframeToggle();

            const container = document.createElement('div');
            container.className = 'timeframe-toggle';

            const label = document.createElement('span');
            label.className = 'timeframe-toggle-label';
            label.textContent = 'View:';

            const buttonsWrapper = document.createElement('div');
            buttonsWrapper.className = 'timeframe-toggle-buttons';

            const viewLabels = {
                annual: 'Annual',
                quarterly: 'Quarterly'
            };

            const buttons = availableViews.map(viewKey => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'timeframe-toggle-btn';
                button.dataset.view = viewKey;
                button.textContent = viewLabels[viewKey] || viewKey;
                buttonsWrapper.appendChild(button);
                return button;
            });

            const toggleRow = document.createElement('div');
            toggleRow.className = 'timeframe-toggle-row';
            toggleRow.appendChild(label);
            toggleRow.appendChild(buttonsWrapper);

            container.appendChild(toggleRow);
            reportCardHeader.appendChild(container);

            let activeView = null;
            const setActive = (view, fire = false) => {
                if (activeView === view) {
                    return;
                }

                const matchingButton = buttons.find(button => button.dataset.view === view);
                if (!matchingButton) {
                    return;
                }

                activeView = view;
                buttons.forEach(button => {
                    button.classList.toggle('active', button.dataset.view === view);
                });

                if (fire) {
                    onChange(view);
                }
            };

            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    setActive(button.dataset.view, true);
                });
            });

            setActive(defaultView, false);

            return {
                setActive(view, fire = false) {
                    setActive(view, fire);
                },
                element: container
            };
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

            teamPerformanceChartData.labels = labels;

            const [targetDataset, actualDataset] = teamPerformanceChartData.datasets;

            // Ensure default bar configuration when applying a detailed series
            if (targetDataset) {
                targetDataset.type = 'bar';
                targetDataset.borderWidth = 0;
                targetDataset.fill = true;
            }
            if (actualDataset) {
                actualDataset.type = 'bar';
                actualDataset.borderWidth = 0;
                actualDataset.fill = true;
            }

            targetDataset.data = targetData;
            actualDataset.data = actualData;

            if (series?.valueType === 'percentage') {
                currentValueFormat = 'percentage';
            } else if (series?.valueType === 'count') {
                currentValueFormat = 'count';
            } else {
                currentValueFormat = 'thousands';
            }
            updateYAxisLabel();

            if (teamPerformanceChart) {
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
            updateYAxisLabel();
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

            removeTimeframeToggle();
            
            // Remove doughnut chart if it exists
            const chartWrapper = document.querySelector('.chart-wrapper');
            const existingDonut = chartWrapper?.querySelector('.kra-weight-donut');
            if (existingDonut) {
                existingDonut.remove();
            }

            setPerformanceReportCardMode('bar');
            
            updatePerformanceCardCopy();
            updateTeamPerformanceInsight(insightContext || {
                infoMessage: 'Select a KPI to view its target vs actual comparison.'
            });
            resetAverageToggleState();
        }

        function setPerformanceReportCardMode(mode = 'bar') {
            const reportCard = document.querySelector('.performance-report-card');
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            if (!reportCard || !chartContainer) {
                return;
            }

            const isDoughnutMode = mode === 'doughnut';
            reportCard.classList.toggle('doughnut-mode', isDoughnutMode);
            chartContainer.classList.toggle('doughnut-mode', isDoughnutMode);
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
        let isAverageView = false;
        let detailedSeriesBackup = null;
        let selectedPerformanceYear = '2025';
        let currentOverallChangePercent = null;

        function getSubtitleRowContainer() {
            const reportCard = document.querySelector('.performance-report-card');
            if (!reportCard) return null;

            const subtitle = reportCard.querySelector('.report-card-subtitle');
            if (!subtitle) return reportCard.querySelector('.report-card-header');

            let row = reportCard.querySelector('.report-subtitle-row');
            if (!row) {
                row = document.createElement('div');
                row.className = 'report-subtitle-row';
                row.style.cssText = 'margin-top: 8px; display: flex; align-items: center; gap: 8px;';

                // Insert row before subtitle, then move subtitle into row
                subtitle.parentElement.insertBefore(row, subtitle);
                row.appendChild(subtitle);
            }

            // Single controls container to hold both average toggle and year filter
            let controls = row.querySelector('.report-subtitle-controls');
            if (!controls) {
                controls = document.createElement('div');
                controls.className = 'report-subtitle-controls';
                controls.style.cssText = 'display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-left: auto; flex: 1 0 auto;';
                row.appendChild(controls);
            }

            return row;
        }

        function resetAverageToggleState() {
            isAverageView = false;
            detailedSeriesBackup = null;
            currentOverallChangePercent = null;
            const button = document.querySelector('.performance-report-card .average-toggle-btn');
            if (button) {
                button.textContent = 'Show Average';
            }
            const yearContainer = document.querySelector('.performance-report-card .year-filter-container');
            if (yearContainer) {
                yearContainer.style.display = 'none';
            }
            if (teamPerformanceChart && teamPerformanceChart.options?.scales?.x?.title) {
                teamPerformanceChart.options.scales.x.title.display = false;
                teamPerformanceChart.options.scales.x.title.text = '';
                teamPerformanceChart.update();
            }
        }

        function ensurePerformanceYearDropdown() {
            const row = getSubtitleRowContainer();
            if (!row) {
                return null;
            }
            const containerParent = row.querySelector('.report-subtitle-controls') || row;

            let container = containerParent.querySelector('.year-filter-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'year-filter-container';
                container.style.cssText = 'display: flex; align-items: center; gap: 6px;';

                const label = document.createElement('span');
                label.textContent = 'Year:';
                label.style.cssText = 'font-size: var(--fs-base, 0.9375rem); color: var(--primary-color, #586740); font-weight: 600; font-family: var(--font-body, "Trebuchet MS", sans-serif);';

                const select = document.createElement('select');
                select.className = 'year-filter-select';
                select.style.cssText = 'padding: 10px 16px; border: 2px solid var(--light-bg, #96a840); border-radius: 8px; font-size: var(--fs-base, 0.9375rem); font-family: var(--font-body, "Trebuchet MS", sans-serif); background: white; color: var(--text-color, #000); cursor: pointer; transition: all 0.3s ease; font-weight: 500; min-width: 100px;';
                
                // Add hover and focus effects
                select.addEventListener('mouseenter', function() {
                    this.style.borderColor = 'var(--secondary-color, #e5bb22)';
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 4px 12px rgba(229, 187, 34, 0.2)';
                });
                select.addEventListener('mouseleave', function() {
                    this.style.borderColor = 'var(--light-bg, #96a840)';
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                });
                select.addEventListener('focus', function() {
                    this.style.outline = 'none';
                    this.style.borderColor = 'var(--secondary-color, #e5bb22)';
                    this.style.boxShadow = '0 0 0 3px rgba(229, 187, 34, 0.2)';
                });
                select.addEventListener('blur', function() {
                    this.style.borderColor = 'var(--light-bg, #96a840)';
                    this.style.boxShadow = 'none';
                });
                const years = ['2023', '2024', '2025', '2026'];
                select.innerHTML = years.map(year => `<option value="${year}">${year}</option>`).join('');
                select.value = selectedPerformanceYear;

                select.addEventListener('change', () => {
                    selectedPerformanceYear = select.value;
                    if (teamPerformanceChart) {
                        const xScale = teamPerformanceChart.options?.scales?.x;
                        if (isAverageView && xScale && xScale.title) {
                            xScale.title.display = true;
                            xScale.title.text = `Year ${selectedPerformanceYear}`;
                        }
                        teamPerformanceChart.update();
                    }
                });

                container.appendChild(label);
                container.appendChild(select);
                containerParent.appendChild(container);
            } else {
                const select = container.querySelector('.year-filter-select');
                if (select) {
                    select.value = selectedPerformanceYear;
                }
            }

            container.style.display = 'flex';
            return container;
        }

        function ensureAverageToggleButton() {
            const row = getSubtitleRowContainer();
            if (!row) {
                return null;
            }
            const controls = row.querySelector('.report-subtitle-controls') || row;

            let button = controls.querySelector('.average-toggle-btn');
            if (button) {
                return button;
            }

            button = document.createElement('button');
            button.type = 'button';
            button.className = 'average-toggle-btn';
            button.textContent = 'Show Average';
            button.style.cssText = 'padding: 10px 16px; border-radius: 8px; border: 2px solid var(--primary-color, #586740); background: transparent; color: var(--primary-color, #586740); font-size: var(--fs-base, 0.9375rem); font-weight: 600; cursor: pointer; transition: all 0.3s ease; font-family: var(--font-body, "Trebuchet MS", sans-serif);';
            
            // Add hover effect
            button.addEventListener('mouseenter', function() {
                this.style.background = 'var(--primary-color, #586740)';
                this.style.color = 'var(--white, #ffffff)';
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 12px rgba(88, 103, 64, 0.2)';
            });
            button.addEventListener('mouseleave', function() {
                this.style.background = 'transparent';
                this.style.color = 'var(--primary-color, #586740)';
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });

            button.addEventListener('click', () => {
                if (!teamPerformanceChartData || !teamPerformanceChart) {
                    return;
                }

                // Toggle back to detailed view if currently showing average
                if (isAverageView) {
                    // Restore original bar-series data and style, then reset UI state
                    if (detailedSeriesBackup) {
                        applyTeamPerformanceSeries(detailedSeriesBackup);
                    }
                    isAverageView = false;
                    currentOverallChangePercent = null;

                    const yearContainer = document.querySelector('.performance-report-card .year-filter-container');
                    if (yearContainer) {
                        yearContainer.style.display = 'none';
                    }

                    if (teamPerformanceChart && teamPerformanceChart.options?.scales?.x?.title) {
                        teamPerformanceChart.options.scales.x.title.display = false;
                        teamPerformanceChart.options.scales.x.title.text = '';
                        teamPerformanceChart.update();
                    }

                    button.textContent = 'Show Average';
                    return;
                }

                const sourceSeries = activeTeamPerformanceSeries || defaultTeamPerformanceSeries;
                if (!sourceSeries || !Array.isArray(sourceSeries.target) || !Array.isArray(sourceSeries.actual)) {
                    return;
                }

                // Backup current detailed series so we can restore later
                detailedSeriesBackup = {
                    labels: Array.isArray(sourceSeries.labels) ? [...sourceSeries.labels] : [],
                    target: [...sourceSeries.target],
                    actual: [...sourceSeries.actual],
                    valueType: sourceSeries.valueType
                };

                const totalTarget = sourceSeries.target.reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0);
                const totalActual = sourceSeries.actual.reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0);
                const avgTarget = average(sourceSeries.target);
                const avgActual = average(sourceSeries.actual);

                const valueType = sourceSeries.valueType || currentValueFormat || 'thousands';

                if (totalTarget !== 0) {
                    currentOverallChangePercent = ((totalActual - totalTarget) / Math.abs(totalTarget)) * 100;
                } else {
                    currentOverallChangePercent = null;
                }

                // Switch visual style to line chart using existing per-period data
                if (teamPerformanceChart && Array.isArray(teamPerformanceChartData.datasets)) {
                    teamPerformanceChartData.datasets.forEach((dataset) => {
                        dataset.type = 'line';
                        dataset.borderWidth = 2;
                        dataset.fill = false;
                        dataset.tension = 0.3;
                        dataset.pointRadius = 3;
                        dataset.pointHoverRadius = 4;
                    });
                    const xScale = teamPerformanceChart.options?.scales?.x;
                    if (xScale && xScale.title) {
                        xScale.title.display = true;
                        xScale.title.text = `Year ${selectedPerformanceYear}`;
                    }
                    teamPerformanceChart.update();
                }

                // Show year dropdown only while in average view
                ensurePerformanceYearDropdown();

                updateTeamPerformanceInsight({
                    targetValue: avgTarget,
                    actualValue: avgActual,
                    valueFormat: valueType,
                    additionalNarrative: 'Showing the line trend of the currently selected timeframe with overall performance vs target.'
                });

                button.textContent = 'Show Details';
                isAverageView = true;
            });

            controls.appendChild(button);
            return button;
        }

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

            teamPerformanceChart = new Chart(canvas, {
                type: 'bar',
                data: teamPerformanceChartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    layout: {
                        padding: {
                            top: 24,
                            right: 24,
                            left: 0,
                            bottom: 12
                        }
                    },
                    datasets: {
                        bar: {
                            barThickness: 16,
                            maxBarThickness: 20,
                            categoryPercentage: 0.65,
                            barPercentage: 0.8,
                            borderSkipped: false
                        }
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
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: true,
                            backgroundColor: '#ffffff',
                            titleColor: '#1f2937',
                            bodyColor: '#4b5563',
                            borderColor: '#e5e7eb',
                            borderWidth: 1,
                            padding: 12,
                            cornerRadius: 10,
                            usePointStyle: true,
                            callbacks: {
                                label: function(context) {
                                    // In average (line) view, show only overall percentage change once
                                    if (isAverageView && currentOverallChangePercent !== null) {
                                        if (context.datasetIndex !== 0) {
                                            return '';
                                        }
                                        const absPercent = Math.abs(currentOverallChangePercent);
                                        const fixed = absPercent.toFixed(1);
                                        const formatted = fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
                                        const direction = currentOverallChangePercent >= 0 ? 'up' : 'down';
                                        return `Overall ${direction} ${formatted}% vs target (${selectedPerformanceYear})`;
                                    }

                                    const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
                                    if (currentValueFormat === 'percentage') {
                                        const numeric = Number(value);
                                        if (Number.isNaN(numeric)) {
                                            return `${context.dataset.label}: N/A`;
                                        }
                                        const fixed = numeric.toFixed(1);
                                        const formatted = fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
                                        return `${context.dataset.label}: ${formatted}%`;
                                    }
                                    if (currentValueFormat === 'count') {
                                        const numeric = Number(value);
                                        if (Number.isNaN(numeric)) {
                                            return `${context.dataset.label}: N/A`;
                                        }
                                        return `${context.dataset.label}: ${numeric.toLocaleString('en-US')}`;
                                    }
                                    return `${context.dataset.label}: ${formatPesoIfNeeded(value, true)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#6b7280',
                                font: {
                                    weight: 600
                                },
                                callback: function(value, index) {
                                    if (isAverageView) {
                                        // Hide tick labels in average view; use axis title instead
                                        return '';
                                    }
                                    // Default: show underlying label (months/quarters)
                                    const label = this.getLabelForValue(value);
                                    return label;
                                },
                                maxRotation: 0,
                                minRotation: 0
                            },
                            title: {
                                display: false,
                                text: '',
                                color: '#6b7280',
                                font: {
                                    weight: '600',
                                    size: 12
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#94a3b8',
                                padding: 10,
                                callback: function(value) {
                                    const numeric = Number(value) || 0;
                                    if (currentValueFormat === 'percentage') {
                                        return `${numeric.toLocaleString('en-US', { maximumFractionDigits: 0 })}%`;
                                    }
                                    if (currentValueFormat === 'count') {
                                        return numeric.toLocaleString('en-US', { maximumFractionDigits: 0 });
                                    }
                                    const thousands = numeric / 1_000;
                                    return `₱${thousands.toLocaleString('en-US', { maximumFractionDigits: 1 })}K`;
                                }
                            },
                            grid: {
                                color: '#e4e8d7',
                                drawTicks: false
                            },
                            border: {
                                display: false
                            }
                        }
                    }
                },
                plugins: [{
                    id: 'overallTextPlugin',
                    afterDraw: (chart) => {
                        if (isAverageView && currentOverallChangePercent !== null) {
                            const ctx = chart.ctx;
                            const chartArea = chart.chartArea;
                            const absPercent = Math.abs(currentOverallChangePercent);
                            const fixed = absPercent.toFixed(1);
                            const formatted = fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
                            const direction = currentOverallChangePercent >= 0 ? 'up' : 'down';
                            const overallText = `Overall ${direction} ${formatted}% vs target (${selectedPerformanceYear})`;
                            
                            // Get CSS variable values from computed styles
                            const canvas = chart.canvas;
                            const rootStyle = window.getComputedStyle(document.documentElement);
                            const primaryColor = rootStyle.getPropertyValue('--primary-color')?.trim() || '#586740';
                            const fontFamily = rootStyle.getPropertyValue('--font-body')?.trim() || '"Trebuchet MS", sans-serif';
                            
                            // Position text in top-right corner of chart area
                            const x = chartArea.right - 20;
                            const y = chartArea.top + 20;
                            
                            ctx.save();
                            ctx.font = `600 12px ${fontFamily}`;
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'top';
                            
                            // Draw background rectangle for better visibility
                            const textMetrics = ctx.measureText(overallText);
                            const padding = 8;
                            const bgWidth = textMetrics.width + (padding * 2);
                            const bgHeight = 20;
                            
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                            ctx.fillRect(x - bgWidth, y - 2, bgWidth, bgHeight);
                            
                            // Draw border
                            ctx.strokeStyle = primaryColor;
                            ctx.lineWidth = 1;
                            ctx.strokeRect(x - bgWidth, y - 2, bgWidth, bgHeight);
                            
                            // Draw text
                            ctx.fillStyle = primaryColor;
                            ctx.fillText(overallText, x - padding, y);
                            ctx.restore();
                        }
                    }
                }]
            });

            applyTeamPerformanceSeries(activeTeamPerformanceSeries);
            updateTeamPerformanceInsight();
        }

        function updateTeamPerformanceBarChart(operationName, target, actual) {
            // Remove doughnut chart if it exists (when switching from Technical Team KRA to other charts)
            const chartWrapper = document.querySelector('.chart-wrapper');
            const existingDonut = chartWrapper?.querySelector('.kra-weight-donut');
            if (existingDonut) {
                existingDonut.remove();
            }
            
            // Show canvas and hide any SVG
            const canvas = document.getElementById('teamPerformanceChart');
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            const yAxisLabel = reportCard?.querySelector('.y-axis-label');

            resetAverageToggleState();
            
            removeTimeframeToggle();

            // If canvas doesn't exist (was removed by donut chart), recreate it
            let canvasElement = canvas;
            let needsReinit = false;
            if (!canvasElement && chartContainer) {
                chartContainer.innerHTML = '';
                canvasElement = document.createElement('canvas');
                canvasElement.id = 'teamPerformanceChart';
                chartContainer.appendChild(canvasElement);
                needsReinit = true;
            } else if (chartContainer) {
                // Clear any SVG from donut chart
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
            if (yAxisLabel) {
                yAxisLabel.style.display = 'block';
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

                const monthlySeriesPayload = {
                    labels: [...monthlySeries.labels],
                    target: [...monthlySeries.target],
                    actual: [...monthlySeries.actual],
                    valueType: monthlySeries.valueType
                };

                const shouldEnableTimeframeToggle = Array.isArray(monthlySeriesPayload.labels) &&
                    monthlySeriesPayload.labels.length === 12;
                const defaultInsightTarget = target ?? monthlySeries.totalTarget;
                const defaultInsightActual = actual ?? monthlySeries.totalActual;
                const currentMonthIndex = new Date().getMonth();
                let activeQuarterId = `Q${Math.min(4, Math.max(1, Math.floor(currentMonthIndex / 3) + 1))}`;

                const removeQuarterDropdown = () => {
                    const existing = document.querySelector('.timeframe-toggle .quarter-filter-container')
                        || reportCard?.querySelector('.quarter-filter-container');
                    if (existing) {
                        existing.remove();
                    }
                };

                const createQuarterDropdown = () => {
                    const timeframeContainer = document.querySelector('.performance-report-card .timeframe-toggle');
                    const parent = timeframeContainer || reportCard?.querySelector('.report-card-header');
                    if (!parent) {
                        return null;
                    }

                    removeQuarterDropdown();

                    const container = document.createElement('div');
                    container.className = 'quarter-filter-container';
                    if (timeframeContainer) {
                        container.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-top: 8px;';
                    } else {
                        container.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-left: auto;';
                    }

                    const label = document.createElement('label');
                    label.textContent = 'Quarter:';
                    label.style.cssText = 'font-size: 12px; color: #525552; font-weight: 500;';

                    const selectEl = document.createElement('select');
                    selectEl.id = 'technicalQuarterFilter';
                    selectEl.style.cssText = 'padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; background: white; color: #525552; cursor: pointer;';
                    selectEl.innerHTML = quarterDefinitions.map(def => `<option value="${def.id}">${def.label}</option>`).join('');

                    container.appendChild(label);
                    container.appendChild(selectEl);
                    parent.appendChild(container);

                    return selectEl;
                };

                const applyQuarterSeries = (quarterId = activeQuarterId) => {
                    const definition = quarterDefinitionMap[quarterId] || quarterDefinitions[0];
                    activeQuarterId = definition.id;
                    const monthIndices = definition.months;
                    const labels = monthIndices.map(index => chartMonthIndexToFullName[index]);
                    const targetData = monthIndices.map(index => {
                        const value = monthlySeries.target[index];
                        return Number.isFinite(value) ? value : 0;
                    });
                    const actualData = monthIndices.map(index => {
                        const value = monthlySeries.actual[index];
                        return Number.isFinite(value) ? value : 0;
                    });

                    const quarterSeriesPayload = {
                        labels,
                        target: targetData,
                        actual: actualData,
                        valueType: monthlySeries.valueType
                    };
                    applyTeamPerformanceSeries(quarterSeriesPayload);

                    updatePerformanceCardCopy({
                        title: `${operationName} • ${definition.label}`,
                        subtitle: teamMemberName ? `${teamMemberName} • ${teamTitle}` : teamTitle
                    });

                    const decimals = monthlySeries.decimals ?? 0;
                    const quarterTargetTotal = Number(sumSeriesValues(targetData).toFixed(decimals));
                    const quarterActualTotal = Number(sumSeriesValues(actualData).toFixed(decimals));
                    const isPercentageSeries = quarterSeriesPayload.valueType === 'percentage'
                        || /%|percent/i.test(operationName.toLowerCase());

                    updateTeamPerformanceInsight({
                        operationName,
                        leaderName: teamMemberName,
                        targetValue: quarterTargetTotal,
                        actualValue: quarterActualTotal,
                        isPercentage: isPercentageSeries,
                        valueFormat: quarterSeriesPayload.valueType,
                        additionalNarrative: `Showing ${definition.label} monthly performance.`
                    });
                };

                const applyAnnualSeries = () => {
                    removeQuarterDropdown();
                    applyTeamPerformanceSeries(monthlySeriesPayload);
                    updatePerformanceCardCopy({
                        title: operationName,
                        subtitle: teamMemberName ? `${teamMemberName} • ${teamTitle}` : teamTitle
                    });

                    const isPercentageSeries = monthlySeries.valueType === 'percentage'
                        || /%|percent/i.test(operationName.toLowerCase());

                    updateTeamPerformanceInsight({
                        operationName,
                        leaderName: teamMemberName,
                        targetValue: defaultInsightTarget,
                        actualValue: defaultInsightActual,
                        isPercentage: isPercentageSeries,
                        valueFormat: monthlySeries.valueType,
                        additionalNarrative: 'Viewing all 12 monthly data points.'
                    });
                };

                const applyTimeframeView = (viewKey = 'annual') => {
                    resetAverageToggleState();
                    if (viewKey === 'quarterly' && shouldEnableTimeframeToggle) {
                        const selectEl = createQuarterDropdown();
                        if (selectEl) {
                            selectEl.value = activeQuarterId;
                            selectEl.addEventListener('change', (event) => {
                                resetAverageToggleState();
                                activeQuarterId = event.target.value;
                                applyQuarterSeries(activeQuarterId);
                            });
                        }
                        applyQuarterSeries(activeQuarterId);
                    } else {
                        applyAnnualSeries();
                    }
                };

                if (shouldEnableTimeframeToggle) {
                    applyTimeframeView('annual');
                    const toggleControls = createTimeframeToggle({
                        availableViews: ['annual', 'quarterly'],
                        defaultView: 'annual',
                        onChange: applyTimeframeView
                    });
                    toggleControls?.setActive('annual', false);
                } else {
                    applyTimeframeView('annual');
                }

                ensureAverageToggleButton();

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
                        resetAverageToggleState();
                        updateQuarterlyChart(e.target.value);
                    });
                }

                ensureAverageToggleButton();

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
            ensureAverageToggleButton();
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

        function updateMemberPerformanceChart(kpiName, target, actual) {
            // Remove doughnut chart if it exists (when switching from Technical Team KRA to other charts)
            const chartWrapper = document.querySelector('.chart-wrapper');
            const existingDonut = chartWrapper?.querySelector('.kra-weight-donut');
            if (existingDonut) {
                existingDonut.remove();
            }

            removeTimeframeToggle();
            
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportTitle = document.querySelector('.performance-report-card .report-title');
            const reportCard = document.querySelector('.performance-report-card');
            const reportLegend = reportCard?.querySelector('.report-legend');
            const yAxisLabel = reportCard?.querySelector('.y-axis-label');
            if (!chartContainer) return;

            // Hide canvas and bar chart elements (legend, y-axis) if they exist
            const canvas = document.getElementById('teamPerformanceChart');
            if (canvas) {
                canvas.style.display = 'none';
            }
            if (reportLegend) {
                reportLegend.style.display = 'none';
            }
            if (yAxisLabel) {
                yAxisLabel.style.display = 'none';
            }

            // If no data, show empty state
            if (target === null || actual === null || kpiName === null) {
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

            // Calculate difference
            const difference = actual - target;
            const diffPercent = ((difference / target) * 100).toFixed(1);
            const isPositive = difference >= 0;
            const isPercentageKpi = kpiName && (kpiName.includes('%') || kpiName.toLowerCase().includes('percent') || 
                                     kpiName.toLowerCase().includes('rate') || kpiName.toLowerCase().includes('uptime') ||
                                     kpiName.toLowerCase().includes('compliance') || kpiName.toLowerCase().includes('accuracy') ||
                                     kpiName.toLowerCase().includes('efficiency') || kpiName.toLowerCase().includes('quality'));

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
                <svg class="line-chart" width="${chartWidth}" height="${chartHeight}" viewBox="0 0 ${chartWidth} ${chartHeight}">
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
                </svg>
            `;

            chartContainer.innerHTML = chartHTML;

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

        function updateTechnicalTeamKraCharts(kraName, target, actual, owner) {
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            const reportTitle = document.querySelector('.performance-report-card .report-title');
            const reportCard = document.querySelector('.performance-report-card');

            if (!chartContainer) return;

            // Clear and hide chart container and legend for text-only display
            chartContainer.innerHTML = '';
            chartContainer.style.display = 'none';


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

            if (!chartContainer) return;

            // Clear and hide chart container and legend for text-only display
            chartContainer.innerHTML = '';
            chartContainer.style.display = 'none';

            
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

            if (!chartContainer) return;

            // Clear and hide chart container and legend for text-only display
            chartContainer.innerHTML = '';
            chartContainer.style.display = 'none';


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

            if (!chartContainer) return;

            // Clear and hide chart container and legend for text-only display
            chartContainer.innerHTML = '';
            chartContainer.style.display = 'none';


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

            if (!chartContainer) return;

            // Clear and hide chart container and legend for text-only display
            chartContainer.innerHTML = '';
            chartContainer.style.display = 'none';


            setPerformanceReportCardMode('bar');

            if (reportTitle) {
                // Use owner (role title) as fallback if kraName is null or empty
                const displayName = kraName || owner || 'Performance Overview';
                const shortName = displayName.length > 50 ? displayName.substring(0, 50) + '...' : displayName;
                reportTitle.innerHTML = `
                    ${shortName}
                    <div style="font-size: 12px; margin-top: 10px; color: #9ca3af;">
                        ${owner || ''}
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

        function updateOperationalKpiChart(teamName, kpiName, target, actual) {
            const chartContainer = document.querySelector('.chart-container.monthly-profit-chart');
            if (chartContainer) {
                chartContainer.style.display = 'block';
            }

            const reportCard = document.querySelector('.performance-report-card');

            removeTimeframeToggle();

            
            let canvas = document.getElementById('teamPerformanceChart');
            let needsReinit = false;
            if (!canvas && chartContainer) {
                chartContainer.innerHTML = '';
                canvas = document.createElement('canvas');
                canvas.id = 'teamPerformanceChart';
                chartContainer.appendChild(canvas);
                needsReinit = true;
            } else if (chartContainer) {
                // Clear any SVG in case it was used by another chart type
                const svg = chartContainer.querySelector('svg.line-chart');
                if (svg) {
                    chartContainer.innerHTML = '';
                    if (!canvas) {
                        canvas = document.createElement('canvas');
                        canvas.id = 'teamPerformanceChart';
                        chartContainer.appendChild(canvas);
                        needsReinit = true;
                    } else {
                        chartContainer.appendChild(canvas);
                    }
                }
            }

            if (needsReinit) {
                initTeamPerformanceChart();
            }
            
            if (canvas) {
                canvas.style.display = 'block';
            }
            

            setPerformanceReportCardMode('bar');

            if (!kpiName) {
                resetTeamPerformanceVisuals();
                return;
            }

            // Build a synthetic monthly series from the provided target/actual
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
                    targetRange = [target * 0.9, target * 1.1];
                    actualRange = [actual * 0.9, actual * 1.1];
                    decimals = 0;
                    valueType = 'thousands';
                }
            } else {
                if (isPercentage) {
                    targetRange = [80, 100]; actualRange = [75, 95]; decimals = 1; valueType = 'percentage';
                } else if (isCount) {
                    targetRange = [10, 50]; actualRange = [8, 45]; decimals = 0; valueType = 'count';
                } else {
                    targetRange = [10000, 50000]; actualRange = [9000, 48000]; decimals = 0; valueType = 'thousands';
                }
            }

            const monthlySeries = generateMonthlySeries({ targetRange, actualRange, decimals, valueType });
            const monthlySeriesPayload = {
                labels: [...monthlySeries.labels],
                target: [...monthlySeries.target],
                actual: [...monthlySeries.actual],
                valueType: monthlySeries.valueType
            };

            const shouldEnableTimeframeToggle = Array.isArray(monthlySeriesPayload.labels) &&
                monthlySeriesPayload.labels.length === 12;
            const defaultInsightTarget = target ?? monthlySeries.totalTarget;
            const defaultInsightActual = actual ?? monthlySeries.totalActual;
            const currentMonthIndex = new Date().getMonth();
            let activeQuarterId = `Q${Math.min(4, Math.max(1, Math.floor(currentMonthIndex / 3) + 1))}`;

            const removeQuarterDropdown = () => {
                const existing = document.querySelector('.timeframe-toggle .quarter-filter-container')
                    || reportCard?.querySelector('.quarter-filter-container');
                if (existing) {
                    existing.remove();
                }
            };

            const createQuarterDropdown = () => {
                const timeframeContainer = document.querySelector('.performance-report-card .timeframe-toggle');
                const parent = timeframeContainer || reportCard?.querySelector('.report-card-header');
                if (!parent) {
                    return null;
                }

                removeQuarterDropdown();

                const container = document.createElement('div');
                container.className = 'quarter-filter-container';
                if (timeframeContainer) {
                    container.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-top: 8px;';
                } else {
                    container.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-left: auto;';
                }

                const labelEl = document.createElement('label');
                labelEl.textContent = 'Quarter:';
                labelEl.style.cssText = 'font-size: 12px; color: #525552; font-weight: 500;';

                const selectEl = document.createElement('select');
                selectEl.id = 'operationalQuarterFilter';
                selectEl.style.cssText = 'padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; background: white; color: #525552; cursor: pointer;';
                selectEl.innerHTML = quarterDefinitions.map(def => `<option value="${def.id}">${def.label}</option>`).join('');

                container.appendChild(labelEl);
                container.appendChild(selectEl);
                parent.appendChild(container);

                return selectEl;
            };

            const applyQuarterSeries = (quarterId = activeQuarterId) => {
                const definition = quarterDefinitionMap[quarterId] || quarterDefinitions[0];
                activeQuarterId = definition.id;
                const monthIndices = definition.months;
                const labels = monthIndices.map(index => chartMonthIndexToFullName[index]);
                const targetData = monthIndices.map(index => {
                    const value = monthlySeries.target[index];
                    return Number.isFinite(value) ? value : 0;
                });
                const actualData = monthIndices.map(index => {
                    const value = monthlySeries.actual[index];
                    return Number.isFinite(value) ? value : 0;
                });

                const quarterSeriesPayload = {
                    labels,
                    target: targetData,
                    actual: actualData,
                    valueType: monthlySeries.valueType
                };
                applyTeamPerformanceSeries(quarterSeriesPayload);

                updatePerformanceCardCopy({
                    title: `${kpiName} • ${definition.label}`,
                    subtitle: `${teamName} • Operational KPI`
                });

                const qDecimals = monthlySeries.decimals ?? 0;
                const quarterTargetTotal = Number(sumSeriesValues(targetData).toFixed(qDecimals));
                const quarterActualTotal = Number(sumSeriesValues(actualData).toFixed(qDecimals));
                const isPercentageSeries = quarterSeriesPayload.valueType === 'percentage'
                    || /%|percent/i.test(kpiName.toLowerCase());

                updateTeamPerformanceInsight({
                    operationName: kpiName,
                    leaderName: '',
                    targetValue: quarterTargetTotal,
                    actualValue: quarterActualTotal,
                    isPercentage: isPercentageSeries,
                    valueFormat: quarterSeriesPayload.valueType,
                    additionalNarrative: `Showing ${definition.label} monthly performance.`
                });
            };

            const applyAnnualSeries = () => {
                removeQuarterDropdown();
                applyTeamPerformanceSeries(monthlySeriesPayload);
                updatePerformanceCardCopy({
                    title: kpiName,
                    subtitle: `${teamName} • Operational KPI`
                });

                const isPercentageSeries = monthlySeries.valueType === 'percentage'
                    || /%|percent/i.test(kpiName.toLowerCase());

                updateTeamPerformanceInsight({
                    operationName: kpiName,
                    leaderName: '',
                    targetValue: defaultInsightTarget,
                    actualValue: defaultInsightActual,
                    isPercentage: isPercentageSeries,
                    valueFormat: monthlySeries.valueType,
                    additionalNarrative: 'Viewing all 12 monthly data points.'
                });
            };

            const applyTimeframeView = (viewKey = 'annual') => {
                if (viewKey === 'quarterly' && shouldEnableTimeframeToggle) {
                    const selectEl = createQuarterDropdown();
                    if (selectEl) {
                        selectEl.value = activeQuarterId;
                        selectEl.addEventListener('change', (event) => {
                            activeQuarterId = event.target.value;
                            applyQuarterSeries(activeQuarterId);
                        });
                    }
                    applyQuarterSeries(activeQuarterId);
                } else {
                    applyAnnualSeries();
                }
            };

            if (shouldEnableTimeframeToggle) {
                applyTimeframeView('annual');
                const toggleControls = createTimeframeToggle({
                    availableViews: ['annual', 'quarterly'],
                    defaultView: 'annual',
                    onChange: applyTimeframeView
                });
                toggleControls?.setActive('annual', false);
            } else {
                applyTimeframeView('annual');
            }
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

                    // Always ensure the graph container is visible when selecting a KPI
                    ensureChartWrapperVisible();

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
                        // Team members = doughnut chart, Team leader KPIs = bar chart
                        const isTeamMember = this.classList.contains('member-view-row');
                        
                        if (isTeamMember) {
                            // Use doughnut chart for team members (from teamMembersData)
                            if (target !== null && actual !== null) {
                                updateMemberPerformanceChart(operationName, target, actual);
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
                    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                        return;
                    }

                    const index = this.getAttribute('data-index');
                    const dropdown = document.getElementById(`dropdown-${index}`);
                    
                    const owner = this.getAttribute('data-owner');
                    const operationName = this.getAttribute('data-operation');
                    const targetStr = this.getAttribute('data-target');
                    const actualStr = this.getAttribute('data-actual');
                    const target = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                    const actual = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                    
                    const isAnyTeamKra = this.classList.contains('technical-team-kra-row') ||
                                        this.classList.contains('accounting-team-kra-row') ||
                                        this.classList.contains('lrad-team-kra-row') ||
                                        this.classList.contains('quality-team-kra-row') ||
                                        this.classList.contains('dc-team-kra-row') ||
                                        this.classList.contains('opportunity-team-kra-row') ||
                                        this.classList.contains('it-team-kra-row') ||
                                        this.classList.contains('marcom-team-kra-row') ||
                                        this.classList.contains('operations-team-kra-row') ||
                                        this.classList.contains('audit-team-kra-row') ||
                                        this.classList.contains('gathering-team-kra-row');

                    if (isAnyTeamKra && owner) {
                        document.querySelectorAll('.member-row').forEach(r => r.classList.remove('row-active'));
                        this.classList.add('row-active');
                        // Use owner (role title) as kraName if operationName is not available
                        const kraNameToUse = operationName || owner;
                        // Call the generic KRA text-display function for all teams.
                        updateTeamKraChartsGeneric(teamName, null, kraNameToUse, target, actual, owner);
                    }
                    
                    if (dropdown) {
                        const isExpanded = this.classList.contains('expanded');
                        
                        // Only close other main dropdowns, not nested ones
                        document.querySelectorAll('.member-row.has-dropdown').forEach(r => {
                            if (r !== this) {
                                r.classList.remove('expanded');
                                const otherIndex = r.getAttribute('data-index');
                                const otherDropdown = document.getElementById(`dropdown-${otherIndex}`);
                                if (otherDropdown) {
                                    otherDropdown.classList.remove('show');
                                    // Also close any nested dropdowns
                                    otherDropdown.querySelectorAll('.nested-kpi-dropdown').forEach(nested => nested.classList.remove('show'));
                                    // Also close any expanded KRA rows
                                    otherDropdown.querySelectorAll('.kra-row-item.expanded').forEach(kr => {
                                        kr.classList.remove('expanded');
                                    });
                                }
                            }
                        });
                        
                        if (!isExpanded) {
                            this.classList.add('expanded');
                            dropdown.classList.add('show');
                            
                            // Handle KRA rows (first level) - these have nested dropdowns for KPIs
                            const kraRows = dropdown.querySelectorAll('.kra-row-item.has-dropdown');
                            kraRows.forEach(kraRow => {
                                // Remove any existing listeners to prevent duplicates
                                const existingHandler = kraRow.__kraClickHandler;
                                if (existingHandler) {
                                    kraRow.removeEventListener('click', existingHandler);
                                }
                                
                                const clickHandler = function(e) {
                                    e.stopPropagation(); // Prevent triggering parent dropdown close
                                    
                                    const kraIndex = this.getAttribute('data-index');
                                    const kpiDropdown = document.getElementById(`dropdown-${kraIndex}`);
                                    
                                    if (kpiDropdown) {
                                        const isKraExpanded = this.classList.contains('expanded');
                                        
                                        // Close other KRA dropdowns in the same parent
                                        dropdown.querySelectorAll('.kra-row-item.has-dropdown').forEach(kr => {
                                            if (kr !== this) {
                                                kr.classList.remove('expanded', 'active');
                                                const otherKraIndex = kr.getAttribute('data-index');
                                                const otherKpiDropdown = document.getElementById(`dropdown-${otherKraIndex}`);
                                                if (otherKpiDropdown) {
                                                    otherKpiDropdown.classList.remove('show');
                                                }
                                            }
                                        });
                                        
                                        if (!isKraExpanded) {
                                            this.classList.add('expanded', 'active');
                                            kpiDropdown.classList.add('show');
                                        } else {
                                            this.classList.remove('expanded', 'active');
                                            kpiDropdown.classList.remove('show');
                                        }
                                    }
                                };
                                
                                kraRow.addEventListener('click', clickHandler);
                                kraRow.__kraClickHandler = clickHandler; // Store reference
                            });
                            
                            // Handle KPI items (second level) - these trigger chart updates
                            const kpiItems = dropdown.querySelectorAll('.kpi-item');
                            kpiItems.forEach(item => {
                                item.style.cursor = 'pointer';
                                const clickHandler = function(event) {
                                    event.stopPropagation();
                                    
                                    // Highlight this KPI item
                                    dropdown.querySelectorAll('.kpi-item').forEach(i => {
                                        i.style.background = '';
                                        i.classList.remove('active');
                                    });
                                    this.classList.add('active');
                                    
                                    const kpiName = this.querySelector('.sub-operation-label')?.textContent.trim() || 
                                                   this.querySelector('.sub-operation-label')?.textContent.replace('→', '').trim() || '';
                                    const targetStr = this.getAttribute('data-target');
                                    const actualStr = this.getAttribute('data-actual');
                                    const targetValue = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                                    const actualValue = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                                    
                                    // Always ensure the graph container is visible before rendering
                                    ensureChartWrapperVisible();
                                    
                                    // Always call the single, unified chart update function
                                    updateOperationalKpiChart(teamName, kpiName, targetValue, actualValue);
                                };
                                
                                // Remove old listener before adding new one to prevent duplication
                                item.removeEventListener('click', item.__clickHandler);
                                item.addEventListener('click', clickHandler);
                                item.__clickHandler = clickHandler; // Store reference to remove later
                            });
                            
                            // Handle non-KRA, non-KPI sub-operation items (for backward compatibility)
                            const subItems = dropdown.querySelectorAll('.sub-operation-item:not(.kra-row-item):not(.kpi-item)');
                            subItems.forEach(item => {
                                item.style.cursor = 'pointer';
                                const clickHandler = function(event) {
                                    event.stopPropagation();
                                    
                                    subItems.forEach(i => {
                                        i.style.background = '';
                                        i.classList.remove('active');
                                    });
                                    this.classList.add('active');
                                    
                                    const kpiName = this.querySelector('.sub-operation-label')?.textContent.replace('→', '').trim() || '';
                                    const targetStr = this.getAttribute('data-target');
                                    const actualStr = this.getAttribute('data-actual');
                                    const targetValue = targetStr && targetStr !== '' ? parseFloat(targetStr) : null;
                                    const actualValue = actualStr && actualStr !== '' ? parseFloat(actualStr) : null;
                                    
                                    // Always ensure the graph container is visible before rendering
                                    ensureChartWrapperVisible();
                                    
                                    // Always call the single, unified chart update function
                                    updateOperationalKpiChart(teamName, kpiName, targetValue, actualValue);
                                };
                                
                                // Remove old listener before adding new one to prevent duplication
                                item.removeEventListener('click', item.__clickHandler);
                                item.addEventListener('click', clickHandler);
                                item.__clickHandler = clickHandler; // Store reference to remove later
                            });
                        } else {
                            // Collapse the dropdown when clicking again
                            this.classList.remove('expanded');
                            dropdown.classList.remove('show');
                            // Also close any nested KPI dropdowns
                            dropdown.querySelectorAll('.nested-kpi-dropdown').forEach(nested => nested.classList.remove('show'));
                            // Also close any expanded KRA rows
                            dropdown.querySelectorAll('.kra-row-item.expanded').forEach(kr => {
                                kr.classList.remove('expanded');
                            });
                            
                            if (isAnyTeamKra && owner) {
                                const kraNameToUse = operationName || owner;
                                updateTeamKraChartsGeneric(teamName, null, kraNameToUse, target, actual, owner);
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

            const leaderCards = document.querySelectorAll('.leader-card');
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

                            // Keep report graph visible for auto-triggered selections
                            ensureChartWrapperVisible();

                            // Click the row to trigger the graph update
                            setTimeout(() => {
                                kpiRow.click();
                                // Fallback visibility check
                                setTimeout(() => {
                                    ensureChartWrapperVisible();
                                }, 100);
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
                                    
                                    // Ensure chart container is visible for dropdown auto-clicks
                                    ensureChartWrapperVisible();
                                    
                                    setTimeout(() => {
                                        targetSubOperation.click();
                                        // Fallback visibility check
                                        setTimeout(() => {
                                            ensureChartWrapperVisible();
                                        }, 100);
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

        // Function to calculate team overall score as percentage for current month
        // Based on sum of all Lag and Lead KPI targets and actuals
        function calculateTeamAverage(teamName) {
            const currentMonthIndex = new Date().getMonth();
            
            // Get all Lag KPIs for this team
            const lagKpis = teamOperationsData[teamName] || [];
            
            // Get all Lead KPIs for this team
            const leadKpis = leadKpiData[teamName] || [];
            
            let totalTarget = 0;
            let totalActual = 0;
            let validCount = 0;
            
            // Helper function to get KPI value for current month
            const getKpiValue = (kpiName, monthlySeries, periodData) => {
                // Try monthly series first
                if (monthlySeries && monthlySeries.target && monthlySeries.actual &&
                    Array.isArray(monthlySeries.target) && Array.isArray(monthlySeries.actual) &&
                    monthlySeries.target.length > currentMonthIndex && monthlySeries.actual.length > currentMonthIndex) {
                    const targetValue = monthlySeries.target[currentMonthIndex];
                    const actualValue = monthlySeries.actual[currentMonthIndex];
                    
                    if (typeof targetValue === 'number' && typeof actualValue === 'number' && 
                        !Number.isNaN(targetValue) && !Number.isNaN(actualValue) && targetValue !== 0) {
                        return { target: targetValue, actual: actualValue };
                    }
                }
                
                // Fallback to period data
                if (periodData && typeof periodData.target === 'number' && typeof periodData.actual === 'number' &&
                    !Number.isNaN(periodData.target) && !Number.isNaN(periodData.actual) && periodData.target !== 0) {
                    return { target: periodData.target, actual: periodData.actual };
                }
                
                return null;
            };
            
            // Process Lag KPIs - sum all targets and actuals
            lagKpis.forEach(kpi => {
                const kpiName = kpi.role;
                
                // Try to get monthly series data first
                const monthlySeries = technicalMonthlySeries[kpiName] 
                    || accountingMonthlySeries[kpiName]
                    || lradMonthlySeries[kpiName]
                    || dcMonthlySeries[kpiName]
                    || opportunityMonthlySeries[kpiName]
                    || marcomMonthlySeries[kpiName]
                    || gatheringMonthlySeries[kpiName]
                    || operationsMonthlySeries[kpiName];
                
                // Get period data as fallback
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth() + 1; // 1-12
                const periodKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
                const periodData = technicalExpensesData[teamName]?.[kpiName]?.[periodKey];
                
                const kpiValues = getKpiValue(kpiName, monthlySeries, periodData);
                if (kpiValues) {
                    totalTarget += kpiValues.target;
                    totalActual += kpiValues.actual;
                    validCount++;
                }
            });
            
            // Process Lead KPIs - sum all targets and actuals
            leadKpis.forEach(kpi => {
                const kpiName = kpi.role;
                
                // Try to get monthly series data first
                const monthlySeries = lradLeadMonthlySeries[kpiName]
                    || qualityLeadMonthlySeries[kpiName]
                    || dcLeadMonthlySeries[kpiName]
                    || itLeadMonthlySeries[kpiName]
                    || opportunityLeadMonthlySeries[kpiName]
                    || marcomLeadMonthlySeries[kpiName]
                    || auditLeadMonthlySeries[kpiName]
                    || gatheringLeadMonthlySeries[kpiName]
                    || operationsLeadMonthlySeries[kpiName];
                
                // Get period data as fallback
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth() + 1; // 1-12
                const periodKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
                const periodData = leadKpiExpensesData[teamName]?.[kpiName]?.[periodKey];
                
                const kpiValues = getKpiValue(kpiName, monthlySeries, periodData);
                if (kpiValues) {
                    totalTarget += kpiValues.target;
                    totalActual += kpiValues.actual;
                    validCount++;
                }
            });
            
            if (validCount === 0 || totalTarget === 0) return null;
            
            // Calculate overall score as percentage: (Total Actual / Total Target) * 100
            // This gives us the performance percentage based on sum of all targets and actuals
            const overallScore = (totalActual / totalTarget) * 100;
            
            return {
                overallScore: overallScore,
                totalTarget: totalTarget,
                totalActual: totalActual,
                kpiCount: validCount
            };
        }
        
        // Function to render team average cards
        function renderTeamAverageCards() {
            const container = document.getElementById('teamAverageCards');
            if (!container) return;
            
            const teams = [
                { name: 'Technical Team', icon: 'bi-gear-fill' },
                { name: 'Accounting Team', icon: 'bi-calculator-fill' },
                { name: 'LRAD Team', icon: 'bi-broadcast-pin' },
                { name: 'Quality Team', icon: 'bi-patch-check-fill' },
                { name: 'DC Team', icon: 'bi-hdd-stack-fill' },
                { name: 'IT Team', icon: 'bi-laptop' },
                { name: 'Opportunity Team', icon: 'bi-bullseye' },
                { name: 'Marcom Team', icon: 'bi-megaphone-fill' },
                { name: 'Audit Team', icon: 'bi-clipboard-check-fill' },
                { name: 'Gathering Team', icon: 'bi-graph-up-arrow' },
                { name: 'Operations Team', icon: 'bi-lightning-charge-fill' }
            ];
            
            container.innerHTML = '';
            
            teams.forEach(team => {
                const average = calculateTeamAverage(team.name);
                const card = document.createElement('div');
                card.className = 'leader-card clickable-stat-card-carousel team-score-card';
                card.setAttribute('data-team', team.name);
                card.setAttribute('data-name', '');
                card.setAttribute('data-title', team.name);
                card.setAttribute('data-roles', '');
                card.setAttribute('data-contributions', '');
                card.setAttribute('data-icon', `bi ${team.icon}`);
                
                let scorePercentage = 0;
                const currentDate = new Date();
                const currentMonthName = chartFullMonths[currentDate.getMonth()];
                
                if (average) {
                    scorePercentage = Math.max(0, Math.min(100, average.overallScore)); // Clamp between 0-100
                }
                
                const scoreColor = getTeamScoreColor(scorePercentage);

                card.innerHTML = `
                    <div class="leader-title leader-title-inline">
                        <div class="team-score-subtext">as of ${currentMonthName}</div>
                        <div
                            class="leader-icon team-score-icon"
                            style="--score-color:${scoreColor};--score-pct:${scorePercentage}; background: conic-gradient(${scoreColor} 0% ${scorePercentage}%, rgba(0,0,0,0.08) ${scorePercentage}%, rgba(0,0,0,0.08) 100%);"
                        >
                            <span class="team-score-text">${scorePercentage.toFixed(0)}%</span>
                        </div>
                        <div class="leader-title-text">
                            <div class="leader-icon1">
                                <i class="bi ${team.icon}" aria-hidden="true"></i>
                            </div>
                            <span class="leader-title-name">${team.name}</span>
                        </div>
                    </div>
                    <div class="leader-name"></div>
                `;
                
                container.appendChild(card);
            });
            
            // Re-attach click handlers after rendering
            attachLeaderCardHandlers();
        }

        function getTeamScoreColor(score) {
            const value = Math.max(0, Math.min(100, Number(score) || 0));
            const saturation = 40 + (value * 0.35); // 40-75
            const lightness = 78 - (value * 0.25);  // 78-53
            return `hsl(90, ${saturation}%, ${lightness}%)`;
        }

        window.addEventListener('DOMContentLoaded', () => {
            renderTeamAverageCards(); // Render team average cards first
            initializeReports();
            initTeamPerformanceChart();
            resetTeamPerformanceVisuals({
                infoMessage: 'Select a KPI to view its target vs actual details.'
            });
            resetReportsSection(); // Set initial title and subtitle based on current view (after resetTeamPerformanceVisuals)
            refreshOperationsContent();
            initScoreboardToggle();
            applyIncomingLeaderHighlight();
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
