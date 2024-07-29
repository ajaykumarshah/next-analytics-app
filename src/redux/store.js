import { configureStore } from "@reduxjs/toolkit";
import { combinedReducers } from "./reducers";
import { middlewares } from "./middlewares";


export const store=configureStore({
    reducer:combinedReducers,
    // middleware:(getDefaultMiddleware) =>[...getDefaultMiddleware(),...middlewares],
    devTools: process.env.NODE_ENV !== 'production'
})