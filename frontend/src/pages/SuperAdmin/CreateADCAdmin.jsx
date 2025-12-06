

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
    imageFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [districts, setDistricts] = useState([]);

  // Load districts on component mount
  const loadDistricts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/districts/all");
      setDistricts(res.data);
    } catch (error) {
      console.log("Error loading districts:", error);
    }
  };

  useEffect(() => {
    loadDistricts();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    if (e.target.name === "imageFile") {
      setForm({ ...form, imageFile: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Handle district selection
  const handleDistrictChange = (e) => {
    const selected = districts.find((d) => d.Id.toString() === e.target.value);

    setForm({
      ...form,
      districtId: selected?.Id || "",
      district: selected?.Name || "",
    });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Create FormData
      const fd = new FormData();
      fd.append("fullname", form.fullname);
      fd.append("username", form.username);
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("district", form.district);
      fd.append("districtId", form.districtId);
      fd.append("imageFile", form.imageFile); // IMPORTANT

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
      <h1 className="text-2xl font-bold mb-4">Create ADC Admin</h1>

      {message && (
        <p className="mb-3 text-white p-2 rounded bg-blue-500">{message}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 border p-4 rounded shadow"
      >
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={form.fullname}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* District select */}
        <select
          name="districtId"
          value={form.districtId}
          onChange={handleDistrictChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d.Id} value={d.Id}>
              {d.Name}
            </option>
          ))}
        </select>

        <input
          type="file"
          name="imageFile"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

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
