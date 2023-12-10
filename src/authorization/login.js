const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");

const User = require("../mongoose/models/user");

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User does not exist!');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error('Invalid credentials!');
    }
    const token = jwt.sign({
        userId: user.id,
        email: user.email
    }, process.env.JWT_TOKEN_SECRET_KEY, { expiresIn: '1h' });
    res.cookie('accessToken', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000),
        domain: 'localhost',
        sameSite: 'Lax',
    })
    res.send({ isAuthorized: true, userId: user._id })
})

module.exports = router;
