import express from 'express'
import conndb from './database/db.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import registerUser from './controller/registerUser.js'
import userLogin from './controller/userLogin.js'
import registersuer from './models/registersuer.js'
import foodRoute from './routes/foodRoute.js'
import cartRoute from './routes/cartroute.js'
import cors from 'cors'



const app = express()
dotenv.config()
conndb()

app.use(cors());

app.use(express.json())

// register route 
app.post("/register", registerUser)

// login route 

app.post("/login", userLogin)

// product route 
app.use('/food', foodRoute)
app.use('/cart', cartRoute)

app.listen(3000, () => {
    console.log("server is running at 3000")
})