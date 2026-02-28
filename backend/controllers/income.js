const Income = require('../models/Income');

exports.addIncome = async (req, res) => {
    const { title, amount, category, description, date }  = req.body;

    try {
        // Validations
        if(!title || !category || !description || !date){
            return res.status(400).json({success: false, error: 'All fields are required!'})
        }
        if(amount <= 0 || !amount === 'number'){
            return res.status(400).json({success: false, error: 'Amount must be a positive number!'})
        }

        const income = new Income({
            title,
            amount,
            category,
            description,
            date,
            user: req.user.id
        });

        await income.save();
        res.status(200).json({success: true, data: income})
    } catch (error) {
        res.status(500).json({success: false, error: 'Server Error'})
    }
}

exports.getIncomes = async (req, res) => {
    try {
        const incomes = await Income.find({ user: req.user.id }).sort({createdAt: -1});
        res.status(200).json({success: true, data: incomes})
    } catch (error) {
        res.status(500).json({success: false, error: 'Server Error'})
    }
}

exports.deleteIncome = async (req, res) => {
    try {
        const income = await Income.findById(req.params.id);

        if(!income) {
          return res.status(404).json({success: false, error: 'Income not found'})
        }

        // Make sure user owns income
        if (income.user.toString() !== req.user.id) {
          return res.status(401).json({success: false, error: 'Not authorized to delete this income'});
        }

        await income.deleteOne();
        res.status(200).json({success: true, data: {}})
    } catch (error) {
        res.status(500).json({success: false, error: 'Server Error'})
    }
}
