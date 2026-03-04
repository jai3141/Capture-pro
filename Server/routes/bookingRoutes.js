const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const Booking = require("../models/Booking")

const { createBooking, getMyBookings, deleteBooking } = require("../controllers/bookingController");
const { updateBookingStatus } = require("../controllers/bookingController")

// CREATE BOOKING

router.post(
  "/",
  authMiddleware,
  async (req, res) => {

    try {

      const booking = await Booking.create({
        ...req.body,
        userId: req.user.id
      });

      res.status(201).json(booking);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Booking creation failed"
      });

    }

  }
);

// GET USER BOOKINGS
router.get(
  "/",
  authMiddleware,
  async (req, res) => {

    try {

      const bookings = await Booking.find({
        userId: req.user.id
      }).sort({ createdAt: -1 });

      res.json(bookings);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Failed to fetch bookings"
      });

    }

  }
);

// DELETE BOOKING
router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found"
        });
      }

      // Admin can delete anything
      // User can delete only their booking
      if (
        booking.userId.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          message: "Not authorized"
        });
      }

      await Booking.findByIdAndDelete(req.params.id);

      res.json({
        message: "Booking deleted successfully"
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Delete failed"
      });

    }

  }
);

router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    try {

      const { status } = req.body;

      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      res.json({
        message: "Status updated",
        booking
      });

    } catch (error) {

      console.error(error);
      res.status(500).json({
        message: "Status update failed"
      });

    }

  }
);


router.get(
  "/admin/bookings",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    const bookings = await Booking.find()
      .populate("userId", "name email");

    res.json(bookings);

  }
);

router.get("/:bookingId", authMiddleware, async (req, res) => {

  try {

    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // USER can see only their booking gallery
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

    console.log(error);
    res.status(500).json({ message: "Server error" });

  }

});

module.exports = router;