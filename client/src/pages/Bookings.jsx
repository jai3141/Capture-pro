import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Bookings() {

  const token = localStorage.getItem("token");

  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    eventDate: "",
    eventTime: "",
    eventType: "",
    location: "",
    phone: "",
    notes: ""
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/booking",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setBookings(res.data);

    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings ❌");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5000/api/booking",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setFormData({
        eventDate: "",
        eventTime: "",
        eventType: "",
        location: "",
        phone: "",
        notes: ""
      });

      fetchBookings();
      toast.success("Booking created successfully 🎉");

    } catch (error) {
      console.error(error);
      toast.error("Booking creation failed ❌");
    }
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `http://localhost:5000/api/booking/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchBookings();
      toast.success("Booking deleted successfully 🗑️");

    } catch (error) {
      console.error(error);
      toast.error("Delete failed ❌");
    }
  };

  const getStatusColor = (status) => {

    switch (status) {

      case "pending":
        return "bg-yellow-500 text-black";

      case "confirmed":
        return "bg-blue-500";

      case "completed":
        return "bg-green-500 text-black";

      case "cancelled":
        return "bg-red-500";

      default:
        return "bg-gray-500";

    }

  };

  return (
    <div className="space-y-10">

      {/* Create Booking */}
      <div className="bg-zinc-900 p-8 rounded-2xl border border-green-500 shadow">

        <h3 className="text-xl font-bold text-green-400 mb-6">
          Create Booking
        </h3>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">

          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
            className="bg-black border border-green-500 p-3 rounded-lg text-white"
          />

          <input
            type="time"
            name="eventTime"
            value={formData.eventTime}
            onChange={handleChange}
            required
            className="bg-black border border-green-500 p-3 rounded-lg text-white"
          />

          <input
            type="text"
            name="eventType"
            placeholder="Event Type"
            list="events"
            value={formData.eventType}
            onChange={handleChange}
            required
            className="bg-black border border-green-500 p-3 rounded-lg text-white"
          />

          <datalist id="events">
            <option value="Wedding Photography" />
            <option value="Pre-Wedding Shoot" />
            <option value="Engagement Photography" />
            <option value="Birthday Photography" />
            <option value="Baby Shower Photography" />
            <option value="Maternity Shoot" />
            <option value="Newborn Baby Shoot" />
            <option value="Fashion Photoshoot" />
            <option value="Model Portfolio Shoot" />
            <option value="Corporate Event Photography" />
            <option value="Product Photography" />
            <option value="Food Photography" />
            <option value="Real Estate Photography" />
            <option value="Graduation Photoshoot" />
            <option value="Family Photoshoot" />
          </datalist>

          <input
            type="text"
            name="location"
            placeholder="Location"
            list="locations"
            value={formData.location}
            onChange={handleChange}
            required
            className="bg-black border border-green-500 p-3 rounded-lg text-white"
          />

          <datalist id="locations">
            <option value="Chennai" />
            <option value="Bangalore" />
            <option value="Hyderabad" />
            <option value="Mumbai" />
            <option value="Delhi" />
            <option value="Kolkata" />
            <option value="Pune" />
            <option value="Ahmedabad" />
            <option value="Jaipur" />
            <option value="Lucknow" />
            <option value="Coimbatore" />
            <option value="Madurai" />
            <option value="Trichy" />
            <option value="Salem" />
            <option value="Erode" />
            <option value="Tirunelveli" />
            <option value="Vellore" />
            <option value="Thoothukudi" />
            <option value="Tiruppur" />
          </datalist>


          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="bg-black border border-green-500 p-3 rounded-lg text-white"
          />

          <input
            type="text"
            name="notes"
            placeholder="Special Notes"
            value={formData.notes}
            onChange={handleChange}
            className="bg-black border border-green-500 p-3 rounded-lg text-white"
          />

          <button
            type="submit"
            className="md:col-span-3 bg-green-500 text-black font-semibold py-3 rounded-lg hover:bg-green-400 transition"
          >
            Create Booking
          </button>

        </form>

      </div>

      {/* Booking List */}
      <div className="bg-zinc-900 p-8 rounded-2xl border border-green-500 shadow">

        <h3 className="text-xl font-bold text-green-400 mb-6">
          Your Bookings
        </h3>

        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <div className="grid gap-4">

            {bookings.map((b) => (

              <div
                key={b._id}
                className="bg-black border border-green-500 p-4 rounded-lg flex justify-between items-center"
              >

                <div>

                  <p className="font-semibold text-white">
                    {b.eventType}
                  </p>

                  <p className="text-gray-400">
                    {b.location}
                  </p>

                  <p className="text-gray-400 text-sm">
                    {b.phone}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {b.notes}
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(b.status)}`}
                  >
                    {b.status}
                  </span>

                </div>

                <div className="flex items-center gap-4">

                  <p className="text-green-400">
                    {new Date(b.eventDate).toLocaleDateString()} {b.eventTime}
                  </p>

                  <button
                    onClick={() => handleDelete(b._id)}
                    className="bg-red-500 px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Bookings;