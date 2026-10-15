import React from "react";

const Features = () => {
  return (
    <div className=" w-5xl flex flex-col gap-2 mb-10 mx-auto ">
      <h1 className="text-[48px] text-center font-normal tracking-tighter font-main">
        Features
      </h1>
      <p className="text-sm text-center mx-auto mb-2 text-slate-500 font-main mt-2 max-w-lg">
        A visual collection of our most recent works — each piece crafted with
        intention, emotion, and style.
      </p>
      <div className="grid grid-cols-2 max-md:grid-cols-1 justify-center gap-2">
        <div className=" bg-gray-200/20 p-5  flex-1 rounded-xl">
          {" "}
          <div className="h-100 bg-white rounded-xl shadow-xl"></div>
          <h1 className="font-main text-lg mt-2">Event Creation Tools</h1>
          <p className="leading-none text-xs font-secondary text-gray-600 capitalize">
            set up and manage an event in minutes, whether it's in-person,
            virtual, or hybrid
          </p>
        </div>
        <div className="grid gap-2 grid-row-2">
          <div className=" bg-gray-200/20 p-5   flex-1 rounded-xl">
            <div className="h-35 bg-white rounded-xl shadow-xl"></div>
            <h1 className="font-main text-lg mt-2">Smart Event Feed</h1>
            <p className="leading-none text-xs font-secondary text-gray-600 capitalize">
              a ranking engine that surfaces events near you based on your
              interests and past activity
            </p>
          </div>
          <div className=" bg-gray-200/20 p-5   flex-1 rounded-xl">
            <div className="h-35 bg-white rounded-xl shadow-xl"></div>
            <h1 className="font-main text-lg mt-2">Smart Event Feed</h1>
            <p className="leading-none text-xs font-secondary text-gray-600 capitalize">
              a ranking engine that surfaces events near you based on your
              interests and past activity
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-2 max-md:grid-cols-1 grid-cols-2">
        <div className=" bg-gray-200/20 p-5  flex-1 rounded-xl">
          {" "}
          <div className="h-60 bg-white rounded-xl shadow-xl"></div>
          <h1 className="font-main text-lg mt-2">Event Creation Tools</h1>
          <p className="leading-none text-xs font-secondary text-gray-600 capitalize">
            set up and manage an event in minutes, whether it's in-person,
            virtual, or hybrid
          </p>
        </div>
        <div className=" bg-gray-200/20 p-5  flex-1 rounded-xl">
          {" "}
          <div className="h-60 bg-white rounded-xl shadow-xl"></div>
          <h1 className="font-main text-lg mt-2">Event Creation Tools</h1>
          <p className="leading-none text-xs font-secondary text-gray-600 capitalize">
            set up and manage an event in minutes, whether it's in-person,
            virtual, or hybrid
          </p>
        </div>
      </div>
      <div className="grid gap-2 grid-cols-3 max-md:grid-cols-1 max-lg:grid-cols-2">
        <div className=" bg-gray-200/20 p-5  flex-1 rounded-xl">
          {" "}
          <div className="h-60 bg-white rounded-xl shadow-xl"></div>
          <h1 className="font-main text-lg mt-2">Event Creation Tools</h1>
          <p className="leading-none text-xs font-secondary text-gray-600 capitalize">
            set up and manage an event in minutes, whether it's in-person,
            virtual, or hybrid
          </p>
        </div>
        <div className=" bg-gray-200/20 p-5  flex-1 rounded-xl">
          {" "}
          <div className="h-60 bg-white rounded-xl shadow-xl"></div>
          <h1 className="font-main text-lg mt-2">Event Creation Tools</h1>
          <p className="leading-none text-xs font-secondary text-gray-600 capitalize">
            set up and manage an event in minutes, whether it's in-person,
            virtual, or hybrid
          </p>
        </div>
        <div className=" bg-gray-200/20 p-5  flex-1 rounded-xl">
          {" "}
          <div className="h-60 bg-white rounded-xl shadow-xl"></div>
          <h1 className="font-main text-lg mt-2">Event Creation Tools</h1>
          <p className="leading-none text-xs font-secondary text-gray-600 capitalize">
            set up and manage an event in minutes, whether it's in-person,
            virtual, or hybrid
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
