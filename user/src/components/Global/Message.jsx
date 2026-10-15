import React from "react";
import { MdMessage } from "react-icons/md";

const Message = () => {
  return (
    <div className="fixed  cursor-pointer flex justify-center right-5 items-center bg-white rounded-full hover:animate-none bottom-5 animate-bounce shadow-md size-16">
          <MdMessage size={30} />
          <div className="absolute -top-3 right-0 font-primary text-xs size-5 bg-red-600 rounded-full text-center flex justify-center items-center text-white">2</div>
    </div>
  );
};

export default Message;
