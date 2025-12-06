// GetADCAdmins.jsx
import React, { useEffect } from "react";

const GetADCAdmins = ({ admins, fetchAdmins, onEdit }) => {
  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <table className="w-full border shadow rounded mb-6">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2">Image</th>
          <th className="border p-2">Full Name</th>
          <th className="border p-2">Username</th>
          <th className="border p-2">Email</th>
          <th className="border p-2">District</th>
          <th className="border p-2">Action</th>
        </tr>
      </thead>

      <tbody>
        {admins.length > 0 ? (
          admins.map((admin) => (
            <tr key={admin._id} className="text-center">
              <td className="border p-2">
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


