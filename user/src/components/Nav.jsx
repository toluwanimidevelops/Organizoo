import React from "react";
import {  MdNotifications } from "react-icons/md";
import { useAppContext } from "../context/AppContext";

const Nav = () => {
  let {user} = useAppContext()
  return (
    <div className="flex w-full justify-between p-6 border-b border-gray-500">
      <img src="/logo.png" className="max-w-10 outline-0  cursor-pointer" />
      <input type="search" className="border outline-0 w-sm p-2 rounded" />
      <div className="flex gap-2 justify-center items-center">
        <div className="p-2 rounded cursor-pointer bg-white shadow">
          <MdNotifications size={25} />

        </div>
        <div className="size-10 cursor-pointer border rounded-full"><img src={user.imageUrl} alt="" /></div>
      </div>
    </div>
  );
};

export default Nav;
