"use client";
import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { Box, Typography } from "@mui/material";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type Props = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

const RichTextEditor: React.FC<Props> = ({ label, placeholder, value, onChange }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      ["clean"]
    ]
  };

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      <ReactQuill
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        theme="snow"
      />
    </Box>
  );
};

export default RichTextEditor;
