"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userResolvers_1 = __importDefault(require("./userResolvers"));
const questionResolvers_1 = __importDefault(require("./questionResolvers"));
const resolvers = {
    ...userResolvers_1.default,
    ...questionResolvers_1.default,
    // ... add other resolvers if you have more files
};
exports.default = resolvers;
