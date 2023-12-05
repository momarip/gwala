"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const questionService_1 = __importDefault(require("../../services/questionService"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const questionService = new questionService_1.default();
const questionResolvers = {
    Query: {
        getAllQuestions: questionService.getAllQuestions,
    },
    Mutation: {
        postQuestion: async (_, { title, content, location, userId }, context) => {
            try {
                // Check if the user is authenticated
                if (!context.req || !context.req.headers || !context.req.headers.authorization) {
                    // Handle the case when the access token is not provided
                    throw new Error('Access token is required to post a question');
                }
                // Extract the access token from the Authorization header
                const accessToken = context.req.headers.authorization.replace('Bearer ', '');
                // Validate the access token or take appropriate action if the token is invalid
                const decodedToken = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || 'access-secret-key');
                const authenticatedUserId = decodedToken.userId;
                // Create a new question with user information
                const newQuestion = await questionService.postQuestion({
                    title,
                    content,
                    location,
                    user: authenticatedUserId,
                });
                return newQuestion;
            }
            catch (error) {
                // Handle token verification error or other errors
                console.error('Error in postQuestion resolver:', error);
                throw new Error('Failed to post a question');
            }
        },
    },
};
exports.default = questionResolvers;
