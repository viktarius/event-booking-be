const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require("mongoose");

const Event = require("./src/schemas/event.schema");

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
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        type RootQuery {
            events: [Event!]!
        }
        
        type RootMutation {
            createEvent(body: EventInput): Event
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
        createEvent: ({ body }) => {
            const { title, description, price, date } = body;
            const event = new Event({
                title,
                description,
                price,
                date: new Date(date)
            })
            return event.save().then(res => {
                return { ...res._doc, _id: event._doc._id.toString() }
            }).catch(err => {
                throw err;
            });
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
