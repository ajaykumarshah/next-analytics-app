import React from "react";
import { Popover } from "antd";
import chat_png from "@/static/media/images/jpg/chat_png3.jpg"
import ChatContainer from "./ChatContainer";
import "./ChatComponent.scss"
import Image from "next/image";


const ChatComponent = () => {
  return (
    <Popover
      content={<ChatContainer />}
      title={<PopupTitle />}
      trigger="click"
      className="pop-up"
      titleMinWidth={200}
      placement="bottomRight"
    >
      <Image
        src={chat_png}
        width={70}
        height={70}
        className="chatbot-image"
        alt="Picture of the author"
      />
    </Popover>
  );
};




function PopupTitle() {

  return <div className='header-container'><h1>
    ChatBot</h1>
    <p>
      this is subtitle
    </p>
  </div>
}

export default ChatComponent;
