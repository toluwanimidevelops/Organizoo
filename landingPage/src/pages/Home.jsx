import React from "react";
import Navbar from "../components/Nav";
import Header from "../components/Home/Header";
import Features from "../components/Home/Features";
import HowItWorks from "../components/Home/HowitWorks";

const Home = () => {
  return (
    <div className="w-full overflow-y-hidden">
      {/* <Navbar /> */}
      <Header />
      <HowItWorks />
      <Features />
    </div>
  );
};

export default Home;
