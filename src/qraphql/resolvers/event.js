const User = require('../../mongoose/models/user');
const Event = require('../../mongoose/models/event');

const { transformEvent } = require('./helpers/transform');
const {MAIN_USER} = require('./helpers/consts');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(transformEvent);
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
            return transformEvent(createdEvent)
        } catch (error) {
            throw error;
        }
    },
}