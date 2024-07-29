"use server";

import { connectToDatabase } from "@/mongodb/connectToMongo";
const ObjectId = require('mongodb').ObjectId

export const addManualySelectedExcelIntoMongo = async ({table=[],documentId=null,moreTableData=false,document}) => {

    const db = await connectToDatabase();
    const collection = db.collection("excels");

    if(moreTableData){
       await collection.updateOne({ _id: ObjectId(documentId)}, { "$push": { "table": { "$each": table } } })
    }
    else{
        const response = await collection.insertOne(document)
        const { insertedId } = response;
        return JSON.stringify({id:insertedId})
    }
}

