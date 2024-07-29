import { createSlice } from "@reduxjs/toolkit";

const data = [
    { user: "ai", status: "generated", content: "this is first ai response" },
    {
        user: "user",
        content:
            "this is typed query  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially un",
    },
    {
        user: "ai",
        status: "generated",
        content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially un",
    },
    { user: "user", content: "this is typed query" },
    { user: "ai", status: "generating", content: "this is second ai response" },
    { user: "ai", status: "generating", content: "this is second ai response" },
];
const suggestonQuestions = [
    "What are kpis",
    "explain about kpis",
    "how kpi can helpfull to grow business",
];

const chatBotQueries=createSlice({
    name:"chatbot",
    initialState:{userQueries:[],suggestions:suggestonQuestions},
    reducers:{
        addUserTypedQueryToChatBot:(state,action)=>{
            state.userQueries=[...state.userQueries,{query:action.payload,user:"user"},{status:"generating",user:"ai",response:""}]
        },

        addAiResponseOnSuccessOfTypedQueries:(state,action)=>{
            state.userQueries=state.userQueries.map(obj=>{
                if(obj.status=="generating" && obj.user=="ai"){
                    return {...obj,status:"generated",response:action.payload}
                }
                return obj
            })
        },
        addAiResponseOnErrorOfTypedQueries:(state)=>{
          
            state.userQueries=state.userQueries.map(obj=>{
                if(obj.isFetchingAiResponse){
                    return {...obj,status:"error"}
                }
                return obj
            })
        }
    }
})


export const {addUserTypedQueryToChatBot,addAiResponseOnSuccessOfTypedQueries,addAiResponseOnErrorOfTypedQueries}=chatBotQueries.actions;
export default chatBotQueries.reducer