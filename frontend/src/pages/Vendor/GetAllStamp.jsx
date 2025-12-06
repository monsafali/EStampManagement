
import React, { useEffect, useState } from "react";
import axios from "axios";

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

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-3">All Issued Stamps</h1>

      {/* Export CSV Button */}
      <button
        onClick={exportToCSV}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Export CSV
      </button>

      {/* Show Entries Dropdown */}
      <div className="mb-3">
        <label className="text-sm">
          Show&nbsp;
          <select
            className="border p-1 rounded text-sm"
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1); // reset to page 1
            }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          &nbsp;entries
        </label>
      </div>

      {/* TABLE */}
      <div className="overflow-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border p-2">Sr.</th>
              <th className="border p-2">Stamp ID</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Applicant</th>
              <th className="border p-2">CNIC</th>
              <th className="border p-2">Issue Date</th>
              <th className="border p-2">Validity</th>
              <th className="border p-2">Vendor</th>
            </tr>
          </thead>

          <tbody>
            {currentStamps.map((s, index) => (
              <tr key={s._id} className="text-center">
                <td className="border p-2">{indexOfFirstItem + index + 1}</td>
                <td className="border p-2">{s.stampId}</td>
                <td className="border p-2">{s.Stamptype}</td>
                <td className="border p-2">{s.StampAmount}</td>
                <td className="border p-2">{s.Applicant}</td>
                <td className="border p-2">{s.cnic}</td>
                <td className="border p-2">{s.issueDate}</td>
                <td className="border p-2">{s.validity}</td>
                <td className="border p-2">{s.vendorInfo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center gap-2 mt-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-40"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white text-black"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 border rounded disabled:opacity-40"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GetAllStamp;
