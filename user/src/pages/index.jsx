import React, { useEffect } from "react";
import Message from "../components/Global/Message";

const Index = () => {
  useEffect(() => {
    document.title = "Connectify-HomePage";
  });
  return (
    <div className="w-full ">
      <Message />
    </div>
  );
};

export default Index;
