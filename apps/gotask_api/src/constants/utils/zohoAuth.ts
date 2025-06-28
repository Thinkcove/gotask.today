// src/utils/zohoAuth.ts
import axios from "axios";

export const getFreshAccessToken = async (): Promise<string> => {
  try {
    const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN } = process.env;

    const response = await axios.post("https://accounts.zoho.com/oauth/v2/token", null, {
      params: {
        refresh_token: ZOHO_REFRESH_TOKEN,
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token"
      }
    });

    const accessToken = response.data.access_token;

    return accessToken;
  } catch (error: any) {
    console.error("🔴 Failed to refresh Zoho access token:", error?.response?.data || error.message);
    throw new Error("Could not refresh Zoho token");
  }
};
