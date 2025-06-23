// import { Lock, LockOpen, TextFields } from "@mui/icons-material";
// import { Box, Button, Stack } from "@mui/material";
// import { useRef, useState, useCallback } from "react";
// import {
//   RichTextEditor,
//   LinkBubbleMenu,
//   TableBubbleMenu,
//   MenuButton,
//   insertImages,
//   type RichTextEditorRef
// } from "mui-tiptap";
// import type { EditorOptions } from "@tiptap/core";
// import useExtensions from "./useExtensions";
// import EditorMenuControls from "./editorMenuControls";

// interface ReusableEditorProps {
//   onSave?: (html: string) => void;
//   placeholder?: string;
//   readOnly?: boolean;
//   showSaveButton?: boolean;
//   content?: string;
// }

// export default function ReusableEditor({
//   onSave,
//   placeholder = "Write something here...",
//   readOnly = false,
//   showSaveButton = true,
//   content
// }: ReusableEditorProps) {
//   const extensions = useExtensions({ placeholder });
//   const rteRef = useRef<RichTextEditorRef>(null);

//   const [isEditable, setIsEditable] = useState(!readOnly);
//   const [showMenuBar, setShowMenuBar] = useState(true);

//   const handleSave = () => {
//     const html = rteRef.current?.editor?.getHTML() ?? "";
//     if (onSave && html.trim()) {
//       onSave(html.trim());
//       rteRef.current?.editor?.commands.clearContent();
//     }
//   };

//   const handleDrop: NonNullable<EditorOptions["editorProps"]["handleDrop"]> = useCallback(
//     (view, event) => {
//       const files = event.dataTransfer?.files;
//       if (!files?.length) return false;

//       const images = Array.from(files).filter((file) => file.type.startsWith("image/"));
//       if (!images.length) return false;

//       const attributes = images.map((file) => ({
//         src: URL.createObjectURL(file),
//         alt: file.name
//       }));

//       insertImages({ images: attributes, editor: rteRef.current!.editor });
//       event.preventDefault();
//       return true;
//     },
//     []
//   );

//   return (
//     <Box>
//       <RichTextEditor
//         key={content}
//         ref={rteRef}
//         content={content}
//         extensions={extensions}
//         editable={isEditable}
//         editorProps={{
//           handleDrop
//         }}
//         renderControls={() => <EditorMenuControls />}
//         RichTextFieldProps={{
//           variant: "outlined",
//           MenuBarProps: {
//             hide: !showMenuBar
//           },
//           footer: (
//             <Stack direction="row" spacing={2} sx={{ borderTop: "1px solid", py: 1, px: 1.5 }}>
//               <MenuButton
//                 value="formatting"
//                 tooltipLabel={showMenuBar ? "Hide formatting" : "Show formatting"}
//                 size="small"
//                 onClick={() => setShowMenuBar((prev) => !prev)}
//                 selected={showMenuBar}
//                 IconComponent={TextFields}
//               />
//               <MenuButton
//                 value="editable"
//                 tooltipLabel={isEditable ? "Read-only" : "Editable"}
//                 size="small"
//                 onClick={() => setIsEditable((prev) => !prev)}
//                 selected={!isEditable}
//                 IconComponent={isEditable ? Lock : LockOpen}
//               />
//               {showSaveButton && (
//                 <Button variant="contained" size="small" onClick={handleSave}>
//                   Save
//                 </Button>
//               )}
//             </Stack>
//           )
//         }}
//       >
//         {() => (
//           <>
//             <LinkBubbleMenu />
//             <TableBubbleMenu />
//           </>
//         )}
//       </RichTextEditor>
//     </Box>
//   );
// }

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
import { BubbleMenu } from "@tiptap/react";

interface ReusableEditorProps {
  onSave?: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  showSaveButton?: boolean;
  content?: string;
}

export default function ReusableEditor({
  onSave,
  placeholder = "Write something here...",
  readOnly = false,
  showSaveButton = true,
  content
}: ReusableEditorProps) {
  const extensions = useExtensions({ placeholder });
  const rteRef = useRef<RichTextEditorRef>(null);

  const [isEditable, setIsEditable] = useState(!readOnly);
  const [showMenuBar, setShowMenuBar] = useState(true);

  const handleSave = () => {
    const html = rteRef.current?.editor?.getHTML() ?? "";
    if (onSave && html.trim()) {
      onSave(html.trim());
      rteRef.current?.editor?.commands.clearContent(); // Optional
    }
  };

  const insertImageAsBase64 = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      console.log("Base64 inserted:", base64);
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
        editorProps={{
          handleDrop,
          handlePaste
        }}
        renderControls={() => <EditorMenuControls />}
        RichTextFieldProps={{
          variant: "outlined",
          MenuBarProps: {
            hide: !showMenuBar
          },
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
                  Save
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
