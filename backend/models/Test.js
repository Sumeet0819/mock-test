const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
});

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number, required: true }, // minutes
  questions: { type: [questionSchema], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Test', testSchema);
