const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const cookies = req.headers.cookie && req.headers.cookie.split('; ') || [];
    const authCookie = cookies.find(cookie => cookie.startsWith('accessToken='));
    if (!authCookie) {
        req.isAuth = false;
        return next();
    }
    const token = authCookie.split('=')[1];
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY)
    } catch (e) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
}
