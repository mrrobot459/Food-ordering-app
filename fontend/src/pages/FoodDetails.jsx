import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function FoodDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [quantity, setQuantity] = useState(1);

    // =========================
    // GET FOOD DETAILS
    // =========================
    useEffect(() => {
        const fetchFood = async () => {
            try {
                const response = await api.get(`food/${id}`);
                setFood(response.data);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load food details"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchFood();
    }, [id]);


    // =========================
    // ADD TO CART - POST
    // =========================
    const handleAddToCart = async () => {
        try {
            setAdding(true);
            setMessage("");

            // JSON data
            const cartData = {
                foodId: id,
                quantity,
            };

            console.log("Sending JSON:", cartData);

            const token = localStorage.getItem("token");

            if (!token) {
                setMessage("Please login to add items to cart.");
                return;
            }

            const response = await api.post(
                "/cart",
                cartData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Cart Response:", response.data);

            setMessage(
                response.data.message ||
                "Food added to cart successfully"
            );

        } catch (error) {
            console.error(
                "Add To Cart Error:",
                error.response?.data || error.message
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to add food to cart"
            );

        } finally {
            setAdding(false);
        }
    };


    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                <p className="text-xl">
                    Loading food details...
                </p>
            </div>
        );
    }


    // =========================
    // ERROR
    // =========================
    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-red-500">
                <p className="text-xl">
                    {error}
                </p>
            </div>
        );
    }


    // =========================
    // FOOD NOT FOUND
    // =========================
    if (!food) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                <p className="text-xl">
                    Food not found
                </p>
            </div>
        );
    }


    // =========================
    // UI
    // =========================
    return (
        <div className="min-h-screen bg-black p-6 text-white">

            <div className="mx-auto max-w-4xl">

                <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">

                    {/* Food Image */}
                    {food.image && (
                        <img
                            src={food.image}
                            alt={food.name}
                            className="h-96 w-full object-cover"
                        />
                    )}

                    {/* Food Details */}
                    <div className="p-8">

                        <h1 className="mb-4 text-4xl font-bold">
                            {food.name}
                        </h1>

                        {food.description && (
                            <p className="mb-6 text-zinc-400">
                                {food.description}
                            </p>
                        )}

                        <div className="mb-6 flex items-center gap-6">
                            <p className="text-2xl font-bold">₹{food.price}</p>

                            <div className="flex items-center gap-3 rounded-3xl bg-zinc-950 px-4 py-3">
                                <label className="text-sm text-zinc-400">Qty</label>
                                <select
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none"
                                >
                                    {[...Array(6).keys()].map((index) => {
                                        const value = index + 1;
                                        return (
                                            <option key={value} value={value}>
                                                {value}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        {/* Success / Error Message */}
                        {message && (
                            <p className="mb-4 text-sm text-green-400">
                                {message}
                            </p>
                        )}


                        {/* Add To Cart Button */}
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={adding}
                            className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {adding
                                ? "Adding..."
                                : "Add to Cart"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default FoodDetails;
