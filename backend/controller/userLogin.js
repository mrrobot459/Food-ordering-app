import bcrypt from 'bcrypt'
import registersuer from "../models/registersuer.js"
import jwt from 'jsonwebtoken'


const userLogin = async (req, res) => {

    try {
        const { email, password } = req.body
        const user = await registersuer.findOne({ email })
        if (!user) {
            return res.status(400).send("user not found")
        }

        const passwordMatches = await bcrypt.compare(password, user.password)
        if (!passwordMatches) {
            return res.status(400).send("invalid credentials")
        }

        const token = jwt.sign(
            { email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.status(200).send({
            message: "user login sucessfully!",
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }

}

export default userLogin;