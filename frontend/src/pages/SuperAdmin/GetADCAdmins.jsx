// GetADCAdmins.jsx
import React, { useEffect } from "react";
import DataTable from "../../components/common/DataTable";

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
    // <div className="table-responsive">
    //   <table className="manage-adc-table">
    //     <thead>
    //       <tr>
    //         <th>Image</th>
    //         <th>Full Name</th>
    //         <th>Username</th>
    //         <th>Email</th>
    //         <th>District</th>
    //         <th>Action</th>
    //       </tr>
    //     </thead>

    //     <tbody>
    //       {admins.length > 0 ? (
    //         admins.map((admin) => (
    //           <tr key={admin._id}>
    //             <td>
    //               <img
    //                 src={admin.imageUrl}
    //                 alt={admin.fullname}
    //                 className="adc-avatar"
    //               />
    //             </td>
    //             <td>{admin.fullname}</td>
    //             <td>{admin.username}</td>
    //             <td>{admin.email}</td>
    //             <td>{admin.district}</td>

    //             <td>
    //               <button
    //                 onClick={() => onEdit(admin)}
    //                 className="btn-edit"
    //               >
    //                 Edit
    //               </button>
    //             </td>
    //           </tr>
    //         ))
    //       ) : (
    //         <tr>
    //           <td colSpan="6" className="adc-empty">
    //             No ADC Admins Found
    //           </td>
    //         </tr>
    //       )}
    //     </tbody>
    //   </table>
    // </div>
    <DataTable
      columns={columns}
      data={admins}
      title="ADC Admins List"
      renderActions={(admin) => (
        <button
          className="btn btn-edit"
          onClick={() => onEdit(admin)}
        >
          Edit
        </button>
      )}
    />

  );
};

export default GetADCAdmins;


