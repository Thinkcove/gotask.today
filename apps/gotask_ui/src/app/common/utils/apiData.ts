// src/app/common/utils/apiData.ts
// Centralized error handling function with switch statement
const handleApiError = (error: any) => {
  switch (true) {
    case !!error.response && !!error.response.statusCode && error.response.statusCode === 401:
      console.error("Unauthorized: Token expired or invalid");
      window.location.href = "/login"; // Redirect to login page
      break;
    case !!error.response && !!error.response.statusCode:
      console.error(`API Error: ${error.message}`);
      throw error; // Rethrow other API errors
    default:
      console.error(`Unexpected error: ${error.message}`);
      throw error; // Rethrow unexpected errors
  }
};

// apiHeaders function
export const apiHeaders = (token?: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const postData = async (
  url: string,
  data: Record<string, unknown> | FormData,
  token?: string
) => {
  try {
    const isFormData = data instanceof FormData;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(!isFormData && { "Content-Type": "application/json" })
      },
      body: isFormData ? data : JSON.stringify(data)
    });

    if (!response.ok) {
      let errorResponse;
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        errorResponse = await response.json();
      } else {
        const text = await response.text();
        throw {
          message: `HTTP error! Status: ${response.status}, Received non-JSON response: ${text.slice(0, 100)}`,
          response: { statusCode: response.status },
        };
      }
      throw {
        message: `HTTP error! Status: ${response.status}`,
        response: errorResponse,
      };
    }
    return response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// putData function
export const putData = async (url: string, payload: Record<string, unknown>, token?: string) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: apiHeaders(token),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorResponse;
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        errorResponse = await response.json();
      } else {
        const text = await response.text();
        throw {
          message: `HTTP error! Status: ${response.status}, Received non-JSON response: ${text.slice(0, 100)}`,
          response: { statusCode: response.status },
        };
      }
      throw {
        message: `HTTP error! Status: ${response.status}`,
        response: errorResponse,
      };
    }
    return response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// getData function
export const getData = async (url: string, token?: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: apiHeaders(token),
    });

    if (!response.ok) {
      let errorResponse;
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        errorResponse = await response.json();
      } else {
        const text = await response.text();
        throw {
          message: `HTTP error! Status: ${response.status}, Received non-JSON response: ${text.slice(0, 100)}`,
          response: { statusCode: response.status },
        };
      }
      throw {
        message: `HTTP error! Status: ${response.status}`,
        response: errorResponse,
      };
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      throw {
        message: `Expected JSON but received non-JSON response: ${text.slice(0, 100)}`,
        response: { statusCode: response.status },
      };
    }
  } catch (error) {
    handleApiError(error);
  }
};

// deleteData function
export const deleteData = async (
  url: string,
  token?: string,
  payload?: Record<string, unknown>
) => {
  try {
    const options: RequestInit = {
      method: "DELETE",
      headers: apiHeaders(token),
    };
    if (payload) {
      options.body = JSON.stringify(payload);
    }
    const response = await fetch(url, options);
    if (!response.ok) {
      let errorResponse;
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        errorResponse = await response.json();
      } else {
        const text = await response.text();
        throw {
          message: `HTTP error! Status: ${response.status}, Received non-JSON response: ${text.slice(0, 100)}`,
          response: { statusCode: response.status },
        };
      }
      throw {
        message: `HTTP error! Status: ${response.status}`,
        response: errorResponse,
      };
    }
    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};