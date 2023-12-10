const express = require("express");

const router = express.Router();

router.get('/logout', (req, res) => {
    res.cookie('accessToken', null, {
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000),
        domain: 'localhost',
        sameSite: 'Lax',
    })
    res.send({ isAuthorized: false })
})

module.exports = router;
