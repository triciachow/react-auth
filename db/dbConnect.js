// External imports
const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch(error => {
      console.log(`Unable to connect to DB. Error: ${error}`);
    });
}

module.exports = dbConnect;
