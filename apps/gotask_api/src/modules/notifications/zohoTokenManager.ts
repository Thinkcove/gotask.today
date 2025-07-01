// src/modules/notifications/services/zohoTokenManager.ts
import axios from "axios";

let cachedToken: string | null = process.env.ZOHO_ACCESS_TOKEN || null;

export const getAccessToken = async (): Promise<string> => {
  if (cachedToken) return cachedToken;

  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  if (!refreshToken) throw new Error("Missing Zoho refresh token");

  const response = await axios.post("https://accounts.zoho.in/oauth/v2/token", null, {
    params: {
      refresh_token: refreshToken,
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      grant_type: "refresh_token"
    }
  });

  const newAccessToken = response.data.access_token;
  cachedToken = newAccessToken; 

  console.log("Refreshed Zoho access token");
  return newAccessToken;
};
