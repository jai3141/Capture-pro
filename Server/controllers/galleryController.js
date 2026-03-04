const Gallery = require("../models/Gallery");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// 🔹 Upload Gallery Images
exports.uploadGallery = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const imageFiles = req.files;

    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const uploadedImages = [];

    for (let file of imageFiles) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "capturepro_gallery"
      });

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id
      });
    }

    // Check if gallery already exists
    let gallery = await Gallery.findOne({
      bookingId,
      userId: req.user.id
    });

    if (gallery) {
      // Append new images
      gallery.images.push(...uploadedImages);
      await gallery.save();
    } else {
      // Create new gallery
      gallery = await Gallery.create({
        bookingId,
        userId: req.user.id,
        images: uploadedImages
      });
    }

    res.json({ message: "Gallery uploaded successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getGalleryByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const gallery = await Gallery.findOne({
      bookingId,
      userId: req.user.id
    });

    if (!gallery) {
      return res.json([]);
    }

    res.json(gallery.images);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { publicId } = req.query;

    const gallery = await Gallery.findOne({
      bookingId,
      userId: req.user.id
    });

    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    await cloudinary.uploader.destroy(publicId);

    gallery.images = gallery.images.filter(
      (img) => img.public_id !== publicId
    );

    await gallery.save();

    res.json({ message: "Image deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};