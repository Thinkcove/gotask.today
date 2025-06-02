import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deleteConversation, useQueryHistory } from "../service/chatAction";
import { QueryHistoryEntry } from "../interface/chatInterface";
import CommonDialog from "@/app/component/dialog/commonDialog";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import AddIcon from "@mui/icons-material/Add";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

interface ChatHistoryProps {
  onNewChat: () => void;
  onSelectConversation: (conversationId: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onNewChat, onSelectConversation }) => {
  const transchatbot = useTranslations(LOCALIZATION.TRANSITION.CHATBOT);
  const { history: getQueryHistory, isLoading, error, mutate } = useQueryHistory();
  const [openDialog, setOpenDialog] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuConversationId, setMenuConversationId] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const handleDeleteClick = (conversationId: string) => {
    setConversationToDelete(conversationId);
    setOpenDialog(true);
    setMenuAnchorEl(null);
  };

  const handleDeleteConfirm = async () => {
    if (conversationToDelete) {
      try {
        const response = await deleteConversation(conversationToDelete);
        if (!response.success) {
          throw new Error(response.message || transchatbot("Unknown"));
        }
        mutate();
        if (selectedConversationId === conversationToDelete) {
          setSelectedConversationId(null);
        }
        setSnackbarMessage(transchatbot("deleteSuccess"));
        setSnackbarSeverity("success");
      } catch (error: any) {
        const errorMessage =
          error.response?.status === 500
            ? transchatbot("servererror")
            : error.response?.status === 404
              ? transchatbot("noconversation")
              : error.message || transchatbot("deleteFailed");
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
      } finally {
        setSnackbarOpen(true);
        setOpenDialog(false);
        setConversationToDelete(null);
      }
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setConversationToDelete(null);
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    onSelectConversation(conversationId);
  };

  const handleNewChat = () => {
    setSelectedConversationId(null);
    onNewChat();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, conversationId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuConversationId(conversationId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuConversationId(null);
  };

  const handleShareClick = () => {
    if (menuConversationId) {
      const conversation = getQueryHistory.find(
        (entry: any) => entry.conversationId === menuConversationId
      );
      if (conversation) {
        const shareText = `Query: ${conversation.query}\nResponse: ${conversation.response}`;
        navigator.clipboard.writeText(shareText).then(() => {
          setSnackbarMessage(transchatbot("shareSuccess"));
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        });
      }
    }
    handleMenuClose();
  };

  const errorMessage = error
    ? error.message
      ? transchatbot("Unauthorized")
      : error.message || transchatbot("historyError")
    : transchatbot("failed");

  return (
    <Box
      sx={{
        width: "300px",
        bgcolor: "#f0f0f0",
        maxHeight: 900,
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        m: 2,
        height: "100%"
      }}
    >
      <Box
        sx={{
          p: 2,
          top: 0,
          bgcolor: "#f0f0f0",
          zIndex: 1
        }}
      >
        <Button
          variant="contained"
          onClick={handleNewChat}
          sx={{
            width: "100%",
            bgcolor: "#741B92",
            color: "white",
            borderRadius: "12px",
            mt: 2,
            textTransform: "none",
            "&:hover": { bgcolor: "#660066" }
          }}
        >
          <AddIcon />
          {transchatbot("New")}
        </Button>
      </Box>

      <Box sx={{ flex: 1, px: 2, overflowY: "auto" }}>
        <Typography sx={{ color: "grey.600", fontSize: "0.9rem", fontWeight: "bold", mb: 1 }}>
          {transchatbot("Recent")}
        </Typography>
        {isLoading ? (
          <CircularProgress size={24} />
        ) : getQueryHistory.length > 0 ? (
          <List>
            {getQueryHistory.map((entry: QueryHistoryEntry) => (
              <ListItem
                key={entry.id}
                sx={{
                  bgcolor:
                    selectedConversationId === entry.conversationId ? "grey.200" : "transparent",
                  borderRadius: "8px",
                  "&:hover": { bgcolor: "grey.100" },
                  cursor: "pointer"
                }}
                onClick={() => handleSelectConversation(entry.conversationId)}
              >
                <ListItemText
                  primary={entry.query}
                  primaryTypographyProps={{ fontSize: "0.9rem" }}
                />
                <IconButton onClick={(e: any) => handleMenuClick(e, entry.conversationId)}>
                  <MoreVertIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        ) : error ? (
          <Typography color="error">{errorMessage}</Typography>
        ) : (
          <Typography sx={{ color: "grey.600" }}>{Query.NOT_FOUND}</Typography>
        )}
      </Box>

      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => menuConversationId && handleDeleteClick(menuConversationId)}>
          Delete
        </MenuItem>
        <MenuItem onClick={handleShareClick}>Share</MenuItem>
      </Menu>

      <CommonDialog
        open={openDialog}
        onClose={handleDialogClose}
        onSubmit={handleDeleteConfirm}
        title={transchatbot("deleteTitle")}
        submitLabel="Delete"
      >
        <Typography variant="body1" color="text.secondary">
          {transchatbot("deleteConfirm")}
        </Typography>
      </CommonDialog>

      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Box>
  );
};

export default ChatHistory;
