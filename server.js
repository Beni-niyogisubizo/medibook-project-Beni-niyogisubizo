require("dotenv").config();

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the MediBook API",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MediBook API is running",
  });
});

app.listen(PORT, () => {
  console.log(`MediBook server is running on port ${PORT}`);
});
