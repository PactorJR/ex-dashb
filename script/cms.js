/**
 * Google Sheets CMS System - ONLY A1:E1 as Headers
 * Strictly parses only the first ROW as headers (A1, B1, C1, D1, E1)
 */

class GoogleSheetsCMS {
    constructor(sheetId, sheetName = 'Sheet1') {
        this.sheetId = sheetId;
        this.sheetName = sheetName;
        this.csvUrl = `https://docs.google.com/spreadsheets/d/${this.sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(this.sheetName)}`;
        this.data = null;
        
        console.log('📊 CMS Configuration:', {
            sheetId: this.sheetId,
            sheetName: this.sheetName,
            csvUrl: this.csvUrl
        });
    }

    async fetchData() {
        console.log('🔄 Fetching data from Google Sheets...');
        try {
            const response = await fetch(this.csvUrl);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            let csvText = await response.text();
            console.log('✅ CSV fetched:', csvText.length, 'characters');
            
            // Pre-process CSV to fix common issues with special characters
            csvText = this.preprocessCSV(csvText);
            
            this.data = this.parseCSV(csvText);
            return this.data;
        } catch (error) {
            console.error('❌ Fetch Error:', error.message);
            console.error('\n🔧 Troubleshooting:');
            console.error('1. Sheet must be shared: "Anyone with the link can view"');
            console.error('2. Tab name must match exactly:', this.sheetName);
            console.error('3. Sheet ID must be correct');
            return null;
        }
    }
    
    /**
     * Pre-process CSV to fix common formatting issues
     */
    preprocessCSV(csvText) {
        // If we detect lines that are missing commas (merged columns),
        // this might indicate that Google Sheets didn't quote special characters properly
        
        const lines = csvText.split(/\r?\n/);
        const fixedLines = lines.map((line, idx) => {
            if (idx === 0) return line; // Don't touch header line
            
            // Count commas outside of quotes
            let commaCount = 0;
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
                if (line[i] === '"') inQuotes = !inQuotes;
                if (line[i] === ',' && !inQuotes) commaCount++;
            }
            
            // Expected: 4 commas for 5 columns
            // If we have fewer, the CSV export is malformed
            if (commaCount < 4 && line.trim().length > 0) {
                console.warn(`⚠️  Line ${idx + 1} may be malformed (only ${commaCount} commas, expected 4)`);
                console.warn(`   Raw line: ${line.substring(0, 100)}...`);
            }
            
            return line;
        });
        
        return fixedLines.join('\n');
    }

    /**
     * Parse CSV - ONLY first line is headers (A1:E1)
     */
    parseCSV(csvText) {
        console.log('\n' + '='.repeat(60));
        console.log('CSV PARSING - STRICT MODE (A1:E1 ONLY)');
        console.log('='.repeat(60));
        
        // Show raw CSV
        console.log('\n📄 Raw CSV (first 800 chars):');
        console.log(csvText.substring(0, 800));
        console.log('\n');
        
        // Split by newlines
        const allLines = csvText.split(/\r?\n/);
        console.log(`📊 Total lines in CSV: ${allLines.length}`);
        
        // Remove empty lines
        const lines = allLines.filter(line => line.trim().length > 0);
        console.log(`📊 Non-empty lines: ${lines.length}`);
        
        if (lines.length < 2) {
            console.error('❌ Need at least 2 lines: 1 header + 1 data row');
            return [];
        }

        // ==================================================
        // HEADER ROW - ONLY LINE 1 (cells A1, B1, C1, D1, E1)
        // ==================================================
        console.log('\n' + '─'.repeat(60));
        console.log('STEP 1: Parse Header Row (Line 1 = A1:E1)');
        console.log('─'.repeat(60));
        
        const firstLine = lines[0];
        console.log('Raw Line 1:', firstLine);
        
        const headers = this.parseCSVLine(firstLine);
        console.log('\n📋 Headers parsed from Line 1:');
        console.log('   Column count:', headers.length);
        
        // Display each header with its cell location
        headers.forEach((header, i) => {
            const cellRef = String.fromCharCode(65 + i) + '1'; // A1, B1, C1...
            console.log(`   ${cellRef}: "${header}"`);
        });

        // CRITICAL CHECK: Do headers contain multiple values?
        const suspiciousHeaders = headers.filter(h => {
            const lower = h.toLowerCase().trim();
            // Check if header contains repeated words or multiple items
            const words = lower.split(/\s+/);
            const uniqueWords = new Set(words);
            return words.length > 3 || words.length !== uniqueWords.size;
        });
        
        if (suspiciousHeaders.length > 0) {
            console.error('\n🚨 CRITICAL ERROR DETECTED! 🚨');
            console.error('Your headers contain multiple values in single cells!');
            console.error('Suspicious headers:', suspiciousHeaders);
            console.error('\n❌ YOUR GOOGLE SHEET IS STRUCTURED INCORRECTLY!');
            console.error('\n📝 Current structure (WRONG):');
            console.error('   A1: "Type image image text text"  ← Multiple values in ONE cell!');
            console.error('   B1: "Selector .hero .logo .title" ← Multiple values in ONE cell!');
            console.error('\n✅ Correct structure should be:');
            console.error('   A1: Type     ← Single word');
            console.error('   B1: Selector ← Single word');
            console.error('   C1: Attribute');
            console.error('   D1: Value');
            console.error('   E1: Alt');
            console.error('\n🔧 HOW TO FIX:');
            console.error('1. Open your Google Sheet');
            console.error('2. Delete ALL content');
            console.error('3. In Row 1, put ONE word per cell:');
            console.error('   - A1: Type');
            console.error('   - B1: Selector');
            console.error('   - C1: Attribute');
            console.error('   - D1: Value');
            console.error('   - E1: Alt');
            console.error('4. Starting from Row 2, add your data (one item per row)');
            console.error('5. Save and refresh this page');
            return [];
        }

        // Check if we have expected number of columns
        if (headers.length !== 5) {
            console.warn(`\n⚠️  Expected 5 columns, got ${headers.length}`);
            if (headers.length < 5) {
                console.warn('Missing columns - sheet may be incomplete');
            }
        }

        // Normalize headers
        const normalizedHeaders = headers.map(h => {
            const norm = h.trim().toLowerCase();
            if (norm.includes('type')) return 'type';
            if (norm.includes('selector')) return 'selector';
            if (norm.includes('attribute')) return 'attribute';
            if (norm.includes('value')) return 'value';
            if (norm.includes('alt')) return 'alt';
            return norm;
        });
        
        console.log('\n🔄 Normalized headers:', normalizedHeaders);

        // ==================================================
        // DATA ROWS - Lines 2 onwards
        // ==================================================
        console.log('\n' + '─'.repeat(60));
        console.log('STEP 2: Parse Data Rows (Lines 2+)');
        console.log('─'.repeat(60));
        
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const lineNum = i + 1;
            const rawLine = lines[i];
            
            console.log(`\n📍 Line ${lineNum}:`);
            console.log(`   Raw: ${rawLine.substring(0, 120)}${rawLine.length > 120 ? '...' : ''}`);
            
            const values = this.parseCSVLine(rawLine);
            console.log(`   Columns found: ${values.length}`);
            
            // Check if we have the expected number of columns
            if (values.length !== normalizedHeaders.length) {
                console.warn(`   ⚠️  Column mismatch! Expected ${normalizedHeaders.length}, got ${values.length}`);
                console.warn(`   This usually means special characters (%, →, ≥) aren't quoted properly`);
                console.warn(`   Raw line: ${rawLine.substring(0, 150)}`);
            }
            
            // Show each column value for debugging special characters
            if (values.some(v => v.includes('%') || v.includes('→') || v.includes('≥'))) {
                console.log('   🔍 Special characters detected - column breakdown:');
                values.forEach((v, idx) => {
                    const header = normalizedHeaders[idx] || `unknown-${idx}`;
                    console.log(`      ${header}: "${v.substring(0, 60)}${v.length > 60 ? '...' : ''}"`);
                });
            }
            
            // Skip empty rows
            if (values.every(v => !v || !v.trim())) {
                console.log('   ⏭️  Skipped (empty)');
                continue;
            }

            // Map values to headers
            const row = {};
            normalizedHeaders.forEach((header, idx) => {
                row[header] = values[idx] ? values[idx].trim() : '';
            });
            
            // Log what we got
            console.log('   Parsed:', {
                type: row.type || '(missing)',
                selector: row.selector ? row.selector.substring(0, 30) + '...' : '(missing)',
                hasValue: !!row.value
            });
            
            // Validate required fields
            if (!row.type || !row.selector) {
                console.log('   ❌ Skipped (missing type or selector)');
                continue;
            }
            
            // Skip duplicate header rows
            if (row.type.toLowerCase().includes('type') && row.selector.toLowerCase().includes('selector')) {
                console.log('   ⚠️  Skipped (duplicate header)');
                continue;
            }
            
            data.push(row);
            console.log('   ✅ Added to data');
        }

        console.log('\n' + '='.repeat(60));
        console.log(`✅ PARSING COMPLETE: ${data.length} items loaded`);
        console.log('='.repeat(60) + '\n');
        
        return data;
    }

    /**
     * Parse a single CSV line (handles quotes, commas, and special characters)
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    // Escaped quote - add it and skip next
                    current += '"';
                    i++;
                } else {
                    // Toggle quote mode
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // Comma outside quotes = new column
                // Clean up the value before adding
                result.push(this.cleanCellValue(current));
                current = '';
            } else {
                current += char;
            }
        }
        
        // Don't forget the last column
        result.push(this.cleanCellValue(current));
        
        // Ensure we always return at least 5 columns (pad with empty strings)
        while (result.length < 5) {
            result.push('');
        }
        
        return result;
    }
    
    /**
     * Clean individual cell value - handle special characters and encoding
     */
    cleanCellValue(value) {
        if (!value) return '';
        
        // Remove surrounding quotes if present
        let cleaned = value.trim();
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
            cleaned = cleaned.slice(1, -1);
        }
        
        // Handle escaped quotes
        cleaned = cleaned.replace(/""/g, '"');
        
        // Preserve special characters like %, ≥, →, etc.
        // They should pass through as-is
        
        return cleaned.trim();
    }

    /**
     * Update page content
     */
    updateContent() {
        if (!this.data || this.data.length === 0) {
            console.error('\n❌ No data to update on page\n');
            return;
        }
        
        console.log('\n' + '='.repeat(60));
        console.log(`UPDATING PAGE: ${this.data.length} elements`);
        console.log('='.repeat(60) + '\n');
        
        let success = 0;
        let failed = 0;

        this.data.forEach((item, idx) => {
            const { type, selector, attribute, value, alt } = item;
            const num = idx + 1;

            try {
                const trimmedSelector = selector ? selector.trim() : '';
                if (!trimmedSelector) {
                    console.warn(`${num}. ⚠️  Missing selector – skipped row`, item);
                    failed++;
                    return;
                }

                // Try data-cms-selector attribute first
                let el = document.querySelector(`[data-cms-selector="${trimmedSelector}"]`);
                if (!el) el = document.querySelector(trimmedSelector);
                
                if (!el) {
                    console.warn(`${num}. ❌ Not found: ${trimmedSelector}`);
                    failed++;
                    return;
                }

                let normalizedType = type ? type.trim().toLowerCase() : '';
                if (!normalizedType && el.dataset?.cmsType) {
                    normalizedType = el.dataset.cmsType.trim().toLowerCase();
                    console.warn(`${num}. ℹ️  Missing type in sheet for ${trimmedSelector}; using data-cms-type="${normalizedType}"`);
                }
                if (!normalizedType) {
                    normalizedType = 'text';
                    console.warn(`${num}. ℹ️  Missing type for ${trimmedSelector}; defaulting to "text"`);
                }

                switch (normalizedType) {
                    case 'image':
                        el.setAttribute(attribute || 'src', value);
                        if (alt) el.setAttribute('alt', alt);
                        console.log(`${num}. ✅ Image: ${trimmedSelector}`);
                        break;
                    case 'text':
                        el.textContent = value;
                        console.log(`${num}. ✅ Text: ${trimmedSelector}`);
                        break;
                    case 'html':
                        el.innerHTML = value;
                        console.log(`${num}. ✅ HTML: ${trimmedSelector}`);
                        break;
                    case 'attribute':
                        el.setAttribute(attribute || 'data-value', value);
                        console.log(`${num}. ✅ Attr: ${trimmedSelector}`);
                        break;
                    case 'background':
                        el.style.backgroundImage = `url(${value})`;
                        console.log(`${num}. ✅ BG: ${trimmedSelector}`);
                        break;
                    default:
                        console.warn(`${num}. ⚠️  Unknown type "${normalizedType}" on ${trimmedSelector}`);
                        failed++;
                        return;
                }
                success++;
            } catch (err) {
                console.error(`${num}. ❌ Error on ${selector}:`, err.message);
                failed++;
            }
        });
        
        console.log('\n' + '='.repeat(60));
        console.log(`RESULTS: ✅ ${success} success | ❌ ${failed} failed`);
        console.log('='.repeat(60) + '\n');
    }

    /**
     * Initialize
     */
    async init() {
        console.log('\n' + '🚀 '.repeat(20));
        console.log('GOOGLE SHEETS CMS INITIALIZING');
        console.log('🚀 '.repeat(20) + '\n');
        
        await this.fetchData();
        
        if (this.data && this.data.length > 0) {
            this.updateContent();
            console.log('✅ CMS READY\n');
        } else {
            console.error('❌ CMS FAILED - No data loaded\n');
        }
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', async () => {
    const SHEET_ID = '1kSORDc05Bj2jheY9hImlM_5H74d0f6LLuBzDOXpDgs4';
    const SHEET_NAME = 'index_content'; // Must match tab name EXACTLY

    console.log('🌐 Page loaded');
    console.log('📊 Sheet:', SHEET_NAME);

    if (!SHEET_ID || SHEET_ID === 'YOUR_SHEET_ID_HERE') {
        console.error('❌ No SHEET_ID configured');
        return;
    }

    const cms = new GoogleSheetsCMS(SHEET_ID, SHEET_NAME);
    await cms.init();
});