import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"

function Overview() {

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const userRole = decoded.role;

  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {

    try {

      // 🔥 Role based endpoint
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

      const data = res.data;

      const total = data.length;

      const upcoming = data.filter(
        b => new Date(b.eventDate) > new Date()
      ).length;

      const completed = data.filter(
        b => b.status === "completed"
      ).length;

      setStats({
        total,
        upcoming,
        completed
      });

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="space-y-10">

      {/* HERO SECTION */}

      <div className="bg-zinc-900 border border-green-500 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">

        <div className="flex-1">

          <h1 className="text-3xl font-bold text-green-400">
            Welcome to CapturePro 📸
          </h1>

          <p className="text-gray-400 mt-3">
            Manage your photography bookings like a pro.
          </p>

        </div>

        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552"
          className="w-72 rounded-xl object-cover"
        />

      </div>


      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-zinc-900 border border-green-500 p-6 rounded-xl text-center">
          <p className="text-gray-400">Total Bookings</p>
          <h2 className="text-3xl font-bold text-green-400">
            {stats.total}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-green-500 p-6 rounded-xl text-center">
          <p className="text-gray-400">Upcoming Events</p>
          <h2 className="text-3xl font-bold text-green-400">
            {stats.upcoming}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-green-500 p-6 rounded-xl text-center">
          <p className="text-gray-400">Completed</p>
          <h2 className="text-3xl font-bold text-green-400">
            {stats.completed}
          </h2>
        </div>

      </div>


      {/* FEATURED WEDDING PHOTOS */}

      <div>

        <h2 className="text-xl font-bold text-green-400 mb-6">
          Featured Wedding Shoots
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc"
            className="rounded-xl h-64 w-full object-cover hover:scale-105 transition"
          />

          <img
            src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486"
            className="rounded-xl h-64 w-full object-cover hover:scale-105 transition"
          />

          <img
            src="https://images.unsplash.com/photo-1504196606672-aef5c9cefc92"
            className="rounded-xl h-64 w-full object-cover hover:scale-105 transition"
          />

        </div>

      </div>


      {/* PREMIUM GALLERY GRID */}

      <div>

        <h2 className="text-xl font-bold text-green-400 mb-6">
          Wedding Photography Gallery
        </h2>

        <div className="grid md:grid-cols-4 gap-4">

          <img
            src="https://images.unsplash.com/photo-1529636798458-92182e662485"
            className="rounded-lg h-48 w-full object-cover hover:scale-110 transition"
          />

          <img
            src="https://images.unsplash.com/photo-1520854221256-17451cc331bf"
            className="rounded-lg h-48 w-full object-cover hover:scale-110 transition"
          />

          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552"
            className="rounded-lg h-48 w-full object-cover hover:scale-110 transition"
          />

          <img
            src="https://images.unsplash.com/photo-1537633552985-df8429e8048b"
            className="rounded-lg h-48 w-full object-cover hover:scale-110 transition"
          />

          <img
            src="https://images.unsplash.com/photo-1495567720989-cebdbdd97913"
            className="rounded-lg h-48 w-full object-cover hover:scale-110 transition"
          />

          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
            className="rounded-lg h-48 w-full object-cover hover:scale-110 transition"
          />

          <img
            src="https://images.unsplash.com/photo-1472653431158-6364773b2a56"
            className="rounded-lg h-48 w-full object-cover hover:scale-110 transition"
          />

          <img
            src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429"
            className="rounded-lg h-48 w-full object-cover hover:scale-110 transition"
          />

        </div>

      </div>

    </div>

  );

}

export default Overview;