"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = __importDefault(require("../../services/userService"));
const questionService_1 = __importDefault(require("../../services/questionService"));
const answerService_1 = __importDefault(require("../../services/answerService"));
const userService = new userService_1.default();
const questionService = new questionService_1.default();
const answerService = new answerService_1.default();
const userResolvers = {
    Query: {
        getAllUsers: userService.getAllUsers,
        getUserById: userService.getUserById,
    },
    Mutation: {
        signUp: async (_, { name, email, password }) => {
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const newUser = await userService.createUser({
                name,
                email,
                password: hashedPassword,
            });
            const accessToken = userService.generateAccessToken(newUser._id);
            const refreshToken = userService.generateRefreshToken(newUser._id);
            return { accessToken, refreshToken, user: newUser };
        },
        signIn: async (_, { email, password }) => {
            const user = await userService.getUserByEmail(email);
            if (!user) {
                throw new Error("User not found");
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid password");
            }
            const accessToken = userService.generateAccessToken(user._id);
            const refreshToken = userService.generateRefreshToken(user._id);
            console.log("Sign in successful. Returning tokens and user.");
            return { accessToken, refreshToken, user };
        },
        requestPasswordReset: async (_, { email }) => {
            const user = await userService.getUserByEmail(email);
            if (!user) {
                throw new Error("User not found");
            }
            const resetToken = await userService.createResetToken(user._id);
            return true;
        },
        resetPassword: async (_, { token, newPassword }) => {
            const userId = await userService.verifyResetToken(token);
            if (!userId) {
                throw new Error("Invalid or expired reset token");
            }
            const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
            await userService.updateUserPassword(userId, hashedPassword);
            const newToken = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || "secret-key");
            return { token: newToken, user: { _id: userId, name: "", email: "" } };
        },
        postQuestion: async (_, { title, content, location, userId }, context) => {
            try {
                // Check if the user is authenticated
                if (!context.req ||
                    !context.req.headers ||
                    !context.req.headers.authorization) {
                    // Handle the case when the access token is not provided
                    throw new Error("Access token is required to post a question");
                }
                // Extract the access token from the Authorization header
                const accessToken = context.req.headers.authorization.replace("Bearer ", "");
                // Validate the access token or take appropriate action if the token is invalid
                const decodedToken = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || "access-secret-key");
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
                console.error("Error in postQuestion resolver:", error);
                throw new Error("Failed to post a question");
            }
        },
        // answerQuestion: async (
        //   _: any,
        //   { questionId, content }: any,
        //   context: any
        // ) => {
        //   try {
        //     // Check authentication, extract token, and validate
        //     if (
        //       !context.req ||
        //       !context.req.headers ||
        //       !context.req.headers.authorization
        //     ) {
        //       throw new Error("Access token is required to answer a question");
        //     }
        //     const accessToken = context.req.headers.authorization.replace(
        //       "Bearer ",
        //       ""
        //     );
        //     const decodedToken: any = jwt.verify(
        //       accessToken,
        //       process.env.ACCESS_TOKEN_SECRET || "access-secret-key"
        //     );
        //     const authenticatedUserId = decodedToken.userId;
        //     // Fetch the question to ensure it exists and get additional details
        //     const question: any = await questionService.getQuestionById(questionId);
        //     if (!question) {
        //       throw new Error("Question not found");
        //     }
        //     // Ensure the authenticated user is not the same as the user who posted the question
        //     if (question.user.toString() === authenticatedUserId) {
        //       throw new Error("Cannot answer your own question");
        //     }
        //     // Create a new answer associated with the question
        //     const newAnswer = await answerService.createAnswer({
        //       question: questionId,
        //       content,
        //       user: authenticatedUserId,
        //     });
        //     return newAnswer;
        //   } catch (error) {
        //     // Handle errors
        //     console.error("Error in answerQuestion resolver:", error);
        //     throw new Error("Failed to answer the question");
        //   }
        // },
    },
};
exports.default = userResolvers;
