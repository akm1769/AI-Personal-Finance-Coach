const express = require("express");
const router = express.Router();
const SavingsGoal = require("../models/SavingsGoal");

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const goals = await SavingsGoal.find({ userId }).sort({ targetDate: 1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const goal = await SavingsGoal.create({
      ...req.body,
      targetAmount: Number(req.body.targetAmount),
      currentAmount: Number(req.body.currentAmount || 0)
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const goal = await SavingsGoal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
