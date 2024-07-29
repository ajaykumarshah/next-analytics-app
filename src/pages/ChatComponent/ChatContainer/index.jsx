import React, { useState } from "react";
import InputComponent from "./InputComponent";
import AiResponse from "./AiResponse";
import UserQuery from "./UserQuery";
import Suggestion from "./Suggestion";
import withReduxProvider from "@/pages/ReduxStoreProvider";
import { useSelector } from "react-redux";

const ChatContainer = () => {
    
  const [userTypedQuery, setuserTypedQuery] = useState("")
    const { suggestions, userQueries } = useSelector((state) => ({
        ...state.chatbotData,
    }));
    
    return (
        <div className="main-containerr">
            <div className="measseges-containerr">
                {userQueries.length ? (
                    userQueries.map((obj,index) => {
                        if (obj.user == "ai") {
                            return <AiResponse key={index} obj={obj} />;
                        }
                        return <UserQuery key={index} obj={obj} />;
                    })
                ) : (
                    <div className="suggestions-container">
                        {suggestions.map((que,index) => (
                            <Suggestion key={index} handleSuggestionClick={(query)=>setuserTypedQuery(query)}  que={que} />
                        ))}
                    </div>
                )}
            </div>
            <InputComponent userTypedQuery={userTypedQuery} setuserTypedQuery={setuserTypedQuery} />
        </div>
    );
};

export default withReduxProvider(ChatContainer);
