// External imports
const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  // Use mongoose to connect this app to our
  // database on mongoDB using the DB_URL (connection string)
  mongoose
    .connect(process.env.DB_URL, {
      // These are options to ensure that the connection is done properly
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch(error => {
      console.log(`Unable to connect to DB. ${error}`);
    });
}

module.exports = dbConnect;
