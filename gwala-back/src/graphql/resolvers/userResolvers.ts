import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserService from '../../services/userService';
import QuestionService from '../../services/questionService';

const userService = new UserService();
const questionService = new QuestionService();


const userResolvers = {
  Query: {
    getAllUsers: userService.getAllUsers,
    getUserById: userService.getUserById,
  },
  Mutation: {
    signUp: async (_: any, { name, email, password }: any) => {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await userService.createUser({
        name,
        email,
        password: hashedPassword,
      });

      const accessToken = userService.generateAccessToken(newUser._id);
      const refreshToken = userService.generateRefreshToken(newUser._id);

      return { accessToken, refreshToken, user: newUser };
    },
    signIn: async (_: any, { email, password }: any) => {
      const user = await userService.getUserByEmail(email);

      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      const accessToken = userService.generateAccessToken(user._id);
      const refreshToken = userService.generateRefreshToken(user._id);

      console.log('Sign in successful. Returning tokens and user.');
      return { accessToken, refreshToken, user };
    },

    requestPasswordReset: async (_: any, { email }: any) => {
      const user = await userService.getUserByEmail(email);

      if (!user) {
        throw new Error('User not found');
      }

      const resetToken = await userService.createResetToken(user._id);

      return true;
    },

    resetPassword: async (_: any, { token, newPassword }: any) => {
      const userId = await userService.verifyResetToken(token);

      if (!userId) {
        throw new Error('Invalid or expired reset token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userService.updateUserPassword(userId, hashedPassword);

      const newToken = jwt.sign({ userId }, process.env.JWT_SECRET || 'secret-key');

      return { token: newToken, user: { _id: userId, name: '', email: '' } };
    },

    postQuestion: async (_: any, { title, content, location, userId }: any, context: any) => {
          try {
            // Check if the user is authenticated
            if (!context.req || !context.req.headers || !context.req.headers.authorization) {
              // Handle the case when the access token is not provided
              throw new Error('Access token is required to post a question');
            }
    
            // Extract the access token from the Authorization header
            const accessToken = context.req.headers.authorization.replace('Bearer ', '');
    
            // Validate the access token or take appropriate action if the token is invalid
            const decodedToken: any = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || 'access-secret-key');
            const authenticatedUserId = decodedToken.userId;
    
            // Create a new question with user information
            const newQuestion = await questionService.postQuestion({
              title,
              content,
              location,
              user: authenticatedUserId,
            });
    
            return newQuestion;
          } catch (error) {
            // Handle token verification error or other errors
            console.error('Error in postQuestion resolver:', error);
            throw new Error('Failed to post a question');
          }
        },
  }
};

export default userResolvers;
