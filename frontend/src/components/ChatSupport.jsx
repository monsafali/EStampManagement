
// ChatSupport.jsx
import React, {
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import axios from "axios";
import io from "socket.io-client";
import { GoogleAuthContext } from "../ GoogleAuthContext";
import "../styles/components/chat.css";

// Connect socket
const socket = io("http://localhost:5000");

export default function ChatSupport() {
  const { googleUser, logout } = useContext(GoogleAuthContext);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  //  NEW: inline autocomplete text
  const [autoComplete, setAutoComplete] = useState("");

  // Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      if (!googleUser?._id) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/ai/messages/${googleUser._id}`
        );

        const sorted = (res.data.messages || []).sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        setMessages(sorted);
      } catch (err) {
        console.error("History load error:", err);
      }
    };

    loadHistory();
  }, [googleUser]);

  // Register socket
  useEffect(() => {
    if (googleUser?._id) {
      socket.emit("register", googleUser._id);
    }
  }, [googleUser]);

  // Socket listener
  useEffect(() => {
    socket.on("newMessage", (savedMessage) => {
      setMessages((prev) => {
        const pendingExists = prev.some(
          (m) =>
            m.userQuery === savedMessage.userQuery &&
            m.isPending
        );

        if (pendingExists) {
          return prev.map((m) =>
            m.userQuery === savedMessage.userQuery && m.isPending
              ? savedMessage
              : m
          );
        }

        return [...prev, savedMessage];
      });
    });

    return () => socket.off("newMessage");
  }, []);
  // ✅ INLINE AUTOCOMPLETE (DEBOUNCED)
  useEffect(() => {
    if (!question || question.length < 3) {
      setAutoComplete("");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/ai/suggest",
          { text: question }
        );

        const suggestion = res.data.suggestions?.[0] || "";

        if (
          suggestion &&
          suggestion.toLowerCase().startsWith(question.toLowerCase())
        ) {
          setAutoComplete(suggestion.slice(question.length));
        } else {
          setAutoComplete("");
        }
      } catch {
        setAutoComplete("");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [question]);

  const handleAsk = async () => {
    if (!question) return;

    const userQuestion = question;
    const tempId = Date.now();

    const tempMessage = {
      _id: tempId,
      userQuery: userQuestion,
      AiResponse: null,
      userId: googleUser._id,
      isPending: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setQuestion("");
    setAutoComplete("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/ai/ask", {
        question: userQuestion,
        userId: googleUser._id,
      });
    } catch (err) {
      setMessages((prev) =>
        prev.filter((m) => m._id !== tempId)
      );
    }

    setLoading(false);
  };

  if (!googleUser)
    return <p>Please login with Google.</p>;

  const chatWindowRef = useRef(null);
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop =
        chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-box">
      <div className="chat-header">
        <p>Welcome, {googleUser.name}</p>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div ref={chatWindowRef} className="chat-window">
        {messages.map((m) => (
          <div key={m._id || m.userQuery} className="chat-message">
            {m.userQuery && (
              <div className="user-msg">{m.userQuery}</div>
            )}

            {m.AiResponse && (
              <div className="ai-msg">{m.AiResponse}</div>
            )}

            {m.isPending && !m.AiResponse && (
              <div className="pending-msg">Sending...</div>
            )}
          </div>
        ))}
      </div>

      {/* INPUT AREA */}
      <div className="chat-input-area">
        {/* 🔹 INLINE AUTOCOMPLETE WRAPPER */}
        <div className="input-wrapper">
          <div className="ghost-text">
            <span>{question}</span>
            <span className="ghost">{autoComplete}</span>
          </div>

          <textarea
            className="chat-input"
            placeholder="Ask your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              // TAB → accept suggestion
              if (e.key === "Tab" && autoComplete) {
                e.preventDefault();
                setQuestion(question + autoComplete);
                setAutoComplete("");
                return;
              }

              // ENTER → send
              if (e.key === "Enter" && !e.shiftKey && !loading) {
                e.preventDefault();
                handleAsk();
              }
            }}
          />
        </div>

        <button
          onClick={handleAsk}
          className="chat-send-btn"
          disabled={loading || !question}
        >
          {loading ? "Processing..." : "Ask AI"}
        </button>
      </div>
    </div>
  );
}




