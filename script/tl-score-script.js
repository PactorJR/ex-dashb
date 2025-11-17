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

        function formatMillionsLabel(value) {
            const numeric = Number(value);
            if (Number.isNaN(numeric)) {
                return '';
            }
            return `₱${numeric.toLocaleString('en-PH', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            })}M`;
        }

        function resolveDataLabelColor(color, index) {
            if (Array.isArray(color)) {
                return color[index] || color[0] || '#525552';
            }
            if (typeof color === 'string' && color.trim() !== '') {
                return color;
            }
            return '#525552';
        }

        function createBarDataLabelsPlugin(pluginId) {
            return {
                id: pluginId,
                afterDatasetsDraw(chart) {
                    const ctx = chart.ctx;
                    ctx.save();
                    ctx.font = '11px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    const labelLineHeight = 14;
                    const minVerticalSpacing = 4;
                    const labelOffset = 5;
                    const maxLabelDistance = 25;

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

                    allLabels.sort((a, b) => {
                        if (a.categoryIndex !== b.categoryIndex) {
                            return a.categoryIndex - b.categoryIndex;
                        }
                        return a.barY - b.barY;
                    });

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
                            } else if (horizontalOverlap) {
                                const verticalDistInitial = Math.abs(labelY - prev.y);
                                if (verticalDistInitial < (labelLineHeight + minVerticalSpacing)) {
                                    collision = true;
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

                    labelPositions.forEach((pos) => {
                        ctx.fillStyle = pos.labelColor;
                        ctx.fillText(pos.value, pos.x, pos.y);
                    });

                    ctx.restore();
                }
            };
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

        const leadKpiData = {
            'sarah-mitchell': [
                { role: '# of Breakdowns : Engineering Department', owner: 'III. Engineering Integrator - Actual', kra: '-' }
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
        const technicalExpensesData = {
            'sarah-mitchell': {
                'FS Target : Repairs & Maintenance (Labor) (TECHNICAL) Expense': {
                    '2025-11': {
                        target: 125000,
                        actual: 118500
                    }
                },
                'FS Target : Repairs & Maintenance (Materials) (TECHNICAL) Expense': {
                    '2025-11': {
                        target: 87500,
                        actual: 91200
                    }
                }
            },
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
        const leadKpiExpensesData = {
            'sarah-mitchell': {
                '# of Breakdowns : Engineering Department': {
                    '2025-11': {
                        target: 5,
                        actual: 3
                    }
                }
            },
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
        let selectedLeader = null;
        let selectedLeaderData = null;
        let selectedYear = 2025;
        let selectedMonth = 10; // November (0-11, 10 = November)

        // Hide report cards initially on page load
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

        // Show report cards and hide legend when in operations view with selected leader
        function showReportCards() {
            const reportCards = document.querySelectorAll('.report-card');
            reportCards.forEach((card, index) => {
                if (index === 0) {
                    card.style.display = 'block';
                    // Set initial instruction message if no data is shown yet
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
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Show only legend and hide other report cards
        function showLegendOnly() {
            const reportCards = document.querySelectorAll('.report-card');
            reportCards.forEach((card, index) => {
                if (index === 0) {
                    card.style.display = 'block';
                    // Set initial instruction message
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
                } else {
                    card.style.display = 'none';
                }
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
                
                updateOperationsSection(selectedLeader, selectedLeaderData.title);
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
        
        const currentMonthName = monthNames[selectedMonth];
        
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
        
        const currentMonthName = monthNames[selectedMonth];
            
            let html = `
                <div class="search-box">
                    <input type="text" id="searchInputLead" placeholder="Search operations...">
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
                <div id="leadKpiList">
            `;
            
            leadKpis.forEach((kpi, index) => {
            // Get period data if available
            const periodKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
            const periodData = leadKpiExpensesData[leaderId]?.[kpi.role]?.[periodKey];
            
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

        const teamPerformanceMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const performanceReportCopy = {
            defaultTitle: 'Monthly Profit Performance (2024)',
            defaultSubtitle: "Tracking Year 2024 actuals against the 2025 run-rate and this year's stretch target."
        };

        const defaultTeamPerformanceSeries = {
            title: performanceReportCopy.defaultTitle,
            subtitle: performanceReportCopy.defaultSubtitle,
            labels: teamPerformanceMonths,
            // Values expressed in pesos
            year2025: [9.2e6, 9.6e6, 9.4e6, 8.5e6, 9.0e6, 9.4e6, 9.7e6, 9.4e6, 10.8e6, 9.5e6, 9.8e6, 9.4e6],
            year2024: [11.8e6, 9.3e6, 10.6e6, 8.6e6, 8.7e6, 10.7e6, 11.7e6, 8.7e6, 12.2e6, 10.5e6, 9.6e6, 8.7e6],
            target: [8.8e6, 9.2e6, 8.6e6, 7.1e6, 8.1e6, 8.8e6, 10.8e6, 10.2e6, 10.5e6, 11.2e6, 9.7e6, 9.2e6],
            narrative: 'Base financial view for the enterprise.'
        };

        const technicalTeamSeries = {
            'FS Target : Repairs & Maintenance (Labor) (TECHNICAL) Expense': {
                title: 'Technical Labor Expense Trend',
                subtitle: 'Monthly labor maintenance spend vs 2024 baseline.',
                labels: teamPerformanceMonths,
                // Values expressed in pesos (approximate thousands)
                year2025: [135000, 132000, 130000, 127000, 125000, 123000, 121000, 120000, 119500, 119000, 118500, 118000],
                year2024: [148000, 145000, 143000, 141000, 139000, 138000, 137000, 136000, 135000, 134000, 133000, 132000],
                target: Array(12).fill(125000),
                narrative: 'Labor expense has trended about 8% below last year and remains slightly under target for most months.'
            },
            'FS Target : Repairs & Maintenance (Materials) (TECHNICAL) Expense': {
                title: 'Technical Materials Expense Trend',
                subtitle: 'Materials procurement vs 2024 baseline.',
                labels: teamPerformanceMonths,
                year2025: [98000, 95000, 93000, 91000, 89000, 88000, 87000, 86000, 86500, 87000, 91200, 89500],
                year2024: [110000, 108000, 106000, 105000, 103000, 102000, 101000, 100000, 99000, 98500, 98000, 97500],
                target: Array(12).fill(87500),
                narrative: 'Materials outlay dipped below target mid-year but has been inching upward since September.'
            }
        };

        const teamPerformanceChartData = {
            labels: defaultTeamPerformanceSeries.labels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: [...defaultTeamPerformanceSeries.year2025],
                    backgroundColor: '#8faf3c',
                    borderColor: '#8faf3c',
                    hoverBackgroundColor: '#97bb3f',
                    borderWidth: 0,
                    borderRadius: 10,
                    dataLabelColor: '#6f862e',
                    dataLabelFormatter: (value) => formatMillionsLabel(value)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: [...defaultTeamPerformanceSeries.year2024],
                    backgroundColor: '#f2c53d',
                    borderColor: '#f2c53d',
                    hoverBackgroundColor: '#f5cf5d',
                    borderWidth: 0,
                    borderRadius: 10,
                    dataLabelColor: '#cfa02a',
                    dataLabelFormatter: (value) => formatMillionsLabel(value)
                },
                {
                    label: 'Current Year Target',
                    type: 'line',
                    order: 3,
                    data: [...defaultTeamPerformanceSeries.target],
                    borderColor: '#3f4a2e',
                    backgroundColor: '#3f4a2e',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#3f4a2e',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension: 0.35,
                    fill: false,
                    dataLabelColor: '#3f4a2e',
                    dataLabelOffset: 14,
                    dataLabelFormatter: (value) => formatMillionsLabel(value)
                }
            ]
        };

        const teamPerformanceBarLabelsPlugin = createBarDataLabelsPlugin('teamPerformanceBarLabels');

        let activeTeamPerformanceSeries = defaultTeamPerformanceSeries;
        let currentYAxisUnit = 'millions'; // 'millions' | 'thousands' | 'pesos'

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
            const labels = activeTeamPerformanceSeries.labels || teamPerformanceMonths;
            teamPerformanceChartData.labels = labels;

            const [dataset2025, dataset2024, datasetTarget] = teamPerformanceChartData.datasets;
            dataset2025.data = [...(activeTeamPerformanceSeries.year2025 || [])];
            dataset2024.data = [...(activeTeamPerformanceSeries.year2024 || [])];
            datasetTarget.data = [...(activeTeamPerformanceSeries.target || [])];

            if (teamPerformanceChart) {
                const yScale = teamPerformanceChart.options?.scales?.y;
                if (yScale) {
                    const maxValue = computeDatasetMaxValue();
                    // Decide unit based on magnitude of the data
                    if (maxValue >= 1_000_000) {
                        currentYAxisUnit = 'millions';
                    } else if (maxValue >= 1_000) {
                        currentYAxisUnit = 'thousands';
                    } else {
                        currentYAxisUnit = 'pesos';
                    }

                    const paddedMax = maxValue > 0 ? maxValue * 1.15 : 1;
                    yScale.suggestedMax = paddedMax;
                    yScale.beginAtZero = true;
                }
                teamPerformanceChart.update();
            }
        }

        function resetTeamPerformanceVisuals(insightContext) {
            applyTeamPerformanceSeries(defaultTeamPerformanceSeries);
            updatePerformanceCardCopy(defaultTeamPerformanceSeries);
            updateTeamPerformanceInsight(insightContext);
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

            const year2025Data = teamPerformanceChartData.datasets[0]?.data || [];
            const year2024Data = teamPerformanceChartData.datasets[1]?.data || [];

            const avg2025 = average(year2025Data);
            const avg2024 = average(year2024Data);
            const avgDiff = (avg2025 !== null && avg2024 !== null) ? avg2025 - avg2024 : null;

            const peak2024Value = year2024Data.length ? Math.max(...year2024Data) : null;
            const peak2024MonthIndex = peak2024Value !== null ? year2024Data.indexOf(peak2024Value) : -1;
            const peak2024Month = peak2024MonthIndex >= 0 ? teamPerformanceMonths[peak2024MonthIndex] : null;

            const sentences = [];

            if (context.operationName) {
                const leaderText = context.leaderName ? ` • ${context.leaderName}` : '';
                sentences.push(`<strong>${context.operationName}</strong>${leaderText}`);
            }

            if (avg2025 !== null && avg2024 !== null && avgDiff !== null) {
                const direction = avgDiff >= 0 ? 'ahead' : 'behind';
                sentences.push(`Year 2025 is ${direction} of 2024 by ${formatMillionsLabel(Math.abs(avgDiff))} on average (${formatMillionsLabel(avg2025)} vs ${formatMillionsLabel(avg2024)}).`);
            }

            if (peak2024Value !== null && peak2024Month) {
                sentences.push(`${peak2024Month} 2024 remained the peak month at ${formatMillionsLabel(peak2024Value)}.`);
            }

            const hasActual = context.actualValue !== null && context.actualValue !== undefined;
            const hasTarget = context.targetValue !== null && context.targetValue !== undefined;
            if (hasActual && hasTarget) {
                const actualLabel = formatPesoIfNeeded(context.actualValue, true);
                const targetLabel = formatPesoIfNeeded(context.targetValue, true);
                sentences.push(`Current period actual is ${actualLabel} vs target ${targetLabel}.`);
            }

            if (context.additionalNarrative) {
                sentences.push(context.additionalNarrative);
            }

            if (!sentences.length) {
                sentences.push('Select a KPI to view its target vs actual details.');
            }

            insightElement.innerHTML = sentences.join(' ');
        }

        const teamPerformanceLineLabelsPlugin = {
            id: 'teamPerformanceLineLabels',
            afterDatasetsDraw(chart) {
                const ctx = chart.ctx;
                ctx.save();
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                chart.data.datasets.forEach((dataset, datasetIndex) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta || meta.hidden || meta.type !== 'line') {
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

                        const offset = dataset.dataLabelOffset || 12;
                        ctx.fillStyle = resolveDataLabelColor(dataset.dataLabelColor || dataset.borderColor, index);
                        ctx.fillText(label, point.x, point.y - offset);
                    });
                });

                ctx.restore();
            }
        };

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
                                    if (currentYAxisUnit === 'millions') {
                                        const millions = numeric / 1_000_000;
                                        return `₱${millions.toFixed(1)}M`;
                                    }
                                    if (currentYAxisUnit === 'thousands') {
                                        const thousands = numeric / 1_000;
                                        return `₱${thousands.toLocaleString('en-US', { maximumFractionDigits: 0 })}K`;
                                    }
                                    return `₱${numeric.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
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
                plugins: [teamPerformanceBarLabelsPlugin, teamPerformanceLineLabelsPlugin]
            });

            applyTeamPerformanceSeries(activeTeamPerformanceSeries);
            updateTeamPerformanceInsight();
        }

        function updateTeamPerformanceBarChart(operationName, target, actual) {
            const leaderId = selectedLeader;
            const leaderName = selectedLeaderData?.name || '';

            if (!operationName) {
                resetTeamPerformanceVisuals();
                return;
            }

            if (leaderId === 'sarah-mitchell') {
                const series = technicalTeamSeries[operationName];
                if (series) {
                    applyTeamPerformanceSeries(series);
                    updatePerformanceCardCopy({
                        title: series.title || operationName,
                        subtitle: series.subtitle || performanceReportCopy.defaultSubtitle
                    });
                    updateTeamPerformanceInsight({
                        operationName,
                        leaderName,
                        targetValue: target,
                        actualValue: actual,
                        additionalNarrative: series.narrative
                    });
                    return;
                }

                applyTeamPerformanceSeries(defaultTeamPerformanceSeries);
                updatePerformanceCardCopy({
                    title: operationName,
                    subtitle: 'No monthly series has been configured for this KPI yet.'
                });
                updateTeamPerformanceInsight({
                    infoMessage: 'No monthly breakdown available yet for this Technical KPI.'
                });
                return;
            }

            resetTeamPerformanceVisuals({
                infoMessage: 'Detailed KPI visualization currently supports the Technical Team. Select a Technical KPI to view monthly data.'
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
                        updateOperationsSection(selectedLeader, selectedLeaderData.title);
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

        // Function to sync team breakdown bars with carousel values from lag-lead-summ.html
        function syncTeamBreakdownFromCarousel() {
            // Team name mapping from carousel data-team to team-label text
            const teamNameMap = {
                'tech': 'Technical',
                'accounting': 'Accounting',
                'lrad': 'LRAD',
                'quality': 'Quality',
                'dc': 'DC',
                'it': 'IT',
                'opportunity': 'Opportunity',
                'marcom': 'Marcom',
                'audit': 'Audit',
                'gathering': 'Gathering',
                'operations': 'Operations'
            };

            // Get team breakdown container (from tl-scoring.html)
            const teamBreakdown = document.querySelector('.team-breakdown');
            if (!teamBreakdown) return;

            // First, try to get values from carousel if it exists on this page
            const carouselCards = document.querySelectorAll('.stat-card-carousel[data-team]');
            let teamPercentages = {};
            
            if (carouselCards.length > 0) {
                // Carousel exists on this page, read directly
                carouselCards.forEach(card => {
                    const teamData = card.getAttribute('data-team');
                    const statValueElement = card.querySelector('.stat-value-carousel');
                    
                    if (statValueElement && teamData) {
                        const percentageText = statValueElement.textContent.trim();
                        const percentage = parseFloat(percentageText.replace('%', ''));
                        const teamName = teamNameMap[teamData];
                        
                        if (teamName && !isNaN(percentage)) {
                            teamPercentages[teamName] = percentage;
                        }
                    }
                });
            } else {
                // Carousel doesn't exist, try using the global sync function
                if (window.syncTeamBreakdownBars) {
                    window.syncTeamBreakdownBars();
                    return;
                }
                
                // Fallback: read from localStorage (set by lag-lead-script.js)
                try {
                    const stored = localStorage.getItem('teamCarouselPercentages');
                    if (stored) {
                        teamPercentages = JSON.parse(stored);
                    }
                } catch (e) {
                    console.warn('Could not read from localStorage:', e);
                }
            }
            
            // Update team breakdown bars with the percentages
            Object.keys(teamPercentages).forEach(teamName => {
                const percentage = teamPercentages[teamName];
                const teamItems = teamBreakdown.querySelectorAll('.team-item');
                teamItems.forEach(item => {
                    const teamLabel = item.querySelector('.team-label');
                    if (teamLabel && teamLabel.textContent.trim() === teamName) {
                        const teamBarFill = item.querySelector('.team-bar-fill');
                        if (teamBarFill) {
                            teamBarFill.style.width = `${percentage}%`;
                        }
                    }
                });
            });
        }

        window.addEventListener('DOMContentLoaded', () => {
            initializeReports();
            initTeamPerformanceChart();
            resetTeamPerformanceVisuals({
                infoMessage: 'Select a KPI to view its target vs actual details.'
            });
            applyIncomingLeaderHighlight();
            syncTeamBreakdownFromCarousel(); // Sync team breakdown bars with carousel values
            
            // Also sync when window loads (in case carousel loads after DOMContentLoaded)
            window.addEventListener('load', () => {
                setTimeout(syncTeamBreakdownFromCarousel, 100);
            });
        });

        // Listen for custom event from lag-lead-script.js when carousel values are updated
        window.addEventListener('carouselValuesUpdated', () => {
            syncTeamBreakdownFromCarousel();
        });

        // Listen for localStorage changes (when carousel values are updated on another page/tab)
        window.addEventListener('storage', (e) => {
            if (e.key === 'teamCarouselPercentages') {
                syncTeamBreakdownFromCarousel();
            }
        });

        // Also use mutation observer as a fallback to sync when carousel values change
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver((mutations) => {
                let shouldSync = false;
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' || mutation.type === 'characterData') {
                        const target = mutation.target;
                        if (target.classList && (
                            target.classList.contains('stat-value-carousel') ||
                            target.closest('.stat-card-carousel')
                        )) {
                            shouldSync = true;
                        }
                    }
                });
                if (shouldSync) {
                    setTimeout(syncTeamBreakdownFromCarousel, 50);
                }
            });

            // Observe changes to carousel stat values
            const carousel = document.getElementById('statsCarousel');
            if (carousel) {
                observer.observe(carousel, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            }
        }