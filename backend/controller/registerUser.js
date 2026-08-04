import registersuer from '../models/registersuer.js'

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body

        const isExist = await registersuer.findOne({ email })
        if (isExist) {
            return res.status(400).send("user already exist")
        }
        await registersuer.create({ name, email, password, role: "user" })
        res.status(200).send("user created sucessfully")
    } catch (error) {
        res.send({
            message: error.message
        })

    }

}

export default registerUser;