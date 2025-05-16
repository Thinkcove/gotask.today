"use client";

import React, { useState } from "react";
import { Typography } from "@mui/material";
import { StyledTextField, StyledButton } from "./style";
import { useUser } from "../userContext";
import env from "../common/env";
import { LOCALIZATION } from "../common/constants/localization";
import { useTranslations } from "next-intl";

const OtpLogin = () => {
  const translogin = useTranslations(LOCALIZATION.TRANSITION.LOGINCARD);
  const { setUser } = useUser();

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

      if (res.ok && data.success) {
        // Save user WITHOUT token
        localStorage.setItem("user", JSON.stringify(data.user));
        // Save token separately (your fetchToken() expects token saved separately)
        localStorage.setItem("token", data.token);
        
        // Update context with user + token
        setUser({ ...data.user, token: data.token });

        // Redirect to dashboard
        window.location.href = "/portal/dashboard";
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
