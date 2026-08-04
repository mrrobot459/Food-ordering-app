import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Auth = () => {
    const navigate = useNavigate();

    // true = Login
    // false = Register
    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Switch Login / Register
    const handleModeChange = (loginMode) => {
        setIsLogin(loginMode);

        // Clear message
        setMessage("");

        // Clear form
        setFormData({
            name: "",
            email: "",
            password: "",
        });
    };

    // Submit Login / Register
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            // =========================
            // LOGIN API
            // =========================
            if (isLogin) {
                const response = await axios.post(
                    "http://127.0.0.1:3000/login",
                    {
                        email: formData.email,
                        password: formData.password,
                    }
                );

                console.log(
                    "Login Response:",
                    response.data
                );

                const { token, user } = response.data;

                // Save JWT token
                localStorage.setItem(
                    "token",
                    token
                );

                // Save user data
                if (user) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(user)
                    );
                }

                // Update Navbar
                window.dispatchEvent(
                    new Event("authChange")
                );

                // Go Home
                navigate("/");
            }

            // =========================
            // REGISTER API
            // =========================
            else {
                const response = await axios.post(
                    "http://127.0.0.1:3000/register",
                    {
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                    }
                );

                console.log(
                    "Register Response:",
                    response.data
                );

                // Show success message
                setMessage(
                    response.data.message ||
                    "User created successfully"
                );

                // Clear form
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                });

                // Switch to Login
                setTimeout(() => {
                    setIsLogin(true);
                    setMessage("");
                }, 1500);
            }

        } catch (error) {
            console.error(
                "Auth Error:",
                error.response?.data || error.message
            );

            setMessage(
                error.response?.data?.message ||
                error.response?.data ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden bg-black px-4">

            {/* Background Glow */}
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[120px]" />

            {/* Left Fire Glow */}
            <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-1/4 lg:block">
                <div className="absolute left-0 top-1/2 h-80 w-40 -translate-y-1/2 rounded-r-full bg-red-600/20 blur-3xl" />

                <div className="absolute bottom-10 left-10 h-48 w-32 rounded-full bg-orange-500/20 blur-3xl" />

                <div className="absolute left-20 top-20 h-40 w-24 rotate-12 rounded-full bg-red-500/20 blur-3xl" />
            </div>

            {/* Right Fire Glow */}
            <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/4 lg:block">
                <div className="absolute right-0 top-1/2 h-80 w-40 -translate-y-1/2 rounded-l-full bg-red-600/20 blur-3xl" />

                <div className="absolute bottom-10 right-10 h-48 w-32 rounded-full bg-orange-500/20 blur-3xl" />

                <div className="absolute right-20 top-20 h-40 w-24 -rotate-12 rounded-full bg-red-500/20 blur-3xl" />
            </div>

            {/* Auth Card */}
            <div className="relative z-10 w-full max-w-md">

                <div className="rounded-3xl border border-red-500/20 bg-slate-950/95 p-8 shadow-[0_0_80px_rgba(239,68,68,0.15)] backdrop-blur-xl">

                    {/* Header */}
                    <div className="mb-8 text-center">

                        <h1 className="text-3xl font-black tracking-tight text-white">
                            {isLogin
                                ? "Welcome Back"
                                : "Create Account"}
                        </h1>

                        <p className="mt-2 text-sm text-slate-400">
                            {isLogin
                                ? "Login to continue to Foodie Express"
                                : "Create your Foodie Express account"}
                        </p>

                    </div>

                    {/* Login / Register Toggle */}
                    <div className="mb-6 flex rounded-xl bg-slate-900 p-1">

                        <button
                            type="button"
                            onClick={() =>
                                handleModeChange(true)
                            }
                            className={`w-1/2 rounded-lg py-2.5 text-sm font-bold transition ${
                                isLogin
                                    ? "bg-red-600 text-white shadow-lg"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                handleModeChange(false)
                            }
                            className={`w-1/2 rounded-lg py-2.5 text-sm font-bold transition ${
                                !isLogin
                                    ? "bg-red-600 text-white shadow-lg"
                                    : "text-slate-400 hover:text-white"
                            }`}
                        >
                            Register
                        </button>

                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Name - Only Register */}
                        {!isLogin && (
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-300">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-300">
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-300">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            />
                        </div>

                        {/* Message */}
                        {message && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
                                {message}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-3 font-bold text-white shadow-lg shadow-red-600/20 transition duration-300 hover:scale-[1.02] hover:from-red-500 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? isLogin
                                    ? "Logging in..."
                                    : "Creating Account..."
                                : isLogin
                                ? "Login"
                                : "Create Account"}
                        </button>

                    </form>

                
                

                </div>



            </div>
        </div>
    );
};

export default Auth;
