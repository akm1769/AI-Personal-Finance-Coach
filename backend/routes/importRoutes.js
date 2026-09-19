const express = require("express");
const multer = require("multer");
const { parse } = require("csv-parse/sync");
const router = express.Router();

const Transaction = require("../models/Transaction");
const { guessCategory } = require("../services/financeAnalysis");

const upload = multer({ storage: multer.memoryStorage() });

function detectType(row) {
  const rawType = String(row.type || row.Type || "").trim().toLowerCase();

  if (["credit", "income", "cr", "deposit"].includes(rawType)) {
    return "income";
  }

  if (["debit", "expense", "dr", "withdrawal"].includes(rawType)) {
    return "expense";
  }

  const amount = Number(row.amount ?? row.Amount ?? 0);

  return amount >= 0 ? "income" : "expense";
}

function detectAmount(row) {
  const value = Number(row.amount ?? row.Amount ?? 0);
  return Math.abs(value);
}

router.post("/csv", upload.single("file"), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const rows = parse(req.file.buffer.toString("utf8"), {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const transactions = rows.map(row => {
      const description =
        row.description ??
        row.Description ??
        row.narration ??
        row.Narration ??
        "";

      const dateValue = row.date ?? row.Date ?? new Date();

      return {
        userId,
        amount: detectAmount(row),
        type: detectType(row),
        description,
        category:
          String(row.category ?? row.Category ?? "").trim() ||
          (detectType(row) === "expense" ? guessCategory(description) : "Income"),
        date: new Date(dateValue),
        source: "imported"
      };
    });

    if (transactions.length === 0) {
      return res.status(400).json({ message: "No transactions found in CSV" });
    }

    const inserted = await Transaction.insertMany(transactions);

    res.status(201).json({
      message: `${inserted.length} transactions imported`,
      transactions: inserted
    });
  } catch (error) {
    res.status(400).json({
      message: "Could not import CSV",
      error: error.message
    });
  }
});

module.exports = router;
