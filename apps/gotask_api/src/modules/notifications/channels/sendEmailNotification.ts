// src/modules/notifications/channels/sendEmailNotification.ts

import axios from "axios";
import { NotificationPayload } from "../types/notification.interface";

export const sendEmailNotification = async ({ userId, title, message }: NotificationPayload) => {
  try {
    const accessToken = process.env.ZOHO_ACCESS_TOKEN; // Should be managed and refreshed elsewhere

    const response = await axios.post(
      "https://mail.zoho.com/api/accounts/{account_id}/messages", // Replace with /send or correct endpoint
      {
        fromAddress: process.env.ZOHO_FROM_EMAIL,
        toAddress: "user@example.com", // TODO: Lookup user's email using userId
        subject: title,
        content: message,
        contentType: "text/html"
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Zoho Email Sent:", response.data);
  } catch (error: any) {
    console.error("Zoho Email Error:", error?.response?.data || error.message);
  }
};
