import React from 'react';
import {Skeleton,Avatar} from "antd"
import chatbot_profile from "@/static/media/images/png/chatbot_profile.png"
import AiResponseContent from './AiResponseContent';


const AiResponse=({obj})=>{

    const {status="generating",response:aiResponseConetnt}=obj
    
    const getContent=()=>{
        let content;
        switch (status) {
            case "generating":
                content=<Skeleton className='contentToview' loading={true} active  paragraph={{rows: 1}}  />
                break;
            case "generated":
                content=<span id='contentToview' className="ai-content"><AiResponseContent text={aiResponseConetnt} /></span>
            default:
                break;
        }
        return content
    }
    return <div className="ai-response-container">
            {/* <Avatar src={<img src={chatbot_profile} />} style={status=="generated"?{marginTop:"0px"}:{}} size={30}  /> */}
            {getContent()}
    </div>
}

export default AiResponse