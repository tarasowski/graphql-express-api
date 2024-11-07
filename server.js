import express from "express"
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { updateUser, deleteUser, createUser, initializeDatabase, getUsers, getUser } from './db/database.js'

const PORT = 3000

const db = await initializeDatabase()


const typeDefs = `
  type User {
    userId: Int
    firstName: String
    lastName: String
    role: String
  }

  type Mutation {
   createUser(firstName: String!, lastName: String!, role: String!): User
   updateUser(userId: Int!, firstName: String, lastName: String, role: String): User
   deleteUser(userId: Int!): String
  }

  type Query {
    hello: String # das ist unsere query for the hello world
    randomNumber: Int # das ist unsere query for the random number
    getUsers: [User] # das ist unsere query for the users
    getUser(userId: Int!): User # das ist unsere query for the
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => 'world',
    randomNumber: () => Math.floor(Math.random() * 100),
    getUsers: async () => {
      return await getUsers(db)
    },
    getUser: async (parent, args) => {
      return await getUser(db, args.userId)
    },
  },
  Mutation: {
    createUser: async (parent, args) => {
      return await createUser(db, args)
    },
    updateUser: async (parent, args) => {
      return await updateUser(db, args)
    },
    deleteUser: async (parent, args) => {
      return await deleteUser(db, args.userId)
    }
  }
};


const app = express();
const httpServer = http.createServer(app)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  cors(),
  bodyParser.json(),
  expressMiddleware(server),
);

await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
console.log(`🚀 Server ready at http://localhost:${PORT}`);

