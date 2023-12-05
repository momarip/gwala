"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const answer_1 = __importDefault(require("../models/answer"));
class AnswerService {
    async createAnswer(answerData) {
        const newAnswer = new answer_1.default(answerData);
        await newAnswer.save();
        return newAnswer;
    }
    async getAnswerById(answerId) {
        return answer_1.default.findById(answerId);
    }
    async getAllAnswersForQuestion(questionId) {
        return answer_1.default.find({ question: questionId });
    }
}
exports.default = AnswerService;
