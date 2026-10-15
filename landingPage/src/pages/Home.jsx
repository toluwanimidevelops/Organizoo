import React from "react";
import Navbar from "../components/Nav";
import Header from "../components/Home/Header";
import Features from "../components/Home/Features";

import About from "../components/Home/About";

const Home = () => {
  return (
    <div className="w-full overflow-y-hidden">
      {/* <Navbar /> */}
      <Header />
      <About />
      <Features />
    </div>
  );
};

export default Home;
