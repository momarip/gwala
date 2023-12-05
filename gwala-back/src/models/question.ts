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
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming your User model is named 'User'
      required: false,
    },
  });
  
const Question = model('Question', questionSchema);

export default Question;
