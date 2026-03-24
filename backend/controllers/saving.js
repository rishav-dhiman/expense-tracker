const Saving = require('../models/Saving');
const zod = require('zod');

async function addSaving(req, res) {
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
    const saving = new Saving({
      title,
      amount,
      category,
      description,
      date,
      user: req.user.id
    });

    await saving.save();
    res.status(200).json({ success: true, data: saving });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
}

async function getSavings(req, res) {
  try {
    const savings = await Saving.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: savings });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
}

async function deleteSaving(req, res) {
  try {
    const saving = await Saving.findById(req.params.id);

    if (!saving) {
      return res.status(404).json({ success: false, error: 'Saving not found' });
    }

    if (saving.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this saving' });
    }

    await saving.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
}

module.exports = {
  addSaving,
  getSavings,
  deleteSaving
};
