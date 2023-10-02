const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
const port = 3000;

const events = [];

app.use(bodyParser.json());
app.use('/graphql', graphqlHTTP({
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
        events: () => {
            return events;
        },
        createEvent: ({ body }) => {
            const { title, description, price, date } = body;
            const event = {
                _id: Math.random().toString(),
                title,
                description,
                price,
                date
            }
            events.push(event);
            return event;
        }
    },
    graphiql: true
}));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
