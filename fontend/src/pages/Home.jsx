import React from 'react';
import burger from "../assets/burger.png";
import Menu from './Menu';

const Home = () => {
    return (
        <main className="min-h-screen bg-black">
            
            {/* Hero Image Section */}
            <div className="relative h-screen w-full overflow-hidden">
                <img 
                    src={burger} 
                    alt="Delicious featured burger" 
                    className="h-full w-full object-cover object-center"
                />
                
                {/* 
                  Optional: A subtle gradient overlay. 
                  This makes the image look premium and fades smoothly into the Menu section below. 
                  It also makes it easy to add white text over the image later if you want!
                */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
                
                {/* Uncomment this if you want some hero text over your image! */}
                {/* 
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-5xl font-bold text-white drop-shadow-xl sm:text-7xl">
                        Delicious Burgers
                    </h1>
                </div> 
                */}
            </div>

            {/* Menu Section */}
            <div className="relative z-10 w-full bg-black pb-16">
                <Menu />
            </div>
            
        </main>
    );
};

export default Home;