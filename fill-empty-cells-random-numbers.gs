/**
 * Google Apps Script - Fill Empty Cells with Random Numbers
 * Fills empty cells in Executive Summary sheets with context-appropriate random numbers
 */

// ============================================
// CONFIGURATION
// ============================================
const EXECUTIVE_SUMMARY_SHEET_NAME = 'EXECUTIVE SUMMARY DATA'; // Name of source sheet
const COMPANY_LEAD_SHEET_NAME = 'COMPANY LEAD'; // Name of destination sheet

// ============================================
// MENU SETUP
// ============================================
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Fill Random Numbers')
    .addItem('📊 Fill Empty Cells with Random Numbers', 'fillEmptyCellsWithRandomNumbers')
    .addSeparator()
    .addItem('🎯 Fill Company Lead TARGET & ACTUAL', 'fillCompanyLeadTargetActual')
    .addItem('🔗 Create Formulas for Company Lead', 'createCompanyLeadFormulas')
    .addSeparator()
    .addItem('ℹ️ Help', 'showFillHelp')
    .addToUi();
}

// ============================================
// FILL EMPTY CELLS WITH RANDOM NUMBERS
// ============================================
/**
 * Fills empty cells in the Executive Summary sheet with random numbers
 * based on the context of each row (percentages, currency, counts, etc.)
 */
function fillEmptyCellsWithRandomNumbers() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    
    if (!sheet) {
      SpreadsheetApp.getUi().alert('Error: No active sheet found');
      return;
    }
    
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    
    if (lastRow < 1 || lastCol < 1) {
      SpreadsheetApp.getUi().alert('Error: Sheet appears to be empty');
      return;
    }
    
    // Month columns are H-S (columns 8-19)
    const monthStartCol = 8; // Column H
    const monthEndCol = 19;  // Column S
    
    let filledCount = 0;
    const updates = [];
    
    // Get all data at once for better performance
    const dataRange = sheet.getRange(1, 1, lastRow, lastCol);
    const allData = dataRange.getValues();
    
    // Process each row
    for (let row = 1; row <= lastRow; row++) {
      const rowData = allData[row - 1];
      
      // Skip header rows and empty rows
      if (row <= 4 || !rowData || rowData.every(cell => !cell || cell.toString().trim() === '')) {
        continue;
      }
      
      // Determine the type of data in this row based on row content
      const rowType = determineRowType(rowData, row);
      
      // Process month columns (H-S)
      for (let col = monthStartCol; col <= monthEndCol && col <= lastCol; col++) {
        const cellValue = rowData[col - 1];
        
        // Skip if cell already has a value
        if (cellValue !== null && cellValue !== '' && cellValue !== 0 && 
            cellValue.toString().trim() !== '' && cellValue.toString().trim() !== '0') {
          continue;
        }
        
        // Skip if it's a date column (rows 3-4)
        if (row === 3 || row === 4) {
          continue;
        }
        
        // Skip if it's a URL or link column
        if (rowData[6] && rowData[6].toString().includes('http')) {
          continue;
        }
        
        // Generate random number based on row type
        const randomValue = generateRandomNumber(rowType, rowData, col);
        
        if (randomValue !== null) {
          updates.push({
            row: row,
            col: col,
            value: randomValue
          });
          filledCount++;
        }
      }
    }
    
    // Apply all updates in batch
    if (updates.length > 0) {
      // Group updates by row for batch operations
      const updatesByRow = {};
      updates.forEach(update => {
        if (!updatesByRow[update.row]) {
          updatesByRow[update.row] = [];
        }
        updatesByRow[update.row].push(update);
      });
      
      // Apply updates row by row
      for (const row in updatesByRow) {
        const rowUpdates = updatesByRow[row];
        
        // Only set values for columns that have updates
        const startCol = Math.min(...rowUpdates.map(u => u.col));
        const endCol = Math.max(...rowUpdates.map(u => u.col));
        const numCols = endCol - startCol + 1;
        const rowValues = new Array(numCols).fill(null);
        
        rowUpdates.forEach(update => {
          rowValues[update.col - startCol] = update.value;
        });
        
        sheet.getRange(parseInt(row), startCol, 1, numCols).setValues([rowValues]);
      }
      
      SpreadsheetApp.getUi().alert(
        '✅ Success!\n\n' +
        'Filled ' + filledCount + ' empty cells with random numbers.\n\n' +
        'The numbers were generated based on the context of each row.'
      );
    } else {
      SpreadsheetApp.getUi().alert('ℹ️ No empty cells found that need to be filled.');
    }
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.message);
    Logger.log('Error in fillEmptyCellsWithRandomNumbers: ' + error.message);
  }
}

/**
 * Determines the type of data in a row to generate appropriate random numbers
 */
function determineRowType(rowData, rowNum) {
  const rowText = rowData.join(' ').toLowerCase();
  
  // Check for percentage indicators
  if (rowText.includes('%') || 
      rowText.includes('percentage') || 
      rowText.includes('collection rate') ||
      (rowText.includes('occupancy') && (rowText.includes('%') || rowText.includes('actual %')))) {
    return 'percentage';
  }
  
  // Check for currency/financial data
  if (rowText.includes('revenue') || 
      rowText.includes('profit') || 
      rowText.includes('income') ||
      rowText.includes('expense') ||
      rowText.includes('opex') ||
      rowText.includes('receivables') ||
      rowText.includes('collected') ||
      rowText.includes('pvalue') ||
      (rowText.includes('area') && !rowText.includes('occupancy'))) {
    return 'currency';
  }
  
  // Check for specific metrics that need custom ranges
  if (rowText.includes('closed inquiry') && (rowText.includes('offline') || rowText.includes('inquiries'))) {
    return 'closed_inquiry';
  }
  
  if (rowText.includes('fb page') && rowText.includes('followers')) {
    return 'fb_followers';
  }
  
  if (rowText.includes('i.c.a.r.e') || rowText.includes('icare')) {
    return 'icare_score';
  }
  
  if (rowText.includes('site quality') && rowText.includes('monitoring')) {
    return 'quality_score';
  }
  
  if (rowText.includes('insurance claim') && rowText.includes('monitoring')) {
    return 'insurance_claims';
  }
  
  if (rowText.includes('regular events') && rowText.includes('plan')) {
    return 'events_plan';
  }
  
  if (rowText.includes('culture') && (rowText.includes('dev') || rowText.includes('development'))) {
    return 'culture_activities';
  }
  
  if (rowText.includes('smd projects')) {
    return 'smd_projects';
  }
  
  if (rowText.includes('sid projects')) {
    return 'sid_projects';
  }
  
  if (rowText.includes('budget') && (rowText.includes('project') || rowText.includes('e&d'))) {
    return 'project_budget';
  }
  
  if ((rowText.includes('team') && rowText.includes('target')) || (rowText.includes('section') && rowText.includes('target'))) {
    return 'team_targets';
  }
  
  if (rowText.includes('number of breakdowns') || rowText.includes('breakdowns')) {
    return 'breakdowns';
  }
  
  // Check for count data
  if (rowText.includes('foot traffic') ||
      rowText.includes('units') ||
      rowText.includes('pax') ||
      rowText.includes('inquiry') ||
      rowText.includes('prospect') ||
      rowText.includes('averted') ||
      rowText.includes('closed')) {
    return 'count';
  }
  
  // Check for occupancy numbers (not percentages)
  if (rowText.includes('occupancy') && !rowText.includes('%')) {
    return 'occupancy';
  }
  
  // Default to currency for financial sheets
  return 'currency';
}

/**
 * Generates a random number based on the row type and context
 */
function generateRandomNumber(rowType, rowData, colNum) {
  let randomValue;
  
  switch (rowType) {
    case 'percentage':
      // Generate percentage between 0 and 1 (or 0-100% as decimal)
      randomValue = Math.random() * 1.2; // Allow slightly over 100% for some metrics
      randomValue = Math.round(randomValue * 100) / 100; // Round to 2 decimals
      break;
      
    case 'currency':
      // Generate large currency values (millions range)
      // Base range: 1M to 50M, with some variation
      const baseValue = 1000000 + Math.random() * 49000000;
      randomValue = Math.round(baseValue * 100) / 100; // Round to 2 decimals
      break;
      
    case 'closed_inquiry':
      // Closed inquiries: 50 to 10,000 range
      randomValue = Math.floor(Math.random() * 9950) + 50;
      break;
      
    case 'fb_followers':
      // Facebook page followers: 1,000 to 100,000 range
      randomValue = Math.floor(Math.random() * 99000) + 1000;
      break;
      
    case 'icare_score':
      // I.C.A.R.E. score: percentage 0.70 to 1.00 (70% to 100%)
      randomValue = 0.70 + Math.random() * 0.30;
      randomValue = Math.round(randomValue * 100) / 100;
      break;
      
    case 'quality_score':
      // Site quality monitoring: score 0.80 to 1.00 (80% to 100%)
      randomValue = 0.80 + Math.random() * 0.20;
      randomValue = Math.round(randomValue * 100) / 100;
      break;
      
    case 'insurance_claims':
      // Insurance claims: 0 to 20 (low count, should be minimal)
      randomValue = Math.floor(Math.random() * 21);
      break;
      
    case 'events_plan':
      // Regular events plan: 1 to 50 events per month
      randomValue = Math.floor(Math.random() * 50) + 1;
      break;
      
    case 'culture_activities':
      // Culture development activities: 1 to 30 activities
      randomValue = Math.floor(Math.random() * 30) + 1;
      break;
      
    case 'smd_projects':
      // SMD projects: 0 to 15 projects
      randomValue = Math.floor(Math.random() * 16);
      break;
      
    case 'sid_projects':
      // SID projects: 0 to 15 projects
      randomValue = Math.floor(Math.random() * 16);
      break;
      
    case 'project_budget':
      // Budget for projects (E&D): 100,000 to 5,000,000
      randomValue = Math.floor(Math.random() * 4900000) + 100000;
      randomValue = Math.round(randomValue * 100) / 100;
      break;
      
    case 'team_targets':
      // Team/Section targets: could be count (10 to 100) or percentage
      // Defaulting to count for now
      randomValue = Math.floor(Math.random() * 90) + 10;
      break;
      
    case 'breakdowns':
      // Number of breakdowns: 0 to 10 (should be low)
      randomValue = Math.floor(Math.random() * 11);
      break;
      
    case 'count':
      // Generate count values (hundreds to thousands)
      randomValue = Math.floor(Math.random() * 10000) + 100;
      break;
      
    case 'occupancy':
      // Generate occupancy numbers (thousands to hundreds of thousands)
      randomValue = Math.floor(Math.random() * 500000) + 1000;
      break;
      
    default:
      // Default: medium range numbers
      randomValue = Math.floor(Math.random() * 100000) + 1000;
  }
  
  // Look at existing values in the row to adjust the range
  const existingValues = rowData.slice(7, 19).filter(val => 
    val !== null && val !== '' && !isNaN(parseFloat(val))
  );
  
  if (existingValues.length > 0) {
    const numericValues = existingValues.map(v => parseFloat(v.toString().replace(/,/g, '')));
    const minVal = Math.min(...numericValues);
    const maxVal = Math.max(...numericValues);
    const avgVal = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
    
    // Adjust random value to be within similar range
    if (rowType === 'percentage') {
      // Keep percentage range
      randomValue = Math.random() * Math.max(1, maxVal * 1.2);
      randomValue = Math.round(randomValue * 100) / 100;
    } else {
      // Use average as base with some variation
      const variation = avgVal * 0.3; // 30% variation
      randomValue = avgVal + (Math.random() - 0.5) * 2 * variation;
      
      if (rowType === 'currency') {
        randomValue = Math.round(randomValue * 100) / 100;
      } else {
        randomValue = Math.round(randomValue);
      }
      
      // Ensure positive values
      if (randomValue < 0) {
        randomValue = Math.abs(randomValue);
      }
    }
  }
  
  return randomValue;
}

// ============================================
// HELP
// ============================================
function showFillHelp() {
  const helpText = 
    'FILL EMPTY CELLS WITH RANDOM NUMBERS\n\n' +
    'HOW TO USE:\n' +
    '1. Open your Executive Summary sheet\n' +
    '2. Click "Fill Random Numbers" menu\n' +
    '3. Select "Fill Empty Cells with Random Numbers"\n' +
    '4. The script will automatically fill empty cells in month columns (H-S)\n\n' +
    'FEATURES:\n' +
    '• Automatically detects data type (percentages, currency, counts, etc.)\n' +
    '• Generates context-appropriate random numbers\n' +
    '• Uses existing values in rows to maintain realistic ranges\n' +
    '• Skips header rows, dates, and URLs\n' +
    '• Only fills empty cells (preserves existing data)\n\n' +
    'DATA TYPES:\n' +
    '• Percentages: 0-120% range\n' +
    '• Currency: 1M-50M range\n' +
    '• Counts: 100-10,000 range\n' +
    '• Occupancy: 1,000-500,000 range';
  
  SpreadsheetApp.getUi().alert('Fill Random Numbers Help', helpText, SpreadsheetApp.getUi().ButtonSet.OK);
}

// ============================================
// CREATE FORMULAS FOR COMPANY LEAD
// ============================================
/**
 * Creates formulas in COMPANY LEAD sheet to pull data from EXECUTIVE SUMMARY DATA sheet
 * Maps metrics from source sheet to destination sheet based on row labels
 */
function createCompanyLeadFormulas() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Get source and destination sheets
    const sourceSheet = ss.getSheetByName(EXECUTIVE_SUMMARY_SHEET_NAME);
    const destSheet = ss.getSheetByName(COMPANY_LEAD_SHEET_NAME);
    
    if (!sourceSheet) {
      SpreadsheetApp.getUi().alert('Error: Sheet "' + EXECUTIVE_SUMMARY_SHEET_NAME + '" not found');
      return;
    }
    
    if (!destSheet) {
      SpreadsheetApp.getUi().alert('Error: Sheet "' + COMPANY_LEAD_SHEET_NAME + '" not found');
      return;
    }
    
    // Get current month (November 2025 = column P = column 16)
    // You can modify this to detect current month automatically
    const currentMonthCol = 16; // Column P (November)
    const currentMonthColLetter = 'P';
    
    // Get the year from the sheet (2025)
    const year = 2025;
    
    let formulaCount = 0;
    const formulas = [];
    
    // Get all data from destination sheet
    const destLastRow = destSheet.getLastRow();
    const destLastCol = destSheet.getLastColumn();
    const destData = destSheet.getRange(1, 1, destLastRow, destLastCol).getValues();
    
    // Process each row in COMPANY LEAD sheet
    for (let row = 1; row <= destLastRow; row++) {
      const rowData = destData[row - 1];
      const rowText = rowData.join(' ').toLowerCase();
      
      // Skip header rows
      if (row <= 4) continue;
      
      // Map metrics to source sheet locations
      const mapping = getMetricMapping(rowData, rowText, row);
      
      if (mapping) {
        // Column D is TARGET (column 4), Column E is ACTUAL (column 5)
        if (mapping.targetFormula && (rowData[3] === '' || rowData[3] === null || rowData[3] === 0)) {
          formulas.push({
            row: row,
            col: 4, // Column D (TARGET)
            formula: mapping.targetFormula
          });
          formulaCount++;
        }
        
        if (mapping.actualFormula && (rowData[4] === '' || rowData[4] === null || rowData[4] === 0)) {
          formulas.push({
            row: row,
            col: 5, // Column E (ACTUAL)
            formula: mapping.actualFormula
          });
          formulaCount++;
        }
      }
    }
    
    // Apply formulas
    if (formulas.length > 0) {
      // Group by column for batch operations
      const formulasByCol = {};
      formulas.forEach(f => {
        if (!formulasByCol[f.col]) {
          formulasByCol[f.col] = [];
        }
        formulasByCol[f.col].push(f);
      });
      
      // Apply formulas column by column
      for (const col in formulasByCol) {
        const colFormulas = formulasByCol[col];
        colFormulas.forEach(f => {
          destSheet.getRange(f.row, parseInt(col)).setFormula(f.formula);
        });
      }
      
      SpreadsheetApp.getUi().alert(
        '✅ Success!\n\n' +
        'Created ' + formulaCount + ' formulas in COMPANY LEAD sheet.\n\n' +
        'Formulas pull data from ' + EXECUTIVE_SUMMARY_SHEET_NAME + ' sheet.\n' +
        'Current month: ' + currentMonthColLetter + ' (November 2025)'
      );
    } else {
      SpreadsheetApp.getUi().alert('ℹ️ No formulas created. All cells may already have values or no matching metrics found.');
    }
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.message);
    Logger.log('Error in createCompanyLeadFormulas: ' + error.message);
  }
}

/**
 * Maps COMPANY LEAD metrics to EXECUTIVE SUMMARY DATA sheet locations
 * Returns formula strings for TARGET and ACTUAL columns
 */
function getMetricMapping(rowData, rowText, rowNum) {
  const sourceSheetName = "'" + EXECUTIVE_SUMMARY_SHEET_NAME + "'";
  const currentMonthCol = 16; // Column P (November)
  const currentMonthColLetter = 'P';
  
  // OCCUPANCY RATE (UNIT)
  if (rowText.includes('occupancy rate') && rowText.includes('unit')) {
    // TARGET: Row 148, Column P (Commercial % Units - TARGET)
    // ACTUAL: Row 143, Column P (Commercial Units - ACTUAL #)
    return {
      targetFormula: '=' + sourceSheetName + '!P148',
      actualFormula: '=' + sourceSheetName + '!P143'
    };
  }
  
  // OCCUPANCY RATE (AREA)
  if (rowText.includes('occupancy rate') && rowText.includes('area')) {
    // TARGET: Row 149, Column P (Commercial % Area - TARGET)
    // ACTUAL: Row 144, Column P (Commercial Area - ACTUAL #)
    return {
      targetFormula: '=' + sourceSheetName + '!P149',
      actualFormula: '=' + sourceSheetName + '!P144'
    };
  }
  
  // OCCUPANCY RATE (P-VALUE)
  if (rowText.includes('occupancy rate') && rowText.includes('p-value')) {
    // TARGET: Row 150, Column P (Commercial % PValue - TARGET)
    // ACTUAL: Row 145, Column P (Commercial PValue - ACTUAL #)
    return {
      targetFormula: '=' + sourceSheetName + '!P150',
      actualFormula: '=' + sourceSheetName + '!P145'
    };
  }
  
  // CLOSED INQUIRIES
  if (rowText.includes('closed inquir')) {
    // TARGET: Row 173, Column P (Closed Inquiry TARGET)
    // ACTUAL: Row 159, Column P (Closed Inquiry ACTUAL)
    return {
      targetFormula: '=' + sourceSheetName + '!P173',
      actualFormula: '=' + sourceSheetName + '!P159'
    };
  }
  
  // PULLOUT AVERSION
  if (rowText.includes('pullout') || rowText.includes('aversion')) {
    // TARGET: Row 177, Column P (Averted TARGET)
    // ACTUAL: Row 163, Column P (Averted ACTUAL)
    return {
      targetFormula: '=' + sourceSheetName + '!P177',
      actualFormula: '=' + sourceSheetName + '!P163'
    };
  }
  
  // FOOT TRAFFIC - LOTUS MALL
  if (rowText.includes('lotus mall') || (rowText.includes('lotus') && rowText.includes('foot traffic'))) {
    // TARGET: Row 199, Column P (LOTUS TARGET)
    // ACTUAL: Row 182, Column P (LOTUS ACTUAL)
    return {
      targetFormula: '=' + sourceSheetName + '!P199',
      actualFormula: '=' + sourceSheetName + '!P182'
    };
  }
  
  // FOOT TRAFFIC - PORTAL MALL
  if (rowText.includes('portal mall') || (rowText.includes('portal') && rowText.includes('foot traffic'))) {
    // TARGET: Row 200, Column P (PORTAL TARGET)
    // ACTUAL: Row 183, Column P (PORTAL ACTUAL)
    return {
      targetFormula: '=' + sourceSheetName + '!P200',
      actualFormula: '=' + sourceSheetName + '!P183'
    };
  }
  
  // FOOT TRAFFIC - STADIUM SHOPPING STRIP
  if (rowText.includes('stadium') && rowText.includes('foot traffic')) {
    // TARGET: Row 201, Column P (STADIUM TARGET)
    // ACTUAL: Row 184, Column P (STADIUM ACTUAL)
    return {
      targetFormula: '=' + sourceSheetName + '!P201',
      actualFormula: '=' + sourceSheetName + '!P184'
    };
  }
  
  // FOOT TRAFFIC - YSPACIO CREATIVE PARK ALAPAN
  if (rowText.includes('yspacio') && rowText.includes('alapan')) {
    // TARGET: Row 202, Column P (YSPACIO - ALAPAN TARGET)
    // ACTUAL: Row 185, Column P (YSPACIO - ALAPAN ACTUAL)
    return {
      targetFormula: '=' + sourceSheetName + '!P202',
      actualFormula: '=' + sourceSheetName + '!P185'
    };
  }
  
  // FOOT TRAFFIC - YSPACIO CREATIVE PARK CARBAG
  if (rowText.includes('yspacio') && rowText.includes('carbag')) {
    // TARGET: Row 203, Column P (YSPACIO - CARBAG TARGET)
    // ACTUAL: Row 186, Column P (YSPACIO - CARBAG ACTUAL)
    return {
      targetFormula: '=' + sourceSheetName + '!P203',
      actualFormula: '=' + sourceSheetName + '!P186'
    };
  }
  
  // FOOT TRAFFIC - LUMINA
  if (rowText.includes('lumina') && rowText.includes('foot traffic')) {
    // TARGET: Row 204, Column P (LUMINA TARGET)
    // ACTUAL: Row 187, Column P (LUMINA ACTUAL)
    return {
      targetFormula: '=' + sourceSheetName + '!P204',
      actualFormula: '=' + sourceSheetName + '!P187'
    };
  }
  
  // NUMBER OF PAX PER EVENT - LOTUS MALL
  if (rowText.includes('lotus') && rowText.includes('pax')) {
    // TARGET: Row 214, Column P (500 PAX TARGET - always 500)
    // ACTUAL: Row 207, Column P (LOTUS 500 PAX ACTUAL)
    return {
      targetFormula: '=' + sourceSheetName + '!P214',
      actualFormula: '=' + sourceSheetName + '!P207'
    };
  }
  
  // NUMBER OF PAX PER EVENT - PORTAL MALL
  if (rowText.includes('portal') && rowText.includes('pax')) {
    // TARGET: Row 214, Column P (500 PAX TARGET - always 500)
    // ACTUAL: Row 208, Column P (PORTAL 500 PAX ACTUAL)
    return {
      targetFormula: '=' + sourceSheetName + '!P214',
      actualFormula: '=' + sourceSheetName + '!P208'
    };
  }
  
  // NUMBER OF PAX PER EVENT - STADIUM SHOPPING STRIP
  if (rowText.includes('stadium') && rowText.includes('pax')) {
    // TARGET: Row 214, Column P (500 PAX TARGET - always 500)
    // ACTUAL: Row 209, Column P (STADIUM 500 PAX ACTUAL)
    return {
      targetFormula: '=' + sourceSheetName + '!P214',
      actualFormula: '=' + sourceSheetName + '!P209'
    };
  }
  
  // NUMBER OF PAX PER EVENT - YSPACIO ALAPAN
  if (rowText.includes('yspacio') && rowText.includes('alapan') && rowText.includes('pax')) {
    // TARGET: Row 214, Column P (500 PAX TARGET - always 500)
    // ACTUAL: Row 210, Column P (YSPACIO - ALAPAN 500 PAX ACTUAL)
    return {
      targetFormula: '=' + sourceSheetName + '!P214',
      actualFormula: '=' + sourceSheetName + '!P210'
    };
  }
  
  // CLOSED INQUIRY/OFFLINE INQUIRIES (Gathering Team)
  if (rowText.includes('closed inquiry') && rowText.includes('offline')) {
    // TARGET: Row 215, Column P (CLOSED INQUIRY TARGET)
    // ACTUAL: Row 211, Column P (CLOSED INQUIRY ACTUAL)
    return {
      targetFormula: '=' + sourceSheetName + '!P215',
      actualFormula: '=' + sourceSheetName + '!P211'
    };
  }
  
  return null;
}

// ============================================
// FILL COMPANY LEAD TARGET & ACTUAL COLUMNS
// ============================================
/**
 * Fills empty TARGET (Column C) and ACTUAL (Column D) cells in COMPANY LEAD sheet
 * with appropriate random numbers based on the metric type
 */
function fillCompanyLeadTargetActual() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(COMPANY_LEAD_SHEET_NAME);
    
    if (!sheet) {
      SpreadsheetApp.getUi().alert('Error: Sheet "' + COMPANY_LEAD_SHEET_NAME + '" not found');
      return;
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow < 1) {
      SpreadsheetApp.getUi().alert('Error: Sheet appears to be empty');
      return;
    }
    
    // Get all data from the sheet
    const dataRange = sheet.getRange(1, 1, lastRow, 6); // Columns A-F
    const allData = dataRange.getValues();
    const allDisplayValues = dataRange.getDisplayValues(); // Get display values to catch formulas that show as empty
    
    let filledCount = 0;
    const updates = [];
    
    // Column C = TARGET (index 2), Column D = ACTUAL (index 3)
    const TARGET_COL = 3; // Column C
    const ACTUAL_COL = 4; // Column D
    
    // Process each row starting from row 5 (after headers)
    for (let row = 5; row <= lastRow; row++) {
      const rowData = allData[row - 1];
      const rowDisplayData = allDisplayValues[row - 1];
      const metricName = rowData[0] ? rowData[0].toString().trim() : ''; // Column A
      const rowText = metricName.toLowerCase();
      
      // Skip completely empty rows (no metric name)
      if (!metricName || metricName === '') continue;
      
      // Determine metric type
      const metricType = getCompanyLeadMetricType(rowText, metricName);
      
      // Check if TARGET is empty (Column C, index 2) - check both value and display value
      const targetValue = rowData[2]; // Column C
      const targetDisplay = rowDisplayData[2] ? rowDisplayData[2].toString().trim() : '';
      // Consider empty if value is empty OR display is empty/zero
      const isTargetEmpty = isCellEmpty(targetValue) || targetDisplay === '' || targetDisplay === '0' || targetDisplay === '0.00';
      
      // Check if ACTUAL is empty (Column D, index 3) - check both value and display value
      const actualValue = rowData[3]; // Column D
      const actualDisplay = rowDisplayData[3] ? rowDisplayData[3].toString().trim() : '';
      // Consider empty if value is empty OR display is empty/zero
      const isActualEmpty = isCellEmpty(actualValue) || actualDisplay === '' || actualDisplay === '0' || actualDisplay === '0.00';
      
      // Only process if at least one cell is empty
      if (!isTargetEmpty && !isActualEmpty) continue;
      
      // If we have a recognized metric type, use it; otherwise try to infer or use default
      if (metricType) {
        let targetRandom = null;
        
        if (isTargetEmpty) {
          targetRandom = generateCompanyLeadRandom(metricType, 'target');
          if (targetRandom !== null) {
            updates.push({
              row: row,
              col: TARGET_COL,
              value: targetRandom
            });
            filledCount++;
          }
        } else {
          // Use existing TARGET value for ACTUAL calculation
          targetRandom = parseFloat(targetValue);
        }
        
        if (isActualEmpty) {
          // Generate ACTUAL based on TARGET (either newly generated or existing)
          const actualRandom = generateCompanyLeadRandom(metricType, 'actual', targetRandom);
          if (actualRandom !== null) {
            updates.push({
              row: row,
              col: ACTUAL_COL,
              value: actualRandom
            });
            filledCount++;
          }
        }
      } else {
        // For unrecognized metrics, still try to fill if cells are empty
        // Use a generic approach
        if (isTargetEmpty) {
          // Generate a generic target value
          const genericTarget = Math.floor(Math.random() * 1000) + 10;
          updates.push({
            row: row,
            col: TARGET_COL,
            value: genericTarget
          });
          filledCount++;
        }
        
        if (isActualEmpty) {
          // Generate ACTUAL as 70-130% of TARGET or a generic value
          const existingTarget = isTargetEmpty ? null : parseFloat(targetValue);
          const baseValue = existingTarget || (Math.floor(Math.random() * 1000) + 10);
          const actualRandom = Math.floor(baseValue * (0.70 + Math.random() * 0.60));
          updates.push({
            row: row,
            col: ACTUAL_COL,
            value: actualRandom
          });
          filledCount++;
        }
      }
    }
    
    // Apply all updates
    if (updates.length > 0) {
      // Group by column for batch operations
      const updatesByCol = {};
      updates.forEach(update => {
        if (!updatesByCol[update.col]) {
          updatesByCol[update.col] = [];
        }
        updatesByCol[update.col].push(update);
      });
      
      // Apply updates column by column
      for (const col in updatesByCol) {
        const colUpdates = updatesByCol[col];
        colUpdates.forEach(update => {
          sheet.getRange(update.row, parseInt(col)).setValue(update.value);
        });
      }
      
      SpreadsheetApp.getUi().alert(
        '✅ Success!\n\n' +
        'Filled ' + filledCount + ' cells in COMPANY LEAD sheet.\n\n' +
        'TARGET and ACTUAL columns have been populated with appropriate random numbers.'
      );
    } else {
      SpreadsheetApp.getUi().alert('ℹ️ No empty cells found. All TARGET and ACTUAL cells already have values.');
    }
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.message);
    Logger.log('Error in fillCompanyLeadTargetActual: ' + error.message);
  }
}

/**
 * Helper function to check if a cell is truly empty
 */
function isCellEmpty(cellValue) {
  if (cellValue === null || cellValue === undefined) return true;
  if (cellValue === '') return true;
  const strValue = cellValue.toString().trim();
  if (strValue === '' || strValue === '0' || strValue === '0.00' || strValue === '0.0') {
    // Check if it's actually zero or just empty string
    const numValue = parseFloat(cellValue);
    return isNaN(numValue) || numValue === 0;
  }
  return false;
}

/**
 * Determines the metric type for COMPANY LEAD sheet based on row text
 */
function getCompanyLeadMetricType(rowText, metricName) {
  // CLOSED INQUIRY/OFFLINE INQUIRIES
  if (rowText.includes('closed') && (rowText.includes('inquiry') || rowText.includes('inquiries')) && 
      (rowText.includes('offline') || rowText.includes('inquiries'))) {
    return 'closed_inquiry';
  }
  
  // FB PAGE FOLLOWERS
  if (rowText.includes('fb page') && rowText.includes('followers')) {
    return 'fb_followers';
  }
  
  // I.C.A.R.E. (ALL TEAMS)
  if (rowText.includes('i.c.a.r.e') || rowText.includes('icare')) {
    return 'icare_score';
  }
  
  // SITE QUALITY MONITORING
  if (rowText.includes('site quality') && rowText.includes('monitoring')) {
    return 'quality_score';
  }
  
  // INSURANCE CLAIM MONITORING
  if (rowText.includes('insurance claim') && rowText.includes('monitoring')) {
    return 'insurance_claims';
  }
  
  // REGULAR EVENTS PLAN
  if (rowText.includes('regular events') && rowText.includes('plan')) {
    return 'events_plan';
  }
  
  // CULTURE DEV'T ACTIVITIES PLAN
  if (rowText.includes('culture') && (rowText.includes('dev') || rowText.includes('development'))) {
    return 'culture_activities';
  }
  
  // SMD PROJECTS
  if (rowText.includes('smd projects')) {
    return 'smd_projects';
  }
  
  // SID PROJECTS
  if (rowText.includes('sid projects')) {
    return 'sid_projects';
  }
  
  // BUDGET: PROJECTS (E&D)
  if (rowText.includes('budget') && (rowText.includes('project') || rowText.includes('e&d'))) {
    return 'project_budget';
  }
  
  // TEAM/SECTION'S TARGETS
  if ((rowText.includes('team') && rowText.includes('target')) || 
      (rowText.includes('section') && rowText.includes('target'))) {
    return 'team_targets';
  }
  
  // NUMBER OF BREAKDOWNS
  if (rowText.includes('number of breakdowns') || rowText.includes('breakdowns')) {
    return 'breakdowns';
  }
  
  return null;
}

/**
 * Generates random numbers for COMPANY LEAD TARGET and ACTUAL columns
 * ACTUAL values are typically 70-130% of TARGET to create realistic variance
 * @param {string} metricType - Type of metric
 * @param {string} columnType - 'target' or 'actual'
 * @param {number} targetValue - Optional: existing TARGET value to base ACTUAL on
 */
function generateCompanyLeadRandom(metricType, columnType, targetValue) {
  let baseValue;
  
  // For ACTUAL, if we have a target value, use it; otherwise generate base
  if (columnType === 'actual' && targetValue !== null && targetValue !== undefined && !isNaN(targetValue)) {
    baseValue = targetValue;
  } else {
    // Generate base value based on metric type
    switch (metricType) {
      case 'closed_inquiry':
        baseValue = Math.floor(Math.random() * 9950) + 50; // 50 to 10,000
        break;
        
      case 'fb_followers':
        baseValue = Math.floor(Math.random() * 99000) + 1000; // 1,000 to 100,000
        break;
        
      case 'icare_score':
        baseValue = 0.70 + Math.random() * 0.30; // 0.70 to 1.00
        baseValue = Math.round(baseValue * 100) / 100;
        break;
        
      case 'quality_score':
        baseValue = 0.80 + Math.random() * 0.20; // 0.80 to 1.00
        baseValue = Math.round(baseValue * 100) / 100;
        break;
        
      case 'insurance_claims':
        baseValue = Math.floor(Math.random() * 21); // 0 to 20
        break;
        
      case 'events_plan':
        baseValue = Math.floor(Math.random() * 50) + 1; // 1 to 50
        break;
        
      case 'culture_activities':
        baseValue = Math.floor(Math.random() * 30) + 1; // 1 to 30
        break;
        
      case 'smd_projects':
        baseValue = Math.floor(Math.random() * 16); // 0 to 15
        break;
        
      case 'sid_projects':
        baseValue = Math.floor(Math.random() * 16); // 0 to 15
        break;
        
      case 'project_budget':
        baseValue = Math.floor(Math.random() * 4900000) + 100000; // 100,000 to 5,000,000
        baseValue = Math.round(baseValue * 100) / 100;
        break;
        
      case 'team_targets':
        baseValue = Math.floor(Math.random() * 90) + 10; // 10 to 100
        break;
        
      case 'breakdowns':
        baseValue = Math.floor(Math.random() * 11); // 0 to 10
        break;
        
      default:
        return null;
    }
  }
  
  // For TARGET, return base value
  if (columnType === 'target') {
    return baseValue;
  }
  
  // For ACTUAL, create variation (70% to 130% of target for most metrics)
  // For scores/percentages, keep similar range
  if (metricType === 'icare_score' || metricType === 'quality_score') {
    // For scores, ACTUAL can be slightly different but in similar range
    const variation = 0.70 + Math.random() * 0.30; // 0.70 to 1.00
    return Math.round(variation * 100) / 100;
  } else {
    // For counts and currency, ACTUAL is 70% to 130% of TARGET
    const variationFactor = 0.70 + Math.random() * 0.60; // 0.70 to 1.30
    let actualValue = baseValue * variationFactor;
    
    // Round appropriately
    if (metricType === 'project_budget') {
      actualValue = Math.round(actualValue * 100) / 100;
    } else {
      actualValue = Math.floor(actualValue);
    }
    
    // Ensure non-negative
    if (actualValue < 0) {
      actualValue = 0;
    }
    
    return actualValue;
  }
}

