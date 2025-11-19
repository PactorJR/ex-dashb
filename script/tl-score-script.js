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
            'amanda-white': {
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
            'marcus-chen': {
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
            'emily-rodriguez': {
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
            'amanda-white': {
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
            'marcus-chen': {
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
        const teamOperationsData = {
            'sarah-mitchell': [
                { role: 'FS Target : Repairs & Maintenance (Labor) (TECHNICAL) Expense', owner: 'II. Technical Team Leader', kra: '-' },
                { role: 'FS Target : Repairs & Maintenance (Materials) (TECHNICAL) Expense', owner: 'II. Technical Team Leader', kra: '-' }
            ],
            'marcus-chen': [
                { role: 'FS Target : Total Operating Expense', owner: 'I. Accounting Team Leader', kra: '-' },
                { role: 'FS Target : Total Gross Revenue', owner: 'I. Accounting Team Leader', kra: '-' },
                { role: 'FS Target : Net Profit', owner: 'I. Accounting Team Leader', kra: '-' },
                { role: '% Collection : All Sites', owner: 'II. Accounting Integrator', kra: '-' }
            ],
            'james-peterson': [
                { role: 'FS Target : Salary Expense', owner: 'I. Lotuszen Relations & Development Team Leader', kra: '-' }
            ],
            'emily-rodriguez': [],
            'david-patterson': [
                { role: 'FS Target : Repairs & Maintenance (Labor) (DCD) Expense', owner: 'I. Design & Construction Development Team Leader', kra: '-' },
                { role: 'FS Target : Repairs & Maintenance (Materials) (DCD) Expense', owner: 'I. Design & Construction Development Team Leader', kra: '-' }
            ],
            'jennifer-lee': [],
            'robert-thompson': [
                { role: '% Occupancy: Commercial (Units)', owner: 'I. Opportunity Team Leader', kra: '-' },
                { role: '% Occupancy: Commercial (Area)', owner: 'I. Opportunity Team Leader', kra: '-' },
                { role: '% Occupancy: Commercial (PValue)', owner: 'I. Opportunity Team Leader', kra: '-' },
                { role: 'FS Target : Rental Income', owner: 'I. Opportunity Team Leader', kra: '-' }
            ],
            'amanda-white': [
                { role: 'FS Target : Marketing Expense (+Gifts & Decor) (MARCOM)', owner: 'I. Marketing Communications Team Leader', kra: '-' }
            ],
            'michael-johnson': [],
            'lisa-anderson': [
                { role: '% Occupancy: Venue (Hours)', owner: 'I. Gathering Team Leader', kra: '-' },
                { role: '% Occupancy: Venue (PValue)', owner: 'I. Gathering Team Leader', kra: '-' },
                { role: '% Occupancy: Studio (Hours)', owner: 'I. Gathering Team Leader', kra: '-' },
                { role: '% Occupancy: Studio (PValue)', owner: 'I. Gathering Team Leader', kra: '-' },
                { role: '% Occupancy: Sports Arena (Hours)', owner: 'I. Gathering Team Leader', kra: '-' },
                { role: '% Occupancy: Sports Arena (PValue)', owner: 'I. Gathering Team Leader', kra: '-' },
                { role: 'FS Target : Marketing Expense (+Gifts & Decor) (GATHERING)', owner: 'I. Gathering Team Leader', kra: '-' }
            ],
            'kevin-martinez': [
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
            'sarah-mitchell': [
                { role: '# of Breakdowns : Engineering Department', owner: 'III. Engineering Integrator - Actual', kra: '-' },
                { role: '% Predictive Maintenance Compliance', owner: 'III. Engineering Integrator - Actual', kra: '-' },
                { role: '% Emergency Response Within SLA', owner: 'III. Engineering Integrator - Actual', kra: '-' }
            ],
            'james-peterson': [
                { role: '% On time & Accurate - LMDB', owner: 'IX. Lotuszen Master Database Custodian', kra: '-' },
                { role: '% On time & Accurate - Recorded: Scores (KPI)', owner: 'IX. Lotuszen Master Database Custodian', kra: '-' },
                { role: '% On time & Accurate - Recorded: Stories', owner: 'IX. Lotuszen Master Database Custodian', kra: '-' },
                { role: '% Planned vs Actual - Regular Events Plan: Lotuszen', owner: 'VIII. Lotuszen Development Integrator', kra: '-' },
                { role: '% Planned vs Actual - Culture Dev\'t Activities Plan: Lotuszen', owner: 'VIII. Lotuszen Development Integrator', kra: '-' },
                { role: '% Complete & Updated : LMDB', owner: 'VIII. Lotuszen Development Integrator', kra: '-' }
            ],
            'emily-rodriguez': [
                { role: 'Score/Evaluation/NPS : SMD Projects', owner: 'I. Quality Team Leader', kra: '-' },
                { role: 'Score/Evaluation/NPS : SID Projects', owner: 'I. Quality Team Leader', kra: '-' },
                { role: '% Planned vs Actual : SMD Projects', owner: 'II. System Management Integrator', kra: '-' },
                { role: '% Planned vs Actual : SID Projects', owner: 'IV. System Innovation Integrator', kra: '-' }
                ],
            'david-patterson': [
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
            'jennifer-lee': [
                { role: '# of Breakdowns : IT', owner: 'II. IT Integrator', kra: '-' }
            ],
            'robert-thompson': [
                { role: '% Planned vs Actual - Tenant Mix Plan', owner: 'II. Account Specialist Integrator - Commercial', kra: '-' },
                { role: '# of Closed Inquiry/Offline Inquiries Received: Commercial', owner: 'III. Account Specialist - Commercial', kra: '-' },
                { role: '# of Closed Prospects/Target Prospects: (Commercial) Anchor', owner: 'V. Community Specialist Coordinator - Commercial', kra: '-' },
                { role: '# of Closed Prospects/Priority Vacant Spaces: Anchor', owner: 'V. Community Specialist Coordinator - Commercial', kra: '-' },
                { role: '# of Closed Prospects/Target Prospects: (Commercial) Regular', owner: 'VI. Community Specialist - Commercial', kra: '-' },
                { role: '# of Closed Prospects/Priority Vacant Spaces: Regular', owner: 'VI. Community Specialist - Commercial', kra: '-' },
                { role: '% Complete & Updated: Tenant Requirements', owner: 'VIII. Account Document Custodian', kra: '-' },
                { role: '% Pull Out - Aversion', owner: 'VIII. Account Document Custodian', kra: '-' }
            ],
            'amanda-white': [
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
            'michael-johnson': [
                { role: '% Addressed : I.C.A.R.E (All Teams)', owner: 'VI. iCARE Custodian', kra: '-' },
                { role: '% On time & Accurate : PropMan Module', owner: 'VI. PropMan Custodian', kra: '-' }
            ],
            'lisa-anderson': [
                { role: '# of Average Daily Foot Traffic', owner: 'I. Gathering Team Leader', kra: '-' },
                { role: '# of 500 pax or more Event/month (All Sites)', owner: 'I. Gathering Team Leader', kra: '-' },
                { role: '# of Closed Inquiry/Offline Inquiries Received: Gathering', owner: 'III. Gathering Specialist', kra: '-' }
            ],
            'kevin-martinez': [
                { role: '% Addressed : Team/Section\'s I.C.A.R.E', owner: 'II. Building Admin. - Operations Integrator', kra: '-' },
                { role: '% Score : Site Quality (by Auditor)', owner: 'II. Building Admin. - Operations Integrator', kra: '-' },
                { role: '% Insurance Claimed vs Reported', owner: 'II. Building Admin. - Operations Integrator', kra: '-' },
                { role: '% Onboarded Tenants : All Tenants/Reserved (New + Existing)', owner: 'III. Tenant Relations & Operations Coordinator', kra: '-' }
            ]
        };

        // Technical expenses data by period (year-month) - Lag KPIs
        const DEFAULT_PERIOD_KEY = '2025-11';
        const chartMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
                valueType
            };
        }

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

        function getAggregateDisplayData(kpiName, targetNumeric, actualNumeric, isPercentageKpi = false) {
            const monthlySeries = technicalMonthlySeries[kpiName];
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
            'sarah-mitchell': generateTechnicalLagKpiData(),
            'marcus-chen': {
                'FS Target : Total Operating Expense': {
                    '2025-11': {
                        target: 22956972.14,
                        actual: 21543210.50
                    }
                },
                'FS Target : Total Gross Revenue': {
                    '2025-11': {
                        target: 37264091.75,
                        actual: 38924567.20
                    }
                },
                'FS Target : Net Profit': {
                    '2025-11': {
                        target: 10455576.64,
                        actual: 11234589.30
                    }
                },
                '% Collection : All Sites': {
                    '2025-11': {
                        target: 87.5,
                        actual: 91.2
                    }
                }
            },
            'david-patterson': {
                'FS Target : Repairs & Maintenance (Labor) (DCD) Expense': {
                    '2025-11': {
                        target: 145000,
                        actual: 138200
                    }
                },
                'FS Target : Repairs & Maintenance (Materials) (DCD) Expense': {
                    '2025-11': {
                        target: 98000,
                        actual: 102500
                    }
                }
            },
            'robert-thompson': {
                '% Occupancy: Commercial (Units)': {
                    '2025-11': {
                        target: 87.5,
                        actual: 89.2
                    }
                },
                '% Occupancy: Commercial (Area)': {
                    '2025-11': {
                        target: 85.0,
                        actual: 86.8
                    }
                },
                '% Occupancy: Commercial (PValue)': {
                    '2025-11': {
                        target: 82.5,
                        actual: 84.3
                    }
                },
                'FS Target : Rental Income': {
                    '2025-11': {
                        target: 12500000,
                        actual: 12850000
                    }
                }
            },
            'amanda-white': {
                'FS Target : Marketing Expense (+Gifts & Decor) (MARCOM)': {
                    '2025-11': {
                        target: 850000,
                        actual: 782000
                    }
                }
            },
            'lisa-anderson': {
                '% Occupancy: Venue (Hours)': {
                    '2025-11': {
                        target: 75.0,
                        actual: 78.5
                    }
                },
                '% Occupancy: Venue (PValue)': {
                    '2025-11': {
                        target: 72.5,
                        actual: 75.8
                    }
                },
                '% Occupancy: Studio (Hours)': {
                    '2025-11': {
                        target: 68.0,
                        actual: 71.2
                    }
                },
                '% Occupancy: Studio (PValue)': {
                    '2025-11': {
                        target: 65.5,
                        actual: 68.7
                    }
                },
                '% Occupancy: Sports Arena (Hours)': {
                    '2025-11': {
                        target: 80.0,
                        actual: 83.2
                    }
                },
                '% Occupancy: Sports Arena (PValue)': {
                    '2025-11': {
                        target: 77.5,
                        actual: 80.3
                    }
                },
                'FS Target : Marketing Expense (+Gifts & Decor) (GATHERING)': {
                    '2025-11': {
                        target: 650000,
                        actual: 612000
                    }
                }
            },
            'kevin-martinez': {
                'FS Target : Electricity Expense': {
                    '2025-11': {
                        target: 1250000,
                        actual: 1185000
                    }
                },
                'FS Target : Water Expense': {
                    '2025-11': {
                        target: 450000,
                        actual: 432000
                    }
                },
                'FS Target : Security Expense': {
                    '2025-11': {
                        target: 850000,
                        actual: 825000
                    }
                },
                'FS Target : Agency Expense': {
                    '2025-11': {
                        target: 320000,
                        actual: 298000
                    }
                },
                'FS Target : Parking Income': {
                    '2025-11': {
                        target: 2800000,
                        actual: 2950000
                    }
                }
            },
            'james-peterson': {
                'FS Target : Salary Expense': {
                    '2025-11': {
                        target: 1850000,
                        actual: 1725000
                    }
                }
            }
        };

        // Lead KPI data by period (year-month)
        function generateLeadTotals(leaderId) {
            const leadKpis = leadKpiData[leaderId] || [];
            let totalTarget = 0;
            let totalActual = 0;
            let hasNumericValues = false;
            let formatType = null;
            let mixedFormats = false;

            leadKpis.forEach(kpi => {
                const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
                const periodData = leadKpiExpensesData[leaderId]?.[kpi.role]?.[periodKey];
                const targetNumeric = periodData ? parseNumericValue(periodData.target) : null;
                const actualNumeric = periodData ? parseNumericValue(periodData.actual) : null;
                const isPercentageKpi = kpi.role.includes('%') || kpi.role.toLowerCase().includes('percent');
                const aggregateData = getAggregateDisplayData(kpi.role, targetNumeric, actualNumeric, isPercentageKpi);

                if (typeof aggregateData.aggregateTarget === 'number') {
                    totalTarget += aggregateData.aggregateTarget;
                    hasNumericValues = true;
                }
                if (typeof aggregateData.aggregateActual === 'number') {
                    totalActual += aggregateData.aggregateActual;
                    hasNumericValues = true;
                }

                if (!formatType) {
                    formatType = aggregateData.valueType;
                } else if (formatType !== aggregateData.valueType) {
                    mixedFormats = true;
                }
            });

            if (!hasNumericValues) {
                return { target: null, actual: null, formatType: null };
            }

            return {
                target: totalTarget,
                actual: totalActual,
                formatType: mixedFormats ? 'mixed' : formatType
            };
        }

        const leadKpiExpensesData = {
            'sarah-mitchell': generateTechnicalLeadKpiData(),
            'james-peterson': {
                '% On time & Accurate - LMDB': {
                    '2025-11': {
                        target: 95.0,
                        actual: 97.5
                    }
                },
                '% On time & Accurate - Recorded: Scores (KPI)': {
                    '2025-11': {
                        target: 92.0,
                        actual: 94.8
                    }
                },
                '% On time & Accurate - Recorded: Stories': {
                    '2025-11': {
                        target: 88.5,
                        actual: 91.2
                    }
                },
                '% Planned vs Actual - Regular Events Plan: Lotuszen': {
                    '2025-11': {
                        target: 85.0,
                        actual: 87.3
                    }
                },
                '% Planned vs Actual - Culture Dev\'t Activities Plan: Lotuszen': {
                    '2025-11': {
                        target: 90.0,
                        actual: 92.6
                    }
                },
                '% Complete & Updated : LMDB': {
                    '2025-11': {
                        target: 93.5,
                        actual: 96.1
                    }
                }
            },
            'emily-rodriguez': {
                'Score/Evaluation/NPS : SMD Projects': {
                    '2025-11': {
                        target: 87.0,
                        actual: 91.5
                    }
                },
                'Score/Evaluation/NPS : SID Projects': {
                    '2025-11': {
                        target: 84.0,
                        actual: 88.2
                    }
                },
                '% Planned vs Actual : SMD Projects': {
                    '2025-11': {
                        target: 92.5,
                        actual: 95.3
                    }
                },
                '% Planned vs Actual : SID Projects': {
                    '2025-11': {
                        target: 89.0,
                        actual: 91.7
                    }
                }
            },
            'david-patterson': {
                '% Within Budget : Projects (E&D)': {
                    '2025-11': {
                        target: 94.5,
                        actual: 96.8
                    }
                },
                '% Within Budget : Projects (IP)': {
                    '2025-11': {
                        target: 91.0,
                        actual: 93.2
                    }
                },
                '% Within Budget : Projects (PMR)': {
                    '2025-11': {
                        target: 88.5,
                        actual: 90.7
                    }
                },
                '% Within Budget : Projects (Construction)': {
                    '2025-11': {
                        target: 92.0,
                        actual: 94.5
                    }
                },
                '% Within Budget : Projects (Landscape)': {
                    '2025-11': {
                        target: 89.5,
                        actual: 91.8
                    }
                },
                '% Planned vs Actual : Projects (E&D)': {
                    '2025-11': {
                        target: 87.0,
                        actual: 89.3
                    }
                },
                '% Planned vs Actual : Projects (IP)': {
                    '2025-11': {
                        target: 85.5,
                        actual: 87.8
                    }
                },
                '% Planned vs Actual : Projects (PMR)': {
                    '2025-11': {
                        target: 83.0,
                        actual: 85.2
                    }
                },
                '% Planned vs Actual : Projects (Construction)': {
                    '2025-11': {
                        target: 86.5,
                        actual: 88.9
                    }
                },
                '% Planned vs Actual : Projects (Landscape)': {
                    '2025-11': {
                        target: 84.0,
                        actual: 86.3
                    }
                },
                '% Planned vs Actual : JO (MST)': {
                    '2025-11': {
                        target: 90.0,
                        actual: 92.4
                    }
                },
                '% Planned vs Actual : JO (E&D Fab)': {
                    '2025-11': {
                        target: 88.5,
                        actual: 90.7
                    }
                }
            },
            'jennifer-lee': {
                '# of Breakdowns : IT': {
                    '2025-11': {
                        target: 8,
                        actual: 5
                    }
                }
            },
            'robert-thompson': {
                '% Planned vs Actual - Tenant Mix Plan': {
                    '2025-11': {
                        target: 90.0,
                        actual: 92.5
                    }
                },
                '# of Closed Inquiry/Offline Inquiries Received: Commercial': {
                    '2025-11': {
                        target: 45,
                        actual: 52
                    }
                },
                '# of Closed Prospects/Target Prospects: (Commercial) Anchor': {
                    '2025-11': {
                        target: 8,
                        actual: 10
                    }
                },
                '# of Closed Prospects/Priority Vacant Spaces: Anchor': {
                    '2025-11': {
                        target: 5,
                        actual: 6
                    }
                },
                '# of Closed Prospects/Target Prospects: (Commercial) Regular': {
                    '2025-11': {
                        target: 15,
                        actual: 18
                    }
                },
                '# of Closed Prospects/Priority Vacant Spaces: Regular': {
                    '2025-11': {
                        target: 12,
                        actual: 14
                    }
                },
                '% Complete & Updated: Tenant Requirements': {
                    '2025-11': {
                        target: 95.0,
                        actual: 97.2
                    }
                },
                '% Pull Out - Aversion': {
                    '2025-11': {
                        target: 88.0,
                        actual: 90.5
                    }
                }
            },
            'amanda-white': {
                '% Increase : Facebook Page Reach (per Month per Page)': {
                    '2025-11': {
                        target: 12.5,
                        actual: 15.8
                    }
                },
                '% Increase : Facebook Page Followers (per Month per Page)': {
                    '2025-11': {
                        target: 8.0,
                        actual: 10.2
                    }
                },
                '# of Inquiries : Offline for (Commercial Spaces)': {
                    '2025-11': {
                        target: 25,
                        actual: 32
                    }
                },
                '# of Inquiries : Offline for Gatherings (Event Venues)': {
                    '2025-11': {
                        target: 18,
                        actual: 22
                    }
                },
                '# of Inquiries : Offline for Gatherings (Sports Arena)': {
                    '2025-11': {
                        target: 12,
                        actual: 15
                    }
                },
                '# of Inquiries : Offline for Gatherings (Handaan)': {
                    '2025-11': {
                        target: 20,
                        actual: 24
                    }
                },
                '# of Inquiries : Offline for Gatherings (SS)': {
                    '2025-11': {
                        target: 15,
                        actual: 18
                    }
                },
                '# of Inquiries : Offline for Gatherings (KS)': {
                    '2025-11': {
                        target: 10,
                        actual: 13
                    }
                },
                '# of Inquiries : Offline for Gatherings (Studio)': {
                    '2025-11': {
                        target: 8,
                        actual: 11
                    }
                }
            },
            'michael-johnson': {
                '% Addressed : I.C.A.R.E (All Teams)': {
                    '2025-11': {
                        target: 95.0,
                        actual: 97.5
                    }
                },
                '% On time & Accurate : PropMan Module': {
                    '2025-11': {
                        target: 92.0,
                        actual: 94.8
                    }
                }
            },
            'lisa-anderson': {
                '# of Average Daily Foot Traffic': {
                    '2025-11': {
                        target: 450,
                        actual: 520
                    }
                },
                '# of 500 pax or more Event/month (All Sites)': {
                    '2025-11': {
                        target: 8,
                        actual: 10
                    }
                },
                '# of Closed Inquiry/Offline Inquiries Received: Gathering': {
                    '2025-11': {
                        target: 35,
                        actual: 42
                    }
                }
            },
            'kevin-martinez': {
                '% Addressed : Team/Section\'s I.C.A.R.E': {
                    '2025-11': {
                        target: 96.0,
                        actual: 98.2
                    }
                },
                '% Score : Site Quality (by Auditor)': {
                    '2025-11': {
                        target: 90.0,
                        actual: 92.5
                    }
                },
                '% Insurance Claimed vs Reported': {
                    '2025-11': {
                        target: 85.0,
                        actual: 87.8
                    }
                },
                '% Onboarded Tenants : All Tenants/Reserved (New + Existing)': {
                    '2025-11': {
                        target: 88.5,
                        actual: 91.2
                    }
                }
            }
        };

        // Helpers to compute weights and render the Team Metrics Overview chart
        function parsePercentToNumber(text) {
            if (typeof text !== 'string') return 0;
            const match = text.match(/-?\d+(\.\d+)?/);
            return match ? Number(match[0]) : 0;
        }

        function computeWeightsSummary(leaderId) {
            const roles = teamOperationsData[leaderId] || [];
            const roleToWeight = {};
            let overall = 0;

            roles.forEach(r => {
                const items = teamDropdownData[leaderId]?.[r.role] || [];
                const roleSum = items.reduce((sum, it) => sum + parsePercentToNumber(it.weight), 0);
                roleToWeight[r.role] = roleSum;
                overall += roleSum;
            });

            return { overall, roleToWeight };
        }

        function updateWeightsOverview(leaderId, selectedRole = null) {
            // Find the "Team Metrics Overview" card's SVG (third report-card)
            const reportCards = document.querySelectorAll('.report-card');
            const metricsCard = reportCards[2];
            if (!metricsCard) return;
            const svg = metricsCard.querySelector('svg.line-chart');
            if (!svg) return;

            const { overall, roleToWeight } = computeWeightsSummary(leaderId);
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

        function updatePerformanceGraph(leaderId, operationRole, kpiName) {
        const data = performanceData[leaderId]?.[operationRole]?.[kpiName];
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
        let selectedLeader = null;
        let selectedLeaderData = null;
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
                    if (currentOperationsView === target) {
                        return;
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

        function toggleSections() {
            currentView = currentView === 'operations' ? 'profile' : 'operations';
            
            sectionSwitch.classList.toggle('active');
            sectionSwitch2.classList.toggle('active');
            
            if (currentView === 'operations') {
                operationsSection.classList.remove('hidden');
                profileSection.classList.add('hidden');
                if (selectedLeader) {
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
                if (selectedLeader) {
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
                
                selectedLeader = this.getAttribute('data-leader');
                selectedLeaderData = {
                    name: this.getAttribute('data-name'),
                    title: this.getAttribute('data-title'),
                    roles: this.getAttribute('data-roles'),
                    contributions: this.getAttribute('data-contributions'),
                    icon: this.getAttribute('data-icon')
                };

                if (selectedLeader === 'sarah-mitchell') {
                    resetTeamPerformanceVisuals({
                        infoMessage: 'Select a Technical KPI to view its detailed monthly breakdown.'
                    });
                } else {
                    resetTeamPerformanceVisuals({
                        infoMessage: 'Detailed KPI visualization currently supports the Technical Team. Pick a Technical KPI to see its monthly data.'
                    });
                }
                
                if (currentView === 'operations') {
                    showReportCards();
                } else {
                    showLegendOnly();
                }
                
                // Reset to instruction message when selecting a leader
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
                updateLeadKpiSection(selectedLeader, selectedLeaderData.title);
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

        function updateOperationsSection(leaderId, teamName) {
        const operationsContent = document.getElementById('operationsContent');
        const operations = teamOperationsData[leaderId] || [];
        
        if (operations.length === 0) {
            operationsContent.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <div class="empty-state-text">No Lag KPIs data available</div>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="Search operations...">
            </div>
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
            <div id="membersList">
        `;
        
        operations.forEach((op, index) => {
            const hasDropdown = teamDropdownData[leaderId] && teamDropdownData[leaderId][op.role];
            const dropdownClass = hasDropdown ? 'has-dropdown' : '';
            
            // Get period data if available
            const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
            const periodData = technicalExpensesData[leaderId]?.[op.role]?.[periodKey];
            
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
                const dropdownItems = teamDropdownData[leaderId][op.role];
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
        attachDropdownFunctionality(leaderId);
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

        function updateTeamMembersSection(leaderId, teamName) {
            const operationsContent = document.getElementById('operationsContent');
            if (!operationsContent) {
                return;
            }
            const members = teamMembersData[teamName] || [];

            if (members.length === 0) {
                operationsContent.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">👥</div>
                        <div class="empty-state-text">No team members data available for ${teamName}</div>
                    </div>
                `;
                return;
            }

            let html = `
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Search team members...">
                </div>
                <div class="table-header">
                    <div>Employee Name</div>
                    <div>Team</div>
                    <div>Role KPI Owner</div>
                    <div>KPI</div>
                    <div>Target</div>
                    <div>Actual</div>
                </div>
                <div id="membersList">
            `;

            members.forEach(member => {
                const initials = generateInitials(member.name);
                const targetValue = typeof member.targetValue === 'number' ? member.targetValue : '';
                const actualValue = typeof member.actualValue === 'number' ? member.actualValue : '';
                const targetLabel = member.targetLabel ?? (targetValue !== '' ? targetValue : '-');
                const actualLabel = member.actualLabel ?? (actualValue !== '' ? actualValue : '-');

                html += `
                    <div class="member-row member-view-row"
                         data-name="${member.name.toLowerCase()}"
                         data-team="${teamName.toLowerCase()}"
                         data-operation="${member.kpi}"
                         data-target="${targetValue}"
                         data-actual="${actualValue}"
                         style="cursor: pointer;">
                        <div class="member-info">
                            <div class="member-avatar">${initials}</div>
                            <div class="member-name">${member.name}</div>
                        </div>
                        <div>${teamName}</div>
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

            if (!selectedLeader || !selectedLeaderData) {
                operationsSection?.classList.toggle('members-view-active', isMembersView);
                if (operationsSectionTitle) {
                    operationsSectionTitle.textContent = isMembersView ? 'Team Members' : 'Lag KPIs';
                }
                if (operationsSectionSubtitle) {
                    operationsSectionSubtitle.textContent = isMembersView
                        ? 'Select a team leader to view their team members'
                        : 'Select a team leader to view KPIs';
                }
                operationsContent.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">👥</div>
                        <div class="empty-state-text">${isMembersView
                            ? 'Select a team leader to view their team members'
                            : 'Select a team leader to view lag KPIs or their team members'}</div>
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
                operationsSectionSubtitle.textContent = isMembersView
                    ? `People reporting under ${selectedLeaderData.name}`
                    : `${selectedLeaderData.title} lag KPIs`;
            }

            if (isMembersView) {
                updateTeamMembersSection(selectedLeader, selectedLeaderData.title);
            } else {
                updateOperationsSection(selectedLeader, selectedLeaderData.title);
            }

            updateScoreboardToggleState();
        }

        function updateLeadKpiSection(leaderId, teamName) {
            const profileContent = document.getElementById('profileContent');
            const leadKpis = leadKpiData[leaderId] || [];
            
            if (leadKpis.length === 0) {
                profileContent.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">📊</div>
                            <div class="empty-state-text">No Lead KPIs data available</div>
                    </div>
                `;
                return;
            }
        
            let html = `
                <div class="search-box">
                    <input type="text" id="searchInputLead" placeholder="Search operations...">
            </div>
                <div class="table-header">
                    <div>Operation KPI</div>
                    <div>KPI Owner</div>
                    <div class="header-group">
                        <div class="header-main">TOTAL TARGET</div>
                        <div class="header-value" id="leadTotalsTarget">—</div>
                    </div>
                    <div class="header-group">
                        <div class="header-main">TOTAL ACTUAL</div>
                        <div class="header-value" id="leadTotalsActual">—</div>
                    </div>
                </div>
                <div id="leadKpiList">
            `;
            
            leadKpis.forEach((kpi, index) => {
            // Get period data if available
            const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
            const periodData = leadKpiExpensesData[leaderId]?.[kpi.role]?.[periodKey];
            
            const targetNumeric = periodData ? parseNumericValue(periodData.target) : null;
            const actualNumeric = periodData ? parseNumericValue(periodData.actual) : null;
            const isPercentageKpi = kpi.role.includes('%') || kpi.role.toLowerCase().includes('percent');
            const aggregateData = getAggregateDisplayData(kpi.role, targetNumeric, actualNumeric, isPercentageKpi);
            const targetValue = aggregateData.targetLabel;
            const actualValue = aggregateData.actualLabel;
            
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
                            <div class="aggregate-value">${targetValue}</div>
                        </div>
                        <div class="actual-group">
                            <div class="aggregate-value">${actualValue}</div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            profileContent.innerHTML = html;

            const leadTotals = generateLeadTotals(leaderId);
        if (leadTotals) {
                const totalTargetEl = document.getElementById('leadTotalsTarget');
                const totalActualEl = document.getElementById('leadTotalsActual');
                const formatType = leadTotals.formatType && leadTotals.formatType !== 'mixed'
                    ? leadTotals.formatType
                    : null;
                if (totalTargetEl) {
                    totalTargetEl.textContent = formatType && leadTotals.target !== null
                        ? formatAggregateValue(leadTotals.target, formatType)
                        : '—';
                }
                if (totalActualEl) {
                    totalActualEl.textContent = formatType && leadTotals.actual !== null
                        ? formatAggregateValue(leadTotals.actual, formatType)
                        : '—';
                }
            }
        
        attachSearchFunctionalityLead();
        attachMemberRowClickHandlersLead();
    }

        const performanceReportCopy = {
            defaultTitle: 'Technical KPI Target vs Actual',
            defaultSubtitle: 'Click a Technical KPI to see its current actual vs target snapshot.'
        };

        const defaultTeamPerformanceSeries = {
            title: performanceReportCopy.defaultTitle,
            subtitle: performanceReportCopy.defaultSubtitle,
            labels: [...chartMonths],
            target: new Array(chartMonths.length).fill(0),
            actual: new Array(chartMonths.length).fill(0),
            narrative: 'Select a Technical KPI to load data.',
            valueType: 'thousands'
        };

        const teamPerformanceChartData = {
            labels: [...defaultTeamPerformanceSeries.labels],
            datasets: [
                {
                    label: 'Target',
                    type: 'bar',
                    order: 1,
                    data: [...defaultTeamPerformanceSeries.target],
                    backgroundColor: '#f2c53d',
                    borderColor: '#f2c53d',
                    hoverBackgroundColor: '#f5cf5d',
                    borderWidth: 0,
                    borderRadius: 10
                },
                {
                    label: 'Actual',
                    type: 'bar',
                    order: 2,
                    data: [...defaultTeamPerformanceSeries.actual],
                    backgroundColor: '#8faf3c',
                    borderColor: '#8faf3c',
                    hoverBackgroundColor: '#97bb3f',
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
            updatePerformanceCardCopy();
            updateTeamPerformanceInsight(insightContext || {
                infoMessage: 'Select a Technical KPI to view its target vs actual comparison.'
            });
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
                sentences.push('Select a Technical KPI to view its target vs actual details.');
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
                plugins: []
            });

            applyTeamPerformanceSeries(activeTeamPerformanceSeries);
            updateTeamPerformanceInsight();
        }

        function updateTeamPerformanceBarChart(operationName, target, actual) {
            const leaderId = selectedLeader;
            const leaderName = selectedLeaderData?.name || '';
            const leaderTitle = selectedLeaderData?.title || 'Technical Team';

            if (leaderId !== 'sarah-mitchell') {
                resetTeamPerformanceVisuals({
                    infoMessage: 'Detailed KPI visualization currently supports the Technical Team. Select a Technical KPI to view its target vs actual snapshot.'
                });
                return;
            }

            if (!operationName) {
                resetTeamPerformanceVisuals();
                return;
            }

            const monthlySeries = technicalMonthlySeries[operationName];

            if (monthlySeries) {
                applyTeamPerformanceSeries({
                    labels: monthlySeries.labels,
                    target: monthlySeries.target,
                    actual: monthlySeries.actual,
                    valueType: monthlySeries.valueType
                });

                updatePerformanceCardCopy({
                    title: operationName,
                    subtitle: leaderName ? `${leaderName} • ${leaderTitle}` : leaderTitle
                });

                const isPercentageSeries = monthlySeries.valueType === 'percentage';
                updateTeamPerformanceInsight({
                    operationName,
                    leaderName,
                    targetValue: target ?? monthlySeries.totalTarget,
                    actualValue: actual ?? monthlySeries.totalActual,
                    isPercentage: isPercentageSeries || /%|percent/i.test(operationName.toLowerCase()),
                    valueFormat: monthlySeries.valueType
                });
                return;
            }

            if (target === null || target === undefined || actual === null || actual === undefined) {
                resetTeamPerformanceVisuals({
                    infoMessage: 'No actual vs target values are available for this Technical KPI.'
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
                subtitle: leaderName ? `${leaderName} • ${leaderTitle}` : leaderTitle
            });

            updateTeamPerformanceInsight({
                operationName,
                leaderName,
                targetValue: target,
                actualValue: actual,
                isPercentage
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
                if (selectedLeader && selectedLeaderData) {
                    if (isLead) {
                        updateLeadKpiSection(selectedLeader, selectedLeaderData.title);
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
        function attachDropdownFunctionality(leaderId) {
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
                                    updatePerformanceGraph(leaderId, operationRole, kpiName);
                                });
                            });
                        } else {
                            // If closing dropdown, show bar chart for the row
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

        function applyIncomingLeaderHighlight() {
            const params = new URLSearchParams(window.location.search);
            const leaderParam = params.get('highlightLeader');
            const operationParam = params.get('highlightOperation');
            const kpiParam = params.get('highlightKpi');

            if (!leaderParam) {
                return;
            }

            const leaderId = leaderParam.trim().toLowerCase();
            if (!leaderId) {
                return;
            }

            const targetCard = Array.from(leaderCards).find(card =>
                card.getAttribute('data-leader')?.toLowerCase() === leaderId
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
                        url.searchParams.delete('highlightLeader');
                        if (operationParam) {
                            url.searchParams.delete('highlightOperation');
                        }
                        if (kpiParam) {
                            url.searchParams.delete('highlightKpi');
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