const User = require('../../mongoose/models/user');
const Event = require('../../mongoose/models/event');

const { transformEvent } = require('./helpers/transform');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(transformEvent);
        } catch (error) {
            throw error;
        }
    },
    createEvent: async ({ body }, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
        try {
            const { title, description, price, date } = body;
            const event = new Event({
                title,
                description,
                price,
                date: new Date(date),
                creator: req.userId
            })
            const createdEvent = await event.save();
            const creator = await User.findById(req.userId);
            if (!creator) {
                throw new Error('User not exists');
            }
            creator.createdEvents.push(createdEvent);
            await creator.save();
            return transformEvent(createdEvent)
        } catch (error) {
            throw error;
        }
    },
}
