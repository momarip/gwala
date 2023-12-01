import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import resolvers from './graphql/resolvers/userResolvers';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const app = express();

mongoose
  .connect('mongodb://localhost:27017/gwala', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the Database.');
    setupApolloServer();
  })
  .catch(err => console.error(err));

const loadSchema = async () => {
  try {
    const schemaPath = path.join(__dirname, './graphql/schemas/userSchema.graphql');
    const typeDefs = await fs.readFile(schemaPath, 'utf-8');
    return typeDefs;
  } catch (error) {
    console.error('Error reading schema file:', error);
    throw error;
  }
};

// Apollo Server setup
const setupApolloServer = async () => {
  const typeDefs = await loadSchema();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // You can include authentication logic here if needed
      return { /* your context data */ };
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });
};

export default app;
