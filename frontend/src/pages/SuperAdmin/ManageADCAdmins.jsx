import React, { useState, useEffect } from "react";
import axios from "axios";
import GetADCAdmins from "./GetADCAdmins";
import UpdateADCAdmin from "./UpdateADCAdmin";
import "../../styles/pages/SuperAdmin/ManageADCadmin.css"
const ManageADCAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [originalForm, setOriginalForm] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    district: "",
  });

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const autoClearMessage = () => {
    setTimeout(() => {
      setMessage("");
    }, 3000); // 3 seconds
  };

  const fetchAdmins = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/getAllADCAdmin",
      { withCredentials: true }
    );
    setAdmins(res.data.adcAdmins || []);
  };

  const startEditing = (admin) => {
    setEditingAdmin(admin);
    // setForm({
    //   fullname: admin.fullname,
    //   username: admin.username,
    //   email: admin.email,
    //   district: admin.district,
    // });
    // setOriginalForm(initialData);

    const initialData = {
      fullname: admin.fullname || "",
      username: admin.username || "",
      email: admin.email || "",
      district: admin.district || "",

    };

    setForm({ ...initialData, imageFile: null });
    setOriginalForm(initialData); //  store original value
  };
  const isFormChanged = () => {
    if (!originalForm) return false;

    return (
      form.fullname !== originalForm.fullname ||
      form.username !== originalForm.username ||
      form.email !== originalForm.email ||
      form.district !== originalForm.district ||
      form.imageFile !== null
    );
  };

  const updateAdmin = async (e) => {
    e.preventDefault();

    if (!editingAdmin) return;
    //  STOP if no change
    if (!isFormChanged()) {
      setMessage("No changes detected.");
      return;
    }
    try {
      setIsUpdating(true);
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
    finally {
      setIsUpdating(false); //  STOP LOADING 
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
    <div className="manage-adc-wrapper">
      {message && <p className="create-adc-message">{message}</p>}
        <GetADCAdmins
          admins={admins}
          fetchAdmins={fetchAdmins}
          onEdit={startEditing}
        />
      {/* UPDATE PANEL */}
      {editingAdmin && (
        <UpdateADCAdmin
          form={form}
          handleChange={handleChange}
          updateAdmin={updateAdmin}
          editingAdmin={editingAdmin}
          isFormChanged={isFormChanged()}
          isUpdating={isUpdating}
          cancelEdit={() => setEditingAdmin(null)}
        />
      )}
    </div>
  );

};

export default ManageADCAdmins;
