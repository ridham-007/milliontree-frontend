'use server'
import { prepareServerError } from "@/utils/helpers";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { fireStorage } from '@/utils/firebase';
import { v4 as uuidv4 } from 'uuid';

export const uploadFile = async (
    bucket: string,
    file: File
  ): Promise<{ url: string; name: string }> => {
    try {
      return new Promise(async (resolve, reject) => {
        if (!file) resolve({ url: "", name: "" });
        const fileName = file.name || `${uuidv4()}`;
        const storageRef = ref(fireStorage, `${bucket}/${fileName}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        resolve({ url, name: file.name });
      });
    } catch (e) {
      throw e;
    }
  };

export const getUserById = async (id: string): Promise<any> => {
    try {
      const userResponse = await (
        await fetch(`${process.env.NEXT_PUBLIC_URL}/user/${id}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ).json();
      if (userResponse) {
        return {
          success: true,
          data: userResponse,
        };
      } else {
        return prepareServerError(userResponse?.message);
      }
    } catch (error: any) {
      return prepareServerError(error?.message);
    }
  };

export const updateUserInfo = async (
    data: any
  ): Promise<any> => {
    const {id, userData} = data;
    try {
      const response = await (
        await fetch(
          `${process.env.NEXT_PUBLIC_URL}/user/update/${id}`,
          {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          }
        )
      ).json();
      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
        console.error(error?.message);
    }
  };

  export const getUserByEmail = async (email: string): Promise<any> => {
    try {
      const userResponse = await (
        await fetch(`${process.env.NEXT_PUBLIC_URL}/user/${email}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ).json();
      
      if (userResponse) {
        return {
          data: userResponse,
        };
      } else {
        return prepareServerError(userResponse?.message);
      }
    } catch (error: any) {
      return prepareServerError(error?.message);
    }
  };

  export const deleteUserById = async (userId: string): Promise<any> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/user/${userId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const userResponse = await response.json();
      if (response.ok) {
        return {
          data: userResponse,
        };
      } else {
        return prepareServerError(userResponse?.message || 'Failed to delete user.');
      }
    } catch (error: any) {
      return prepareServerError(error.message || 'An error occurred.');
    }
  };
  