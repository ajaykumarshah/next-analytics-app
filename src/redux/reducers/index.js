import { combineReducers } from "@reduxjs/toolkit";
import addDataToAnalyse from "./addDataToAnalyse";
import addDefaultQueries from "./addDefaultQueries";
import addKeywordsOfExcel from "./addKeywordsOfExcel";
import chatBotQueries from "./chatBotQueries";

export const combinedReducers=combineReducers({
    excelData:addDataToAnalyse,
    defaultQueries:addDefaultQueries,
    excelKeywords:addKeywordsOfExcel,
    chatbotData:chatBotQueries
})




