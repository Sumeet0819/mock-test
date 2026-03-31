const jwt = require('jsonwebtoken');
const Test = require('../models/Test');
const UserAttempt = require('../models/UserAttempt');

// POST /auth/user  — register user by name, return JWT
const registerUser = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    }
    const token = jwt.sign(
      { name: name.trim(), role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, name: name.trim() });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /test/all  — get all tests (title + id only, for landing page)
const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({}, 'title duration createdAt').lean();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /test/:id  — get test WITHOUT correctAnswer
const getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).lean();
    if (!test) return res.status(404).json({ message: 'Test not found' });

    // Strip correct answers before sending to client
    const safeTest = {
      _id: test._id,
      title: test.title,
      duration: test.duration,
      questions: test.questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options,
      })),
    };
    res.json(safeTest);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /test/submit  — evaluate answers, save attempt, return result
const submitTest = async (req, res) => {
  try {
    const { testId, answers, name, token } = req.body;
    if (!testId || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'testId and answers[] required' });
    }

    const test = await Test.findById(testId).lean();
    if (!test) return res.status(404).json({ message: 'Test not found' });

    let score = 0;
    const breakdown = test.questions.map((q, i) => {
      const userAnswer = answers[i] || '';
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) score++;
      return {
        question: q.question,
        options: q.options,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
      };
    });

    // Save attempt if name and token provided
    if (name && token) {
      const attempt = new UserAttempt({
        name,
        token,
        testId,
        answers,
        score,
      });
      await attempt.save();
    }

    res.json({
      score,
      total: test.questions.length,
      percentage: Math.round((score / test.questions.length) * 100),
      breakdown,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { registerUser, getAllTests, getTest, submitTest };
