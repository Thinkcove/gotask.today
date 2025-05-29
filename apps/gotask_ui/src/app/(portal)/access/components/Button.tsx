import React from "react";
import Link from "next/link";
import { Button as MUIButton, CircularProgress } from "@mui/material";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
  isLoading?: boolean;
  fullWidth?: boolean;
  href?: string; 
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, type = "button", isLoading, fullWidth, href }) => {
  if (href) {
    return (
      <Link href={href} passHref>
        <MUIButton
          variant="contained"
          fullWidth={fullWidth}
          className="bg-blue-600 hover:bg-blue-700 transition duration-200 text-white px-5 py-2 rounded-lg"
        >
          {text}
        </MUIButton>
      </Link>
    );
  }

  return (
    <MUIButton
      type={type}
      onClick={onClick}
      variant="contained"
      fullWidth={fullWidth}
      disabled={isLoading}
      className="bg-blue-600 hover:bg-blue-700 transition duration-200 text-white px-5 py-2 rounded-lg"
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : text}
    </MUIButton>
  );
};

export default Button;
