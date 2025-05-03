export const apiHeaders = (token?: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json"
});

// postData function
export const postData = async (url: string, payload: Record<string, unknown>, token: string) => {
  const response = await fetch(url, {
    method: "POST",
    headers: apiHeaders(token),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    // Parse the error response
    const errorResponse = await response.json();
    // Throw an error with the response details
    throw {
      message: `HTTP error! Status: ${response.status}`,
      response: errorResponse // Include the error response details
    };
  }
  return response.json();
};

// putData function
export const putData = async (url: string, payload: Record<string, unknown>, token?: string) => {
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
};

//GETData function
export const getData = async (url: string, token?: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: apiHeaders(token)
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

//delete
export const deleteData = async (
  url: string,
  payload?: Record<string, unknown>,
  token?: string
) => {
  const options: RequestInit = {
    method: "DELETE",
    headers: apiHeaders(token)
  };
  if (payload) {
    options.body = JSON.stringify(payload);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return await response.json();
};
