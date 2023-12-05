"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const userResolvers_1 = __importDefault(require("./resolvers/userResolvers"));
const userTypes = (0, fs_1.readFileSync)(path_1.default.join(__dirname, "./schemas/userSchema.graphql"), { encoding: "utf-8" });
const questionTypes = (0, fs_1.readFileSync)(path_1.default.join(__dirname, "./schemas/questionSchema.graphql"), { encoding: "utf-8" });
exports.typeDefs = `
    ${userTypes}
    ${questionTypes}
`;
exports.resolvers = {
    Query: {
        ...userResolvers_1.default.Query,
    },
    Mutation: {
        ...userResolvers_1.default.Mutation,
    }
};
