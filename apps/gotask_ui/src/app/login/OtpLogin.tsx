"use client";

import React, { useEffect, useState } from "react";
import { Typography, Box, CircularProgress, Button } from "@mui/material";
import { StyledTextField, StyledButton } from "./style";
import { useUser } from "../userContext";
import env from "../common/env";
import { LOCALIZATION } from "../common/constants/localization";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { EMAIL_UPPERCASE_REGEX } from "../common/constants/regex";
import { storeToken, isTokenExpired, fetchToken } from "../common/utils/authToken";

const OtpLogin = () => {
  const translogin = useTranslations(LOCALIZATION.TRANSITION.LOGINCARD);
  const { setUser } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const startCountdown = (count: number) => {
    setResendTimer(count);

    const tick = (remaining: number) => {
      if (remaining > 0) {
        setTimeout(() => {
          setResendTimer(remaining - 1);
          tick(remaining - 1); // recursive call
        }, 1000);
      }
    };

    tick(count);
  };

  useEffect(() => {
    const token = fetchToken();
    if (token && !isTokenExpired(token)) {
      router.replace("/dashboard");
    }
  }, [router]);

  const sendOtp = async () => {
    if (loading || hasSubmitted) return;

    if (!email.trim()) {
      setError(translogin("emailrequired"));
      return;
    }

    if (EMAIL_UPPERCASE_REGEX.test(email)) {
      setError(translogin("emailuppercase"));
      return;
    }

    setError("");
    setLoading(true);
    setHasSubmitted(true);

    try {
      const res = await fetch(`${env.API_BASE_URL}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: email })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOtpSent(true);
        startCountdown(60);
      } else {
        setError(data.error || data.message || translogin("otpfail"));
      }
    } catch {
      setError(translogin("genericerror"));
    } finally {
      setLoading(false);
      setHasSubmitted(false);
    }
  };

  const verifyOtp = async () => {
    if (loading || hasSubmitted) return;

    if (!otp.trim()) {
      setError(translogin("otprequired"));
      return;
    }

    setError("");
    setLoading(true);
    setHasSubmitted(true);

    try {
      const res = await fetch(`${env.API_BASE_URL}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: email, otp, rememberMe })
      });

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        const { user, token } = data.data;
        storeToken(token, rememberMe, user);
        setUser({ ...user, token });
        router.replace("/dashboard");
      } else {
        setError(data.error || data.message || translogin("otperror"));
      }
    } catch {
      setError(translogin("genericerror"));
    } finally {
      setLoading(false);
      setHasSubmitted(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || hasSubmitted) return;

    if (otpSent) {
      await verifyOtp();
    } else {
      await sendOtp();
    }
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
        disabled={otpSent || loading}
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
          disabled={loading}
          InputProps={{ sx: { height: 56 } }}
          autoComplete="one-time-code"
        />
      )}

      {otpSent && (
        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection="row-reverse"
          alignItems="center"
          sx={{ mt: 1 }}
        >
          <Button onClick={sendOtp} disabled={loading || resendTimer > 0} sx={{ minWidth: 100 }}>
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
          </Button>

          <Box display="flex" alignItems="center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ marginLeft: 8 }}
              disabled={loading}
            />
            <label htmlFor="rememberMe" style={{ marginLeft: 4 }}>
              {translogin("rememberme")}
            </label>
          </Box>
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
        disabled={loading || hasSubmitted || (otpSent ? otp.trim() === "" : email.trim() === "")}
        sx={{
          opacity: loading ? 0.7 : 1,
          pointerEvents: loading ? "none" : "auto"
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : otpSent ? (
          translogin("verifyotp")
        ) : (
          translogin("sendotp")
        )}
      </StyledButton>
    </form>
  );
};

export default OtpLogin;
