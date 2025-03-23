"use client";
import React from "react";
import dynamic from "next/dynamic";

const Login = dynamic(() => import("../login/loginForm"), {
  ssr: false,
});

const Loginpage = () => {
  return <Login />;
};

export default Loginpage;
