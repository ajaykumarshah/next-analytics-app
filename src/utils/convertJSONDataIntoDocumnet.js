const validator=require("validator")

export const convertJSONDataIntoDocumnet=({jsonData=[],details=[],checkedColumns=[],dataProcessingConfig={},activeSheet})=>{

    const finalFilterdColumnsWithDataTypes=details.filter(obj=>obj.sheetName===activeSheet)[0].columns.filter(obj=>checkedColumns.includes(obj.name))
    
    const objectToReturn={keywords:{} }

    for(const [key,value] of Object.entries(finalFilterdColumnsWithDataTypes)){
        objectToReturn.keywords[key]=value
        // key as column name and value as data type of column
    }

    let json=[]
    for(const obj of jsonData){
        const invalidColValuesArr=checkInvalidValuesOfColumn(obj)
        if(!invalidColValuesArr.length){
            json.push(obj)
            continue
        }
        // if length exist then we need to modify obj based on pre-processing config

        let temp_Obj
        for(const [key] of Object.entries(obj)){

            if(invalidColValuesArr.includes(key)){
                const value_Of_Config_for_col=dataProcessingConfig[key]?.split("_")?.[0] || "delete"
                
                if(value_Of_Config_for_col=="delete"){
                    break;
                    // no need to push in json , just break the loop
                }

                // assign the value of user selected 
                temp_Obj[key]=value_Of_Config_for_col
                
            }

        }
        json.push({...obj,...temp_Obj})

        // so that new col values are overlaped
    }




    
    objectToReturn.table=json;
    
    return objectToReturn
}




const checkInvalidValuesOfColumn=obj=>{


    const invalidTypes=[null,undefined,"null","undefined"]
    const invalidColumns=[]

    for(const [key,value] of Object.entries(obj)){
        if(invalidTypes.includes(value) || invalidColumninva.includes(typeof value)){
            invalidColumns.push(key)
        }
    }

    return invalidColumns
    
}







export const getDataType=data=>{
        try{
            if ((typeof data === 'number') || (typeof data==="string" &&  validator.isNumeric(data.toString()))) {
            return "number"
        } else if (validator.isDate(data.toString())) {
            return "date"
        } else if (validator.matches(data, /^[0-9]+%$/)) {
            return  "percentage"
        } else {
            return "string"
        }}catch(err){
            return "string"
        }
}
