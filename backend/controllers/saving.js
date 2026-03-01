const Saving = require('../models/Saving');

exports.addSaving = async (req, res) => {
    const { title, amount, category, description, date }  = req.body;

    try {
        // Validations
        if(!title || !category || !description || !date){
            return res.status(400).json({success: false, error: 'All fields are required!'})
        }
        if(amount <= 0 || !amount === 'number'){
            return res.status(400).json({success: false, error: 'Amount must be a positive number!'})
        }

        const saving = new Saving({
            title,
            amount,
            category,
            description,
            date,
            user: req.user.id
        });

        await saving.save();
        res.status(200).json({success: true, data: saving})
    } catch (error) {
        res.status(500).json({success: false, error: 'Server Error'})
    }
}

exports.getSavings = async (req, res) => {
    try {
        const savings = await Saving.find({ user: req.user.id }).sort({createdAt: -1});
        res.status(200).json({success: true, data: savings})
    } catch (error) {
        res.status(500).json({success: false, error: 'Server Error'})
    }
}

exports.deleteSaving = async (req, res) => {
    try {
        const saving = await Saving.findById(req.params.id);

        if(!saving) {
          return res.status(404).json({success: false, error: 'Saving not found'})
        }

        // Make sure user owns saving
        if (saving.user.toString() !== req.user.id) {
          return res.status(401).json({success: false, error: 'Not authorized to delete this saving'});
        }

        await saving.deleteOne();
        res.status(200).json({success: true, data: {}})
    } catch (error) {
        res.status(500).json({success: false, error: 'Server Error'})
    }
}
