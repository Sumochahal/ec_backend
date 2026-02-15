const express = require("express");
const router = express.Router();
const upload = require("../../config/multer");

const {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner
} = require("../../controllers/admin/banner.controller");

// folder middleware
const bannerUploadFolder = (req, res, next) => {
  req.uploadFolder = "banners";
  next();
};

// CREATE (image required)
router.post(
  "/create",
  bannerUploadFolder,
  upload.single("image"),
  createBanner
);

// READ
router.get("/", getAllBanners);
router.get("/:id", getBannerById);

// UPDATE (image optional)
router.put(
  "/update/:id",
  bannerUploadFolder,
  upload.single("image"),
  updateBanner
);

// DELETE
router.delete("/:id", deleteBanner);

module.exports = router;
