"use clent"
import { createSlice } from "@reduxjs/toolkit";

const addKeywordsOfExcel=createSlice({
    name:"addKeywordsOfExcel",
    initialState:{keywords:{},status:"fetching"},
    reducers:{
        addKeywords:(state,action)=>{
            state.keywords=action.payload;
        }
    }
})

export const{addKeywords}=addKeywordsOfExcel.actions;
export default addKeywordsOfExcel.reducer