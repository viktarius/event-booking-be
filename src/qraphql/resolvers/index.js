const authResolvers = require('./auth');
const bookingResolvers = require('./booking');
const eventResolvers = require('./event');

module.exports = {
    ...authResolvers,
    ...bookingResolvers,
    ...eventResolvers
}
