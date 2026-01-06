import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../../components/common/DataTable";


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

  /*  Convert SAME stock object for DataTable */
  const tableData = Object.keys(stock).map((type, index) => ({
    _id: index,
    stampType: `${type} Rupees`,
    availableStock: stock[type],
  }));

  const columns = [
    { key: "stampType", label: "Stamp Type" },
    { key: "availableStock", label: "Available Stock" },
  ];
  const hasStock = tableData.length > 0;

  return (
    <>
      {hasStock ? (
        <DataTable
          title="Available Inventory Stock"
          columns={columns}
          data={tableData}
        />
      ) : (
        <div className="empty-state">
          No inventory available at the moment.
        </div>
      )}
    </>
  );
};

export default GetInventory;
