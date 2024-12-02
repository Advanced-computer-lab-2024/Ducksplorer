const promoCodeModel = require('../Models/promoCodeModel');

const createPromoCode = async (req, res) => {
    const {code, value} = req.body;

    try{
        const promoCode = await promoCodeModel.create({code, value});
        res.status(200).json(promoCode);
    }
    catch(error){
        res.status(400).json({ error: error.message });

    }
}

module.exports = { createPromoCode };