



import PUNJAB from "../../utils/District";

import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateADCAdmin = () => {
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    district: "",
    districtId: "",
    tehsil: "",
    tehsilId: "",
    imageFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);

  // Load All Districts on Mount
  useEffect(() => {
    setDistricts(PUNJAB.map((d) => d)); // full district object
  }, []);

  // Handle inputs
  const handleChange = (e) => {
    if (e.target.name === "imageFile") {
      setForm({ ...form, imageFile: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Handle District Selection
  const handleDistrictChange = (e) => {
    const selected = districts.find(
      (d) => d.districtId.toString() === e.target.value
    );

    setForm({
      ...form,
      districtId: selected?.districtId || "",
      district: selected?.districtName || "",
    });
  };

  // Submit Handler
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
      fd.append("imageFile", form.imageFile);

      const res = await axios.post(
        "http://localhost:5000/api/admin/createADCAdmin",
        fd,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message || "ADC Admin Created Successfully!");

      setForm({
        fullname: "",
        username: "",
        email: "",
        password: "",
        district: "",
        districtId: "",
        imageFile: null,
      });
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <br /><br />
      <h1 className="text-2xl font-bold mb-4">Create ADC Admin</h1>

      {message && (
        <p className="mb-3 text-white p-2 rounded bg-blue-500">{message}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="form-container"
      >
        <div className="form-group">
          <input
            type="text"
            name="fullname"
            id="fullname"
            placeholder=" "
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
            placeholder=" "
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
            placeholder=" "
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
            placeholder=" "
            value={form.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        {/* District Select */}
        <div className="form-group">
          <select
            name="districtId"
            value={form.districtId}
            onChange={handleDistrictChange}
            required
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.districtId} value={d.districtId}>
                {d.districtName}
              </option>
            ))}
          </select>
          <label htmlFor="districtId">District</label>
        </div>

        <div className="form-group">
          <input
            type="file"
            name="imageFile"
            id="imageFile"
            accept="image/*"
            onChange={handleChange}
          placeholder=" "
            required
          />
          <label htmlFor="imageFile">Upload Photo</label>
        </div>

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          {loading ? "Creating..." : "Create ADC Admin"}
        </button>
      </form>
    </div>
  );
};

export default CreateADCAdmin;
