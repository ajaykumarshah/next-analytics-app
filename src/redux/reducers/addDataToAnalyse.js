
import { createSlice } from "@reduxjs/toolkit";
const addDataToAnalysis=createSlice({
    name:"addDataToAnalysis",
    initialState:{data:[],added:false,status:"fetching",manualySelectedExcelDocumnetId:null,uploadedDataDetails:{activeSheet:"",checkedColumns:[]}},
    reducers:{
        addSampleDataToAnalyse:(state,action)=>{
            state.added=true,
            state.data=action.payload
            state.status="fetched"
        },
        addManuallySelectedDataToAnalyse:(state,payload)=>{
            
        },
        addManualySelectedExcelDocumnetId:(state,action)=>{
            state.manualySelectedExcelDocumnetId=action.payload
        },
        addSheetsConfig:(state,action)=>{
            state.uploadedDataDetails={activeSheet:action.payload.activeSheet,checkedColumns:action.payload.checkedColumns}
        }

    },
    
})

export const {addSampleDataToAnalyse,addManuallySelectedDataToAnalyse,addManualySelectedExcelDocumnetId,addSheetsConfig}=addDataToAnalysis.actions;
export default addDataToAnalysis.reducer
