import React, { useEffect, useRef, useState } from 'react';


const AiResponseContent=({text})=>{

    const [textToRender,setTextToRender]=useState("")
    const refCount=useRef(-1)
    const scrollcontentIntoView=()=>{
        const loader= document.getElementsByClassName("contentToview")?.[0]
        const ailatestResponse=document.getElementById("contentToview")
        if(loader){
            loader.scrollIntoView()
        }
        else{
         ailatestResponse?.scrollIntoView()
        }
     }
     scrollcontentIntoView()
    // useEffect(()=>{
    //     setTimeout(() => {
    //         if(textToRender.length<text.length){
    //             setTextToRender(textToRender+text.charAt(refCount.current))
    //             refCount.current=refCount.current+1
    //         }
    //     }, 50);
    // },[textToRender])
    return <>{text}</>


}

export default AiResponseContent