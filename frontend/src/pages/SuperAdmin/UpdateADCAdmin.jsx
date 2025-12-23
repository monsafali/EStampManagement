// UpdateADCAdmin.jsx
import React from "react";

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
    <div className="modal-overlay" onClick={cancelEdit}>
      <div className="update-adc-modal"
        onClick={(e) => e.stopPropagation()}>
        <h3>Update ADC Admin</h3>
        <p className="update-sub">
          Editing <strong>{editingAdmin.fullname}</strong>
        </p>
        <form onSubmit={updateAdmin}>
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
              {isUpdating ? (
                <span className="btn-spinner"></span>
              ) : (
                "Update"
              )}
            </button>
            <button
              type="button"
              className="btn-cancel"
              disabled={isUpdating}
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div >
  );
}; 

export default UpdateADCAdmin;
