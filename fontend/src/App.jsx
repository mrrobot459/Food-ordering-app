import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Orders from "./pages/Order";
import FoodDetails from "./pages/FoodDetails";
import AdminAddFood from "./pages/AdminAddFood";
import Layout from "./pages/Layout";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Common Layout */}
                <Route element={<Layout />}>

                    {/* Home */}
                    <Route path="/" element={<Home />} />

                    {/* Orders */}
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/cart" element={<Orders />} />

                    {/* Login */}
                    <Route path="/login" element={<Login />} />

                    {/* Food Details */}
                    <Route path="/food/:id" element={<FoodDetails />} />

                    {/* Hidden admin-only add page */}
                    <Route path="/food/add" element={<AdminAddFood />} />

                    {/* 404 / Unknown Route */}
                    <Route path="*" element={<Home />} />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;
