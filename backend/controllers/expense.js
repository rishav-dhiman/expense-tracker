const Expense = require('../models/Expense');
const zod = require('zod');

async function addExpense(req, res) {
  const schema = zod.object({
    title: zod.string().min(1, "Title is required").max(50, "Title is too long"),
    amount: zod.number().positive("Amount must be a positive number"),
    category: zod.string().min(1, "Category is required"),
    description: zod.string().min(1, "Description is required").max(100, "Description is too long"),
    date: zod.string().or(zod.date()).refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
  });

  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Incorrect data format",
      error: result.error
    });
  }

  const { title, amount, category, description, date } = req.body;

  try {
    const expense = new Expense({
      title,
      amount,
      category,
      description,
      date,
      user: req.user.id
    });

    await expense.save();
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
}

async function getExpenses(req, res) {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
}

async function deleteExpense(req, res) {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this expense' });
    }

    await expense.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
}

module.exports = {
  addExpense,
  getExpenses,
  deleteExpense
};
