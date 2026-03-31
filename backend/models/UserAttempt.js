const mongoose = require('mongoose');

const userAttemptSchema = new mongoose.Schema({
  name: { type: String, required: true },
  token: { type: String, required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  answers: { type: [String], default: [] }, // indexed by question order
  score: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserAttempt', userAttemptSchema);
