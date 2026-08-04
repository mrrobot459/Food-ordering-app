const Footer = () => {
    return (
        <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm md:flex-row">

                {/* Copyright */}
                <p>
                    © {new Date().getFullYear()} Foodie Express.
                    All rights reserved.
                </p>

                {/* Tagline */}
                <p className="text-slate-500">
                    Fresh Food. Fast Delivery. Great Taste.
                </p>

            </div>
        </footer>
    );
};

export default Footer;
