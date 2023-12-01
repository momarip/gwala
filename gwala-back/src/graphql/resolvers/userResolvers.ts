import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserService from '../../services/userService';

const userService = new UserService();

const userResolvers = {
  Query: {
    getAllUsers: userService.getAllUsers,
    getUserById: userService.getUserById,
  },
  Mutation: {
    signUp: async (_:any, { name, email, password }:any) => {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = await userService.createUser({
        name,
        email,
        password: hashedPassword,
      });

      // Create a JWT token
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'secret-key');

      return { token, user: newUser };
    },
    signIn: async (_:any, { email, password }:any) => {
      // Find the user by email
      const user = await userService.getUserByEmail(email);

      if (!user) {
        throw new Error('User not found');
      }

      // Check if the provided password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      // Create a JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret-key');

      return { token, user };
    },
  },
};

export default userResolvers;
