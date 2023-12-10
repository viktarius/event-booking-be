const bookingResolvers = require('./booking');
const eventResolvers = require('./event');

module.exports = {
    ...bookingResolvers,
    ...eventResolvers
}
