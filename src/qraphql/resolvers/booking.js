const Event = require('../../mongoose/models/event');
const Booking = require('../../mongoose/models/booking');

const { transformBooking, transformEvent } = require('./helpers/transform');

module.exports = {
    bookings: async (_, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
        try {
            const { userId } = req;
            const bookings = await Booking.find({ user: userId });
            return bookings.map(transformBooking);
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async ({ eventId }, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
        try {
            const event = await Event.findById(eventId);
            const booking = new Booking({
                user: req.userId,
                event
            })

            const result = await booking.save();
            return transformBooking(result);
        } catch (err) {
            throw err;
        }
    },
    cancelBooking: async ({ bookingId }, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
        try {
            const booking = await Booking.findById(bookingId).populate('event');
            const event = transformEvent(booking.event)
            await Booking.deleteOne({ _id: bookingId });
            return event;
        } catch (err) {
            throw err;
        }
    }
}
