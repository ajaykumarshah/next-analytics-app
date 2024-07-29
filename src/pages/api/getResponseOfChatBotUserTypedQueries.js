
"use server"


import { generativeAiRequest } from "./generativeAiRequest"

export default async(query)=>{
    const response=await generativeAiRequest.getChatBotQueryResponse(query)
    return response
}






