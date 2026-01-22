import React, { useEffect } from "react";
import { API_BASE_URL } from "../../api";

const Success = () => {
  useEffect(() => {
    const session_id = new URLSearchParams(window.location.search).get(
      "session_id",
    );

    if (!session_id) {
      console.error("❌ No session_id found in URL");
      return;
    }

    const loadStamps = async () => {
      try {
        const res = await API_BASE_URL.post(
          "/api/stamp/stripe-success-load-stamps",
          { session_id },
          { withCredentials: true },
        );

        console.log("✅ Stamps Loaded:", res.data);
      } catch (err) {
        console.error("❌ Error loading stamps:", err);
      }
    };

    loadStamps();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold bg-green-500 text-white">
        Payment Successfully Done 🎉
      </h1>
    </div>
  );
};

export default Success;
