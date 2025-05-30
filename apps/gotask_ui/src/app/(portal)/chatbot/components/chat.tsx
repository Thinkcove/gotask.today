// import { useState } from "react";
// import { QueryResponse } from "../interface/chatInterface";
// import { sendQuery, uploadAttendance } from "../service/chatAction";

// const Chat: React.FC = () => {
//   const [input, setInput] = useState("");
//   const [conversation, setConversation] = useState<QueryResponse[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Handle sending a query
//   const handleSend = async () => {
//     if (!input.trim()) return;
//     setLoading(true);
//     try {
//       const userMessage = { message: input, timestamp: new Date().toISOString(), isUser: true };
//       const response = await sendQuery(input);
//       setConversation((prev) => [...prev, userMessage, response]);
//       setInput("");
//     } catch (error) {
//       console.error("Error sending query:", error);
//       setConversation((prev) => [
//         ...prev,
//         { message: "Error sending query", timestamp: new Date().toISOString() }
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle file upload
//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
//     setLoading(true);
//     try {
//       const response = await uploadAttendance(file);
//       setConversation((prev) => [
//         ...prev,
//         {
//           message: `Attendance uploaded: ${response.inserted} inserted, ${response.skipped} skipped`,
//           timestamp: new Date().toISOString()
//         }
//       ]);
//     } catch (error) {
//       console.error("Upload failed:", error);
//       setConversation((prev) => [
//         ...prev,
//         { message: "Error uploading file", timestamp: new Date().toISOString() }
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Chat</h2>
//       <div className="border p-4 h-64 overflow-y-auto mb-4">
//         {conversation.map((msg, index) => (
//           <p key={index} className={msg.isUser ? "text-blue-600" : "text-green-600"}>
//             {msg.isUser ? "You: " : "Bot: "}
//             {msg.message} <span className="text-gray-400 text-sm">({msg.timestamp})</span>
//           </p>
//         ))}
//       </div>
//       <div className="flex gap-2 mb-4">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="border p-2 flex-grow"
//           placeholder="Type your query..."
//           disabled={loading}
//         />
//         <button
//           onClick={handleSend}
//           className="bg-blue-500 text-white p-2 rounded"
//           disabled={loading}
//         >
//           {loading ? "Sending..." : "Send"}
//         </button>
//       </div>
//       <div>
//         <label className="block mb-2">Upload Attendance:</label>
//         <input
//           type="file"
//           onChange={handleFileUpload}
//           accept=".xlsx,.xls"
//           className="border p-2"
//           disabled={loading}
//         />
//       </div>
//     </div>
//   );
// };

// export default Chat;

import { useState, useRef, useEffect } from "react";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import FormField from "@/app/component/formField";
import { sendQuery, uploadAttendance, useQueryHistory } from "../service/chatAction";
import { QueryResponse } from "../interface/chatInterface";
import ChatHistory from "./chatHitory";
import { useRouter } from "../../../../../node_modules/next/navigation";

// Define TextInput component using the separate FormField component
const TextInput: React.FC<{
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
}> = ({ input, setInput, handleSend }) => (
  <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
    <FormField
      type="text"
      value={input}
      onChange={(value: any) => setInput(value as string)}
      placeholder="Ask me something"
      onSend={handleSend}
      sx={{
        flex: 1,
        "& .MuiFormControl-root": {
          borderRadius: "12px",
          border: "1px solid #e0e0e0",
          "&:focus-within": {
            borderColor: "#741B92",
            backgroundColor: "#fff"
          }
        },
        "& .MuiInputBase-root": {
          padding: "10px",
          fontSize: "1rem"
        }
      }}
    />
  </Box>
);

const Chat: React.FC = () => {
  const router = useRouter();
  const { history } = useQueryHistory();
  const [messages, setMessages] = useState<QueryResponse[]>([]);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [greeting, setGreeting] = useState<string>("Good Day");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 12) setGreeting("Good Morning");
      else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    } else {
      localStorage.removeItem("chatMessages");
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectedConversationId) {
      const selectedConversation = history.find(
        (item: any) => item.conversationId === selectedConversationId
      );
      if (selectedConversation) {
        const userMessage = {
          id: generateUniqueId(),
          message: selectedConversation.query,
          timestamp:
            selectedConversation.timestamp ||
            new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isUser: true
        };
        const botMessage = {
          id: generateUniqueId(),
          message: selectedConversation.response,
          timestamp:
            selectedConversation.timestamp ||
            new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isUser: false,
          isSystem: false
        };
        setMessages([userMessage, botMessage]);
      }
    }
  }, [selectedConversationId, history]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: QueryResponse = {
      id: generateUniqueId(),
      message: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isUser: true
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

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
        message: "Error: Unable to send query",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isUser: false,
        isSystem: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      const systemMessage: QueryResponse = {
        id: generateUniqueId(),
        message: "Please upload a valid Excel file (.xlsx or .xls).",
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
  };

  const handleNewChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
    setSelectedConversationId(null);
  };

  const handleClearAll = () => {
    setMessages([]);
    setSelectedConversationId(null);
  };

  // const handleRedirect = () => {
  //   setMessages([]);
  //   router.push("/");
  // };

  const handleSelectHistory = (id: string) => {
    setSelectedConversationId(id);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#ffffff" }}>
      <ChatHistory
        onNewChat={handleNewChat}
        onClearAll={handleClearAll}
        // onRedirect={handleRedirect}
        onSelectConversation={handleSelectHistory}
      />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "#ffffff" }}>
        {/* Header */}
        {/* <Box
          sx={{
            p: 2,
            bgcolor: "#800080",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0"
          }}
        > */}
        {/* <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 1
            }}
          >
            <img src="/image/thinkroveLogo.svg" width="30" height="30" alt="Thinkrove Logo" />
            Thinkrove Chatbot
          </Typography> */}
        {/* </Box> */}

        {/* Chat Area */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: messages.length === 0 ? "center" : "flex-start"
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
                {`${greeting}! How may I assist you today?`}
              </Typography>
              <TextInput input={input} setInput={setInput} handleSend={handleSend} />
            </Box>
          ) : (
            <>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    width: "100%",
                    maxWidth: "800px",
                    mb: 2,
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
            </>
          )}
        </Box>

        {/* Input Area */}
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
            <Box sx={{ width: "100%", maxWidth: "800px", display: "flex", gap: 1 }}>
              <TextInput input={input} setInput={setInput} handleSend={handleSend} />
              <IconButton
                onClick={() => fileInputRef.current?.click()}
                sx={{ bgcolor: "#EEEEEE", "&:hover": { bgcolor: "#D3D3D3" } }}
              >
                <img src="/image/paperclip.svg" width="20" height="20" alt="Attachment" />
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
                accept=".xlsx,.xls"
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chat;
