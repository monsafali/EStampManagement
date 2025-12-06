
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

  const [geoTehsil, setGeoTehsil] = useState("");
  const [geoError, setGeoError] = useState("");

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
    const vendorInfoString = `${user.fullname} | ${user.licenceNo} | ${user.address}`;
    setFormData((prev) => ({ ...prev, vendorInfo: vendorInfoString }));

    // Auto-fetch current location on component load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const address = data.address || {};
            const tehsil =
              address.county ||
              address.city ||
              address.town ||
              address.village ||
              "";
            setGeoTehsil(tehsil);
          } catch (err) {
            setGeoError("Failed to fetch location.");
          }
        },
        (error) => setGeoError(error.message)
      );
    } else {
      setGeoError("Geolocation not supported.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

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

    // Check if vendor is in correct Tehsil
    if (!geoTehsil) {
      alert("Unable to determine your location. Please try again.");
      return;
    }


    if (geoTehsil.toUpperCase() !== user.tehsil.toUpperCase()) {
      alert(
        `You are out of your assigned Tehsil (${user.tehsil}). Current Tehsil: ${geoTehsil}. You cannot issue stamps!`
      );
      return;
    }

    // Send form to backend
    const bodyToSend = { ...formData };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/stamp/generate-pdf",
        bodyToSend,
        { responseType: "blob", withCredentials: true }
      );

      const file = new Blob([res.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = "stamp.pdf";
      link.click();
    } catch (err) {
      alert("Error generating PDF");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Generate Stamp</h1>

      {geoError && <p className="text-red-500 mb-2">{geoError}</p>}

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
  );
}

