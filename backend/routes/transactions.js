const express = require('express');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const { addExpense, getExpenses, deleteExpense } = require('../controllers/expense');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/incomes')
    .post(protect, addIncome)
    .get(protect, getIncomes);

router.route('/incomes/:id')
    .delete(protect, deleteIncome);

router.route('/expenses')
    .post(protect, addExpense)
    .get(protect, getExpenses);

router.route('/expenses/:id')
    .delete(protect, deleteExpense);

module.exports = router;
