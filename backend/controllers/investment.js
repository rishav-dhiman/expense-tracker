const Investment = require('../models/Investment');

exports.addInvestment = async (req, res) => {
    const { title, amount, category, description, date }  = req.body;

    try {
        // Validations
        if(!title || !category || !description || !date){
            return res.status(400).json({success: false, error: 'All fields are required!'})
        }
        if(amount <= 0 || !amount === 'number'){
            return res.status(400).json({success: false, error: 'Amount must be a positive number!'})
        }

        const investment = new Investment({
            title,
            amount,
            category,
            description,
            date,
            user: req.user.id
        });

        await investment.save();
        res.status(200).json({success: true, data: investment})
    } catch (error) {
        res.status(500).json({success: false, error: 'Server Error'})
    }
}

exports.getInvestments = async (req, res) => {
    try {
        const investments = await Investment.find({ user: req.user.id }).sort({createdAt: -1});
        res.status(200).json({success: true, data: investments})
    } catch (error) {
        res.status(500).json({success: false, error: 'Server Error'})
    }
}

exports.deleteInvestment = async (req, res) => {
    try {
        const investment = await Investment.findById(req.params.id);

        if(!investment) {
          return res.status(404).json({success: false, error: 'Investment not found'})
        }

        // Make sure user owns investment
        if (investment.user.toString() !== req.user.id) {
          return res.status(401).json({success: false, error: 'Not authorized to delete this investment'});
        }

        await investment.deleteOne();
        res.status(200).json({success: true, data: {}})
    } catch (error) {
        res.status(500).json({success: false, error: 'Server Error'})
    }
}
