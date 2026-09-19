const express = require("express");
const router = express.Router();

const Transaction = require("../models/Transaction");
const { guessCategory } = require("../services/financeAnalysis");

// GET /api/transactions?userId=...
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/transactions
router.post("/", async (req, res) => {
  try {
    const { userId, amount, type, description, category, date, source } = req.body;

    if (!userId || amount == null || !type) {
      return res.status(400).json({
        message: "userId, amount and type are required"
      });
    }

    const transaction = await Transaction.create({
      userId,
      amount: Math.abs(Number(amount)),
      type,
      description,
      category: category || (type === "expense" ? guessCategory(description) : "Income"),
      date: date || new Date(),
      source: source || "manual"
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/transactions/:id
router.put("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/transactions/:id
router.delete("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
