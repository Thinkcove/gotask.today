"use client";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Paper, Avatar, IconButton } from "@mui/material";
import TextInput from "@/app/components/textField";
import { addUserMessage, clearMessages } from "../services/queryAction";
import { QueryService } from "../services/queryService";
import ChatHistory from "./chatHistory";
import { AppDispatch, RootState } from "@/app/store/store";
import { useRouter } from "next/navigation";

const Chatbot: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const messages = useSelector((state: RootState) => state.query.items?.QueryResult || []);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [empName, setEmpname] = useState<string>("");
  const [greeting, setGreeting] = useState<string>("Good Day");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const name = useSelector((state: RootState) => state.auth?.user?.name || "");

  const fetchHistory = async () => {
    try {
      const data = await QueryService.getQueryHistory();
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleNewChat = () => {
    dispatch(clearMessages());
    localStorage.removeItem("chatMessages");
    setSelectedConversationId(null);
  };

  const handleClearAll = () => {
    setHistory([]);
    QueryService.clearQueryHistory().catch((err) => {
      console.error("Failed to clear query history:", err);
    });
  };

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Check login status and handle fresh login vs. refresh
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const isFreshLogin = localStorage.getItem("isFreshLogin");

    if (!isLoggedIn) {
      router.push("/");
      return;
    }

    if (isFreshLogin === "true") {
      // Clear messages for a fresh login
      dispatch(clearMessages());
      localStorage.removeItem("chatMessages");
      localStorage.setItem("isFreshLogin", "false"); // Reset flag after clearing
    } else {
      // Restore messages from localStorage on refresh
      const savedMessages = localStorage.getItem("chatMessages");
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        const existingIds = new Set(messages.map((msg: any) => msg.id));
        parsedMessages.forEach((message: any) => {
          if (!existingIds.has(message.id)) {
            dispatch(addUserMessage(message));
          }
        });
      }
    }
  }, [router, dispatch, messages]);

  // Update greeting based on time
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 12) {
        setGreeting("Good Morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  // Load employee name from localStorage
  useEffect(() => {
    const storedEmpName = localStorage.getItem("empname");
    if (storedEmpName) {
      setEmpname(storedEmpName);
    }
  }, []);

  // Save employee name to localStorage
  useEffect(() => {
    if (empName) {
      localStorage.setItem("empname", empName);
    }
  }, [empName]);

  // Save current messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    } else {
      localStorage.removeItem("chatMessages");
    }
  }, [messages]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: generateUniqueId(),
      message: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      isUser: true
    };

    dispatch(addUserMessage(userMessage));
    setInput("");
    dispatch(QueryService.sendQuery(input));
  };

  const capitalizeName = (name: string) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      const systemMessage = {
        id: generateUniqueId(),
        message: "Please upload a valid Excel file (.xlsx or .xls).",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }),
        isUser: false,
        isSystem: true
      };
      dispatch(addUserMessage(systemMessage));
      return;
    }

    try {
      const result = await QueryService.uploadAttendance(file);
      const systemMessage = {
        id: generateUniqueId(),
        message: `Attendance uploaded successfully! Inserted: ${
          result.inserted
        }, Skipped: ${result.skipped}. ${
          result.errors.length > 0 ? "Errors: " + result.errors.join("; ") : ""
        }`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }),
        isUser: false,
        isSystem: true
      };
      dispatch(addUserMessage(systemMessage));
    } catch (error) {
      const systemMessage = {
        id: generateUniqueId(),
        message: `Error uploading attendance: ${(error as Error).message}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }),
        isUser: false,
        isSystem: true
      };
      dispatch(addUserMessage(systemMessage));
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("empname");
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("isFreshLogin");
    dispatch(clearMessages());
    router.push("/");
  };

  const handleSelectHistory = (id: string) => {
    setSelectedConversationId(id);
  };

  // Load selected conversation from history
  useEffect(() => {
    if (selectedConversationId) {
      const selectedConversation = history.find(
        (item) => item.conversationId === selectedConversationId
      );
      if (selectedConversation) {
        dispatch(clearMessages());
        localStorage.removeItem("chatMessages");

        const userMessage = {
          id: generateUniqueId(),
          message: selectedConversation.query,
          isUser: true
        };
        dispatch(addUserMessage(userMessage));

        const botMessage = {
          id: generateUniqueId(),
          message: selectedConversation.response,
          isUser: false,
          isSystem: false
        };
        dispatch(addUserMessage(botMessage));
      }
    }
  }, [selectedConversationId, history, dispatch]);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f5f5" }}>
      <ChatHistory
        history={history}
        onNewChat={handleNewChat}
        onClearAll={handleClearAll}
        onLogout={handleLogout}
        onSelectConversation={handleSelectHistory}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "#f5f5f5",
          width: "100%",
          maxWidth: "none"
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0"
          }}
        >
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "black"
            }}
          >
            <img src="/image/thinkcoveLogo.svg" width="50" height="50" alt="Thinkcove Logo" />
            Thinkcove Chatbot
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              sx={{ bgcolor: "grey.200", "&:hover": { bgcolor: "grey.300" } }}
            >
              <img src="/image/uploadicon.svg" width="24" height="24" alt="Upload Icon" />
            </IconButton>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileUpload}
              accept=".xlsx,.xls"
            />
            <Avatar sx={{ bgcolor: "#211959", width: 32, height: 32 }}>
              {name ? name.charAt(0).toUpperCase() : ""}
            </Avatar>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            p: 3,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: messages.length === 0 ? "center" : "flex-start",
            width: "100%",
            maxWidth: "none"
          }}
        >
          {messages.length === 0 ? (
            <Box sx={{ width: "100%", maxWidth: "800px" }}>
              <Typography
                sx={{
                  textAlign: "center",
                  color: "black",
                  mb: 2,
                  fontSize: "1.2rem"
                }}
              >
                {name
                  ? `${greeting}, ${name}! How may I assist you today?`
                  : `${greeting}! How may I assist you today?`}
              </Typography>
              <TextInput input={input} setInput={setInput} handleSend={handleSend} />
            </Box>
          ) : (
            <>
              {messages.map((message: any) => (
                <Box
                  key={message.id}
                  sx={{
                    width: "100%",
                    maxWidth: "900px",
                    mb: 2,
                    display: "flex",
                    justifyContent: message.isUser ? "flex-end" : "flex-start"
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                    <Paper
                      sx={{
                        maxWidth: "90%",
                        minWidth: "200px",
                        p: 2,
                        bgcolor: message.isSystem
                          ? "#EEEEEE"
                          : message.isUser
                            ? "#EEEEEE"
                            : "#BDBDBD",
                        borderRadius: "12px",
                        border: "1px solid #e0e0e0",
                        boxShadow: "none",
                        width: "100%"
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "normal",
                          color: "black",
                          width: "100%",
                          fontSize: "1rem"
                        }}
                      >
                        {message.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "grey.500",
                          mt: 0.5,
                          display: "block",
                          width: "100%"
                        }}
                      >
                        {message.timestamp}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </Box>
        {messages.length > 0 && (
          <Box
            sx={{
              p: 2,
              bgcolor: "#ffffff",
              borderTop: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Box sx={{ width: "100%", maxWidth: "800px" }}>
              <TextInput input={input} setInput={setInput} handleSend={handleSend} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chatbot;
