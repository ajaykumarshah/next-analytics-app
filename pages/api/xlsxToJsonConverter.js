
import validator from "validator";
import XLSX from "xlsx"
import formidable from "formidable";
import fs from "fs"

// pages/api/heavy-task.js

export const config = {
    api: {
        bodyParser: false,
    },
};
export default async function handler(req, res) {
    try {
        console.log('Request method:', req.method);  // Log the request method
        if (req.method === 'POST') {
            const form = formidable({});
           
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    res.status(500).json({ error: 'Error parsing the file' });
                    return;
                }
                const uploadedFile = files.file[0];  // Access the first file in the array
                const filePath = uploadedFile.filepath;  // Path to the uploaded file
                let {checkedSheet,checkedColumns}=fields
                checkedSheet=checkedSheet[0]
                checkedColumns=JSON.parse(checkedColumns)
                // Read the file using fs
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error reading the file');
                        return;
                    }
                    console.log(res,"this is res");
                    res.socket?.server?.io?.emit('message111', "from socket first message");
                    const obj = xlsxToJSONConverter({ data,checkedColumns,checkedSheet })

                    
                    res.status(200).json({ success: true, data: obj });
                    
                })
            })

            setTimeout(() => {
                res.status(200).json({ success: true, data: {name:"aja"} });
                
            }, 1000);
        } else {
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).end("rgfberb");
    }
}

const xlsxToJSONConverter = ({ data, checkedColumns, checkedSheet }) => {
    try {
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
        const maxOccuredWithCounts = { ...columnWithStasticsDetails.maxOccured }
        const minOccuredWithCounts = { ...columnWithStasticsDetails.minOccured }

        getmedColArrDependentData(columnWithStasticsDetails, ["avg", "med"])
        getModifiedColumnWithStasticsDetailsForMaxOcAndMinOc(columnWithStasticsDetails, minOccuredWithCounts)

        return { jsonData, columnWithStasticsDetails: { ...columnWithStasticsDetails, maxOccuredWithCounts, minOccuredWithCounts } }


    } catch (err) {
        console.log(err);
    }

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



const getModifiedColumnWithStasticsDetailsForMaxOcAndMinOc = (columnWithStasticsDetails, minOccuredWithCounts) => {



    for (const [col, obj] of Object.entries(columnWithStasticsDetails.maxOccured)) {

        const minAndMaxOccuredObj = getMaxAndMinOccuredElem(obj)
        columnWithStasticsDetails.maxOccured[col] = minAndMaxOccuredObj.maxOccuredKey.key
        columnWithStasticsDetails.minOccured[col] = minAndMaxOccuredObj.minOccuredKey.key
        minOccuredWithCounts[col] = minAndMaxOccuredObj.minOccuredKey.counts
    }

}


const getMaxAndMinOccuredElem = (obj = {}) => {


    const tempObj = { maxOccuredKey: { key: null, counts: null }, minOccuredKey: { key: null, counts: null } }
    const valuesInObj = Object.values(obj)
    let maxCount = valuesInObj[0]
    let minCount = valuesInObj[0]

    for (const [key, val] of Object.entries(obj)) {

        if (val && val >= maxCount && key) {
            maxCount = val
            tempObj["maxOccuredKey"]["key"] = key
            tempObj["maxOccuredKey"]["counts"] = maxCount
        }
        if (val && val <= minCount && key) {
            minCount = val
            tempObj["minOccuredKey"]["key"] = key
            tempObj["minOccuredKey"]["counts"] = minCount
        }
    }
    return tempObj
}



















