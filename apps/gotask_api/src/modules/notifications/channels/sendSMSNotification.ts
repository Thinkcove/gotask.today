import axios from "axios";
import { NotificationPayload } from "../types/notification.interface";

// Replace with actual DB logic to get user's phone number
const getUserPhoneNumber = async (userId: string): Promise<string> => {
  // TODO: Lookup user's phone number from the User collection/model using userId
  return "+91XXXXXXXXXX"; // Placeholder
};

export const sendSMSNotification = async ({ userId, message }: NotificationPayload) => {
  try {
    const phoneNumber = await getUserPhoneNumber(userId);

    const response = await axios.post(
      "https://api.yoursmsprovider.com/send", // 🔁 Replace with your SMS provider endpoint
      {
        to: phoneNumber,
        from: process.env.SMS_SENDER_ID || "GoTask",
        message: message
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SMS_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ SMS sent successfully:", response.data);
  } catch (err: any) {
    console.error("❌ SMS Notification Failed:", err?.response?.data || err.message);
  }
};
