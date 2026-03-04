import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminPanel() {

  const token = localStorage.getItem("token");

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/booking/admin/bookings",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setBookings(res.data);

    } catch (error) {

      toast.error("Access denied ❌");

    }

  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this booking?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `http://localhost:5000/api/booking/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Booking deleted 🗑️");

      fetchBookings();

    } catch (error) {

      toast.error("Delete failed ❌");

    }

  };

  const handleStatusChange = async (id, status) => {

    try {

      await axios.put(
        `http://localhost:5000/api/booking/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Status updated");

      fetchBookings();

    } catch (error) {

      toast.error("Update failed");

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

    <div className="space-y-8">

      <h2 className="text-2xl font-bold text-green-400">
        Admin Booking Management
      </h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (

        <div className="grid gap-4">

          {bookings.map((b) => (

            <div
              key={b._id}
              className="bg-black border border-green-500 p-5 rounded-lg flex justify-between items-center"
            >

              {/* LEFT SIDE BOOKING DETAILS */}
              <div>

                <p className="text-white font-semibold text-lg">
                  {b.eventType}
                </p>

                <p className="text-gray-400">
                  📍 {b.location}
                </p>

                <p className="text-gray-400 text-sm">
                  📅 {new Date(b.eventDate).toLocaleDateString()}
                </p>

                {b.eventTime && (
                  <p className="text-gray-400 text-sm">
                    ⏰ Time: {b.eventTime}
                  </p>
                )}

                {b.phone && (
                  <p className="text-gray-400 text-sm">
                    📞 Phone: {b.phone}
                  </p>
                )}

                {b.notes && (
                  <p className="text-gray-500 text-sm">
                    📝 Notes: {b.notes}
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  👤 User: {b.userId?.name} ({b.userId?.email})
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(b.status)}`}
                >
                  {b.status}
                </span>

              </div>

              {/* RIGHT SIDE ACTIONS */}
              <div className="flex flex-col gap-3">

                <select
                  value={b.status}
                  onChange={(e) =>
                    handleStatusChange(b._id, e.target.value)
                  }
                  className="bg-black border border-green-500 text-white px-2 py-1 rounded-lg"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => handleDelete(b._id)}
                  className="bg-red-500 px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default AdminPanel;