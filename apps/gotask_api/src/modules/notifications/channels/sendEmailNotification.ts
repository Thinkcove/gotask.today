// Updated sendEmailNotification.ts
import axios from "axios";
import { NotificationPayload } from "../types/notification.interface";
import { User } from "../../../domain/model/user/user";
import { getAccessToken } from "../zohoTokenManager";

const getUserEmailById = async (userId: string): Promise<string> => {
  const user = await User.findOne({ id: userId });
  return user?.user_id || "";
};

export const sendEmailNotification = async (payload: NotificationPayload) => {
  const { userId, title, message } = payload;
  const accountId = process.env.ZOHO_ACCOUNT_ID;
  const fromAddress = process.env.ZOHO_FROM_EMAIL;

  const toAddress = await getUserEmailById(userId);
  if (!toAddress) {
    console.warn(` Email not found for user ID: ${userId}`);
    return;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6;">
      <p>${message}</p>
      <br/>
      <p style="font-size: 12px; color: #777;">This is an automated notification from the GoTaskToday system.</p>
    </div>
  `;

  const sendEmail = async (accessToken: string) => {
    return axios.post(
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
  };

  try {
    const token = await getAccessToken();
    const response = await sendEmail(token);
    console.log("📧 Zoho Email Sent:", response.data);
  } catch (error: any) {
    const errorMsg = error?.response?.data?.message || error?.message || "";
    console.error("Zoho Email Error:", errorMsg);

    if (error?.response?.status === 401 || errorMsg.includes("Invalid OAuth")) {
      console.warn("🔁 Attempting to refresh Zoho access token...");
      const newToken = await getAccessToken(); // This refreshes if expired
      try {
        const retryResponse = await sendEmail(newToken);
        console.log("📧 Zoho Email Sent after token refresh:", retryResponse.data);
      } catch (retryError: any) {
        console.error("❌ Retry failed:", retryError?.response?.data || retryError.message);
      }
    }
  }
};
