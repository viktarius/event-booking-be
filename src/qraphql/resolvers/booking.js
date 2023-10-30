const Event = require('../../mongoose/models/event');
const Booking = require('../../mongoose/models/booking');

const { transformBooking, transformEvent } = require('./helpers/transform');
const { MAIN_USER } = require('./helpers/consts');

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(transformBooking);
        } catch (err) {
            throw err;
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
            return transformBooking(result);
        } catch (err) {
            throw err;
        }
    },
    cancelBooking: async ({ bookingId }) => {
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
