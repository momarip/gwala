import Question from '../models/question';
import UserService from './userService';

const userService = new UserService();

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

  async getQuestionsSortedByDistance(userId: string) {
    // Assuming you have a method to get the user's location from the userId
    const user = await userService.getUserById(userId);
    if (!user || !user.location) {
      throw new Error('User location not found');
    }

    const userLocation = user.location; // Assuming user.location is a GeoJSON Point

    const questions = await Question.aggregate([
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

export default QuestionService;
