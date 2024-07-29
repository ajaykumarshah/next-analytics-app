"use server";
import { connectToDatabase } from "@/mongodb/connectToMongo";
export default async({document={}})=>{
    const db = await connectToDatabase();
    const collection = db.collection("excels");
    const response=await collection.insertOne(document)
    const { insertedId } = response;
    return insertedId
}

export const config={
    api:{
        bodyParser:{
            sizeLimit:"10mb"
        }
    }
}










