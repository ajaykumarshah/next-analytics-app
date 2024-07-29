import { createSlice } from "@reduxjs/toolkit";

const addDefaultQueries=createSlice({
    name:"addDefaultQueries",
    initialState:{sampleQueries:[],recentQueries:[],_id:null},
    reducers:{
        addSampleQueries:(state,action)=>{
             state.sampleQueries=action.payload.tempQueries;
             state._id=action.payload._id

        },
        addRecentQueries:(state,payload)=>{

        },
        removeRecentQueries:(state,payload)=>{

        }
    }
})

export const {addSampleQueries,addRecentQueries,removeRecentQueries}=addDefaultQueries.actions;
export default addDefaultQueries.reducer