import Question from '../models/question';

class QuestionService {
  async getAllQuestions() {
    return Question.find(); // Assuming 'user' is the field that references the user who posted the question
  }

  async postQuestion(questionData:any) {
    const newQuestion = new Question(questionData);
    await newQuestion.save();
    return newQuestion;
  }

  async getQuestionById(id: string) {
    return Question.findById(id);
  }
}

export default QuestionService;
