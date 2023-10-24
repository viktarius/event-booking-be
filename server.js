const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphQlResolvers = require('./src/qraphql/resolvers/index');
const graphQlSchema = require('./src/qraphql/schemas/index');

const server = express();
const port = 3000;

server.use(bodyParser.json());
server.use('/graphql', graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
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
