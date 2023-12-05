import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/user';
import { v4 as uuidv4 } from 'uuid';

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
    const user = await User.findOne({ email });
    return user;
  }

  generateAccessToken(userId: string): string {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'access-secret-key';
    const options: SignOptions = { expiresIn: '15m' };
    return jwt.sign({ userId }, accessTokenSecret, options);
  }

  generateRefreshToken(userId: string): string {
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key';
    const options: SignOptions = { expiresIn: '7d' };
    return jwt.sign({ userId }, refreshTokenSecret, options);
  }

  async signUp(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.createUser({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = this.generateAccessToken(newUser._id);
    const refreshToken = this.generateRefreshToken(newUser._id);

    return { accessToken, refreshToken, user: newUser };
  }

  async signIn(email: string, password: string) {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    return { accessToken, refreshToken, user };
  }


  async createResetToken(userId: string) {
    const resetToken = jwt.sign({ userId }, process.env.RESET_TOKEN_SECRET || 'reset-secret-key', {
      expiresIn: '1h',
    });

    const user = await User.findById(userId);
    if (user) {
      user.resetToken = resetToken;
      await user.save();
    }

    return resetToken;
  }

  async verifyResetToken(token: string) {
    try {
      const decodedToken: any = jwt.verify(token, process.env.RESET_TOKEN_SECRET || 'reset-secret-key');

      return decodedToken.userId;
    } catch (error) {
      return null; 
    }
  }

  async updateUserPassword(userId: string, newPassword: string) {
    const user = await User.findByIdAndUpdate(userId, { password: newPassword }, { new: true });
    if (!user) {
      throw new Error('User not found');
    }
  }
}

export default UserService;
