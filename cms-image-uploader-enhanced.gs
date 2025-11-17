/**
 * Google Apps Script - Enhanced CMS Image Uploader
 * With automatic URL insertion to selected row/column
 */

// ============================================
// CONFIGURATION
// ============================================
const DRIVE_FOLDER_ID = '1Y_jyVoHjgPhyVRjP373jIhaRmVRM0-My';
const WEBSITE_BASE_URL = 'http://127.0.0.1:5502/';
const CMS_SHEET_NAME = 'Index'; // Name of your CMS sheet

// ============================================
// MENU SETUP
// ============================================
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('CMS Tools')
    .addItem('📤 Upload Image', 'showUploadSidebar')
    .addItem('🔗 Get All Image URLs', 'generateImageUrlsSheet')
    .addSeparator()
    .addItem('ℹ️ Help', 'showHelp')
    .addToUi();
  
  // Automatically setup Type column validation when sheet opens
  setupTypeColumnValidationSilent();
}

// ============================================
// AUTO-SET ATTRIBUTE WHEN TYPE IS "image"
// ============================================
function onEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    const range = e.range;
    const row = range.getRow();
    const col = range.getColumn();
    const value = range.getValue();
    
    // Only process edits in the "Index" sheet
    if (sheet.getName() !== CMS_SHEET_NAME) {
      return;
    }
    
    // Only process edits in column A (Type column) and skip header row
    if (col === 1 && row > 1) {
      // If Type is set to "image", automatically set Attribute (column C) to "src"
      if (value === 'image') {
        const attributeCell = sheet.getRange(row, 3); // Column C is column 3
        attributeCell.setValue('src');
      }
    }
  } catch (error) {
    Logger.log('Error in onEdit: ' + error.message);
  }
}

// ============================================
// GET SHEET DATA FOR DROPDOWNS
// ============================================
function getSheetData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CMS_SHEET_NAME);
    
    if (!sheet) {
      return {
        success: false,
        error: 'Sheet "' + CMS_SHEET_NAME + '" not found'
      };
    }
    
    // Get header row to find column names
    const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Find Value column index (case-insensitive)
    let valueColumnIndex = -1;
    for (let i = 0; i < headerRow.length; i++) {
      if (headerRow[i] && headerRow[i].toString().toLowerCase().includes('value')) {
        valueColumnIndex = i + 1; // 1-based index
        break;
      }
    }
    
    // Get all data rows (skip header)
    const lastRow = sheet.getLastRow();
    const rows = [];
    
    if (lastRow > 1) {
      // Get Type and Selector columns for display
      const typeCol = headerRow.findIndex(h => h && h.toString().toLowerCase().includes('type')) + 1;
      const selectorCol = headerRow.findIndex(h => h && h.toString().toLowerCase().includes('selector')) + 1;
      
      for (let i = 2; i <= lastRow; i++) {
        const type = typeCol > 0 ? sheet.getRange(i, typeCol).getValue() : '';
        const selector = selectorCol > 0 ? sheet.getRange(i, selectorCol).getValue() : '';
        
        if (type && selector) {
          rows.push({
            row: i,
            label: `Row ${i}: ${type} - ${selector.substring(0, 40)}${selector.length > 40 ? '...' : ''}`
          });
        }
      }
    }
    
    return {
      success: true,
      valueColumn: valueColumnIndex,
      valueColumnLetter: valueColumnIndex > 0 ? getColumnLetter(valueColumnIndex) : 'D',
      rows: rows,
      headers: headerRow,
      totalRows: lastRow
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

function getColumnLetter(columnNumber) {
  let letter = '';
  while (columnNumber > 0) {
    const remainder = (columnNumber - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    columnNumber = Math.floor((columnNumber - 1) / 26);
  }
  return letter;
}

// ============================================
// CHECK CELL VALUE
// ============================================
function checkCellValue(row, column) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CMS_SHEET_NAME);
    
    if (!sheet) {
      return {
        success: false,
        error: 'Sheet "' + CMS_SHEET_NAME + '" not found'
      };
    }
    
    // Convert column letter to number if needed
    let colNum = column;
    if (typeof column === 'string') {
      colNum = columnToNumber(column);
    }
    
    const cellValue = sheet.getRange(row, colNum).getValue();
    const hasValue = cellValue !== null && cellValue !== '' && String(cellValue).trim() !== '';
    
    return {
      success: true,
      hasValue: hasValue,
      currentValue: hasValue ? String(cellValue).substring(0, 150) : '',
      cell: getColumnLetter(colNum) + row
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// ============================================
// INSERT URL INTO SHEET
// ============================================
function insertUrlIntoSheet(row, column, url, forceOverwrite) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CMS_SHEET_NAME);
    
    if (!sheet) {
      return {
        success: false,
        error: 'Sheet "' + CMS_SHEET_NAME + '" not found'
      };
    }
    
    // Convert column letter to number if needed
    let colNum = column;
    if (typeof column === 'string') {
      colNum = columnToNumber(column);
    }
    
    // Check if cell has existing value (unless forceOverwrite is true)
    if (!forceOverwrite) {
      const cellValue = sheet.getRange(row, colNum).getValue();
      if (cellValue !== null && cellValue !== '' && String(cellValue).trim() !== '') {
        return {
          success: false,
          hasExistingValue: true,
          currentValue: String(cellValue).substring(0, 150),
          cell: getColumnLetter(colNum) + row,
          error: 'Cell already contains a value. Overwrite not confirmed.'
        };
      }
    }
    
    // Insert the URL
    sheet.getRange(row, colNum).setValue(url);
    
    return {
      success: true,
      cell: getColumnLetter(colNum) + row,
      message: `URL inserted into ${getColumnLetter(colNum)}${row}`,
      overwritten: forceOverwrite || false
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

function columnToNumber(column) {
  let result = 0;
  for (let i = 0; i < column.length; i++) {
    result = result * 26 + (column.charCodeAt(i) - 64);
  }
  return result;
}

// ============================================
// SHOW SIDEBAR WITH DROPDOWNS
// ============================================
function showUploadSidebar() {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <meta charset="utf-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      padding: 20px;
      background: #f9fafb;
    }
    
    h2 {
      color: #1f2937;
      font-size: 20px;
      margin-bottom: 8px;
    }
    
    .subtitle {
      color: #6b7280;
      font-size: 13px;
      margin-bottom: 20px;
    }
    
    .upload-zone {
      border: 2px dashed #d1d5db;
      border-radius: 8px;
      padding: 30px 15px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
      margin-bottom: 15px;
    }
    
    .upload-zone:hover {
      border-color: #6366f1;
      background: #f0f9ff;
    }
    
    .upload-zone.dragover {
      border-color: #6366f1;
      background: #dbeafe;
      transform: scale(1.02);
    }
    
    .upload-zone.has-file {
      border-color: #10b981;
      background: #ecfdf5;
    }
    
    .upload-icon {
      font-size: 40px;
      margin-bottom: 8px;
    }
    
    .upload-text {
      color: #374151;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .upload-hint {
      color: #9ca3af;
      font-size: 12px;
    }
    
    input[type="file"] {
      display: none;
    }
    
    .file-info {
      background: #eff6ff;
      border: 1px solid #3b82f6;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 15px;
      display: none;
      font-size: 13px;
    }
    
    .file-info.show {
      display: block;
    }
    
    .file-name {
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 4px;
      word-break: break-word;
    }
    
    .file-size {
      color: #64748b;
      font-size: 12px;
    }
    
    .dropdown-section {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 15px;
      display: none;
    }
    
    .dropdown-section.show {
      display: block;
    }
    
    .dropdown-label {
      font-size: 13px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
      display: block;
    }
    
    select {
      width: 100%;
      padding: 10px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 13px;
      background: white;
      color: #374151;
      cursor: pointer;
      margin-bottom: 12px;
    }
    
    select:hover {
      border-color: #6366f1;
    }
    
    select:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    
    .checkbox-group {
      display: flex;
      align-items: center;
      margin-top: 10px;
    }
    
    .checkbox-group input[type="checkbox"] {
      margin-right: 8px;
      cursor: pointer;
    }
    
    .checkbox-group label {
      font-size: 12px;
      color: #6b7280;
      cursor: pointer;
    }
    
    .btn {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 10px;
    }
    
    .btn-primary {
      background: #6366f1;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #4f46e5;
    }
    
    .btn-primary:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    .result {
      border-radius: 6px;
      padding: 12px;
      margin-top: 15px;
      font-size: 13px;
      display: none;
    }
    
    .result.show {
      display: block;
    }
    
    .result.success {
      background: #ecfdf5;
      border: 1px solid #10b981;
      color: #065f46;
    }
    
    .result.error {
      background: #fef2f2;
      border: 1px solid #ef4444;
      color: #991b1b;
    }
    
    .result.loading {
      background: #eff6ff;
      border: 1px solid #3b82f6;
      color: #1e40af;
    }
    
    .url-box {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      padding: 10px;
      margin: 10px 0;
      font-family: 'Courier New', monospace;
      font-size: 11px;
      word-break: break-all;
      color: #374151;
      max-height: 80px;
      overflow-y: auto;
    }
    
    .btn-copy {
      background: #10b981;
      color: white;
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      width: 100%;
    }
    
    .btn-copy:hover {
      background: #059669;
    }
    
    .instructions {
      background: #fffbeb;
      border: 1px solid #fbbf24;
      border-radius: 6px;
      padding: 12px;
      margin-top: 15px;
      font-size: 12px;
      color: #92400e;
    }
    
    .instructions strong {
      display: block;
      margin-bottom: 6px;
      font-size: 13px;
    }
    
    .instructions ol {
      margin-left: 18px;
      margin-top: 6px;
    }
    
    .instructions li {
      margin-bottom: 4px;
      line-height: 1.4;
    }
    
    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid #e5e7eb;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: 8px;
      vertical-align: middle;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .status {
      font-size: 12px;
      color: #6b7280;
      margin-top: 15px;
      padding: 10px;
      background: white;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    
    .info-badge {
      background: #dbeafe;
      color: #1e40af;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 11px;
      margin-bottom: 10px;
    }
    
    /* Modal Styles */
    .modal-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 10000;
      align-items: center;
      justify-content: center;
    }
    
    .modal-overlay.show {
      display: flex;
    }
    
    .modal {
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 420px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      position: relative;
    }
    
    .modal-title {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .modal-message {
      font-size: 14px;
      color: #4b5563;
      margin-bottom: 16px;
      line-height: 1.6;
    }
    
    .modal-current-value {
      background: #fffbeb;
      border: 2px solid #fbbf24;
      border-radius: 8px;
      padding: 12px;
      margin: 16px 0;
      font-size: 12px;
      color: #92400e;
      word-break: break-all;
      max-height: 120px;
      overflow-y: auto;
    }
    
    .modal-current-value strong {
      display: block;
      margin-bottom: 6px;
      font-size: 13px;
    }
    
    .modal-buttons {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 20px;
    }
    
    .btn-modal {
      padding: 10px 24px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 100px;
    }
    
    .btn-modal-cancel {
      background: #e5e7eb;
      color: #374151;
    }
    
    .btn-modal-cancel:hover {
      background: #d1d5db;
    }
    
    .btn-modal-confirm {
      background: #ef4444;
      color: white;
    }
    
    .btn-modal-confirm:hover {
      background: #dc2626;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
    }
  </style>
</head>
<body>
  <h2>🖼️ Upload Image</h2>
  <p class="subtitle">Add images to your website CMS</p>
  
  <div class="upload-zone" id="uploadZone">
    <div class="upload-icon">📁</div>
    <div class="upload-text">Click to select image</div>
    <div class="upload-hint">or drag and drop</div>
    <input type="file" id="fileInput" accept="image/*">
  </div>
  
  <div class="file-info" id="fileInfo">
    <div class="file-name" id="fileName"></div>
    <div class="file-size" id="fileSize"></div>
  </div>
  
  <div class="dropdown-section" id="dropdownSection">
    <div class="info-badge">📍 Select where to insert the URL</div>
    
    <label class="dropdown-label">Select Row:</label>
    <select id="rowSelect">
      <option value="">Loading rows...</option>
    </select>
    
    <label class="dropdown-label">Select Column:</label>
    <select id="columnSelect">
      <option value="">Loading columns...</option>
    </select>
    
    <div class="checkbox-group">
      <input type="checkbox" id="autoInsert" checked>
      <label for="autoInsert">Automatically insert URL after upload</label>
    </div>
  </div>
  
  <button class="btn btn-primary" id="uploadBtn" disabled>
    Upload to Drive
  </button>
  
  <div class="result" id="result"></div>
  
  <div class="instructions">
    <strong>📝 Quick Guide:</strong>
    <ol>
      <li>Select an image file</li>
      <li>Choose row and column from dropdowns</li>
      <li>Click "Upload to Drive"</li>
      <li>URL will be automatically inserted (if enabled)</li>
    </ol>
  </div>
  
  <div class="status" id="status">
    Loading sheet data...
  </div>
  
  <!-- Confirmation Modal -->
  <div class="modal-overlay" id="confirmModal">
    <div class="modal">
      <div class="modal-title">⚠️ Overwrite Existing Value?</div>
      <div class="modal-message">
        The selected cell <strong id="modalCell"></strong> already contains a value. 
        Do you want to overwrite it with the new image URL?
      </div>
      <div class="modal-current-value">
        <strong>Current value:</strong>
        <span id="modalCurrentValue"></span>
      </div>
      <div class="modal-buttons">
        <button class="btn-modal btn-modal-cancel" id="modalCancel">Cancel</button>
        <button class="btn-modal btn-modal-confirm" id="modalConfirm">Overwrite</button>
      </div>
    </div>
  </div>
  
  <script>
    let selectedFile = null;
    let sheetData = null;
    let pendingUploadData = null; // Store upload data when waiting for confirmation
    
    const fileInput = document.getElementById('fileInput');
    const uploadZone = document.getElementById('uploadZone');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const uploadBtn = document.getElementById('uploadBtn');
    const result = document.getElementById('result');
    const status = document.getElementById('status');
    const dropdownSection = document.getElementById('dropdownSection');
    const rowSelect = document.getElementById('rowSelect');
    const columnSelect = document.getElementById('columnSelect');
    const autoInsertCheckbox = document.getElementById('autoInsert');
    
    // Modal elements
    const confirmModal = document.getElementById('confirmModal');
    const modalCell = document.getElementById('modalCell');
    const modalCurrentValue = document.getElementById('modalCurrentValue');
    const modalCancel = document.getElementById('modalCancel');
    const modalConfirm = document.getElementById('modalConfirm');
    
    function setStatus(msg) {
      status.textContent = msg;
      console.log('Status:', msg);
    }
    
    function showConfirmModal(cell, currentValue) {
      modalCell.textContent = cell;
      modalCurrentValue.textContent = currentValue || '(empty)';
      confirmModal.classList.add('show');
    }
    
    function hideConfirmModal() {
      confirmModal.classList.remove('show');
      pendingUploadData = null;
    }
    
    // Modal event handlers
    modalCancel.addEventListener('click', () => {
      hideConfirmModal();
      uploadBtn.disabled = false;
      uploadBtn.textContent = 'Upload to Drive';
      setStatus('Upload cancelled');
      showResult('ℹ️ Upload cancelled. No changes made.', 'error');
    });
    
    modalConfirm.addEventListener('click', () => {
      hideConfirmModal();
      if (pendingUploadData) {
        // Proceed with upload using forceOverwrite flag
        performUpload(
          pendingUploadData.base64Data,
          pendingUploadData.fileName,
          pendingUploadData.mimeType,
          pendingUploadData.row,
          pendingUploadData.column,
          pendingUploadData.autoInsert,
          true // forceOverwrite = true
        );
      }
    });
    
    // Load sheet data on startup
    google.script.run
      .withSuccessHandler(handleSheetDataLoaded)
      .withFailureHandler(handleSheetDataError)
      .getSheetData();
    
    function handleSheetDataLoaded(data) {
      if (!data.success) {
        setStatus('Error: ' + data.error);
        showResult('❌ ' + data.error, 'error');
        return;
      }
      
      sheetData = data;
      setStatus('Sheet data loaded: ' + data.totalRows + ' rows found');
      
      // Populate row dropdown
      rowSelect.innerHTML = '<option value="">Select a row...</option>';
      data.rows.forEach(row => {
        const option = document.createElement('option');
        option.value = row.row;
        option.textContent = row.label;
        rowSelect.appendChild(option);
      });
      
      // Populate column dropdown
      columnSelect.innerHTML = '<option value="">Select a column...</option>';
      data.headers.forEach((header, index) => {
        if (header) {
          const option = document.createElement('option');
          option.value = index + 1; // 1-based column number
          option.textContent = header + ' (Column ' + getColumnLetter(index + 1) + ')';
          if (index + 1 === data.valueColumn) {
            option.selected = true; // Auto-select Value column
          }
          columnSelect.appendChild(option);
        }
      });
      
      setStatus('Ready - Select an image to begin');
    }
    
    function handleSheetDataError(error) {
      setStatus('Error loading sheet data');
      showResult('❌ Failed to load sheet data: ' + error.message, 'error');
    }
    
    function getColumnLetter(columnNumber) {
      let letter = '';
      while (columnNumber > 0) {
        const remainder = (columnNumber - 1) % 26;
        letter = String.fromCharCode(65 + remainder) + letter;
        columnNumber = Math.floor((columnNumber - 1) / 26);
      }
      return letter;
    }
    
    // Click to select
    uploadZone.addEventListener('click', () => {
      setStatus('Opening file picker...');
      fileInput.click();
    });
    
    // File selected
    fileInput.addEventListener('change', (e) => {
      setStatus('File input changed');
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    });
    
    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      setStatus('File dropped');
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    });
    
    function handleFile(file) {
      setStatus('Processing file: ' + file.name);
      
      if (!file.type.startsWith('image/')) {
        showResult('❌ Please select an image file (JPG, PNG, GIF, WebP)', 'error');
        setStatus('Error: Not an image file');
        return;
      }
      
      selectedFile = file;
      fileName.textContent = '📄 ' + file.name;
      fileSize.textContent = '💾 ' + (file.size / 1024).toFixed(2) + ' KB';
      
      fileInfo.classList.add('show');
      uploadZone.classList.add('has-file');
      dropdownSection.classList.add('show');
      uploadBtn.disabled = false;
      
      result.classList.remove('show');
      setStatus('File ready! Select row/column and click "Upload to Drive"');
    }
    
    uploadBtn.addEventListener('click', () => {
      if (!selectedFile) {
        showResult('❌ Please select a file first', 'error');
        return;
      }
      
      if (!rowSelect.value || !columnSelect.value) {
        showResult('❌ Please select both row and column', 'error');
        return;
      }
      
      const row = parseInt(rowSelect.value);
      const column = parseInt(columnSelect.value);
      const autoInsert = autoInsertCheckbox.checked;
      
      // If auto-insert is enabled, check cell value first
      if (autoInsert) {
        setStatus('Checking cell value...');
        uploadBtn.disabled = true;
        
        // Check if cell has existing value
        google.script.run
          .withSuccessHandler((checkResult) => {
            if (checkResult.success && checkResult.hasValue) {
              // Cell has value - show confirmation modal
              uploadBtn.disabled = false;
              showConfirmModal(checkResult.cell, checkResult.currentValue);
              
              // Read file and store data for later use
              const reader = new FileReader();
              reader.onload = (e) => {
                pendingUploadData = {
                  base64Data: e.target.result,
                  fileName: selectedFile.name,
                  mimeType: selectedFile.type,
                  row: row,
                  column: column,
                  autoInsert: autoInsert
                };
              };
              reader.onerror = () => {
                uploadBtn.disabled = false;
                setStatus('Error reading file');
                showResult('❌ Failed to read file', 'error');
              };
              reader.readAsDataURL(selectedFile);
            } else {
              // Cell is empty - proceed with upload
              proceedWithUpload(row, column, autoInsert, false);
            }
          })
          .withFailureHandler((error) => {
            uploadBtn.disabled = false;
            setStatus('Error checking cell value');
            showResult('❌ Failed to check cell: ' + (error.message || 'Unknown error'), 'error');
          })
          .checkCellValue(row, column);
      } else {
        // Auto-insert disabled - just upload
        proceedWithUpload(row, column, false, false);
      }
    });
    
    function proceedWithUpload(row, column, autoInsert, forceOverwrite) {
      uploadBtn.disabled = true;
      uploadBtn.textContent = 'Uploading...';
      setStatus('Uploading to Google Drive...');
      showResult('<span class="spinner"></span> Uploading image to Drive...', 'loading');
      
      const reader = new FileReader();
      
      reader.onerror = () => {
        showResult('❌ Failed to read file. Please try again.', 'error');
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload to Drive';
        setStatus('Error reading file');
      };
      
      reader.onload = (e) => {
        setStatus('File read, sending to server...');
        performUpload(e.target.result, selectedFile.name, selectedFile.type, 
                     row, column, autoInsert, forceOverwrite);
      };
      
      reader.readAsDataURL(selectedFile);
    }
    
    function performUpload(base64Data, fileName, mimeType, row, column, autoInsert, forceOverwrite) {
      uploadBtn.disabled = true;
      uploadBtn.textContent = 'Uploading...';
      setStatus('Uploading to Google Drive...');
      showResult('<span class="spinner"></span> Uploading image to Drive...', 'loading');
      
      google.script.run
        .withSuccessHandler(handleSuccess)
        .withFailureHandler(handleError)
        .uploadImage(base64Data, fileName, mimeType, row, column, autoInsert, forceOverwrite || false);
    }
    
    function handleSuccess(response) {
      uploadBtn.disabled = false;
      uploadBtn.textContent = 'Upload to Drive';
      
      if (response && response.success) {
        setStatus('✅ Upload successful!');
        
        let html = '<div style="margin-bottom: 10px;"><strong>✅ Upload Successful!</strong></div>';
        
        if (response.insertResult && response.insertResult.success) {
          let insertMsg = '✅ URL automatically inserted into ' + response.insertResult.cell;
          if (response.insertResult.overwritten) {
            insertMsg += ' (overwritten existing value)';
          }
          html += '<div style="background: #d1fae5; padding: 8px; border-radius: 4px; margin-bottom: 8px; font-size: 12px;">' +
            insertMsg + '</div>';
        } else if (response.insertResult && !response.insertResult.success) {
          // Insertion failed
          if (response.insertResult.hasExistingValue) {
            html += '<div style="background: #fee2e2; padding: 8px; border-radius: 4px; margin-bottom: 8px; font-size: 12px;">' +
              '⚠️ Upload successful, but URL was not inserted. Cell ' + response.insertResult.cell + 
              ' already contains a value.</div>';
          } else {
            html += '<div style="background: #fee2e2; padding: 8px; border-radius: 4px; margin-bottom: 8px; font-size: 12px;">' +
              '⚠️ Upload successful, but URL insertion failed: ' + (response.insertResult.error || 'Unknown error') + '</div>';
          }
        }
        
        if (response.warning) {
          html += '<div style="background: #fef3c7; padding: 6px; border-radius: 4px; margin-bottom: 8px; font-size: 11px;">' +
            '⚠️ ' + response.warning + '</div>';
        }
        
        html += '<div style="margin-bottom: 6px;"><strong>Image URL:</strong></div>' +
          '<div class="url-box">' + response.path + '</div>' +
          '<button class="btn-copy" onclick="copyUrl(\\''+response.path.replace(/'/g, "\\'")+'\\')">' +
          '📋 Copy URL</button>';
        
        showResult(html, 'success');
      } else {
        setStatus('❌ Upload failed');
        showResult('❌ Upload failed: ' + (response.error || 'Unknown error'), 'error');
      }
    }
    
    function handleError(error) {
      uploadBtn.disabled = false;
      uploadBtn.textContent = 'Upload to Drive';
      setStatus('❌ Upload error');
      
      let message = '❌ Upload failed. ';
      if (error && error.message) {
        message += error.message;
      } else {
        message += 'Check Drive folder configuration.';
      }
      
      showResult(message, 'error');
    }
    
    function showResult(html, type) {
      result.innerHTML = html;
      result.className = 'result show ' + type;
    }
    
    function copyUrl(url) {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        setStatus('✅ URL copied to clipboard!');
        alert('✅ URL copied!');
      } catch (err) {
        setStatus('❌ Copy failed');
        alert('❌ Copy failed. Please select and copy the URL manually.');
      }
      
      document.body.removeChild(textarea);
    }
    
    window.copyUrl = copyUrl;
  </script>
</body>
</html>
  `;
  
  const html = HtmlService.createHtmlOutput(htmlContent)
    .setTitle('📤 CMS Image Upload')
    .setWidth(450)
    .setHeight(700);
  
  SpreadsheetApp.getUi().showModalDialog(html, '📤 CMS Image Upload');
}

// ============================================
// UPLOAD FUNCTION (ENHANCED)
// ============================================
function uploadImage(base64Data, fileName, mimeType, row, column, autoInsert, forceOverwrite) {
  try {
    Logger.log('uploadImage called: ' + fileName + ', row: ' + row + ', column: ' + column + ', forceOverwrite: ' + (forceOverwrite || false));
    
    const base64Content = base64Data.split(',')[1];
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64Content),
      mimeType,
      fileName
    );
    
    Logger.log('Blob created, uploading to Drive...');
    const uploadResult = uploadToDrive(blob, fileName);
    
    // If upload successful and auto-insert is enabled, insert URL
    if (uploadResult.success && autoInsert && row && column) {
      Logger.log('Auto-inserting URL into row ' + row + ', column ' + column);
      const insertResult = insertUrlIntoSheet(row, column, uploadResult.path, forceOverwrite || false);
      uploadResult.insertResult = insertResult;
    }
    
    return uploadResult;
    
  } catch (error) {
    Logger.log('Error in uploadImage: ' + error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

function uploadToDrive(blob, fileName) {
  try {
    Logger.log('uploadToDrive: ' + fileName);
    
    if (!DRIVE_FOLDER_ID || DRIVE_FOLDER_ID === 'YOUR_DRIVE_FOLDER_ID_HERE') {
      return {
        success: false,
        error: 'Drive folder ID not configured in script'
      };
    }
    
    let folder;
    try {
      folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
      Logger.log('Folder accessed: ' + folder.getName());
    } catch (e) {
      Logger.log('Folder access error: ' + e.message);
      return {
        success: false,
        error: 'Cannot access Drive folder. Check: 1) Folder ID correct? 2) You have permission?'
      };
    }
    
    let file;
    try {
      file = folder.createFile(blob);
      Logger.log('File created: ' + file.getId());
    } catch (e) {
      Logger.log('File creation error: ' + e.message);
      return {
        success: false,
        error: 'Failed to create file: ' + e.message
      };
    }
    
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      Logger.log('Sharing set successfully');
    } catch (e) {
      Logger.log('Sharing warning: ' + e.message);
    }
    
    const fileId = file.getId();
    const directLink = 'https://drive.google.com/uc?export=download&id=' + fileId;
    
    Logger.log('Upload complete: ' + directLink);
    
    return {
      success: true,
      path: directLink,
      url: directLink,
      driveId: fileId,
      filename: fileName
    };
    
  } catch (error) {
    Logger.log('Unexpected error: ' + error.message);
    return {
      success: false,
      error: 'Unexpected error: ' + error.message
    };
  }
}

// ============================================
// HELPER: GENERATE IMAGE URLS SHEET
// ============================================
function generateImageUrlsSheet() {
  try {
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const files = folder.getFiles();
    const imageUrls = [];
    
    while (files.hasNext()) {
      const file = files.next();
      if (file.getMimeType().startsWith('image/')) {
        const fileId = file.getId();
        const directUrl = 'https://drive.google.com/uc?export=download&id=' + fileId;
        imageUrls.push([file.getName(), directUrl]);
      }
    }
    
    if (imageUrls.length === 0) {
      SpreadsheetApp.getUi().alert('No images found in folder');
      return;
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let urlSheet = ss.getSheetByName('Image URLs');
    
    if (!urlSheet) {
      urlSheet = ss.insertSheet('Image URLs');
    } else {
      urlSheet.clear();
    }
    
    urlSheet.getRange(1, 1, 1, 2).setValues([['Image Name', 'Direct URL']]);
    urlSheet.getRange(2, 1, imageUrls.length, 2).setValues(imageUrls);
    urlSheet.autoResizeColumns(1, 2);
    
    ss.setActiveSheet(urlSheet);
    
    SpreadsheetApp.getUi().alert(
      'Success! Created "Image URLs" sheet with ' + imageUrls.length + ' images.\n\n' +
      'Copy URLs from column B and paste into your CMS sheet.'
    );
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error: ' + error.message);
  }
}

// ============================================
// SETUP TYPE COLUMN VALIDATION (SILENT - AUTO RUN)
// ============================================
function setupTypeColumnValidationSilent() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CMS_SHEET_NAME);
    
    if (!sheet) {
      Logger.log('Sheet "' + CMS_SHEET_NAME + '" not found for validation setup');
      return;
    }
    
    // Type column is column A (column 1)
    const typeColumn = 1;
    const headerRow = 1;
    
    // Create validation rule with dropdown list
    const validationRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['image', 'text', 'html'], true)
      .setAllowInvalid(false)
      .setHelpText('Please select one of: image, text, or html')
      .build();
    
    // Apply validation to a large range (1000 rows) to cover future additions
    // Start from row 2 (skip header row 1)
    const maxRows = 1000;
    const startRow = headerRow + 1; // Start from row 2 (after header)
    
    const dataRange = sheet.getRange(startRow, typeColumn, maxRows, 1);
    dataRange.setDataValidation(validationRule);
    
    // Clear any existing validation from header row (row 1)
    const headerCell = sheet.getRange(headerRow, typeColumn);
    headerCell.setDataValidation(null);
    
    Logger.log('Type column validation applied silently (header row excluded)');
    
  } catch (error) {
    Logger.log('Error in setupTypeColumnValidationSilent: ' + error.message);
  }
}

// ============================================
// SETUP TYPE COLUMN VALIDATION (WITH ALERTS - MANUAL)
// ============================================
function setupTypeColumnValidation() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CMS_SHEET_NAME);
    
    if (!sheet) {
      SpreadsheetApp.getUi().alert('Error: Sheet "' + CMS_SHEET_NAME + '" not found');
      return;
    }
    
    // Type column is column A (column 1)
    const typeColumn = 1;
    const headerRow = 1;
    const lastRow = sheet.getLastRow();
    
    // Create validation rule with dropdown list
    const validationRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['image', 'text', 'html'], true)
      .setAllowInvalid(false)
      .setHelpText('Please select one of: image, text, or html')
      .build();
    
    // Apply validation to a large range (1000 rows) to cover future additions
    // This way users don't need to run this again when adding new rows
    const maxRows = 1000;
    const startRow = headerRow + 1; // Start from row 2 (after header)
    const numRows = maxRows;
    
    const dataRange = sheet.getRange(startRow, typeColumn, numRows, 1);
    dataRange.setDataValidation(validationRule);
    
    // Clear any existing validation from header row (row 1)
    const headerCell = sheet.getRange(headerRow, typeColumn);
    headerCell.setDataValidation(null);
    
    const currentDataRows = Math.max(0, lastRow - headerRow);
    
    SpreadsheetApp.getUi().alert(
      '✅ Success! Data validation applied to Type column.\n\n' +
      'Users can now only select: image, text, or html\n\n' +
      'Applied to ' + maxRows + ' rows (covers future additions).\n' +
      'Current data rows: ' + currentDataRows
    );
    
  } catch (error) {
    SpreadsheetApp.getUi().alert('Error setting up validation: ' + error.message);
    Logger.log('Error in setupTypeColumnValidation: ' + error.message);
  }
}

// ============================================
// HELP
// ============================================
function showHelp() {
  const helpText = 
    'CMS IMAGE UPLOADER (ENHANCED)\n\n' +
    'HOW TO USE:\n' +
    '1. Click "Upload Image" - sidebar opens\n' +
    '2. Select or drag an image file\n' +
    '3. Choose row and column from dropdowns\n' +
    '4. Check "Auto-insert" to automatically paste URL\n' +
    '5. Click "Upload to Drive"\n' +
    '6. URL will be inserted into selected cell\n\n' +
    'FEATURES:\n' +
    '• Dropdown shows all rows with Type & Selector\n' +
    '• Value column is auto-selected\n' +
    '• Automatic URL insertion after upload\n' +
    '• Manual copy option still available\n\n' +
    'Drive Folder: ' + DRIVE_FOLDER_ID;
  
  SpreadsheetApp.getUi().alert('CMS Help', helpText, SpreadsheetApp.getUi().ButtonSet.OK);
}

