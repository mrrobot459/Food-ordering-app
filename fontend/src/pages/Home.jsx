import React from 'react'

import burger from "../assets/burger.png"
import Menu from './Menu'

const Home = () => {
    return (
        <>

            <div className='w-full h-screen '>
                <img className='bg-cover bg-center w-full h-full' src={burger} alt="" />
            </div>
            <Menu />
        </>
    )
}

export default Home