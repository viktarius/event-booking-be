const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./src/schemas/event.schema');
const User = require('./src/schemas/user.schema');

const server = express();
const port = 3000;

server.use(bodyParser.json());
server.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        type User {
            _id: ID!
            email: String!
            password: String
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input UserInput {
            email: String!
            password: String!
        }
        
        type RootQuery {
            events: [Event!]!
            users: [User!]!
        }
        
        type RootMutation {
            createEvent(body: EventInput): Event
            createUser(body: UserInput): User
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: async () => {
            try {
                const events = await Event.find()
                return events.map(event => ({ ...event._doc, _id: event.id }));
            } catch (error) {
                throw error;
            }
        },
        users: async () => {
            try {
                const users = await User.find();
                return users.map(user => ({ ...user._doc, _id: user.id, password: null }));
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
                    creator: '6534172a4ce7479994f80f68'
                })
                const createdEvent = await event.save();
                const user = await User.findById('6534172a4ce7479994f80f68');
                if (!user) {
                    throw new Error('User not exists');
                }
                user.createdEvents.push(createdEvent);
                await user.save();
                return { ...createdEvent._doc, _id: createdEvent._doc._id.toString() }
            } catch (error) {
                throw error;
            }
        },
        createUser: async ({ body }) => {
            const { email, password } = body;
            try {
                const user = await User.findOne({ email });
                if (user) {
                    throw new Error('User already exists.');
                }
                const hashedPassword = await bcrypt.hash(password, 12);
                const newUser = new User({
                    email,
                    hashedPassword,
                })

                const savedUser = await newUser.save();
                return {
                    ...savedUser._doc,
                    _id: savedUser._doc._id.toString(),
                    password: null
                }
            } catch (error) {
                throw error;
            }
        }
    },
    graphiql: true
}));

const connectionString = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@event-booking.d0yyzf5.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
mongoose.connect(connectionString).then(() => {
    server.listen(port, () => {
        console.log(`App listening on port ${port}`)
    });
}).catch(err => {
    console.error(err)
})
