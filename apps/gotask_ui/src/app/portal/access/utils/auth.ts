
// Function to get the authentication token from localStorage or sessionStorage
export const getAuthToken = (): string | null => {
  // You can change this to sessionStorage or wherever you store the token
  return localStorage.getItem("auth_token"); 
};

// Function to set the authentication token to localStorage
export const setAuthToken = (token: string): void => {
  // Store the token in localStorage (or sessionStorage)
  localStorage.setItem("auth_token", token);
};

// Function to remove the authentication token from localStorage
export const removeAuthToken = (): void => {
  // Remove the token when logging out
  localStorage.removeItem("auth_token");
};
