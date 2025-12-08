// ChatSupport.jsx
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { GoogleAuthContext } from "../ GoogleAuthContext";

// Connect socket
const socket = io("http://localhost:5000");

export default function ChatSupport() {
  const { googleUser, logout } = useContext(GoogleAuthContext);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load previous chat messages from DB
  useEffect(() => {
    const loadHistory = async () => {
      if (!googleUser?._id) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/ai/messages/${googleUser._id}`
        );

        // Sort messages by creation time if they are not already sorted
        const sortedMessages = (res.data.messages || []).sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        setMessages(sortedMessages);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    loadHistory();
  }, [googleUser]);

  useEffect(() => {
    if (googleUser?._id) {
      socket.emit("register", googleUser._id);
    }
  }, [googleUser]);

  // Handles incoming messages from the server (usually the AI response)
  useEffect(() => {
    socket.on("newMessage", (newSavedMessage) => {
      console.log("Socket Incoming Message:", newSavedMessage);

      setMessages((prev) => {
        // 1. Check if this saved message is already in state (e.g., if it was
        // optimistically added by the client side before saving/emission)
        const isUserQueryAlreadyPresent = prev.some(
          (m) => m.userQuery === newSavedMessage.userQuery && !m.AiResponse // Check for an unsanswered message
        );

        if (isUserQueryAlreadyPresent) {
          // 2. If present, update the temporary message with the official message's data (including the AiResponse and DB-provided _id)
          return prev.map((m) =>
            m.userQuery === newSavedMessage.userQuery && !m.AiResponse
              ? newSavedMessage // Replace the temporary message with the final, complete one
              : m
          );
        } else {
          // 3. If not present (e.g., a message from another user in a different scenario), just add it.
          return [...prev, newSavedMessage];
        }
      });
    });

    return () => socket.off("newMessage");
  }, []);

  const handleAsk = async () => {
    if (!question) return alert("Enter your question");

    // Store the question locally before clearing the input
    const userQuestion = question;

    // 1. Optimistically update the messages state with the user's query
    const tempId = Date.now();
    const newUserMessage = {
      _id: tempId,
      userQuery: userQuestion,
      AiResponse: null,
      userId: googleUser._id,
      // Add a client-only flag for better handling if needed
      isPending: true,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setQuestion(""); // Clear input immediately for better UX
    setLoading(true);

    try {
      // 2. Send the request to the backend
      await axios.post("http://localhost:5000/api/ai/ask", {
        question: userQuestion,
        userId: googleUser._id,
      });

      // The backend will save the message and emit it via socket.io.
    } catch (err) {
      console.error("Ask AI Error:", err);
      // Remove the optimistically added message if the API call fails
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
    setLoading(false);
  };

  if (!googleUser) return <p>Please login with Google to use Chat Support.</p>;

  // Function to scroll chat window to the bottom whenever messages change
  const chatWindowRef = React.useRef(null);
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <p className="mb-2">Welcome, {googleUser.name}</p>

      <button
        className="bg-red-800 text-white px-4 py-2 rounded mb-4"
        onClick={logout}
      >
        Logout
      </button>

      {/* Chat Window - Added ref for auto-scrolling */}
      <div
        ref={chatWindowRef}
        className="h-[350px] overflow-y-auto border p-2 mb-3 bg-red-50 rounded shadow"
      >
        {messages.map((m) => (
          // Use m._id or a combination for a unique key
          <div key={m._id || m.userQuery} className="my-2">
            {/* USER MESSAGE */}
            {m.userQuery && (
              <div className="bg-blue-200 text-right p-2 rounded mb-1">
                <b>You:</b> {m.userQuery}
              </div>
            )}

            {/* AI MESSAGE */}
            {m.AiResponse && (
              <div className="bg-green-200 text-left p-2 rounded">
                <b>AI:</b> {m.AiResponse}
              </div>
            )}
            {/* Show a loading indicator for messages that are sent but not yet answered */}
            {m.userQuery && !m.AiResponse && m.isPending && (
              <div className="text-gray-500 text-sm text-right">Sending...</div>
            )}
          </div>
        ))}
      </div>

      {/* Ask input */}
      <textarea
        placeholder="Ask your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
        // Allow pressing Enter to send if not loading
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !loading) {
            e.preventDefault();
            handleAsk();
          }
        }}
      />

      <button
        onClick={handleAsk}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        disabled={loading || !question} // Disable if no question is typed
      >
        {loading ? "Processing..." : "Ask AI"}
      </button>
    </div>
  );
}
