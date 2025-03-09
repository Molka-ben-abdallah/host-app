const express = require("express");
const { registerUser, checkUser } = require("../controllers/registeruser");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/register", (req, res) => {
  res.send("Inside user router");
});

router.post("/register", verifyToken, registerUser); 
router.get("/checkUser/:uid", checkUser);
module.exports = router;