import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import resolvers from './graphql/resolvers/index';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT;

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
    const userSchemaPath = path.join(__dirname, './graphql/schemas/userSchema.graphql');
    const questionSchemaPath = path.join(__dirname, './graphql/schemas/questionSchema.graphql');

    const userTypeDefs = await fs.readFile(userSchemaPath, 'utf-8');
    const questionTypeDefs = await fs.readFile(questionSchemaPath, 'utf-8');

    return [userTypeDefs, questionTypeDefs];
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
      return { req };
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });
};

export default app;
