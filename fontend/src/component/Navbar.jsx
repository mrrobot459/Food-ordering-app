import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const navItems = [
    { label: "Home", to: "/" },
    { label: "Orders", to: "/orders" },
];

const Navbar = () => {
    const navigate = useNavigate();

    // Initial login state
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return Boolean(localStorage.getItem("token"));
    });

    useEffect(() => {
        // Function to check authentication
        const checkAuthStatus = () => {
            const token = localStorage.getItem("token");

            setIsLoggedIn(Boolean(token));
        };

        // Check immediately
        checkAuthStatus();

        // Check localStorage every 500ms
        // This allows Navbar to detect login/logout
        // without page reload
        const interval = setInterval(() => {
            checkAuthStatus();
        }, 500);

        // Listen for storage changes
        // Useful when localStorage changes from another tab
        const handleStorageChange = () => {
            checkAuthStatus();
        };

        window.addEventListener(
            "storage",
            handleStorageChange
        );

        // Listen for custom auth changes
        // If login component dispatches authChange,
        // Navbar will update immediately
        window.addEventListener(
            "authChange",
            handleStorageChange
        );

        // Cleanup
        return () => {
            clearInterval(interval);

            window.removeEventListener(
                "storage",
                handleStorageChange
            );

            window.removeEventListener(
                "authChange",
                handleStorageChange
            );
        };
    }, []);

    // Logout
    const handleLogout = () => {
        // Remove authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Update Navbar immediately
        setIsLoggedIn(false);

        // Notify other components
        window.dispatchEvent(
            new Event("authChange")
        );

        // Navigate to login
        navigate("/login");
    };

    return (
        <nav className="bg-slate-950 text-white shadow-lg">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">

                {/* Logo */}
                <NavLink
                    to="/"
                    className="text-2xl font-extrabold tracking-tight text-white"
                >
                    Foodie Express
                </NavLink>

                {/* Navigation */}
                <div className="flex flex-wrap items-center gap-3">

                    {/* Home & Orders */}
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `rounded-full px-4 py-2 text-sm font-medium transition ${
                                    isActive
                                        ? "text-sky-300"
                                        : "text-slate-300 hover:text-white"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}

                    {/* Login / Logout */}
                    {isLoggedIn ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                            Logout
                        </button>
                    ) : (
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                `rounded-full px-5 py-2 text-sm font-semibold transition ${
                                    isActive
                                        ? "bg-sky-500 text-slate-950"
                                        : "bg-sky-400 text-slate-950 hover:bg-sky-500"
                                }`
                            }
                        >
                            Login
                        </NavLink>
                    )}

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
