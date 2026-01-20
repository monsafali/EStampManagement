import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { API_BASE_URL } from "../api";



const VendorReport = () => {
  const { vendorId } = useParams(); // get vendor ID from URL
  const [month, setMonth] = useState("2025-11");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDailyStampData(month);
  }, [month]);

  const fetchDailyStampData = async (monthStr) => {
    const [year, month] = monthStr.split("-");
    const daysInMonth = new Date(year, month, 0).getDate();

    const requests = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${month}-${String(day).padStart(2, "0")}`;

      const request = axios
        .get(
          `${API_BASE_URL}/api/stamp/search?from=${date}&to=${date}&vendorId=${vendorId}`,
          { withCredentials: true }
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vendor Report – {vendorId}</h1>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border p-2 mb-4"
      />

      <ResponsiveContainer height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#4c1d95" barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VendorReport;
