import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GetVendor = () => {
  const [admins, setAdmins] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    newpassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const onMonthlyReport = (vendorId) => {
    navigate(`/adc/monthly-report/${vendorId}`);
  };

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/adc/getallvendor",
        { withCredentials: true }
      );
      setAdmins(res.data.vendors || []);
    } catch (err) {
      console.log("Error fetching vendors:", err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const deactivateVendor = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/adc/deactivateVendor/${id}`,
        {},
        { withCredentials: true }
      );
      fetchAdmins();
    } catch (err) {
      console.log("Error deactivating vendor:", err);
    }
  };

  const activateVendor = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/adc/activateVendor/${id}`,
        {},
        { withCredentials: true }
      );
      fetchAdmins();
    } catch (err) {
      console.log("Error activating vendor:", err);
    }
  };

  // ---------------------------
  // OPEN POPUP FOR UPDATE PASSWORD
  // ---------------------------
  const openPasswordModal = (id) => {
    setSelectedVendor(id);
    setPasswordForm({ newpassword: "", confirmPassword: "" });
    setShowModal(true);
  };

  const updatePassword = async () => {
    const { newpassword, confirmPassword } = passwordForm;

    if (!newpassword || !confirmPassword) {
      alert("Both fields are required.");
      return;
    }

    if (newpassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/adc/updatePassword/${selectedVendor}`,
        { newPassword: newpassword }, // send password in body
        { withCredentials: true }
      );

      setShowModal(false);
      fetchAdmins();
      alert("Password updated successfully!");
    } catch (err) {
      console.log("Error updating password:", err);
      alert("Failed to update password");
    }
  };

  const deleteVendor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/adc/deleteVendor/${id}`, {
        withCredentials: true,
      });
      fetchAdmins();
    } catch (err) {
      console.log("Error deleting vendor:", err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className=" rounded overflow-hidden shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="border p-2">Image</th>
              <th className="border p-2">F_Name</th>
              <th className="border p-2">Username</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Contact</th>
              <th className="border p-2">tehsil</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
              <th className="border p-2">Report</th>
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
                  <td className="border p-2">{admin.contactno}</td>
                  <td className="border p-2">{admin.tehsil}</td>

                  <td className="border p-2 font-semibold">
                    {admin.isActive ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-red-600">Inactive</span>
                    )}
                  </td>

                  <td className="border p-2 space-x-2">
                    {admin.isActive ? (
                      <button
                        onClick={() => deactivateVendor(admin._id)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => activateVendor(admin._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Activate
                      </button>
                    )}

                    <button
                      onClick={() => deleteVendor(admin._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => openPasswordModal(admin._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Update Password
                    </button>
                  </td>

                  <td className="border p-2">
                    <button
                      onClick={() => onMonthlyReport(admin._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Monthly Report
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border p-4 text-center" colSpan="7">
                  No Vendors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PASSWORD UPDATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-center">
              Update Password
            </h2>

            <input
              type="password"
              placeholder="New Password"
              className="w-full border p-2 mb-2 rounded"
              value={passwordForm.newpassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newpassword: e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border p-2 mb-4 rounded"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={updatePassword}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetVendor;
