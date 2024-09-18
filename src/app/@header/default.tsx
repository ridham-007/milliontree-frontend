import React from "react";
import Navbar from "../components/Navbar";

const Default = async () => {
 

  return (
    <header
      key={Math.random()}
      className={`flex h-[100px] lg:h-[128px] w-full bg-white`}
    >
      <Navbar/>
    </header>
  );
}

export default Default