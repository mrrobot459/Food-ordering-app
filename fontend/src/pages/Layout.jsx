import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar";
import Home from "./Home";
import Footer from "../component/Footer";


function Layout() {
    return (
        <div className="min-h-screen w-fullbg-slate-100 text-slate-900">

            <Navbar />

            <main className="w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
