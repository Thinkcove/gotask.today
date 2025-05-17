"use client";

import React, { useState } from "react";
import { Typography } from "@mui/material";
import { StyledTextField, StyledButton } from "./style";
import { useUser } from "../userContext";
import env from "../common/env";
import { LOCALIZATION } from "../common/constants/localization";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation"; // ✅ App Router

const OtpLogin = () => {
  const translogin = useTranslations(LOCALIZATION.TRANSITION.LOGINCARD);
  const { setUser } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async () => {
    if (!email) {
      setError(translogin("emailrequired"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${env.API_BASE_URL}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
      } else {
        setError(data.error || data.message || translogin("otpfail"));
      }
    } catch {
      setError(translogin("genericerror"));
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!otp) {
      setError(translogin("otprequired"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${env.API_BASE_URL}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: email, otp }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.data) {
        const { user, token } = data.data;

        // ✅ Save user and token
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        // ✅ Update context
        setUser({ ...user, token });

        // ✅ Redirect to dashboard
        router.push("/portal/dashboard");
      } else {
        setError(data.error || data.message || translogin("otperror"));
      }
    } catch {
      setError(translogin("genericerror"));
    }
    setLoading(false);
  };

  return (
    <>
      <StyledTextField
        fullWidth
        label={translogin("labelemail")}
        variant="outlined"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={otpSent}
        InputProps={{ sx: { height: 56 } }}
      />

      {otpSent && (
        <StyledTextField
          fullWidth
          label={translogin("otpinput")}
          variant="outlined"
          margin="normal"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          InputProps={{ sx: { height: 56 } }}
        />
      )}

      {error && <Typography color="error">{error}</Typography>}

      <StyledButton
        fullWidth
        variant="contained"
        onClick={otpSent ? verifyOtp : sendOtp}
        disabled={loading}
      >
        {loading
          ? translogin("loading")
          : otpSent
          ? translogin("verifyotp")
          : translogin("sendotp")}
      </StyledButton>
    </>
  );
};

export default OtpLogin;
