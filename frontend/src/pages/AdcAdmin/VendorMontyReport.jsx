import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/vendorMonthlyReport.css";

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
import { useParams, useSearchParams } from "react-router-dom";

export default function VendorMontyReport() {
  const [chartData, setChartData] = useState([]);
  const [month, setMonth] = useState("2025-11");
  const [chartType, setChartType] = useState("bar"); // "bar" or "line"

  const { vendorId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    fetchDailyStampData(month);
  }, [month]);

  useEffect(() => {
    console.log("Vendor ID received:", vendorId);
    // now call your API using vendorId
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
    <div className="report-container">
      <button className="btn-back" onClick={() => navigate("/adc")}>
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div className="report-header">
        <h2 className="report-title">
          Daily Stamp Issue Visualization
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
              <Bar dataKey="count" fill="#4f46e5" barSize={28} />
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
                stroke="#4f46e5"
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
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
// } from "recharts";
// import { useParams, useSearchParams } from "react-router-dom";

// export default function VendorMontyReport() {
//   const [chartData, setChartData] = useState([]);
//   const [month, setMonth] = useState("2025-11");
//   const [chartType, setChartType] = useState("bar"); // "bar" or "line"
//   const { vendorId } = useParams();

//   useEffect(() => {
//     fetchDailyStampData(month);
//   }, [month]);

//   useEffect(() => {
//     console.log("Vendor ID received:", vendorId);
//     // now call your API using vendorId
//   }, [vendorId]);

//   const fetchDailyStampData = async (monthStr) => {
//     const [year, month] = monthStr.split("-");
//     const daysInMonth = new Date(year, month, 0).getDate();

//     const requests = [];

//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = `${year}-${month.padStart(2, "0")}-${String(day).padStart(
//         2,
//         "0"
//       )}`;

//       const request = axios
//         .get(
//           `http://localhost:5000/api/adc/search?from=${date}&to=${date}&vendorId=${vendorId}`,
//           {
//             withCredentials: true,
//           }
//         )
//         .then((res) => ({
//           day,
//           count: res.data.results?.length || 0,
//         }))
//         .catch(() => ({
//           day,
//           count: 0,
//         }));

//       requests.push(request);
//     }

//     const results = await Promise.all(requests);
//     setChartData(results);
//   };

//   return (
//     <div className="w-full p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-2xl font-bold">Daily Stamp Issue Visualization</h2>

//         {/* Toggle: Bar / Line */}
//         <div className="flex items-center gap-3">
//           <span className="text-sm font-medium">Bar</span>

//           <button
//             onClick={() => setChartType(chartType === "bar" ? "line" : "bar")}
//             className="relative inline-flex items-center h-6 rounded-full w-12 bg-gray-300 transition"
//           >
//             <span
//               className={`${
//                 chartType === "line" ? "translate-x-6" : "translate-x-1"
//               } inline-block w-4 h-4 transform bg-white rounded-full transition`}
//             />
//           </button>

//           <span className="text-sm font-medium">Line</span>
//         </div>
//       </div>

//       {/* Month Picker */}
//       <input
//         type="month"
//         value={month}
//         onChange={(e) => setMonth(e.target.value)}
//         className="border p-2 mb-4"
//       />

//       {/* Chart Container */}
//       <ResponsiveContainer width="100%" height={400}>
//         {chartType === "bar" ? (
//           // ----------------------------- BAR CHART -----------------------------
//           <BarChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="day"
//               label={{ value: "Day", position: "insideBottom", dy: 10 }}
//             />
//             <YAxis
//               label={{
//                 value: "Stamps Issued",
//                 angle: -90,
//                 position: "insideLeft",
//               }}
//             />
//             <Tooltip />
//             <Legend />

//             {/* CLEAN VISIBLE BAR (Single Color) */}
//             <Bar
//               dataKey="count"
//               name="Daily Stamps Issued"
//               fill="#4c1d95" // Strong purple like your reference image
//               barSize={28} // Makes bars thick
//             />
//           </BarChart>
//         ) : (
//           // ----------------------------- LINE CHART -----------------------------
//           <LineChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="day"
//               label={{ value: "Day", position: "insideBottom", dy: 10 }}
//             />
//             <YAxis
//               label={{
//                 value: "Stamps Issued",
//                 angle: -90,
//                 position: "insideLeft",
//               }}
//             />
//             <Tooltip />
//             <Legend />
//             <Line
//               type="monotone"
//               dataKey="count"
//               stroke="#2563eb"
//               strokeWidth={3}
//               dot
//             />
//           </LineChart>
//         )}
//       </ResponsiveContainer>
//     </div>
//   );
// }