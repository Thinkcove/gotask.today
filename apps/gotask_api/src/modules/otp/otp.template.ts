// otp.template.ts
export const getOtpTemplate = (otp: string, lang: string) => {
  const messages: Record<string, string> = {
    en: `Your OTP is <b>${otp}</b>. It is valid for 5 minutes.`,
    fr: `Votre code OTP est <b>${otp}</b>. Il est valable pendant 5 minutes.`,
    hi: `आपका ओटीपी है <b>${otp}</b>। यह 5 मिनट के लिए मान्य है।`,
  };

  return `
    <html>
      <body>
        <p>${messages[lang] || messages["en"]}</p>
      </body>
    </html>
  `;
};
