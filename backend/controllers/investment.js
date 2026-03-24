const Investment = require('../models/Investment');
const zod = require('zod');

async function addInvestment(req, res) {
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
    const investment = new Investment({
      title,
      amount,
      category,
      description,
      date,
      user: req.user.id
    });

    await investment.save();
    res.status(200).json({ success: true, data: investment });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
}

async function getInvestments(req, res) {
  try {
    const investments = await Investment.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: investments });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
}

async function deleteInvestment(req, res) {
  try {
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({ success: false, error: 'Investment not found' });
    }

    if (investment.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this investment' });
    }

    await investment.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
}

module.exports = {
  addInvestment,
  getInvestments,
  deleteInvestment
};
