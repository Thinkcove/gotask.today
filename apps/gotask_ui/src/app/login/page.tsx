"use client";

import React, { useEffect, useState } from "react";
import LoginForm from "./loginForm";
import { CircularProgress, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { fetchToken, isTokenExpired } from "../common/utils/authToken";

const LoginPage = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = fetchToken();
    const valid = token && !isTokenExpired(token);

    if (valid) {
      router.replace("/dashboard");
    }

    // Delay added for smoother loader transition
    const delay = setTimeout(() => {
      setCheckingAuth(false);
    }, 1000);

    return () => clearTimeout(delay);
  }, [router]);

  if (checkingAuth) {
    return (
      <Box
        height="100vh"
        width="100vw"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          background: "#f5f7fa",
          transition: "opacity 0.3s ease-in-out"
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  return <LoginForm />;
};

export default LoginPage;
