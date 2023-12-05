"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./graphql/resolvers/index"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
mongoose_1.default
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
        const userSchemaPath = path_1.default.join(__dirname, './graphql/schemas/userSchema.graphql');
        const questionSchemaPath = path_1.default.join(__dirname, './graphql/schemas/questionSchema.graphql');
        const userTypeDefs = await promises_1.default.readFile(userSchemaPath, 'utf-8');
        const questionTypeDefs = await promises_1.default.readFile(questionSchemaPath, 'utf-8');
        return [userTypeDefs, questionTypeDefs];
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
        resolvers: index_1.default,
        context: ({ req }) => {
            return { req };
        },
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });
};
exports.default = app;
