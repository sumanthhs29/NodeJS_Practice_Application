const quizModel = require("../model/quizModel");

// Function to add Quiz
exports.addQuiz = async (req, res) => {
  const quiz = new quizModel(req.body);
  try {
    await quiz.save();
    res.status(200).json({
      status: "Success",
      data: { quiz },
    });
  } catch (e) {
    res.status(400).send(e);
  }
};

//Function to get Quiz
exports.getQuiz = async (req, res) => {
  const _id = req.params.id;
  try {
    const quiz = await quizModel.findOne({ storyId: _id });
    if (!quiz) {
      return res.status(500).send();
    }
    res.status(200).json({
      status: "Success",
      data: { quiz },
    });
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.getAllQuiz = async (req, res) => {
  try {
    const quiz = await quizModel.find({}).populate({
      path: "storyId",
      select: "storyName imageUrl _id",
    });
    return res.status(200).json({
      status: "Success",
      data: { quiz },
    });
  } catch (e) {
    return res.status(400).send(e);
  }
};
