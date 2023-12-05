import mongoose, { model } from 'mongoose';

const questionSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    location: {
      type: [Number],
      required: true,
      index: '2dsphere'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming your User model is named 'User'
      required: false,
    },
  });
  
const Question = model('Question', questionSchema);

export default Question;
