const mongoose = require("mongoose");

const quizSchema = mongoose.Schema({
  questions: [
    {
      question: {
        type: String,
        required: true,
        trim: true,
      },
      options: {
        type: Object,
        required: true,
        trim: true,
        option1: { type: String, trim: true },
        option2: { type: String, trim: true },
        option3: { type: String, trim: true },
        option4: { type: String, trim: true },
      },
      correctAnswer: {
        type: String,
        trim: true,
      },
    },
  ],
  storyId: {
    type: mongoose.Schema.ObjectId,
    ref: "stories",
  },
});

module.exports = mongoose.model("quiz", quizSchema);
