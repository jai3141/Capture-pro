const Booking = require("../models/Booking");

// 🔹 Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { eventDate, eventTime, eventType, location, phone, notes } = req.body;

    const booking = await Booking.create({
      userId: req.user.id, // JWT middleware la irundhu varudhu
      eventDate,
      eventTime,
      eventType,
      location,
      phone,
      notes
    });

    res.status(201).json({
      message: "Booking created successfully ✅",
      booking
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🔹 Get My Bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });

    res.json(bookings);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// DeleteBooking Section
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await booking.deleteOne();

    res.json({ message: "Booking deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.json({ message: "Status updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};