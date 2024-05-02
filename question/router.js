const express = require("express");
const { verifyToken } = require("../user/controller")

const { getAnswer, getQueryById } = require("./controller")
const router = express.Router();
router.post("/questions", verifyToken, getAnswer)
router.get("/question/:id", verifyToken, getQueryById)

module.exports = router