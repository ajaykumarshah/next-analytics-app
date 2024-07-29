const validator=require("validator")

export const convertJSONDataIntoDocumnet=(json=[])=>{

    const objectToReturn={keywords:{} }
    for(const [key,value] of Object.entries(json[0])){
        const tempKey=key;
        objectToReturn.keywords[tempKey]=getDataType(value)
    }
    objectToReturn.table=json;
    console.log(objectToReturn,"objectToReturn object to add");
    return objectToReturn
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
