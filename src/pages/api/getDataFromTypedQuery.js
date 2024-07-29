"use server"

import { connectToDatabase } from "@/mongodb/connectToMongo";
const compareKeywords=[{"lower":"lt"},{"greater":"gt"},{"equal":"eq"}];
const ObjectId = require('mongodb').ObjectId
export default async function getDataFromTypedQuery({query,keywordsOfExcel,manualySelectedExcelDocumnetId:documentId}){
    documentId=ObjectId(documentId);
    query=query.toLowerCase();
    const {modifiedQuery,keywordsTypes,comapreSearchedKeyword,searchedNumber}=queryMaker({query,keywordsOfExcel})
    let {string:firstKey,number:secondKey}=keywordsTypes;
    firstKey=firstKey.charAt(0).toUpperCase() + firstKey.slice(1)
    secondKey=typeof secondKey==="string"?secondKey.charAt(0).toUpperCase() + secondKey.slice(1):secondKey
    const queryToFire=[
        { "$match":documentId?{"_id":documentId}:{"tableName":"sample" } },
        { "$unwind": "$table" },
        {"$group": {
            "_id": `$table.${firstKey}`,
            "val": { "$sum": `$table.${secondKey}` }
        }},
        { "$sort" : { "val" : -1 } }
    ]
    if(comapreSearchedKeyword){
        queryToFire.push({"$match":{"val":{[`$${Object.values(comapreSearchedKeyword)[0]}`]:Number(searchedNumber)}}})
    }
    const db = await connectToDatabase();
    const collection = db.collection("excels");
    const data=await collection.aggregate(queryToFire).toArray();
    console.log(data,"testing");
    return data
    
}


const queryMaker=({query,keywordsOfExcel})=>{
    let modifiedQuery="";
    const keywordsTypes={}
    const tempArr=query.split(" ");
    let i=0
    const calculated_First_Key=i<tempArr.length-1 && calculateFirstKey(tempArr[i],tempArr[i+1],keywordsOfExcel)
    
    for(let str of tempArr){
        
        for(let key in keywordsOfExcel){
            if(key.toLowerCase()==str.toLowerCase()){
                str=key
                break;
            }
        }
        if( keywordsOfExcel[str]==="string"){
            if(!modifiedQuery.length){
                modifiedQuery+=str +" By ";
                keywordsTypes["string"]=str
            }
            else{
                modifiedQuery+=str+" By "+modifiedQuery;
                keywordsTypes["string"]=str;
                console.log("#########################",str);
                break;
            }
        }
        if( calculated_First_Key && !modifiedQuery.length){
            modifiedQuery+= calculated_First_Key +" By ";
            keywordsTypes["string"]=calculated_First_Key
        }
        if(keywordsOfExcel[str]==="number" && !modifiedQuery.includes(str)){
            modifiedQuery+=str;
            keywordsTypes["number"]=str
        }
        i++;
    }
    
    // if the first key or second key is like 'Annual Salary' means jaha pe space aa raha ho then below to handle
    
    if(!(keywordsTypes.number) || !(keywordsTypes.string)){
        for(let i=0;i<tempArr.length;i++){
           let temp_str="" 
           for(let j=i;j<tempArr.length;j++){
               temp_str+=tempArr[j]

               for(let key in keywordsOfExcel){
                 if(key.replaceAll(" ","").toLowerCase()==temp_str.toLowerCase()){
                    // if(keywordsOfExcel[key]=="string"){
                    //       keywordsTypes["string"]=key;
                    // }
                    // else if (keywordsOfExcel[key]=="number"){
                    //      keywordsTypes["number"]=key;
                    // }
                    
                    // to replace the above one the below one is solution
                    keywordsTypes[keywordsOfExcel[key]]=key
                }
            }
        }
    }
}

console.log(keywordsOfExcel,keywordsTypes,tempArr,query,"************************************************");
const comapreSearchedKeyword=compareKeywords.find(compareObj=>query.includes(Object.keys(compareObj)[0]))
const querySplitedArr=query.split(" ");
const searchedNumber=querySplitedArr[querySplitedArr.length-1];
return {modifiedQuery,keywordsTypes,comapreSearchedKeyword,searchedNumber};
}



const calculateFirstKey=(currentElement,nextElement,keywordsOfExcel)=>{
     for (let key in keywordsOfExcel){
        let key_copy =key.toLowerCase();
        let curr_next_Text=(currentElement+" "+nextElement).toLowerCase();
        if(key_copy==curr_next_Text){
            return key
        }
     }
     return null
}