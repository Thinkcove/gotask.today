"use client";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import { sendQuery, useQueryHistory } from "../service/chatAction";
import { QueryResponse, QueryHistoryEntry } from "../interface/chatInterface";
import ChatHistory from "./chatHitory";
import ChatIcon from "@mui/icons-material/Chat";
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close"; // Added CloseIcon import
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import FormField from "@/app/component/input/formField";
import { useUser } from "@/app/userContext";
import { Fab } from "../../../../../node_modules/@mui/material/index";

// Custom hook for updating greeting
const useGreeting = (transchatbot: (key: string) => string) => {
  const [greeting, setGreeting] = useState<string>("Good Day");

  const updateGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) setGreeting(transchatbot("greetingMorning"));
    else if (hour >= 12 && hour < 17) setGreeting(transchatbot("greetingAfternoon"));
    else setGreeting(transchatbot("greetingEvening"));
  }, [transchatbot]);

  // Initialize greeting immediately
  const initializedGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) return transchatbot("greetingMorning");
    else if (hour >= 12 && hour < 17) return transchatbot("greetingAfternoon");
    else return transchatbot("greetingEvening");
  }, [transchatbot]);

  // Set initial greeting
  const [isInitialized, setIsInitialized] = useState(false);
  if (!isInitialized) {
    setGreeting(initializedGreeting);
    setIsInitialized(true);
  }

  // Set up interval for updates
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  if (!intervalRef.current) {
    intervalRef.current = setInterval(updateGreeting, 60000);
  }

  return greeting;
};

// Custom hook for managing localStorage
const useLocalStorageMessages = (transchatbot: (key: string) => string) => {
  const saveToLocalStorage = useCallback(
    (messages: QueryResponse[]) => {
      if (typeof window !== "undefined") {
        if (messages.length > 0) {
          localStorage.setItem(transchatbot("chatMessages"), JSON.stringify(messages));
          localStorage.setItem("chatSessionTimestamp", Date.now().toString());
        } else {
          localStorage.removeItem(transchatbot("chatMessages"));
          localStorage.removeItem("chatSessionTimestamp");
        }
      }
    },
    [transchatbot]
  );

  const getFromLocalStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const storedMessages = localStorage.getItem(transchatbot("chatMessages"));
        const sessionTimestamp = localStorage.getItem("chatSessionTimestamp");
        const currentTime = Date.now();
        if (sessionTimestamp && currentTime - parseInt(sessionTimestamp) < 5000) {
          return storedMessages ? (JSON.parse(storedMessages) as QueryResponse[]) : [];
        }
        return [];
      } catch (_error) {
        console.error("Error parsing localStorage messages:", _error);
        return [];
      }
    }
    return [];
  }, [transchatbot]);

  const clearLocalStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(transchatbot("chatMessages"));
      localStorage.removeItem("chatSessionTimestamp");
    }
  }, [transchatbot]);

  return { saveToLocalStorage, getFromLocalStorage, clearLocalStorage };
};

// Custom hook for auto-scrolling
const useAutoScroll = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return { messagesEndRef, scrollToBottom };
};

const Chat: React.FC = () => {
  const transchatbot = useTranslations(LOCALIZATION.TRANSITION.CHATBOT);
  const pathname = usePathname();
  const [input, setInput] = useState<string>("");
  const [inputError, setInputError] = useState<string | undefined>(undefined);
  const chatPopupRef = useRef<HTMLDivElement>(null); // Ref for the chat popup
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<QueryResponse[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Fetch the logged-in user's details using the context-based useUser hook
  const { user } = useUser();
  // Extract and format the username to match AlphabetAvatar's approach
  const userName = user?.name || "";
  const formattedUserName =
    userName.charAt(0).toUpperCase() + (userName.slice(1) || "").toLowerCase();

  const {
    history: selectedHistory,
    isLoading: selectedLoading,
    error: selectedError
  } = useQueryHistory(selectedConversationId ?? undefined);

  const memoizedSelectedHistory = useMemo(() => selectedHistory ?? [], [selectedHistory]);

  // Get localStorage utilities
  const { saveToLocalStorage, getFromLocalStorage, clearLocalStorage } =
    useLocalStorageMessages(transchatbot);

  // Get greeting and scroll utilities
  const greeting = useGreeting(transchatbot);
  const { messagesEndRef, scrollToBottom } = useAutoScroll();

  // Handle conversation history loading
  const prevSelectedConversationIdRef = useRef<string | null>(null);
  const prevSelectedHistoryRef = useRef<QueryHistoryEntry[]>([]);

  // Check if conversation selection has changed
  const conversationChanged = prevSelectedConversationIdRef.current !== selectedConversationId;
  const historyChanged =
    JSON.stringify(prevSelectedHistoryRef.current) !== JSON.stringify(memoizedSelectedHistory);

  if (conversationChanged || (selectedConversationId && historyChanged)) {
    if (selectedConversationId && memoizedSelectedHistory?.length > 0) {
      // Load conversation history
      const conversationMessages = memoizedSelectedHistory
        .map((item: QueryHistoryEntry) => [
          {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            message: item.query,
            timestamp: new Date(item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            }),
            isUser: true
          },
          {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            message: item.response,
            timestamp: new Date(item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            }),
            isUser: false,
            isSystem: false
          }
        ])
        .flat();
      setMessages(conversationMessages);
    } else if (!selectedConversationId) {
      // Load from localStorage or start fresh
      const storedMessages = getFromLocalStorage();
      setMessages(storedMessages);
    } else {
      // Clear messages for new conversation
      setMessages([]);
    }

    prevSelectedConversationIdRef.current = selectedConversationId;
    prevSelectedHistoryRef.current = memoizedSelectedHistory;
  }

  // Initialize messages on first load
  const [isInitialized, setIsInitialized] = useState(false);
  if (!isInitialized) {
    if (!selectedConversationId) {
      const storedMessages = getFromLocalStorage();
      setMessages(storedMessages);
    }
    setIsInitialized(true);
  }

  // Save messages to localStorage whenever they change (only for non-conversation messages)
  const prevMessagesRef = useRef<QueryResponse[]>([]);
  if (
    !selectedConversationId &&
    JSON.stringify(prevMessagesRef.current) !== JSON.stringify(messages)
  ) {
    saveToLocalStorage(messages);
    prevMessagesRef.current = messages;
  }

  // Scroll to bottom when messages change
  const prevMessagesLengthRef = useRef(0);
  if (messages.length !== prevMessagesLengthRef.current) {
    setTimeout(scrollToBottom, 100);
    prevMessagesLengthRef.current = messages.length;
  }

  // Handle navigation to clear localStorage
  const prevPathnameRef = useRef<string | null>(null);
  if (
    typeof window !== "undefined" &&
    prevPathnameRef.current !== null &&
    prevPathnameRef.current !== pathname
  ) {
    clearLocalStorage();
    setMessages([]);
  }
  if (prevPathnameRef.current !== pathname) {
    prevPathnameRef.current = pathname;
  }

  // Handle clicks outside the chat popup to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isChatOpen &&
        chatPopupRef.current &&
        !chatPopupRef.current.contains(event.target as Node)
      ) {
        setIsChatOpen(false);
      }
    };

    if (isChatOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChatOpen]);

  const isReadOnly = () => false;

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSend = useCallback(async () => {
    if (!input.trim()) {
      setInputError(transchatbot("required"));
      return;
    }

    const userMessage: QueryResponse = {
      id: generateUniqueId(),
      message: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isUser: true
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setInputError(undefined);

    try {
      const response = await sendQuery(input);
      const botMessage: QueryResponse = {
        id: generateUniqueId(),
        message: response.message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isUser: false,
        isSystem: false
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage: QueryResponse = {
        id: generateUniqueId(),
        message: transchatbot("queryError"),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isUser: false,
        isSystem: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  }, [input, transchatbot]);

  const handleInputChange: (value: string | number | Date | string[]) => void = (value) => {
    if (typeof value === "string") {
      setInput(value);
      setInputError(undefined);
    }
  };

  const handleNewChat = useCallback(() => {
    setMessages([]);
    clearLocalStorage();
    setSelectedConversationId(null);
  }, [clearLocalStorage]);

  const handleSelectConversation = useCallback(
    (conversationId: string) => {
      setMessages([]);
      clearLocalStorage();
      setSelectedConversationId(conversationId);
    },
    [clearLocalStorage]
  );

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  return (
    <>
      {/* Button to toggle the chat popup */}
      <Box
        sx={{
          position: "fixed"
        }}
        bottom={110}
        right={32}
      >
        <Fab
          onClick={toggleChat}
          sx={{
            bgcolor: "#741B92",
            color: "white",
            borderRadius: "50%",
            minWidth: "60px",
            height: "60px",
            "&:hover": { bgcolor: "#660066" }
          }}
        >
          <ChatIcon fontSize="large" />
        </Fab>
      </Box>

      {/* Chat Popup */}
      {isChatOpen && (
        <Box
          ref={chatPopupRef} // Attach ref to the chat popup
          sx={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            width: isHistoryOpen ? "650px" : "400px",
            height: "500px",
            bgcolor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "row",
            overflow: "hidden"
          }}
        >
          {/* Chat History Sidebar */}
          {isHistoryOpen && (
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <ChatHistory
                onNewChat={handleNewChat}
                onSelectConversation={handleSelectConversation}
              />
            </Box>
          )}

          {/* Main Chat Area */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              bgcolor: "#ffffff",
              p: 2,
              height: "100%",
              position: "relative"
            }}
          >
            {/* Header with History Toggle, File Upload, and Close Icon */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: "bold", color: "#741B92" }}>
                  {transchatbot("viewname")}
                </Typography>
                <IconButton onClick={toggleHistory}>
                  <HistoryIcon sx={{ color: "#741B92" }} />
                </IconButton>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  onClick={toggleChat} // Close the popup
                  sx={{
                    position: "absolute",
                    top: "-2px", // Moves the icon slightly higher
                    right: "-2px" // Moves the icon slightly to the right
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Chat Messages */}
            {messages.length > 0 && (
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  pr: 1,
                  mb: 2
                }}
              >
                {messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: message.isUser ? "flex-end" : "flex-start"
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: message.isSystem
                          ? "#EEEEEE"
                          : message.isUser
                            ? "#EEEEEE"
                            : "#BDBDBD",
                        borderRadius: "12px",
                        maxWidth: "70%"
                      }}
                    >
                      <Typography sx={{ color: "black", fontSize: "1rem" }}>
                        {message.message}
                      </Typography>
                      <Typography sx={{ color: "grey.500", fontSize: "0.75rem", mt: 0.5 }}>
                        {message.timestamp}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>
            )}

            {/* Input Area */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "sticky",
                bottom: 0,
                bgcolor: "#ffffff",
                ...(messages.length === 0 && {
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                })
              }}
            >
              {selectedLoading ? (
                <Box sx={{ textAlign: "center" }}>
                  <Typography>{transchatbot("Loading")}</Typography>
                </Box>
              ) : selectedError ? (
                <Box sx={{ textAlign: "center" }}>
                  <Typography color="error">
                    {selectedError.message || transchatbot("error")}
                  </Typography>
                </Box>
              ) : (
                <>
                  {messages.length === 0 && (
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "black",
                        mb: 2,
                        fontSize: "1.2rem"
                      }}
                    >
                      {`${greeting}${formattedUserName ? ` ${formattedUserName}` : ""}, how may I assist you today?`}
                    </Typography>
                  )}
                  <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 1 }}>
                    <FormField
                      label=""
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      onSend={handleSend}
                      placeholder={transchatbot("placeholder")}
                      required
                      error={inputError}
                      disabled={isReadOnly()}
                      inputProps={{
                        startAdornment: null
                      }}
                      sx={{
                        flex: 1,
                        "& .MuiFormControl-root": {
                          borderRadius: "12px",
                          border: "1px solid #e0e0e0",
                          "&:focus-within": {
                            borderColor: "inherit",
                            backgroundColor: "inherit"
                          }
                        },
                        "& .MuiInputBase-root": {
                          padding: "5px 10px",
                          fontSize: "1rem",
                          height: "20px"
                        }
                      }}
                    />
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Chat;
