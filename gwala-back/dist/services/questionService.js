"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const question_1 = __importDefault(require("../models/question"));
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
}
exports.default = QuestionService;
