import React from "react";
import { redirect } from "next/navigation";
import ForgotPassword from "../components/ForgotPassword";
import { cookies } from "next/headers";

const ForgotPasswordLayout = async (props: any) => {
  const redirectUri = props?.searchParams?.redirect_uri;
  const userCookie = await cookies().get("user")?.value;
  let user = null; 

  if (userCookie) {
    user = JSON.parse(userCookie); 
  }
  if (user) {
    redirect(redirectUri ?? "/");
  }
  return (
    <div className="flex w-full flex-1 mt-[170px]">
      <ForgotPassword redirectUri={redirectUri ?? "/"} />
    </div>
  );
};

export default ForgotPasswordLayout;
