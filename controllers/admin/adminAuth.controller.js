const Admin = require("../../models/admin.model");
const bcrypt = require("bcryptjs");

const { generateOtp } = require("../../services/otp.service");
const { sendEmail } = require("../../services/email.service");
const { generateToken } = require("../../config/jwt");
const fs = require("fs");

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const exist = await Admin.findOne({ email });
  if (exist) return res.status(400).json({ msg: "Admin already exists" });

  const hash = await bcrypt.hash(password, 10);

  const admin = await Admin.create({ name, email, password: hash });

  res.json({ msg: "Admin registered", admin });
};
// LOGIN for correct jwt... 
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ msg: "Admin not found" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(400).json({ msg: "Invalid password" });

  const token = generateToken({ id: admin._id });

  res.json({ msg: "Login success", token, admin });
}; 

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ msg: "Admin not found" });

  const otp = generateOtp();

  admin.resetOtp = otp;
  admin.otpExpire = Date.now() + 10 * 60 * 1000;
  await admin.save();

  await sendEmail(email, "Reset Password OTP", `Your OTP is ${otp}`);

  res.json({ msg: "OTP sent" });
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    if (!admin.resetOtp || admin.resetOtp !== otp)
      return res.status(400).json({ msg: "Invalid OTP" });

    if (admin.otpExpire < Date.now())
      return res.status(400).json({ msg: "OTP expired" });

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetOtp = null;
    admin.otpExpire = null;

    await admin.save();

    res.json({ msg: "Password reset success" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
