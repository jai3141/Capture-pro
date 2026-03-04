function Navbar({ handleLogout }) {
  return (
    <nav className="bg-black border-b border-green-500 px-8 py-4 flex justify-between items-center">

      <h1 className="text-green-400 text-2xl font-bold">
        CapturePro 📸
      </h1>

      <div className="space-x-6 text-green-400 font-medium">
        <button className="hover:text-white transition">
          Dashboard
        </button>
        
        <button
          onClick={handleLogout}
          className="bg-green-500 text-black px-4 py-1 rounded-lg hover:bg-green-400"
        >
          Logout
        </button>
      </div>

    </nav>
  );
}

export default Navbar;