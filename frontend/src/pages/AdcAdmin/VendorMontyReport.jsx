import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';



import "../../styles/pages/vendorMonthlyReport.css";
import { useParams } from "react-router-dom";


import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function VendorMontyReport() {

  const [chartData, setChartData] = useState([]);
  const [month, setMonth] = useState("2025-11");
  const [chartType, setChartType] = useState("bar"); // "bar" or "line"
  const navigate = useNavigate();
  const location = useLocation();
  const { vendorId } = useParams();

  const [vendorName, setVendorName] = useState(
    location.state?.vendorName || ""
  );



  const fetchVendorName = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/adc/vendor/${id}`,
        { withCredentials: true }
      );
      setVendorName(res.data.vendor.fullname);
    } catch {
      setVendorName("Unknown Vendor");
    }
  };

  useEffect(() => {
    if (!vendorName && vendorId) {
      fetchVendorName(vendorId);
    }
  }, [vendorId, vendorName]);

  useEffect(() => {
    fetchDailyStampData(month);
  }, [month]);

  useEffect(() => {
    console.log("Vendor ID received:", vendorId);

  }, [vendorId]);

  const fetchDailyStampData = async (monthStr) => {
    const [year, month] = monthStr.split("-");
    const daysInMonth = new Date(year, month, 0).getDate();

    const requests = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${month.padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`;

      const request = axios
        .get(
          `http://localhost:5000/api/adc/search?from=${date}&to=${date}&vendorId=${vendorId}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => ({
          day,
          count: res.data.results?.length || 0,
        }))
        .catch(() => ({
          day,
          count: 0,
        }));

      requests.push(request);
    }

    const results = await Promise.all(requests);
    setChartData(results);
  };

  return (
    <div className="report-container container">
      <button className="btn-back" onClick={() => navigate("/adc")}>
        <KeyboardBackspaceIcon /> Back to Dashboard
      </button>

      {/* Header */}
      <div className="report-header">
        <h2 className="report-title">
          Daily Stamp Issue Visualization of Vendor
          <span> <i>{vendorName || "Loading..."}</i> </span>
        </h2>

        {/* Toggle: Bar / Line */}
        <div className="chart-toggle">
          <span>Bar</span>
          <button
            onClick={() => setChartType(chartType === "bar" ? "line" : "bar")}
            className="toggle-switch"
          >
            <span
              className={`toggle-thumb ${chartType === "line" ? "right" : "left"
                }`}
            />
          </button>
          <span>Line</span>
        </div>
      </div>

      {/* Month Picker */}
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="month-picker"
      />

      {/* Chart Container */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          {chartType === "bar" ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#067f46" barSize={28} />
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#067f46"
                strokeWidth={3}
                dot
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div >
  );
}
