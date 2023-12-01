"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
class UserService {
    async getAllUsers() {
        return user_1.default.find();
    }
    async getUserById(id) {
        return user_1.default.findById(id);
    }
    async createUser(userData) {
        const newUser = new user_1.default(userData);
        await newUser.save();
        return newUser;
    }
    async updateUser(id, userData) {
        const user = await user_1.default.findByIdAndUpdate(id, userData, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async deleteUser(id) {
        const user = await user_1.default.findByIdAndDelete(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async getUserByEmail(email) {
        return user_1.default.findOne({ email });
    }
    async signUp(name, email, password) {
        // Hash the password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create a new user
        const newUser = await this.createUser({
            name,
            email,
            password: hashedPassword,
        });
        // Create a JWT token
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'secret-key');
        return { token, user: newUser };
    }
    async signIn(email, password) {
        // Find the user by email
        const user = await this.getUserByEmail(email);
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
    }
}
exports.default = UserService;
