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
        const user = await user_1.default.findOne({ email });
        return user;
    }
    generateAccessToken(userId) {
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'access-secret-key';
        const options = { expiresIn: '15m' };
        return jsonwebtoken_1.default.sign({ userId }, accessTokenSecret, options);
    }
    generateRefreshToken(userId) {
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';
        const options = { expiresIn: '7d' };
        return jsonwebtoken_1.default.sign({ userId }, refreshTokenSecret, options);
    }
    async signUp(name, email, password, location) {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await this.createUser({
            name,
            email,
            password: hashedPassword,
            location
        });
        const accessToken = this.generateAccessToken(newUser._id);
        const refreshToken = this.generateRefreshToken(newUser._id);
        return { accessToken, refreshToken, user: newUser };
    }
    async signIn(email, password) {
        const user = await this.getUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        const accessToken = this.generateAccessToken(user._id);
        const refreshToken = this.generateRefreshToken(user._id);
        return { accessToken, refreshToken, user };
    }
    async createResetToken(userId) {
        const resetToken = jsonwebtoken_1.default.sign({ userId }, process.env.RESET_TOKEN_SECRET || 'reset-secret-key', {
            expiresIn: '1h',
        });
        const user = await user_1.default.findById(userId);
        if (user) {
            user.resetToken = resetToken;
            await user.save();
        }
        return resetToken;
    }
    async verifyResetToken(token) {
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.RESET_TOKEN_SECRET || 'reset-secret-key');
            return decodedToken.userId;
        }
        catch (error) {
            return null;
        }
    }
    async updateUserPassword(userId, newPassword) {
        const user = await user_1.default.findByIdAndUpdate(userId, { password: newPassword }, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
    }
}
exports.default = UserService;
