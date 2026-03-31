const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Test = require('../models/Test');

// POST /admin/login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await admin.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /admin/test
const uploadTest = async (req, res) => {
  try {
    const { title, duration, questions } = req.body;
    if (!title || !duration || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Invalid test data. Required: title, duration, questions[]' });
    }
    // Validate each question
    for (const q of questions) {
      if (!q.question || !Array.isArray(q.options) || q.options.length < 2 || !q.correctAnswer) {
        return res.status(400).json({ message: 'Each question needs: question, options[], correctAnswer' });
      }
    }
    const test = new Test({ title, duration, questions });
    await test.save();
    res.status(201).json({ message: 'Test uploaded successfully', testId: test._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /admin/tests
const getTests = async (req, res) => {
  try {
    const tests = await Test.find({}, 'title duration createdAt questions').lean();
    const result = tests.map(t => ({
      _id: t._id,
      title: t.title,
      duration: t.duration,
      questionCount: t.questions.length,
      createdAt: t.createdAt,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /admin/test/:id
const deleteTest = async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.json({ message: 'Test deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { loginAdmin, uploadTest, getTests, deleteTest };
