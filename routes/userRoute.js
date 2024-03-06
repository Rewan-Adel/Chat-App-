const { getUserChats } = require("../controllers/userCtr");
const express = require('express');
const router = express.Router();
const { tokenValidate } = require("../utils/token");


router.get("/", tokenValidate, getUserChats);

module.exports = router;