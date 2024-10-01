'use server'
import { prepareServerError } from "@/utils/helpers";

export const signInUser = async (
    data: any
  ): Promise<any> => {
    try {
      const response = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_URL}/auth/login`,
          {
            method: "POST", 
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(data)
          }
        )
      ).json();
  
      return response;
  
    } catch (error: any) {
      return prepareServerError(error?.message);
    }
  };

  export const signUpUser = async (
    data: any
  ): Promise<any> => {
    try {
      const response = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_URL}/auth/signup`,
          {
            method: "POST", 
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(data)
          }
        )
      ).json();
  
      return response;
  
    } catch (error: any) {
      return prepareServerError(error?.message);
    }
  };

 
