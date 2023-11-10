const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../mongoose/models/user');

module.exports = {
    createUser: async ({ body }) => {
        const { email, password, name, surname } = body;
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
            const token = jwt.sign({ userId: savedUser.id, email: savedUser.email }, process.env.JWT_TOKEN_SECRET_KEY, { expiresIn: '1h' });
            return {
                userId: savedUser.id,
                token,
                tokenExpiration: 1
            }
        } catch (error) {
            throw error;
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials!');
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_TOKEN_SECRET_KEY, { expiresIn: '1h' });
        return {
            userId: user.id,
            token,
            tokenExpiration: 1
        }
    }
}
