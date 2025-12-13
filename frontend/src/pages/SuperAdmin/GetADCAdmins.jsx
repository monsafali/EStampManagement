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
                  className="w-12 h-12 rounded-full"
                />
              </td>
              <td className="border p-2">{admin.fullname}</td>
              <td className="border p-2">{admin.username}</td>
              <td className="border p-2">{admin.email}</td>
              <td className="border p-2">{admin.district}</td>

              <td className="border p-2">
                <button
                  onClick={() => onEdit(admin)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="border p-4 text-center" colSpan="6">
              No ADC Admins Found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default GetADCAdmins;


