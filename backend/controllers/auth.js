const User = require('../models/User');
const zod = require('zod');

async function register(req, res, next) {
  const schema = zod.object({
    name: zod.string().min(2, "Name must be at least 2 characters"),
    email: zod.string().email("Invalid email address"),
    password: zod.string().min(6, "Password must be at least 6 characters")
  });
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Incorrect data format",
      error: result.error
    });
  }

  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

async function login(req, res, next) {
  const schema = zod.object({
    email: zod.string().email("Invalid email address"),
    password: zod.string().min(1, "Password is required")
  });
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Incorrect data format",
      error: result.error
    });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

const sendTokenResponse = (user, statusCode, res) => {
  const token = require('jsonwebtoken').sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
  res.status(statusCode).json({ success: true, token });
};

async function updateDetails(req, res, next) {
  const schema = zod.object({
    name: zod.string().min(2, "Name must be at least 2 characters").optional(),
    email: zod.string().email("Invalid email address").optional()
  });
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Incorrect data format",
      error: result.error
    });
  }

  try {
    const fieldsToUpdate = { name: req.body.name, email: req.body.email };
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

async function updatePassword(req, res, next) {
  const schema = zod.object({
    currentPassword: zod.string().min(1, "Current password is required"),
    newPassword: zod.string().min(6, "New password must be at least 6 characters")
  });
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Incorrect data format",
      error: result.error
    });
  }

  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({ success: false, error: 'Password is incorrect' });
    }
    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

module.exports = {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword
};
