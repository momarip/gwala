import { readFileSync } from "fs";
import path from "path";
import userResolvers from "./resolvers/userResolvers";

const userTypes = readFileSync(
  path.join(__dirname, "./schemas/userSchema.graphql"),
  { encoding: "utf-8" }
);
const questionTypes = readFileSync(
  path.join(__dirname, "./schemas/questionSchema.graphql"),
  { encoding: "utf-8" }
);

export const typeDefs = `
    ${userTypes}
    ${questionTypes}
`;

export const resolvers = {
    Query: {
        ...userResolvers.Query,
    },
    Mutation : {
        ...userResolvers.Mutation,
    }
}