const express = require("express");
const router = express.Router();

router.get('/auth', (req, res) => {
    if (!req.isAuth) {
        res.send({
            isAuthorized: false,
            userId: null,
        })
        return;
    }
    res.send({
        isAuthorized: true,
        userId: req.userId,
    })
})

module.exports = router;
