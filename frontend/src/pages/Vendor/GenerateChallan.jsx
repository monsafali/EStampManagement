// src/components/GenerateChallan.jsx
import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/stamp";

const GenerateChallan = () => {
  // single-entry inputs
  const [denomination, setDenomination] = useState("");
  const [quantity, setQuantity] = useState("");

  // list of added items
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(false);

  // Add current input values to items list
  const handleAddItem = () => {
    const type = Number(denomination);
    const qty = Number(quantity);

    if (!type || type <= 0) {
      alert("Enter a valid denomination (e.g. 100, 200, 300).");
      return;
    }
    if (!qty || qty <= 0) {
      alert("Enter a valid quantity (e.g. 10).");
      return;
    }

    setItems((prev) => [...prev, { type, quantity: qty }]);
    setDenomination("");
    setQuantity("");
  };

  // Remove an item from the list
  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Download PDF by calling your existing createChallan endpoint
  const handleGenerateChallan = async () => {
    if (items.length === 0) return alert("Add at least one item first.");

    setLoading(true);
    try {
      // send vendor cookie jwt as you did previously
      const response = await axios.post(
        `${API_BASE}/createChallan`,
        { items },
        {
          responseType: "blob", // expecting PDF
          withCredentials: true,
        }
      );

      // download PDF
      const file = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = `challan.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Generate challan error:", err);
      alert("Error generating challan PDF. See console for details.");
    } finally {
      setLoading(false);
    }
  };


    
    const handleStripePay = async () => {
      // Open blank tab immediately to avoid popup blocker
      const newTab = window.open("", "_blank");

      const cleanedItems = items.map((row) => ({
        type: Number(row.type),
        quantity: Number(row.quantity),
      }));

      const res = await fetch(
        "http://localhost:5000/api/stamp/pay-via-stripe",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ items: cleanedItems }),
        }
      );

      const data = await res.json();

      // Redirect new tab to stripe checkout
      newTab.location.href = data.url;
    };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Generate Challan</h1>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Denomination (Rs)
          </label>
          <input
            type="number"
            value={denomination}
            onChange={(e) => setDenomination(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="e.g. 100"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="e.g. 10"
            min="0"
          />
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={handleAddItem}
          className="bg-green-600 text-white px-4 py-2 rounded mr-2"
        >
          + Add
        </button>

        <button
          onClick={() => {
            setDenomination("");
            setQuantity("");
          }}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Clear Inputs
        </button>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Added Items</h2>
        {items.length === 0 ? (
          <div className="text-sm text-gray-500">No items added yet.</div>
        ) : (
          <table className="w-full border mb-2">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2 border">Denomination (Rs)</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 border">{row.type}</td>
                  <td className="p-2 border">{row.quantity}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => removeItem(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleGenerateChallan}
          disabled={loading || items.length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Processing..." : "Generate Bank Challan (PDF)"}
        </button>

        <button
          onClick={handleStripePay}
          disabled={loading || items.length === 0}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Processing..." : "Pay with Stripe"}
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Tip: Add each denomination + quantity using the "+ Add" button. After
        adding the rows, choose "Generate Bank Challan" to download PDF or "Pay
        with Stripe" to create a challan and start Stripe checkout.
      </div>
    </div>
  );
};

export default GenerateChallan;
