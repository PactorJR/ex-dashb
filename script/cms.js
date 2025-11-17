/**
 * Google Sheets CMS System
 * Fetches content from Google Sheets and updates the website dynamically
 */

class GoogleSheetsCMS {
    constructor(sheetId, sheetName = 'Content Management') {
        // Google Sheets CSV export URL
        // Replace YOUR_SHEET_ID with your actual Google Sheet ID
        this.sheetId = "1kSORDc05Bj2jheY9hImlM_5H74d0f6LLuBzDOXpDgs4";
        this.sheetName = "Content Management";
        this.csvUrl = `https://docs.google.com/spreadsheets/d/${this.sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(this.sheetName)}`;
        this.data = null;
    }

    /**
     * Fetch data from Google Sheets
     */
    async fetchData() {
        try {
            const response = await fetch(this.csvUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            
            const csvText = await response.text();
            this.data = this.parseCSV(csvText);
            return this.data;
        } catch (error) {
            console.error('Error fetching CMS data:', error);
            // Fallback: try JSON format if CSV fails
            return this.fetchJSONData();
        }
    }

    /**
     * Alternative: Fetch as JSON (requires sheet to be published as JSON)
     */
    async fetchJSONData() {
        try {
            const jsonUrl = `https://docs.google.com/spreadsheets/d/${this.sheetId}/gviz/tq?tqx=out:json&sheet=${this.sheetName}`;
            const response = await fetch(jsonUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch JSON data: ${response.statusText}`);
            }
            
            const jsonText = await response.text();
            // Google Sheets JSON format has a prefix, remove it
            const jsonData = JSON.parse(jsonText.substring(47).slice(0, -2));
            
            // Convert to our format
            this.data = this.convertJSONToData(jsonData);
            return this.data;
        } catch (error) {
            console.error('Error fetching JSON data:', error);
            return null;
        }
    }

    /**
     * Normalize column header names (case-insensitive, handle variations)
     */
    normalizeHeader(header) {
        const normalized = header.trim().toLowerCase();
        // Handle variations like "Alt (optional)" -> "alt"
        if (normalized.includes('alt')) return 'alt';
        if (normalized.includes('type')) return 'type';
        if (normalized.includes('selector')) return 'selector';
        if (normalized.includes('attribute')) return 'attribute';
        if (normalized.includes('value')) return 'value';
        return normalized;
    }

    /**
     * Parse CSV text into array of objects
     */
    parseCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        
        console.log('Parsing CSV:', {
            totalLines: lines.length,
            firstLine: lines[0] ? lines[0].substring(0, 100) : 'empty',
            secondLine: lines[1] ? lines[1].substring(0, 100) : 'empty'
        });
        
        if (lines.length < 2) {
            console.warn('CSV has less than 2 lines. Make sure you have headers (Row 1) and at least one data row (Row 2+)');
            return [];
        }

        // Parse header and normalize column names
        const rawHeaders = this.parseCSVLine(lines[0]);
        console.log('Headers found:', rawHeaders);
        
        if (rawHeaders.length === 0) {
            console.warn('No headers found in CSV');
            return [];
        }
        
        const data = [];

        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length === 0) continue;

            const row = {};
            rawHeaders.forEach((header, index) => {
                const normalizedKey = this.normalizeHeader(header);
                row[normalizedKey] = values[index] ? values[index].trim() : '';
            });
            
            // Only add row if it has required fields
            if (row.type && row.selector && row.value) {
                data.push(row);
            } else {
                console.warn('Skipping invalid row (missing type, selector, or value):', row);
            }
        }

        console.log(`Parsed ${data.length} valid CMS items from ${lines.length - 1} data rows`);
        return data;
    }

    /**
     * Parse a CSV line handling quoted values
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    }

    /**
     * Convert Google Sheets JSON format to our data format
     */
    convertJSONToData(jsonData) {
        if (!jsonData.table || !jsonData.table.rows) return [];

        const rawHeaders = jsonData.table.cols.map(col => col.label);
        const data = [];

        jsonData.table.rows.forEach(row => {
            const rowData = {};
            row.c.forEach((cell, index) => {
                const normalizedKey = this.normalizeHeader(rawHeaders[index]);
                rowData[normalizedKey] = cell ? (cell.v || '') : '';
            });
            data.push(rowData);
        });

        return data;
    }

    /**
     * Update content on the page based on CMS data
     */
    updateContent() {
        if (!this.data || this.data.length === 0) {
            console.warn('No CMS data available');
            console.warn('Debug info:', {
                hasData: !!this.data,
                dataLength: this.data ? this.data.length : 0,
                csvUrl: this.csvUrl,
                sheetId: this.sheetId,
                sheetName: this.sheetName
            });
            console.warn('Possible issues:');
            console.warn('1. Sheet is empty (no data rows)');
            console.warn('2. Sheet name doesn\'t match (check tab name at bottom of sheet)');
            console.warn('3. Sheet not shared publicly');
            console.warn('4. Headers are missing or incorrect');
            return;
        }
        
        console.log(`Found ${this.data.length} CMS items to update`);

        this.data.forEach(item => {
            // Get values with case-insensitive fallback
            const type = item.type || item.Type || '';
            const selector = item.selector || item.Selector || '';
            const attribute = item.attribute || item.Attribute || '';
            const value = item.value || item.Value || '';
            const alt = item.alt || item.Alt || '';

            if (!type || !selector || !value) {
                console.warn('Invalid CMS item:', item);
                console.warn('Required fields: type, selector, value. Found:', { type, selector, value });
                return;
            }

            try {
                // Try to find element by data-cms-selector first, then fall back to direct selector
                let element = null;
                
                // First, try to find by matching data-cms-selector attribute
                const allCmsElements = document.querySelectorAll('[data-cms-selector]');
                for (const el of allCmsElements) {
                    const cmsSelector = el.getAttribute('data-cms-selector');
                    if (cmsSelector && cmsSelector.trim() === selector.trim()) {
                        element = el;
                        break;
                    }
                }
                
                // If not found by data-cms-selector, try direct CSS selector
                if (!element) {
                    element = document.querySelector(selector);
                }
                
                if (!element) {
                    console.warn(`Element not found: ${selector}`);
                    return;
                }

                switch (type.toLowerCase()) {
                    case 'image':
                        // Update image src
                        const attr = attribute || 'src';
                        element.setAttribute(attr, value);
                        // Also update alt if provided
                        if (alt) {
                            element.setAttribute('alt', alt);
                        }
                        break;

                    case 'text':
                        // Update text content
                        element.textContent = value;
                        break;

                    case 'html':
                        // Update inner HTML
                        element.innerHTML = value;
                        break;

                    case 'attribute':
                        // Update any attribute
                        const attrName = attribute || 'data-value';
                        element.setAttribute(attrName, value);
                        break;

                    case 'background':
                        // Update background image
                        element.style.backgroundImage = `url(${value})`;
                        break;

                    default:
                        console.warn(`Unknown content type: ${type}`);
                }
            } catch (error) {
                console.error(`Error updating element ${selector}:`, error);
            }
        });
    }

    /**
     * Initialize CMS - fetch data and update content
     */
    async init() {
        console.log('Initializing Google Sheets CMS...');
        await this.fetchData();
        this.updateContent();
        console.log('CMS initialization complete');
    }
}

// Initialize CMS when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    // ============================================
    // CONFIGURATION: Replace with your Sheet ID
    // ============================================
    // Get your Sheet ID from the Google Sheets URL:
    // https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
    const SHEET_ID = '1kSORDc05Bj2jheY9hImlM_5H74d0f6LLuBzDOXpDgs4';
    const SHEET_NAME = 'Content Management'; // Change if your sheet has a different name

    if (SHEET_ID === 'YOUR_SHEET_ID_HERE' || !SHEET_ID || SHEET_ID.trim() === '') {
        console.warn('⚠️ CMS not configured: Please set your Google Sheet ID in script/cms.js');
        return;
    }

    const cms = new GoogleSheetsCMS(SHEET_ID, SHEET_NAME);
    await cms.init();

    // Optional: Refresh content every 5 minutes
    // setInterval(async () => {
    //     await cms.fetchData();
    //     cms.updateContent();
    // }, 300000); // 5 minutes
});

