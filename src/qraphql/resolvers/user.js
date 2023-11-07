const bcrypt = require('bcryptjs');

const User = require('../../mongoose/models/user');

module.exports = {
    createUser: async ({ body }) => {
        const { email, password } = body;
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('User already exists.');
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({
                email,
                password: hashedPassword,
            })

            const savedUser = await user.save();
            return {
                ...savedUser._doc,
                _id: savedUser._doc._id.toString(),
                password: null
            }
        } catch (error) {
            throw error;
        }
    },
}
