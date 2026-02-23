const express = require("express");
const router = express.Router();

const {
  getProductwithname,
} = require("../../controllers/user/product.user.controller");

// Get all products with category & subcategory name
router.get("/search", getProductwithname);

module.exports = router;