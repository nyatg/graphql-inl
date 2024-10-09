const { ApolloServer, gql } = require('apollo-server');

// Hårdkodad databas
let users = [
    { id: '1', name:'Roni', email: 'roni@hej.se'},
    { id: '2', name: 'Bobby', email: 'bobby@hej.se'}
];

// GraphQL schemat 
// 1. Definiera typ för hur vår data ska vara strukturerad
// 2. definiera våra query(förfrågan) som klienten använder för att hämta info
// 3. här skapar vi mutationer som används för att skapa, ändra och radera användare (C r U D)

const typeDefs = gql`
type User {
    id: ID!
    name: String!
    email: String
}

type Query {
users: [User!]!
user(id: ID!): User
}

type Mutation {
    createUser(name: String!, email: String): User
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): User
}
`;

const resolvers = {
    Query: {
        users: () => users,
        user: (_, { id }) => users.find(user => user.id === id),
    },
    Mutation: {
        createUser: (_, { name, email }) => {
            const newUser = { id: String(users.length + 1), name, email };
            users.push(newUser);
            return newUser;
        },
        updateUser: (_, { id, name, email }) => {
            const user = users.find(user => user.id === id);
            if (!user) return null;

            user.name = name || user.name;
            user.email = email || user.email;
            return user;
        },
        deleteUser: (_, { id }) => {
            const userIndex = users.findIndex(user => user.id === id);
            if (userIndex === -1) return null;

            const deleteUser = users[userIndex];
            users.splice(userIndex, 1);
            return deleteUser;
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})