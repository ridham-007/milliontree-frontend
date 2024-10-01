import React from "react";
import Navbar from "../components/Navbar";

const Default = async () => {
 

  return (
    <header
      key={Math.random()}
      className={`absolute flex h-[100px] lg:h-fit w-full bg-transparent z-20`}
    >
      <Navbar/>
    </header>
  );
}

export default Default