import React, { useEffect, useState } from "react";
import axios from "axios";

const GetInventory = () => {
  const [stock, setStock] = useState({});

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/stamp/getinventory",
        { withCredentials: true }
      );

      const inventory = res.data.stamps || [];

      // -----------------------------------------
      // Group stock by type:
      // Example output:
      // { 100: 15, 200: 14, 300: 8 }
      // -----------------------------------------
      const grouped = {};

      inventory.forEach((item) => {
        const type = item.type; // 100, 200, 300 etc.

        if (!grouped[type]) {
          grouped[type] = 0;
        }
        grouped[type] += 1;
      });

      setStock(grouped);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Available Inventory Stock</h1>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Stamp Type</th>
            <th className="border p-2">Available Stock</th>
          </tr>
        </thead>

        <tbody>
          {Object.keys(stock).map((type) => (
            <tr key={type} className="text-center">
              <td className="border p-2">{type} Rupees</td>
              <td className="border p-2">{stock[type]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetInventory;
