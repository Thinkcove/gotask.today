// otp.config.ts

interface OtpCustomerConfig {
  otpLength: number;
  expiryMinutes: number;
  maxAttempts: number;
  emailSender: string;
  language: "en" | "hi" | "fr";
}

export const OtpConfigMap: Record<string, OtpCustomerConfig> = {
  default: {
    otpLength: 6,
    expiryMinutes: 5,
    maxAttempts: 3,
    emailSender: "no-reply@hrms.com",
    language: "en"
  },
  "web_customerA": {
    otpLength: 4,
    expiryMinutes: 3,
    maxAttempts: 2,
    emailSender: "support@customerA.com",
    language: "en"
  },
  "app_customerB": {
    otpLength: 6,
    expiryMinutes: 10,
    maxAttempts: 5,
    emailSender: "otp@app.customerB.com",
    language: "fr"
  }
};

export const getOtpConfig = (key: string) => {
  return OtpConfigMap[key] || OtpConfigMap["default"];
};
