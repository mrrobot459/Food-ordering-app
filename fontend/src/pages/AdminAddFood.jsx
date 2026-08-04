import { useEffect, useState } from "react";
import api from "../api/axios";

const AdminAddFood = () => {
    const [form, setForm] = useState({
        name: "",
        price: "",
        description: "",
        image: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                setUser(null);
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Please login as admin to add food.");
                return;
            }

            const response = await api.post(
                "/food/add",
                {
                    name: form.name,
                    price: Number(form.price),
                    description: form.description,
                    image: form.image,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage(response.data || "Food added successfully.");
            setForm({ name: "", price: "", description: "", image: "" });
        } catch (error) {
            console.error("Add food error:", error.response || error.message);
            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to add food item."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black p-6 text-white">
            <div className="mx-auto max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
                <h1 className="text-3xl font-bold">Admin Add Food</h1>
                <p className="mt-2 text-sm text-zinc-400">
                    This page is hidden from navigation. Open it manually in the browser to add new food items.
                </p>

                {!user || user.role !== "admin" ? (
                    <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-200">
                        <p className="text-lg font-semibold">Access Denied</p>
                        <p className="mt-3 text-sm text-red-100">
                            You must be an admin to use this page.
                        </p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Food Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Price</label>
                        <input
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.price}
                            onChange={handleChange}
                            required
                            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                            rows="4"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Image URL</label>
                        <input
                            name="image"
                            value={form.image}
                            onChange={handleChange}
                            required
                            className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                        />
                    </div>

                    {message && (
                        <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-200">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="rounded-2xl bg-red-500/10 p-4 text-red-200">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Food"}
                    </button>
                </form>
                )}
            </div>
        </div>
    );
};

export default AdminAddFood;
