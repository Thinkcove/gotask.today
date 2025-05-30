// import { useState } from "react";
// import { useSWRConfig } from "swr";
// import { clearQueryHistory, deleteConversation, useQueryHistory } from "../service/chatAction";

// const ChatHistory: React.FC = () => {
//   const { getQueryHistory } = useQueryHistory();
//   const { mutate } = useSWRConfig();
//   const [loading, setLoading] = useState(false);

//   // Clear all history
//   const handleClearAll = async () => {
//     setLoading(true);
//     try {
//       await clearQueryHistory();
//       mutate("fetchQueryHistory"); // Refresh the history
//     } catch (error) {
//       console.error("Error clearing history:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete a specific conversation
//   const handleDelete = async (conversationId: string) => {
//     setLoading(true);
//     try {
//       await deleteConversation(conversationId);
//       mutate("fetchQueryHistory"); // Refresh the history
//     } catch (error) {
//       console.error("Error deleting conversation:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Chat History</h2>
//       <button
//         onClick={handleClearAll}
//         className="bg-red-500 text-white p-2 rounded mb-4"
//         disabled={loading}
//       >
//         {loading ? "Clearing..." : "Clear All History"}
//       </button>
//       <ul className="space-y-4">
//         {getQueryHistory.length === 0 ? (
//           <p>No history available.</p>
//         ) : (
//           getQueryHistory.map((entry: any) => (
//             <li key={entry.id} className="border p-4 rounded">
//               <p>
//                 <strong>Query:</strong> {entry.query}
//               </p>
//               <p>
//                 <strong>Response:</strong> {entry.response}
//               </p>
//               <p>
//                 <strong>Timestamp:</strong> {entry.timestamp}
//               </p>
//               <button
//                 onClick={() => handleDelete(entry.conversationId)}
//                 className="bg-red-400 text-white p-1 rounded mt-2"
//                 disabled={loading}
//               >
//                 Delete
//               </button>
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// };

// export default ChatHistory;

import React, { useState } from "react";
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { clearQueryHistory, deleteConversation, useQueryHistory } from "../service/chatAction";
import { QueryHistoryEntry } from "../interface/chatInterface";
import CommonDialog from "@/app/component/dialog/commonDialog";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import AddIcon from "@mui/icons-material/Add";
import { Query } from "@/app/common/constants/query";

interface ChatHistoryProps {
  onNewChat: () => void;
  onClearAll: () => void;
  onRedirect: () => void;
  onSelectConversation: (conversationId: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  onNewChat,
  onClearAll,
  onRedirect,
  onSelectConversation
}) => {
  const { getQueryHistory, isLoading, isError, mutate } = useQueryHistory();
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

  // const handleDeleteConfirm = async () => {
  //   if (conversationToDelete) {
  //     try {
  //       await deleteConversation(conversationToDelete);
  //       mutate(
  //         (currentHistory: any) =>
  //           currentHistory.filter((entry: any) => entry.conversationId !== conversationToDelete),
  //         false
  //       );
  //       if (selectedConversationId === conversationToDelete) {
  //         setSelectedConversationId(null);
  //       }
  //       setSnackbarMessage("Conversation deleted successfully");
  //       setSnackbarSeverity("success");
  //     } catch (error) {
  //       setSnackbarMessage("Failed to delete conversation");
  //       setSnackbarSeverity("error");
  //     } finally {
  //       setSnackbarOpen(true);
  //       setOpenDialog(false);
  //       setConversationToDelete(null);
  //     }
  //   }
  // };

  const handleDeleteConfirm = async () => {
    if (conversationToDelete) {
      try {
        await deleteConversation(conversationToDelete);
        mutate(
          (currentHistory: any) =>
            currentHistory.filter((entry: any) => entry.conversationId !== conversationToDelete),
          false
        );
        if (selectedConversationId === conversationToDelete) {
          setSelectedConversationId(null);
        }
        setSnackbarMessage("Conversation deleted successfully");
        setSnackbarSeverity("success");
      } catch (error) {
        setSnackbarMessage("Failed to delete conversation");
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

  const handleClearAll = async () => {
    try {
      await clearQueryHistory();
      mutate([], false);
      setSelectedConversationId(null);
      onClearAll();
      setSnackbarMessage("All history cleared successfully");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Failed to clear history");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
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

  const handleRedirectClick = () => {
    setSelectedConversationId(null);
    onRedirect();
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
          setSnackbarMessage("Conversation copied to clipboard!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        });
      }
    }
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        width: "300px",
        bgcolor: "#f0f0f0",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        m: 2
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#333", display: "flex", alignItems: "center", gap: 1 }}
        >
          <img src="/image/thinkroveLogo.svg" width="24" height="24" alt="Thinkrove Logo" />
          Thinkcove Chatbot
        </Typography>
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
          New Chat
          {/* {transchatbot("newChat")} */}
        </Button>
      </Box>

      {/* Recent Queries */}
      <Box sx={{ flex: 1, px: 2, overflowY: "auto" }}>
        <Typography sx={{ color: "grey.600", fontSize: "0.9rem", fontWeight: "bold", mb: 1 }}>
          {/* {transchatbot("recentQueries", "RECENT QUERIES")} */}
          RECENT QUERIES
        </Typography>
        {isLoading ? (
          <CircularProgress size={24} />
        ) : isError ? (
          <Typography color="error">{Query.FAILED}</Typography>
        ) : getQueryHistory.length === 0 ? (
          <Typography sx={{ color: "grey.600" }}>{Query.NOT_FOUND}</Typography>
        ) : (
          <List>
            {getQueryHistory.map((entry: QueryHistoryEntry) => (
              <ListItem
                key={entry._id}
                sx={{
                  bgcolor:
                    selectedConversationId === entry.conversationId ? "grey.200" : "transparent",
                  borderRadius: "8px",
                  "&:hover": { bgcolor: "grey.100" }
                }}
              >
                <ListItemText
                  primary={entry.query}
                  onClick={() => handleSelectConversation(entry.conversationId)}
                  primaryTypographyProps={{ fontSize: "0.9rem" }}
                />
                <IconButton onClick={(e: any) => handleMenuClick(e, entry.conversationId)}>
                  <MoreVertIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Redirect Button */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          onClick={handleRedirectClick}
          sx={{
            width: "100%",
            bgcolor: "red",
            color: "white",
            borderRadius: "12px",
            textTransform: "none",
            "&:hover": { bgcolor: "#cc0000" }
          }}
        >
          Redirect
        </Button>
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
        title="Delete Conversation"
        submitLabel="Delete"
      >
        <Typography variant="body1" color="text.secondary">
          Are you sure you want to delete this conversation?
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
