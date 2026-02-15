const express = require("express");
const router = express.Router();
router.use("/banners", require("./banner.routes"));
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../../controllers/admin/adminAuth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;


