const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const isAuth = require('./src/middleware/is-auth');

const graphQlResolvers = require('./src/qraphql/resolvers/index');
const graphQlSchema = require('./src/qraphql/schemas/index');

const authRoute = require('./src/authorization/auth');
const loginRoute = require('./src/authorization/login');
const logoutRoute = require('./src/authorization/logout');
const registerRoute = require('./src/authorization/register');

const server = express();
const port = 3000;

let corsOptions = {
    origin: 'http://localhost:4000',
    credentials: true,
}

server.use(cors(corsOptions))
server.use(cookieParser())
server.use(bodyParser.json());

server.use(isAuth);

server.use('/graphql', graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));

server.use(authRoute);
server.use(loginRoute);
server.use(logoutRoute);
server.use(registerRoute);

const connectionString = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@event-booking.d0yyzf5.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
mongoose.connect(connectionString).then(() => {
    server.listen(port, () => {
        console.log(`App listening on port ${port}`)
    });
}).catch(err => {
    console.error(err)
})
