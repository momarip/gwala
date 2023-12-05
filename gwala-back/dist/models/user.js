"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetToken: {
        type: String,
        required: false,
    },
    location: {
        type: [Number], // Array of [latitude, longitude]
        required: false,
        index: '2dsphere', // Add 2dsphere index for spatial queries
    },
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
