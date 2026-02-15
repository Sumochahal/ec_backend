const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    password: {
      type: String,
      required: true,
    },
      photo: {
      type: String, // image path / url
    },
    role: {
    type: String,
    enum: ["user", "admin"],
    default:"user" // optional by default
  },
  resetOtp: String,
  otpExpire: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
