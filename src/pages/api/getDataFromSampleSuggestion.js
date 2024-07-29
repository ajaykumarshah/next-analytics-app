'use server';

import { connectToDatabase } from '@/mongodb/connectToMongo';
import { generativeAiRequest } from './generativeAiRequest';
const ObjectId = require('mongodb').ObjectId


export default async function getDataFromSampleSuggestion(query,documentId,keywords) {
     const documentIdCopy=ObjectId(documentId);
    // const modifiedQueryArr = query.split(' ');
    // for (let i = 0; i < modifiedQueryArr.length; i++) {
    //     let temp = modifiedQueryArr[i];
    //     modifiedQueryArr[i] = temp.charAt(0).toUpperCase() + temp.slice(1)
    // }
    // const firstKey = modifiedQueryArr.slice(0, modifiedQueryArr.indexOf('By') ).join(' ');
    // const secondKey = modifiedQueryArr.slice(modifiedQueryArr.indexOf('By')+1, ).join(' ');
    
    const db = await connectToDatabase();
    const collection = db.collection('excels');
    
      
    // const query2=[
    //     { '$match': documentId ?{'_id':documentIdCopy}:{'tableName':'sample' } },
    //     { '$unwind': '$table' },
    //     {'$group': {
    //         '_id': `$table.${firstKey}`,
    //         'val': { '$sum': `$table.${secondKey}` }
    //     }},
    //     { '$sort' : { 'val' : -1 } }
    // ]
    
    let modifiedQueryObj= await generativeAiRequest.getDataFromSuggestionClickedQuery(keywords,query,documentIdCopy)
    const finalqu=[{'$match': {'_id':documentIdCopy}},...modifiedQueryObj.query.slice(1)]
    console.log('mongodb query',JSON.stringify(finalqu));
    const excelObj = await collection.aggregate(finalqu).toArray();
    console.log('query response',excelObj);
    return excelObj
}