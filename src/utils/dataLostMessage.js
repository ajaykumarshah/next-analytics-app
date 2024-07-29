"use client"
const { ExclamationCircleFilled } = require("@ant-design/icons")
const { Modal } = require("antd")

export const dataLostMessage=(e,onOk)=>{
    e.preventDefault();

   Modal.confirm({
    title: 'Are you sure you want to leave/reload ?',
    icon: <ExclamationCircleFilled />,
    content: 'due to this your uploaded data will be deleted from our store',
    onOk:()=>{onOk()},
    onCancel:()=>{
      e.returnValue = message;
      return message;
    },
   })
}