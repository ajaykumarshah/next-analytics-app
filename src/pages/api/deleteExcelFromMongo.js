"use server";

import { connectToDatabase } from "@/mongodb/connectToMongo";
const ObjectId = require('mongodb').ObjectId

export const  deleteExcelFromMongo=async(_id)=>{
  
        _id=ObjectId(_id);
        const db = await connectToDatabase();
        const collection = db.collection("excels");
        await collection.deleteOne({_id});
    
    
}