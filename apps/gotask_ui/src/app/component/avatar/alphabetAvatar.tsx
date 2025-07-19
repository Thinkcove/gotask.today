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
  showTooltip?: boolean;
}

const AlphabetAvatar: React.FC<AlphabetAvatarProps> = ({
  userName = "",
  size = 24,
  fontSize = 12,
  showTooltip = false
}) => {
  const letter = userName.charAt(0).toUpperCase() || "-";
  const bgColor = getColorByLetter(letter);

  const avatar = (
    <Avatar sx={{ height: size, width: size, fontSize, bgcolor: bgColor }}>{letter}</Avatar>
  );

  return showTooltip ? (
    <Tooltip title={userName} arrow>
      {avatar}
    </Tooltip>
  ) : (
    avatar
  );
};

export default AlphabetAvatar;
