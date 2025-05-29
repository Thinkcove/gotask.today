"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { QueryService } from "../services/queryService";
import { deleteConversation, setHistory } from "../services/queryAction";
import ConfirmationDialog from "@/app/components/popup";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { deleteAccessRole, useAccessRoleById } from "../../access/services/accessService";
import { useParams, useRouter } from "../../../../../node_modules/next/navigation";
import { useTranslations } from "../../../../../node_modules/next-intl/dist/types/index.react-client";

interface HistoryEntry {
  _id: string;
  query: string;
  response: string;
  timestamp: string;
  conversationId: string;
}

interface ChatHistoryProps {
  onNewChat: () => void;
  onClearAll: () => void;
  onLogout: () => void;
  onSelectConversation: (conversationId: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  onNewChat,
  onClearAll,
  onLogout,
  onSelectConversation
}) => {
  const dispatch = useDispatch();
  const history = useSelector((state: RootState) => state.query.history || []);
  const [openDialog, setOpenDialog] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuConversationId, setMenuConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // ✅ Dialog state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const t = useTranslations("Access");
  const { id } = useParams();
  const router = useRouter();

  const {
    role: accessRole,
    isLoading: isRoleLoading,
    error: roleError
  } = useAccessRoleById(id as string);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching query history from backend...");
        const historyData = await QueryService.getQueryHistory();
        console.log("History data received:", historyData);
        dispatch(setHistory(historyData));
      } catch (error) {
        console.error("Error fetching history:", error);
        setError("Failed to load chat history. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [dispatch]);

  const handleDeleteClick = (conversationId: string) => {
    setConversationToDelete(conversationId);
    setOpenDialog(true);
    setMenuAnchorEl(null);
  };

  const handleDeleteConfirm = async () => {
    if (conversationToDelete) {
      try {
        await QueryService.deleteConversation(conversationToDelete);
        dispatch(deleteConversation(conversationToDelete));
        if (selectedConversationId === conversationToDelete) {
          setSelectedConversationId(null);
        }
      } catch (error) {
        console.error("Error deleting conversation:", error);
        setError("Failed to delete conversation. Please try again.");
      }
    }
    setOpenDialog(false);
    setConversationToDelete(null);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setConversationToDelete(null);
  };

  const handleClearAll = async () => {
    try {
      await QueryService.clearQueryHistory();
      dispatch(setHistory([]));
      setSelectedConversationId(null);
      onClearAll();
    } catch (error) {
      console.error("Error clearing history:", error);
      setError("Failed to clear history. Please try again.");
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    onSelectConversation(conversationId);
  };

  const handleNewChat = () => {
    setSelectedConversationId(null);
    onNewChat();
  };

  const handleLogoutClick = () => {
    setSelectedConversationId(null);
    onLogout();
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
      const conversation = history.find(
        (entry: any) => entry.conversationId === menuConversationId
      );
      if (conversation) {
        const shareText = `Query: ${conversation.query}\nResponse: ${conversation.response}`;
        navigator.clipboard
          .writeText(shareText)
          .then(() => {
            alert("Conversation copied to clipboard!");
          })
          .catch((err) => {
            console.error("Failed to copy to clipboard:", err);
            alert("Failed to copy conversation. Please try again.");
          });
      }
    }
    setMenuAnchorEl(null);
    setMenuConversationId(null);
  };

  const confirmDelete = async () => {
    if (!accessRole || isDeleting) return;

    try {
      setIsDeleting(true);
      const res = await deleteAccessRole(accessRole.id);
      if (res.success) {
        showSnackbar(res.message || t("updatesuccess"), "success");
        setTimeout(() => {
          router.push("/access");
        }, 500);
      } else {
        showSnackbar(res.message || t("updateerror"), "error");
      }
    } catch (err) {
      console.error("Failed to delete access role:", err);
      showSnackbar(t("updateerror"), "error");
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false); // ✅ Close dialog after action
    }
  };

  return (
    <Box
      sx={{
        width: "350px",
        bgcolor: "#ffffff",
        height: "calc(100vh - 32px)",
        maxHeight: "calc(100vh - 32px)",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #e0e0e0",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        borderRadius: "28px",
        mt: 2,
        mb: 4,
        ml: 2,
        mr: 2
      }}
    >
      <Box sx={{ p: 8 }}>
        <Button
          variant="contained"
          startIcon={
            <img
              src="/image/plusIcon.svg"
              alt="Plus Icon"
              style={{
                width: 20,
                height: 20,
                filter: "brightness(0) invert(1)"
              }}
            />
          }
          onClick={handleNewChat}
          sx={{
            width: "100%",
            bgcolor: "#211959",
            color: "white",
            borderRadius: "20px",
            textTransform: "none",
            padding: "16px 6px",
            fontSize: "14px",
            fontWeight: 500,
            "&:hover": {
              bgcolor: "#1a144d",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
            }
          }}
        >
          New Chat
        </Button>
      </Box>
      <Box sx={{ flex: 1, px: 2, py: 1, overflowY: "auto" }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: "grey.600",
            fontSize: "12px",
            fontWeight: 600,
            mb: 1,
            textTransform: "uppercase"
          }}
        >
          Recent Queries
        </Typography>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ p: 2, fontSize: "14px" }}>
            {error}
            <Button
              variant="text"
              onClick={() => {
                setError(null);
                fetchHistory();
              }}
              sx={{ ml: 1, textTransform: "none" }}
            >
              Retry
            </Button>
          </Typography>
        ) : history.length === 0 ? (
          <Typography sx={{ p: 2, fontSize: "14px", color: "grey.600" }}>
            No recent queries found.
          </Typography>
        ) : (
          <List disablePadding>
            {history.map((entry: HistoryEntry) => (
              <ListItem
                key={entry._id}
                sx={{
                  py: 0.75,
                  px: 1,
                  borderRadius: "8px",
                  bgcolor:
                    selectedConversationId === entry.conversationId ? "grey.300" : "transparent",
                  "&:hover": {
                    bgcolor:
                      selectedConversationId === entry.conversationId ? "grey.300" : "grey.100",
                    cursor: "pointer"
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: "32px" }}>
                  <img
                    src="/image/chatIcon.svg"
                    alt="Chat Icon"
                    style={{
                      width: 18,
                      height: 18,
                      filter: "grayscale(100%) opacity(0.6)"
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={entry.query}
                  primaryTypographyProps={{
                    variant: "body2",
                    color: "grey.800",
                    fontSize: "14px",
                    noWrap: true,
                    fontWeight: selectedConversationId === entry.conversationId ? "bold" : "normal"
                  }}
                  onClick={() => {
                    console.log("Clicked conversationId:", entry.conversationId);
                    handleSelectConversation(entry.conversationId);
                  }}
                />
                <IconButton
                  edge="end"
                  onClick={(event: any) => handleMenuClick(event, entry.conversationId)}
                  sx={{
                    p: 0.5,
                    "&:hover": {
                      bgcolor: "grey.200"
                    }
                  }}
                >
                  <MoreVertIcon
                    sx={{
                      width: 18,
                      height: 18,
                      color: "grey.600"
                    }}
                  />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Box sx={{ mt: 8, mb: 6, px: 16 }}>
        <Button
          variant="text"
          startIcon={
            <img src="/image/logoutIcon.svg" alt="Logout Icon" style={{ width: 18, height: 18 }} />
          }
          onClick={handleLogoutClick}
          sx={{
            width: "100%",
            color: "#212121",
            textTransform: "none",
            fontSize: "14px",
            justifyContent: "flex-start",
            py: 0.5,
            "&:hover": {
              bgcolor: "grey.100"
            }
          }}
        >
          Logout
        </Button>
      </Box>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <MenuItem onClick={() => menuConversationId && handleDeleteClick(menuConversationId)}>
          Delete
        </MenuItem>
        <MenuItem onClick={handleShareClick}>Share</MenuItem>
      </Menu>

      <CommonDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onSubmit={confirmDelete}
        title={t("deleteaccess")}
        submitLabel={t("delete")}
      >
        <Typography variant="body1" color="text.secondary">
          {t("deleteconfirm")}
        </Typography>
      </CommonDialog>
    </Box>
  );
};

export default ChatHistory;
