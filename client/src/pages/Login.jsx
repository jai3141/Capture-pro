import { useState } from "react";
import axios from "axios";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import OtpVerify from "./OtpVerify";

function Login({ setIsLoggedIn }) {

    const [isSignup, setIsSignup] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [signupEmail, setSignupEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            if (isSignup) {
                // 🔹 Signup
                await axios.post(
                    "https://capturepro-backend.onrender.com/api/auth/signup",
                    formData
                );

                setSignupEmail(formData.email);
                setShowOtp(true);

            } else {
                // 🔹 Login
                const res = await axios.post(
                    "https://capturepro-backend.onrender.com/api/auth/login",
                    {
                        email: formData.email,
                        password: formData.password
                    }
                );

                localStorage.setItem("token", res.data.token);
                setIsLoggedIn(true);
            }

        } catch (error) {
            console.error(error);

            if (error.response && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Something went wrong ❌");
            }
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            const response = await axios.post(
                "https://capturepro-backend.onrender.com/api/auth/google-login",
                { token: idToken }
            );

            localStorage.setItem("token", response.data.token);
            setIsLoggedIn(true);

        } catch (error) {
            console.error(error);
            alert("Google Login Failed ❌");
        }
    };

    // 🔥 If OTP screen active
    if (showOtp) {
        return (
            <OtpVerify
                email={signupEmail}
                onBackToLogin={() => {
                    setShowOtp(false);
                    setIsSignup(false);
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">

            <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl w-96 border border-green-500">

                <h2 className="text-3xl font-bold text-center text-green-400 mb-6">
                    CapturePro
                </h2>

                <form onSubmit={handleEmailAuth} className="space-y-4">

                    {isSignup && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            onChange={handleChange}
                            required
                            className="w-full p-3 rounded-lg bg-black border border-green-500 text-white focus:outline-none"
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg bg-black border border-green-500 text-white focus:outline-none"
                    />

                    <div className="relative">

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                            className="w-full p-3 pr-12 rounded-lg bg-black border border-green-500 text-white focus:outline-none"
                        />
                        
                        {errorMessage && (
                            <p className="text-red-500 text-sm text-center">
                                {errorMessage}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-black text-sm"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>

                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-black font-semibold py-2 rounded-lg hover:bg-green-400 transition"
                    >
                        {isSignup ? "Sign Up" : "Login"}
                    </button>

                </form>

                <div className="my-4 text-center text-gray-400">OR</div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white text-black py-2 rounded-lg hover:bg-gray-200 transition"
                >
                    Continue with Google
                </button>

                <p
                    onClick={() => setIsSignup(!isSignup)}
                    className="text-green-400 text-sm text-center mt-6 cursor-pointer hover:underline"
                >
                    {isSignup
                        ? "Already have an account? Login"
                        : "Don't have an account? Sign Up"}
                </p>

            </div>

        </div>
    );
}

export default Login;