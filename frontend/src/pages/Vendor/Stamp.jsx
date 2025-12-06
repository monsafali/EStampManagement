import { useState, useEffect, useContext } from "react";
import axios from "axios";

import { AuthContext } from "../../AuthContext";

export default function Stamp() {
  const { user, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    Stamptype: "Low Denomination",
    StampAmount: "",
    Description: "",
    Applicant: "",
    cnic: "",
    Relation: "",
    Relation_Name: "",
    agent: "",
    email: "",
    phone: "",
    address: "",
    reason: "",
    vendorInfo: "",
  });

  const descriptionPrices = {
    "AGREEMENT OR MEMORANDUM OF AN AGREEMENT - 5(ccc)": 100,
    "PARTNERSHIP - 46(a)": 200,
    "AFFIDAVIT - 4": 300,
    "ADOPTION DEED - 3": 100,
    "TRANSFER - 62(c)": 200,
    "POWER OF ATTORNEY - 48(c)": 300,
    Divorced: 300,
  };

  const relationOptions = ["", "S/O", "D/O", "W/O", "F/O", "Widow/Of"];

  // Fetch vendor info
  useEffect(() => {
    async function LoadVendor() {
        const vendorInfoString = `${user.fullname} | ${user.licenceNo} | ${user.address}`;
        setFormData((prev) => ({ ...prev, vendorInfo: vendorInfoString }));
   
    }
    LoadVendor();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-set StampAmount if Description changes
    if (name === "Description") {
      setFormData({
        ...formData,
        Description: value,
        StampAmount: descriptionPrices[value] || "",
      });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleDownload = async (e) => {
    e.preventDefault();

    // Ensure all keys exist
    const bodyToSend = {
      Stamptype: formData.Stamptype || "",
      StampAmount: formData.StampAmount || "",
      Description: formData.Description || "",
      Applicant: formData.Applicant || "",
      cnic: formData.cnic || "",
      Relation: formData.Relation || "",
      Relation_Name: formData.Relation_Name || "",
      agent: formData.agent || "",
      email: formData.email || "",
      phone: formData.phone || "",
      address: formData.address || "",
      reason: formData.reason || "",
      vendorInfo: formData.vendorInfo || "",
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/stamp/generate-pdf",
        bodyToSend,
        { responseType: "blob", withCredentials: true }
      );

      // Check if backend actually returned a PDF
      const file = new Blob([res.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = "stamp.pdf";
      link.click();
    } catch (err) {
      // Handle backend error response
      if (err.response && err.response.data) {
        try {
          // Try parsing JSON from response
          const reader = new FileReader();
          reader.onload = () => {
            const text = reader.result;
            try {
              const json = JSON.parse(text);
              alert(json.message || "Stamp not available");
            } catch {
              alert("Error generating PDF");
            }
          };
          reader.readAsText(err.response.data);
        } catch {
          alert("Error generating PDF");
        }
      } else {
        alert("Error generating PDF");
      }
      console.error(err);
    }
  };

  return (
    <>
      <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Generate Stamp</h1>

        <form onSubmit={handleDownload} className="space-y-4">
          {/* Applicant */}
          <div>
            <label className="block mb-1 font-medium">Applicant</label>
            <input
              name="Applicant"
              value={formData.Applicant}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          {/* CNIC */}
          <div>
            <label className="block mb-1 font-medium">CNIC</label>
            <input
              name="cnic"
              value={formData.cnic}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          {/* Relation */}
          <div>
            <label className="block mb-1 font-medium">Relation</label>
            <select
              name="Relation"
              value={formData.Relation}
              onChange={handleChange}
              className="border p-2 w-full"
            >
              {relationOptions.map((r) => (
                <option key={r} value={r}>
                  {r || "Select Relation"}
                </option>
              ))}
            </select>
          </div>

          {/* Relation Name */}
          <div>
            <label className="block mb-1 font-medium">Relation Name</label>
            <input
              name="Relation_Name"
              value={formData.Relation_Name}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          {/* Agent */}
          <div>
            <label className="block mb-1 font-medium">Agent</label>
            <input
              name="agent"
              value={formData.agent}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 font-medium">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block mb-1 font-medium">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <select
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              className="border p-2 w-full"
            >
              <option value="">Select Description</option>
              {Object.keys(descriptionPrices).map((desc) => (
                <option key={desc} value={desc}>
                  {desc}
                </option>
              ))}
            </select>
          </div>

          {/* Stamp Amount */}
          <div>
            <label className="block mb-1 font-medium">Stamp Amount</label>
            <input
              readOnly
              value={formData.StampAmount}
              className="border p-2 w-full bg-gray-100"
            />
          </div>

          {/* Stamp Type */}
          <div>
            <label className="block mb-1 font-medium">Stamp Type</label>
            <input
              readOnly
              value={formData.Stamptype}
              className="border p-2 w-full bg-gray-200"
            />
          </div>

          {/* Vendor Info */}
          <div>
            <label className="block mb-1 font-medium">Vendor Info</label>
            <input
              readOnly
              value={formData.vendorInfo}
              className="border p-2 w-full bg-gray-200"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Download Stamp PDF
          </button>
        </form>
      </div>

 
    </>
  );
}
