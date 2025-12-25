import PUNJAB from "../../utils/District";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/components/create-user.shared.css";
import UserInfoPanel from "../../components/UserInfoPanel";


const CreateVendor = ({ districtName, districtId }) => {
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    district: districtName || "",
    districtId: districtId || "",
    tehsil: "", // will store tehsilId
    tehsilName: "", // will store tehsilName
    cnic: "",
    licenceNo: "",
    address: "",
    contactno: "",
    imageFile: null,
  });

  const [tehsils, setTehsils] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Update district when districtName changes
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      district: districtName || "",
      districtId: districtId || "",
    }));
  }, [districtName, districtId]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imageFile") {
      setForm({ ...form, imageFile: files[0] });
      return;
    }

    // Special handling for tehsil
    if (name === "tehsil") {
      const selectedTehsil = tehsils.find((t) => t.tehsilId === value);

      setForm({
        ...form,
        tehsil: selectedTehsil?.tehsilId || "",
        tehsilName: selectedTehsil?.tehsilName || "",
      });

      return;
    }

    setForm({ ...form, [name]: value });
  };

  // Get Tehsils from local PUNJAB file
  const fetchTehsils = (districtId) => {
    if (!districtId) return;

    const districtObj = PUNJAB.find((d) => d.districtId === districtId);

    setTehsils(districtObj?.tehsils || []);
  };

  useEffect(() => {
    fetchTehsils(districtId);
  }, [districtId]);

  // Submit Vendor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const fd = new FormData();
      fd.append("fullname", form.fullname);
      fd.append("username", form.username);
      fd.append("email", form.email);
      fd.append("password", form.password);

      fd.append("district", form.district);
      fd.append("districtId", form.districtId);

      fd.append("tehsil", form.tehsilName);
      fd.append("tehsilId", form.tehsil);

      fd.append("cnic", form.cnic);
      fd.append("licenceNo", form.licenceNo);
      fd.append("address", form.address);
      fd.append("contactno", form.contactno);

      fd.append("imageFile", form.imageFile);

      const res = await axios.post(
        "http://localhost:5000/api/adc/createvendor",
        fd,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message || "Vendor Created Successfully!");

      // Reset form
      setForm({
        fullname: "",
        username: "",
        email: "",
        password: "",
        district: districtName || "",
        districtId: districtId || "",
        tehsil: "",
        tehsilName: "",
        cnic: "",
        licenceNo: "",
        address: "",
        contactno: "",
        imageFile: null,
      });

      setTehsils([]);
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-wrapper">
      <div className="user-two-columns">
        {/* LEFT */}
        <div className="user-left">
          <h1>Create Vendor</h1>
          {message && <p className="create-user-message">{message}</p>}
          <form
            onSubmit={handleSubmit}
            className="form-container"
          >
            <div className="form-group">
              <input
                type="text"
                name="fullname"
                id="fullname"
                placeholder=""
                value={form.fullname}
                onChange={handleChange}
                required
              />
              <label htmlFor="fullname">Full Name</label>
            </div>
            <div className="form-group">
              <input
                type="text"
                name="username"
                id="username"
                placeholder=""
                value={form.username}
                onChange={handleChange}
                required
              />
              <label htmlFor="username">User Name</label>
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                id="email"
                placeholder=""
                value={form.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password"
                id="password"
                placeholder=""
                value={form.password}
                onChange={handleChange}
                required
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className="form-group">
              {/* Tehsil Dropdown */}
              <select
                name="tehsil"
                value={form.tehsil}
                onChange={handleChange}
                required
                disabled={!tehsils.length}
              >
                <option value="">Select Tehsil</option>
                {tehsils.map((t) => (
                  <option key={t.tehsilId} value={t.tehsilId}>
                    {t.tehsilName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <input
                type="text"
                name="cnic"
                placeholder=""
                id="cnic"
                value={form.cnic}
                onChange={handleChange}
                required
              />
              <label htmlFor="cnic">CNIC</label>
            </div>
            <div className="form-group">
              <input
                type="text"
                name="licenceNo"
                placeholder=""
                value={form.licenceNo}
                onChange={handleChange}
                required
              />
              <label htmlFor="licence">Licence</label>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="address"
                id="address"
                placeholder=""
                value={form.address}
                onChange={handleChange}
                required
              />
              <label htmlFor="address">Address</label>
            </div>
            <div className="form-group">
              <input
                type="text"
                name="contactno"
                id="contactno"
                placeholder=""
                value={form.contactno}
                onChange={handleChange}
                required
              />
              <label htmlFor="contactno">Contact No</label>
            </div>
            {/* Image Upload */}
            <div className="form-group">
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleChange}
                required
              />
            </div>
            <button
              disabled={loading}
              className="form-btn"
            >
              {loading ? "Creating..." : "Create Vendor"}
            </button>
          </form>
        </div>
      
        {/* RIGHT: INFO PANEL */}
        <UserInfoPanel
          title="Why Create a Vendor?"
          description="Vendors are authorized sellers responsible for issuing e-stamps to citizens."
          list={[
            "Sell E-Stamps",
            "Verify Customer Identity",
            "Maintain Sales Records",
            "Coordinate with ADC Office",
          ]}
        />

      </div>
    </div>
  );
};

export default CreateVendor;
