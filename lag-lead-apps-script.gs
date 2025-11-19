// Google Apps Script for Lag-Lead Dashboard Data Sync
// Replace the blank cell references (e.g., 'H6:S6') with your actual cell ranges

function doGet() {
  try {
    const spreadsheet = SpreadsheetApp.openById('1wUaJPq-aa-Oa6MkcEQJM0xhJmp4aUBReE53QKke_WbI');
    const sheet = spreadsheet.getSheetByName('EXECUTIVE SUMMARY DATA');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  
  // Helper function to check if a row should be formatted as percentage
  function isPercentageRow(rowNumber) {
    const columnD = sheet.getRange('D' + rowNumber).getValue();
    const columnT = sheet.getRange('T' + rowNumber).getValue();
    return columnD === 'PERCENTAGE' || columnT === 'PERCENTAGE';
  }
  
  // NET PROFIT DATA
  // TODO: Replace 'H6:S6' with your actual cell range for netProfitRow2025
  const netProfitRow2025 = sheet.getRange('H6:S6').getValues()[0];
  // TODO: Replace 'H15:S15' with your actual cell range for netProfitRow2024
  const netProfitRow2024 = sheet.getRange('H15:S15').getValues()[0];
  // TODO: Replace 'H10:S10' with your actual cell range for netProfitTargetRow
  const netProfitTargetRow = sheet.getRange('H10:S10').getValues()[0];
  
  // GROSS REVENUE DATA
  // TODO: Replace 'H7:S7' with your actual cell range for grossRevenueRow2025
  const grossRevenueRow2025 = sheet.getRange('H7:S7').getValues()[0];
  // TODO: Replace 'H16:S16' with your actual cell range for grossRevenueRow2024
  const grossRevenueRow2024 = sheet.getRange('H16:S16').getValues()[0];
  // TODO: Replace 'H11:S11' with your actual cell range for grossRevenueTargetRow
  const grossRevenueTargetRow = sheet.getRange('H11:S11').getValues()[0];
  
  // PARKING INCOME DATA
  // TODO: Replace 'H8:S8' with your actual cell range for parkingIncomeRow2025
  const parkingIncomeRow2025 = sheet.getRange('H8:S8').getValues()[0];
  // TODO: Replace 'H12:S12' with your actual cell range for parkingIncomeTargetRow
  const parkingIncomeTargetRow = sheet.getRange('H12:S12').getValues()[0];
  // TODO: Replace 'H17:S17' with your actual cell range for parkingIncomeRow2024
  const parkingIncomeRow2024 = sheet.getRange('H17:S17').getValues()[0];
  
  // COLLECTION DATA
  // TODO: Replace 'H20:S20' with your actual cell range for collectionPercentageRow
  const collectionPercentageRow = sheet.getRange('H20:S20').getValues()[0];
  // TODO: Replace 'H21:S21' with your actual cell range for collectionTotalReceivedRow
  const collectionTotalReceivedRow = sheet.getRange('H21:S21').getValues()[0];
  // TODO: Replace 'H22:S22' with your actual cell range for collectionTotalCollectedRow
  const collectionTotalCollectedRow = sheet.getRange('H22:S22').getValues()[0];
  
  // RENTAL INCOME DATA
  // TODO: Replace 'H25:S25' with your actual cell range for rentalIncomeRow2025
  const rentalIncomeRow2025 = sheet.getRange('H25:S25').getValues()[0];
  // TODO: Replace 'H27:S27' with your actual cell range for rentalIncomeTargetRow
  const rentalIncomeTargetRow = sheet.getRange('H27:S27').getValues()[0];
  // TODO: Replace 'H30:S30' with your actual cell range for rentalIncomeRow2024
  const rentalIncomeRow2024 = sheet.getRange('H30:S30').getValues()[0];
  
  // VENUE P-VALUE DATA
  // TODO: Replace 'H35:S35' with your actual cell range for venueRow2025
  const venueRow2025 = sheet.getRange('H35:S35').getValues()[0];
  // TODO: Replace 'H43:S43' with your actual cell range for venueTargetRow
  const venueTargetRow = sheet.getRange('H43:S43').getValues()[0];
  // TODO: Replace 'H48:S48' with your actual cell range for venueRow2024
  const venueRow2024 = sheet.getRange('H48:S48').getValues()[0];
  
  // STUDIO P-VALUE DATA
  // TODO: Replace 'H36:S36' with your actual cell range for studioRow2025
  const studioRow2025 = sheet.getRange('H36:S36').getValues()[0];
  // TODO: Replace 'H44:S44' with your actual cell range for studioTargetRow
  const studioTargetRow = sheet.getRange('H44:S44').getValues()[0];
  // TODO: Replace 'H49:S49' with your actual cell range for studioRow2024
  const studioRow2024 = sheet.getRange('H49:S49').getValues()[0];
  
  // SPORTS ARENA P-VALUE DATA
  // TODO: Replace 'H37:S37' with your actual cell range for sportsArenaRow2025
  const sportsArenaRow2025 = sheet.getRange('H37:S37').getValues()[0];
  // TODO: Replace 'H45:S45' with your actual cell range for sportsArenaTargetRow
  const sportsArenaTargetRow = sheet.getRange('H45:S45').getValues()[0];
  // TODO: Replace 'H50:S50' with your actual cell range for sportsArenaRow2024
  const sportsArenaRow2024 = sheet.getRange('H50:S50').getValues()[0];
  
  // TOTAL OPERATING EXPENSES DATA
  // TODO: Replace 'H55:S55' with your actual cell range for totalOperatingExpensesRow2025
  const totalOperatingExpensesRow2025 = sheet.getRange('H55:S55').getValues()[0];
  // TODO: Replace 'H57:S57' with your actual cell range for totalOperatingExpensesTargetRow
  const totalOperatingExpensesTargetRow = sheet.getRange('H57:S57').getValues()[0];
  // TODO: Replace 'H60:S60' with your actual cell range for totalOperatingExpensesRow2024
  const totalOperatingExpensesRow2024 = sheet.getRange('H60:S60').getValues()[0];
  
  // ELECTRICITY EXPENSE DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges (e.g., 'H65:S65' for 2025 data)
  const electricityExpenseRow2025 = sheet.getRange('H65:S65').getValues()[0];
  const electricityExpenseRow2024 = sheet.getRange('H76:S76').getValues()[0];
  const electricityExpenseTargetRow = sheet.getRange('H70:S70').getValues()[0];
  
  // WATER EXPENSE DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const waterExpenseRow2025 = sheet.getRange('H66:S66').getValues()[0];
  const waterExpenseRow2024 = sheet.getRange('H77:S77').getValues()[0];
  const waterExpenseTargetRow = sheet.getRange('H71:S71').getValues()[0];
  
  // SECURITY EXPENSE DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const securityExpenseRow2025 = sheet.getRange('H67:S67').getValues()[0];
  const securityExpenseRow2024 = sheet.getRange('H78:S78').getValues()[0];
  const securityExpenseTargetRow = sheet.getRange('H72:S72').getValues()[0];
  
  // AGENCY EXPENSE DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const agencyExpenseRow2025 = sheet.getRange('H68:S68').getValues()[0];
  const agencyExpenseRow2024 = sheet.getRange('H79:S79').getValues()[0];
  const agencyExpenseTargetRow = sheet.getRange('H73:S73').getValues()[0];
  
  // SALARY EXPENSE DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const salaryExpenseRow2025 = sheet.getRange('H82:S82').getValues()[0];
  const salaryExpenseRow2024 = sheet.getRange('H87:S87').getValues()[0];
  const salaryExpenseTargetRow = sheet.getRange('H84:S84').getValues()[0];
  
  // MARKETING EXPENSE DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const marketingExpenseRow2025 = sheet.getRange('H102:S102').getValues()[0];
  const marketingExpenseRow2024 = sheet.getRange('H107:S107').getValues()[0];
  const marketingExpenseTargetRow = sheet.getRange('H104:S104').getValues()[0];
  
  // MARKETING EXPENSE GATHERING DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const marketingExpenseGatheringRow2025 = sheet.getRange('H92:S92').getValues()[0];
  const marketingExpenseGatheringRow2024 = sheet.getRange('H97:S97').getValues()[0];
  const marketingExpenseGatheringTargetRow = sheet.getRange('H94:H94').getValues()[0];
  
  // REPAIRS & MAINTENANCE LABOR DATA (DC TEAM)
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const repairsMaintenanceLaborRow2025 = sheet.getRange('H112:S112').getValues()[0];
  const repairsMaintenanceLaborRow2024 = sheet.getRange('H120:S120').getValues()[0];
  const repairsMaintenanceLaborTargetRow = sheet.getRange('H116:S116').getValues()[0];
  
  // REPAIRS & MAINTENANCE MATERIALS DATA (DC TEAM)
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const repairsMaintenanceMaterialsRow2025 = sheet.getRange('H113:S113').getValues()[0];
  const repairsMaintenanceMaterialsRow2024 = sheet.getRange('H121:S121').getValues()[0];
  const repairsMaintenanceMaterialsTargetRow = sheet.getRange('H117:S117').getValues()[0];
  
  // REPAIRS & MAINTENANCE LABOR DATA (TECHNICAL TEAM)
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const repairsMaintenanceLaborTechnicalRow2025 = sheet.getRange('H125:S125').getValues()[0];
  const repairsMaintenanceLaborTechnicalRow2024 = sheet.getRange('H133:S133').getValues()[0];
  const repairsMaintenanceLaborTechnicalTargetRow = sheet.getRange('H129:S129').getValues()[0];
  
  // REPAIRS & MAINTENANCE MATERIALS DATA (TECHNICAL TEAM)
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const repairsMaintenanceMaterialsTechnicalRow2025 = sheet.getRange('H126:S126').getValues()[0];
  const repairsMaintenanceMaterialsTechnicalRow2024 = sheet.getRange('H134:S134').getValues()[0];
  const repairsMaintenanceMaterialsTechnicalTargetRow = sheet.getRange('H130:S130').getValues()[0];
  
  // OCCUPANCY RATE LEAD DATA (UNIT)
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const occupancyRateLeadRow2025 = sheet.getRange('H143:S143').getValues()[0];
  const occupancyRateLeadRow2024 = sheet.getRange('H153:S153').getValues()[0];
  const occupancyRateLeadTargetRow = sheet.getRange('H148:S148').getValues()[0];
  
  // OCCUPANCY RATE AREA LEAD DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const occupancyRateAreaLeadRow2025 = sheet.getRange('H144:S144').getValues()[0];
  const occupancyRateAreaLeadRow2024 = sheet.getRange('H154:S154').getValues()[0];
  const occupancyRateAreaLeadTargetRow = sheet.getRange('H149:S149').getValues()[0];
  
  // OCCUPANCY RATE P-VALUE LEAD DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const occupancyRatePValueLeadRow2025 = sheet.getRange('H145:S145').getValues()[0];
  const occupancyRatePValueLeadRow2024 = sheet.getRange('H155:S155').getValues()[0];
  const occupancyRatePValueLeadTargetRow = sheet.getRange('H150:S150').getValues()[0];
  
  // CLOSED INQUIRIES (P-VALUE) DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const closedInquiriesRow2025 = sheet.getRange('H159:S159').getValues()[0];
  const closedInquiriesRow2024 = sheet.getRange('H166:S166').getValues()[0];
  const closedInquiriesTargetRow = sheet.getRange('H173:S173').getValues()[0];
  
  // PULLOUT AVERSION (P-VALUE) DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const pulloutAversionRow2025 = sheet.getRange('H163:S163').getValues()[0];
  const pulloutAversionRow2024 = sheet.getRange('H170:S170').getValues()[0];
  const pulloutAversionTargetRow = sheet.getRange('H177:S177').getValues()[0];
  
  // LOTUS MALL FOOT TRAFFIC DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const lotusFootTrafficRow2025 = sheet.getRange('H182:S182').getValues()[0];
  const lotusFootTrafficRow2024 = sheet.getRange('H191:S191').getValues()[0];
  const lotusFootTrafficTargetRow = sheet.getRange('H199:S199').getValues()[0];
  
  // PORTAL MALL FOOT TRAFFIC DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const portalFootTrafficRow2025 = sheet.getRange('H183:S183').getValues()[0];
  const portalFootTrafficRow2024 = sheet.getRange('H192:S192').getValues()[0];
  const portalFootTrafficTargetRow = sheet.getRange('H200:S200').getValues()[0];
  
  // STADIUM SHOPPING STRIP FOOT TRAFFIC DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const stadiumFootTrafficRow2025 = sheet.getRange('H184:S184').getValues()[0];
  const stadiumFootTrafficRow2024 = sheet.getRange('H193:S193').getValues()[0];
  const stadiumFootTrafficTargetRow = sheet.getRange('H201:S201').getValues()[0];
  
  // YSPACIO CREATIVE PARK CARBAG FOOT TRAFFIC DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const yspacioFootTrafficRow2025 = sheet.getRange('H185:S185').getValues()[0];
  const yspacioFootTrafficRow2024 = sheet.getRange('H194:S194').getValues()[0];
  const yspacioFootTrafficTargetRow = sheet.getRange('H202:S202').getValues()[0];
  
  // YSPACIO CREATIVE PARK ALAPAN FOOT TRAFFIC DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const yspacioAlapanFootTrafficRow2025 = sheet.getRange('H186:S186').getValues()[0];
  const yspacioAlapanFootTrafficRow2024 = sheet.getRange('H195:S195').getValues()[0];
  const yspacioAlapanFootTrafficTargetRow = sheet.getRange('H203:S203').getValues()[0];
  
  // LUMINA FOOT TRAFFIC DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const luminaFootTrafficRow2025 = sheet.getRange('H187:S187').getValues()[0];
  const luminaFootTrafficRow2024 = sheet.getRange('H196:S196').getValues()[0];
  const luminaFootTrafficTargetRow = sheet.getRange('H204:S204').getValues()[0];
  
  // LOTUS MALL PAX PER EVENT DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const lotusPaxRow2025 = sheet.getRange('H207:S207').getValues()[0];
  const lotusPaxRow2024 = sheet.getRange('H219:S219').getValues()[0];
  const lotusPaxTargetRow = sheet.getRange('H214:S214').getValues()[0];
  
  // PORTAL MALL PAX PER EVENT DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const portalPaxRow2025 = sheet.getRange('H208:S208').getValues()[0];
  const portalPaxRow2024 = sheet.getRange('H220:S220').getValues()[0];
  const portalPaxTargetRow = sheet.getRange('H215:S215').getValues()[0];
  
  // STADIUM SHOPPING STRIP PAX PER EVENT DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const stadiumPaxRow2025 = sheet.getRange('H209:S209').getValues()[0];
  const stadiumPaxRow2024 = sheet.getRange('H221:S221').getValues()[0];
  const stadiumPaxTargetRow = sheet.getRange('H214:S214').getValues()[0];
  
  // OFFLINE INQUIRIES (CONVERSION) DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const offlineInquiriesRow2025 = sheet.getRange('H211:S211').getValues()[0];
  const offlineInquiriesRow2024 = sheet.getRange('H211:S211').getValues()[0];
  const offlineInquiriesTargetRow = sheet.getRange('H215:S215').getValues()[0];
  
  // FB PAGE FOLLOWERS DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const fbFollowersRow2025 = sheet.getRange('A1:L1').getValues()[0];
  const fbFollowersRow2024 = sheet.getRange('A1:L1').getValues()[0];
  const fbFollowersTargetRow = sheet.getRange('A1:L1').getValues()[0];
  
  // I.C.A.R.E. (ALL TEAMS) DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const icareRow2025 = sheet.getRange('A1:L1').getValues()[0];
  const icareRow2024 = sheet.getRange('A1:L1').getValues()[0];
  const icareTargetRow = sheet.getRange('A1:L1').getValues()[0];
  
  // SITE QUALITY MONITORING DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const siteQualityRow2025 = sheet.getRange('A1:L1').getValues()[0];
  const siteQualityRow2024 = sheet.getRange('A1:L1').getValues()[0];
  const siteQualityTargetRow = sheet.getRange('A1:L1').getValues()[0];
  
  // INSURANCE CLAIM MONITORING DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const insuranceClaimRow2025 = sheet.getRange('A1:L1').getValues()[0];
  const insuranceClaimRow2024 = sheet.getRange('A1:L1').getValues()[0];
  const insuranceClaimTargetRow = sheet.getRange('A1:L1').getValues()[0];
  
  // REGULAR EVENTS PLAN DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const regularEventsRow2025 = sheet.getRange('A1:L1').getValues()[0];
  const regularEventsRow2024 = sheet.getRange('A1:L1').getValues()[0];
  const regularEventsTargetRow = sheet.getRange('A1:L1').getValues()[0];
  
  // CULTURE DEVELOPMENT ACTIVITIES PLAN DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const cultureDevRow2025 = sheet.getRange('A1:L1').getValues()[0];
  const cultureDevRow2024 = sheet.getRange('A1:L1').getValues()[0];
  const cultureDevTargetRow = sheet.getRange('A1:L1').getValues()[0];
  
  // SMD PROJECTS DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const smdProjectsRow2025 = sheet.getRange('A1:L1').getValues()[0];
  const smdProjectsRow2024 = sheet.getRange('A1:L1').getValues()[0];
  const smdProjectsTargetRow = sheet.getRange('A1:L1').getValues()[0];
  
  // BUDGET: PROJECTS (E&D) DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const budgetProjectsRow2025 = sheet.getRange('A1:L1').getValues()[0];
  const budgetProjectsRow2024 = sheet.getRange('A1:L1').getValues()[0];
  const budgetProjectsTargetRow = sheet.getRange('A1:L1').getValues()[0];
  
  // TEAM/SECTION'S TARGETS DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const teamTargetsRow2025 = sheet.getRange('A1:L1').getValues()[0];
  const teamTargetsRow2024 = sheet.getRange('A1:L1').getValues()[0];
  const teamTargetsTargetRow = sheet.getRange('A1:L1').getValues()[0];
  
  // NUMBER OF BREAKDOWNS DATA
  // TODO: Replace 'A1:L1' with your actual cell ranges
  const breakdownsRow2025 = sheet.getRange('A1:L1').getValues()[0];
  const breakdownsRow2024 = sheet.getRange('A1:L1').getValues()[0];
  const breakdownsTargetRow = sheet.getRange('A1:L1').getValues()[0];
  
  // Transform data into chart-ready format
  const netProfit2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(netProfitRow2025[idx]) || 0,
    isPercentage: isPercentageRow(6)
  }));
  
  const netProfit2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(netProfitRow2024[idx]) || 0,
    isPercentage: isPercentageRow(15)
  }));
  
  const netProfitTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(netProfitTargetRow[idx]) || 0,
    isPercentage: isPercentageRow(10)
  }));
  
  const grossRevenue2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(grossRevenueRow2025[idx]) || 0,
    isPercentage: isPercentageRow(7)
  }));
  
  const grossRevenue2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(grossRevenueRow2024[idx]) || 0,
    isPercentage: isPercentageRow(16)
  }));
  
  const grossRevenueTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(grossRevenueTargetRow[idx]) || 0,
    isPercentage: isPercentageRow(11)
  }));
  
  const parkingIncome2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(parkingIncomeRow2025[idx]) || 0,
    isPercentage: isPercentageRow(8)
  }));
  
  const parkingIncomeTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(parkingIncomeTargetRow[idx]) || 0,
    isPercentage: isPercentageRow(12)
  }));
  
  const parkingIncome2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(parkingIncomeRow2024[idx]) || 0,
    isPercentage: isPercentageRow(17)
  }));
  
  const collectionPercentage = months.map((label, idx) => ({ 
    label, 
    value: Number(collectionPercentageRow[idx]) || 0,
    isPercentage: isPercentageRow(20)
  }));
  
  const collectionTotalReceived = months.map((label, idx) => ({ 
    label, 
    value: Number(collectionTotalReceivedRow[idx]) || 0,
    isPercentage: isPercentageRow(21)
  }));
  
  const collectionTotalCollected = months.map((label, idx) => ({ 
    label, 
    value: Number(collectionTotalCollectedRow[idx]) || 0,
    isPercentage: isPercentageRow(22)
  }));
  
  const rentalIncome2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(rentalIncomeRow2025[idx]) || 0,
    isPercentage: isPercentageRow(25)
  }));
  
  const rentalIncomeTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(rentalIncomeTargetRow[idx]) || 0,
    isPercentage: isPercentageRow(27)
  }));
  
  const rentalIncome2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(rentalIncomeRow2024[idx]) || 0,
    isPercentage: isPercentageRow(30)
  }));
  
  const venuePvalue2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(venueRow2025[idx]) || 0,
    isPercentage: isPercentageRow(35)
  }));
  
  const venuePvalueTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(venueTargetRow[idx]) || 0,
    isPercentage: isPercentageRow(43)
  }));
  
  const venuePvalue2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(venueRow2024[idx]) || 0,
    isPercentage: isPercentageRow(48)
  }));
  
  const studioPvalue2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(studioRow2025[idx]) || 0,
    isPercentage: isPercentageRow(36)
  }));
  
  const studioPvalueTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(studioTargetRow[idx]) || 0,
    isPercentage: isPercentageRow(44)
  }));
  
  const studioPvalue2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(studioRow2024[idx]) || 0,
    isPercentage: isPercentageRow(49)
  }));
  
  const sportsArenaPvalue2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(sportsArenaRow2025[idx]) || 0,
    isPercentage: isPercentageRow(37)
  }));
  
  const sportsArenaPvalueTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(sportsArenaTargetRow[idx]) || 0,
    isPercentage: isPercentageRow(45)
  }));
  
  const sportsArenaPvalue2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(sportsArenaRow2024[idx]) || 0,
    isPercentage: isPercentageRow(50)
  }));
  
  const totalOperatingExpenses2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(totalOperatingExpensesRow2025[idx]) || 0,
    isPercentage: isPercentageRow(55)
  }));
  
  const totalOperatingExpensesTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(totalOperatingExpensesTargetRow[idx]) || 0,
    isPercentage: isPercentageRow(57)
  }));
  
  const totalOperatingExpenses2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(totalOperatingExpensesRow2024[idx]) || 0,
    isPercentage: isPercentageRow(60)
  }));
  
  // ELECTRICITY EXPENSE TRANSFORMATIONS
  const electricityExpense2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(electricityExpenseRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const electricityExpense2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(electricityExpenseRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const electricityExpenseTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(electricityExpenseTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // WATER EXPENSE TRANSFORMATIONS
  const waterExpense2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(waterExpenseRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const waterExpense2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(waterExpenseRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const waterExpenseTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(waterExpenseTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // SECURITY EXPENSE TRANSFORMATIONS
  const securityExpense2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(securityExpenseRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const securityExpense2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(securityExpenseRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const securityExpenseTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(securityExpenseTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // AGENCY EXPENSE TRANSFORMATIONS
  const agencyExpense2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(agencyExpenseRow2025[idx]) || 0,
    isPercentage: false
  }));

  // AGENCY EXPENSE TRANSFORMATIONS
  const agencyExpense2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(agencyExpenseRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const agencyExpenseTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(agencyExpenseTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // SALARY EXPENSE TRANSFORMATIONS
  const salaryExpense2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(salaryExpenseRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const salaryExpense2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(salaryExpenseRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const salaryExpenseTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(salaryExpenseTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // MARKETING EXPENSE TRANSFORMATIONS
  const marketingExpense2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(marketingExpenseRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const marketingExpense2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(marketingExpenseRow2024[idx]) || 0,
    isPercentage: false
  }));

  const marketingExpenseTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(marketingExpenseTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // MARKETING EXPENSE GATHERING TRANSFORMATIONS
  const marketingExpenseGathering2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(marketingExpenseGatheringRow2025[idx]) || 0,
    isPercentage: false
  }));

  const marketingExpenseGathering2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(marketingExpenseGatheringRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const marketingExpenseGatheringTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(marketingExpenseGatheringTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // REPAIRS & MAINTENANCE LABOR TRANSFORMATIONS (DC TEAM)
  const repairsMaintenanceLabor2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(repairsMaintenanceLaborRow2025[idx]) || 0,
    isPercentage: false
  }));

  const repairsMaintenanceLabor2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(repairsMaintenanceLaborRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const repairsMaintenanceLaborTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(repairsMaintenanceLaborTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // REPAIRS & MAINTENANCE MATERIALS TRANSFORMATIONS (DC TEAM)
  const repairsMaintenanceMaterials2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(repairsMaintenanceMaterialsRow2025[idx]) || 0,
    isPercentage: false
  }));

  const repairsMaintenanceMaterials2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(repairsMaintenanceMaterialsRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const repairsMaintenanceMaterialsTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(repairsMaintenanceMaterialsTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // REPAIRS & MAINTENANCE LABOR TRANSFORMATIONS (TECHNICAL TEAM)
  const repairsMaintenanceLaborTechnical2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(repairsMaintenanceLaborTechnicalRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const repairsMaintenanceLaborTechnical2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(repairsMaintenanceLaborTechnicalRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const repairsMaintenanceLaborTechnicalTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(repairsMaintenanceLaborTechnicalTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // REPAIRS & MAINTENANCE MATERIALS TRANSFORMATIONS (TECHNICAL TEAM)
  const repairsMaintenanceMaterialsTechnical2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(repairsMaintenanceMaterialsTechnicalRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const repairsMaintenanceMaterialsTechnical2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(repairsMaintenanceMaterialsTechnicalRow2024[idx]) || 0,
    isPercentage: false
  }));

  const repairsMaintenanceMaterialsTechnicalTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(repairsMaintenanceMaterialsTechnicalTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // OCCUPANCY RATE LAG TRANSFORMATIONS
  const occupancyRateLag2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(occupancyRateLagRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const occupancyRateLag2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(occupancyRateLagRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const occupancyRateLagTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(occupancyRateLagTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // OCCUPANCY RATE LEAD TRANSFORMATIONS (UNIT)
  const occupancyRateLead2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(occupancyRateLeadRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const occupancyRateLead2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(occupancyRateLeadRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const occupancyRateLeadTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(occupancyRateLeadTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // OCCUPANCY RATE AREA LEAD TRANSFORMATIONS
  const occupancyRateAreaLead2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(occupancyRateAreaLeadRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const occupancyRateAreaLead2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(occupancyRateAreaLeadRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const occupancyRateAreaLeadTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(occupancyRateAreaLeadTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // OCCUPANCY RATE P-VALUE LEAD TRANSFORMATIONS
  const occupancyRatePValueLead2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(occupancyRatePValueLeadRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const occupancyRatePValueLead2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(occupancyRatePValueLeadRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const occupancyRatePValueLeadTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(occupancyRatePValueLeadTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // CLOSED INQUIRIES (P-VALUE) TRANSFORMATIONS
  const closedInquiries2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(closedInquiriesRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const closedInquiries2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(closedInquiriesRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const closedInquiriesTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(closedInquiriesTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // PULLOUT AVERSION (P-VALUE) TRANSFORMATIONS
  const pulloutAversion2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(pulloutAversionRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const pulloutAversion2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(pulloutAversionRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const pulloutAversionTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(pulloutAversionTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // LOTUS MALL FOOT TRAFFIC TRANSFORMATIONS
  const lotusFootTraffic2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(lotusFootTrafficRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const lotusFootTraffic2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(lotusFootTrafficRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const lotusFootTrafficTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(lotusFootTrafficTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // PORTAL MALL FOOT TRAFFIC TRANSFORMATIONS
  const portalFootTraffic2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(portalFootTrafficRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const portalFootTraffic2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(portalFootTrafficRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const portalFootTrafficTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(portalFootTrafficTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // STADIUM SHOPPING STRIP FOOT TRAFFIC TRANSFORMATIONS
  const stadiumFootTraffic2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(stadiumFootTrafficRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const stadiumFootTraffic2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(stadiumFootTrafficRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const stadiumFootTrafficTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(stadiumFootTrafficTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // YSPACIO CREATIVE PARK CARBAG FOOT TRAFFIC TRANSFORMATIONS
  const yspacioFootTraffic2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(yspacioFootTrafficRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const yspacioFootTraffic2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(yspacioFootTrafficRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const yspacioFootTrafficTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(yspacioFootTrafficTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // YSPACIO CREATIVE PARK ALAPAN FOOT TRAFFIC TRANSFORMATIONS
  const yspacioAlapanFootTraffic2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(yspacioAlapanFootTrafficRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const yspacioAlapanFootTraffic2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(yspacioAlapanFootTrafficRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const yspacioAlapanFootTrafficTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(yspacioAlapanFootTrafficTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // LUMINA FOOT TRAFFIC TRANSFORMATIONS
  const luminaFootTraffic2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(luminaFootTrafficRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const luminaFootTraffic2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(luminaFootTrafficRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const luminaFootTrafficTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(luminaFootTrafficTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // LOTUS MALL PAX PER EVENT TRANSFORMATIONS
  const lotusPax2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(lotusPaxRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const lotusPax2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(lotusPaxRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const lotusPaxTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(lotusPaxTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // PORTAL MALL PAX PER EVENT TRANSFORMATIONS
  const portalPax2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(portalPaxRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const portalPax2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(portalPaxRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const portalPaxTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(portalPaxTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // STADIUM SHOPPING STRIP PAX PER EVENT TRANSFORMATIONS
  const stadiumPax2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(stadiumPaxRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const stadiumPax2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(stadiumPaxRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const stadiumPaxTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(stadiumPaxTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // OFFLINE INQUIRIES (CONVERSION) TRANSFORMATIONS
  const offlineInquiries2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(offlineInquiriesRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const offlineInquiries2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(offlineInquiriesRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const offlineInquiriesTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(offlineInquiriesTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // FB PAGE FOLLOWERS TRANSFORMATIONS
  const fbFollowers2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(fbFollowersRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const fbFollowers2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(fbFollowersRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const fbFollowersTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(fbFollowersTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // I.C.A.R.E. (ALL TEAMS) TRANSFORMATIONS
  const icare2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(icareRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const icare2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(icareRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const icareTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(icareTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // SITE QUALITY MONITORING TRANSFORMATIONS
  const siteQuality2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(siteQualityRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const siteQuality2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(siteQualityRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const siteQualityTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(siteQualityTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // INSURANCE CLAIM MONITORING TRANSFORMATIONS
  const insuranceClaim2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(insuranceClaimRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const insuranceClaim2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(insuranceClaimRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const insuranceClaimTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(insuranceClaimTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // REGULAR EVENTS PLAN TRANSFORMATIONS
  const regularEvents2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(regularEventsRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const regularEvents2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(regularEventsRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const regularEventsTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(regularEventsTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // CULTURE DEVELOPMENT ACTIVITIES PLAN TRANSFORMATIONS
  const cultureDev2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(cultureDevRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const cultureDev2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(cultureDevRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const cultureDevTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(cultureDevTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // SMD PROJECTS TRANSFORMATIONS
  const smdProjects2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(smdProjectsRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const smdProjects2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(smdProjectsRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const smdProjectsTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(smdProjectsTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // BUDGET: PROJECTS (E&D) TRANSFORMATIONS
  const budgetProjects2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(budgetProjectsRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const budgetProjects2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(budgetProjectsRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const budgetProjectsTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(budgetProjectsTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // TEAM/SECTION'S TARGETS TRANSFORMATIONS
  const teamTargets2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(teamTargetsRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const teamTargets2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(teamTargetsRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const teamTargetsTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(teamTargetsTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // NUMBER OF BREAKDOWNS TRANSFORMATIONS
  const breakdowns2025 = months.map((label, idx) => ({ 
    label, 
    value: Number(breakdownsRow2025[idx]) || 0,
    isPercentage: false
  }));
  
  const breakdowns2024 = months.map((label, idx) => ({ 
    label, 
    value: Number(breakdownsRow2024[idx]) || 0,
    isPercentage: false
  }));
  
  const breakdownsTarget = months.map((label, idx) => ({ 
    label, 
    value: Number(breakdownsTargetRow[idx]) || 0,
    isPercentage: false
  }));
  
  // Build response object
  const response = {
    netProfit2025,
    netProfit2024,
    netProfitTarget,
    grossRevenue2025,
    grossRevenue2024,
    grossRevenueTarget,
    parkingIncome2025,
    parkingIncomeTarget,
    parkingIncome2024,
    collectionPercentage,
    collectionTotalReceived,
    collectionTotalCollected,
    rentalIncome2025,
    rentalIncomeTarget,
    rentalIncome2024,
    venuePvalue2025,
    venuePvalueTarget,
    venuePvalue2024,
    studioPvalue2025,
    studioPvalueTarget,
    studioPvalue2024,
    sportsArenaPvalue2025,
    sportsArenaPvalueTarget,
    sportsArenaPvalue2024,
    totalOperatingExpenses2025,
    totalOperatingExpensesTarget,
    totalOperatingExpenses2024,
    electricityExpense2025,
    electricityExpense2024,
    electricityExpenseTarget,
    waterExpense2025,
    waterExpense2024,
    waterExpenseTarget,
    securityExpense2025,
    securityExpense2024,
    securityExpenseTarget,
    agencyExpense2025,
    agencyExpense2024,
    agencyExpenseTarget,
    salaryExpense2025,
    salaryExpense2024,
    salaryExpenseTarget,
    marketingExpense2025,
    marketingExpense2024,
    marketingExpenseTarget,
    marketingExpenseGathering2025,
    marketingExpenseGathering2024,
    marketingExpenseGatheringTarget,
    repairsMaintenanceLabor2025,
    repairsMaintenanceLabor2024,
    repairsMaintenanceLaborTarget,
    repairsMaintenanceMaterials2025,
    repairsMaintenanceMaterials2024,
    repairsMaintenanceMaterialsTarget,
    repairsMaintenanceLaborTechnical2025,
    repairsMaintenanceLaborTechnical2024,
    repairsMaintenanceLaborTechnicalTarget,
    repairsMaintenanceMaterialsTechnical2025,
    repairsMaintenanceMaterialsTechnical2024,
    repairsMaintenanceMaterialsTechnicalTarget,
    occupancyRateLead2025,
    occupancyRateLead2024,
    occupancyRateLeadTarget,
    occupancyRateAreaLead2025,
    occupancyRateAreaLead2024,
    occupancyRateAreaLeadTarget,
    occupancyRatePValueLead2025,
    occupancyRatePValueLead2024,
    occupancyRatePValueLeadTarget,
    closedInquiries2025,
    closedInquiries2024,
    closedInquiriesTarget,
    pulloutAversion2025,
    pulloutAversion2024,
    pulloutAversionTarget,
    lotusFootTraffic2025,
    lotusFootTraffic2024,
    lotusFootTrafficTarget,
    portalFootTraffic2025,
    portalFootTraffic2024,
    portalFootTrafficTarget,
    stadiumFootTraffic2025,
    stadiumFootTraffic2024,
    stadiumFootTrafficTarget,
    yspacioFootTraffic2025,
    yspacioFootTraffic2024,
    yspacioFootTrafficTarget,
    yspacioAlapanFootTraffic2025,
    yspacioAlapanFootTraffic2024,
    yspacioAlapanFootTrafficTarget,
    luminaFootTraffic2025,
    luminaFootTraffic2024,
    luminaFootTrafficTarget,
    lotusPax2025,
    lotusPax2024,
    lotusPaxTarget,
    portalPax2025,
    portalPax2024,
    portalPaxTarget,
    stadiumPax2025,
    stadiumPax2024,
    stadiumPaxTarget,
    offlineInquiries2025,
    offlineInquiries2024,
    offlineInquiriesTarget,
    fbFollowers2025,
    fbFollowers2024,
    fbFollowersTarget,
    icare2025,
    icare2024,
    icareTarget,
    siteQuality2025,
    siteQuality2024,
    siteQualityTarget,
    insuranceClaim2025,
    insuranceClaim2024,
    insuranceClaimTarget,
    regularEvents2025,
    regularEvents2024,
    regularEventsTarget,
    cultureDev2025,
    cultureDev2024,
    cultureDevTarget,
    smdProjects2025,
    smdProjects2024,
    smdProjectsTarget,
    budgetProjects2025,
    budgetProjects2024,
    budgetProjectsTarget,
    teamTargets2025,
    teamTargets2024,
    teamTargetsTarget,
    breakdowns2025,
    breakdowns2024,
    breakdownsTarget
  };
  
  return ContentService.createTextOutput(
      JSON.stringify(response)
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ 
        error: error.toString(),
        stack: error.stack 
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
