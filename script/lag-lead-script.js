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
            ensureSummaryCardTitleContainers();
            applyIncomingHighlight();
            setupVarianceCardNavigation();
            setupYoYGrowthNavigation();
            setupTeamCarouselNavigation();
        });

        function ensureSummaryCardTitleContainers() {
            const summaryCards = document.querySelectorAll('.summary-card-compact');

            summaryCards.forEach(card => {
                if (card.querySelector('.summary-card-title-bar')) {
                    return;
                }

                const directTitle = Array.from(card.children).find(child => child.tagName && child.tagName.toLowerCase() === 'h3');
                if (!directTitle) {
                    return;
                }

                const wrapper = document.createElement('div');
                wrapper.className = 'summary-card-title-bar';

                card.insertBefore(wrapper, directTitle);
                wrapper.appendChild(directTitle);
            });
        }

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

        // Team to leader ID mapping
        const teamToLeaderMap = {
            'acc': 'marcus-chen',           // Accounting Team -> Jeany Sabillo
            'tech': 'sarah-mitchell',       // Technical Team -> Maria Baby Klyre Catibog
            'lrad': 'james-peterson',       // LRAD Team -> Al Francis Talagon
            'qual': 'emily-rodriguez',      // Quality Team -> Irene Floretes
            'dc': 'david-patterson',        // DC Team -> Joseph Mattew Dela Cruz
            'it': 'jennifer-lee',           // IT Team -> Mark Joel Limin
            'opp': 'robert-thompson',       // Opportunity Team -> Jeany Sabillo
            'marc': 'amanda-white',         // Marcom Team -> Abbygail Balinado
            'aud': 'michael-johnson',       // Audit Team -> Rosiene Macuja
            'gath': 'lisa-anderson',        // Gathering Team -> Vernon Calivara
            'oper': 'kevin-martinez'        // Operations Team -> Dennis Romero
        };

        // Function to find the nearest team section ancestor or previous sibling
        function findTeamSection(element, companySection = null) {
            // If companySection is not provided, try to find it from the element
            if (!companySection) {
                companySection = element.closest('[data-company-type="lag"]') || 
                                element.closest('[data-company-type="lead"]');
            }
            
            // If still not found, try both sections
            if (!companySection) {
                companySection = document.querySelector('[data-company-type="lag"]') || 
                                document.querySelector('[data-company-type="lead"]');
            }
            
            if (!companySection) {
                return null;
            }
            
            // Find the card container that holds this stat card
            let cardContainer = element;
            while (cardContainer && cardContainer !== companySection && cardContainer !== document.body) {
                if (cardContainer.classList && cardContainer.classList.contains('card')) {
                    break;
                }
                cardContainer = cardContainer.parentElement;
            }
            
            // If we found a card, walk backwards through siblings to find the team section
            if (cardContainer && cardContainer.parentElement === companySection) {
                let sibling = cardContainer.previousElementSibling;
                while (sibling) {
                    if (sibling.classList && sibling.classList.contains('team-section')) {
                        // Check for valid team class (skip headers like revenue-header, expenses-header)
                        const classList = Array.from(sibling.classList);
                        for (const className of classList) {
                            if (teamToLeaderMap[className]) {
                                return className;
                            }
                        }
                    }
                    sibling = sibling.previousElementSibling;
                }
            }
            
            // Alternative: if card is nested, check parent's siblings
            if (cardContainer) {
                let current = cardContainer.parentElement;
                while (current && current !== companySection && current !== document.body) {
                    let sibling = current.previousElementSibling;
                    while (sibling) {
                        if (sibling.classList && sibling.classList.contains('team-section')) {
                            const classList = Array.from(sibling.classList);
                            for (const className of classList) {
                                if (teamToLeaderMap[className]) {
                                    return className;
                                }
                            }
                        }
                        sibling = sibling.previousElementSibling;
                    }
                    current = current.parentElement;
                }
            }
            
            // Last resort: find all team sections and determine which one is closest before this element
            const allChildren = Array.from(companySection.children);
            const elementIndex = allChildren.indexOf(cardContainer || element);
            
            if (elementIndex > 0) {
                // Walk backwards from the element to find the most recent team section
                for (let i = elementIndex - 1; i >= 0; i--) {
                    const sibling = allChildren[i];
                    if (sibling.classList && sibling.classList.contains('team-section')) {
                        const classList = Array.from(sibling.classList);
                        for (const className of classList) {
                            if (teamToLeaderMap[className]) {
                                return className;
                            }
                        }
                    }
                }
            }
            
            return null;
        }

        // Function to extract KPI name from card title
        function extractKpiNameFromCard(card, isLeadSection = false) {
            // Find the parent card element
            let cardContainer = card;
            while (cardContainer && cardContainer !== document.body) {
                if (cardContainer.classList && cardContainer.classList.contains('card')) {
                    break;
                }
                cardContainer = cardContainer.parentElement;
            }
            
            if (!cardContainer) {
                return null;
            }
            
            // Get the card title from h3
            const titleElement = cardContainer.querySelector('h3');
            if (!titleElement) {
                return null;
            }
            
            const titleText = titleElement.textContent.trim();
            
            // Find the team section to determine context for ambiguous titles
            const teamClass = findTeamSection(card);
            
            // Determine if this is a Lead section by checking parent
            if (!isLeadSection) {
                const leadSection = card.closest('[data-company-type="lead"]');
                isLeadSection = leadSection !== null;
            }
            
            // Map card titles to KPI names based on teamOperationsData (Lag) or leadKpiData (Lead)
            // This mapping should match the KPI names in tl-score-script.js
            const lagTitleToKpiMap = {
                // Accounting Team
                'net profit': 'FS Target : Net Profit',  // Normalized version (after removing "summary")
                'revenue': 'FS Target : Total Gross Revenue',  // Normalized version
                'collection': '% Collection : All Sites',  // Normalized version
                'total operating expense': 'FS Target : Total Operating Expense',
                
                // Opportunity Team
                'rental income': 'FS Target : Rental Income',
                'critical numbers': '% Occupancy: Commercial (Units)',
                'occupancy rate (unit)': '% Occupancy: Commercial (Units)',
                'occupancy rate (area)': '% Occupancy: Commercial (Area)',
                'occupancy rate (p-value)': '% Occupancy: Commercial (PValue)',
                'closed inquiries': '% Pull Out - Aversion',
                'pullout aversion': '% Pull Out - Aversion',
                
                // Gathering Team
                'venue (p-value)': '% Occupancy: Venue (PValue)',
                'venue (pvalue)': '% Occupancy: Venue (PValue)',
                'studio (p-value)': '% Occupancy: Studio (PValue)',
                'studio (pvalue)': '% Occupancy: Studio (PValue)',
                'sports arena (p-value)': '% Occupancy: Sports Arena (PValue)',
                'sports arena (pvalue)': '% Occupancy: Sports Arena (PValue)',
                'lotus mall foot traffic': '# of Average Daily Foot Traffic',
                'portal mall foot traffic': '# of Average Daily Foot Traffic',
                'stadium shopping strip foot traffic': '# of Average Daily Foot Traffic',
                'yspacio creative park carbag foot traffic': '# of Average Daily Foot Traffic',
                'yspacio creative park alapan foot traffic': '# of Average Daily Foot Traffic',
                'lumina foot traffic': '# of Average Daily Foot Traffic',
                'lotus mall - pax per event': '# of 500 pax or more Event/month (All Sites)',
                'portal mall - pax per event': '# of 500 pax or more Event/month (All Sites)',
                'stadium shopping strip - pax per event': '# of 500 pax or more Event/month (All Sites)',
                'closed inquiry - offline inquiries': '# of Closed Inquiry/Offline Inquiries Received: Gathering',
                'site quality monitoring': '% Score : Site Quality (by Auditor)',
                'insurance claim monitoring': '% Insurance Claimed vs Reported',
                
                // Operations Team
                'parking income': 'FS Target : Parking Income',
                'electricity expense': 'FS Target : Electricity Expense',
                'water expense': 'FS Target : Water Expense',
                'security expense': 'FS Target : Security Expense',
                'agency expense': 'FS Target : Agency Expense',
                
                // LRAD Team
                'salary expense': 'FS Target : Salary Expense',
                'regular events plan': '% Planned vs Actual - Regular Events Plan: Lotuszen',
                'culture dev\'t activities plan': '% Planned vs Actual - Culture Dev\'t Activities Plan: Lotuszen',
                'culture dev activities plan': '% Planned vs Actual - Culture Dev\'t Activities Plan: Lotuszen',
                
                // Marcom Team
                'marketing expense (+gifts & decor)': 'FS Target : Marketing Expense (+Gifts & Decor) (MARCOM)',
                'marketing expense (+gifts & decor) (marcom)': 'FS Target : Marketing Expense (+Gifts & Decor) (MARCOM)',
                'fb page followers': '% Increase : Facebook Page Followers (per Month per Page)',
                
                // Gathering Team - Marketing Expense
                'marketing expense (+gifts & decor) (gathering)': 'FS Target : Marketing Expense (+Gifts & Decor) (GATHERING)',
                
                // Quality Team
                'smd projects': 'Score/Evaluation/NPS : SMD Projects',
                
                // DC Team
                'budget: projects (e&d)': '% Within Budget : Projects (E&D)',
                'team/section\'s targets': '% Within Budget : Projects (E&D)',
                'repairs & maintenance (labor)': 'FS Target : Repairs & Maintenance (Labor) (DCD) Expense',
                'repairs & maintenance (materials)': 'FS Target : Repairs & Maintenance (Materials) (DCD) Expense',
                'dcd: repairs & maintenance (labor)': 'FS Target : Repairs & Maintenance (Labor) (DCD) Expense',
                'dcd: repairs & maintenance (materials)': 'FS Target : Repairs & Maintenance (Materials) (DCD) Expense',
                
                // Technical Team
                'number of breakdowns': '# of Breakdowns : Engineering Department',
                'repairs & maintenance (labor) (technical)': 'FS Target : Repairs & Maintenance (Labor) (TECHNICAL) Expense',
                'repairs & maintenance (materials) (technical)': 'FS Target : Repairs & Maintenance (Materials) (TECHNICAL) Expense',
                'technical: repairs & maintenance (labor)': 'FS Target : Repairs & Maintenance (Labor) (TECHNICAL) Expense',
                'technical: repairs & maintenance (materials)': 'FS Target : Repairs & Maintenance (Materials) (TECHNICAL) Expense',
                
                // Audit Team
                'i.c.a.r.e. (all teams)': '% Addressed : I.C.A.R.E (All Teams)',
                'icare (all teams)': '% Addressed : I.C.A.R.E (All Teams)'
            };
            
            // Lead KPI mappings (from leadKpiData in tl-score-script.js)
            const leadTitleToKpiMap = {
                // Opportunity Team - Lead
                'critical numbers': '% Planned vs Actual - Tenant Mix Plan',
                'occupancy rate (unit)': '% Planned vs Actual - Tenant Mix Plan',
                'occupancy rate (area)': '% Planned vs Actual - Tenant Mix Plan',
                'occupancy rate (p-value)': '% Planned vs Actual - Tenant Mix Plan',
                'closed inquiries': '# of Closed Inquiry/Offline Inquiries Received: Commercial',
                'pullout aversion': '% Pull Out - Aversion',
                
                // Gathering Team - Lead
                'lotus mall foot traffic': '# of Average Daily Foot Traffic',
                'portal mall foot traffic': '# of Average Daily Foot Traffic',
                'stadium shopping strip foot traffic': '# of Average Daily Foot Traffic',
                'yspacio creative park carbag foot traffic': '# of Average Daily Foot Traffic',
                'yspacio creative park alapan foot traffic': '# of Average Daily Foot Traffic',
                'lumina foot traffic': '# of Average Daily Foot Traffic',
                'lotus mall - pax per event': '# of 500 pax or more Event/month (All Sites)',
                'portal mall - pax per event': '# of 500 pax or more Event/month (All Sites)',
                'stadium shopping strip - pax per event': '# of 500 pax or more Event/month (All Sites)',
                'closed inquiry - offline inquiries': '# of Closed Inquiry/Offline Inquiries Received: Gathering',
                'offline inquiries': '# of Closed Inquiry/Offline Inquiries Received: Gathering',
                
                // Marcom Team - Lead
                'fb page followers': '% Increase : Facebook Page Followers (per Month per Page)',
                
                // Audit Team - Lead
                'i.c.a.r.e. (all teams)': '% Addressed : I.C.A.R.E (All Teams)',
                'icare (all teams)': '% Addressed : I.C.A.R.E (All Teams)',
                
                // Operations Team - Lead (kevin-martinez)
                'site quality monitoring': '% Score : Site Quality (by Auditor)',
                'insurance claim monitoring': '% Insurance Claimed vs Reported',
                'onboarded tenants': '% Onboarded Tenants : All Tenants/Reserved (New + Existing)',
                'team/section\'s i.c.a.r.e': '% Addressed : Team/Section\'s I.C.A.R.E',
                
                // LRAD Team - Lead
                'regular events plan': '% Planned vs Actual - Regular Events Plan: Lotuszen',
                'culture dev\'t activities plan': '% Planned vs Actual - Culture Dev\'t Activities Plan: Lotuszen',
                'culture dev activities plan': '% Planned vs Actual - Culture Dev\'t Activities Plan: Lotuszen',
                
                // Quality Team - Lead
                'smd projects': 'Score/Evaluation/NPS : SMD Projects',
                'sid projects': 'Score/Evaluation/NPS : SID Projects',
                
                // DC Team - Lead
                'budget: projects (e&d)': '% Within Budget : Projects (E&D)',
                'budget: projects (ip)': '% Within Budget : Projects (IP)',
                'budget: projects (pmr)': '% Within Budget : Projects (PMR)',
                'budget: projects (construction)': '% Within Budget : Projects (Construction)',
                'budget: projects (landscape)': '% Within Budget : Projects (Landscape)',
                
                // Technical Team - Lead
                'number of breakdowns': '# of Breakdowns : Engineering Department',
                'breakdowns': '# of Breakdowns : Engineering Department',
                
                // IT Team - Lead
                'breakdowns : it': '# of Breakdowns : IT',
                'it breakdowns': '# of Breakdowns : IT'
            };
            
            // Use the appropriate map based on whether it's a Lead section
            const titleToKpiMap = isLeadSection ? leadTitleToKpiMap : lagTitleToKpiMap;
            
            // Normalize the title (lowercase, remove extra spaces, remove date suffixes)
            let normalizedTitle = titleText
                .toLowerCase()
                .replace(/\s*-\s*november\s+\d{4}/gi, '')
                .replace(/\s*summary/gi, '')
                .replace(/\s+/g, ' ')
                .trim();
            
            // Handle team-specific mappings for ambiguous titles
            // Marketing Expense - check team context
            if (normalizedTitle.includes('marketing expense')) {
                if (teamClass === 'gath') {
                    normalizedTitle = 'marketing expense (+gifts & decor) (gathering)';
                } else if (teamClass === 'marc') {
                    normalizedTitle = 'marketing expense (+gifts & decor)';
                }
            }
            
            // Repairs & Maintenance - check team context and chart title
            if (normalizedTitle.includes('repairs & maintenance')) {
                // Look for the chart card (usually next sibling) to determine if it's DCD or Technical
                let chartCard = cardContainer.nextElementSibling;
                if (!chartCard || !chartCard.querySelector('canvas')) {
                    chartCard = cardContainer.previousElementSibling;
                }
                
                if (chartCard) {
                    const chartTitle = chartCard.querySelector('h3')?.textContent || '';
                    const chartTitleLower = chartTitle.toLowerCase();
                    
                    // Check chart title first (most reliable)
                    if (chartTitleLower.includes('dcd')) {
                        if (normalizedTitle.includes('labor')) {
                            normalizedTitle = 'dcd: repairs & maintenance (labor)';
                        } else if (normalizedTitle.includes('materials')) {
                            normalizedTitle = 'dcd: repairs & maintenance (materials)';
                        }
                    } else if (chartTitleLower.includes('technical')) {
                        if (normalizedTitle.includes('labor')) {
                            normalizedTitle = 'technical: repairs & maintenance (labor)';
                        } else if (normalizedTitle.includes('materials')) {
                            normalizedTitle = 'technical: repairs & maintenance (materials)';
                        }
                    } else {
                        // Fallback to team class if chart title doesn't specify
                        if (teamClass === 'dc') {
                            if (normalizedTitle.includes('labor')) {
                                normalizedTitle = 'dcd: repairs & maintenance (labor)';
                            } else if (normalizedTitle.includes('materials')) {
                                normalizedTitle = 'dcd: repairs & maintenance (materials)';
                            }
                        } else if (teamClass === 'tech') {
                            if (normalizedTitle.includes('labor')) {
                                normalizedTitle = 'technical: repairs & maintenance (labor)';
                            } else if (normalizedTitle.includes('materials')) {
                                normalizedTitle = 'technical: repairs & maintenance (materials)';
                            }
                        }
                    }
                } else {
                    // No chart card found, use team class as fallback
                    if (teamClass === 'dc') {
                        if (normalizedTitle.includes('labor')) {
                            normalizedTitle = 'dcd: repairs & maintenance (labor)';
                        } else if (normalizedTitle.includes('materials')) {
                            normalizedTitle = 'dcd: repairs & maintenance (materials)';
                        }
                    } else if (teamClass === 'tech') {
                        if (normalizedTitle.includes('labor')) {
                            normalizedTitle = 'technical: repairs & maintenance (labor)';
                        } else if (normalizedTitle.includes('materials')) {
                            normalizedTitle = 'technical: repairs & maintenance (materials)';
                        }
                    }
                }
            }
            
            return titleToKpiMap[normalizedTitle] || null;
        }

        // Function to make a stat card clickable and navigate to team leader
        function makeStatCardClickable(card, leaderId, kpiName = null, isLeadKpi = false) {
            // Skip if already made clickable
            if (card.classList.contains('stat-card-link')) {
                return;
            }

            card.classList.add('stat-card-link');
            card.setAttribute('role', 'link');
            card.setAttribute('tabindex', '0');
            card.style.cursor = 'pointer';

            const navigateToLeader = () => {
                const params = new URLSearchParams({
                    highlightLeader: leaderId,
                    highlightSource: 'lag-lead-summ'
                });
                
                // Add KPI name if available for auto-clicking
                if (kpiName) {
                    params.set('autoClickKpi', kpiName);
                }
                
                // If it's a Lead KPI, switch to profile section (Lead KPIs view)
                if (isLeadKpi) {
                    params.set('highlightView', 'profile');
                }

                window.location.href = `tl-scoring.html?${params.toString()}`;
            };

            card.addEventListener('click', navigateToLeader);
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigateToLeader();
                }
            });
        }

        function setupVarianceCardNavigation() {
            // Process variance cards in both Company Lag and Company Lead sections
            const lagSection = document.querySelector('[data-company-type="lag"]');
            const leadSection = document.querySelector('[data-company-type="lead"]');
            
            const sections = [];
            if (lagSection) sections.push(lagSection);
            if (leadSection) sections.push(leadSection);
            
            if (sections.length === 0) {
                return;
            }

            // Process each section
            sections.forEach(companySection => {
                // Find all variance stat cards within the section
                const allStatCards = companySection.querySelectorAll('.stat-card');
                
                allStatCards.forEach(card => {
                    // Skip if already made clickable
                    if (card.classList.contains('stat-card-link')) {
                        return;
                    }

                    const label = card.querySelector('.stat-label');
                    const value = card.querySelector('.stat-value');
                    
                    if (!label || !value) return;

                    const labelText = label.textContent.trim().toLowerCase();
                    
                    // Only process variance cards
                    if (labelText === 'variance') {
                        // Check if this is a Lead section
                        const isLeadSection = companySection.getAttribute('data-company-type') === 'lead';
                        
                        // Use the improved findTeamSection function which checks ancestors and previous siblings
                        let teamClass = findTeamSection(card, companySection);
                        let leaderId = teamClass ? teamToLeaderMap[teamClass] : null;
                        
                        // Extract KPI name from the card context
                        const kpiName = extractKpiNameFromCard(card, isLeadSection);
                        
                        // For Lead KPIs, check if KPI belongs to a different leader than the team section suggests
                        // This handles cases like Site Quality/Insurance Claim under Gathering Team section
                        // but belonging to Operations Team leader (kevin-martinez)
                        if (isLeadSection && kpiName) {
                            // Map of KPI names to their correct leader IDs for Lead KPIs
                            // These override the team section-based leader detection
                            const leadKpiToLeaderMap = {
                                // Operations Team KPIs (may appear under different sections)
                                '% Score : Site Quality (by Auditor)': 'kevin-martinez',
                                '% Insurance Claimed vs Reported': 'kevin-martinez',
                                '% Addressed : Team/Section\'s I.C.A.R.E': 'kevin-martinez',
                                '% Onboarded Tenants : All Tenants/Reserved (New + Existing)': 'kevin-martinez',
                                
                                // Audit Team KPIs
                                '% Addressed : I.C.A.R.E (All Teams)': 'michael-johnson',
                                '% On time & Accurate : PropMan Module': 'michael-johnson',
                                
                                // Technical Team Lead KPIs
                                '# of Breakdowns : Engineering Department': 'sarah-mitchell',
                                '% Predictive Maintenance Compliance': 'sarah-mitchell',
                                '% Emergency Response Within SLA': 'sarah-mitchell',
                                
                                // IT Team Lead KPIs
                                '# of Breakdowns : IT': 'jennifer-lee'
                            };
                            
                            // Override leader ID if KPI has a specific leader mapping
                            if (leadKpiToLeaderMap[kpiName]) {
                                leaderId = leadKpiToLeaderMap[kpiName];
                            }
                        }
                        
                        // For Lag KPIs, check if KPI belongs to a different leader than the team section suggests
                        // This handles cases like Net Profit Summary under Revenue section
                        // but belonging to Accounting Team leader (marcus-chen)
                        if (!isLeadSection && kpiName) {
                            // Map of KPI names to their correct leader IDs for Lag KPIs
                            // These override the team section-based leader detection
                            const lagKpiToLeaderMap = {
                                // Accounting Team KPIs (may appear under Revenue section)
                                'FS Target : Net Profit': 'marcus-chen',
                                'FS Target : Total Gross Revenue': 'marcus-chen',
                                'FS Target : Total Operating Expense': 'marcus-chen',
                                '% Collection : All Sites': 'marcus-chen'
                            };
                            
                            // Override leader ID if KPI has a specific leader mapping
                            if (lagKpiToLeaderMap[kpiName]) {
                                leaderId = lagKpiToLeaderMap[kpiName];
                            }
                        }
                        
                        if (leaderId) {
                            makeStatCardClickable(card, leaderId, kpiName, isLeadSection);
                        }
                    }
                });
            });
        }

        // Function to setup YoY Growth navigation (only in Revenue section)
        function setupYoYGrowthNavigation() {
            const statCards = document.querySelectorAll('.stat-card');

            statCards.forEach(card => {
                const label = card.querySelector('.stat-label');
                const value = card.querySelector('.stat-value');

                if (!label || !value) return;

                const labelText = label.textContent.trim().toLowerCase();
                const isYoYGrowth = labelText === 'yoy growth';

                if (isYoYGrowth) {
                    // YoY Growth is always in the Revenue section under Accounting Team
                    // Check if we're in the Company Lag view (revenue section)
                    const dashboardGrid = card.closest('[data-company-type="lag"]');
                    if (dashboardGrid) {
                        // Check if we're in a revenue-related section by looking for revenue-header or accounting team section
                        let current = card;
                        let isInRevenueSection = false;
                        while (current && current !== document.body) {
                            if (current.classList) {
                                if (current.classList.contains('revenue-header') || 
                                    current.classList.contains('accounting-team-section') ||
                                    (current.classList.contains('team-section') && current.classList.contains('acc'))) {
                                    isInRevenueSection = true;
                                    break;
                                }
                            }
                            current = current.parentElement;
                        }

                        // If in revenue section or can find accounting team, make it clickable
                        if (isInRevenueSection || findTeamSection(card) === 'acc') {
                            if (teamToLeaderMap['acc']) {
                                // YoY Growth maps to Total Gross Revenue KPI
                                const kpiName = 'FS Target : Total Gross Revenue';
                                makeStatCardClickable(card, teamToLeaderMap['acc'], kpiName);
                            }
                        }
                    }
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
            document.querySelectorAll('.team-section').forEach(section => {
                if (!section.classList.contains('slide-in-left')) {
                    section.classList.add('slide-in-left');
                }
            });

            const animatedElements = document.querySelectorAll('.slide-in-up, .slide-in-left, .slide-in-right, .fade-in-scale, .stat-card, .summary-card-title-outside');
            animatedElements.forEach(el => observer.observe(el));
        });

        // (Removed scroll-based nav highlighting)

        const formatMillionsLabel = (value) => {
            const numeric = Number(value);
            if (Number.isNaN(numeric)) {
                return 'P0.00';
            }
            // Convert millions to actual value and format as currency
            const actualValue = numeric * 1000000;
            return `P${actualValue.toLocaleString('en-PH', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
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

        const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        function createStandardBarOptions(yAxisTitle) {
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return 'P0.00';
                                }
                                return formatMillionsLabel(value);
                            }
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
            tension = 0.35
        }) {
                return {
                label,
                    type: 'line',
                    order: 3,
                data: [...data],
                    borderColor: 'rgba(88, 103, 64, 1)',
                    backgroundColor: 'rgba(88, 103, 64, 1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: 'rgba(88, 103, 64, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    tension,
                    fill: false,
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
            includeBarLabels = true
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
                options: createStandardBarOptions(yAxisTitle),
                plugins
        };

            return { data, config };
        }

        function toNumericValue(value) {
            if (typeof value === 'number') {
                return Number.isFinite(value) ? value : NaN;
            }
            if (typeof value === 'string') {
                const cleaned = value.replace(/[^\d.-]/g, '');
                const parsed = Number(cleaned);
                return Number.isFinite(parsed) ? parsed : NaN;
            }
            if (value === null || value === undefined) {
                return NaN;
            }
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : NaN;
        }

        function normalizeCurrencySeries(series = [], { valueKey = 'value' } = {}) {
            if (!Array.isArray(series)) {
                return [];
            }

            const numericValues = series.map(item => {
                if (typeof item === 'number') {
                    return item;
                }

                if (item && typeof item === 'object') {
                    if (valueKey in item) {
                        const numeric = toNumericValue(item[valueKey]);
                        if (!Number.isNaN(numeric)) {
                            return numeric;
                        }
                    }

                    const fallbackNumeric = toNumericValue(
                        item.value ?? item.amount ?? item.total ?? item.actual ?? item.result
                    );
                    if (!Number.isNaN(fallbackNumeric)) {
                        return fallbackNumeric;
                    }
                    return 0;
                }

                const numeric = toNumericValue(item);
                return Number.isNaN(numeric) ? 0 : numeric;
            });

            const requiresScaling = numericValues.some(value => Math.abs(value) >= 1000);
            const divisor = requiresScaling ? 1_000_000 : 1;

            return numericValues.map(value => Number.isFinite(value) ? value / divisor : 0);
        }

        function extractNumericValues(series = [], { valueKey = 'value' } = {}) {
            if (!Array.isArray(series)) {
                return [];
            }

            return series.map(item => {
                if (typeof item === 'number') {
                    return toNumericValue(item);
                }

                if (item && typeof item === 'object') {
                    if (valueKey in item) {
                        return toNumericValue(item[valueKey]);
                    }
                    const fallback = item.value ?? item.amount ?? item.total ?? item.actual ?? item.result ?? item.y;
                    return toNumericValue(fallback);
                }

                return toNumericValue(item);
            });
        }

        // Normalize series to thousands format (for P-value charts)
        function normalizeThousandsSeries(series = [], { valueKey = 'value' } = {}) {
            if (!Array.isArray(series)) {
                return [];
            }

            const numericValues = series.map(item => {
                if (typeof item === 'number') {
                    return item;
                }

                if (item && typeof item === 'object') {
                    if (valueKey in item) {
                        const numeric = toNumericValue(item[valueKey]);
                        if (!Number.isNaN(numeric)) {
                            return numeric;
                        }
                    }

                    const fallbackNumeric = toNumericValue(
                        item.value ?? item.amount ?? item.total ?? item.actual ?? item.result
                    );
                    if (!Number.isNaN(fallbackNumeric)) {
                        return fallbackNumeric;
                    }
                    return 0;
                }

                const numeric = toNumericValue(item);
                return Number.isNaN(numeric) ? 0 : numeric;
            });

            // If values are >= 1000, they're likely in raw format, convert to thousands
            // Otherwise, assume they're already in thousands
            const requiresScaling = numericValues.some(value => Math.abs(value) >= 1000);
            const divisor = requiresScaling ? 1000 : 1;

            return numericValues.map(value => Number.isFinite(value) ? value / divisor : 0);
        }

        // Helper function to check if a series should be formatted as percentage
        function isPercentageSeries(series = []) {
            if (!Array.isArray(series) || series.length === 0) {
                return false;
            }
            const firstItem = series[0];
            if (firstItem && typeof firstItem === 'object' && 'isPercentage' in firstItem) {
                return firstItem.isPercentage === true;
            }
            return false;
        }

        function calculateAverage(values = []) {
            const numericValues = values.filter(value => Number.isFinite(value));
            if (!numericValues.length) {
                return null;
            }
            const sum = numericValues.reduce((acc, value) => acc + value, 0);
            return sum / numericValues.length;
        }

        let profitBarChart;
        let revenueBarChart;
        let monthlyCollectionChart;
        let rentalComparisonChart;
        let venueChart;
        let studioChart;
        let sportsArenaChart;
        let parkingIncomeChart;
        let totalOperatingExpenseChart;
        let electricityExpenseChart;
        let waterExpenseChart;
        let securityExpenseChart;
        let agencyExpenseChart;
        let salaryExpenseChart;
        let marketingExpenseChart;
        let marketingExpenseGatheringChart;
        let repairsMaintenanceLaborChart;
        let repairsMaintenanceMaterialsChart;
        let repairsMaintenanceLaborTechnicalChart;
        let repairsMaintenanceMaterialsTechnicalChart;
        // Per-chart loading indicator functions
        function showChartLoading(canvasId) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            
            const chartContainer = canvas.closest('.chart-container');
            if (!chartContainer) return;
            
            // Check if loading indicator already exists
            let loadingIndicator = chartContainer.querySelector('.chart-loading-indicator');
            if (!loadingIndicator) {
                loadingIndicator = document.createElement('div');
                loadingIndicator.className = 'chart-loading-indicator';
                loadingIndicator.innerHTML = `
                    <div class="chart-loading-spinner"></div>
                    <span class="chart-loading-text">Loading chart…</span>
                `;
                chartContainer.style.position = 'relative';
                chartContainer.appendChild(loadingIndicator);
            }
            
            loadingIndicator.classList.add('visible');
            canvas.style.opacity = '0.3';
        }

        function hideChartLoading(canvasId) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            
            const chartContainer = canvas.closest('.chart-container');
            if (!chartContainer) return;
            
            const loadingIndicator = chartContainer.querySelector('.chart-loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.classList.remove('visible');
            }
            
            canvas.style.opacity = '1';
        }

        document.addEventListener('DOMContentLoaded', async () => {
            const initializationTasks = [];

            try {
                const profitBarCanvas = document.getElementById('profitBarChart');
                const revenueBarCanvas = document.getElementById('revenueBarChart');
                const monthlyCollectionCanvas = document.getElementById('monthlyCollectionChart');
                const rentalComparisonCanvas = document.getElementById('rentalComparisonChart');

                if (profitBarCanvas) {
                    showChartLoading('profitBarChart');
                    profitBarChart = new Chart(profitBarCanvas, profitBarConfig);
                    initializationTasks.push(initNetProfitCharts().then(() => {
                        hideChartLoading('profitBarChart');
                    }).catch(() => {
                        hideChartLoading('profitBarChart');
                    }));
                    
                    // Make the chart clickable to navigate to Net Profit KPI
                    profitBarCanvas.style.cursor = 'pointer';
                    profitBarCanvas.addEventListener('click', function() {
                        const params = new URLSearchParams({
                            highlightLeader: 'marcus-chen',
                            highlightSource: 'lag-lead-summ',
                            autoClickKpi: 'FS Target : Net Profit'
                        });
                        window.location.href = `tl-scoring.html?${params.toString()}`;
                    });
                            } else {
                    console.warn('Canvas element with id "profitBarChart" not found');
                }

                if (revenueBarCanvas) {
                    showChartLoading('revenueBarChart');
                    revenueBarChart = new Chart(revenueBarCanvas, revenueBarConfig);
                    initializationTasks.push(initRevenueCharts().then(() => {
                        hideChartLoading('revenueBarChart');
                    }).catch(() => {
                        hideChartLoading('revenueBarChart');
                    }));
                } else {
                    console.warn('Canvas element with id "revenueBarChart" not found');
                }

                if (monthlyCollectionCanvas) {
                    showChartLoading('monthlyCollectionChart');
                    monthlyCollectionChart = new Chart(monthlyCollectionCanvas, monthlyCollectionConfig);
                    initializationTasks.push(initCollectionCharts().then(() => {
                        hideChartLoading('monthlyCollectionChart');
                    }).catch(() => {
                        hideChartLoading('monthlyCollectionChart');
                    }));
                } else {
                    console.warn('Canvas element with id "monthlyCollectionChart" not found');
                }

                if (rentalComparisonCanvas) {
                    showChartLoading('rentalComparisonChart');
                    rentalComparisonChart = new Chart(rentalComparisonCanvas, rentalComparisonConfig);
                    initializationTasks.push(initRentalIncomeCharts().then(() => {
                        hideChartLoading('rentalComparisonChart');
                    }).catch(() => {
                        hideChartLoading('rentalComparisonChart');
                    }));
                } else {
                    console.warn('Canvas element with id "rentalComparisonChart" not found');
                }

                const venueCanvas = document.getElementById('venueChart');
                if (venueCanvas) {
                    showChartLoading('venueChart');
                    venueChart = new Chart(venueCanvas, venueChartConfig);
                    initializationTasks.push(initVenueCharts().then(() => {
                        hideChartLoading('venueChart');
                    }).catch(() => {
                        hideChartLoading('venueChart');
                    }));
                } else {
                    console.warn('Canvas element with id "venueChart" not found');
                }

                const studioCanvas = document.getElementById('studioChart');
                if (studioCanvas) {
                    showChartLoading('studioChart');
                    studioChart = new Chart(studioCanvas, studioChartConfig);
                    initializationTasks.push(initStudioCharts().then(() => {
                        hideChartLoading('studioChart');
                    }).catch(() => {
                        hideChartLoading('studioChart');
                    }));
                } else {
                    console.warn('Canvas element with id "studioChart" not found');
                }

                const sportsArenaCanvas = document.getElementById('sportsArenaChart');
                if (sportsArenaCanvas) {
                    showChartLoading('sportsArenaChart');
                    sportsArenaChart = new Chart(sportsArenaCanvas, sportsArenaChartConfig);
                    initializationTasks.push(initSportsArenaCharts().then(() => {
                        hideChartLoading('sportsArenaChart');
                    }).catch(() => {
                        hideChartLoading('sportsArenaChart');
                    }));
                } else {
                    console.warn('Canvas element with id "sportsArenaChart" not found');
                }

                const parkingIncomeCanvas = document.getElementById('parkingIncomeChart');
                if (parkingIncomeCanvas) {
                    showChartLoading('parkingIncomeChart');
                    parkingIncomeChart = new Chart(parkingIncomeCanvas, parkingIncomeChartConfig);
                    initializationTasks.push(initParkingIncomeCharts().then(() => {
                        hideChartLoading('parkingIncomeChart');
                    }).catch(() => {
                        hideChartLoading('parkingIncomeChart');
                    }));
                } else {
                    console.warn('Canvas element with id "parkingIncomeChart" not found');
                }

                const totalOperatingExpenseCanvas = document.getElementById('totalOperatingExpenseChart');
                if (totalOperatingExpenseCanvas) {
                    showChartLoading('totalOperatingExpenseChart');
                    totalOperatingExpenseChart = new Chart(totalOperatingExpenseCanvas, totalOperatingExpenseChartConfig);
                    initializationTasks.push(initTotalOperatingExpenseCharts().then(() => {
                        hideChartLoading('totalOperatingExpenseChart');
                    }).catch(() => {
                        hideChartLoading('totalOperatingExpenseChart');
                    }));
                } else {
                    console.warn('Canvas element with id "totalOperatingExpenseChart" not found');
                }

                const electricityExpenseCanvas = document.getElementById('electricityExpenseChart');
                if (electricityExpenseCanvas) {
                    showChartLoading('electricityExpenseChart');
                    electricityExpenseChart = new Chart(electricityExpenseCanvas, electricityExpenseChartConfig);
                    initializationTasks.push(initElectricityExpenseCharts().then(() => {
                        hideChartLoading('electricityExpenseChart');
                    }).catch(() => {
                        hideChartLoading('electricityExpenseChart');
                    }));
                } else {
                    console.warn('Canvas element with id "electricityExpenseChart" not found');
                }

                const waterExpenseCanvas = document.getElementById('waterExpenseChart');
                if (waterExpenseCanvas) {
                    showChartLoading('waterExpenseChart');
                    waterExpenseChart = new Chart(waterExpenseCanvas, waterExpenseChartConfig);
                    initializationTasks.push(initWaterExpenseCharts().then(() => {
                        hideChartLoading('waterExpenseChart');
                    }).catch(() => {
                        hideChartLoading('waterExpenseChart');
                    }));
                } else {
                    console.warn('Canvas element with id "waterExpenseChart" not found');
                }

                const securityExpenseCanvas = document.getElementById('securityExpenseChart');
                if (securityExpenseCanvas) {
                    showChartLoading('securityExpenseChart');
                    securityExpenseChart = new Chart(securityExpenseCanvas, securityExpenseChartConfig);
                    initializationTasks.push(initSecurityExpenseCharts().then(() => {
                        hideChartLoading('securityExpenseChart');
                    }).catch(() => {
                        hideChartLoading('securityExpenseChart');
                    }));
                } else {
                    console.warn('Canvas element with id "securityExpenseChart" not found');
                }

                const agencyExpenseCanvas = document.getElementById('agencyExpenseChart');
                if (agencyExpenseCanvas) {
                    showChartLoading('agencyExpenseChart');
                    agencyExpenseChart = new Chart(agencyExpenseCanvas, agencyExpenseChartConfig);
                    initializationTasks.push(initAgencyExpenseCharts().then(() => {
                        hideChartLoading('agencyExpenseChart');
                    }).catch(() => {
                        hideChartLoading('agencyExpenseChart');
                    }));
                } else {
                    console.warn('Canvas element with id "agencyExpenseChart" not found');
                }

                const salaryExpenseCanvas = document.getElementById('salaryExpenseChart');
                if (salaryExpenseCanvas) {
                    showChartLoading('salaryExpenseChart');
                    salaryExpenseChart = new Chart(salaryExpenseCanvas, salaryExpenseChartConfig);
                    initializationTasks.push(initSalaryExpenseCharts().then(() => {
                        hideChartLoading('salaryExpenseChart');
                    }).catch(() => {
                        hideChartLoading('salaryExpenseChart');
                    }));
                } else {
                    console.warn('Canvas element with id "salaryExpenseChart" not found');
                }

                const marketingExpenseCanvas = document.getElementById('marketingExpenseChart');
                if (marketingExpenseCanvas) {
                    showChartLoading('marketingExpenseChart');
                    marketingExpenseChart = new Chart(marketingExpenseCanvas, marketingExpenseChartConfig);
                    initializationTasks.push(initMarketingExpenseCharts().then(() => {
                        hideChartLoading('marketingExpenseChart');
                    }).catch(() => {
                        hideChartLoading('marketingExpenseChart');
                    }));
                } else {
                    console.warn('Canvas element with id "marketingExpenseChart" not found');
                }

                const marketingExpenseGatheringCanvas = document.getElementById('marketingExpenseGatheringChart');
                if (marketingExpenseGatheringCanvas) {
                    showChartLoading('marketingExpenseGatheringChart');
                    marketingExpenseGatheringChart = new Chart(marketingExpenseGatheringCanvas, marketingExpenseGatheringChartConfig);
                    initializationTasks.push(initMarketingExpenseGatheringCharts().then(() => {
                        hideChartLoading('marketingExpenseGatheringChart');
                    }).catch(() => {
                        hideChartLoading('marketingExpenseGatheringChart');
                    }));
                } else {
                    console.warn('Canvas element with id "marketingExpenseGatheringChart" not found');
                }

                const repairsMaintenanceLaborCanvas = document.getElementById('repairsMaintenanceLaborChart');
                if (repairsMaintenanceLaborCanvas) {
                    showChartLoading('repairsMaintenanceLaborChart');
                    repairsMaintenanceLaborChart = new Chart(repairsMaintenanceLaborCanvas, repairsMaintenanceLaborChartConfig);
                    initializationTasks.push(initRepairsMaintenanceLaborCharts().then(() => {
                        hideChartLoading('repairsMaintenanceLaborChart');
                    }).catch(() => {
                        hideChartLoading('repairsMaintenanceLaborChart');
                    }));
                } else {
                    console.warn('Canvas element with id "repairsMaintenanceLaborChart" not found');
                }

                const repairsMaintenanceMaterialsCanvas = document.getElementById('repairsMaintenanceMaterialsChart');
                if (repairsMaintenanceMaterialsCanvas) {
                    showChartLoading('repairsMaintenanceMaterialsChart');
                    repairsMaintenanceMaterialsChart = new Chart(repairsMaintenanceMaterialsCanvas, repairsMaintenanceMaterialsChartConfig);
                    initializationTasks.push(initRepairsMaintenanceMaterialsCharts().then(() => {
                        hideChartLoading('repairsMaintenanceMaterialsChart');
                    }).catch(() => {
                        hideChartLoading('repairsMaintenanceMaterialsChart');
                    }));
                } else {
                    console.warn('Canvas element with id "repairsMaintenanceMaterialsChart" not found');
                }

                const repairsMaintenanceLaborTechnicalCanvas = document.getElementById('repairsMaintenanceLaborTechnicalChart');
                if (repairsMaintenanceLaborTechnicalCanvas) {
                    showChartLoading('repairsMaintenanceLaborTechnicalChart');
                    repairsMaintenanceLaborTechnicalChart = new Chart(repairsMaintenanceLaborTechnicalCanvas, repairsMaintenanceLaborTechnicalChartConfig);
                    initializationTasks.push(initRepairsMaintenanceLaborTechnicalCharts().then(() => {
                        hideChartLoading('repairsMaintenanceLaborTechnicalChart');
                    }).catch(() => {
                        hideChartLoading('repairsMaintenanceLaborTechnicalChart');
                    }));
                } else {
                    console.warn('Canvas element with id "repairsMaintenanceLaborTechnicalChart" not found');
                }

                const repairsMaintenanceMaterialsTechnicalCanvas = document.getElementById('repairsMaintenanceMaterialsTechnicalChart');
                if (repairsMaintenanceMaterialsTechnicalCanvas) {
                    showChartLoading('repairsMaintenanceMaterialsTechnicalChart');
                    repairsMaintenanceMaterialsTechnicalChart = new Chart(repairsMaintenanceMaterialsTechnicalCanvas, repairsMaintenanceMaterialsTechnicalChartConfig);
                    initializationTasks.push(initRepairsMaintenanceMaterialsTechnicalCharts().then(() => {
                        hideChartLoading('repairsMaintenanceMaterialsTechnicalChart');
                    }).catch(() => {
                        hideChartLoading('repairsMaintenanceMaterialsTechnicalChart');
                    }));
                } else {
                    console.warn('Canvas element with id "repairsMaintenanceMaterialsTechnicalChart" not found');
                }

                await Promise.all(initializationTasks);
            } catch (err) {
                console.error('Failed to initialize revenue dashboards:', err);
            }
        });

        // ============================================
        // REVENUE SECTIONS (1-8)
        // ============================================
        // SECTION 1: NET PROFIT CHARTS
        // ============================================

        const {
            data: profitBarData,
            config: profitBarConfig
        } = createComparisonChartStructures({
            yAxisTitle: 'Net Profit (Millions ₱)',
            barPluginId: 'profitBarDataLabels',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: [],
            includeBarLabels: false
        });

        let dashboardDataPromise = null;

        async function fetchDashboardData() {
            if (dashboardDataPromise) {
                return dashboardDataPromise;
            }
            
            dashboardDataPromise = (async () => {
                try {
                const url = 'https://script.google.com/macros/s/AKfycbxs05sSpRPjnxI_NBi3XN-wycjM4hEtHhsKDm98ryPTRG-YGZjNLV4rzeE_t2CNgzMm/exec';
                    console.log('Fetching dashboard data from:', url);
                
                const res = await fetch(url);
                    console.log('Dashboard response status:', res.status);
                
                const text = await res.text();
                    console.log('Dashboard raw response:', text);
                
                const payload = JSON.parse(text);
                    console.log('Parsed dashboard payload:', payload);
                
                    return payload ?? {};
            } catch (error) {
                    console.error('Error fetching dashboard data:', error);
                    return {};
                }
            })();
            
            return dashboardDataPromise;
        }
        
        async function initNetProfitCharts() {
            if (!profitBarChart) {
                console.warn('profitBarChart is not initialized yet.');
                        return;
                    }
            
            console.log('Starting initNetProfitCharts...');
            
            const payload = await fetchDashboardData();
            const netProfitCurrent = payload?.netProfit2025
                ?? payload?.netProfitCurrent
                ?? payload?.netProfitActuals
                ?? [];
            const netProfit2024 = payload?.netProfit2024
                ?? payload?.previousNetProfit
                ?? [];
            const netProfitTargetRaw = payload?.netProfitTarget
                ?? payload?.netProfitGoal
                ?? payload?.netProfitTargetSeries
                ?? [];
            
            if (!Array.isArray(netProfitCurrent) && !Array.isArray(netProfit2024)) {
                console.warn('Net profit data missing from payload, keeping fallback values.');
                return;
            }
            
            const current2025Data = normalizeCurrencySeries(netProfitCurrent);
            const previous2024Data = normalizeCurrencySeries(netProfit2024);
            const targetSeries = normalizeCurrencySeries(netProfitTargetRaw);
            
            if (current2025Data.length) {
            profitBarData.datasets[0].data = current2025Data;
            }
            if (previous2024Data.length) {
                profitBarData.datasets[1].data = previous2024Data;
            }
            
            if (targetSeries.length && profitBarData.datasets[2]) {
                profitBarData.datasets[2].data = targetSeries;
            }
            
            console.log('Updated net profit datasets:', {
                current: profitBarData.datasets[0].data,
                previous: profitBarData.datasets[1].data,
                target: profitBarData.datasets[2]?.data
            });
            
            profitBarChart.update();
            updateNetProfitSummary();
        }

        // ============================================
        // SECTION 2: GROSS REVENUE CHARTS
        // ============================================

        const {
            data: revenueBarData,
            config: revenueBarConfig
        } = createComparisonChartStructures({
            yAxisTitle: 'Gross Revenue (Millions ₱)',
            barPluginId: 'revenueBarDataLabels',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: [],
            includeBarLabels: false
        });

        async function initRevenueCharts() {
            if (!revenueBarChart) {
                console.warn('Revenue bar chart is not initialized yet.');
                return;
            }

            console.log('Starting initRevenueCharts...');

            const payload = await fetchDashboardData();
            const currentSeriesRaw = payload?.grossRevenue2025
                ?? payload?.grossRevenueCurrent
                ?? payload?.revenue2025
                ?? payload?.revenueCurrent
                ?? payload?.monthlyRevenueCurrent
                ?? [];
            const previousSeriesRaw = payload?.grossRevenue2024
                ?? payload?.revenue2024
                ?? payload?.monthlyRevenue2024
                ?? [];
            const targetSeriesRaw = payload?.grossRevenueTarget
                ?? payload?.revenueTarget
                ?? payload?.grossRevenueGoal
                ?? [];

            const currentSeries = normalizeCurrencySeries(currentSeriesRaw);
            const previousSeries = normalizeCurrencySeries(previousSeriesRaw);
            const targetSeries = normalizeCurrencySeries(targetSeriesRaw);

            if (currentSeries.length) {
                revenueBarData.datasets[0].data = currentSeries;
            }
            if (previousSeries.length) {
                revenueBarData.datasets[1].data = previousSeries;
            }
            if (targetSeries.length && revenueBarData.datasets[2]) {
                revenueBarData.datasets[2].data = targetSeries;
            }

            console.log('Updated revenue bar datasets:', {
                current: revenueBarData.datasets[0].data,
                previous: revenueBarData.datasets[1].data,
                target: revenueBarData.datasets[2]?.data
            });

            revenueBarChart.update();
        }

        async function initCollectionCharts() {
            if (!monthlyCollectionChart) {
                console.warn('Monthly collection chart is not initialized yet.');
                return;
            }

            console.log('Starting initCollectionCharts...');

            const payload = await fetchDashboardData();
            const receivablesRaw = payload?.collectionTotalReceived
                ?? payload?.collectionReceivables
                ?? payload?.monthlyCollectionReceivables
                ?? payload?.receivablesSeries
                ?? [];
            const collectedRaw = payload?.collectionTotalCollected
                ?? payload?.collectionCollected
                ?? payload?.monthlyCollectionCollected
                ?? payload?.collectedSeries
                ?? [];
            const percentageRaw = payload?.collectionPercentage
                ?? payload?.collectionRate
                ?? payload?.collectionPercent
                ?? [];

            const receivablesSeries = normalizeCurrencySeries(receivablesRaw);
            const collectedSeries = normalizeCurrencySeries(collectedRaw);
            
            // Check if collection percentage should be formatted as percentage
            const isPercentage = isPercentageSeries(percentageRaw);
            const percentageValues = extractNumericValues(percentageRaw);
            
            // Normalize percentage values: if isPercentage is true, values > 1 are treated as percentages (85 = 85%)
            // If isPercentage is false or values < 1, treat as decimals (0.85 = 85%)
            const normalizedPercentageValues = percentageValues.map(value => {
                if (!Number.isFinite(value)) return value;
                if (isPercentage) {
                    // If marked as percentage and value > 1, it's already a percentage (e.g., 85 for 85%)
                    // If value <= 1, it might be a decimal (e.g., 0.85 for 85%), convert to percentage
                    return value > 1 ? value : value * 100;
                } else {
                    // Not marked as percentage, normalize: if > 1, divide by 100; otherwise use as-is
                    return value > 1 ? value / 100 : value;
                }
            });

            if (receivablesSeries.length) {
                monthlyCollectionData.datasets[0].data = receivablesSeries;
            }
            if (collectedSeries.length) {
                monthlyCollectionData.datasets[1].data = collectedSeries;
            }

            if (monthlyCollectionData.datasets[2]) {
                const collectionTargetSeries = receivablesSeries.map((receivableValue, index) => {
                    const percentValue = normalizedPercentageValues[index];
                    if (!Number.isFinite(receivableValue) || !Number.isFinite(percentValue)) {
                        return null;
                    }
                    // percentValue is now normalized to 0-100 range, convert to decimal for calculation
                    const decimalPercent = percentValue / 100;
                    return receivableValue * decimalPercent;
                });

                if (collectionTargetSeries.some(value => Number.isFinite(value))) {
                    monthlyCollectionData.datasets[2].data = collectionTargetSeries;
                }
            }

            const averageReceivables = calculateAverage(receivablesSeries);
            const averageCollected = calculateAverage(collectedSeries);
            const averagePercentage = calculateAverage(normalizedPercentageValues);

            if (Number.isFinite(averageReceivables)) {
                COLLECTION_SUMMARY_METRICS.averageReceivables = averageReceivables;
            }
            if (Number.isFinite(averageCollected)) {
                COLLECTION_SUMMARY_METRICS.averageCollected = averageCollected;
            }
            if (Number.isFinite(averagePercentage)) {
                COLLECTION_SUMMARY_METRICS.actualRateOverride = averagePercentage;
            }

            console.log('Updated monthly collection datasets:', {
                receivables: monthlyCollectionData.datasets[0].data,
                collected: monthlyCollectionData.datasets[1].data,
                target: monthlyCollectionData.datasets[2]?.data,
                isPercentage: isPercentage,
                normalizedPercentages: normalizedPercentageValues
            });

            monthlyCollectionChart.update();
            updateCollectionSummary();
        }

        // ============================================
        // SECTION 3: COLLECTION CHARTS
        // ============================================

        const {
            data: monthlyCollectionData,
            config: monthlyCollectionConfig
        } = createComparisonChartStructures({
            yAxisTitle: 'Collections (Millions ₱)',
            barPluginId: 'monthlyCollectionDataLabels',
            currentLabel: 'Total Receivables',
            previousLabel: 'Total Collected',
            targetLabel: 'Collection Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        const COLLECTION_SUMMARY_METRICS = {
            targetRate: 100,
            averageReceivables: null,
            averageCollected: null,
            actualRateOverride: null
        };

        // ============================================
        // SECTION 4: RENTAL INCOME CHARTS
        // ============================================

        const {
            data: rentalComparisonData,
            config: rentalComparisonConfig
        } = createComparisonChartStructures({
            yAxisTitle: 'Rental Income (Millions ₱)',
            barPluginId: 'rentalBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current Year Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        async function initRentalIncomeCharts() {
            if (!rentalComparisonChart) {
                console.warn('Rental comparison chart is not initialized yet.');
                return;
            }

            console.log('Starting initRentalIncomeCharts...');

            const payload = await fetchDashboardData();
            const rentalCurrentRaw = payload?.rentalIncome2025
                ?? payload?.rentalIncomeCurrent
                ?? payload?.rental2025
                ?? payload?.monthlyRentalCurrent
                ?? [];
            const rental2024Raw = payload?.rentalIncome2024
                ?? payload?.rentalIncomePrevious
                ?? payload?.rental2024
                ?? payload?.monthlyRental2024
                ?? [];
            const rentalTargetRaw = payload?.rentalIncomeTarget
                ?? payload?.rentalTarget
                ?? payload?.rentalIncomeGoal
                ?? [];

            const rentalCurrentSeries = normalizeCurrencySeries(rentalCurrentRaw);
            const rental2024Series = normalizeCurrencySeries(rental2024Raw);
            const rentalTargetSeries = normalizeCurrencySeries(rentalTargetRaw);

            if (rentalCurrentSeries.length) {
                rentalComparisonData.datasets[0].data = rentalCurrentSeries;
            }
            if (rental2024Series.length) {
                rentalComparisonData.datasets[1].data = rental2024Series;
            }
            if (rentalTargetSeries.length && rentalComparisonData.datasets[2]) {
                rentalComparisonData.datasets[2].data = rentalTargetSeries;
            }

            console.log('Updated rental income datasets:', {
                current: rentalComparisonData.datasets[0].data,
                previous: rentalComparisonData.datasets[1].data,
                target: rentalComparisonData.datasets[2]?.data
            });

            rentalComparisonChart.update();
            updateRentalIncomeSummary();
        }

        // ============================================
        // SECTION 5: VENUE (P-VALUE) CHARTS
        // ============================================

        // Helper function to format thousands (data is already in K units)
        const formatThousandsLabel = (value) => {
            const numeric = Number(value);
            if (Number.isNaN(numeric)) {
                return 'P0.00';
            }
            // Convert thousands to actual value and format as currency
            const actualValue = numeric * 1000;
            return `P${actualValue.toLocaleString('en-PH', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        };

        // Custom plugin for venue/thousands format chart data labels (handles K format, labels above bars)
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

        // Custom line labels plugin for venue/thousands format charts (uses K format)
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

        // Create standard bar options for thousands format charts
        function createStandardBarOptionsThousands(yAxisTitle) {
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return 'P0.00';
                                }
                                return formatThousandsLabel(value);
                            }
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
            };
        }

        // Create comparison chart structures for thousands format
        function createComparisonChartStructuresThousands({
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
            includeBarLabels = true
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

            if (includeTarget) {
                const initialTargetData = Array.isArray(targetDataset) && targetDataset.length
                    ? [...targetDataset]
                    : Array(labels.length).fill(null);

                data.datasets.push(createTargetLineDataset({
                    label: targetLabel,
                    data: initialTargetData,
                    dataLabelColor: '#586740',
                    dataLabelOffset: 12,
                    tension: 0.35
                }));
            }

            const plugins = [];
            if (includeBarLabels) {
                plugins.push(createBarDataLabelsPlugin(barPluginId));
            }

            const config = {
                type: 'bar',
                data,
                options: createStandardBarOptionsThousands(yAxisTitle),
                plugins
            };

            return { data, config };
        }

        const {
            data: venueChartData,
            config: venueChartConfig
        } = createComparisonChartStructuresThousands({
            yAxisTitle: 'Venue (P-Value) (Thousands ₱)',
            barPluginId: 'venueBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current (60%) Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        async function initVenueCharts() {
            if (!venueChart) {
                console.warn('Venue chart is not initialized yet.');
                return;
            }

            console.log('Starting initVenueCharts...');

            const payload = await fetchDashboardData();
            const venueCurrentRaw = payload?.venuePvalue2025
                ?? payload?.venuePvalueCurrent
                ?? payload?.venue2025
                ?? payload?.monthlyVenueCurrent
                ?? [];
            const venue2024Raw = payload?.venuePvalue2024
                ?? payload?.venuePvaluePrevious
                ?? payload?.venue2024
                ?? payload?.monthlyVenue2024
                ?? [];
            const venueTargetRaw = payload?.venuePvalueTarget
                ?? payload?.venueTarget
                ?? payload?.venuePvalueGoal
                ?? [];

            const venueCurrentSeries = normalizeThousandsSeries(venueCurrentRaw);
            const venue2024Series = normalizeThousandsSeries(venue2024Raw);
            const venueTargetSeries = normalizeThousandsSeries(venueTargetRaw);

            if (venueCurrentSeries.length) {
                venueChartData.datasets[0].data = venueCurrentSeries;
            }
            if (venue2024Series.length) {
                venueChartData.datasets[1].data = venue2024Series;
            }
            if (venueTargetSeries.length && venueChartData.datasets[2]) {
                venueChartData.datasets[2].data = venueTargetSeries;
            }

            console.log('Updated venue P-value datasets:', {
                current: venueChartData.datasets[0].data,
                previous: venueChartData.datasets[1].data,
                target: venueChartData.datasets[2]?.data
            });

            venueChart.update();
            updateVenueSummary();
        }

        // ============================================
        // SECTION 6: STUDIO (P-VALUE) CHARTS
        // ============================================

        const {
            data: studioChartData,
            config: studioChartConfig
        } = createComparisonChartStructuresThousands({
            yAxisTitle: 'Studio (P-Value) (Thousands ₱)',
            barPluginId: 'studioBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current (60%) Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        async function initStudioCharts() {
            if (!studioChart) {
                console.warn('Studio chart is not initialized yet.');
                return;
            }

            console.log('Starting initStudioCharts...');

            const payload = await fetchDashboardData();
            const studioCurrentRaw = payload?.studioPvalue2025
                ?? payload?.studioPvalueCurrent
                ?? payload?.studio2025
                ?? payload?.monthlyStudioCurrent
                ?? [];
            const studio2024Raw = payload?.studioPvalue2024
                ?? payload?.studioPvaluePrevious
                ?? payload?.studio2024
                ?? payload?.monthlyStudio2024
                ?? [];
            const studioTargetRaw = payload?.studioPvalueTarget
                ?? payload?.studioTarget
                ?? payload?.studioPvalueGoal
                ?? [];

            const studioCurrentSeries = normalizeThousandsSeries(studioCurrentRaw);
            const studio2024Series = normalizeThousandsSeries(studio2024Raw);
            const studioTargetSeries = normalizeThousandsSeries(studioTargetRaw);

            if (studioCurrentSeries.length) {
                studioChartData.datasets[0].data = studioCurrentSeries;
            }
            if (studio2024Series.length) {
                studioChartData.datasets[1].data = studio2024Series;
            }
            if (studioTargetSeries.length && studioChartData.datasets[2]) {
                studioChartData.datasets[2].data = studioTargetSeries;
            }

            console.log('Updated studio P-value datasets:', {
                current: studioChartData.datasets[0].data,
                previous: studioChartData.datasets[1].data,
                target: studioChartData.datasets[2]?.data
            });

            studioChart.update();
            updateStudioSummary();
        }

        // ============================================
        // SECTION 7: SPORTS ARENA (P-VALUE) CHARTS
        // ============================================

        const {
            data: sportsArenaChartData,
            config: sportsArenaChartConfig
        } = createComparisonChartStructuresThousands({
            yAxisTitle: 'Sports Arena (P-Value) (Thousands ₱)',
            barPluginId: 'sportsArenaBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current (60%) Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        async function initSportsArenaCharts() {
            if (!sportsArenaChart) {
                console.warn('Sports Arena chart is not initialized yet.');
                return;
            }

            console.log('Starting initSportsArenaCharts...');

            const payload = await fetchDashboardData();
            const sportsArenaCurrentRaw = payload?.sportsArenaPvalue2025
                ?? payload?.sportsArenaPvalueCurrent
                ?? payload?.sportsArena2025
                ?? payload?.monthlySportsArenaCurrent
                ?? [];
            const sportsArena2024Raw = payload?.sportsArenaPvalue2024
                ?? payload?.sportsArenaPvaluePrevious
                ?? payload?.sportsArena2024
                ?? payload?.monthlySportsArena2024
                ?? [];
            const sportsArenaTargetRaw = payload?.sportsArenaPvalueTarget
                ?? payload?.sportsArenaTarget
                ?? payload?.sportsArenaPvalueGoal
                ?? [];

            const sportsArenaCurrentSeries = normalizeThousandsSeries(sportsArenaCurrentRaw);
            const sportsArena2024Series = normalizeThousandsSeries(sportsArena2024Raw);
            const sportsArenaTargetSeries = normalizeThousandsSeries(sportsArenaTargetRaw);

            if (sportsArenaCurrentSeries.length) {
                sportsArenaChartData.datasets[0].data = sportsArenaCurrentSeries;
            }
            if (sportsArena2024Series.length) {
                sportsArenaChartData.datasets[1].data = sportsArena2024Series;
            }
            if (sportsArenaTargetSeries.length && sportsArenaChartData.datasets[2]) {
                sportsArenaChartData.datasets[2].data = sportsArenaTargetSeries;
            }

            console.log('Updated sports arena P-value datasets:', {
                current: sportsArenaChartData.datasets[0].data,
                previous: sportsArenaChartData.datasets[1].data,
                target: sportsArenaChartData.datasets[2]?.data
            });

            sportsArenaChart.update();
            updateSportsArenaSummary();
        }

        // ============================================
        // SECTION 8: PARKING INCOME CHARTS
        // ============================================

        const {
            data: parkingIncomeChartData,
            config: parkingIncomeChartConfig
        } = createComparisonChartStructuresThousands({
            yAxisTitle: 'Parking Income (Thousands ₱)',
            barPluginId: 'parkingIncomeBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current (60%) Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        async function initParkingIncomeCharts() {
            if (!parkingIncomeChart) {
                console.warn('Parking income chart is not initialized yet.');
                return;
            }

            console.log('Starting initParkingIncomeCharts...');

            const payload = await fetchDashboardData();
            const parkingCurrentRaw = payload?.parkingIncome2025
                ?? payload?.parkingIncomeCurrent
                ?? payload?.parking2025
                ?? payload?.monthlyParkingCurrent
                ?? [];
            const parking2024Raw = payload?.parkingIncome2024
                ?? payload?.parkingIncomePrevious
                ?? payload?.parking2024
                ?? payload?.monthlyParking2024
                ?? [];
            const parkingTargetRaw = payload?.parkingIncomeTarget
                ?? payload?.parkingTarget
                ?? payload?.parkingIncomeGoal
                ?? [];

            const parkingCurrentSeries = normalizeThousandsSeries(parkingCurrentRaw);
            const parking2024Series = normalizeThousandsSeries(parking2024Raw);
            const parkingTargetSeries = normalizeThousandsSeries(parkingTargetRaw);

            if (parkingCurrentSeries.length) {
                parkingIncomeChartData.datasets[0].data = parkingCurrentSeries;
            }
            if (parking2024Series.length) {
                parkingIncomeChartData.datasets[1].data = parking2024Series;
            }
            if (parkingTargetSeries.length && parkingIncomeChartData.datasets[2]) {
                parkingIncomeChartData.datasets[2].data = parkingTargetSeries;
            }

            console.log('Updated parking income datasets:', {
                current: parkingIncomeChartData.datasets[0].data,
                previous: parkingIncomeChartData.datasets[1].data,
                target: parkingIncomeChartData.datasets[2]?.data
            });

            parkingIncomeChart.update();
            updateParkingIncomeSummary();
        }

        // ============================================
        // SECTION 9: ELECTRICITY EXPENSE CHARTS
        // ============================================

        const {
            data: electricityExpenseChartData,
            config: electricityExpenseChartConfig
        } = createComparisonChartStructures({
            yAxisTitle: 'Electricity Expense (Millions ₱)',
            barPluginId: 'electricityExpenseBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current Year Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        async function initElectricityExpenseCharts() {
            if (!electricityExpenseChart) {
                console.warn('Electricity expense chart is not initialized yet.');
                return;
            }

            console.log('Starting initElectricityExpenseCharts...');

            const payload = await fetchDashboardData();
            const electricityCurrentRaw = payload?.electricityExpense2025
                ?? payload?.electricityExpenseCurrent
                ?? payload?.electricity2025
                ?? payload?.monthlyElectricityCurrent
                ?? [];
            const electricity2024Raw = payload?.electricityExpense2024
                ?? payload?.electricityExpensePrevious
                ?? payload?.electricity2024
                ?? payload?.monthlyElectricity2024
                ?? [];
            const electricityTargetRaw = payload?.electricityExpenseTarget
                ?? payload?.electricityTarget
                ?? payload?.electricityExpenseGoal
                ?? [];

            const electricityCurrentSeries = normalizeCurrencySeries(electricityCurrentRaw);
            const electricity2024Series = normalizeCurrencySeries(electricity2024Raw);
            const electricityTargetSeries = normalizeCurrencySeries(electricityTargetRaw);

            if (electricityCurrentSeries.length) {
                electricityExpenseChartData.datasets[0].data = electricityCurrentSeries;
            }
            if (electricity2024Series.length) {
                electricityExpenseChartData.datasets[1].data = electricity2024Series;
            }
            if (electricityTargetSeries.length && electricityExpenseChartData.datasets[2]) {
                electricityExpenseChartData.datasets[2].data = electricityTargetSeries;
            }

            console.log('Updated electricity expense datasets:', {
                current: electricityExpenseChartData.datasets[0].data,
                previous: electricityExpenseChartData.datasets[1].data,
                target: electricityExpenseChartData.datasets[2]?.data
            });

            electricityExpenseChart.update();
            updateElectricityExpenseSummary();
        }

        // ============================================
        // EXPENSES SECTIONS (9+)
        // ============================================
        // SECTION 9: TOTAL OPERATING EXPENSE CHARTS
        // ============================================

        const {
            data: totalOperatingExpenseChartData,
            config: totalOperatingExpenseChartConfig
        } = createComparisonChartStructures({
            yAxisTitle: 'Total Operating Expense (Millions ₱)',
            barPluginId: 'totalOperatingExpenseBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current Year Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        async function initTotalOperatingExpenseCharts() {
            if (!totalOperatingExpenseChart) {
                console.warn('Total operating expense chart is not initialized yet.');
                return;
            }

            console.log('Starting initTotalOperatingExpenseCharts...');

            const payload = await fetchDashboardData();
            const totalOperatingExpensesCurrentRaw = payload?.totalOperatingExpenses2025
                ?? payload?.totalOperatingExpensesCurrent
                ?? payload?.totalOperatingExpense2025
                ?? payload?.monthlyTotalOperatingExpensesCurrent
                ?? [];
            const totalOperatingExpenses2024Raw = payload?.totalOperatingExpenses2024
                ?? payload?.totalOperatingExpensesPrevious
                ?? payload?.totalOperatingExpense2024
                ?? payload?.monthlyTotalOperatingExpenses2024
                ?? [];
            const totalOperatingExpensesTargetRaw = payload?.totalOperatingExpensesTarget
                ?? payload?.totalOperatingExpenseTarget
                ?? payload?.totalOperatingExpensesGoal
                ?? [];

            const totalOperatingExpensesCurrentSeries = normalizeCurrencySeries(totalOperatingExpensesCurrentRaw);
            const totalOperatingExpenses2024Series = normalizeCurrencySeries(totalOperatingExpenses2024Raw);
            const totalOperatingExpensesTargetSeries = normalizeCurrencySeries(totalOperatingExpensesTargetRaw);

            if (totalOperatingExpensesCurrentSeries.length) {
                totalOperatingExpenseChartData.datasets[0].data = totalOperatingExpensesCurrentSeries;
            }
            if (totalOperatingExpenses2024Series.length) {
                totalOperatingExpenseChartData.datasets[1].data = totalOperatingExpenses2024Series;
            }
            if (totalOperatingExpensesTargetSeries.length && totalOperatingExpenseChartData.datasets[2]) {
                totalOperatingExpenseChartData.datasets[2].data = totalOperatingExpensesTargetSeries;
            }

            console.log('Updated total operating expense datasets:', {
                current: totalOperatingExpenseChartData.datasets[0].data,
                previous: totalOperatingExpenseChartData.datasets[1].data,
                target: totalOperatingExpenseChartData.datasets[2]?.data
            });

            totalOperatingExpenseChart.update();
            updateTotalOperatingExpenseSummary();
        }


        // ============================================
        // SECTION 10: WATER EXPENSE CHARTS
        // ============================================

        const {
            data: waterExpenseChartData,
            config: waterExpenseChartConfig
        } = createComparisonChartStructuresThousands({
            yAxisTitle: 'Water Expense (Thousands ₱)',
            barPluginId: 'waterExpenseBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current Year Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        async function initWaterExpenseCharts() {
            if (!waterExpenseChart) {
                console.warn('Water expense chart is not initialized yet.');
                return;
            }

            console.log('Starting initWaterExpenseCharts...');

            const payload = await fetchDashboardData();
            const waterCurrentRaw = payload?.waterExpense2025
                ?? payload?.waterExpenseCurrent
                ?? payload?.water2025
                ?? payload?.monthlyWaterCurrent
                ?? [];
            const water2024Raw = payload?.waterExpense2024
                ?? payload?.waterExpensePrevious
                ?? payload?.water2024
                ?? payload?.monthlyWater2024
                ?? [];
            const waterTargetRaw = payload?.waterExpenseTarget
                ?? payload?.waterTarget
                ?? payload?.waterExpenseGoal
                ?? [];

            const waterCurrentSeries = normalizeThousandsSeries(waterCurrentRaw);
            const water2024Series = normalizeThousandsSeries(water2024Raw);
            const waterTargetSeries = normalizeThousandsSeries(waterTargetRaw);

            if (waterCurrentSeries.length) {
                waterExpenseChartData.datasets[0].data = waterCurrentSeries;
            }
            if (water2024Series.length) {
                waterExpenseChartData.datasets[1].data = water2024Series;
            }
            if (waterTargetSeries.length && waterExpenseChartData.datasets[2]) {
                waterExpenseChartData.datasets[2].data = waterTargetSeries;
            }

            console.log('Updated water expense datasets:', {
                current: waterExpenseChartData.datasets[0].data,
                previous: waterExpenseChartData.datasets[1].data,
                target: waterExpenseChartData.datasets[2]?.data
            });

            waterExpenseChart.update();
            updateWaterExpenseSummary();
        }

        // ============================================
        // SECTION 11: SECURITY EXPENSE CHARTS
        // ============================================

        const {
            data: securityExpenseChartData,
            config: securityExpenseChartConfig
        } = createComparisonChartStructures({
            yAxisTitle: 'Security Expense (Millions ₱)',
            barPluginId: 'securityExpenseBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current Year Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        async function initSecurityExpenseCharts() {
            if (!securityExpenseChart) {
                console.warn('Security expense chart is not initialized yet.');
                return;
            }

            console.log('Starting initSecurityExpenseCharts...');

            const payload = await fetchDashboardData();
            const securityCurrentRaw = payload?.securityExpense2025
                ?? payload?.securityExpenseCurrent
                ?? payload?.security2025
                ?? payload?.monthlySecurityCurrent
                ?? [];
            const security2024Raw = payload?.securityExpense2024
                ?? payload?.securityExpensePrevious
                ?? payload?.security2024
                ?? payload?.monthlySecurity2024
                ?? [];
            const securityTargetRaw = payload?.securityExpenseTarget
                ?? payload?.securityTarget
                ?? payload?.securityExpenseGoal
                ?? [];

            const securityCurrentSeries = normalizeCurrencySeries(securityCurrentRaw);
            const security2024Series = normalizeCurrencySeries(security2024Raw);
            const securityTargetSeries = normalizeCurrencySeries(securityTargetRaw);

            if (securityCurrentSeries.length) {
                securityExpenseChartData.datasets[0].data = securityCurrentSeries;
            }
            if (security2024Series.length) {
                securityExpenseChartData.datasets[1].data = security2024Series;
            }
            if (securityTargetSeries.length && securityExpenseChartData.datasets[2]) {
                securityExpenseChartData.datasets[2].data = securityTargetSeries;
            }

            console.log('Updated security expense datasets:', {
                current: securityExpenseChartData.datasets[0].data,
                previous: securityExpenseChartData.datasets[1].data,
                target: securityExpenseChartData.datasets[2]?.data
            });

            securityExpenseChart.update();
            updateSecurityExpenseSummary();
        }

        // ============================================
        // SECTION 12: AGENCY EXPENSE CHARTS
        // ============================================

        const {
            data: agencyExpenseChartData,
            config: agencyExpenseChartConfig
        } = createComparisonChartStructures({
            yAxisTitle: 'Agency Expense (Millions ₱)',
            barPluginId: 'agencyExpenseBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current Year Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        async function initAgencyExpenseCharts() {
            if (!agencyExpenseChart) {
                console.warn('Agency expense chart is not initialized yet.');
                return;
            }

            console.log('Starting initAgencyExpenseCharts...');

            const payload = await fetchDashboardData();
            const agencyCurrentRaw = payload?.agencyExpense2025
                ?? payload?.agencyExpenseCurrent
                ?? payload?.agency2025
                ?? payload?.monthlyAgencyCurrent
                ?? [];
            const agency2024Raw = payload?.agencyExpense2024
                ?? payload?.agencyExpensePrevious
                ?? payload?.agency2024
                ?? payload?.monthlyAgency2024
                ?? [];
            const agencyTargetRaw = payload?.agencyExpenseTarget
                ?? payload?.agencyTarget
                ?? payload?.agencyExpenseGoal
                ?? [];

            const agencyCurrentSeries = normalizeCurrencySeries(agencyCurrentRaw);
            const agency2024Series = normalizeCurrencySeries(agency2024Raw);
            const agencyTargetSeries = normalizeCurrencySeries(agencyTargetRaw);

            if (agencyCurrentSeries.length) {
                agencyExpenseChartData.datasets[0].data = agencyCurrentSeries;
            }
            if (agency2024Series.length) {
                agencyExpenseChartData.datasets[1].data = agency2024Series;
            }
            if (agencyTargetSeries.length && agencyExpenseChartData.datasets[2]) {
                agencyExpenseChartData.datasets[2].data = agencyTargetSeries;
            }

            console.log('Updated agency expense datasets:', {
                current: agencyExpenseChartData.datasets[0].data,
                previous: agencyExpenseChartData.datasets[1].data,
                target: agencyExpenseChartData.datasets[2]?.data
            });

            agencyExpenseChart.update();
            updateAgencyExpenseSummary();
        }

        // ============================================
        // SECTION 13: SALARY EXPENSE CHARTS
        // ============================================

        const {
            data: salaryExpenseChartData,
            config: salaryExpenseChartConfig
        } = createComparisonChartStructures({
            yAxisTitle: 'Salary Expense (Millions ₱)',
            barPluginId: 'salaryExpenseBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current Year Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        async function initSalaryExpenseCharts() {
            if (!salaryExpenseChart) {
                console.warn('Salary expense chart is not initialized yet.');
                return;
            }

            console.log('Starting initSalaryExpenseCharts...');

            const payload = await fetchDashboardData();
            const salaryCurrentRaw = payload?.salaryExpense2025
                ?? payload?.salaryExpenseCurrent
                ?? payload?.salary2025
                ?? payload?.monthlySalaryCurrent
                ?? [];
            const salary2024Raw = payload?.salaryExpense2024
                ?? payload?.salaryExpensePrevious
                ?? payload?.salary2024
                ?? payload?.monthlySalary2024
                ?? [];
            const salaryTargetRaw = payload?.salaryExpenseTarget
                ?? payload?.salaryTarget
                ?? payload?.salaryExpenseGoal
                ?? [];

            const salaryCurrentSeries = normalizeCurrencySeries(salaryCurrentRaw);
            const salary2024Series = normalizeCurrencySeries(salary2024Raw);
            const salaryTargetSeries = normalizeCurrencySeries(salaryTargetRaw);

            if (salaryCurrentSeries.length) {
                salaryExpenseChartData.datasets[0].data = salaryCurrentSeries;
            }
            if (salary2024Series.length) {
                salaryExpenseChartData.datasets[1].data = salary2024Series;
            }
            if (salaryTargetSeries.length && salaryExpenseChartData.datasets[2]) {
                salaryExpenseChartData.datasets[2].data = salaryTargetSeries;
            }

            console.log('Updated salary expense datasets:', {
                current: salaryExpenseChartData.datasets[0].data,
                previous: salaryExpenseChartData.datasets[1].data,
                target: salaryExpenseChartData.datasets[2]?.data
            });

            salaryExpenseChart.update();
            updateSalaryExpenseSummary();
        }

        // ============================================
        // SECTION 14: MARKETING EXPENSE CHARTS
        // ============================================

        const {
            data: marketingExpenseChartData,
            config: marketingExpenseChartConfig
        } = createComparisonChartStructuresThousands({
            yAxisTitle: 'Marketing Expense (Thousands ₱)',
            barPluginId: 'marketingExpenseBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current Year Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        // Override beginAtZero to false to allow negative values
        if (marketingExpenseChartConfig.options && marketingExpenseChartConfig.options.scales && marketingExpenseChartConfig.options.scales.y) {
            marketingExpenseChartConfig.options.scales.y.beginAtZero = false;
        }

        async function initMarketingExpenseCharts() {
            if (!marketingExpenseChart) {
                console.warn('Marketing expense chart is not initialized yet.');
                return;
            }

            console.log('Starting initMarketingExpenseCharts...');

            const payload = await fetchDashboardData();
            const marketingCurrentRaw = payload?.marketingExpense2025
                ?? payload?.marketingExpenseCurrent
                ?? payload?.marketing2025
                ?? payload?.monthlyMarketingCurrent
                ?? [];
            const marketing2024Raw = payload?.marketingExpense2024
                ?? payload?.marketingExpensePrevious
                ?? payload?.marketing2024
                ?? payload?.monthlyMarketing2024
                ?? [];
            const marketingTargetRaw = payload?.marketingExpenseTarget
                ?? payload?.marketingTarget
                ?? payload?.marketingExpenseGoal
                ?? [];

            const marketingCurrentSeries = normalizeThousandsSeries(marketingCurrentRaw);
            const marketing2024Series = normalizeThousandsSeries(marketing2024Raw);
            const marketingTargetSeries = normalizeThousandsSeries(marketingTargetRaw);

            if (marketingCurrentSeries.length) {
                marketingExpenseChartData.datasets[0].data = marketingCurrentSeries;
            }
            if (marketing2024Series.length) {
                marketingExpenseChartData.datasets[1].data = marketing2024Series;
            }
            if (marketingTargetSeries.length && marketingExpenseChartData.datasets[2]) {
                marketingExpenseChartData.datasets[2].data = marketingTargetSeries;
            }

            console.log('Updated marketing expense datasets:', {
                current: marketingExpenseChartData.datasets[0].data,
                previous: marketingExpenseChartData.datasets[1].data,
                target: marketingExpenseChartData.datasets[2]?.data
            });

            marketingExpenseChart.update();
            updateMarketingExpenseSummary();
        }

        // ============================================
        // SECTION 15: MARKETING EXPENSE (GATHERING) CHARTS
        // ============================================

        const {
            data: marketingExpenseGatheringChartData,
            config: marketingExpenseGatheringChartConfig
        } = createComparisonChartStructuresThousands({
            yAxisTitle: 'Marketing Expense (Gathering) (Thousands ₱)',
            barPluginId: 'marketingExpenseGatheringBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current Year Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        async function initMarketingExpenseGatheringCharts() {
            if (!marketingExpenseGatheringChart) {
                console.warn('Marketing expense gathering chart is not initialized yet.');
                return;
            }

            console.log('Starting initMarketingExpenseGatheringCharts...');

            const payload = await fetchDashboardData();
            const gatheringCurrentRaw = payload?.marketingExpenseGathering2025
                ?? payload?.marketingExpenseGatheringCurrent
                ?? payload?.marketingGathering2025
                ?? payload?.monthlyMarketingGatheringCurrent
                ?? [];
            const gathering2024Raw = payload?.marketingExpenseGathering2024
                ?? payload?.marketingExpenseGatheringPrevious
                ?? payload?.marketingGathering2024
                ?? payload?.monthlyMarketingGathering2024
                ?? [];
            const gatheringTargetRaw = payload?.marketingExpenseGatheringTarget
                ?? payload?.marketingGatheringTarget
                ?? payload?.marketingExpenseGatheringGoal
                ?? [];

            const gatheringCurrentSeries = normalizeThousandsSeries(gatheringCurrentRaw);
            const gathering2024Series = normalizeThousandsSeries(gathering2024Raw);
            const gatheringTargetSeries = normalizeThousandsSeries(gatheringTargetRaw);

            if (gatheringCurrentSeries.length) {
                marketingExpenseGatheringChartData.datasets[0].data = gatheringCurrentSeries;
            }
            if (gathering2024Series.length) {
                marketingExpenseGatheringChartData.datasets[1].data = gathering2024Series;
            }
            if (gatheringTargetSeries.length && marketingExpenseGatheringChartData.datasets[2]) {
                marketingExpenseGatheringChartData.datasets[2].data = gatheringTargetSeries;
            }

            console.log('Updated marketing expense gathering datasets:', {
                current: marketingExpenseGatheringChartData.datasets[0].data,
                previous: marketingExpenseGatheringChartData.datasets[1].data,
                target: marketingExpenseGatheringChartData.datasets[2]?.data
            });

            marketingExpenseGatheringChart.update();
            updateMarketingExpenseGatheringSummary();
        }

        // ============================================
        // SECTION 17: REPAIRS & MAINTENANCE (LABOR) CHARTS - DC TEAM
        // ============================================

        const {
            data: repairsMaintenanceLaborChartData,
            config: repairsMaintenanceLaborChartConfig
        } = createComparisonChartStructuresThousands({
            yAxisTitle: 'Repairs & Maintenance (Labor) (Thousands ₱)',
            barPluginId: 'repairsMaintenanceLaborBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current Year Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        async function initRepairsMaintenanceLaborCharts() {
            if (!repairsMaintenanceLaborChart) {
                console.warn('Repairs & maintenance labor chart is not initialized yet.');
                return;
            }

            console.log('Starting initRepairsMaintenanceLaborCharts...');

            const payload = await fetchDashboardData();
            const laborCurrentRaw = payload?.repairsMaintenanceLabor2025
                ?? payload?.repairsMaintenanceLaborCurrent
                ?? payload?.repairsLabor2025
                ?? payload?.monthlyRepairsLaborCurrent
                ?? [];
            const labor2024Raw = payload?.repairsMaintenanceLabor2024
                ?? payload?.repairsMaintenanceLaborPrevious
                ?? payload?.repairsLabor2024
                ?? payload?.monthlyRepairsLabor2024
                ?? [];
            const laborTargetRaw = payload?.repairsMaintenanceLaborTarget
                ?? payload?.repairsLaborTarget
                ?? payload?.repairsMaintenanceLaborGoal
                ?? [];

            const laborCurrentSeries = normalizeThousandsSeries(laborCurrentRaw);
            const labor2024Series = normalizeThousandsSeries(labor2024Raw);
            const laborTargetSeries = normalizeThousandsSeries(laborTargetRaw);

            if (laborCurrentSeries.length) {
                repairsMaintenanceLaborChartData.datasets[0].data = laborCurrentSeries;
            }
            if (labor2024Series.length) {
                repairsMaintenanceLaborChartData.datasets[1].data = labor2024Series;
            }
            if (laborTargetSeries.length && repairsMaintenanceLaborChartData.datasets[2]) {
                repairsMaintenanceLaborChartData.datasets[2].data = laborTargetSeries;
            }

            console.log('Updated repairs & maintenance labor datasets:', {
                current: repairsMaintenanceLaborChartData.datasets[0].data,
                previous: repairsMaintenanceLaborChartData.datasets[1].data,
                target: repairsMaintenanceLaborChartData.datasets[2]?.data
            });

            repairsMaintenanceLaborChart.update();
            updateRepairsMaintenanceLaborSummary();
        }

        // ============================================
        // SECTION 18: REPAIRS & MAINTENANCE (MATERIALS) CHARTS - DC TEAM
        // ============================================

        const {
            data: repairsMaintenanceMaterialsChartData,
            config: repairsMaintenanceMaterialsChartConfig
        } = createComparisonChartStructuresThousands({
            yAxisTitle: 'Repairs & Maintenance (Materials) (Thousands ₱)',
            barPluginId: 'repairsMaintenanceMaterialsBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current Year Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        async function initRepairsMaintenanceMaterialsCharts() {
            if (!repairsMaintenanceMaterialsChart) {
                console.warn('Repairs & maintenance materials chart is not initialized yet.');
                return;
            }

            console.log('Starting initRepairsMaintenanceMaterialsCharts...');

            const payload = await fetchDashboardData();
            const materialsCurrentRaw = payload?.repairsMaintenanceMaterials2025
                ?? payload?.repairsMaintenanceMaterialsCurrent
                ?? payload?.repairsMaterials2025
                ?? payload?.monthlyRepairsMaterialsCurrent
                ?? [];
            const materials2024Raw = payload?.repairsMaintenanceMaterials2024
                ?? payload?.repairsMaintenanceMaterialsPrevious
                ?? payload?.repairsMaterials2024
                ?? payload?.monthlyRepairsMaterials2024
                ?? [];
            const materialsTargetRaw = payload?.repairsMaintenanceMaterialsTarget
                ?? payload?.repairsMaterialsTarget
                ?? payload?.repairsMaintenanceMaterialsGoal
                ?? [];

            const materialsCurrentSeries = normalizeThousandsSeries(materialsCurrentRaw);
            const materials2024Series = normalizeThousandsSeries(materials2024Raw);
            const materialsTargetSeries = normalizeThousandsSeries(materialsTargetRaw);

            if (materialsCurrentSeries.length) {
                repairsMaintenanceMaterialsChartData.datasets[0].data = materialsCurrentSeries;
            }
            if (materials2024Series.length) {
                repairsMaintenanceMaterialsChartData.datasets[1].data = materials2024Series;
            }
            if (materialsTargetSeries.length && repairsMaintenanceMaterialsChartData.datasets[2]) {
                repairsMaintenanceMaterialsChartData.datasets[2].data = materialsTargetSeries;
            }

            console.log('Updated repairs & maintenance materials datasets:', {
                current: repairsMaintenanceMaterialsChartData.datasets[0].data,
                previous: repairsMaintenanceMaterialsChartData.datasets[1].data,
                target: repairsMaintenanceMaterialsChartData.datasets[2]?.data
            });

            repairsMaintenanceMaterialsChart.update();
            updateRepairsMaintenanceMaterialsSummary();
        }

        // ============================================
        // SECTION 19: REPAIRS & MAINTENANCE (LABOR) CHARTS - TECHNICAL TEAM
        // ============================================

        const {
            data: repairsMaintenanceLaborTechnicalChartData,
            config: repairsMaintenanceLaborTechnicalChartConfig
        } = createComparisonChartStructuresThousands({
            yAxisTitle: 'Repairs & Maintenance (Labor) - Technical (Thousands ₱)',
            barPluginId: 'repairsMaintenanceLaborTechnicalBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current Year Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        async function initRepairsMaintenanceLaborTechnicalCharts() {
            if (!repairsMaintenanceLaborTechnicalChart) {
                console.warn('Repairs & maintenance labor technical chart is not initialized yet.');
                return;
            }

            console.log('Starting initRepairsMaintenanceLaborTechnicalCharts...');

            const payload = await fetchDashboardData();
            const laborTechnicalCurrentRaw = payload?.repairsMaintenanceLaborTechnical2025
                ?? payload?.repairsMaintenanceLaborTechnicalCurrent
                ?? payload?.repairsLaborTechnical2025
                ?? payload?.monthlyRepairsLaborTechnicalCurrent
                ?? [];
            const laborTechnical2024Raw = payload?.repairsMaintenanceLaborTechnical2024
                ?? payload?.repairsMaintenanceLaborTechnicalPrevious
                ?? payload?.repairsLaborTechnical2024
                ?? payload?.monthlyRepairsLaborTechnical2024
                ?? [];
            const laborTechnicalTargetRaw = payload?.repairsMaintenanceLaborTechnicalTarget
                ?? payload?.repairsLaborTechnicalTarget
                ?? payload?.repairsMaintenanceLaborTechnicalGoal
                ?? [];

            const laborTechnicalCurrentSeries = normalizeThousandsSeries(laborTechnicalCurrentRaw);
            const laborTechnical2024Series = normalizeThousandsSeries(laborTechnical2024Raw);
            const laborTechnicalTargetSeries = normalizeThousandsSeries(laborTechnicalTargetRaw);

            if (laborTechnicalCurrentSeries.length) {
                repairsMaintenanceLaborTechnicalChartData.datasets[0].data = laborTechnicalCurrentSeries;
            }
            if (laborTechnical2024Series.length) {
                repairsMaintenanceLaborTechnicalChartData.datasets[1].data = laborTechnical2024Series;
            }
            if (laborTechnicalTargetSeries.length && repairsMaintenanceLaborTechnicalChartData.datasets[2]) {
                repairsMaintenanceLaborTechnicalChartData.datasets[2].data = laborTechnicalTargetSeries;
            }

            console.log('Updated repairs & maintenance labor technical datasets:', {
                current: repairsMaintenanceLaborTechnicalChartData.datasets[0].data,
                previous: repairsMaintenanceLaborTechnicalChartData.datasets[1].data,
                target: repairsMaintenanceLaborTechnicalChartData.datasets[2]?.data
            });

            repairsMaintenanceLaborTechnicalChart.update();
            updateRepairsMaintenanceLaborTechnicalSummary();
        }

        // ============================================
        // SECTION 20: REPAIRS & MAINTENANCE (MATERIALS) CHARTS - TECHNICAL TEAM
        // ============================================

        const {
            data: repairsMaintenanceMaterialsTechnicalChartData,
            config: repairsMaintenanceMaterialsTechnicalChartConfig
        } = createComparisonChartStructuresThousands({
            yAxisTitle: 'Repairs & Maintenance (Materials) - Technical (Thousands ₱)',
            barPluginId: 'repairsMaintenanceMaterialsTechnicalBarDataLabels',
            currentLabel: 'Year 2025',
            previousLabel: 'Year 2024',
            targetLabel: 'Current Year Target',
            currentDataset: Array(12).fill(0),
            previousDataset: Array(12).fill(0),
            targetDataset: Array(12).fill(0),
            includeBarLabels: false
        });

        async function initRepairsMaintenanceMaterialsTechnicalCharts() {
            if (!repairsMaintenanceMaterialsTechnicalChart) {
                console.warn('Repairs & maintenance materials technical chart is not initialized yet.');
                return;
            }

            console.log('Starting initRepairsMaintenanceMaterialsTechnicalCharts...');

            const payload = await fetchDashboardData();
            const materialsTechnicalCurrentRaw = payload?.repairsMaintenanceMaterialsTechnical2025
                ?? payload?.repairsMaintenanceMaterialsTechnicalCurrent
                ?? payload?.repairsMaterialsTechnical2025
                ?? payload?.monthlyRepairsMaterialsTechnicalCurrent
                ?? [];
            const materialsTechnical2024Raw = payload?.repairsMaintenanceMaterialsTechnical2024
                ?? payload?.repairsMaintenanceMaterialsTechnicalPrevious
                ?? payload?.repairsMaterialsTechnical2024
                ?? payload?.monthlyRepairsMaterialsTechnical2024
                ?? [];
            const materialsTechnicalTargetRaw = payload?.repairsMaintenanceMaterialsTechnicalTarget
                ?? payload?.repairsMaterialsTechnicalTarget
                ?? payload?.repairsMaintenanceMaterialsTechnicalGoal
                ?? [];

            const materialsTechnicalCurrentSeries = normalizeThousandsSeries(materialsTechnicalCurrentRaw);
            const materialsTechnical2024Series = normalizeThousandsSeries(materialsTechnical2024Raw);
            const materialsTechnicalTargetSeries = normalizeThousandsSeries(materialsTechnicalTargetRaw);

            if (materialsTechnicalCurrentSeries.length) {
                repairsMaintenanceMaterialsTechnicalChartData.datasets[0].data = materialsTechnicalCurrentSeries;
            }
            if (materialsTechnical2024Series.length) {
                repairsMaintenanceMaterialsTechnicalChartData.datasets[1].data = materialsTechnical2024Series;
            }
            if (materialsTechnicalTargetSeries.length && repairsMaintenanceMaterialsTechnicalChartData.datasets[2]) {
                repairsMaintenanceMaterialsTechnicalChartData.datasets[2].data = materialsTechnicalTargetSeries;
            }

            console.log('Updated repairs & maintenance materials technical datasets:', {
                current: repairsMaintenanceMaterialsTechnicalChartData.datasets[0].data,
                previous: repairsMaintenanceMaterialsTechnicalChartData.datasets[1].data,
                target: repairsMaintenanceMaterialsTechnicalChartData.datasets[2]?.data
            });

            repairsMaintenanceMaterialsTechnicalChart.update();
            updateRepairsMaintenanceMaterialsTechnicalSummary();
        }

        // Initialize the chart
        // ============================================
        // SECTION: OCCUPANCY RATE (UNIT) CHARTS - COMPANY LEAD
        // ============================================

        // Helper function to format units (simple number with commas)
        const formatUnitsLabel = (value) => {
            const numeric = Number(value);
            if (Number.isNaN(numeric)) {
                return '0';
            }
            // Format as number with commas (for foot traffic, visitor counts, etc.)
            return numeric.toLocaleString('en-PH', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        };

        // Custom plugin for units format chart data labels (supports custom formatters)
        const unitsDataLabelsPlugin = {
            id: 'unitsDataLabels',
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
                            const customFormatter = dataset.dataLabelFormatter;
                            const value = typeof customFormatter === 'function'
                                ? customFormatter(data, index, dataset)
                                : formatUnitsLabel(data);
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

        // Custom plugin for units format line chart data labels (supports custom formatters)
        const unitsLineDataLabelsPlugin = {
            id: 'unitsLineDataLabels',
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

                    const customFormatter = dataset.dataLabelFormatter;
                    const label = typeof customFormatter === 'function'
                        ? customFormatter(data, 0, dataset)
                        : formatUnitsLabel(data);
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

        // Reusable function to create occupancy rate chart data and config
        function createOccupancyRateChartStructure(targetLabel, yAxisTitle, formatter = formatUnitsLabel) {
            const chartData = {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Year 2025',
                        type: 'bar',
                        order: 1,
                        data: [],
                        backgroundColor: 'rgba(150, 168, 64, 0.85)',
                        borderColor: 'rgba(150, 168, 64, 1)',
                        hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                        borderWidth: 0,
                        borderRadius: 8,
                        dataLabelColor: '#96a840',
                        dataLabelFormatter: (value) => formatter(value)
                    },
                    {
                        label: 'Year 2024',
                        type: 'bar',
                        order: 2,
                        data: [],
                        backgroundColor: 'rgba(229, 187, 34, 0.85)',
                        borderColor: 'rgba(229, 187, 34, 1)',
                        hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                        borderWidth: 0,
                        borderRadius: 8,
                        dataLabelColor: '#e5bb22',
                        dataLabelFormatter: (value) => formatter(value)
                    },
                    {
                        label: targetLabel,
                        type: 'line',
                        order: 3,
                        data: [],
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
                        dataLabelFormatter: (value) => formatter(value)
                    }
                ]
            };

            const chartConfig = {
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
                                    return `${context.dataset.label}: ${formatter(value)}`;
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
                                    // Always display zero
                                    if (value === 0 || value === '0') {
                                        // Use appropriate format based on formatter type
                                        if (formatter === formatMillionsLabel) {
                                            return 'P0.00';
                                        } else if (formatter === formatUnitsLabel) {
                                            return '0';
                                        } else {
                                            return 'P0.00';
                                        }
                                    }
                                    return formatter(value);
                                }
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
                plugins: []
            };

            return { data: chartData, config: chartConfig };
        }

        // Occupancy Rate (Unit) - Company Lead Comparison Bar Chart
        const {
            data: occupancyRateLeadChartData,
            config: occupancyRateLeadChartConfig
        } = createOccupancyRateChartStructure('Target (Max Units)', 'Occupancy Rate (Units)');

        // Initialize the occupancy rate lead chart (if element exists)
        let occupancyRateLeadChart = null;
        const occupancyRateLeadChartElement = document.getElementById('occupancyRateLeadChart');
        if (occupancyRateLeadChartElement) {
            occupancyRateLeadChart = new Chart(
                occupancyRateLeadChartElement,
                occupancyRateLeadChartConfig
            );
        }

        async function initOccupancyRateLeadCharts() {
            if (!occupancyRateLeadChart) {
                console.warn('Occupancy rate lead chart is not initialized yet.');
                return;
            }

            console.log('Starting initOccupancyRateLeadCharts...');

            const payload = await fetchDashboardData();
            const occupancyLead2025Raw = payload?.occupancyRateLead2025 ?? [];
            const occupancyLead2024Raw = payload?.occupancyRateLead2024 ?? [];
            const occupancyLeadTargetRaw = payload?.occupancyRateLeadTarget ?? [];

            const occupancyLead2025Data = extractNumericValues(occupancyLead2025Raw);
            const occupancyLead2024Data = extractNumericValues(occupancyLead2024Raw);
            const occupancyLeadTargetData = extractNumericValues(occupancyLeadTargetRaw);

            if (occupancyLead2025Data.length) {
                occupancyRateLeadChartData.datasets[0].data = occupancyLead2025Data;
            }
            if (occupancyLead2024Data.length) {
                occupancyRateLeadChartData.datasets[1].data = occupancyLead2024Data;
            }
            if (occupancyLeadTargetData.length && occupancyRateLeadChartData.datasets[2]) {
                occupancyRateLeadChartData.datasets[2].data = occupancyLeadTargetData;
            }

            console.log('Updated occupancy rate lead datasets:', {
                current: occupancyRateLeadChartData.datasets[0].data,
                previous: occupancyRateLeadChartData.datasets[1].data,
                target: occupancyRateLeadChartData.datasets[2]?.data
            });

            occupancyRateLeadChart.update();
            updateOccupancyRateUnitSummary();
        }

        // ============================================
        // SECTION: OCCUPANCY RATE (AREA) CHARTS - COMPANY LEAD
        // ============================================

        // Occupancy Rate (Area) - Company Lead Comparison Bar Chart
        const {
            data: occupancyRateAreaLeadChartData,
            config: occupancyRateAreaLeadChartConfig
        } = createOccupancyRateChartStructure('Target (Max Area)', 'Occupancy Rate (Area)');

        // Initialize the occupancy rate area lead chart (if element exists)
        let occupancyRateAreaLeadChart = null;
        const occupancyRateAreaLeadChartElement = document.getElementById('occupancyRateAreaLeadChart');
        if (occupancyRateAreaLeadChartElement) {
            occupancyRateAreaLeadChart = new Chart(
                occupancyRateAreaLeadChartElement,
                occupancyRateAreaLeadChartConfig
            );
        }

        async function initOccupancyRateAreaLeadCharts() {
            if (!occupancyRateAreaLeadChart) {
                console.warn('Occupancy rate area lead chart is not initialized yet.');
                return;
            }

            console.log('Starting initOccupancyRateAreaLeadCharts...');

            const payload = await fetchDashboardData();
            const occupancyAreaLead2025Raw = payload?.occupancyRateAreaLead2025 ?? [];
            const occupancyAreaLead2024Raw = payload?.occupancyRateAreaLead2024 ?? [];
            const occupancyAreaLeadTargetRaw = payload?.occupancyRateAreaLeadTarget ?? [];

            const occupancyAreaLead2025Data = extractNumericValues(occupancyAreaLead2025Raw);
            const occupancyAreaLead2024Data = extractNumericValues(occupancyAreaLead2024Raw);
            const occupancyAreaLeadTargetData = extractNumericValues(occupancyAreaLeadTargetRaw);

            if (occupancyAreaLead2025Data.length) {
                occupancyRateAreaLeadChartData.datasets[0].data = occupancyAreaLead2025Data;
            }
            if (occupancyAreaLead2024Data.length) {
                occupancyRateAreaLeadChartData.datasets[1].data = occupancyAreaLead2024Data;
            }
            if (occupancyAreaLeadTargetData.length && occupancyRateAreaLeadChartData.datasets[2]) {
                occupancyRateAreaLeadChartData.datasets[2].data = occupancyAreaLeadTargetData;
            }

            console.log('Updated occupancy rate area lead datasets:', {
                current: occupancyRateAreaLeadChartData.datasets[0].data,
                previous: occupancyRateAreaLeadChartData.datasets[1].data,
                target: occupancyRateAreaLeadChartData.datasets[2]?.data
            });

            occupancyRateAreaLeadChart.update();
            updateOccupancyRateAreaSummary();
        }

        // ============================================
        // SECTION: OCCUPANCY RATE (P-VALUE) CHARTS - COMPANY LEAD
        // ============================================

        // Occupancy Rate (P-Value) - Company Lead Comparison Bar Chart
        const {
            data: occupancyRatePValueLeadChartData,
            config: occupancyRatePValueLeadChartConfig
        } = createOccupancyRateChartStructure('Target (Max P-Value)', 'Occupancy Rate (P-Value) (Millions ₱)', formatMillionsLabel);

        // Initialize the occupancy rate p-value lead chart (if element exists)
        let occupancyRatePValueLeadChart = null;
        const occupancyRatePValueLeadChartElement = document.getElementById('occupancyRatePValueLeadChart');
        if (occupancyRatePValueLeadChartElement) {
            occupancyRatePValueLeadChart = new Chart(
                occupancyRatePValueLeadChartElement,
                occupancyRatePValueLeadChartConfig
            );
        }

        async function initOccupancyRatePValueLeadCharts() {
            if (!occupancyRatePValueLeadChart) {
                console.warn('Occupancy rate p-value lead chart is not initialized yet.');
                return;
            }

            console.log('Starting initOccupancyRatePValueLeadCharts...');

            const payload = await fetchDashboardData();
            const occupancyPValueLead2025Raw = payload?.occupancyRatePValueLead2025
                ?? payload?.occupancyPValueLead2025
                ?? payload?.occupancyRatePValueLeadCurrent
                ?? [];
            const occupancyPValueLead2024Raw = payload?.occupancyRatePValueLead2024
                ?? payload?.occupancyPValueLead2024
                ?? payload?.occupancyRatePValueLeadPrevious
                ?? [];
            const occupancyPValueLeadTargetRaw = payload?.occupancyRatePValueLeadTarget
                ?? payload?.occupancyPValueLeadTarget
                ?? payload?.occupancyRatePValueLeadGoal
                ?? [];

            const occupancyPValueLead2025Data = normalizeCurrencySeries(occupancyPValueLead2025Raw);
            const occupancyPValueLead2024Data = normalizeCurrencySeries(occupancyPValueLead2024Raw);
            const occupancyPValueLeadTargetData = normalizeCurrencySeries(occupancyPValueLeadTargetRaw);

            if (occupancyPValueLead2025Data.length) {
                occupancyRatePValueLeadChartData.datasets[0].data = occupancyPValueLead2025Data;
            }
            if (occupancyPValueLead2024Data.length) {
                occupancyRatePValueLeadChartData.datasets[1].data = occupancyPValueLead2024Data;
            }
            if (occupancyPValueLeadTargetData.length && occupancyRatePValueLeadChartData.datasets[2]) {
                occupancyRatePValueLeadChartData.datasets[2].data = occupancyPValueLeadTargetData;
            }

            console.log('Updated occupancy rate p-value lead datasets:', {
                current: occupancyRatePValueLeadChartData.datasets[0].data,
                previous: occupancyRatePValueLeadChartData.datasets[1].data,
                target: occupancyRatePValueLeadChartData.datasets[2]?.data
            });

            occupancyRatePValueLeadChart.update();
            updateOccupancyRatePValueSummary();
        }

        // ============================================
        // SECTION: FOOT TRAFFIC PER SITE - LOTUS MALL (COMPANY LEAD)
        // ============================================

        const lotusFootTrafficChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: [],
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840',
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: [],
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22',
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
                },
                {
                    label: 'Target',
                    type: 'line',
                    order: 3,
                    data: [],
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
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
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
                                return `${context.dataset.label}: ${formatUnitsLabel(value)}`;
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return '0';
                                }
                                return formatUnitsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Foot Traffic (Visitors)',
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
                unitsDataLabelsPlugin,
                unitsLineDataLabelsPlugin
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

        const initLotusFootTrafficCharts = () => initGenericChart({
            chart: lotusFootTrafficChart,
            chartData: lotusFootTrafficChartData,
            payloadKeys: { key2025: 'lotusFootTraffic2025', key2024: 'lotusFootTraffic2024', keyTarget: 'lotusFootTrafficTarget' },
            summaryCardTitle: null,
            chartName: 'initLotusFootTrafficCharts',
            updateSummary: false,
            updateFunction: updateLotusFootTrafficSummary
        });

        // Portal Mall Foot Traffic
        const portalFootTrafficChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: [],
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840',
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: [],
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22',
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
                },
                {
                    label: 'Target',
                    type: 'line',
                    order: 3,
                    data: [],
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
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
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
                                return `${context.dataset.label}: ${formatUnitsLabel(value)}`;
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return '0';
                                }
                                return formatUnitsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Foot Traffic (Visitors)',
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
                unitsDataLabelsPlugin,
                unitsLineDataLabelsPlugin
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

        const initPortalFootTrafficCharts = () => initGenericChart({
            chart: portalFootTrafficChart,
            chartData: portalFootTrafficChartData,
            payloadKeys: { key2025: 'portalFootTraffic2025', key2024: 'portalFootTraffic2024', keyTarget: 'portalFootTrafficTarget' },
            summaryCardTitle: null,
            chartName: 'initPortalFootTrafficCharts',
            updateSummary: false,
            updateFunction: updatePortalFootTrafficSummary
        });

        // Stadium Shopping Strip Foot Traffic
        const stadiumFootTrafficChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: [],
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840',
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: [],
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22',
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
                },
                {
                    label: 'Target',
                    type: 'line',
                    order: 3,
                    data: [],
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
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
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
                                return `${context.dataset.label}: ${formatUnitsLabel(value)}`;
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return '0';
                                }
                                return formatUnitsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Foot Traffic (Visitors)',
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
                unitsDataLabelsPlugin,
                unitsLineDataLabelsPlugin
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

        const initStadiumFootTrafficCharts = () => initGenericChart({
            chart: stadiumFootTrafficChart,
            chartData: stadiumFootTrafficChartData,
            payloadKeys: { key2025: 'stadiumFootTraffic2025', key2024: 'stadiumFootTraffic2024', keyTarget: 'stadiumFootTrafficTarget' },
            summaryCardTitle: null,
            chartName: 'initStadiumFootTrafficCharts',
            updateSummary: false,
            updateFunction: updateStadiumFootTrafficSummary
        });

        // ySpacio Creative Park Carbag Foot Traffic
        const yspacioFootTrafficChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: [],
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840',
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: [],
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22',
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
                },
                {
                    label: 'Target',
                    type: 'line',
                    order: 3,
                    data: [],
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
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
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
                                return `${context.dataset.label}: ${formatUnitsLabel(value)}`;
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return '0';
                                }
                                return formatUnitsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Foot Traffic (Visitors)',
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
                unitsDataLabelsPlugin,
                unitsLineDataLabelsPlugin
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

        const initYspacioFootTrafficCharts = () => initGenericChart({
            chart: yspacioFootTrafficChart,
            chartData: yspacioFootTrafficChartData,
            payloadKeys: { key2025: 'yspacioFootTraffic2025', key2024: 'yspacioFootTraffic2024', keyTarget: 'yspacioFootTrafficTarget' },
            summaryCardTitle: null,
            chartName: 'initYspacioFootTrafficCharts',
            updateSummary: false,
            updateFunction: updateYspacioFootTrafficSummary
        });

        // ySpacio Creative Park Alapan Foot Traffic
        const yspacioAlapanFootTrafficChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: [],
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840',
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: [],
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22',
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
                },
                {
                    label: 'Target',
                    type: 'line',
                    order: 3,
                    data: [],
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
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
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
                                return `${context.dataset.label}: ${formatUnitsLabel(value)}`;
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return '0';
                                }
                                return formatUnitsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Foot Traffic (Visitors)',
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
                unitsDataLabelsPlugin,
                unitsLineDataLabelsPlugin
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

        const initYspacioAlapanFootTrafficCharts = () => initGenericChart({
            chart: yspacioAlapanFootTrafficChart,
            chartData: yspacioAlapanFootTrafficChartData,
            payloadKeys: { key2025: 'yspacioAlapanFootTraffic2025', key2024: 'yspacioAlapanFootTraffic2024', keyTarget: 'yspacioAlapanFootTrafficTarget' },
            summaryCardTitle: null,
            chartName: 'initYspacioAlapanFootTrafficCharts',
            updateSummary: false,
            updateFunction: updateYspacioAlapanFootTrafficSummary
        });

        // Lumina Foot Traffic
        const luminaFootTrafficChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: [],
                    backgroundColor: 'rgba(150, 168, 64, 0.85)',
                    borderColor: 'rgba(150, 168, 64, 1)',
                    hoverBackgroundColor: 'rgba(150, 168, 64, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#96a840',
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
                },
                {
                    label: 'Year 2024',
                    type: 'bar',
                    order: 2,
                    data: [],
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22',
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
                },
                {
                    label: 'Target',
                    type: 'line',
                    order: 3,
                    data: [],
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
                    dataLabelFormatter: (value) => formatUnitsLabel(value)
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
                                return `${context.dataset.label}: ${formatUnitsLabel(value)}`;
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return '0';
                                }
                                return formatUnitsLabel(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Foot Traffic (Visitors)',
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
                unitsDataLabelsPlugin,
                unitsLineDataLabelsPlugin
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

        const initLuminaFootTrafficCharts = () => initGenericChart({
            chart: luminaFootTrafficChart,
            chartData: luminaFootTrafficChartData,
            payloadKeys: { key2025: 'luminaFootTraffic2025', key2024: 'luminaFootTraffic2024', keyTarget: 'luminaFootTrafficTarget' },
            summaryCardTitle: null,
            chartName: 'initLuminaFootTrafficCharts',
            updateSummary: false,
            updateFunction: updateLuminaFootTrafficSummary
        });

        // ============================================
        // SECTION: LOTUS MALL PAX PER EVENT (COMPANY LEAD)
        // ============================================

        // Lotus Mall Pax per Event - Company Lead Comparison Bar Chart
        const {
            data: lotusPaxChartData,
            config: lotusPaxChartConfig
        } = createOccupancyRateChartStructure('Target', 'Lotus Mall - Pax per Event');

        // Remove floating text labels
        lotusPaxChartConfig.plugins = [];

        // Initialize the lotus pax chart (if element exists)
        let lotusPaxChart = null;
        const lotusPaxChartElement = document.getElementById('lotusPaxChart');
        if (lotusPaxChartElement) {
            lotusPaxChart = new Chart(
                lotusPaxChartElement,
                lotusPaxChartConfig
            );
        }

        const initLotusPaxCharts = () => initGenericChart({
            chart: lotusPaxChart,
            chartData: lotusPaxChartData,
            payloadKeys: { key2025: 'lotusPax2025', key2024: 'lotusPax2024', keyTarget: 'lotusPaxTarget' },
            summaryCardTitle: null,
            chartName: 'initLotusPaxCharts',
            updateSummary: false,
            updateFunction: updateLotusPaxSummary
        });

        // ============================================
        // SECTION: PORTAL MALL PAX PER EVENT (COMPANY LEAD)
        // ============================================

        // Portal Mall Pax per Event - Company Lead Comparison Bar Chart
        const {
            data: portalPaxChartData,
            config: portalPaxChartConfig
        } = createOccupancyRateChartStructure('Target', 'Portal Mall - Pax per Event');

        // Remove floating text labels
        portalPaxChartConfig.plugins = [];

        // Initialize the portal pax chart (if element exists)
        let portalPaxChart = null;
        const portalPaxChartElement = document.getElementById('portalPaxChart');
        if (portalPaxChartElement) {
            portalPaxChart = new Chart(
                portalPaxChartElement,
                portalPaxChartConfig
            );
        }

        const initPortalPaxCharts = () => initGenericChart({
            chart: portalPaxChart,
            chartData: portalPaxChartData,
            payloadKeys: { key2025: 'portalPax2025', key2024: 'portalPax2024', keyTarget: 'portalPaxTarget' },
            summaryCardTitle: null,
            chartName: 'initPortalPaxCharts',
            updateSummary: false,
            updateFunction: updatePortalPaxSummary
        });

        // ============================================
        // SECTION: STADIUM SHOPPING STRIP PAX PER EVENT (COMPANY LEAD)
        // ============================================

        // Stadium Shopping Strip Pax per Event - Company Lead Comparison Bar Chart
        const {
            data: stadiumPaxChartData,
            config: stadiumPaxChartConfig
        } = createOccupancyRateChartStructure('Target', 'Stadium Shopping Strip - Pax per Event');

        // Remove floating text labels
        stadiumPaxChartConfig.plugins = [];

        // Initialize the stadium pax chart (if element exists)
        let stadiumPaxChart = null;
        const stadiumPaxChartElement = document.getElementById('stadiumPaxChart');
        if (stadiumPaxChartElement) {
            stadiumPaxChart = new Chart(
                stadiumPaxChartElement,
                stadiumPaxChartConfig
            );
        }

        const initStadiumPaxCharts = () => initGenericChart({
            chart: stadiumPaxChart,
            chartData: stadiumPaxChartData,
            payloadKeys: { key2025: 'stadiumPax2025', key2024: 'stadiumPax2024', keyTarget: 'stadiumPaxTarget' },
            summaryCardTitle: null,
            chartName: 'initStadiumPaxCharts',
            updateSummary: false,
            updateFunction: updateStadiumPaxSummary
        });

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
                            callback: (value) => {
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return 'P0.00';
                                }
                                return formatMillionsLabel(value);
                            }
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
                    data: [],
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
                    data: [],
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
                    data: [],
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

        const pulloutAversionLeadChartData = {
            labels: opportunityBlankLabels,
            datasets: [
                {
                    label: 'Year 2025',
                    type: 'bar',
                    order: 1,
                    data: [],
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
                    data: [],
                    backgroundColor: 'rgba(229, 187, 34, 0.85)',
                    borderColor: 'rgba(229, 187, 34, 1)',
                    hoverBackgroundColor: 'rgba(229, 187, 34, 0.95)',
                    borderWidth: 0,
                    borderRadius: 8,
                    dataLabelColor: '#e5bb22'
                },
                {
                    label: 'Target (%)',
                    type: 'line',
                    order: 3,
                    data: [],
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

        const closedInquiriesLeadChartConfig = createOpportunityPValueChartConfig(
            closedInquiriesLeadChartData,
            'closedInquiriesLeadBarDataLabels',
            'Closed Inquiries (Thousands ₱)'
        );
        // Override tooltip and y-axis formatting for thousands instead of millions
        closedInquiriesLeadChartConfig.options.plugins.tooltip.callbacks.label = function(context) {
            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
            return `${context.dataset.label}: ${formatThousandsLabel(value || 0)}`;
        };
        closedInquiriesLeadChartConfig.options.scales.y.ticks.callback = (value) => formatThousandsLabel(value);
        // Remove max constraint to allow auto-scaling for thousands values
        delete closedInquiriesLeadChartConfig.options.scales.y.max;
        // Remove data labels (floating texts)
        closedInquiriesLeadChartConfig.plugins = [];

        // ============================================
        // SECTION: OFFLINE INQUIRIES (CONVERSION) (COMPANY LEAD)
        // ============================================

        // Offline Inquiries (Conversion) - Company Lead Comparison Bar Chart
        const {
            data: offlineInquiriesLeadChartData,
            config: offlineInquiriesLeadChartConfig
        } = createOccupancyRateChartStructure('Target', 'Offline Inquiries (Conversion)');

        // Remove floating text labels
        offlineInquiriesLeadChartConfig.plugins = [];

        // ============================================
        // SECTION: FB PAGE FOLLOWERS (COMPANY LEAD)
        // ============================================

        const fbFollowersData = {
            labels: opportunityBlankLabels,
            target: new Array(opportunityBlankLabels.length).fill(0),
            year2024: new Array(opportunityBlankLabels.length).fill(0),
            year2025: new Array(opportunityBlankLabels.length).fill(0)
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return '0%';
                                }
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
            target: new Array(opportunityBlankLabels.length).fill(0),
            year2024: new Array(opportunityBlankLabels.length).fill(0),
            year2025: new Array(opportunityBlankLabels.length).fill(0)
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return '0%';
                                }
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
            target: new Array(opportunityBlankLabels.length).fill(0),
            year2024: new Array(opportunityBlankLabels.length).fill(0),
            year2025: new Array(opportunityBlankLabels.length).fill(0)
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return '0%';
                                }
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
            target: new Array(opportunityBlankLabels.length).fill(0),
            year2024: new Array(opportunityBlankLabels.length).fill(0),
            year2025: new Array(opportunityBlankLabels.length).fill(0)
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return '0%';
                                }
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
            target: new Array(opportunityBlankLabels.length).fill(0),
            year2024: new Array(opportunityBlankLabels.length).fill(0),
            year2025: new Array(opportunityBlankLabels.length).fill(0)
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return '0%';
                                }
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
            target: new Array(opportunityBlankLabels.length).fill(0),
            year2024: new Array(opportunityBlankLabels.length).fill(0),
            year2025: new Array(opportunityBlankLabels.length).fill(0)
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return '0%';
                                }
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
            target: new Array(opportunityBlankLabels.length).fill(0),
            year2024: new Array(opportunityBlankLabels.length).fill(0),
            year2025: new Array(opportunityBlankLabels.length).fill(0)
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return '0%';
                                }
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
            target: new Array(opportunityBlankLabels.length).fill(0),
            year2024: new Array(opportunityBlankLabels.length).fill(0),
            year2025: new Array(opportunityBlankLabels.length).fill(0)
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return '0%';
                                }
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
            target: new Array(opportunityBlankLabels.length).fill(0),
            year2024: new Array(opportunityBlankLabels.length).fill(0),
            year2025: new Array(opportunityBlankLabels.length).fill(0)
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return '0%';
                                }
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
            target: new Array(opportunityBlankLabels.length).fill(0),
            year2024: new Array(opportunityBlankLabels.length).fill(0),
            year2025: new Array(opportunityBlankLabels.length).fill(0)
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
                                // Always display zero
                                if (value === 0 || value === '0') {
                                    return '0%';
                                }
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
            'Pullout Aversion'
        );
        // Remove data labels (floating texts)
        pulloutAversionLeadChartConfig.plugins = [];
        // Update tooltip to show people count (not millions) for bars, percentage for target line
        pulloutAversionLeadChartConfig.options.plugins.tooltip.callbacks.label = function(context) {
            const value = typeof context.parsed === 'object' ? context.parsed.y : context.parsed;
            // If it's the target line (index 2), calculate and show as percentage of 2024
            if (context.datasetIndex === 2) {
                const dataIndex = context.dataIndex;
                const value2024 = pulloutAversionLeadChartData.datasets[1].data[dataIndex];
                if (value2024 && value2024 !== 0) {
                    const percentage = (Number(value) / value2024) * 100;
                    return `${context.dataset.label}: ${formatPercentage(percentage)}`;
                }
                return `${context.dataset.label}: ${formatPercentage(0)}`;
            }
            // Otherwise show as people count (formatted number with commas)
            return `${context.dataset.label}: ${formatUnitsLabel(value || 0)}`;
        };
        // Update y-axis ticks to show people count (not millions)
        pulloutAversionLeadChartConfig.options.scales.y.ticks.callback = (value) => {
            // Always display zero
            if (value === 0 || value === '0') {
                return '0';
            }
            return formatUnitsLabel(value);
        };
        // Remove max constraint to allow auto-scaling
        delete pulloutAversionLeadChartConfig.options.scales.y.max;

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
        // LEAD CHARTS INITIALIZATION FUNCTIONS
        // ============================================

        async function initClosedInquiriesLeadCharts() {
            if (!closedInquiriesLeadChart) {
                console.warn('Closed inquiries lead chart is not initialized yet.');
                return;
            }

            console.log('Starting initClosedInquiriesLeadCharts...');

            const payload = await fetchDashboardData();
            const closedInquiries2025Raw = payload?.closedInquiries2025
                ?? payload?.closedInquiriesCurrent
                ?? payload?.closedInquiries2025Series
                ?? [];
            const closedInquiries2024Raw = payload?.closedInquiries2024
                ?? payload?.closedInquiriesPrevious
                ?? payload?.closedInquiries2024Series
                ?? [];
            const closedInquiriesTargetRaw = payload?.closedInquiriesTarget
                ?? payload?.closedInquiriesGoal
                ?? payload?.closedInquiriesTargetSeries
                ?? [];

            console.log('Closed inquiries raw data:', {
                '2025': closedInquiries2025Raw,
                '2024': closedInquiries2024Raw,
                'target': closedInquiriesTargetRaw
            });

            const closedInquiries2025Data = extractNumericValues(closedInquiries2025Raw);
            const closedInquiries2024Data = extractNumericValues(closedInquiries2024Raw);
            const closedInquiriesTargetData = extractNumericValues(closedInquiriesTargetRaw);

            console.log('Closed inquiries extracted data:', {
                '2025': closedInquiries2025Data,
                '2024': closedInquiries2024Data,
                'target': closedInquiriesTargetData
            });

            if (closedInquiries2025Data.length) {
                closedInquiriesLeadChartData.datasets[0].data = closedInquiries2025Data;
            }
            if (closedInquiries2024Data.length) {
                closedInquiriesLeadChartData.datasets[1].data = closedInquiries2024Data;
            }
            if (closedInquiriesTargetData.length && closedInquiriesLeadChartData.datasets[2]) {
                closedInquiriesLeadChartData.datasets[2].data = closedInquiriesTargetData;
            }

            console.log('Updated closed inquiries datasets:', {
                current: closedInquiriesLeadChartData.datasets[0].data,
                previous: closedInquiriesLeadChartData.datasets[1].data,
                target: closedInquiriesLeadChartData.datasets[2]?.data
            });

            closedInquiriesLeadChart.update();
            updateClosedInquiriesSummary();
        }

        async function initOfflineInquiriesLeadCharts() {
            if (!offlineInquiriesLeadChart) {
                console.warn('Offline inquiries lead chart is not initialized yet.');
                return;
            }

            console.log('Starting initOfflineInquiriesLeadCharts...');

            const payload = await fetchDashboardData();
            const offlineInquiries2025Raw = payload?.offlineInquiries2025 ?? payload?.offlineInquiriesCurrent ?? [];
            const offlineInquiries2024Raw = payload?.offlineInquiries2024 ?? payload?.offlineInquiriesPrevious ?? [];
            const offlineInquiriesTargetRaw = payload?.offlineInquiriesTarget ?? payload?.offlineInquiriesGoal ?? [];

            const offlineInquiries2025Data = extractNumericValues(offlineInquiries2025Raw);
            const offlineInquiries2024Data = extractNumericValues(offlineInquiries2024Raw);
            const offlineInquiriesTargetData = extractNumericValues(offlineInquiriesTargetRaw);

            if (offlineInquiries2025Data.length) {
                offlineInquiriesLeadChartData.datasets[0].data = offlineInquiries2025Data;
            }
            if (offlineInquiries2024Data.length) {
                offlineInquiriesLeadChartData.datasets[1].data = offlineInquiries2024Data;
            }
            if (offlineInquiriesTargetData.length && offlineInquiriesLeadChartData.datasets[2]) {
                offlineInquiriesLeadChartData.datasets[2].data = offlineInquiriesTargetData;
            }

            console.log('Updated offline inquiries datasets:', {
                current: offlineInquiriesLeadChartData.datasets[0].data,
                previous: offlineInquiriesLeadChartData.datasets[1].data,
                target: offlineInquiriesLeadChartData.datasets[2]?.data
            });

            offlineInquiriesLeadChart.update();
            updateOfflineInquiriesSummary();
        }

        async function initPulloutAversionLeadCharts() {
            if (!pulloutAversionLeadChart) {
                console.warn('Pullout aversion lead chart is not initialized yet.');
                return;
            }

            console.log('Starting initPulloutAversionLeadCharts...');

            const payload = await fetchDashboardData();
            const pulloutAversion2025Raw = payload?.pulloutAversion2025
                ?? payload?.pulloutAversionCurrent
                ?? payload?.pulloutAversion2025Series
                ?? [];
            const pulloutAversion2024Raw = payload?.pulloutAversion2024
                ?? payload?.pulloutAversionPrevious
                ?? payload?.pulloutAversion2024Series
                ?? [];
            const pulloutAversionTargetRaw = payload?.pulloutAversionTarget
                ?? payload?.pulloutAversionGoal
                ?? payload?.pulloutAversionTargetSeries
                ?? [];

            console.log('Pullout aversion raw data:', {
                '2025': pulloutAversion2025Raw,
                '2024': pulloutAversion2024Raw,
                'target': pulloutAversionTargetRaw
            });

            const pulloutAversion2025Data = extractNumericValues(pulloutAversion2025Raw);
            const pulloutAversion2024Data = extractNumericValues(pulloutAversion2024Raw);
            const pulloutAversionTargetData = extractNumericValues(pulloutAversionTargetRaw);

            console.log('Pullout aversion extracted data:', {
                '2025': pulloutAversion2025Data,
                '2024': pulloutAversion2024Data,
                'target': pulloutAversionTargetData
            });

            // Calculate target as percentage of 2024 data, but display it on the same scale as bars
            // If target is 23% of 2024, show it as 23% of the 2024 bar height visually
            const targetPercentageData = pulloutAversion2024Data.map((value2024, index) => {
                const targetValue = pulloutAversionTargetData[index];
                if (value2024 && value2024 !== 0 && targetValue !== null && targetValue !== undefined) {
                    // Calculate percentage: (target / 2024) * 100
                    const percentage = (targetValue / value2024) * 100;
                    // Convert back to visual value: value2024 * (percentage / 100)
                    // This makes the target line appear at the percentage height of the 2024 bar
                    return value2024 * (percentage / 100);
                }
                return null;
            });

            console.log('Pullout aversion target percentage data (visual scale):', targetPercentageData);

            if (pulloutAversion2025Data.length) {
                pulloutAversionLeadChartData.datasets[0].data = pulloutAversion2025Data;
            }
            if (pulloutAversion2024Data.length) {
                pulloutAversionLeadChartData.datasets[1].data = pulloutAversion2024Data;
            }
            if (targetPercentageData.length && pulloutAversionLeadChartData.datasets[2]) {
                pulloutAversionLeadChartData.datasets[2].data = targetPercentageData;
            }

            console.log('Updated pullout aversion datasets:', {
                current: pulloutAversionLeadChartData.datasets[0].data,
                previous: pulloutAversionLeadChartData.datasets[1].data,
                target: pulloutAversionLeadChartData.datasets[2]?.data
            });

            pulloutAversionLeadChart.update();
            updatePulloutAversionSummary();
        }

        // Helper function to update summary cards
        function updateSummaryCard(titleText, values) {
            const cards = document.querySelectorAll('.summary-card-compact');
            for (const card of cards) {
                const h3 = card.querySelector('h3');
                if (h3 && h3.textContent.trim().includes(titleText)) {
                    const statCards = card.querySelectorAll('.stat-card');
                    statCards.forEach((statCard, index) => {
                        const label = statCard.querySelector('.stat-label');
                        const valueEl = statCard.querySelector('.stat-value');
                        if (label && valueEl) {
                            const labelText = label.textContent.trim().toLowerCase();
                            if (labelText === 'variance' && values.variance) {
                                valueEl.textContent = values.variance;
                                // Update color based on positive/negative
                                const numValue = parseFloat(values.variance.replace(/[^\d.-]/g, ''));
                                valueEl.style.color = numValue >= 0 ? '#81f31d' : '#ff3146';
                            } else if (labelText === 'target' && values.target) {
                                valueEl.textContent = values.target;
                            } else if (labelText === 'actual' && values.actual) {
                                valueEl.textContent = values.actual;
                            }
                        }
                    });
                    break;
                }
            }
        }

        // Generic function to initialize charts with 2025/2024/Target pattern
        async function initGenericChart(config) {
            const { chart, chartData, payloadKeys, summaryCardTitle, chartName, updateSummary = true, updateFunction = null } = config;
            
            if (!chart) {
                console.warn(`${chartName} chart is not initialized yet.`);
                return;
            }

            console.log(`Starting ${chartName}...`);

            const payload = await fetchDashboardData();
            const data2025Raw = payload?.[payloadKeys.key2025] ?? [];
            const data2024Raw = payload?.[payloadKeys.key2024] ?? [];
            const dataTargetRaw = payload?.[payloadKeys.keyTarget] ?? [];

            const data2025 = extractNumericValues(data2025Raw);
            const data2024 = extractNumericValues(data2024Raw);
            const dataTarget = extractNumericValues(dataTargetRaw);

            if (data2025.length) {
                chartData.datasets[0].data = data2025;
            }
            if (data2024.length) {
                chartData.datasets[1].data = data2024;
            }
            if (dataTarget.length && chartData.datasets[2]) {
                chartData.datasets[2].data = dataTarget;
            }

            // Update summary card if provided
            if (updateSummary && summaryCardTitle) {
                const currentMonth = new Date().getMonth();
                const current2025 = data2025[currentMonth] || 0;
                const currentTarget = dataTarget[currentMonth] || 0;
                const variance = currentTarget !== 0 ? ((current2025 - currentTarget) / currentTarget) * 100 : 0;
                
                updateSummaryCard(summaryCardTitle, {
                    target: formatPercentage(currentTarget),
                    actual: formatPercentage(current2025),
                    variance: formatPercentage(variance)
                });
            }

            chart.update();
            
            // Call custom update function if provided
            if (updateFunction && typeof updateFunction === 'function') {
                updateFunction();
            }
        }

        // ============================================
        // GENERIC CHART INITIALIZATIONS (Using generic function)
        // ============================================
        
        const initFbFollowersCharts = () => initGenericChart({
            chart: fbFollowersChart,
            chartData: fbFollowersChartData,
            payloadKeys: { key2025: 'fbFollowers2025', key2024: 'fbFollowers2024', keyTarget: 'fbFollowersTarget' },
            summaryCardTitle: null,
            chartName: 'initFbFollowersCharts',
            updateSummary: false,
            updateFunction: updateFbFollowersSummary
        });

        const initIcareCharts = () => initGenericChart({
            chart: icareChart,
            chartData: icareChartData,
            payloadKeys: { key2025: 'icare2025', key2024: 'icare2024', keyTarget: 'icareTarget' },
            summaryCardTitle: null,
            chartName: 'initIcareCharts',
            updateSummary: false,
            updateFunction: updateIcareSummary
        });

        const initSiteQualityCharts = () => initGenericChart({
            chart: siteQualityChart,
            chartData: siteQualityChartData,
            payloadKeys: { key2025: 'siteQuality2025', key2024: 'siteQuality2024', keyTarget: 'siteQualityTarget' },
            summaryCardTitle: null,
            chartName: 'initSiteQualityCharts',
            updateSummary: false,
            updateFunction: updateSiteQualitySummary
        });

        const initInsuranceClaimCharts = () => initGenericChart({
            chart: insuranceClaimChart,
            chartData: insuranceClaimChartData,
            payloadKeys: { key2025: 'insuranceClaim2025', key2024: 'insuranceClaim2024', keyTarget: 'insuranceClaimTarget' },
            summaryCardTitle: null,
            chartName: 'initInsuranceClaimCharts',
            updateSummary: false,
            updateFunction: updateInsuranceClaimSummary
        });

        const initRegularEventsCharts = () => initGenericChart({
            chart: regularEventsChart,
            chartData: regularEventsChartData,
            payloadKeys: { key2025: 'regularEvents2025', key2024: 'regularEvents2024', keyTarget: 'regularEventsTarget' },
            summaryCardTitle: null,
            chartName: 'initRegularEventsCharts',
            updateSummary: false,
            updateFunction: updateRegularEventsSummary
        });

        const initCultureDevCharts = () => initGenericChart({
            chart: cultureDevChart,
            chartData: cultureDevChartData,
            payloadKeys: { key2025: 'cultureDev2025', key2024: 'cultureDev2024', keyTarget: 'cultureDevTarget' },
            summaryCardTitle: null,
            chartName: 'initCultureDevCharts',
            updateSummary: false,
            updateFunction: updateCultureDevSummary
        });

        const initSmdProjectsCharts = () => initGenericChart({
            chart: smdProjectsChart,
            chartData: smdProjectsChartData,
            payloadKeys: { key2025: 'smdProjects2025', key2024: 'smdProjects2024', keyTarget: 'smdProjectsTarget' },
            summaryCardTitle: null,
            chartName: 'initSmdProjectsCharts',
            updateSummary: false,
            updateFunction: updateSmdProjectsSummary
        });

        const initBudgetProjectsCharts = () => initGenericChart({
            chart: budgetProjectsChart,
            chartData: budgetProjectsChartData,
            payloadKeys: { key2025: 'budgetProjects2025', key2024: 'budgetProjects2024', keyTarget: 'budgetProjectsTarget' },
            summaryCardTitle: null,
            chartName: 'initBudgetProjectsCharts',
            updateSummary: false,
            updateFunction: updateBudgetProjectsSummary
        });

        const initTeamTargetsCharts = () => initGenericChart({
            chart: teamTargetsChart,
            chartData: teamTargetsChartData,
            payloadKeys: { key2025: 'teamTargets2025', key2024: 'teamTargets2024', keyTarget: 'teamTargetsTarget' },
            summaryCardTitle: null,
            chartName: 'initTeamTargetsCharts',
            updateSummary: false,
            updateFunction: updateTeamTargetsSummary
        });

        const initBreakdownsCharts = () => initGenericChart({
            chart: breakdownsChart,
            chartData: breakdownsChartData,
            payloadKeys: { key2025: 'breakdowns2025', key2024: 'breakdowns2024', keyTarget: 'breakdownsTarget' },
            summaryCardTitle: null,
            chartName: 'initBreakdownsCharts',
            updateSummary: false,
            updateFunction: updateBreakdownsSummary
        });

        // Initialize all LEAD charts
        document.addEventListener('DOMContentLoaded', async () => {
            const leadInitializationTasks = [];

            if (occupancyRateLeadChart) {
                showChartLoading('occupancyRateLeadChart');
                leadInitializationTasks.push(initOccupancyRateLeadCharts().then(() => {
                    hideChartLoading('occupancyRateLeadChart');
                }).catch(() => {
                    hideChartLoading('occupancyRateLeadChart');
                }));
            }
            if (occupancyRateAreaLeadChart) {
                showChartLoading('occupancyRateAreaLeadChart');
                leadInitializationTasks.push(initOccupancyRateAreaLeadCharts().then(() => {
                    hideChartLoading('occupancyRateAreaLeadChart');
                }).catch(() => {
                    hideChartLoading('occupancyRateAreaLeadChart');
                }));
            }
            if (occupancyRatePValueLeadChart) {
                showChartLoading('occupancyRatePValueLeadChart');
                leadInitializationTasks.push(initOccupancyRatePValueLeadCharts().then(() => {
                    hideChartLoading('occupancyRatePValueLeadChart');
                }).catch(() => {
                    hideChartLoading('occupancyRatePValueLeadChart');
                }));
            }
            if (lotusFootTrafficChart) {
                showChartLoading('lotusFootTrafficChart');
                leadInitializationTasks.push(initLotusFootTrafficCharts().then(() => {
                    hideChartLoading('lotusFootTrafficChart');
                }).catch(() => {
                    hideChartLoading('lotusFootTrafficChart');
                }));
            }
            if (portalFootTrafficChart) {
                showChartLoading('portalFootTrafficChart');
                leadInitializationTasks.push(initPortalFootTrafficCharts().then(() => {
                    hideChartLoading('portalFootTrafficChart');
                }).catch(() => {
                    hideChartLoading('portalFootTrafficChart');
                }));
            }
            if (stadiumFootTrafficChart) {
                showChartLoading('stadiumFootTrafficChart');
                leadInitializationTasks.push(initStadiumFootTrafficCharts().then(() => {
                    hideChartLoading('stadiumFootTrafficChart');
                }).catch(() => {
                    hideChartLoading('stadiumFootTrafficChart');
                }));
            }
            if (yspacioFootTrafficChart) {
                showChartLoading('yspacioFootTrafficChart');
                leadInitializationTasks.push(initYspacioFootTrafficCharts().then(() => {
                    hideChartLoading('yspacioFootTrafficChart');
                }).catch(() => {
                    hideChartLoading('yspacioFootTrafficChart');
                }));
            }
            if (yspacioAlapanFootTrafficChart) {
                showChartLoading('yspacioAlapanFootTrafficChart');
                leadInitializationTasks.push(initYspacioAlapanFootTrafficCharts().then(() => {
                    hideChartLoading('yspacioAlapanFootTrafficChart');
                }).catch(() => {
                    hideChartLoading('yspacioAlapanFootTrafficChart');
                }));
            }
            if (luminaFootTrafficChart) {
                showChartLoading('luminaFootTrafficChart');
                leadInitializationTasks.push(initLuminaFootTrafficCharts().then(() => {
                    hideChartLoading('luminaFootTrafficChart');
                }).catch(() => {
                    hideChartLoading('luminaFootTrafficChart');
                }));
            }
            if (lotusPaxChart) {
                showChartLoading('lotusPaxChart');
                leadInitializationTasks.push(initLotusPaxCharts().then(() => {
                    hideChartLoading('lotusPaxChart');
                }).catch(() => {
                    hideChartLoading('lotusPaxChart');
                }));
            }
            if (portalPaxChart) {
                showChartLoading('portalPaxChart');
                leadInitializationTasks.push(initPortalPaxCharts().then(() => {
                    hideChartLoading('portalPaxChart');
                }).catch(() => {
                    hideChartLoading('portalPaxChart');
                }));
            }
            if (stadiumPaxChart) {
                showChartLoading('stadiumPaxChart');
                leadInitializationTasks.push(initStadiumPaxCharts().then(() => {
                    hideChartLoading('stadiumPaxChart');
                }).catch(() => {
                    hideChartLoading('stadiumPaxChart');
                }));
            }
            if (closedInquiriesLeadChart) {
                showChartLoading('closedInquiriesLeadChart');
                leadInitializationTasks.push(initClosedInquiriesLeadCharts().then(() => {
                    hideChartLoading('closedInquiriesLeadChart');
                }).catch(() => {
                    hideChartLoading('closedInquiriesLeadChart');
                }));
            }
            if (offlineInquiriesLeadChart) {
                showChartLoading('offlineInquiriesLeadChart');
                leadInitializationTasks.push(initOfflineInquiriesLeadCharts().then(() => {
                    hideChartLoading('offlineInquiriesLeadChart');
                }).catch(() => {
                    hideChartLoading('offlineInquiriesLeadChart');
                }));
            }
            if (pulloutAversionLeadChart) {
                showChartLoading('pulloutAversionLeadChart');
                leadInitializationTasks.push(initPulloutAversionLeadCharts().then(() => {
                    hideChartLoading('pulloutAversionLeadChart');
                }).catch(() => {
                    hideChartLoading('pulloutAversionLeadChart');
                }));
            }
            if (fbFollowersChart) {
                showChartLoading('fbFollowersChart');
                leadInitializationTasks.push(initFbFollowersCharts().then(() => {
                    hideChartLoading('fbFollowersChart');
                }).catch(() => {
                    hideChartLoading('fbFollowersChart');
                }));
            }
            if (icareChart) {
                showChartLoading('icareChart');
                leadInitializationTasks.push(initIcareCharts().then(() => {
                    hideChartLoading('icareChart');
                }).catch(() => {
                    hideChartLoading('icareChart');
                }));
            }
            if (siteQualityChart) {
                showChartLoading('siteQualityChart');
                leadInitializationTasks.push(initSiteQualityCharts().then(() => {
                    hideChartLoading('siteQualityChart');
                }).catch(() => {
                    hideChartLoading('siteQualityChart');
                }));
            }
            if (insuranceClaimChart) {
                showChartLoading('insuranceClaimChart');
                leadInitializationTasks.push(initInsuranceClaimCharts().then(() => {
                    hideChartLoading('insuranceClaimChart');
                }).catch(() => {
                    hideChartLoading('insuranceClaimChart');
                }));
            }
            if (regularEventsChart) {
                showChartLoading('regularEventsChart');
                leadInitializationTasks.push(initRegularEventsCharts().then(() => {
                    hideChartLoading('regularEventsChart');
                }).catch(() => {
                    hideChartLoading('regularEventsChart');
                }));
            }
            if (cultureDevChart) {
                showChartLoading('cultureDevChart');
                leadInitializationTasks.push(initCultureDevCharts().then(() => {
                    hideChartLoading('cultureDevChart');
                }).catch(() => {
                    hideChartLoading('cultureDevChart');
                }));
            }
            if (smdProjectsChart) {
                showChartLoading('smdProjectsChart');
                leadInitializationTasks.push(initSmdProjectsCharts().then(() => {
                    hideChartLoading('smdProjectsChart');
                }).catch(() => {
                    hideChartLoading('smdProjectsChart');
                }));
            }
            if (budgetProjectsChart) {
                showChartLoading('budgetProjectsChart');
                leadInitializationTasks.push(initBudgetProjectsCharts().then(() => {
                    hideChartLoading('budgetProjectsChart');
                }).catch(() => {
                    hideChartLoading('budgetProjectsChart');
                }));
            }
            if (teamTargetsChart) {
                showChartLoading('teamTargetsChart');
                leadInitializationTasks.push(initTeamTargetsCharts().then(() => {
                    hideChartLoading('teamTargetsChart');
                }).catch(() => {
                    hideChartLoading('teamTargetsChart');
                }));
            }
            if (breakdownsChart) {
                showChartLoading('breakdownsChart');
                leadInitializationTasks.push(initBreakdownsCharts().then(() => {
                    hideChartLoading('breakdownsChart');
                }).catch(() => {
                    hideChartLoading('breakdownsChart');
                }));
            }

            try {
                await Promise.all(leadInitializationTasks);
                console.log('All LEAD charts initialized successfully');
            } catch (error) {
                console.error('Error initializing LEAD charts:', error);
            }
        });

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
                    // Use a slightly lighter red so negative values remain readable
                    // while still clearly indicating a negative outcome.
                    el.style.color = '#ff0800';
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

            const {
                targetRate,
                averageReceivables,
                averageCollected,
                actualRateOverride
            } = COLLECTION_SUMMARY_METRICS;

            if (!Number.isFinite(averageReceivables) || averageReceivables === 0 || !Number.isFinite(averageCollected)) {
                return;
            }

            const computedActualRate = Number.isFinite(actualRateOverride)
                ? actualRateOverride
                : (averageCollected / averageReceivables) * 100;
            const safeTargetRate = Number.isFinite(targetRate) ? targetRate : 0;
            const varianceRate = computedActualRate - safeTargetRate;

            targetEl.textContent = formatPercentage(safeTargetRate);
            actualEl.textContent = formatPercentage(computedActualRate);
            varianceEl.textContent = formatPercentage(varianceRate);

            colorVarianceAndYoYGrowthValues();
        }

        // Helper function to format currency values for display
        function formatCurrencyForDisplay(value) {
            if (!Number.isFinite(value)) {
                return '₱0.00';
            }
            // Value is already in actual currency (not millions), format directly
            return `₱${value.toLocaleString('en-PH', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }

        // Helper function to format thousands for display (for venue/studio/sports arena)
        function formatThousandsForDisplay(value) {
            if (!Number.isFinite(value)) {
                return '₱0.00';
            }
            // Convert thousands to actual value and format
            const actualValue = value * 1000;
            return `₱${actualValue.toLocaleString('en-PH', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }

        // Get current month index (0-11, November = 10)
        function getCurrentMonthIndex() {
            return new Date().getMonth();
        }

        // Update Net Profit Summary Card
        function updateNetProfitSummary() {
            const targetEl = document.querySelector('[data-metric="net-profit-target"]');
            const actualEl = document.querySelector('[data-metric="net-profit-actual"]');
            const varianceEl = document.querySelector('[data-metric="net-profit-variance"]');

            if (!targetEl || !actualEl || !varianceEl || !profitBarData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = profitBarData.datasets[0]?.data || [];
            const targetData = profitBarData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatCurrencyForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatCurrencyForDisplay(targetValue);
            }
            // Variance is handled by colorVarianceAndYoYGrowthValues function
            colorVarianceAndYoYGrowthValues();
        }

        // Update Rental Income Summary Card
        function updateRentalIncomeSummary() {
            const targetEl = document.querySelector('[data-metric="rental-income-target"]');
            const actualEl = document.querySelector('[data-metric="rental-income-actual"]');
            const varianceEl = document.querySelector('[data-metric="rental-income-variance"]');

            if (!targetEl || !actualEl || !varianceEl || !rentalComparisonData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = rentalComparisonData.datasets[0]?.data || [];
            const targetData = rentalComparisonData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatCurrencyForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatCurrencyForDisplay(targetValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Venue Summary Card
        function updateVenueSummary() {
            const targetEl = document.querySelector('[data-metric="venue-target"]');
            const actualEl = document.querySelector('[data-metric="venue-actual"]');
            const varianceEl = document.querySelector('[data-metric="venue-variance"]');

            if (!targetEl || !actualEl || !varianceEl || !venueChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = venueChartData.datasets[0]?.data || [];
            const targetData = venueChartData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatThousandsForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatThousandsForDisplay(targetValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Studio Summary Card
        function updateStudioSummary() {
            const targetEl = document.querySelector('[data-metric="studio-target"]');
            const actualEl = document.querySelector('[data-metric="studio-actual"]');
            const varianceEl = document.querySelector('[data-metric="studio-variance"]');

            if (!targetEl || !actualEl || !varianceEl || !studioChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = studioChartData.datasets[0]?.data || [];
            const targetData = studioChartData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatThousandsForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatThousandsForDisplay(targetValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Sports Arena Summary Card
        function updateSportsArenaSummary() {
            const targetEl = document.querySelector('[data-metric="sports-arena-target"]');
            const actualEl = document.querySelector('[data-metric="sports-arena-actual"]');
            const varianceEl = document.querySelector('[data-metric="sports-arena-variance"]');

            if (!targetEl || !actualEl || !varianceEl || !sportsArenaChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = sportsArenaChartData.datasets[0]?.data || [];
            const targetData = sportsArenaChartData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatThousandsForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatThousandsForDisplay(targetValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Parking Income Summary Card
        function updateParkingIncomeSummary() {
            const targetEl = document.querySelector('[data-metric="parking-income-target"]');
            const actualEl = document.querySelector('[data-metric="parking-income-actual"]');
            const varianceEl = document.querySelector('[data-metric="parking-income-variance"]');

            if (!targetEl || !actualEl || !varianceEl || !parkingIncomeChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = parkingIncomeChartData.datasets[0]?.data || [];
            const targetData = parkingIncomeChartData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatCurrencyForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatCurrencyForDisplay(targetValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Total Operating Expense Summary Card
        function updateTotalOperatingExpenseSummary() {
            const targetEl = document.querySelector('[data-metric="total-operating-expense-target"]');
            const actualEl = document.querySelector('[data-metric="total-operating-expense-actual"]');
            const varianceEl = document.querySelector('[data-metric="total-operating-expense-variance"]');

            if (!targetEl || !actualEl || !varianceEl || !totalOperatingExpenseChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = totalOperatingExpenseChartData.datasets[0]?.data || [];
            const targetData = totalOperatingExpenseChartData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatCurrencyForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatCurrencyForDisplay(targetValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Electricity Expense Summary Card
        function updateElectricityExpenseSummary() {
            const previousEl = document.querySelector('[data-metric="electricity-expense-previous"]');
            const actualEl = document.querySelector('[data-metric="electricity-expense-actual"]');
            const varianceEl = document.querySelector('[data-metric="electricity-expense-variance"]');

            if (!previousEl || !actualEl || !varianceEl || !electricityExpenseChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = electricityExpenseChartData.datasets[0]?.data || [];
            const previousData = electricityExpenseChartData.datasets[1]?.data || [];

            const actualValue = currentData[monthIndex];
            const previousValue = previousData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatCurrencyForDisplay(actualValue);
            }
            if (Number.isFinite(previousValue)) {
                previousEl.textContent = formatCurrencyForDisplay(previousValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Water Expense Summary Card
        function updateWaterExpenseSummary() {
            const previousEl = document.querySelector('[data-metric="water-expense-previous"]');
            const actualEl = document.querySelector('[data-metric="water-expense-actual"]');
            const varianceEl = document.querySelector('[data-metric="water-expense-variance"]');

            if (!previousEl || !actualEl || !varianceEl || !waterExpenseChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = waterExpenseChartData.datasets[0]?.data || [];
            const previousData = waterExpenseChartData.datasets[1]?.data || [];

            const actualValue = currentData[monthIndex];
            const previousValue = previousData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatCurrencyForDisplay(actualValue);
            }
            if (Number.isFinite(previousValue)) {
                previousEl.textContent = formatCurrencyForDisplay(previousValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Security Expense Summary Card
        function updateSecurityExpenseSummary() {
            const previousEl = document.querySelector('[data-metric="security-expense-previous"]');
            const actualEl = document.querySelector('[data-metric="security-expense-actual"]');
            const varianceEl = document.querySelector('[data-metric="security-expense-variance"]');

            if (!previousEl || !actualEl || !varianceEl || !securityExpenseChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = securityExpenseChartData.datasets[0]?.data || [];
            const previousData = securityExpenseChartData.datasets[1]?.data || [];

            const actualValue = currentData[monthIndex];
            const previousValue = previousData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatCurrencyForDisplay(actualValue);
            }
            if (Number.isFinite(previousValue)) {
                previousEl.textContent = formatCurrencyForDisplay(previousValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Agency Expense Summary Card
        function updateAgencyExpenseSummary() {
            const previousEl = document.querySelector('[data-metric="agency-expense-previous"]');
            const actualEl = document.querySelector('[data-metric="agency-expense-actual"]');
            const varianceEl = document.querySelector('[data-metric="agency-expense-variance"]');

            if (!previousEl || !actualEl || !varianceEl || !agencyExpenseChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = agencyExpenseChartData.datasets[0]?.data || [];
            const previousData = agencyExpenseChartData.datasets[1]?.data || [];

            const actualValue = currentData[monthIndex];
            const previousValue = previousData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatCurrencyForDisplay(actualValue);
            }
            if (Number.isFinite(previousValue)) {
                previousEl.textContent = formatCurrencyForDisplay(previousValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Salary Expense Summary Card
        function updateSalaryExpenseSummary() {
            const previousEl = document.querySelector('[data-metric="salary-expense-previous"]');
            const actualEl = document.querySelector('[data-metric="salary-expense-actual"]');
            const varianceEl = document.querySelector('[data-metric="salary-expense-variance"]');

            if (!previousEl || !actualEl || !varianceEl || !salaryExpenseChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = salaryExpenseChartData.datasets[0]?.data || [];
            const previousData = salaryExpenseChartData.datasets[1]?.data || [];

            const actualValue = currentData[monthIndex];
            const previousValue = previousData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatCurrencyForDisplay(actualValue);
            }
            if (Number.isFinite(previousValue)) {
                previousEl.textContent = formatCurrencyForDisplay(previousValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Marketing Expense (Marcom) Summary Card
        function updateMarketingExpenseSummary() {
            const previousEl = document.querySelector('[data-metric="marketing-expense-previous"]');
            const actualEl = document.querySelector('[data-metric="marketing-expense-actual"]');
            const varianceEl = document.querySelector('[data-metric="marketing-expense-variance"]');

            if (!previousEl || !actualEl || !varianceEl || !marketingExpenseChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = marketingExpenseChartData.datasets[0]?.data || [];
            const previousData = marketingExpenseChartData.datasets[1]?.data || [];

            const actualValue = currentData[monthIndex];
            const previousValue = previousData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatCurrencyForDisplay(actualValue);
            }
            if (Number.isFinite(previousValue)) {
                previousEl.textContent = formatCurrencyForDisplay(previousValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Marketing Expense (Gathering) Summary Card
        function updateMarketingExpenseGatheringSummary() {
            const previousEl = document.querySelector('[data-metric="marketing-expense-gathering-previous"]');
            const actualEl = document.querySelector('[data-metric="marketing-expense-gathering-actual"]');
            const varianceEl = document.querySelector('[data-metric="marketing-expense-gathering-variance"]');

            if (!previousEl || !actualEl || !varianceEl || !marketingExpenseGatheringChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = marketingExpenseGatheringChartData.datasets[0]?.data || [];
            const previousData = marketingExpenseGatheringChartData.datasets[1]?.data || [];

            const actualValue = currentData[monthIndex];
            const previousValue = previousData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatCurrencyForDisplay(actualValue);
            }
            if (Number.isFinite(previousValue)) {
                previousEl.textContent = formatCurrencyForDisplay(previousValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Repairs & Maintenance (Labor) Summary Card
        function updateRepairsMaintenanceLaborSummary() {
            const targetEl = document.querySelector('[data-metric="repairs-maintenance-labor-target"]');
            const actualEl = document.querySelector('[data-metric="repairs-maintenance-labor-actual"]');
            const varianceEl = document.querySelector('[data-metric="repairs-maintenance-labor-variance"]');

            if (!targetEl || !actualEl || !varianceEl || !repairsMaintenanceLaborChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = repairsMaintenanceLaborChartData.datasets[0]?.data || [];
            const targetData = repairsMaintenanceLaborChartData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatCurrencyForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatCurrencyForDisplay(targetValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Repairs & Maintenance (Materials) Summary Card
        function updateRepairsMaintenanceMaterialsSummary() {
            const targetEl = document.querySelector('[data-metric="repairs-maintenance-materials-target"]');
            const actualEl = document.querySelector('[data-metric="repairs-maintenance-materials-actual"]');
            const varianceEl = document.querySelector('[data-metric="repairs-maintenance-materials-variance"]');

            if (!targetEl || !actualEl || !varianceEl || !repairsMaintenanceMaterialsChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = repairsMaintenanceMaterialsChartData.datasets[0]?.data || [];
            const targetData = repairsMaintenanceMaterialsChartData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatCurrencyForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatCurrencyForDisplay(targetValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Repairs & Maintenance (Labor) Technical Summary Card
        function updateRepairsMaintenanceLaborTechnicalSummary() {
            const targetEl = document.querySelector('[data-metric="repairs-maintenance-labor-technical-target"]');
            const actualEl = document.querySelector('[data-metric="repairs-maintenance-labor-technical-actual"]');
            const varianceEl = document.querySelector('[data-metric="repairs-maintenance-labor-technical-variance"]');

            if (!targetEl || !actualEl || !varianceEl || !repairsMaintenanceLaborTechnicalChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = repairsMaintenanceLaborTechnicalChartData.datasets[0]?.data || [];
            const targetData = repairsMaintenanceLaborTechnicalChartData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatCurrencyForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatCurrencyForDisplay(targetValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Repairs & Maintenance (Materials) Technical Summary Card
        function updateRepairsMaintenanceMaterialsTechnicalSummary() {
            const targetEl = document.querySelector('[data-metric="repairs-maintenance-materials-technical-target"]');
            const actualEl = document.querySelector('[data-metric="repairs-maintenance-materials-technical-actual"]');
            const varianceEl = document.querySelector('[data-metric="repairs-maintenance-materials-technical-variance"]');

            if (!targetEl || !actualEl || !varianceEl || !repairsMaintenanceMaterialsTechnicalChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = repairsMaintenanceMaterialsTechnicalChartData.datasets[0]?.data || [];
            const targetData = repairsMaintenanceMaterialsTechnicalChartData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatCurrencyForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatCurrencyForDisplay(targetValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // ============================================
        // LEAD SECTION UPDATE FUNCTIONS
        // ============================================

        // Helper function to format units for display (for foot traffic, pax, etc.)
        function formatUnitsForDisplay(value) {
            if (!Number.isFinite(value)) {
                return '0';
            }
            return value.toLocaleString('en-PH', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
        }

        // Helper function to format percentage for display
        function formatPercentageForDisplay(value) {
            if (!Number.isFinite(value)) {
                return '0%';
            }
            return `${value.toFixed(1)}%`;
        }

        // Update Occupancy Rate (Unit) Summary Card
        function updateOccupancyRateUnitSummary() {
            const targetEl = document.querySelector('[data-metric="occupancy-rate-unit-target"]');
            const actualEl = document.querySelector('[data-metric="occupancy-rate-unit-actual"]');
            const varianceEl = document.querySelector('[data-metric="occupancy-rate-unit-variance"]');

            if (!targetEl || !actualEl || !varianceEl || !occupancyRateLeadChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = occupancyRateLeadChartData.datasets[0]?.data || [];
            const targetData = occupancyRateLeadChartData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatUnitsForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatUnitsForDisplay(targetValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Occupancy Rate (Area) Summary Card
        function updateOccupancyRateAreaSummary() {
            const targetEl = document.querySelector('[data-metric="occupancy-rate-area-target"]');
            const actualEl = document.querySelector('[data-metric="occupancy-rate-area-actual"]');
            const varianceEl = document.querySelector('[data-metric="occupancy-rate-area-variance"]');

            if (!targetEl || !actualEl || !varianceEl || !occupancyRateAreaLeadChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = occupancyRateAreaLeadChartData.datasets[0]?.data || [];
            const targetData = occupancyRateAreaLeadChartData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatUnitsForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatUnitsForDisplay(targetValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Occupancy Rate (P-Value) Summary Card
        function updateOccupancyRatePValueSummary() {
            const targetEl = document.querySelector('[data-metric="occupancy-rate-pvalue-target"]');
            const actualEl = document.querySelector('[data-metric="occupancy-rate-pvalue-actual"]');
            const varianceEl = document.querySelector('[data-metric="occupancy-rate-pvalue-variance"]');

            if (!targetEl || !actualEl || !varianceEl || !occupancyRatePValueLeadChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = occupancyRatePValueLeadChartData.datasets[0]?.data || [];
            const targetData = occupancyRatePValueLeadChartData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatCurrencyForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatCurrencyForDisplay(targetValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Closed Inquiries Summary Card
        function updateClosedInquiriesSummary() {
            const targetEl = document.querySelector('[data-metric="closed-inquiries-target"]');
            const actualEl = document.querySelector('[data-metric="closed-inquiries-actual"]');
            const varianceEl = document.querySelector('[data-metric="closed-inquiries-variance"]');

            if (!targetEl || !actualEl || !varianceEl || !closedInquiriesLeadChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = closedInquiriesLeadChartData.datasets[0]?.data || [];
            const targetData = closedInquiriesLeadChartData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatThousandsForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatThousandsForDisplay(targetValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Pullout Aversion Summary Card
        function updatePulloutAversionSummary() {
            const targetEl = document.querySelector('[data-metric="pullout-aversion-target"]');
            const actualEl = document.querySelector('[data-metric="pullout-aversion-actual"]');
            const varianceEl = document.querySelector('[data-metric="pullout-aversion-variance"]');

            if (!targetEl || !actualEl || !varianceEl || !pulloutAversionLeadChartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = pulloutAversionLeadChartData.datasets[0]?.data || [];
            const targetData = pulloutAversionLeadChartData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatThousandsForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatThousandsForDisplay(targetValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Generic update function for foot traffic charts
        function updateFootTrafficSummary(metricPrefix, chartData) {
            const targetEl = document.querySelector(`[data-metric="${metricPrefix}-target"]`);
            const actualEl = document.querySelector(`[data-metric="${metricPrefix}-actual"]`);
            const varianceEl = document.querySelector(`[data-metric="${metricPrefix}-variance"]`);

            if (!targetEl || !actualEl || !varianceEl || !chartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = chartData.datasets[0]?.data || [];
            const targetData = chartData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatUnitsForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatUnitsForDisplay(targetValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Generic update function for percentage-based charts
        function updatePercentageSummary(metricPrefix, chartData) {
            const targetEl = document.querySelector(`[data-metric="${metricPrefix}-target"]`);
            const actualEl = document.querySelector(`[data-metric="${metricPrefix}-actual"]`);
            const varianceEl = document.querySelector(`[data-metric="${metricPrefix}-variance"]`);

            if (!targetEl || !actualEl || !varianceEl || !chartData) {
                return;
            }

            const monthIndex = getCurrentMonthIndex();
            const currentData = chartData.datasets[0]?.data || [];
            const targetData = chartData.datasets[2]?.data || [];

            const actualValue = currentData[monthIndex];
            const targetValue = targetData[monthIndex];

            if (Number.isFinite(actualValue)) {
                actualEl.textContent = formatPercentageForDisplay(actualValue);
            }
            if (Number.isFinite(targetValue)) {
                targetEl.textContent = formatPercentageForDisplay(targetValue);
            }
            colorVarianceAndYoYGrowthValues();
        }

        // Update Lotus Foot Traffic Summary Card
        function updateLotusFootTrafficSummary() {
            updateFootTrafficSummary('lotus-foot-traffic', lotusFootTrafficChartData);
        }

        // Update Portal Foot Traffic Summary Card
        function updatePortalFootTrafficSummary() {
            updateFootTrafficSummary('portal-foot-traffic', portalFootTrafficChartData);
        }

        // Update Stadium Foot Traffic Summary Card
        function updateStadiumFootTrafficSummary() {
            updateFootTrafficSummary('stadium-foot-traffic', stadiumFootTrafficChartData);
        }

        // Update ySpacio Foot Traffic Summary Card
        function updateYspacioFootTrafficSummary() {
            updateFootTrafficSummary('yspacio-foot-traffic', yspacioFootTrafficChartData);
        }

        // Update ySpacio Alapan Foot Traffic Summary Card
        function updateYspacioAlapanFootTrafficSummary() {
            updateFootTrafficSummary('yspacio-alapan-foot-traffic', yspacioAlapanFootTrafficChartData);
        }

        // Update Lumina Foot Traffic Summary Card
        function updateLuminaFootTrafficSummary() {
            updateFootTrafficSummary('lumina-foot-traffic', luminaFootTrafficChartData);
        }

        // Update Lotus Pax Summary Card
        function updateLotusPaxSummary() {
            updateFootTrafficSummary('lotus-pax', lotusPaxChartData);
        }

        // Update Portal Pax Summary Card
        function updatePortalPaxSummary() {
            updateFootTrafficSummary('portal-pax', portalPaxChartData);
        }

        // Update Stadium Pax Summary Card
        function updateStadiumPaxSummary() {
            updateFootTrafficSummary('stadium-pax', stadiumPaxChartData);
        }

        // Update Offline Inquiries Summary Card
        function updateOfflineInquiriesSummary() {
            updatePercentageSummary('offline-inquiries', offlineInquiriesLeadChartData);
        }

        // Update FB Followers Summary Card
        function updateFbFollowersSummary() {
            updatePercentageSummary('fb-followers', fbFollowersChartData);
        }

        // Update I.C.A.R.E Summary Card
        function updateIcareSummary() {
            updatePercentageSummary('icare', icareChartData);
        }

        // Update Site Quality Summary Card
        function updateSiteQualitySummary() {
            updatePercentageSummary('site-quality', siteQualityChartData);
        }

        // Update Insurance Claim Summary Card
        function updateInsuranceClaimSummary() {
            updatePercentageSummary('insurance-claim', insuranceClaimChartData);
        }

        // Update Regular Events Summary Card
        function updateRegularEventsSummary() {
            updatePercentageSummary('regular-events', regularEventsChartData);
        }

        // Update Culture Dev Summary Card
        function updateCultureDevSummary() {
            updatePercentageSummary('culture-dev', cultureDevChartData);
        }

        // Update SMD Projects Summary Card
        function updateSmdProjectsSummary() {
            updatePercentageSummary('smd-projects', smdProjectsChartData);
        }

        // Update Budget Projects Summary Card
        function updateBudgetProjectsSummary() {
            updatePercentageSummary('budget-projects', budgetProjectsChartData);
        }

        // Update Team Targets Summary Card
        function updateTeamTargetsSummary() {
            updatePercentageSummary('team-targets', teamTargetsChartData);
        }

        // Update Breakdowns Summary Card
        function updateBreakdownsSummary() {
            updatePercentageSummary('breakdowns', breakdownsChartData);
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

        if (carousel) {
            // Reset transform to show all cards
            carousel.style.transform = 'translateX(0)';

            // Function to sync team breakdown bars in tl-scoring.html with carousel values
            function syncTeamBreakdownBars() {
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

                // Store team percentages in localStorage for cross-page sync
                const teamPercentages = {};

                // Get all carousel stat cards
                const carouselCards = document.querySelectorAll('.stat-card-carousel[data-team]');
                
                // Get team breakdown container (from tl-scoring.html)
                const teamBreakdown = document.querySelector('.team-breakdown');
                
                carouselCards.forEach(card => {
                    const teamData = card.getAttribute('data-team');
                    const statValueElement = card.querySelector('.stat-value-carousel');
                    
                    if (statValueElement && teamData) {
                        const percentageText = statValueElement.textContent.trim();
                        const percentage = parseFloat(percentageText.replace('%', ''));
                        const teamName = teamNameMap[teamData];
                        
                        if (teamName && !isNaN(percentage)) {
                            // Store in localStorage
                            teamPercentages[teamName] = percentage;
                            
                            // Update team breakdown if it exists on this page
                            if (teamBreakdown) {
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
                            }
                        }
                    }
                });
                
                // Save to localStorage for cross-page sync
                if (Object.keys(teamPercentages).length > 0) {
                    try {
                        localStorage.setItem('teamCarouselPercentages', JSON.stringify(teamPercentages));
                    } catch (e) {
                        console.warn('Could not save to localStorage:', e);
                    }
                }
            }

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
                syncTeamBreakdownBars(); // Sync team breakdown bars with carousel values
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeCarousel);
            } else {
                initializeCarousel();
            }
            
            // Make syncTeamBreakdownBars available globally for other scripts
            window.syncTeamBreakdownBars = syncTeamBreakdownBars;
            
            // Dispatch custom event when carousel is initialized so other pages can sync
            window.dispatchEvent(new CustomEvent('carouselValuesUpdated'));
            
            // Also listen for any updates to carousel values and trigger sync
            const carouselObserver = new MutationObserver(() => {
                syncTeamBreakdownBars();
                window.dispatchEvent(new CustomEvent('carouselValuesUpdated'));
            });
            
            const statsCarousel = document.getElementById('statsCarousel');
            if (statsCarousel) {
                carouselObserver.observe(statsCarousel, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            }
        }


