const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const admin = require("../config/firebaseAdmin");

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Check user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Generate OTP (6 digit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4️⃣ Save user in DB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000 // 5 mins expiry
    });

    await sendEmail(
      email,
      "OTP Verification - CapturePro",
      `Your OTP is ${otp}. It will expire in 5 minutes.`
    );

    res.status(201).json({
      message: "Signup successful. OTP sent to email 📧"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// OTP Verification Controller
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 2️⃣ Check OTP match + expiry
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 3️⃣ Mark as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Account verified successfully ✅" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 2️⃣ Check account verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your account first" });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 4️⃣ Generate JWT Token
    const token = require("jsonwebtoken").sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful ✅",
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // 1️⃣ Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);

    const { email, name, uid } = decodedToken;

    // 2️⃣ Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: uid,
        isVerified: true
      });
    }

    // 3️⃣ Generate JWT
    const jwtToken = require("jsonwebtoken").sign(
      { id: user._id, role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google login successful ✅",
      token: jwtToken
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Google login failed" });
  }
};