// UpdateADCAdmin.jsx
import React from "react";
import Modal from "../../components/common/Modal";

import "../../styles/components/UpdateADCAdmin.css"

const UpdateADCAdmin = ({
  form,
  handleChange,
  updateAdmin,
  editingAdmin,
  cancelEdit,
  isFormChanged,
  isUpdating,
}) => {
  if (!editingAdmin) return null;

  return (
      <Modal
      title="Update ADC Admin"
      subtitle={
        <>
          Editing <strong>{editingAdmin.fullname}</strong>
        </>
      }
      onClose={cancelEdit}
    >
      <form onSubmit={updateAdmin} className="update-adc-admin-form">
        <input
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          placeholder="Full Name"
        />

        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <input
          type="file"
          name="imageFile"
          accept="image/*"
          onChange={handleChange}
        />

        <div className="update-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={!isFormChanged || isUpdating}
          >
            {isUpdating ? <span className="btn-spinner" /> : "Update"}
          </button>

          <button
            type="button"
            className="btn-cancel"
            onClick={cancelEdit}
            disabled={isUpdating}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}; 

export default UpdateADCAdmin;
