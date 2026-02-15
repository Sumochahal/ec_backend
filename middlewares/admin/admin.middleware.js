const Admin = require("../models/admin.model");
const { verifyToken } = require("../config/jwt");

module.exports = async (req, res, next) => {
  try {
    // Token get from header
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ msg: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Token missing" });

    // Verify token
    const decoded = verifyToken(token);

    // Find admin
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) return res.status(401).json({ msg: "Admin not authorized" });

    // Attach admin to request
    req.admin = admin;

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};
