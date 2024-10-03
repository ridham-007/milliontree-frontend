import React from "react";
import Navbar from "../components/Navbar";
import { cookies } from "next/headers";

const Default = async () => {
  const userCookie = await cookies().get("user")?.value;
  let user = null; 

  if (userCookie) {
    user = JSON.parse(userCookie); 
  }
  
  return (
    <header
      key={Math.random()}
      className={`absolute flex h-[100px] lg:h-fit w-full bg-transparent z-20`}
    >
      <Navbar userData={user}/>
    </header>
  );
}

export default Default