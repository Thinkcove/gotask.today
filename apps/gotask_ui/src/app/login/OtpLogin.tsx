"use client";

import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import { StyledTextField, StyledButton } from "./style";
import { useUser } from "../userContext";
import env from "../common/env";
import { LOCALIZATION } from "../common/constants/localization";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { EMAIL_UPPERCASE_REGEX } from "../common/constants/regex";
import { storeTokens } from "../common/utils/authToken";

const OtpLogin = () => {
  const translogin = useTranslations(LOCALIZATION.TRANSITION.LOGINCARD);
  const { setUser } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      setError(translogin("emailrequired"));
      return;
    }

    if (EMAIL_UPPERCASE_REGEX.test(email)) {
      setError(translogin("emailuppercase"));
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
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setError(translogin("otprequired"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${env.API_BASE_URL}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: email, otp }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        const { user, token, refreshToken } = data.data;

        localStorage.setItem("user", JSON.stringify(user));
        storeTokens(token, refreshToken, rememberMe);

        setUser({ ...user, token, refreshToken });
        router.replace("/dashboard");
      } else {
        setError(data.error || data.message || translogin("otperror"));
      }
    } catch {
      setError(translogin("genericerror"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    otpSent ? verifyOtp() : sendOtp();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <StyledTextField
        fullWidth
        label={translogin("labelemail")}
        variant="outlined"
        margin="normal"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError("");
        }}
        disabled={otpSent}
        InputProps={{ sx: { height: 56 } }}
        autoComplete="email"
        type="email"
      />

      {otpSent && (
        <StyledTextField
          fullWidth
          label={translogin("otpinput")}
          variant="outlined"
          margin="normal"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value);
            setError("");
          }}
          InputProps={{ sx: { height: 56 } }}
          autoComplete="one-time-code"
        />
      )}

      {otpSent && (
        <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{ marginRight: 8 }}
            disabled={otp.trim() === ""}
          />
          <label htmlFor="rememberMe">{translogin("rememberme")}</label>
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <StyledButton
        fullWidth
        variant="contained"
        type="submit"
        disabled={loading || (otpSent ? otp.trim() === "" : email.trim() === "")}
      >
        {loading
          ? translogin("loading")
          : otpSent
          ? translogin("verifyotp")
          : translogin("sendotp")}
      </StyledButton>
    </form>
  );
};

export default OtpLogin;
