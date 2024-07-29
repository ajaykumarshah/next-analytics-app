"use server";

import { connectToDatabase } from "@/mongodb/connectToMongo";
import { generativeAiRequest } from "./generativeAiRequest";
const ObjectId = require('mongodb').ObjectId

export default async function getSampleQueriesFromDB({tableId,documentId}) {
  const documentIdCopy=ObjectId(documentId) 
  const db = await connectToDatabase();
  const collection = db.collection("excels");
  let excelObj;
  if(documentId){
   excelObj = await collection.findOne({ _id:documentIdCopy},{ projection: { keywords: 1 } })
  }
  else{
    excelObj = await collection.findOne({ tableId},{ projection: {_id: 0, keywords: 1 } })
  }
  let tempQueries=[]
  // const tempEntries=Object.entries(excelObj.keywords);
  // for(let i=0;i<tempEntries.length;i++){
  //     for(let j=0;j<tempEntries.length;j++){
  //        const [firstKey,firstValue]=tempEntries[i];
  //        const [secondKey,secondValue]=tempEntries[j];
  //        if(firstValue != secondValue ){
  //           let tempString;
  //             if(firstValue==="number" && secondValue==="string"){
  //                  tempString= `${secondKey.replaceAll("_"," ")} by ${firstKey.replaceAll("_"," ")}`
  //             }
  //             else{
  //                tempString= `${firstKey.replaceAll("_"," ")} by ${secondKey.replaceAll("_"," ")}`
  //             }
  //             tempQueries.push(tempString)
  //        }

  //     }
  // }

  const aiResponse=await generativeAiRequest.getSuggestionQueries(excelObj.keywords)
  const jsonString = aiResponse.match(/{[\s\S]*}/)[0];
  const responseObject = JSON.parse(jsonString);
  const kpisArray = responseObject.kpis|| responseObject.kpi;
  // console.log("this is ai response",kpisArray,aiResponse);
  return {tempQueries:kpisArray,keywords:excelObj.keywords,_id:excelObj?._id?.toString()}
}