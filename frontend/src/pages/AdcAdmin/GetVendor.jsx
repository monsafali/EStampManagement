import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import DataTable from "../../components/common/DataTable";
import ReportIcon from '@mui/icons-material/Report';
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
  // const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [selectedTehsil, setSelectedTehsil] = useState("");


  const [passwordForm, setPasswordForm] = useState({
    newpassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const onMonthlyReport = (vendorId) => {
    navigate(`/adc/monthly-report/${vendorId}`);
  };

  const fetchVendors = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/adc/getallvendor",
        { withCredentials: true }
      );
      setVendors(res.data.vendors || []);
    } catch (err) {
      console.log("Error fetching vendors:", err);
    }
  };
  useEffect(() => {
    fetchVendors();
  }, []);

  const tehsils = [...new Set(vendors.map(v => v.tehsil))];
  const filteredVendors = selectedTehsil
    ? vendors.filter(v => v.tehsil === selectedTehsil)
    : vendors;
  const hasVendors = vendors.length > 0;
  const hasFilteredVendors = filteredVendors.length > 0;
  const deactivateVendor = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/adc/deactivateVendor/${id}`,
        {},
        { withCredentials: true }
      );
      fetchVendors();
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

      {/* ---------- NO VENDORS AT ALL ---------- */}
      {!hasVendors && (
        <div className="empty-state">
          <p>No vendors found for this ADC.</p>
        </div>
      )}

      {/* ---------- VENDORS EXIST ---------- */}
      {hasVendors && (
        <>
          {/* Dropdown */}
          <div className="form-group select-group">
            <select
              className="form-select"
              value={selectedTehsil}
              onChange={(e) => setSelectedTehsil(e.target.value)}
            >
              <option value="">All Tehsils</option>

              {tehsils.map((t, index) => (
                <option key={index} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* ---------- NO DATA AFTER FILTER ---------- */}
          {!hasFilteredVendors && (
            <div className="empty-state">
              <p>No vendors found for selected tehsil.</p>
            </div>
          )}

          {/* ---------- TABLE ---------- */}
          {hasFilteredVendors && (
            <DataTable
              columns={columns}
              data={filteredVendors}
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
                    <DeleteIcon />
                  </button>

                  <button
                    className="btn btn-edit"
                    onClick={() => openPasswordModal(vendor._id)}
                  >
                    Update Pwd
                  </button>

                  <button
                    className="btn btn-report"
                    onClick={() => onMonthlyReport(vendor._id)}
                  >
                    <ReportIcon />
                  </button>
                </div>
              )}
            />
          )}
        </>
      )}
      {/* PASSWORD UPDATE MODAL */}

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
