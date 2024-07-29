import React from "react";
import ai_icon from "@/static/media/images/jpg/ai-icon.jpg";
import Image from "next/image";
import Icon from "@mdi/react";
import { mdiSendCircleOutline } from "@mdi/js";
import withReduxProvider from "@/pages/ReduxStoreProvider";

const Suggestion = ({ que ,handleSuggestionClick}) => {

  return (
    <div className="suggestion"  onClick={()=>handleSuggestionClick(que)}>
      <Icon
        path={mdiSendCircleOutline}
        color="blue"
        className="img"
        size={1}
      />
      <span>{que} </span>{" "}
    </div>
  );
};
export default withReduxProvider(Suggestion);
