import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  resetToken: any;
  location: [number, number];
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
    required: false,
  },
  location: {
    type: [Number], // Array of [latitude, longitude]
    required: true,
    index: '2dsphere', // Add 2dsphere index for spatial queries
  },
});

const User = model<IUser>('User', userSchema);

export default User;
