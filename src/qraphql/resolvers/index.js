const authResolvers = require('./auth');
const userResolvers = require('./user');
const bookingResolvers = require('./booking');
const eventResolvers = require('./event');

module.exports = {
    ...authResolvers,
    ...userResolvers,
    ...bookingResolvers,
    ...eventResolvers
}
