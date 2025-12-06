// backend/routes/districts.js
import express from "express";
import axios from "axios";

const router = express.Router();

// GET districts
router.get("/all", async (req, res) => {
  try {
    const response = await axios.post(
      process.env.DISTRICT_API,
      {}, // empty body
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching districts:", error.message);
    res.status(500).json({ message: "Failed to fetch districts" });
  }
});



router.get("/tehsils/:districtId", async (req, res) => {
  const { districtId } = req.params;

  try {
    const response = await axios.post(
      process.env.TEHSIL_API + `=${districtId}`,
      {}, // empty body
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data); // send Tehsils array to frontend
  } catch (error) {
    console.error("Error fetching Tehsils:", error.message);
    res.status(500).json({ message: "Failed to fetch Tehsils" });
  }
});

export default router;
