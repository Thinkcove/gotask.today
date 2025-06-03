import React from "react";
import { Avatar, Tooltip } from "@mui/material";
import { colors } from "@/app/common/constants/avatar";

// Utility function to get color based on first letter
const getColorByLetter = (letter: string): string => {
  const index = letter.charCodeAt(0) - 65;
  return colors[index % colors.length];
};

interface AlphabetAvatarProps {
  userName?: string;
  size?: number;
  fontSize?: number;
}

const AlphabetAvatar: React.FC<AlphabetAvatarProps> = ({
  userName = "",
  size = 24,
  fontSize = 12
}) => {
  const letter = userName.charAt(0).toUpperCase() || "-";
  const bgColor = getColorByLetter(letter);

  return (
    <Tooltip title={userName} arrow>
      <Avatar sx={{ height: size, width: size, fontSize, bgcolor: bgColor }}>{letter}</Avatar>
    </Tooltip>
  );
};

export default AlphabetAvatar;
