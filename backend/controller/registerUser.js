import bcrypt from 'bcrypt'
import registersuer from '../models/registersuer.js'

const SALT_ROUNDS = 10

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body

        const isExist = await registersuer.findOne({ email })
        if (isExist) {
            return res.status(400).send("user already exist")
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
        await registersuer.create({ name, email, password: hashedPassword, role: "user" })
        res.status(200).send("user created sucessfully")
    } catch (error) {
        res.send({
            message: error.message
        })

    }

}

export default registerUser;