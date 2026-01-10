// GetADCAdmins.jsx
import React, { useEffect } from "react";
import DataTable from "../../components/common/DataTable";
import Tooltip from "../../components/common/Tooltip";


const GetADCAdmins = ({ admins, fetchAdmins, onEdit }) => {
  useEffect(() => {
    fetchAdmins();
  }, []);
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
    { key: "district", label: "District" },
  ];

  return (
    <DataTable
      columns={columns}
      data={admins}
      title="ADC Admins List"
      renderActions={(admin) => (
        <Tooltip text="Edit ADC Admin">
          <button
            type="button"
            className="btn btn-edit"
            onClick={() => onEdit(admin)}
          >
            Edit
          </button>
        </Tooltip>
      )}
    />

  );
};

export default GetADCAdmins;


