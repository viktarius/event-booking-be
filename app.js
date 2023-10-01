const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
const port = 3000;

const plans = ['Watch Course', 'Practice'];

app.use(bodyParser.json());
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }
        type RootMutation {
            createEvent(name: String): String
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return plans;
        },
        createEvent: (args) => {
            const eventName = args.name;
            plans.push(eventName);
            return eventName;
        }
    },
    graphiql: true
}));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
