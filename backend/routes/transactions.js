const express = require('express');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const { addExpense, getExpenses, deleteExpense } = require('../controllers/expense');
const { addInvestment, getInvestments, deleteInvestment } = require('../controllers/investment');
const { addSaving, getSavings, deleteSaving } = require('../controllers/saving');
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

router.route('/investments')
    .post(protect, addInvestment)
    .get(protect, getInvestments);

router.route('/investments/:id')
    .delete(protect, deleteInvestment);

router.route('/savings')
    .post(protect, addSaving)
    .get(protect, getSavings);

router.route('/savings/:id')
    .delete(protect, deleteSaving);

module.exports = router;
