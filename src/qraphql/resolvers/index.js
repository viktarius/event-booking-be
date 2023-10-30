const userResolvers = require('./user');
const bookingResolvers = require('./booking');
const eventResolvers = require('./event');

module.exports = {
    ...userResolvers,
    ...bookingResolvers,
    ...eventResolvers
}
