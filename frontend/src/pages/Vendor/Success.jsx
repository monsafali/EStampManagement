import React, { useEffect } from "react";
import { API_BASE_URL } from "../../api";

const Success = () => {
  useEffect(() => {
    const session_id = new URLSearchParams(window.location.search).get(
      "session_id"
    );

    if (!session_id) {
      console.error("❌ No session_id found in URL");
      return;
    }

    fetch(`${API_BASE_URL}/api/stamp/stripe-success-load-stamps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ session_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Stamps Loaded:", data);
      })
      .catch((err) => {
        console.error("❌ Error loading stamps:", err);
      });
  }, []);

  return (
    <div >
      <h1 className="text-4xl font-bold bg-green-500 text-white">
        Payment Successfully Done 🎉
      </h1>
    </div>
  );
};

export default Success;
