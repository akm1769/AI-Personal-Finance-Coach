const express = require("express");
const router = express.Router();
const {
  getSummary,
  getRecurringExpenses,
  getInsights
} = require("../services/financeAnalysis");

router.get("/summary", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    res.json(await getSummary(userId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/recurring", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    res.json(await getRecurringExpenses(userId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    res.json(await getInsights(userId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
