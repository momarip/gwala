"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
class UserService {
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return user_1.default.find();
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_1.default.findById(id);
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new user_1.default(userData);
            yield newUser.save();
            return newUser;
        });
    }
    updateUser(id, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findByIdAndUpdate(id, userData, { new: true });
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findByIdAndDelete(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_1.default.findOne({ email });
        });
    }
    signUp(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Hash the password
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            // Create a new user
            const newUser = yield this.createUser({
                name,
                email,
                password: hashedPassword,
            });
            // Create a JWT token
            const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'secret-key');
            return { token, user: newUser };
        });
    }
    signIn(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the user by email
            const user = yield this.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
            // Check if the provided password is correct
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            // Create a JWT token
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret-key');
            return { token, user };
        });
    }
}
exports.default = UserService;
