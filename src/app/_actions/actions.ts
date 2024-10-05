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

export const getTreesByUserById = async (id: string): Promise<any> => {
  try {
    const userResponse = await (
      await fetch(`${process.env.NEXT_PUBLIC_URL}/tree/${id}`, {
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
  const data1 = JSON.parse(data);
  try {
    const response = await (
      await fetch(
        `${process.env.NEXT_PUBLIC_URL}/tree/register`,
        {
          method: "POST",
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
      };
    } else {
      return prepareServerError(response?.message);
    }

  } catch (error: any) {
    console.error(error?.message);
  }
};

export const updateTreeInfo = async (
  data: any
): Promise<any> => {
  const data1 = JSON.parse(data);
  const { _id } = data1;
  try {
    const response = await (
      await fetch(
        `${process.env.NEXT_PUBLIC_URL}/tree/update/${_id}`,
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

export const getAllEvents = async (): Promise<any> => {

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/event/all-events`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      return prepareServerError(errorResponse?.message || 'An error occurred while fetching data.');
    }

    const eventResponse = await response.json();

    return {
      success: true,
      data: eventResponse.data,
    };
  } catch (error: any) {
    return prepareServerError(error?.message || 'An unexpected error occurred.');
  }
};

export const getCompletedEvents = async (): Promise<any> => {

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/event/completed`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      return prepareServerError(errorResponse?.message || 'An error occurred while fetching data.');
    }

    const eventResponse = await response.json();

    return {
      success: true,
      data: eventResponse.data,
    };
  } catch (error: any) {
    return prepareServerError(error?.message || 'An unexpected error occurred.');
  }
};

export const getGroupByEvents = async (): Promise<any> => {

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/event/grouped-by-month`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      return prepareServerError(errorResponse?.message || 'An error occurred while fetching data.');
    }

    const eventResponse = await response.json();

    return {
      success: true,
      data: eventResponse.data,
    };
  } catch (error: any) {
    return prepareServerError(error?.message || 'An unexpected error occurred.');
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

export const getPlantedTrees = async (): Promise<any> => {

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/tree/planted-trees`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      return prepareServerError(errorResponse?.message || 'An error occurred while fetching data.');
    }

    const userResponse = await response.json();

    return {
      success: true,
      data: userResponse.data,
    };
  } catch (error: any) {
    return prepareServerError(error?.message || 'An unexpected error occurred.');
  }
};

export const createCheckoutSession = async (
  body: any
): Promise<any> => {
  try {
    const response = await (
      await fetch(
        `${process.env.NEXT_PUBLIC_URL}/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify(body),
        }
      )
    ).json();
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return prepareServerError(error?.message);
  }
};

export const addUpdateEvent = async (
  body: any
): Promise<any> => {
  try {
    const response = await (
      await fetch(
        `${process.env.NEXT_PUBLIC_URL}/event/addupdate-event`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            addUpdateEvent: { ...body },
          }),
        }
      )
    ).json();
    if (response.success) {
      return { success: true, message: response.message }
    } else {
      return { success: false, message: response.message }
    }

  } catch (error: any) {
    return prepareServerError(error?.message);
  }
};

export const getEventsByRegion = async (
  region: string
): Promise<any> => {
  try {
    const response = await (
      await fetch(
        `${process.env.NEXT_PUBLIC_URL}/event/events-by-region?region=${region}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
        }
      )
    ).json();

    if (response?.data) {
      return { response: response?.data }
    }
  } catch (error: any) {
    return prepareServerError(error?.message);
  }
};

export const addUpdateBlog = async (
  data: any
): Promise<any> => {
  try {
    const response = await (
      await fetch(`${process.env.NEXT_PUBLIC_URL}/blog/add-update-blog`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          // Authorization: `Bearer ${await getAccessToken()}`,
        },
        body: JSON.stringify(data),
      })
    ).json();
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return prepareServerError(error?.message);
  }
};

export const deleteBlog = async (blogId: any): Promise<any> => {
  try {
    const response = await (
      await fetch(`${process.env.NEXT_PUBLIC_URL}/blog/${blogId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          // Authorization: `Bearer ${await getAccessToken()}`,
        },
      })
    ).json();
    if (response) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return prepareServerError(response?.message);
    }
  } catch (error: any) {
    return prepareServerError(error?.message);
  }
};

export const paginatedBlog = async (
  data: any
): Promise<any> => {
  try {
    const blogResponse = await (
      await fetch(`${process.env.NEXT_PUBLIC_URL}/blog/paginate-blog`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(data),
      })
    ).json();
    if (blogResponse?.success) {
      return {
        success: true,
        data: blogResponse?.data,
      };
    } else {
      return prepareServerError(blogResponse?.message);
    }
  } catch (error: any) {
    return prepareServerError(error?.message);
  }
};

export const getBlogById = async (id: string): Promise<any> => {
  try {
    const blogResponse = await (
      await fetch(`${process.env.NEXT_PUBLIC_URL}/blog/get-by-id/${id}`, {
        cache: "no-store",
      })
    ).json();
    if (blogResponse?.success) {
      return {
        success: true,
        data: blogResponse?.data,
      };
    } else {
      return prepareServerError(blogResponse?.message);
    }
  } catch (error: any) {
    return prepareServerError(error?.message);
  }
};

export const paginatedEvents = async (
  data: any
): Promise<any> => {
  try {
    const { page, limit } = data;
    const eventResponse = await (
      await fetch(`${process.env.NEXT_PUBLIC_URL}/event/list?page=${page}&limit=${limit}`, {
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

export const deleteEvent = async (eventId: any): Promise<any> => {
  try {
    const response = await (
      await fetch(`${process.env.NEXT_PUBLIC_URL}/event/${eventId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          // Authorization: `Bearer ${await getAccessToken()}`,
        },
      })
    ).json();
    if (response) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return prepareServerError(response?.message);
    }
  } catch (error: any) {
    return prepareServerError(error?.message);
  }
};

