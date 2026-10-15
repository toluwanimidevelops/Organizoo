import React from "react";
import Navbar from "./components/Nav";
import Home from "./pages/Home";
import Cta from "./components/Cta";
import Footer from "./components/Footer";
const App = () => {
  return (
    <>
      {/* <div className="mt-3"></div> */}
      <Navbar />
      <Home />
      <Cta />
      <Footer />

    </>
  );
};
export default App;
