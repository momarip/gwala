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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const typeDefs = fs_1.default.readFileSync(path_1.default.join(__dirname, './graphql/schemas/userSchema.graphql'), 'utf-8');
dotenv_1.default.config();
const app = (0, express_1.default)();
mongoose_1.default
    .connect('mongodb://localhost:27017/gwala', {
// useNewUrlParser: true,
// useUnifiedTopology: true,
})
    .then(() => {
    console.log('Connected to the Database.');
})
    .catch(err => console.error(err));
// Apollo Server setup
const apolloServer = new apollo_server_express_1.ApolloServer({
    typeDefs,
    resolvers: userResolvers_1.default,
    context: ({ req }) => {
        // You can include authentication logic here if needed
        return { /* your context data */};
    },
});
apolloServer.applyMiddleware({ app, path: '/graphql' });
exports.default = app;
