import { useState } from "react";
import Overview from "./Overview";
import Bookings from "./Bookings";
import Gallery from "./Gallery";
import AdminPanel from "./AdminPanel"
import BookingCalendar from "./BookingCalendar"

function Dashboard({ setIsLoggedIn }) {

  const token = localStorage.getItem("token");
  const decoded = JSON.parse(atob(token.split(".")[1]));
  const role = decoded.role;

  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 border-r border-green-500 p-6 flex flex-col justify-between">

        <div>
          <h2 className="text-2xl font-bold text-green-400 mb-10">
            CapturePro
          </h2>

          <nav className="space-y-4">

            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${activeTab === "overview"
                ? "bg-green-500 text-black"
                : "hover:bg-zinc-800"
                }`}
            >
              🏠 Overview
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${activeTab === "bookings"
                ? "bg-green-500 text-black"
                : "hover:bg-zinc-800"
                }`}
            >
              📅 Bookings
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${activeTab === "gallery"
                ? "bg-green-500 text-black"
                : "hover:bg-zinc-800"
                }`}
            >
              📸 Gallery
            </button>

            <button
              onClick={() => setActiveTab("calendar")}
              className="block w-full text-left px-4 py-2 hover:bg-zinc-800"
            >
              Calendar
            </button>

            {role === "admin" && (
              <button
                onClick={() => setActiveTab("admin")}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-zinc-800"
              >
                Admin Panel
              </button>
            )}

          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg"
        >
          🚪 Logout
        </button>

      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">

        {activeTab === "overview" && <Overview />}
        {activeTab === "bookings" && <Bookings />}
        {activeTab === "gallery" && <Gallery />}
        {activeTab === "admin" && <AdminPanel />}
        {activeTab === "calendar" && <BookingCalendar />}


      </div>

    </div>
  );
}

export default Dashboard;