// src/components/GenerateChallan.jsx
import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";


import DataTable from "../../components/common/DataTable";
import Tooltip from "../../components/common/Tooltip";
import CustomSelect from "../../components/common/CustomSelect";


import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

import "../../styles/pages/vendor/generate-challan.css"
import { API_BASE_URL } from "../../api";



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
const DENOMINATION_OPTIONS = [
  { label: "100 Rs", value: 100 },
  { label: "200 Rs", value: 200 },
  { label: "500 Rs", value: 500 },
  { label: "1000 Rs", value: 1000 },
];

const GenerateChallan = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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
        // _id: Date.now(),
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
    toast.success("Item added successfully");

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
      const response = await API_BASE_URL.post(
        'api/stamp/createChallan',
        { items },
        {
          responseType: "blob", // expecting PDF
          withCredentials: true,
        },
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

    try {
      const res = await API_BASE_URL.post("/api/stamp/pay-via-stripe", {
        items: cleanedItems,
      });

      // Redirect new tab to stripe checkout
      newTab.location.href = res.data.url;
    } catch (err) {
      newTab.close();
      console.error(err);
      alert("Stripe payment failed");
    }
  };


  return (
    <div className="challan-card">
      {/* inputs */}
      <form onSubmit={handleSubmit(handleAddItem)} className="form-container">
        <div className="input-group">
          <div className="form-group">
            <CustomSelect
              name="denomination"
              label="Denomination (Rs)"
              options={DENOMINATION_OPTIONS}
              value={watch("denomination")}
              register={register}
              setValue={setValue}
              required={true}
              error={errors.denomination?.message}
              placeholder="Select denomination"
            />
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

          <button type="submit" className="btn btn-success sliding-overlay-btn">
            < AddCircleOutlineOutlinedIcon /> <span>Add</span>
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
              <Tooltip text="Delete item" position="top">
                <button
                  className="btn"
                  onClick={() => removeItem(items.indexOf(row))}
                >
                  <DeleteIcon sx={{ color: '#ef4444' }} />
                </button>
              </Tooltip>

            )}

          />

        )}
      </div>


      {/* Footer buttons */}
      <div className="challan-footer">
        <button
          className="btn btn-primary sliding-overlay-btn"
          onClick={handleGenerateChallan}
          disabled={loading || items.length === 0}
        >
          {loading ? "Processing..." : "Generate Bank Challan (PDF)"}
        </button>

        <button
          className="btn btn-indigo sliding-overlay-btn"
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
