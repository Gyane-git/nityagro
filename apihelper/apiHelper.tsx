const baseUrl = (
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  ""
)
  .trim()
  .replace(/\/$/, "");

const resolveUrl = (url: string) => {
  const cleanUrl = url.trim();
  if (/^https?:\/\//i.test(cleanUrl)) return cleanUrl;
  if (!baseUrl) return cleanUrl;
  return `${baseUrl}${cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`}`;
};

// Generic API response type
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: unknown;
}

interface ApiRequestOptions extends RequestInit {
  headers?: HeadersInit;
  withCredentials?: boolean;
}

// Main request function
export const apiRequest = async <T = unknown>(
  url: string,
  tokenReq: boolean = false, // changed default
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  const fullUrl = resolveUrl(url);

  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("token")
      : null;

  const headers: HeadersInit = {
    Accept: "application/json",
    ...(tokenReq && token
      ? { Authorization: `Bearer ${token}` }
      : {}),
    ...(options.body && !(options.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...options.headers,
  };

  try {
    console.log("API URL:", fullUrl);

    const response = await fetch(fullUrl, {
      ...options,
      headers,
      credentials: options.withCredentials ? "include" : "same-origin",
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!data) {
      return {
        success: false,
        message: "Empty response from server",
      };
    }

    return response.ok
      ? data
      : {
          success: false,
          ...data,
        };
  } catch (error: unknown) {
    console.error("API Network Error:", error);
    const message =
      error instanceof Error ? error.message : "Network error";

    return {
      success: false,
      message,
    };
  }
};

// POST
export const apiPostRequest = async <T = unknown>(
  url: string,
  data: unknown,
  tokenReq: boolean = false
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, tokenReq, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// PUT
export const apiPutRequest = async <T = unknown>(
  url: string,
  data: unknown,
  tokenReq: boolean = true
): Promise<ApiResponse<T>> => {
  const isFormData = data instanceof FormData;
  return apiRequest<T>(url, tokenReq, {
    method: "PUT",
    body: isFormData ? data : JSON.stringify(data),
  });
};

// DELETE
export const apiDeleteRequest = async <T = unknown>(
  url: string,
  data?: unknown,
  tokenReq: boolean = true
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, tokenReq, {
    method: "DELETE",
    ...(data ? { body: JSON.stringify(data) } : {}),
  });
};

// GET
export const apiGetRequest = async <T = unknown>(
  url: string,
  tokenReq: boolean = false
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(url, tokenReq, {
    method: "GET",
  });
};

export const apiUploadRequest = async <T = unknown>(
  url: string,
  formData: FormData,
  tokenReq: boolean = false,
  withCredentials: boolean = false,
  method: "POST" | "PUT" = "POST"
): Promise<ApiResponse<T>> => {
  const fullUrl = resolveUrl(url);
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("token")
      : null;

  const headers: HeadersInit = {
    Accept: "application/json",
    ...(tokenReq && token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(fullUrl, {
      method,
      body: formData,
      headers,
      credentials: withCredentials ? "include" : "same-origin",
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!data) {
      return {
        success: false,
        message: "Empty response from server",
      };
    }

    return response.ok
      ? data
      : {
          success: false,
          ...data,
        };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Network error";
    return {
      success: false,
      message,
    };
  }
};
