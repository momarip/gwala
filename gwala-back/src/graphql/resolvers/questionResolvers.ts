import QuestionService from '../../services/questionService';
import jwt from 'jsonwebtoken';

const questionService = new QuestionService();

const questionResolvers = {
  Query: {
    getAllQuestions: questionService.getAllQuestions,
  },
  // Mutation: {
  //   postQuestion: async (_: any, { title, content, location, userId }: any, context: any) => {
  //     try {
  //       // Check if the user is authenticated
  //       if (!context.req || !context.req.headers || !context.req.headers.authorization) {
  //         // Handle the case when the access token is not provided
  //         throw new Error('Access token is required to post a question');
  //       }

  //       // Extract the access token from the Authorization header
  //       const accessToken = context.req.headers.authorization.replace('Bearer ', '');

  //       // Validate the access token or take appropriate action if the token is invalid
  //       const decodedToken: any = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || 'access-secret-key');
  //       const authenticatedUserId = decodedToken.userId;

  //       // Create a new question with user information
  //       const newQuestion = await questionService.postQuestion({
  //         title,
  //         content,
  //         location,
  //         user: authenticatedUserId,
  //       });

  //       return newQuestion;
  //     } catch (error) {
  //       // Handle token verification error or other errors
  //       console.error('Error in postQuestion resolver:', error);
  //       throw new Error('Failed to post a question');
  //     }
  //   },
  // },
};

export default questionResolvers;
