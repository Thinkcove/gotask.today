export const NotificationChannelConfig = {
  email: process.env.ENABLE_EMAIL_NOTIFICATIONS === "true",
  sms: process.env.ENABLE_SMS_NOTIFICATIONS === "true",
  inApp: process.env.ENABLE_INAPP_NOTIFICATIONS === "true"
};
