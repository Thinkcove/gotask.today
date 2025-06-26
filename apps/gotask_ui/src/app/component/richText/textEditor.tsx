import { Lock, LockOpen, TextFields } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import { useRef, useState, useCallback } from "react";
import {
  RichTextEditor,
  LinkBubbleMenu,
  TableBubbleMenu,
  MenuButton,
  type RichTextEditorRef
} from "mui-tiptap";
import type { EditorOptions } from "@tiptap/core";
import useExtensions from "./useExtensions";
import EditorMenuControls from "./editorMenuControls";
import type { MentionSuggestion } from "./mentionSuggestionOptions";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

interface ReusableEditorProps {
  onSave?: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  showSaveButton?: boolean;
  content?: string;
  userList?: MentionSuggestion[];
}

export default function ReusableEditor({
  onSave,
  placeholder = "Write your content here...",
  readOnly = false,
  showSaveButton = true,
  content,
  userList = []
}: ReusableEditorProps) {
  const extensions = useExtensions({ placeholder, userList });
  const rteRef = useRef<RichTextEditorRef>(null);
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);

  const [isEditable, setIsEditable] = useState(!readOnly);
  const [showMenuBar, setShowMenuBar] = useState(true);

  const handleSave = () => {
    const html = rteRef.current?.editor?.getHTML() ?? "";
    if (onSave && html.trim()) {
      onSave(html.trim());
      rteRef.current?.editor?.commands.clearContent();
    }
  };

  const insertImageAsBase64 = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      rteRef.current?.editor?.chain().focus().setImage({ src: base64, alt: file.name }).run();
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
        ref={rteRef}
        content={content}
        extensions={extensions}
        editable={isEditable}
        editorProps={{ handleDrop, handlePaste }}
        renderControls={() => <EditorMenuControls />}
        RichTextFieldProps={{
          variant: "outlined",
          MenuBarProps: { hide: !showMenuBar },
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
}
