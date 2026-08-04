import CartItem from "../models/addToCart.js";
import foodItems from "../models/foodItems.js";
import registersuer from "../models/registersuer.js";

const addToCartItem = async (req, res) => {
    try {
        const { foodId, quantity = 1 } = req.body;

        if (!foodId || quantity < 1) {
            return res.status(400).json({ message: "foodId and quantity are required" });
        }

        const food = await foodItems.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        const user = await registersuer.findOne({ email: req.user.email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const existingItem = await CartItem.findOne({ user: user._id, foodId: foodId });
        if (existingItem) {
            existingItem.quantity += quantity;
            await existingItem.save();

            return res.status(200).json({
                success: true,
                message: "Cart item quantity updated",
                data: existingItem,
            });
        }

        const cartEntry = await CartItem.create({
            user: user._id,
            foodId: foodId,
            name: food.name,
            price: food.price,
            description: food.description,
            image: food.image,
            quantity,
        });

        return res.status(201).json({
            success: true,
            message: "Item added to cart successfully",
            data: cartEntry,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to add cart item",
        });
    }
};

const getCartItems = async (req, res) => {
    try {
        const user = await registersuer.findOne({ email: req.user.email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const cartItems = await CartItem.find({ user: user._id });
        return res.status(200).json({ success: true, data: cartItems });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to load cart" });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Cart item ID is required" });
        }

        const user = await registersuer.findOne({ email: req.user.email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const cartItem = await CartItem.findOne({ _id: id, user: user._id });
        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        if (quantity !== undefined) {
            if (quantity < 1) {
                await CartItem.deleteOne({ _id: id, user: user._id });
                return res.status(200).json({ success: true, message: "Cart item removed" });
            }
            cartItem.quantity = quantity;
        }

        await cartItem.save();

        return res.status(200).json({ success: true, message: "Cart item updated successfully", data: cartItem });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to update cart item" });
    }
};

const deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Cart item ID is required" });
        }

        const user = await registersuer.findOne({ email: req.user.email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const deleted = await CartItem.findOneAndDelete({ _id: id, user: user._id });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }

        return res.status(200).json({ success: true, message: "Item deleted from cart successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to delete cart item" });
    }
};

export { addToCartItem, updateCartItem, deleteCartItem, getCartItems };
