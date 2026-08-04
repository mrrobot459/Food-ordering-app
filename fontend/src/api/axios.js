import axios from "axios";

const api = axios.create({
    baseURL: "https://food-ordering-app-d5qa.onrender.com",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

export default api;
