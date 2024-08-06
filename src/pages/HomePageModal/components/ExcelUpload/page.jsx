// components/ExcelUpload.js
"use client";
import React, { useState } from "react";
import { Upload, Button, message, Progress } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import withReduxProvider from "@/pages/ReduxStoreProvider";
import { generateRandomNumberInRange } from "@/utils/generateRandomNumberInRange";


function ExcelUpload({setUploadedFile,setModalStep}) {
  const [progressCount,setProgressCount]=useState(null)
  const dispatch=useDispatch()

  
  

  const beforeUpload=async file => {
    const isLt2M = file.size / 1024 / 1024 < 2; // 2MB limit
    if (!isLt2M) {
      message.error('File must be smaller than 2MB!');
      return false
    }
    const fileName=file.name;
    const  handleUploadedExcel=async()=>{
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      setProgressCount(generateRandomNumberInRange(20,40))
      await delay(300)
      message.success("file uploaded successfully.")
      // first wen need to store only 500 rows
      setUploadedFile(prev=>({...prev,uploaded:true,file}))
      setProgressCount(100);
      // setModalStep("tableConfig")
      // message.success("file is ready to run queries.")
      // router.push("/querypage")
    }
    handleUploadedExcel()
    return false;
  }
  return (
    <>
      <Upload
        multiple={false}
        accept=".xlsx"
        beforeUpload={beforeUpload}
      >
        <div
          style={{
            padding: "16px",
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            backgroundColor: "#fafafa",
          }}
        >
          <Button icon={<UploadOutlined />}>Select Excel or Csv file</Button>
        </div>
      </Upload>
      {progressCount?<Progress percent={progressCount} style={{padding:"10px 70px"}} />:null}
    </>
  );
}



export default withReduxProvider(ExcelUpload);
