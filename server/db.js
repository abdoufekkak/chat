// import mysql from "mysql";
const mongoose = require("mongoose");
require("dotenv").config();
const connec = mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("connection");
  })
  .catch((e) => console.log(e), "ook");

module.exports = connec;
