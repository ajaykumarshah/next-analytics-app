import React, { useState } from "react";
import { Input } from "antd";
import send_icon from "@/static/media/images/jpg/send-icon2.jpg";
import Image from "next/image";
import { addAiResponseOnSuccessOfTypedQueries, addUserTypedQueryToChatBot } from "@/redux/reducers/chatBotQueries";
import { useDispatch, useSelector } from "react-redux";
import { generativeAiRequest } from "@/pages/api/generativeAiRequest";
import getResponseOfChatBotUserTypedQueries from "@/pages/api/getResponseOfChatBotUserTypedQueries";

const InputComponent = ({userTypedQuery,setuserTypedQuery}) => {

  const { userQueries,keywordsOfExcel } = useSelector((state) => ({
    ...state.chatbotData,
    keywordsOfExcel: state.excelKeywords?.keywords
  }));
  const aiIsGenerating=userQueries.filter(obj=>obj.status==="generating").length
  const dispacth = useDispatch()

  const handleEnterClick = async() => {
    if (userTypedQuery.length) {
      setuserTypedQuery("")
      dispacth(addUserTypedQueryToChatBot(userTypedQuery))
      const response=await getResponseOfChatBotUserTypedQueries(userTypedQuery)
      dispacth(addAiResponseOnSuccessOfTypedQueries(response))
    }
    return
  }

  const handleInputChanges = e => {
    setuserTypedQuery(e.target.value)
  }

  return (
    <div className="input-container">
      <Input disabled={aiIsGenerating} value={userTypedQuery} placeholder={aiIsGenerating?"Generating....":"Please type your question"} onChange={handleInputChanges} showCount={true} onPressEnter={handleEnterClick} autoSize={false} />
      <span  onClick={handleEnterClick}>
        <Image
          src={send_icon}
          width={30}
          height={30}
          alt="Picture of the author"
          onClick={handleEnterClick}
        />
      </span>
    </div>
  );
};

export default InputComponent;
