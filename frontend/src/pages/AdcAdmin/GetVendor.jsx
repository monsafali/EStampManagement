import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import DataTable from "../../components/common/DataTable";
import { toast } from "react-toastify";

import Tooltip from "../../components/common/Tooltip";
import PasswordInput from "../../components/common/PasswordInput";
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ReportIcon from '@mui/icons-material/Report';
import EditIcon from '@mui/icons-material/Edit';
import Modal from "../../components/common/Modal";
import CustomSelect from "../../components/common/CustomSelect";

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
      toast.error("Failed to load vendors");

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
      toast.success("Vendor deactivated");
      fetchVendors();
    } catch (err) {
      toast.error("Failed to deactivate vendor");
    }
  };

  const activateVendor = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/adc/activateVendor/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success("Vendor activated");
      fetchVendors();
    } catch (err) {
      toast.error("Failed to activate vendor");
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
      toast.warn("Both password fields are required");
      return;
    }

    if (newpassword !== confirmPassword) {
      toast.error("Passwords do not match");
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
      toast.success("Password updated successfully")
    } catch (err) {
      // console.log("Error updating password:", err);
      toast.error("Failed to update password");
    }
  };

  const deleteVendor = async (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this vendor?</p>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              className="btn btn-danger"
              onClick={async () => {
                try {
                  await axios.delete(
                    `http://localhost:5000/api/adc/deleteVendor/${id}`,
                    { withCredentials: true }
                  );
                  fetchVendors();
                  toast.success("Vendor deleted successfully");
                } catch {
                  toast.error("Failed to delete vendor");
                }
                closeToast();
              }}
            >
              Delete
            </button>

            <button
              className="btn btn-secondary"
              onClick={closeToast}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
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
          <div className="tahsil-dropdown">
            <CustomSelect
              name="tehsilFilter"
              label="Filter by Tehsil"
              placeholder="All Tehsils"
              options={[{ value: "", label: "All Tehsils" }, ...tehsils.map((t) => ({ value: t, label: t }))]}
              value={selectedTehsil}
              onChange={(val) => setSelectedTehsil(val)}
            />
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
                    <Tooltip text="Deactivate Vendor">
                      <button
                        className="btn btn-warning"
                        onClick={() => deactivateVendor(vendor._id)}
                      >
                        <ToggleOffIcon />
                      </button>
                    </Tooltip>
                  ) : (
                    <Tooltip text="Activate Vendor">
                      <button
                        className="btn btn-success"
                        onClick={() => activateVendor(vendor._id)}
                      >
                        <ToggleOnIcon />
                      </button>
                    </Tooltip>
                  )}

                  <Tooltip text="Delete Vendor">
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteVendor(vendor._id)}
                    >
                      <DeleteIcon />
                    </button>
                  </Tooltip>

                  <Tooltip text="Update Password">
                    <button
                      className="btn btn-edit"
                      onClick={() => openPasswordModal(vendor._id)}
                    >
                      <EditIcon />
                    </button>
                  </Tooltip>

                  <Tooltip text="View Monthly Report">
                    <button
                      className="btn btn-report"
                      onClick={() => onMonthlyReport(vendor._id)}
                    >
                      <ReportIcon />
                    </button>
                  </Tooltip>
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
    
            <PasswordInput
              label="New Password"
              value={passwordForm.newpassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newpassword: e.target.value,
                })
              }
            />

            <PasswordInput
              label="Confirm Password"
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
