import React from "react";
import { Avatar, Tooltip } from "@mui/material";
import { colors } from "@/app/common/constants/avatar";

const getColorByLetter = (letter: string) => {
  const index = letter.charCodeAt(0) - 65;
  return colors[index % colors.length];
};

const AlphabetAvatar = ({ userName = "", size = 24, fontSize = 12 }) => {
  const letter = userName.charAt(0).toUpperCase() || "U";
  const bgColor = getColorByLetter(letter);

  return (
    <Tooltip title={userName} arrow>
      <Avatar sx={{ height: size, width: size, fontSize: fontSize, bgcolor: bgColor }}>
        {letter}
      </Avatar>
    </Tooltip>
  );
};

export default AlphabetAvatar;
