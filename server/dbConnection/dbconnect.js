require("dotenv").config();
const mongoose = require("mongoose");

const dbURI = process.env.dbConnect;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Database connection established!");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

module.exports = mongoose;
