const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    // Specify how the fields should work by adding some mongoose options
    type: String,
    required: [true, "Please provide an email"],
    unique: [true, "Email exists"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    unique: false,
  },
});

// Create a user table or collection if there is no table with that name already
module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
