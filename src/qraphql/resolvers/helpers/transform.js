const DataLoader = require('dataloader')

const Event = require('../../../mongoose/models/event');
const User = require('../../../mongoose/models/user');

const eventLoader = new DataLoader((eventIds) => events(eventIds))

const userLoader = new DataLoader((userIds) => User.find({ _id: { $in: userIds } }))

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(transformEvent);
    } catch (err) {
        throw err;
    }
};

const singleEvent = async eventId => {
    try {
        return await eventLoader.load(eventId.toString());
    } catch (err) {
        throw err;
    }
}

const user = async userId => {
    try {
        const user = await userLoader.load(userId.toString());
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
        };
    } catch (err) {
        throw err;
    }
};

const transformEvent = event => ({
    ...event._doc,
    _id: event.id,
    creator: () => user(event.creator)
})

const transformBooking = booking => ({
    ...booking._doc,
    _id: booking.id,
    user: () => user(booking.user),
    event: () => singleEvent(booking.event)
})


exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
