
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
          const baseUrl = import.meta.env.VITE_LOCATION_API;
          try {
            const res = await fetch(
              `${baseUrl}&lat=${latitude}&lon=${longitude}`
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
  // yh
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Generate Stamp</h1>

      {geoError && <p className="text-red-500 mb-2">{geoError}</p>}

      <form onSubmit={handleDownload} className="form-container">

        {/* Applicant */}
        <div className="input-group">
          <div className="form-group">
            <input
              name="Applicant"
              id="application"
              placeholder=" "
              value={formData.Applicant}
              onChange={handleChange}
            />
            <label htmlFor="application">Applicant</label>
          </div>
          {/* CNIC */}
          <div className="form-group">
            <input
              name="cnic"
              id="cnic"
              maxLength="13"
              inputMode="numeric"
              placeholder=" "
              value={formData.cnic}
              onChange={handleChange}
            />
            <label htmlFor="cnic">CNIC</label>
          </div>
        </div>
        <div className="input-group ">
          {/* Relation Name */}
          <div className="form-group col-70">
            <input
              name="Relation_Name"
              placeholder=" "
              value={formData.Relation_Name}
              onChange={handleChange}
            />
            <label>Relation Name</label>
          </div>
          {/* Relation */}
          <div className="form-group col-30">
            <select
              name="Relation"
              value={formData.Relation}
              onChange={handleChange}
            >
              <option value="">Select Relation</option>
              {relationOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

          </div>
        </div>
        <div className="input-group">
          {/* Agent */}
          <div className="form-group">
            <input
              name="agent"
              placeholder=" "
              value={formData.agent}
              onChange={handleChange}
            />
            <label>Agent</label>
          </div>
          {/* Email */}
          <div className="form-group">
            <input
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
            />
            <label>Email</label>
          </div>
        </div>

        <div className="input-group">
          {/* Phone */}
          <div className="form-group">
            <input
              name="phone"
              placeholder=" "
              inputMode="tel"
              value={formData.phone}
              onChange={handleChange}
            />
            <label>Phone</label>
          </div>

          {/* Address */}
          <div className="form-group">
            <input
              name="address"
              placeholder=" "
              value={formData.address}
              onChange={handleChange}
            />
            <label>Address</label>
          </div>
        </div>
        {/* Reason */}
        <div className="form-group">
          <textarea
            name="reason"
            placeholder=" "
            value={formData.reason}
            onChange={handleChange}
          />
          <label>Reason</label>
        </div>
        <div className="input-group">

          {/* Stamp Amount */}
          <div className="form-group col-70">
            <input readOnly
              placeholder=" "
              id="stamp-amount"
              value={formData.StampAmount} />
            <label htmlFor="stamp-amount">Stamp Amount</label>
          </div>
          {/* Description */}
          <div className="form-group col-30">

            <select
              name="Description"
              value={formData.Description}
              onChange={handleChange}
            >
              <option value="">Select Description</option>
              {Object.keys(descriptionPrices).map((desc) => (
                <option key={desc} value={desc}>{desc}</option>
              ))}
            </select>

          </div>
        </div>




        {/* Stamp Type */}
        <div className="form-group">
          <input readOnly value={formData.Stamptype} />
          {/* <label>Stamp Type</label> */}
        </div>

        {/* Vendor Info */}
        <div className="form-group">
          <input readOnly value={formData.vendorInfo} />
          <label>Vendor Info</label>
        </div>

        <button type="submit" className="form-btn">
          Download Stamp PDF
        </button>
      </form>

    </div>
  );
}

