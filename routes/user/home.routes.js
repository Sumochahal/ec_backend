const express = require("express");
const router = express.Router();

const { getHomeData } = require("../../controllers/user/home.controller");

router.get("/", getHomeData);

module.exports = router;
