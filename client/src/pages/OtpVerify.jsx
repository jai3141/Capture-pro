import { useState } from "react";
import axios from "axios";

function OtpVerify({ email, onBackToLogin }) {

  const [otp, setOtp] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp }
      );

      alert("Account Verified ✅ Please Login");

      // 🔥 Move back to Login screen
      onBackToLogin();

    } catch (error) {
      console.error(error);
      alert("Invalid OTP ❌");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">

      <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl w-96 border border-green-500">

        <h2 className="text-2xl font-bold text-green-400 text-center mb-6">
          Verify OTP
        </h2>

        <form onSubmit={handleVerify} className="space-y-4">

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-black border border-green-500 text-white focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-black font-semibold py-2 rounded-lg hover:bg-green-400 transition"
          >
            Verify OTP
          </button>

        </form>

      </div>

    </div>
  );
}

export default OtpVerify;