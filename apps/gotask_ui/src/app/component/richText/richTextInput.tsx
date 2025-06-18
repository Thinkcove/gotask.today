// components/RichTextEditor.tsx
"use client";
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Image from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import { Box, Typography } from "@mui/material";

export type RichTextEditorProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showPreview?: boolean;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Start typing...",
  showPreview = false
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      Image,
      TextStyle
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor",
        placeholder
      }
    }
  });

  return (
    <Box sx={{ padding: 2 }}>
      <EditorContent
        editor={editor}
        style={{
          border: "1px solid #ccc",
          borderRadius: 4,
          padding: "16px",
          minHeight: "150px"
        }}
      />
      {showPreview && (
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          <strong>Preview:</strong> {value || "No content yet"}
        </Typography>
      )}
    </Box>
  );
};

export default RichTextEditor;
