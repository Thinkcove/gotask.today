// components/EditorMenuControls.tsx
import {
  handleImageUpload,
  highlightColorSwatches,
  textColorSwatches
} from "@/app/common/constants/editorMenu";
import { useTheme } from "@mui/material";
import {
  MenuControlsContainer,
  MenuSelectHeading,
  MenuDivider,
  MenuSelectFontSize,
  MenuButtonBold,
  MenuButtonItalic,
  MenuButtonUnderline,
  MenuButtonStrikethrough,
  MenuButtonSubscript,
  MenuButtonSuperscript,
  MenuButtonTextColor,
  MenuButtonHighlightColor,
  MenuButtonEditLink,
  MenuSelectTextAlign,
  MenuButtonOrderedList,
  MenuButtonBulletedList,
  MenuButtonTaskList,
  MenuButtonIndent,
  MenuButtonUnindent,
  MenuButtonBlockquote,
  MenuButtonCode,
  MenuButtonCodeBlock,
  MenuButtonImageUpload,
  MenuButtonHorizontalRule,
  MenuButtonAddTable,
  MenuButtonRemoveFormatting,
  MenuButtonUndo,
  MenuButtonRedo,
  isTouchDevice
} from "mui-tiptap";

export default function EditorMenuControls() {
  const theme = useTheme();

  return (
    <MenuControlsContainer>
      <MenuSelectHeading />
      <MenuDivider />
      <MenuSelectFontSize />
      <MenuDivider />
      <MenuButtonBold />
      <MenuButtonItalic />
      <MenuButtonUnderline />
      <MenuButtonStrikethrough />
      <MenuButtonSubscript />
      <MenuButtonSuperscript />
      <MenuDivider />
      <MenuButtonTextColor
        defaultTextColor={theme.palette.text.primary}
        swatchColors={textColorSwatches}
      />
      <MenuButtonHighlightColor swatchColors={highlightColorSwatches} />
      <MenuDivider />
      <MenuButtonEditLink />
      <MenuDivider />
      <MenuSelectTextAlign />
      <MenuDivider />
      <MenuButtonOrderedList />
      <MenuButtonBulletedList />
      <MenuButtonTaskList />
      {isTouchDevice() && (
        <>
          <MenuButtonIndent />
          <MenuButtonUnindent />
        </>
      )}
      <MenuDivider />
      <MenuButtonBlockquote />
      <MenuDivider />
      <MenuButtonCode />
      <MenuButtonCodeBlock />
      <MenuDivider />
      <MenuButtonImageUpload onUploadFiles={handleImageUpload} />
      <MenuDivider />
      <MenuButtonHorizontalRule />
      <MenuButtonAddTable />
      <MenuDivider />
      <MenuButtonRemoveFormatting />
      <MenuDivider />
      <MenuButtonUndo />
      <MenuButtonRedo />
    </MenuControlsContainer>
  );
}
