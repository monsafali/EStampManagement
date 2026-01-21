import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ReportIcon from '@mui/icons-material/Report';
import EditIcon from '@mui/icons-material/Edit';

import DataTable from "../../components/common/DataTable";
import Tooltip from "../../components/common/Tooltip";
import Modal from "../../components/common/Modal";
import CustomSelect from "../../components/common/CustomSelect";
import PasswordInput from "../../components/common/PasswordInput";



import "../../styles/components/DeleteVendor.css"
import { API_BASE_URL } from "../../api";

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

  const [deleteModal, setDeleteModal] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);

  const [confirmUsername, setConfirmUsername] = useState("");


  const [passwordForm, setPasswordForm] = useState({
    newpassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

const onMonthlyReport = (vendor) => {
  navigate(`/adc/monthly-report/${vendor._id}`, {
    state: {
      vendorName: vendor.fullname
    }
  });
};


const fetchVendors = async () => {
  try {
    const res = await API_BASE_URL.get("/api/adc/getallvendor");
    setVendors(res.data.vendors || []);
    console.log(res.data.vendors);
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
     await API_BASE_URL.put(`/api/adc/deactivateVendor/${id}`);
     toast.success("Vendor deactivated");
     fetchVendors();
   } catch (err) {
     toast.error("Failed to deactivate vendor");
   }
 };


const activateVendor = async (id) => {
  try {
    await API_BASE_URL.put(`/api/adc/activateVendor/${id}`);
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
     await API_BASE_URL.put(`/api/adc/updatePassword/${selectedVendor}`, {
       newPassword: newpassword,
     });

     setShowModal(false);
     fetchVendors();
     toast.success("Password updated successfully");
   } catch (err) {
     toast.error("Failed to update password");
   }
 };


  const deleteVendor = (vendor) => {
    setVendorToDelete(vendor);
    setConfirmUsername("");
    setDeleteModal(true);
  };

  
const confirmDeleteVendor = async () => {
  if (!vendorToDelete) return;

  try {
    await API_BASE_URL.delete(`/api/adc/deleteVendor/${vendorToDelete._id}`);

    toast.success("Vendor deleted successfully");
    fetchVendors();
  } catch (error) {
    toast.error("Failed to delete vendor");
  } finally {
    setDeleteModal(false);
    setVendorToDelete(null);
    setConfirmUsername("");
  }
};



  return (
    <>
      {deleteModal && vendorToDelete && (
        <Modal
          title="Confirm Vendor Deletion"
          subtitle={`This action cannot be undone.`}
          onClose={() => setDeleteModal(false)}
          closeOnOverlay={false}
        >
          <div className="delete-confirm-box">
            <b>
              To confirm, type   <i>"{vendorToDelete.username}"</i> in the box below
            </b>
            {/* Confirmation input */}
            <input
              type="text"
              placeholder="Type vendor username to confirm"
              value={confirmUsername}
              onChange={(e) => setConfirmUsername(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="btn btn-danger"
                disabled={confirmUsername !== vendorToDelete.username}
                onClick={confirmDeleteVendor}
              >
                Delete Vendor
              </button>

            </div>
          </div>
        </Modal>
      )}

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
                        className="btn"
                        onClick={() => deactivateVendor(vendor._id)}
                      >
                        <ToggleOffIcon sx={{ color: '#ca8a04' }} />
                      </button>
                    </Tooltip>
                  ) : (
                    <Tooltip text="Activate Vendor">
                      <button
                        className="btn "
                        onClick={() => activateVendor(vendor._id)}
                      >
                        <ToggleOnIcon sx={{ color: '#16a34a' }} />
                      </button>
                    </Tooltip>
                  )}

                  <Tooltip text="Delete Vendor">
                    <button
                      className="btn"
                      onClick={() => deleteVendor(vendor)}
                    >
                      <DeleteIcon sx={{ color: '#ef4444' }} />

                    </button>
                  </Tooltip>

                  <Tooltip text="Update Password">
                    <button
                      className="btn"
                      onClick={() => openPasswordModal(vendor._id)}
                    >
                      <EditIcon sx={{ color: '#2563eb' }} />
                    </button>
                  </Tooltip>

                  <Tooltip text="View Monthly Report">
                    <button
                      className="btn"
                  onClick={() => onMonthlyReport(vendor)}

                    >
                      <ReportIcon sx={{ color: "#065f46" }} />
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
    </>
  );
};

export default GetVendor;
