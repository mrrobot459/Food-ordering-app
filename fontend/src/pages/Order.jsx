import { useEffect, useState } from "react";
import api from "../api/axios";

const Orders = () => {
    const [cartItems, setCartItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Please login to view your cart.");
                    return;
                }

                const response = await api.get("/cart", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setCartItems(response.data.data || []);
            } catch (error) {
                console.error("Cart fetch error:", error.response || error.message);
                setError(
                    error.response?.data?.message ||
                    "Unable to load cart items."
                );
            } finally {
                setLoading(false);
            }
        };

        const storedOrders = JSON.parse(
            localStorage.getItem("ordersHistory") || "[]"
        );
        setOrders(storedOrders);

        fetchCartItems();
    }, []);

    const updateCartQuantity = async (itemId, quantity) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Please login to update cart quantity.");
            return;
        }

        try {
            if (quantity === 0) {
                await api.delete(`/cart/${itemId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCartItems((prev) => prev.filter((item) => item._id !== itemId));
                return;
            }

            const response = await api.put(
                `/cart/${itemId}`,
                { quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCartItems((prev) =>
                prev.map((item) =>
                    item._id === itemId ? response.data.data : item
                )
            );
        } catch (error) {
            console.error("Update quantity error:", error.response || error.message);
            setError(
                error.response?.data?.message ||
                "Unable to update cart quantity."
            );
        }
    };

    const handleCheckout = () => {
        setMessage("");
        setConfirmOpen(true);
    };

    const placeOrder = async () => {
        setConfirmOpen(false);
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Please login to place an order.");
            return;
        }

        if (cartItems.length === 0) {
            setMessage("Your cart is empty.");
            return;
        }

        const newOrder = {
            id: `order-${Date.now()}`,
            createdAt: new Date().toISOString(),
            items: cartItems,
            total: cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            ),
        };

        try {
            await Promise.all(
                cartItems.map((item) =>
                    api.delete(`/cart/${item._id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                )
            );
        } catch (error) {
            console.error("Failed to clear cart after order:", error.response || error.message);
        }

        const updatedOrders = [newOrder, ...orders];
        localStorage.setItem("ordersHistory", JSON.stringify(updatedOrders));
        setOrders(updatedOrders);
        setCartItems([]);
        setError("");
        setMessage("Order placed successfully!");
    };

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                <p className="text-xl">Loading your cart...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-red-500 px-4">
                <p className="text-xl">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black p-6 text-white">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Cart</p>
                            <h1 className="mt-2 text-4xl font-bold">My Cart</h1>
                        </div>
                        <p className="text-lg text-zinc-400">
                            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    {message && (
                        <div className="mb-6 rounded-3xl bg-emerald-500/10 p-5 text-emerald-300">
                            {message}
                        </div>
                    )}

                    {cartItems.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950 p-10 text-center">
                            <h2 className="text-2xl font-semibold text-white">Your cart is empty</h2>
                            <p className="mt-3 text-zinc-400">
                                Add food from the menu, then come here to finish your order.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
                                        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                                            <div>
                                                <p className="text-xl font-semibold text-white">{item.name}</p>
                                                <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
                                            </div>
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
                                                <div className="flex items-center gap-2 rounded-2xl bg-zinc-900 px-3 py-2">
                                                    <label className="text-sm text-zinc-400">Qty</label>
                                                    <select
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateCartQuantity(
                                                                item._id,
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        className="rounded-xl border border-zinc-700 bg-black px-3 py-2 text-white outline-none"
                                                    >
                                                        {[...Array(7).keys()].map((value) => (
                                                            <option key={value} value={value}>
                                                                {value}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold text-white">₹{item.price}</p>
                                                    <p className="text-sm text-zinc-500">Total: ₹{item.price * item.quantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-slate-950 p-6 text-right sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Order Summary</p>
                                    <p className="mt-3 text-3xl font-bold text-white">₹{totalPrice}</p>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="rounded-3xl bg-red-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-red-700"
                                >
                                    Checkout
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {orders.length > 0 && (
                    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
                        <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Orders</p>
                        <h2 className="mt-2 text-3xl font-bold text-white">Order History</h2>
                        <div className="mt-6 space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-semibold text-white">Order ID: {order.id}</p>
                                            <p className="text-sm text-zinc-400">{new Date(order.createdAt).toLocaleString()}</p>
                                        </div>
                                        <p className="text-lg font-semibold text-white">₹{order.total}</p>
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        {order.items.map((item) => (
                                            <div key={item._id} className="flex items-center justify-between rounded-2xl bg-zinc-900 p-4">
                                                <div>
                                                    <p className="font-medium text-white">{item.name}</p>
                                                    <p className="text-sm text-zinc-400">Qty {item.quantity}</p>
                                                </div>
                                                <p className="text-sm text-zinc-400">₹{item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {confirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                    <div className="w-full max-w-md rounded-3xl bg-zinc-950 p-8 shadow-2xl">
                        <h3 className="text-2xl font-bold text-white">Confirm Order</h3>
                        <p className="mt-4 text-sm text-zinc-400">
                            Do you want to place your order now?
                        </p>
                        <div className="mt-8 flex items-center justify-end gap-4">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="rounded-3xl border border-zinc-700 px-5 py-3 text-sm text-white transition hover:border-zinc-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={placeOrder}
                                className="rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
