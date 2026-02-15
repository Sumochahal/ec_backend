const express = require("express");
const router = express.Router();

const {
  getUserCategories
} = require("../../controllers/user/category.user.controller");

// USER CATEGORY LIST
router.get("/categories", getUserCategories);

module.exports = router;
