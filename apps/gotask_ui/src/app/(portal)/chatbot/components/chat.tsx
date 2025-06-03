"use client";
import { useState, useRef, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import { sendQuery, uploadAttendance, useQueryHistory } from "../service/chatAction";
import { QueryResponse, QueryHistoryEntry } from "../interface/chatInterface";
import ChatHistory from "./chatHitory";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { TFunction, useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import FormField from "@/app/component/input/formField";
import ModuleHeader from "@/app/component/header/moduleHeader";

// Custom hook for updating greeting
const useGreeting = (transchatbot: TFunction) => {
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
const useLocalStorageMessages = (transchatbot: TFunction) => {
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
        // Consider it a refresh if the session timestamp is recent (within 5 seconds)
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<QueryResponse[]>([]);

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

    // Update refs
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

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        const systemMessage: QueryResponse = {
          id: generateUniqueId(),
          message: transchatbot("invalidFile"),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isUser: false,
          isSystem: true
        };
        setMessages((prev) => [...prev, systemMessage]);
        return;
      }

      try {
        const result = await uploadAttendance(file);
        const systemMessage: QueryResponse = {
          id: generateUniqueId(),
          message: `Attendance uploaded successfully! Inserted: ${result.inserted}, Skipped: ${result.skipped}. ${
            result.errors.length > 0 ? "Errors: " + result.errors.join("; ") : ""
          }`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isUser: false,
          isSystem: true
        };
        setMessages((prev) => [...prev, systemMessage]);
      } catch (error) {
        const systemMessage: QueryResponse = {
          id: generateUniqueId(),
          message: `Error uploading attendance: ${error.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isUser: false,
          isSystem: true
        };
        setMessages((prev) => [...prev, systemMessage]);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [transchatbot]
  );

  const handleInputChange = (value: string) => {
    setInput(value);
    setInputError(undefined);
  };

  const handleNewChat = useCallback(() => {
    setMessages([]);
    clearLocalStorage();
    setSelectedConversationId(null);
  }, [clearLocalStorage]);

  const handleClearAll = useCallback(() => {
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

  return (
    <>
      <Box>
        <ModuleHeader name={transchatbot("viewname")} />
      </Box>

      <Box
        sx={{
          display: "flex",
          bgcolor: "#ffffff",
          height: "calc(100vh - 80px)",
          pb: 2
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <ChatHistory
            onNewChat={handleNewChat}
            onClearAll={handleClearAll}
            onSelectConversation={handleSelectConversation}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            bgcolor: "#ffffff",
            p: 3,
            height: "100%",
            position: "relative"
          }}
        >
          {messages.length > 0 && (
            <Box
              sx={{
                width: "100%",
                maxWidth: "800px",
                margin: "0 auto",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                mb: 2,
                overflowY: "auto"
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  pr: 1
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
            </Box>
          )}

          <Box
            sx={{
              width: "100%",
              maxWidth: "800px",
              margin: "0 auto",
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
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)"
                }}
              >
                <Typography>{transchatbot("Loading")}</Typography>
              </Box>
            ) : selectedError ? (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)"
                }}
              >
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
                    {`${greeting}! How may I assist you today?`}
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
                        padding: "10px",
                        fontSize: "1rem"
                      }
                    }}
                  />
                  <IconButton
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ bgcolor: "#EEEEEE", "&:hover": { bgcolor: "#D3D3D3" } }}
                  >
                    <CloudUploadOutlinedIcon fontSize="large" sx={{ color: "#741B92" }} />
                  </IconButton>
                </Box>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                  accept=".xlsx,.xls"
                />
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Chat;
