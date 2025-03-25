"use client";
import React, { useState } from "react";
import { Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  BackgroundContainer,
  LoginCard,
  StyledButton,
  StyledTextField,
} from "./style";
import { useUser } from "../userContext";
import env from "../common/env";

const LoginForm = () => {
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true); // Toggle password visibility
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = async (userId: string, password: string) => {
    const response = await fetch(`${env.API_BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        password: password,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    return data;
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Both fields are required");
      return;
    }
    setError("");
    setLoading(true);
    const response = await loginUser(email, password);
    if (response.success) {
      const { token, user } = response.data;
      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      // Update global state
      setUser({ ...user, token });
      // Redirect to dashboard
      window.location.href = "/portal/task";
    } else {
      setError(response.error);
    }
    setLoading(false);
  };

  return (
    <BackgroundContainer>
      <LoginCard>
        <Typography variant="h4" gutterBottom style={{ fontWeight: "bold" }}>
          Go Task Today
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          "Work smarter, own your time."
        </Typography>
        <StyledTextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
          id="email-input"
          InputProps={{ sx: { height: 56 } }}
        />

        <StyledTextField
          fullWidth
          label="Password"
          type={showPassword ? "password" : "text"} // Toggle between text & password
          variant="outlined"
          margin="normal"
          value={password || ""}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            sx: { height: 56 },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {error && <Typography color="error">{error}</Typography>}
        <StyledButton
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </StyledButton>
      </LoginCard>
    </BackgroundContainer>
  );
};

export default LoginForm;
