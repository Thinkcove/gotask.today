export type CustomerType = "INDIVIDUAL" | "ENTERPRISE";
export type PlatformType = "WEB" | "APP";

interface OtpConfig {
  length: number;
  expiryInMinutes: number;
}

export const getOtpConfig = (customerType: CustomerType, platform: PlatformType): OtpConfig => {
  if (customerType === "ENTERPRISE") {
    return platform === "APP"
      ? { length: 8, expiryInMinutes: 10 }
      : { length: 6, expiryInMinutes: 5 };
  }

  // Default or INDIVIDUAL
  return platform === "APP" ? { length: 6, expiryInMinutes: 5 } : { length: 4, expiryInMinutes: 3 };
};
