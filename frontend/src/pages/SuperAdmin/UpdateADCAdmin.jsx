// UpdateADCAdmin.jsx
import React from "react";

const UpdateADCAdmin = ({
  form,
  handleChange,
  updateAdmin,
  editingAdmin,
  cancelEdit,
}) => {
  if (!editingAdmin) return null;

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-3">
        Update Admin: {editingAdmin.fullname}
      </h2>

      <form onSubmit={updateAdmin} className="space-y-4">
        <input
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border p-2 rounded"
        />

        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full border p-2 rounded"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          name="imageFile"
          accept="image/*"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button className="w-full bg-green-600 text-white p-2 rounded">
          Update Admin
        </button>
      </form>

      <button
        onClick={cancelEdit}
        className="mt-3 w-full bg-gray-400 text-white p-2 rounded"
      >
        Cancel
      </button>
    </div>
  );
};

export default UpdateADCAdmin;
