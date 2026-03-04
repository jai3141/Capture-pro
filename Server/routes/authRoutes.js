const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { signup, verifyOtp, login, googleLogin } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/google-login", googleLogin);

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route working 🔐",
    userId: req.user.id
  });
});

module.exports = router;