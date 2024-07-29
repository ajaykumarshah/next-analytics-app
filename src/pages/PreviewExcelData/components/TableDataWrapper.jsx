import { Button } from 'antd';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useCallback } from 'react';

const TableDataWrapper=({children})=>{
    
    const handleClickContinue=useCallback(()=>{
        redirect("/querypage")
    },[])
    return <>
       <div style={{display:"flex",marginBottom:"10px", justifyContent:"flex-end" }} >
           <Link  href={"/querypage"} target='/querypage'> <Button  type='primary' onClick={handleClickContinue}>Continue to query</Button></Link> 
       </div>
       
       {children}
    </>
}


export default TableDataWrapper