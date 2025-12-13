import React, { useState } from "react";
import axios from "axios";
import GetADCAdmins from "./GetADCAdmins";
import UpdateADCAdmin from "./UpdateADCAdmin";

const ManageADCAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    district: "",
  });
  const [message, setMessage] = useState("");

  const fetchAdmins = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/getAllADCAdmin",
      { withCredentials: true }
    );
    setAdmins(res.data.adcAdmins || []);
  };

  const startEditing = (admin) => {
    setEditingAdmin(admin);
    setForm({
      fullname: admin.fullname,
      username: admin.username,
      email: admin.email,
      district: admin.district,
    });
  };

const updateAdmin = async (e) => {
  e.preventDefault();

  if (!editingAdmin) return;

  try {
    const fd = new FormData();
    // append only fields we have
    fd.append("fullname", form.fullname || "");
    fd.append("username", form.username || "");
    fd.append("email", form.email || "");
    fd.append("district", form.district || "");

    if (form.imageFile) {
      fd.append("imageFile", form.imageFile);
    }

    // DO NOT set Content-Type header manually — let axios set the boundary
    const res = await axios.put(
      `http://localhost:5000/api/admin/updateADCAdmin/${editingAdmin._id}`,
      fd,
      {
        withCredentials: true,
        // headers: { "Content-Type": "multipart/form-data" }  <-- remove this
      }
    );

    setMessage(res.data.message || "Updated successfully");
    await fetchAdmins();
    setEditingAdmin(null);
  } catch (err) {
    console.error(err);
    setMessage(err.response?.data?.message || "Update failed");
  }
};



const handleChange = (e) => {
  if (e.target.name === "imageFile") {
    setForm({ ...form, imageFile: e.target.files[0] });
  } else {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
};

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {message && (
        <p className="p-2 bg-blue-500 text-white mb-4 rounded">{message}</p>
      )}

      <GetADCAdmins
        admins={admins}
        fetchAdmins={fetchAdmins}
        onEdit={startEditing}
      />

      <UpdateADCAdmin
        form={form}
        handleChange={handleChange}
        updateAdmin={updateAdmin}
        editingAdmin={editingAdmin}
        cancelEdit={() => setEditingAdmin(null)}
      />
    </div>
  );
};

export default ManageADCAdmins;
