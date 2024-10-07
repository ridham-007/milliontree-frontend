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

  export const paginatedUsers = async (
    data: any
  ): Promise<any> => {
    try {
      const { page, limit } = data;
      const eventResponse = await (
        await fetch(`${process.env.NEXT_PUBLIC_URL}/user/list?page=${page}&limit=${limit}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        })
      ).json();
      if (eventResponse?.success) {
        return {
          success: true,
          data: eventResponse?.data,
        };
      } else {
        return prepareServerError(eventResponse?.message);
      }
    } catch (error: any) {
      return prepareServerError(error?.message);
    }
  };

  export const userInfoUpdate = async (
    data: any
  ): Promise<any> => {
    const data1 = JSON.parse(data);
    const { _id } = data1;
    
    try {
      const response = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_URL}/user/update/${_id}`,
          {
            method: "PATCH",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data1),
          }
        )
      ).json();
      
      if (response) {
        return {
          success: true,
          data: response?.data,
          message: response?.message
        };
      } else {
        return prepareServerError(response?.message);
      }
  
    } catch (error: any) {
      console.error(error?.message);
    }
  };

 
