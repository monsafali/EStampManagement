import React, { useState } from "react";
import axios from "axios";

const SearchStamp = () => {
  const [cnic, setCnic] = useState("");
  const [stampId, setStampId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState([]);

  // ------------------------------
  // SEARCH FUNCTION
  // ------------------------------
  const handleSearch = async () => {
    try {
      let query = "";

      if (cnic) query = `cnic=${cnic}`;
      else if (stampId) query = `stampId=${stampId}`;
      else if (from && to) query = `from=${from}&to=${to}`;
      else return alert("Please enter at least one search value.");

      const res = await axios.get(
        `http://localhost:5000/api/stamp/search?${query}`,
        { withCredentials: true }
      );

      setResults(res.data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      alert("No records found.");
    }
  };

  // ------------------------------
  // EXPORT TO CSV
  // ------------------------------
  const exportToCSV = () => {
    if (results.length === 0) return;

    const header = Object.keys(results[0]).join(",");
    const rows = results
      .map((item) =>
        Object.values(item)
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const csvData = [header, rows].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "search_results.csv";
    link.click();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Search Issued Stamps</h1>

      {/* Search Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Search by CNIC */}
        <div>
          <label className="font-semibold">Search by CNIC</label>
          <input
            type="text"
            value={cnic}
            onChange={(e) => setCnic(e.target.value)}
            placeholder="Enter CNIC"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Search by Stamp ID */}
        <div>
          <label className="font-semibold">Search by Stamp ID</label>
          <input
            type="text"
            value={stampId}
            onChange={(e) => setStampId(e.target.value)}
            placeholder="Enter Stamp ID"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Date Range */}
        <div>
          <label className="font-semibold">Search by Date Range</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Search
      </button>

      {/* Export CSV */}
      {results.length > 0 && (
        <button
          onClick={exportToCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded ml-3"
        >
          Export CSV
        </button>
      )}

      {/* Results Table */}
      <div className="mt-6 overflow-auto">
        {results.length > 0 ? (
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Stamp ID</th>
                <th className="border p-2">CNIC</th>
                <th className="border p-2">Applicant</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Issue Date</th>
                <th className="border p-2">Validity</th>
              </tr>
            </thead>
            <tbody>
              {results.map((s) => (
                <tr key={s._id} className="text-center">
                  <td className="border p-2">{s.stampId}</td>
                  <td className="border p-2">{s.cnic}</td>
                  <td className="border p-2">{s.Applicant}</td>
                  <td className="border p-2">{s.Stamptype}</td>
                  <td className="border p-2">{s.StampAmount}</td>
                  <td className="border p-2">{s.issueDate}</td>
                  <td className="border p-2">{s.validity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 mt-4">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchStamp;
