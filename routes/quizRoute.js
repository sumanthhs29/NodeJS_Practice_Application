const express = require('express');
const quizController = require('../controller/quizController');

const router = express.Router();

router.post("",quizController.addQuiz);

router.get("/:id",quizController.getQuiz);
router.get("",quizController.getAllQuiz);

module.exports = router;