// src/components/GenerateChallan.jsx
import React, { useState } from "react";
import axios from "axios";
import DataTable from "../../components/common/DataTable";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import "../../styles/pages/vendor/generate-challan.css"
const API_BASE = "http://localhost:5000/api/stamp";
const columns = [
  {
    key: "type",
    label: "Denomination (Rs)",
  },
  {
    key: "quantity",
    label: "Quantity",
  },
];
const GenerateChallan = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // list of added items
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddItem = (data) => {
    const type = Number(data.denomination);
    const qty = Number(data.quantity);

    setItems((prev) => [
      ...prev,
      {
        _id: Date.now(),
        type,
        quantity: qty,
      },
    ]);

    toast.success("Item added successfully");
    reset();
  };

  // Remove an item from the list
  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Download PDF by calling your existing createChallan endpoint
  const handleGenerateChallan = async () => {
    if (items.length === 0) {
      toast.error("Add at least one item first");
      return;
    }


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
      toast.error("Error generating challan PDF. See console for details.");

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
    <div className="challan-card">
      {/* inputs */}
      <form onSubmit={handleSubmit(handleAddItem)}>
        <div className="input-group">
          <div className="form-group">
            <input
              className={errors.denomination ? "error" : ""}
              type="number"
              min="1"
              {...register("denomination", {
                required: "Denomination is required",
                min: { value: 1, message: "Must be greater than 0" },
              })}
            />

            <label>
              Denomination (Rs)
            </label>
            {errors.denomination && (
              <span className="input-error">
                {errors.denomination.message}
              </span>
            )}
          </div>
          <div className="form-group">

            <input
              className={errors.quantity ? "error" : ""}
              type="number"
              min="1"
              {...register("quantity", {
                required: "Quantity is required",
                min: { value: 1, message: "Must be greater than 0" },
              })}
            />

            {/* e.g. 10 */}
            <label>Quantity</label>
            {errors.quantity && (
              <span className="input-error">
                {errors.quantity.message}
              </span>
            )}
          </div>
        </div>
        {/* Action buttons */}
        <div className="challan-actions">

          <button type="submit" className="btn btn-success">
            + Add
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => reset()}
          >
            Clear Inputs
          </button>

        </div>
      </form>
      {/* Items table */}
      <div className="challan-table-section">
        {items.length === 0 ? (
          <div className="empty-state">No items added yet.</div>
        ) : (
    
          <DataTable
            title="Added Items"
            columns={columns}
            data={items}
            renderActions={(row) => (
              <button
                className="btn btn-danger btn-sm"
                onClick={() =>
                  removeItem(items.findIndex((i) => i._id === row._id))
                }
              >
                Remove
              </button>
            )}
          />

        )}
      </div>


      {/* Footer buttons */}
      <div className="challan-footer">
        <button
          className="btn btn-primary"
          onClick={handleGenerateChallan}
          disabled={loading || items.length === 0}
        >
          {loading ? "Processing..." : "Generate Bank Challan (PDF)"}
        </button>

        <button
          className="btn btn-indigo"
          onClick={handleStripePay}
          disabled={loading || items.length === 0}
        >
          {loading ? "Processing..." : "Pay with Stripe"}
        </button>
      </div>

      <p className="challan-hint">
        Tip: Add each denomination + quantity, then generate a bank challan PDF or
        proceed with Stripe payment.
      </p>
    </div>
  );
};

export default GenerateChallan;
