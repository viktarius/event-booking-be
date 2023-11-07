const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../mongoose/models/user');

module.exports = {
    login: async ({ email, password }) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials!');
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, 'super$ecretKey', { expiresIn: '1h' });
        return {
            userId: user.id,
            token,
            tokenExpiration: 1
        }
    }
}