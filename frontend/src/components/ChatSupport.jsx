import React, { useContext, useState } from "react";
import axios from "axios";
import { GoogleAuthContext } from '../ GoogleAuthContext';





export default function ChatSupport() {
  const { googleUser, logout } = useContext(GoogleAuthContext);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question) return alert("Enter your question");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/ai/ask", {
        question,
      });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      setAnswer("Error communicating with AI server.");
    }
    setLoading(false);
  };

  if (!googleUser)
      return <p>Please login with Google to use Chat Support.</p>;
  return (
    <div className="p-4 max-w-md mx-auto">
      <p>
        Welcome, {googleUser.name} pleas ask whatever your query have reqarding
        stamp{" "}
      </p>
      <button
        className="bg-red-900 text-white px-4 py-2 rounded"
        onClick={logout}
      >
        Logout
      </button>

      <textarea
        placeholder="Ask your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />
      <button
        onClick={handleAsk}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Processing..." : "Ask AI"}
      </button>
      {answer && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
