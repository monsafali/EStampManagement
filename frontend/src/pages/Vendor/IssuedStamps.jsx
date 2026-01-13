import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import DataTable from "../../components/common/DataTable";

import "../../styles/pages/vendor/getAllStamp.css";
import "../../styles/pages/vendor/search-stamp.css";

const IssuedStamps = () => {
  const [allStamps, setAllStamps] = useState([]);
  const [visibleStamps, setVisibleStamps] = useState([]);

  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);


  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const [cnic, setCnic] = useState("");
  const [stampId, setStampId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // -----------------------------
  // FETCH ALL DATA ONCE
  // -----------------------------



  useEffect(() => {
    fetchAllStamps();
  }, []);
  const resetSearch = () => {
    setCnic("");
    setStampId("");
    setFrom("");
    setTo("");
    setVisibleStamps(allStamps);
    setCurrentPage(1);
  };
  const fetchAllStamps = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/stamp/AllIssuedStamp",
        { withCredentials: true }
      );

      const data = res.data.issuedStamps || [];
      setAllStamps(data);
      setVisibleStamps(data); // default = ALL
    } catch (err) {
      toast.error("Failed to load issued stamps");
    }
  };

  // -----------------------------
  // SEARCH (REAL-TIME FEEL)
  // -----------------------------
  const handleSearch = () => {
    let filtered = [...allStamps];

    if (cnic) {
      filtered = filtered.filter(s =>
        s.cnic?.toLowerCase().includes(cnic.toLowerCase())
      );
    }

    if (stampId) {
      filtered = filtered.filter(s =>
        s.stampId?.toLowerCase().includes(stampId.toLowerCase())
      );
    }

    if (from && to) {
      filtered = filtered.filter(s => {
        const d = new Date(s.issueDate);
        return d >= new Date(from) && d <= new Date(to);
      });
    }

    setCurrentPage(1);
    setVisibleStamps(filtered);
    // resetSearch()
  };

  // ------------------------------------------
  // EXPORT CSV (SAME AS GetAllStamp)
  // ------------------------------------------
  const exportToCSV = () => {
    if (visibleStamps.length === 0) return;

    const header = Object.keys(visibleStamps[0]).join(",");
    const rows = visibleStamps
      .map(stamp =>
        Object.values(stamp)
          .map(val => `"${String(val).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const csvData = [header, rows].join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "issued_stamps.csv";
    link.click();
  };

  // ------------------------------------------
  // PAGINATION 
  // ------------------------------------------
  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentStamps = visibleStamps.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(visibleStamps.length / entriesPerPage);

  const hasData = visibleStamps.length > 0;

  // ------------------------------------------
  // SAME COLUMNS
  // ------------------------------------------
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

  return (
    <div className="issued-stamp-page">
      <div>
        <button
          className="floating-search-btn sliding-overlay-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowSearch(prev => !prev);
          }} >
          <SearchIcon />
          Search
        </button>
        {showSearch && (
          <div className="search-overlay" onClick={() => setShowSearch(false)}  >
            <div className="search-section floating-search"
              ref={searchRef}
              onClick={(e) => e.stopPropagation()}>


              <div className="search-fields">
                <div className="input-group">
                  <div className="search-group">
                    <label>Search by CNIC</label>
                    <div className="input-with-icon">
                      <SearchIcon className="input-icon" />
                      <input
                        value={cnic}
                        onChange={(e) => setCnic(e.target.value)}
                        placeholder="Enter CNIC"
                      />
                    </div>
                  </div>
                  <div className="search-group">
                    <label>Search by Stamp ID</label>
                    <div className="input-with-icon">
                      <SearchIcon className="input-icon" />
                      <input
                        value={stampId}
                        onChange={(e) => setStampId(e.target.value)}
                        placeholder="Enter Stamp ID"
                      />
                    </div>
                  </div>
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
                <button className="btn create-btn" onClick={handleSearch}>
                  Search
                </button>
                <button className="btn btn-reset" onClick={resetSearch}>
                  All Stamps
                </button>
                <button className="btn btn-edit" onClick={exportToCSV}>
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>





      {/* SEARCH UI (UNCHANGED STRUCTURE) */}


      {/*  CONDITIONAL RENDERING */}
      {hasData ? (
        <>
          {/* Show Entries */}
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
          <DataTable columns={columns} data={currentStamps} />

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
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
                onClick={() => setCurrentPage(p => p + 1)}
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

export default IssuedStamps;
