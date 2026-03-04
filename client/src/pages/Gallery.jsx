import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Gallery() {

  const token = localStorage.getItem("token");

  const decoded = jwtDecode(token);
  const userRole = decoded.role;

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  // ESC close preview
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setPreviewImage(null);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch bookings (admin vs user)
  const fetchBookings = async () => {

    try {

      const endpoint =
        userRole === "admin"
          ? "https://capturepro-backend.onrender.com/api/booking/admin/bookings"
          : "https://capturepro-backend.onrender.com/api/booking";

      const res = await axios.get(
        endpoint,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setBookings(res.data);

    } catch (error) {

      console.error("Failed to fetch bookings", error);

    }

  };

  // Fetch gallery images
  const fetchGallery = async (bookingId) => {

    try {

      const res = await axios.get(
        `https://capturepro-backend.onrender.com/api/gallery/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setGalleryImages(res.data);

    } catch (error) {

      console.error("Failed to fetch gallery", error);

    }

  };

  // Upload images (admin only)
  const handleUpload = async (e) => {

    e.preventDefault();

    const bookingId = e.target.bookingId.value;
    const files = e.target.images.files;

    if (!bookingId || files.length === 0) {
      alert("Select booking and images");
      return;
    }

    const formData = new FormData();
    formData.append("bookingId", bookingId);

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {

      await axios.post(
        "https://capturepro-backend.onrender.com/api/gallery",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Gallery Uploaded Successfully 📸");

      fetchGallery(bookingId);

    } catch (error) {

      console.error("Upload failed", error);

    }

  };

  // Delete image (admin only)
  const handleDelete = async (publicId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `https://capturepro-backend.onrender.com/api/gallery/${selectedBooking}`,
        {
          params: { publicId },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchGallery(selectedBooking);

    } catch (error) {

      console.error("Delete failed", error);

    }

  };

  return (

    <div className="space-y-10">

      {/* Upload Section (Admin only) */}

      {userRole === "admin" && (
        <div className="bg-zinc-900 p-8 rounded-2xl border border-green-500 shadow">

          <h3 className="text-xl font-bold text-green-400 mb-6">
            Upload Gallery
          </h3>

          <form onSubmit={handleUpload} className="space-y-6">

            <select
              name="bookingId"
              required
              className="w-full bg-black border border-green-500 p-3 rounded-lg text-white"
            >
              <option value="">Select Booking</option>

              {bookings.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.eventType} - {b.location}
                </option>
              ))}

            </select>

            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              className="w-full bg-black border border-green-500 p-3 rounded-lg text-white"
            />

            <button
              type="submit"
              className="w-full bg-green-500 text-black font-semibold py-3 rounded-lg hover:bg-green-400 transition"
            >
              Upload Images
            </button>

          </form>

        </div>
      )}

      {/* View Gallery */}

      <div className="bg-zinc-900 p-8 rounded-2xl border border-green-500 shadow">

        <h3 className="text-xl font-bold text-green-400 mb-6">
          View Gallery
        </h3>

        <select
          value={selectedBooking}
          onChange={(e) => {

            const id = e.target.value;

            setSelectedBooking(id);

            if (id) fetchGallery(id);

          }}
          className="w-full bg-black border border-green-500 p-3 rounded-lg mb-6 text-white"
        >

          <option value="">Select Booking</option>

          {bookings.map((b) => (

            <option key={b._id} value={b._id}>
              {b.eventType} - {b.location}
            </option>

          ))}

        </select>

        {galleryImages.length === 0 ? (

          <p className="text-gray-500">
            No images uploaded yet.
          </p>

        ) : (

          <div className="grid md:grid-cols-3 gap-6">

            {galleryImages.map((img, index) => (

              <div
                key={index}
                className="relative overflow-hidden rounded-xl border border-green-500 group"
              >

                <img
                  src={img.url}
                  alt="gallery"
                  onClick={() => setPreviewImage(img.url)}
                  className="w-full h-64 object-cover cursor-pointer group-hover:scale-110 transition duration-300"
                />

                {userRole === "admin" && (
                  <button
                    onClick={() => handleDelete(img.public_id)}
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                )}

              </div>

            ))}

          </div>

        )}

      </div>

      {/* Image Preview */}

      {previewImage && (

        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >

          <img
            src={previewImage}
            alt="preview"
            className="max-h-[90%] max-w-[90%] rounded-xl shadow-2xl border border-green-500"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 text-white text-3xl font-bold"
          >
            ✕
          </button>

        </div>

      )}

    </div>

  );

}

export default Gallery;