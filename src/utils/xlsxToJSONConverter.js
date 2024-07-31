const XLSX = require('xlsx');
const reader = new FileReader();
const validator = require('validator');

export const xlsxToJSONConverter = ({ file, callback, checkedSheet = "", checkedColumns = [] }) => {
    try {
        reader.onload = e => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const jsonData = [];

            const worksheet = workbook.Sheets[checkedSheet];
            const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const headers = sheetData[0].map(col => checkedColumns.includes(col) ? col : "unselectedCol");

            for (let i = 1; i < sheetData.length; i++) {
                const row = sheetData[i];
                const rowData = {};
                for (let j = 0; j < headers.length; j++) {
                    if (headers[j] !== "unselectedCol") {
                        const cellAddress = XLSX.utils.encode_cell({ r: i, c: j });
                        const cell = worksheet[cellAddress];
                        const cellType = cell ? cell.t : null;

                        if (cellType === 'n' && (cell.z || cell.w) && !validator.isNumeric(cell.w)) {
                            // It's a date
                            const dateValue = XLSX.SSF.parse_date_code(cell.v);
                            if (dateValue) {
                                const formattedDate = new Date(Date.UTC(dateValue.y, dateValue.m - 1, dateValue.d));
                                rowData[headers[j]] = formattedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                            } else {
                                rowData[headers[j]] = cell.v;
                            }
                        } else if (typeof row[j] === 'number' || validator.isNumeric(row[j]?.toString() || "")) {
                            rowData[headers[j]] = row[j];
                        } else {
                            rowData[headers[j]] = row[j] || "";
                        }
                    }
                }
                Object.keys(rowData).length && jsonData.push(rowData);
            }

            callback(jsonData);
        };

    } catch (err) {
        alert(err);
    }

    reader.readAsArrayBuffer(file);
};
