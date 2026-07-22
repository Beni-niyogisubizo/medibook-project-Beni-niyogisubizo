require("dotenv").config();

const express = require("express");
const pool = require("./src/models/db");
const patientRoutes = require("./src/routes/patientRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/patients", patientRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the MediBook API",
  });
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      success: true,
      message: "MediBook API and database are running",
    });
  } catch (error) {
    console.error("Database health check failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`MediBook server is running on port ${PORT}`);
});
