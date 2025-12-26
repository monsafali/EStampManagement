import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
const columns = [
  {
    key: "imageUrl",
    label: "Image",
    render: (row) => (
      <img
        src={row.imageUrl}
        alt={row.fullname}
        className="table-avatar"
      />
    ),
  },
  { key: "fullname", label: "Full Name" },
  { key: "username", label: "Username" },
  { key: "email", label: "Email" },
  { key: "contactno", label: "Contact" },
  { key: "tehsil", label: "Tehsil" },
  {
    key: "isActive",
    label: "Status",
    render: (row) =>
      row.isActive ? (
        <span style={{ color: "green", fontWeight: "600" }}>
          Active
        </span>
      ) : (
        <span style={{ color: "red", fontWeight: "600" }}>
          Inactive
        </span>
      ),
  },
];


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
    <div>

      <DataTable
        columns={columns}
        data={admins}
        renderActions={(vendor) => (
          <div className="table-actions">
            {vendor.isActive ? (
              <button
                className="btn btn-warning"
                onClick={() => deactivateVendor(vendor._id)}
              >
                Deactivate
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={() => activateVendor(vendor._id)}
              >
                Activate
              </button>
            )}

            <button
              className="btn btn-danger"
              onClick={() => deleteVendor(vendor._id)}
            >
              Delete
            </button>

            <button
              className="btn btn-edit"
              onClick={() => openPasswordModal(vendor._id)}
            >
              Update Password
            </button>

            <button
              className="btn btn-edit"
              onClick={() => onMonthlyReport(vendor._id)}
            >
              Monthly Report
            </button>
          </div>
        )}
      />

      {/* PASSWORD UPDATE MODAL */}
      {/* {showModal && (
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
      )} */}
      {showModal && (
        <Modal
          title="Update Password"
          onClose={() => setShowModal(false)}
        >
          <input
            type="password"
            placeholder="New Password"
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
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value,
              })
            }
          />

          <div className="update-actions">
            <button
              className="btn-primary"
              onClick={updatePassword}
            >
              Update
            </button>

            <button
              className="btn-cancel"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>)}
    </div>
  );
};

export default GetVendor;
