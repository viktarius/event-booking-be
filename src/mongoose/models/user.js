const { Schema, model } = require('mongoose');

const user = new Schema({
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    createdEvents: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }]
})

module.exports = model('User', user);
