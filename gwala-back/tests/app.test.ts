// __tests__/app.test.ts

import request from 'supertest';
import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import app from '../src/app';
import fs from 'fs/promises';
import path from 'path';
// Import your resolvers and typeDefs based on your project structure
import resolvers from '../src/graphql/resolvers/userResolvers';
import typeDefs from '../src/graphql/userSchema.graphql';
import { it, describe, expect, beforeAll, afterAll } from '@jest/globals';

const server:any = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // You can include authentication logic here if needed
    return { /* your context data */ };
  },
});

const { query } = createTestClient(server);

beforeAll(async () => {
  // Establish a connection to the test database or setup your testing environment
  await mongoose.connect('mongodb://localhost:27017/gwala-test', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Close the database connection after all tests
  await mongoose.disconnect();
});

describe('GraphQL Integration Tests', () => {
  it('should return the expected response from a GraphQL query', async () => {
    // Write a GraphQL query that represents the test case
    const gqlQuery = `
      query {
        // Your actual GraphQL query here
        getAllUsers {
          _id
          name
          email
        }
      }
    `;

    // Use the `query` function from apollo-server-testing to send the query to the server
    const response = await query({ query: gqlQuery });

    // Add assertions based on the expected response
    expect(response.data).toBeDefined();
    expect(response.data.getAllUsers).toBeInstanceOf(Array);
    expect(response.errors).toBeUndefined();
  });

  // Add more tests as needed
});
