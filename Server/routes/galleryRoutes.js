const express = require("express");
const router = express.Router();
const multer = require("multer");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware")
const {
  uploadGallery,
  getGalleryByBooking,
  deleteImage
} = require("../controllers/galleryController");

// Storage config
const storage = multer.diskStorage({});

const upload = multer({ storage });

// Upload Route
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.array("images"),   // ⚠ IMPORTANT
  uploadGallery
);

router.get("/:bookingId", authMiddleware, async (req, res) => {

  try {

    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // user owner check
    if (
      booking.userId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const gallery = await Gallery.find({
      bookingId: req.params.bookingId
    });

    res.json(gallery);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

});

router.delete("/:bookingId", authMiddleware, deleteImage);

module.exports = router;