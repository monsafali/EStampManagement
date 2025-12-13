// GetADCAdmins.jsx
import React, { useEffect } from "react";

const GetADCAdmins = ({ admins, fetchAdmins, onEdit }) => {
  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <table className="manage-adc-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Full Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>District</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {admins.length > 0 ? (
          admins.map((admin) => (
            <tr key={admin._id}>
              <td>
                <img
                  src={admin.imageUrl}
                  alt={admin.fullname}
                  className="adc-avatar"
                />
              </td>
              <td>{admin.fullname}</td>
              <td>{admin.username}</td>
              <td>{admin.email}</td>
              <td>{admin.district}</td>

              <td>
                <button
                  onClick={() => onEdit(admin)}
                  className="btn-edit"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="adc-empty">
              No ADC Admins Found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default GetADCAdmins;


