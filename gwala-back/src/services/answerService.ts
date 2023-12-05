import Answer from '../models/answer';

class AnswerService {
  async createAnswer(answerData: { question: string; content: string; user: string }) {
    const newAnswer = new Answer(answerData);
    await newAnswer.save();
    return newAnswer;
  }

  async getAnswerById(answerId: string) {
    return Answer.findById(answerId);
  }

  async getAllAnswersForQuestion(questionId: string) {
    return Answer.find({ question: questionId });
  }

  // Add more methods as needed for your application
}

export default AnswerService;
