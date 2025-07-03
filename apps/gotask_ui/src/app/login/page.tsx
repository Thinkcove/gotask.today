"use client";

import React from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import LoginForm from "./loginForm";
import { fetchToken, isTokenExpired } from "../common/utils/authToken";

// SWR fetcher for token validation
const authFetcher = () => {
  const token = fetchToken();
  if (!token || isTokenExpired(token)) return null;
  return { token };
};

const LoginPage = () => {
  const router = useRouter();

  const { data, isLoading } = useSWR("auth-check", authFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000
  });


  if (data?.token) {
    Promise.resolve().then(() => router.replace("/dashboard"));

    // loader
    return (
      <Box
        height="100vh"
        width="100vw"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ backgroundColor: "#f5f7fa" }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  //  loader while checking
  if (isLoading) {
    return (
      <Box
        height="100vh"
        width="100vw"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ backgroundColor: "#f5f7fa" }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }


  return <LoginForm />;
};

export default LoginPage;
