
const XLSX = require('xlsx');
const reader = new FileReader();
const validator = require('validator');

export const xlsxToJSONConverter = async ({ file, callback, checkedSheet = "", checkedColumns = [] }) => {
    try {


        reader.onload = e => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const jsonData = [];

            const worksheet = workbook.Sheets[checkedSheet];
            const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const columnWithStasticsDetails = { max: {}, min: {}, avg: {}, med: {}, medColArr: {}, maxOccured: {}, minOccured: {} }
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
                        } else if (typeof row[j] === 'number' || validator.isNumeric(row[j]?.toString() || "abc")) {
                            columnWithStasticsDetails.max[headers[j]] = Math.max(columnWithStasticsDetails.max[headers[j]] || 0, row[j] - 0)
                            columnWithStasticsDetails.min[headers[j]] = Math.min(columnWithStasticsDetails.min[headers[j]] || 0, row[j] - 0)

                            //  below is for the maxOccured case  **********


                            // *******************************************
                            //  to get the valuse of avg , med we have to store the columns values if form of array so that we can 
                            // perform med and avg opertaion, for that we are going to store in medColArr where ae can store the
                            //  values in col:[1,42,] in this format 
                            columnWithStasticsDetails.medColArr[headers[j]] = [...(columnWithStasticsDetails.medColArr[headers[j]] || []), row[j] - 0]


                            //  belwo is the to store in json so that we can return json from this fun.
                            rowData[headers[j]] = row[j] - 0;
                        } else {
                            rowData[headers[j]] = row[j] || "";
                        }
                        const keyValueInMaxOccured = columnWithStasticsDetails.maxOccured[headers[j]]?.[row[j]]
                        if (keyValueInMaxOccured) {
                            // if the value is already present then the increase the counting of the key ocuurance

                            columnWithStasticsDetails.maxOccured[headers[j]][row[j]] = keyValueInMaxOccured + 1

                        }
                        else {
                            if (columnWithStasticsDetails.maxOccured[headers[j]]) {

                                columnWithStasticsDetails.maxOccured[headers[j]] = { ...columnWithStasticsDetails.maxOccured[headers[j]], [row[j]]: 1 }
                            }
                            else {
                                columnWithStasticsDetails.maxOccured = { ...columnWithStasticsDetails.maxOccured, [headers[j]]: {} }
                                columnWithStasticsDetails.maxOccured[headers[j]][row[j]] = 1

                            }
                        }
                    }
                }
                Object.keys(rowData).length && jsonData.push(rowData);
            }
            const {maxOccured:maxOccuredWithCounts,minOccured:minOccuredWithCounts}={...columnWithStasticsDetails}
            
            getmedColArrDependentData(columnWithStasticsDetails, ["avg", "med"])
            getModifiedColumnWithStasticsDetailsForMaxOcAndMinOc(columnWithStasticsDetails)
            
            callback({ jsonData, columnWithStasticsDetails:{...columnWithStasticsDetails,maxOccuredWithCounts,minOccuredWithCounts} });
        };

    } catch (err) {
        alert(err);
    }

    reader.readAsArrayBuffer(file);
};



const getmedColArrDependentData = (columnWithStasticsDetails, arrToAddThisFieldsInObj = []) => {

    const functionObj = { avg: getAverage, med: getMedian, }

    for (const field of arrToAddThisFieldsInObj) {

        for (const [keyCol, colValArr] of Object.entries(columnWithStasticsDetails.medColArr)) {

            columnWithStasticsDetails[field][keyCol] = functionObj[field](colValArr)
        }

    }

    function getAverage(arr = []) {

        return parseFloat(((arr.reduce((sum, itr) => sum + itr, 0)) / arr.length).toFixed(2))
    }


    function getMedian(arr = []) {
        arr.sort()
        const arrLength = arr.length
        if ((arrLength) % 2 == 0) {
            return parseFloat((arr[(arrLength / 2) - 1] + arr[(arrLength) / 2]).toFixed(2)) / 2
        }
        return parseFloat((arr[Math.floor(arrLength / 2)]).toFixed(2))
    }

}



const getModifiedColumnWithStasticsDetailsForMaxOcAndMinOc = (columnWithStasticsDetails) => {



    for (const [col, obj] of Object.entries(columnWithStasticsDetails.maxOccured)) {

        const minAndMaxOccuredObj = getMaxAndMinOccuredElem(obj)
        columnWithStasticsDetails.maxOccured[col] = minAndMaxOccuredObj.maxOccuredKey
        columnWithStasticsDetails.minOccured[col] = minAndMaxOccuredObj.minOccuredKey
    }

}


const getMaxAndMinOccuredElem = (obj = {}) => {


    const tempObj = { maxOccuredKey: null, minOccuredKey: null }
    const valuesInObj = Object.values(obj)
    let maxCount = valuesInObj[0]
    let minCount = valuesInObj[0]

    for (const [key, val] of Object.entries(obj)) {

        if (val && val >= maxCount && key) {
            maxCount = val
            tempObj["maxOccuredKey"] = key
        }
        if (val && val <= minCount && key) {
            minCount = val
            tempObj["minOccuredKey"] = key
        }
    }
    return tempObj
}

























