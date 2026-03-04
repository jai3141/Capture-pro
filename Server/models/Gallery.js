const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },

    images: [
      {
        url: String,
        public_id: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);