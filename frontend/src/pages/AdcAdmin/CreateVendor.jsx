import PUNJAB from "../../utils/District";
import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Vendor</h1>

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

        {/* Tehsil Dropdown */}
        <select
          name="tehsil"
          value={form.tehsil}
          onChange={handleChange}
          className="w-full p-2 border rounded"
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

        <input
          type="text"
          name="cnic"
          placeholder="CNIC"
          value={form.cnic}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="licenceNo"
          placeholder="Licence No"
          value={form.licenceNo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="contactno"
          placeholder="Contact No"
          value={form.contactno}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Image Upload */}
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          {loading ? "Creating..." : "Create Vendor"}
        </button>
      </form>
    </div>
  );
};

export default CreateVendor;
