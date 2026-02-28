const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
    const { title, amount, category, description, date }  = req.body;

    try {
        // Validations
        if(!title || !category || !description || !date){
            return res.status(400).json({success: false, error: 'All fields are required!'})
        }
        if(amount <= 0 || !amount === 'number'){
            return res.status(400).json({success: false, error: 'Amount must be a positive number!'})
        }

        const expense = new Expense({
            title,
            amount,
            category,
            description,
            date,
            user: req.user.id
        });

        await expense.save();
        res.status(200).json({success: true, data: expense})
    } catch (error) {
        res.status(500).json({success: false, error: 'Server Error'})
    }
}

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({createdAt: -1});
        res.status(200).json({success: true, data: expenses})
    } catch (error) {
        res.status(500).json({success: false, error: 'Server Error'})
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if(!expense) {
          return res.status(404).json({success: false, error: 'Expense not found'})
        }

        // Make sure user owns expense
        if (expense.user.toString() !== req.user.id) {
          return res.status(401).json({success: false, error: 'Not authorized to delete this expense'});
        }

        await expense.deleteOne();
        res.status(200).json({success: true, data: {}})
    } catch (error) {
        res.status(500).json({success: false, error: 'Server Error'})
    }
}
