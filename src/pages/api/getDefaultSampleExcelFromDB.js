// import { connectToDatabase } from "@/mongodb/connectToMongo";
"use server";

import { connectToDatabase } from "@/mongodb/connectToMongo";
export default async function getDefaultSampleExcelFromDB() {
  const db = await connectToDatabase();
  const collection = db.collection("excels");
  const excel = await collection.findOne({ tableId: 0,},{table:{$slice:51} });
  return JSON.stringify(excel);
}
