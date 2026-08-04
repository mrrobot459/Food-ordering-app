import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config();


// Use Google DNS
dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);


const conndb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        console.log(
            "Database connected successfully"
        );

    } catch (error) {
        console.log(
            "Database connection error:",
            error.message
        );
    }
};

export default conndb;