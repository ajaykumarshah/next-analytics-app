import * as XLSX from 'xlsx';
import { getDataType } from './convertJSONDataIntoDocumnet';

export const getTheUploadedFileDetails = {

    getTheExcelFileDetails: function ({ file,callback }) {
        const reader = new window.FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetNames = workbook.SheetNames;
            const sheets = [];
            sheetNames.forEach((sheetName) => {
                const sheet = workbook.Sheets[sheetName];
                const sheetJson = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                if (sheetJson.length > 0) {
                    const columnNames = sheetJson[0];
                    const columnTypes = [];
                    columnNames.forEach((columnName, index) => {
                        const columnData = sheetJson.slice(1, 6).map(row => row[index]);
                        const dataTypesCountingObj={"string":0,"number":0,"date":0,"percentage":0}
                        let maxCountOfDataType=0
                        let maxCountOfData=""
                        for(const item of columnData){
                            const typeOfData=getDataType(item)
                            dataTypesCountingObj[typeOfData]=dataTypesCountingObj[typeOfData]+1
                            if(maxCountOfDataType<dataTypesCountingObj[typeOfData]){
                                maxCountOfDataType=dataTypesCountingObj[typeOfData]
                                maxCountOfData=typeOfData
                            }
                        }
                        const dataType = maxCountOfData;
                        columnTypes.push({name:columnName ,type:dataType})
                    });
                    sheets.push({sheetName,columns:columnTypes })
                } else {
                    sheets.push({sheetName,columns:[] })
                }
            });
            callback(sheets);
        };
        reader.readAsArrayBuffer(file);
    },

}