const express = require("express");
const cors = require("cors");
require("dotenv").config(); 
const mongoose = require("./dbConnection/dbconnect.js");
const todoRoutes = require("./routes/todoRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", todoRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
