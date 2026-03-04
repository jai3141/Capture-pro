import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

function BookingCalendar() {

  const token = localStorage.getItem("token");

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {

    try {

      const res = await axios.get(
        "https://capturepro-backend.onrender.com/api/booking/admin/bookings",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const calendarEvents = res.data.map((b) => ({

        title: `${b.eventType} - ${b.location}`,

        start: new Date(b.eventDate),

        end: new Date(b.eventDate),

        phone: b.phone,

        notes: b.notes,

        status: b.status,

        location: b.location

      }));

      setEvents(calendarEvents);

    } catch (error) {

      console.error("Calendar load failed", error);

    }

  };

  // Event Color by Status
  const eventStyleGetter = (event) => {

    let backgroundColor = "#22c55e";

    if (event.status === "pending") backgroundColor = "#eab308";
    if (event.status === "confirmed") backgroundColor = "#3b82f6";
    if (event.status === "completed") backgroundColor = "#22c55e";
    if (event.status === "cancelled") backgroundColor = "#ef4444";

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        color: "white",
        border: "none",
        padding: "4px"
      }
    };

  };

  return (

    <div className="bg-zinc-900 p-8 rounded-2xl border border-green-500">

      <h2 className="text-xl font-bold text-green-400 mb-6">
        Booking Calendar
      </h2>

      <div className="bg-black p-6 rounded-xl">

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month"]}
          defaultView="month"
          popup
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => setSelectedEvent(event)}
          style={{ height: 600 }}
        />

      </div>

      {/* EVENT POPUP */}
      {selectedEvent && (

        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">

          <div className="bg-zinc-900 border border-green-500 p-6 rounded-xl w-96">

            <h3 className="text-lg font-bold text-green-400 mb-4">
              Booking Details
            </h3>

            <p className="text-white mb-2">
              <b>Event:</b> {selectedEvent.title}
            </p>

            <p className="text-gray-400 mb-2">
              <b>Location:</b> {selectedEvent.location}
            </p>

            <p className="text-gray-400 mb-2">
              <b>Phone:</b> {selectedEvent.phone}
            </p>

            <p className="text-gray-400 mb-2">
              <b>Notes:</b> {selectedEvent.notes || "No notes"}
            </p>

            <p className="text-gray-400 mb-4">
              <b>Status:</b> {selectedEvent.status}
            </p>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full bg-green-500 text-black py-2 rounded-lg font-semibold hover:bg-green-400"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>

  );

}

export default BookingCalendar;