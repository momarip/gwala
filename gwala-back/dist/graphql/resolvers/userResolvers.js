"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = __importDefault(require("../../services/userService"));
const questionService_1 = __importDefault(require("../../services/questionService"));
const userService = new userService_1.default();
const questionService = new questionService_1.default();
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
                throw new Error('User not found');
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            const accessToken = userService.generateAccessToken(user._id);
            const refreshToken = userService.generateRefreshToken(user._id);
            console.log('Sign in successful. Returning tokens and user.');
            return { accessToken, refreshToken, user };
        },
        requestPasswordReset: async (_, { email }) => {
            const user = await userService.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
            const resetToken = await userService.createResetToken(user._id);
            return true;
        },
        resetPassword: async (_, { token, newPassword }) => {
            const userId = await userService.verifyResetToken(token);
            if (!userId) {
                throw new Error('Invalid or expired reset token');
            }
            const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
            await userService.updateUserPassword(userId, hashedPassword);
            const newToken = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || 'secret-key');
            return { token: newToken, user: { _id: userId, name: '', email: '' } };
        },
    }
};
exports.default = userResolvers;
