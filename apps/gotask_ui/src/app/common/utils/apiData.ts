// Centralized error handling function
const handleApiError = (error: any) => {
  const statusCode = error?.response?.statusCode || error?.response?.status;

  switch (true) {
    case statusCode === 401:
      console.error("Unauthorized: Token expired or invalid");
      window.location.href = "/login";
      break;

    case !!statusCode:
      console.error(`API Error: ${error.message}`);
      throw error; //

    default:
      console.error(`Unexpected error: ${error?.message || "Unknown error"}`);
      throw error; //
  }
};

// API headers generator
export const apiHeaders = (token?: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json"
});

// POST request
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
      const errorResponse = await response.json();
      throw {
        message: errorResponse?.message || `HTTP error! Status: ${response.status}`,
        response: {
          status: response.status,
          ...errorResponse
        }
      };
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// PUT request
export const putData = async (url: string, payload: Record<string, unknown>, token?: string) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: apiHeaders(token),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw {
        message: errorResponse?.message || `HTTP error! Status: ${response.status}`,
        response: {
          status: response.status,
          ...errorResponse
        }
      };
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// GET request
export const getData = async (url: string, token?: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: apiHeaders(token)
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw {
        message: errorResponse?.message || `HTTP error! Status: ${response.status}`,
        response: {
          status: response.status,
          ...errorResponse
        }
      };
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};

// DELETE request
export const deleteData = async (
  url: string,
  token?: string,
  payload?: Record<string, unknown>
) => {
  try {
    const options: RequestInit = {
      method: "DELETE",
      headers: apiHeaders(token)
    };

    if (payload) {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorResponse = await response.json();
      throw {
        message: errorResponse?.message || `HTTP error! Status: ${response.status}`,
        response: {
          status: response.status,
          ...errorResponse
        }
      };
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};
