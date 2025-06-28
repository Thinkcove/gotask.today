"use client";
import {
  RichTextEditor,
  LinkBubbleMenu,
  TableBubbleMenu,
  MenuButton,
  type RichTextEditorRef
} from "mui-tiptap";
import { Box, Button, Stack } from "@mui/material";
import { Lock, LockOpen, TextFields } from "@mui/icons-material";
import { useRef, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import type { EditorOptions } from "@tiptap/core";
import useExtensions from "./useExtensions";
import EditorMenuControls from "./editorMenuControls";
import type { MentionSuggestion } from "./mentionSuggestionOptions";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import "./richTextStyle.css";
interface ReusableEditorProps {
  onSave?: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  showSaveButton?: boolean;
  content?: string;
  userList?: MentionSuggestion[];
}

const ReusableEditor = forwardRef<RichTextEditorRef, ReusableEditorProps>(function ReusableEditor(
  {
    onSave,
    placeholder = "Write your content here...",
    readOnly = false,
    showSaveButton = true,
    content,
    userList = []
  },
  ref
) {
  const editorRef = useRef<RichTextEditorRef>(null);
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const extensions = useExtensions({ placeholder, userList });

  const [isEditable, setIsEditable] = useState(!readOnly);
  const [showMenuBar, setShowMenuBar] = useState(true);

  useImperativeHandle(ref, () => editorRef.current as RichTextEditorRef);

  const handleSave = () => {
    const html = editorRef.current?.editor?.getHTML() ?? "";
    if (onSave) {
      onSave(html.trim());
    }
  };

  const insertImageAsBase64 = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      editorRef.current?.editor?.chain().focus().setImage({ src: base64, alt: file.name }).run();
    };
    reader.readAsDataURL(file);
  };

  const handleDrop: NonNullable<EditorOptions["editorProps"]["handleDrop"]> = useCallback(
    (view, event) => {
      const files = event.dataTransfer?.files;
      if (!files?.length) return false;

      const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
      if (!imageFiles.length) return false;

      imageFiles.forEach(insertImageAsBase64);
      event.preventDefault();
      return true;
    },
    []
  );

  const handlePaste: NonNullable<EditorOptions["editorProps"]["handlePaste"]> = useCallback(
    (view, event) => {
      const items = event.clipboardData?.items;
      if (!items) return false;

      const imageItem = Array.from(items).find((item) => item.type.startsWith("image/"));
      if (!imageItem) return false;

      const file = imageItem.getAsFile();
      if (!file) return false;

      insertImageAsBase64(file);
      event.preventDefault();
      return true;
    },
    []
  );

  return (
    <Box>
      <RichTextEditor
        key={content}
        ref={editorRef}
        content={content}
        extensions={extensions}
        editable={isEditable}
        editorProps={{ handleDrop, handlePaste }}
        renderControls={() => <EditorMenuControls />}
        RichTextFieldProps={{
          variant: "outlined",
          MenuBarProps: { hide: !showMenuBar },
          className: "custom-editor-field",
          footer: (
            <Stack direction="row" spacing={2} sx={{ borderTop: "1px solid", py: 1, px: 1.5 }}>
              <MenuButton
                value="formatting"
                tooltipLabel={showMenuBar ? "Hide formatting" : "Show formatting"}
                size="small"
                onClick={() => setShowMenuBar((prev) => !prev)}
                selected={showMenuBar}
                IconComponent={TextFields}
              />
              <MenuButton
                value="editable"
                tooltipLabel={isEditable ? "Read-only" : "Editable"}
                size="small"
                onClick={() => setIsEditable((prev) => !prev)}
                selected={!isEditable}
                IconComponent={isEditable ? Lock : LockOpen}
              />
              {showSaveButton && (
                <Button variant="contained" size="small" onClick={handleSave}>
                  {transtask("saved")}
                </Button>
              )}
            </Stack>
          )
        }}
      >
        {() => (
          <>
            <LinkBubbleMenu />
            <TableBubbleMenu />
          </>
        )}
      </RichTextEditor>
    </Box>
  );
});

export default ReusableEditor;
