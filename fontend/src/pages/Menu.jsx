import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Menu() {
    const navigate = useNavigate();

    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await api.get("/food");

                console.log(response.data);

                setMenu(response.data);
            } catch (error) {
                console.error(error);
                setError("Failed to load menu");
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    // Add Button Click
    const handleAdd = (id) => {
        navigate(`/food/${id}`);
    };

    // Loading State
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                <p className="text-xl">
                    Loading menu...
                </p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-red-500">
                <p className="text-xl">
                    {error}
                </p>
            </div>
        );
    }

    // Empty State
    if (menu.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                <p className="text-xl">
                    No menu items found.
                </p>
            </div>
        );
    }

    // Success State
    return (
        <div className="min-h-screen bg-black p-6 text-white">
            <div className="mx-auto max-w-7xl">

                <h1 className="mb-8 text-4xl font-bold">
                    Our Menu
                </h1>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                    {menu.map((item) => {

                        // Get item ID
                        const itemId =
                            item._id || item.id;

                        return (
                            <div
                                key={itemId}
                                className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition hover:border-zinc-600"
                            >
                                {/* Image */}
                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-52 w-full object-cover"
                                    />
                                )}

                                {/* Content */}
                                <div className="p-5">

                                    <h2 className="mb-2 text-xl font-semibold">
                                        {item.name}
                                    </h2>

                                    {item.description && (
                                        <p className="mb-4 text-sm text-zinc-400">
                                            {item.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between">

                                        <span className="text-lg font-bold">
                                            ₹{item.price}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAdd(itemId)
                                            }
                                            className="rounded-lg bg-white px-4 py-2 font-medium text-black transition hover:bg-zinc-200"
                                        >
                                            View
                                        </button>

                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
}

export default Menu;
