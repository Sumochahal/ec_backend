const router = require("express").Router();

const authMiddleware = require("../../middlewares/admin/user/auth.middleware");
const upload = require("../../middlewares/admin/user/upload.middleware");
const controller=require("../../controllers/user/auth.controller")
router.post("/create-account", controller.createAccount);
router.post("/login", controller.login);
router.post("/forget-password", controller.forgetPassword);
router.post("/reset-password", controller.resetPassword);
// ADMIN PROFILE APIs
router.get("/get-profile",authMiddleware,controller.getAdminProfile);
router.put("/update-profile",authMiddleware,upload.single("photo"), // optional
controller.updateAdminProfile);
module.exports = router;
