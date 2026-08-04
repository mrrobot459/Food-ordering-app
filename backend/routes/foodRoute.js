import express from "express"
import foodItems from "../models/foodItems.js"
import authMiddleware from "../middleware/authMiddleware.js"
import registersuer from "../models/registersuer.js"


const foodRoute = express.Router()


foodRoute.get("/", async (req, res) => {

    try {
        const foods = await foodItems.find()
        res.status(200).send(foods)

    } catch (error) {
        res.status(500).send(error)
    }
})
foodRoute.get("/:id", async (req, res) => {

    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "id is required" })
        }

        const item = await foodItems.findOne({ _id: id })
        if (!item) {
            return res.status(404).json({ message: "item not found" })
        }
        res.status(200).json(item)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message || "Server error" })
    }
})
foodRoute.post("/add", authMiddleware, async (req, res) => {

    try {
        const user = await registersuer.findOne({ email: req.user.email })
        if (!user) {
            return res.status(400).send("user not found")
        }
        console.log(req.user)
        if (req.user.role != "admin" && req.user.role != "admin") {
            return res.status(403).send("you are not admin")

        }
        const { name, price, description, image } = req.body
        await foodItems.create({ name, price, description, image })
        res.status(200).send("food added sucessfully")
    } catch (error) {
        res.status(500).send(error)
    }
})

foodRoute.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const user = await registersuer.findOne({ email: req.user.email });
        if (!user) {
            return res.status(400).send("user not found");
        }

        if (req.user.role !== "admin") {
            return res.status(403).send("you are not admin");
        }

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "id is required" });
        }

        const deleted = await foodItems.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "food item not found" });
        }

        res.status(200).send("food deleted sucessfully");
    } catch (error) {
        res.status(500).send(error);
    }
});

foodRoute.patch("/:id", authMiddleware, async (req, res) => {
    try {
        const user = await registersuer.findOne({ email: req.user.email });
        if (!user) {
            return res.status(400).send("user not found");
        }

        if (req.user.role !== "admin") {
            return res.status(403).send("you are not admin");
        }

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "id is required" });
        }

        const { name, price, description, image } = req.body;
        const updated = await foodItems.findByIdAndUpdate(
            id,
            { name, price, description, image },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "food item not found" });
        }

        res.status(200).send("food updated sucessfully");
    } catch (error) {
        res.status(500).send(error);
    }
});




export default foodRoute;