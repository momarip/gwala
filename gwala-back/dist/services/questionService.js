"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const question_1 = __importDefault(require("../models/question"));
const userService_1 = __importDefault(require("./userService"));
const userService = new userService_1.default();
class QuestionService {
    async getAllQuestions() {
        return question_1.default.find(); // Assuming 'user' is the field that references the user who posted the question
    }
    async postQuestion(questionData) {
        const newQuestion = new question_1.default(questionData);
        await newQuestion.save();
        return newQuestion;
    }
    async getQuestionById(id) {
        return question_1.default.findById(id);
    }
    async getQuestionsSortedByDistance(userId) {
        // Assuming you have a method to get the user's location from the userId
        const user = await userService.getUserById(userId);
        if (!user || !user.location) {
            throw new Error('User location not found');
        }
        const userLocation = user.location; // Assuming user.location is a GeoJSON Point
        const questions = await question_1.default.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: userLocation,
                    },
                    distanceField: 'distance',
                    spherical: true,
                },
            },
            {
                $sort: {
                    distance: 1,
                },
            },
        ]);
        return questions;
    }
}
exports.default = QuestionService;
