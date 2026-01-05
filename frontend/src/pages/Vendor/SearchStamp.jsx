import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/pages/vendor/search-stamp.css"
import DataTable from "../../components/common/DataTable";


const SearchStamp = () => {
  const [cnic, setCnic] = useState("");
  const [stampId, setStampId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState([]);


  const columns = [
    { key: "stampId", label: "Stamp ID" },
    { key: "cnic", label: "CNIC" },
    { key: "Applicant", label: "Applicant" },
    { key: "Stamptype", label: "Type" },
    { key: "StampAmount", label: "Amount" },
    { key: "issueDate", label: "Issue Date" },
    { key: "validity", label: "Validity" },
  ];



  // ------------------------------
  // SEARCH FUNCTION
  // ------------------------------
  const handleSearch = async () => {
    try {
      let query = "";

      if (cnic) query = `cnic=${cnic}`;
      else if (stampId) query = `stampId=${stampId}`;
      else if (from && to) query = `from=${from}&to=${to}`;
      else {
        toast.warn("Please enter at least one search value");
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/stamp/search?${query}`,
        { withCredentials: true }
      );

      setResults(res.data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed");
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
    toast.success("CSV exported successfully");
  };

  return (
    <div className="search-container">
      <h1 className="search-title">Search Issued Stamps</h1>

      {/* Search Inputs */}
      <div className="search-grid">
        <div className="search-group">
          <label>Search by CNIC</label>
          <input value={cnic} onChange={(e) => setCnic(e.target.value)} />
        </div>

        <div className="search-group">
          <label>Search by Stamp ID</label>
          <input value={stampId} onChange={(e) => setStampId(e.target.value)} />
        </div>

        <div className="search-group">
          <label>Search by Date Range</label>
          <div className="date-range">
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
      </div>
      {/* search actions */}
      <div className="search-actions">
        <button className="btn btn-search" onClick={handleSearch}>
          Search
        </button>

        {results.length > 0 && (
          <button className="btn btn-export" onClick={exportToCSV}>
            Export CSV
          </button>
        )}
      </div>
      {/* Results Table */}

      <DataTable
        title="Search Results"
        columns={columns}
        data={results}
      />

    </div>
  );
};

export default SearchStamp;
