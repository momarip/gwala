import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

class UserService {
  async getAllUsers() {
    return User.find();
  }

  async getUserById(id: string) {
    return User.findById(id);
  }

  async createUser(userData: { name: string; email: string; password: string }) {
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  }

  async updateUser(id: string, userData: { name?: string; email?: string }) {
    const user = await User.findByIdAndUpdate(id, userData, { new: true });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async deleteUser(id: string) {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string) {
    return User.findOne({ email });
  }

  async signUp(name: string, email: string, password: string) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await this.createUser({
      name,
      email,
      password: hashedPassword,
    });

    // Create a JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'secret-key');

    return { token, user: newUser };
  }

  async signIn(email: string, password: string) {
    // Find the user by email
    const user = await this.getUserByEmail(email);

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
  }
}

export default UserService;
