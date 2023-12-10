const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");

const User = require("../mongoose/models/user");

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password, name, surname } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists.');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email,
            password: hashedPassword,
            name: name || 'John',
            surname: surname || 'Doe'
        })

        const savedUser = await user.save();
        const token = jwt.sign({
            userId: savedUser.id,
            email: savedUser.email
        }, process.env.JWT_TOKEN_SECRET_KEY, { expiresIn: '1h' });
        res.cookie('accessToken', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 60 * 1000),
            domain: 'localhost',
            sameSite: 'Lax',
        })
        return {
            isAuthorized: true,
            userId: savedUser.id,
        }
    } catch (error) {
        throw error;
    }
})

module.exports = router;
