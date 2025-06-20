import React, { useState } from "react";
import { Box, Paper, Tabs, Tab, IconButton, Divider, Typography } from "@mui/material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

// Icons
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import CodeIcon from "@mui/icons-material/Code";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";

interface Props {
  content: string;
  onUpdate: (html: string) => void;
}

const RichEditor: React.FC<Props> = ({ content, onUpdate }) => {
  const [tab, setTab] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: true }),
      Link.configure({
        openOnClick: false
      })
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (const item of items) {
          if (item.type.indexOf("image") === 0) {
            const file = item.getAsFile();
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                const src = reader.result as string;
                editor?.chain().focus().setImage({ src }).run();
              };
              reader.readAsDataURL(file);
              return true;
            }
          }
        }

        return false;
      },
      handleDrop(view, event) {
        const files = Array.from(event.dataTransfer?.files || []);
        for (const file of files) {
          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
              const src = reader.result as string;
              editor?.chain().focus().setImage({ src }).run();
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      }
    }
  });

  const exec = (cmd: string) => {
    if (!editor) return;

    switch (cmd) {
      case "bold":
        editor.chain().focus().toggleBold().run();
        break;
      case "italic":
        editor.chain().focus().toggleItalic().run();
        break;
      case "code":
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case "link": {
        const url = prompt("Enter URL");
        if (url) {
          editor.chain().focus().toggleLink({ href: url }).run();
        }
        break;
      }
      case "ul":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "ol":
        editor.chain().focus().toggleOrderedList().run();
        break;
      case "image": {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = () => {
          const file = input.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            const src = reader.result as string;
            editor.chain().focus().setImage({ src }).run();
          };
          reader.readAsDataURL(file);
        };
        input.click();
        break;
      }
    }
  };

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Write" />
        <Tab label="Preview" />
      </Tabs>

      {tab === 0 && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", p: 1, gap: 1 }}>
            <IconButton onClick={() => exec("bold")}>
              <FormatBoldIcon />
            </IconButton>
            <IconButton onClick={() => exec("italic")}>
              <FormatItalicIcon />
            </IconButton>
            <IconButton onClick={() => exec("code")}>
              <CodeIcon />
            </IconButton>
            <IconButton onClick={() => exec("ul")}>
              <FormatListBulletedIcon />
            </IconButton>
            <IconButton onClick={() => exec("ol")}>
              <FormatListNumberedIcon />
            </IconButton>
            <IconButton onClick={() => exec("image")}>
              <InsertPhotoIcon />
            </IconButton>
          </Box>
          <Divider />
          <Box
            sx={{
              p: 1,
              maxHeight: 200,
              minHeight: 150,
              overflowY: "auto",
              "& .ProseMirror": {
                outline: "none",
                boxShadow: "none",
                padding: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontFamily: "Roboto, sans-serif"
              },
              "& .ProseMirror img": {
                maxWidth: "100%",
                height: "auto"
              }
            }}
          >
            <EditorContent editor={editor} />
          </Box>
        </>
      )}

      {tab === 1 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Preview
          </Typography>
          <Box sx={{ mt: 1 }} dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }} />
        </Box>
      )}
    </Paper>
  );
};

export default RichEditor;
