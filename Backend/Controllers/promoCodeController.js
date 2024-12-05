const promoCodeModel = require("../Models/promoCodeModel");

const createPromoCode = async (req, res) => {
  const { code, value, date } = req.body;

  try {
    const promoCode = await promoCodeModel.create({
      code,
      value,
      expiryDate: date,
    });
    res.status(200).json(promoCode);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const validatePromoCode = async (req, res) => {
  const { code } = req.body;

  try {
    const promoCode = await promoCodeModel.findOne({ code, isActive: true });

    if (!promoCode) {
      return res.status(404).json({ error: "Invalid or inactive promo code" });
    }

    if (promoCode.expiryDate && new Date() > promoCode.expiryDate) {
      //check if not expired
      return res.status(400).json({ error: "Promo code has expired" });
    }

    res.status(200).json({ discount: promoCode.value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createPromoCode, validatePromoCode };
