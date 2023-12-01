"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const userResolvers_1 = __importDefault(require("./graphql/resolvers/userResolvers"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
mongoose_1.default
    .connect('mongodb://localhost:27017/gwala', {
// useNewUrlParser: true,
// useUnifiedTopology: true,
})
    .then(() => {
    console.log('Connected to the Database.');
    // Call the function to setup Apollo Server after the database connection is established
    setupApolloServer();
})
    .catch(err => console.error(err));
// Use an async function to read the schema file asynchronously
const loadSchema = async () => {
    try {
        const schemaPath = path_1.default.join(__dirname, './graphql/schemas/userSchema.graphql');
        const typeDefs = await promises_1.default.readFile(schemaPath, 'utf-8');
        return typeDefs;
    }
    catch (error) {
        console.error('Error reading schema file:', error);
        throw error;
    }
};
// Apollo Server setup
const setupApolloServer = async () => {
    const typeDefs = await loadSchema();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        typeDefs,
        resolvers: userResolvers_1.default,
        context: ({ req }) => {
            // You can include authentication logic here if needed
            return { /* your context data */};
        },
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });
};
exports.default = app;
