const express = require("express");
const { signUp, logIn, verifyToken, getUserProfile, logout, refreshToken } = require("./controller")
const { getQueriesByUserId } = require("../question/controller")
const router = express.Router();

router.post("/users", signUp);
router.post("/auth/login", logIn);
router.post("/auth/logout",verifyToken, logout);
router.post("/auth/refresh", verifyToken, refreshToken);

router.get("/users/:id", getUserProfile);
router.get("/users/:id/questions", verifyToken, getQueriesByUserId);

module.exports = router;