// Centralized error handling function with switch statement
const handleApiError = (error: any) => {
  if (error.response && error.response.statusCode) {
    switch (error.response.statusCode) {
      case 401:
        console.error("Unauthorized: Token expired or invalid");
        window.location.href = "/login"; // Redirect to login page
        break;
      default:
        console.error(`API Error: ${error.message}`);
        throw error; // Rethrow other errors
    }
  } else {
    console.error(`Unexpected error: ${error.message}`);
    throw error;
  }
};

// apiHeaders function (unchanged)
export const apiHeaders = (token?: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json"
});

// postData function
export const postData = async (url: string, payload: Record<string, unknown>, token: string) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: apiHeaders(token),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw {
        message: `HTTP error! Status: ${response.status}`,
        response: errorResponse
      };
    }
    return response.json();
  } catch (error) {
    handleApiError(error); // Use centralized error handling
  }
};

// putData function
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
        message: `HTTP error! Status: ${response.status}`,
        response: errorResponse
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
      headers: apiHeaders(token)
    });
    if (!response.ok) {
      const errorResponse = await response.json(); // Parse error response
      throw {
        message: `HTTP error! Status: ${response.status}`,
        response: errorResponse
      };
    }
    const data = await response.json();
    return data;
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
      headers: apiHeaders(token)
    };
    if (payload) {
      options.body = JSON.stringify(payload);
    }
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorResponse = await response.json(); // Parse error response
      throw {
        message: `HTTP error! Status: ${response.status}`,
        response: errorResponse
      };
    }
    return await response.json();
  } catch (error) {
    handleApiError(error);
  }
};
