const Event = require('../../../mongoose/models/event');
const User = require('../../../mongoose/models/user');

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        events.map(transformEvent);
        return events;
    } catch (err) {
        throw err;
    }
};

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
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

const transformEvent = event => ({
    ...event._doc,
    _id: event.id,
    creator: user.bind(this, event.creator)
})

const transformBooking = booking => ({
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking.user),
    event: singleEvent.bind(this, booking.event)
})


exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;