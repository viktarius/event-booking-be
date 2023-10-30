const Event = require('../../mongoose/models/event');
const User = require('../../mongoose/models/user');
const Booking = require('../../mongoose/models/booking');

const bcrypt = require('bcryptjs');

const MAIN_USER = '6534172a4ce7479994f80f68';

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

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id: event.id,
            creator: user.bind(this, event.creator)
        }
    } catch (err) {
        throw err;
    }
}

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
                creator: MAIN_USER
            })
            const createdEvent = await event.save();
            const creator = await User.findById(MAIN_USER);
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
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => ({
                ...booking._doc,
                _id: booking.id,
                user: user.bind(this, booking._doc.user),
                event: singleEvent.bind(this, booking._doc.event)
            }))
        } catch (err) {
            throw err;
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
    },
    bookEvent: async ({ eventId }) => {
        try {
            const event = await Event.findById(eventId);
            const booking = new Booking({
                user: MAIN_USER,
                event
            })

            const result = await booking.save();
            return {
                ...result._doc,
                _id: result.id,
                user: user.bind(this, booking._doc.user),
                event: singleEvent.bind(this, booking._doc.event)
            }
        } catch (err) {
            throw err;
        }
    },
    cancelEvent: async ({ bookingId }) => {
        try {
            const booking = Booking.findById(bookingId).populate('event')
            const event = {
                ...booking._doc.event,
                id: booking.event.id,
                creator: user.bind(this, booking.event._doc.creator),
            }
            await Booking.deleteOne({ _id: bookingId });
        } catch (err) {
            throw err;
        }
    }
}
