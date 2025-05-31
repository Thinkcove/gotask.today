"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import FormField from "@/app/component/formField";
import { sendQuery, uploadAttendance, useQueryHistory } from "../service/chatAction";
import { QueryResponse, QueryHistoryEntry } from "../interface/chatInterface";
import ChatHistory from "./chatHitory";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ModuleHeader from "@/app/component/appBar/moduleHeader";

const Chat: React.FC = () => {
  const transchatbot = useTranslations(LOCALIZATION.TRANSITION.CHATBOT);
  const [messages, setMessages] = useState<QueryResponse[]>([]);
  const [input, setInput] = useState<string>("");
  const [inputError, setInputError] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [greeting, setGreeting] = useState<string>("Good Day");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const { history: allHistory, isLoading: allLoading, error: allError } = useQueryHistory();
  const {
    history: selectedHistory,
    isLoading: selectedLoading,
    error: selectedError
  } = useQueryHistory(selectedConversationId ?? undefined);

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const memoizedSelectedHistory = useMemo(
    () => selectedHistory ?? [],
    [JSON.stringify(selectedHistory)]
  );

  const isReadOnly = () => false;

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 12) setGreeting(transchatbot("greetingMorning"));
      else if (hour >= 12 && hour < 17) setGreeting(transchatbot("greetingAfternoon"));
      else setGreeting(transchatbot("greetingEvening"));
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(transchatbot("chatMessages"), JSON.stringify(messages));
    } else {
      localStorage.removeItem(transchatbot("chatMessages"));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectedConversationId && memoizedSelectedHistory?.length > 0) {
      const conversationMessages = memoizedSelectedHistory
        .map((item: QueryHistoryEntry) => [
          {
            id: generateUniqueId(),
            message: item.query,
            timestamp: new Date(item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            }),
            isUser: true
          },
          {
            id: generateUniqueId(),
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
    } else {
      setMessages([]);
    }
  }, [selectedConversationId, memoizedSelectedHistory]);

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
    } catch (error) {
      const errorMessage: QueryResponse = {
        id: generateUniqueId(),
        message: transchatbot("queryError"),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isUser: false,
        isSystem: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  }, [input]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
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
        message: `Error uploading attendance: ${(error as Error).message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isUser: false,
        isSystem: true
      };
      setMessages((prev) => [...prev, systemMessage]);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, []);

  const handleInputChange = (value: string) => {
    setInput(value);
    setInputError(undefined); // Clear error on change
  };

  const handleNewChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
    setSelectedConversationId(null);
  }, []);

  const handleClearAll = useCallback(() => {
    setMessages([]);
    setSelectedConversationId(null);
  }, []);

  const handleSelectConversation = useCallback((conversationId: string) => {
    setSelectedConversationId(conversationId);
  }, []);

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "#ffffff",
          pb: "2rem"
        }}
      >
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
                <Typography>Loading conversation...</Typography>
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
