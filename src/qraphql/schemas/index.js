const { buildSchema } = require("graphql/index");
module.exports = buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: User!
        }
        
        type User {
            _id: ID!
            email: String!
            password: String
            createdEvents: [Event!]
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
    `)
