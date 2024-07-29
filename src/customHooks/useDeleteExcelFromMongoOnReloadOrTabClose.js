"use client"
import React from 'react';
const { useEffect } = require("react")


export const useDeleteExcelFromMongoOnReloadOrTabClose=({callBack})=>{

    useEffect(()=>{
        window.addEventListener("beforeunload",callBack)
        return ()=>window.removeEventListener("beforeunload",callBack);
    },[])
}