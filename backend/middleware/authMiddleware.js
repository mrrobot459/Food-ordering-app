import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).send("Invalid token")
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decode;

    next()
}

export default authMiddleware;