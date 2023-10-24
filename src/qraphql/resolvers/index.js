const Event = require("../../mongoose/models/event");
const User = require("../../mongoose/models/user");
const bcrypt = require("bcryptjs");
const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };
        });
        return events;
    } catch (err) {
        throw err;
    }
};

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents),
        };
    } catch (err) {
        throw err;
    }
};

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => ({
                ...event._doc,
                _id: event.id,
                creator: user.bind(this, event._doc.creator)
            }));
        } catch (error) {
            throw error;
        }
    },
    createEvent: async ({ body }) => {
        try {
            const { title, description, price, date } = body;
            const event = new Event({
                title,
                description,
                price,
                date: new Date(date),
                creator: '6534172a4ce7479994f80f68'
            })
            const createdEvent = await event.save();
            const creator = await User.findById('6534172a4ce7479994f80f68');
            if (!creator) {
                throw new Error('User not exists');
            }
            creator.createdEvents.push(createdEvent);
            await creator.save();
            return {
                ...createdEvent._doc,
                _id: createdEvent._doc._id.toString(),
                creator: creator.bind(this, createdEvent._doc.creator)
            }
        } catch (error) {
            throw error;
        }
    },
    users: async () => {
        try {
            const users = await User.find();
            return users.map(user => ({
                ...user._doc,
                _id: user.id,
                password: null,
                createdEvents: events.bind(this, user._doc.createdEvents)
            }));
        } catch (error) {
            throw error;
        }
    },
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
                hashedPassword,
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
    }
}
