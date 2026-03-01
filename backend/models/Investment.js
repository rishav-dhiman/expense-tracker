const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxLength: 50
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    maxLength: 20,
    trim: true
  },
  type: {
    type: String,
    default: "investment"
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxLength: 100,
    trim: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Investment', InvestmentSchema);
