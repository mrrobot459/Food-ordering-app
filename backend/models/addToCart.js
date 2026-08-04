import mongoose from "mongoose";

const addToCart = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "registersuer",
        required: true,
    },
    foodId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
    },
}, {
    timestamps: true,
});

addToCart.index({ user: 1, foodId: 1 }, { unique: true });

export default mongoose.model("addToCart", addToCart);
