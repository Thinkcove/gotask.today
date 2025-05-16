"use client";
import React, { useState } from "react";
import { Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { StyledButton, StyledTextField } from "./style";
import { useUser } from "../userContext";
import env from "../common/env";
import { LOCALIZATION } from "../common/constants/localization";
import { useTranslations } from "next-intl";

const EmailLogin = () => {
  const translogin = useTranslations(LOCALIZATION.TRANSITION.LOGINCARD);
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = async (userId: string, password: string) => {
    const response = await fetch(`${env.API_BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, password }),
    });
    const data = await response.json();
    return response.ok ? data : { success: false, error: data.error };
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError(translogin("seterror"));
      return;
    }
    setError("");
    setLoading(true);
    const response = await loginUser(email, password);
    if (response.success) {
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser({ ...user, token });
      window.location.href = "/portal/dashboard";
    } else {
      setError(response.error);
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
        InputProps={{ sx: { height: 56 } }}
      />
      <StyledTextField
        fullWidth
        label={translogin("labelpassword")}
        type={showPassword ? "password" : "text"}
        variant="outlined"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          sx: { height: 56 },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      {error && <Typography color="error">{error}</Typography>}
      <StyledButton fullWidth variant="contained" onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </StyledButton>
    </>
  );
};

export default EmailLogin;
