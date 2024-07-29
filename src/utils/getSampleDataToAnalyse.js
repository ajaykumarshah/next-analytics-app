const XLSX = require("xlsx")
const  getSampleDataToAnalyse= (sheet=0)=>{
    const workbook = XLSX.readFile("./sampleExcel.xlsx");

    // Choose the first sheet in the Excel file
    const sheetName = workbook.SheetNames[sheet];
    const worksheet = workbook.Sheets[sheetName];
  
    // Convert the worksheet to an array of objects
    const rows = XLSX.utils.sheet_to_json(worksheet);
    return rows;
}

module.exports={getSampleDataToAnalyse}
