// cpannel
//https://s786.bom1.mysecurecloudhost.com:2083/logout/?locale=en
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "No url";

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

// Options type
interface ApiRequestOptions extends RequestInit {
  headers?: HeadersInit;
}

// Main request function
export const apiRequest = async <T = any>(
  url: string,
  tokenReq: boolean = true,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  const fullUrl = `${baseUrl}${url}`;

  // Get token only on client side
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    ...(tokenReq && token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.method && options.method !== "GET"
      ? { "Content-Type": "application/json" }
      : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!data) {
      return {
        success: false,
        message: "Server returned invalid JSON.",
      };
    }

    return response.ok
      ? data
      : {
          success: false,
          ...data,
        };
  } catch (error) {
    console.error("API Network Error:", error);
    return {
      success: false,
      message: "Network error or server unreachable.",
    };
  }
};

// POST helper
export const apiPostRequest = async <T = any>(
  url: string,
  data: any,
  tokenReq: boolean = true
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, tokenReq, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
// PUT helper
export const apiPutRequest = async <T = any>(
  url: string,
  data: any,
  tokenReq: boolean = true
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, tokenReq, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
// POST helper
export const apiDeleteRequest = async <T = any>(
  url: string,
  data: any,
  tokenReq: boolean = true
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, tokenReq, {
    method: "DELETE",
    body: JSON.stringify(data),
  });
};
// GET helper
export const apiGetRequest = async <T = any>(
  url: string,
  tokenReq: boolean = true
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, tokenReq, {
    method: "GET",
  });
};




// "use client";
// import { useState } from "react";


// import { getCustomerInfo } from "./customerApi";
// import useCartStore from "@/stores/useCartStore";
// import { toast } from "react-hot-toast";
// import useInfoModalStore from "@/stores/infoModalStore";
// import useWarningModalStore from "@/stores/warningModalStore";
// import { baseUrl } from "../utils/config";
// import { apiRequest } from "./apiCall";

//  const API_URL = `${baseUrl}/getCategory`;

// // const API_URL = 'http://192.168.1.85:8000/api/getCategory';


    
// //add address
// export const addCustomerAddress = async (categoryData) => {
//   try {
//     const payload = {
//       CategoryDesc: categoryData.CategoryDesc,
//       Status: categoryData.Status,
//       EnterBy: categoryData.EnterBy,
//       EnterDate: categoryData.EnterDate,
//       Gadget: categoryData.Gadget,
//       CategoryImg: categoryData.CategoryImg,
    
//     };
//     const response = await apiRequest(`/saveCategory`, true, {
//       method: "POST",
//       body: JSON.stringify(payload),
//     });
//     console.log("response from addCustomerAddress", response);
//     console.log("response.success", response.success);
//     // const responseData = await response.json();
//     // console.log("responseData", responseData);
//     if (response.success) {
//       // console.log("response.message", response.message);
//       toast.success(response.message);
//       return {
//         success: true,
//         message: response.message || "Category added successfully",
//         data: response.data,
//       };
//     } else {
//       if (!response.success) {
//         const errorBody = response;

//         const errorMessage =
//           errorBody?.errors?.[0]?.message ||
//           errorBody?.message ||
//           "Something went wrong";

//         toast.error(errorMessage);
//         console.log("errorMessage", errorMessage);
//         return {
//           success: false,
//           message: errorMessage,
//         };
//       }
//     }
//   } catch (err) {
//     console.error("Error adding address:", err);
//     return { success: false, message: "An unexpected error occurred" };
//   }
// };

