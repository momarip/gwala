"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = __importDefault(require("../../services/userService"));
const userService = new userService_1.default();
const userResolvers = {
    Query: {
        getAllUsers: userService.getAllUsers,
        getUserById: userService.getUserById,
    },
    Mutation: {
        signUp: async (_, { name, email, password }) => {
            // Hash the password
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            // Create a new user
            const newUser = await userService.createUser({
                name,
                email,
                password: hashedPassword,
            });
            // Create a JWT token
            const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'secret-key');
            return { token, user: newUser };
        },
        signIn: async (_, { email, password }) => {
            // Find the user by email
            const user = await userService.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
            // Check if the provided password is correct
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            // Create a JWT token
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret-key');
            return { token, user };
        },
    },
};
exports.default = userResolvers;
