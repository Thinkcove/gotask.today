import axios from "axios";
import { NotificationPayload } from "../types/notification.interface";
import { User } from "../../../domain/model/user/user";

// Helper to get the user email based on user ID
const getUserEmailById = async (userId: string): Promise<string> => {
  const user = await User.findOne({ id: userId });
  return user?.user_id || ""; // user_id is the email
};

export const sendEmailNotification = async (payload: NotificationPayload) => {
  try {
    const { userId, title, message } = payload;

    const accessToken = process.env.ZOHO_ACCESS_TOKEN;
    const accountId = process.env.ZOHO_ACCOUNT_ID;
    const fromAddress = process.env.ZOHO_FROM_EMAIL;

    const toAddress = await getUserEmailById(userId);
    if (!toAddress) {
      console.warn(`⚠️ Email not found for user ID: ${userId}`);
      return;
    }

    // ✨ Styled HTML content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6;">
        <p>Hi,</p>
        <p>${message}</p>
        <br/>
        <p style="font-size: 12px; color: #777;">This is an automated notification from the HRMS system.</p>
      </div>
    `;

    const response = await axios.post(
      `https://mail.zoho.in/api/accounts/${accountId}/messages`,
      {
        fromAddress,
        toAddress,
        subject: title,
        content: htmlContent,
        mailFormat: "html"
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Zoho Email Sent:", response.data);
  } catch (error: any) {
    console.error("❌ Zoho Email Error:", error?.response?.data || error.message);
  }
};
