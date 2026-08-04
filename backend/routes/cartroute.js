import e from "express";
import { addToCartItem, updateCartItem, deleteCartItem, getCartItems } from "../controller/addToCart.js";
import authMiddleware from "../middleware/authMiddleware.js";

const cartRoute = e.Router();

cartRoute.get('/', authMiddleware, getCartItems);
cartRoute.post('/', authMiddleware, addToCartItem);
cartRoute.put('/:id', authMiddleware, updateCartItem);
cartRoute.delete('/:id', authMiddleware, deleteCartItem);

export default cartRoute;