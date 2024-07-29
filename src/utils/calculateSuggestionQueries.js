
export default ({excelKeywords,typedQuery,suggestions})=>{
    if(!typedQuery.length){
        return suggestions
    }
    const suggestionsToReturn=[];
    let maxWordsMatchedCount=0;
    const maxWordsMatchedKeyDetails={}
    for(const key in excelKeywords){
        const matchedWordsCount=countMatchedWords(key,typedQuery)
        if(maxWordsMatchedCount<matchedWordsCount){
            maxWordsMatchedCount=matchedWordsCount;
            maxWordsMatchedKeyDetails["key"]=key;
            maxWordsMatchedKeyDetails["valueType"]=excelKeywords[key];
        }
    }
    for(const key in excelKeywords){
        // if the types of values are not equal then only
        if(excelKeywords[key] != maxWordsMatchedKeyDetails.valueType){
                suggestionsToReturn.push(`${maxWordsMatchedKeyDetails.key} by ${key}`)
        }
    }
    return suggestionsToReturn
}

const countMatchedWords=(checkIn,checkThis)=>{
    const shorterLength=Math.min(checkThis.length,checkIn.length)
    let count=0;
    for(let i=0;i<shorterLength;i++){
          if(checkIn[i].toLowerCase()==checkThis[i].toLowerCase()){
            count++
          }
    }
    return count;
}
