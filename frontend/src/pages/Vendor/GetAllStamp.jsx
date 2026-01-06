
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/pages/vendor/getAllStamp.css"
import DataTable from "../../components/common/DataTable";

const GetAllStamp = () => {

  const [stamps, setStamps] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  useEffect(() => {
    fetchStamps();
  }, []);
  const fetchStamps = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/stamp/AllIssuedStamp",
        { withCredentials: true }
      );

      setStamps(res.data.issuedStamps || []);
    } catch (error) {
      console.error("Error fetching stamps:", error);
    }
  };


  // ------------------------------------------
  // EXPORT TO CSV
  // ------------------------------------------

  const exportToCSV = () => {
    if (stamps.length === 0) return;

    const header = Object.keys(stamps[0]).join(",");
    const rows = stamps
      .map((stamp) =>
        Object.values(stamp)
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const csvData = [header, rows].join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "issued_stamps.csv";
    link.click();
  };



  // ------------------------------------------
  // PAGINATION LOGIC
  // ------------------------------------------
  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentStamps = stamps.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(stamps.length / entriesPerPage);

  /* COLUMNS for reusable table */
  const columns = [
    {
      key: "sr",
      label: "Sr.",
      render: (_, i) => indexOfFirstItem + i + 1,
    },
    { key: "stampId", label: "Stamp ID" },
    { key: "Stamptype", label: "Type" },
    { key: "StampAmount", label: "Amount" },
    { key: "Applicant", label: "Applicant" },
    { key: "cnic", label: "CNIC" },
    { key: "issueDate", label: "Issue Date" },
    { key: "validity", label: "Validity" },
    { key: "vendorInfo", label: "Vendor" },
  ];
  const hasData = stamps.length > 0;


  return (
    <div className="issued-stamp-page">
      <div className="issued-header">
        <h2>All Issued Stamps</h2>
        <button className="btn-primary" onClick={exportToCSV}>
          Export CSV
        </button>
      </div>


      {hasData ? (
        <>
          {/* Show Entries Dropdown */}
          <div className="entries-control">
            <label>
              Show
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              entries
            </label>
          </div>

          {/* TABLE */}
          <DataTable
            columns={columns}
            data={currentStamps}
          />

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          No issued stamps found.
        </div>
      )}
    </div>
  );
};

export default GetAllStamp;
