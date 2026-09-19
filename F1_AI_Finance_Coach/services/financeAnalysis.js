const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const SavingsGoal = require("../models/SavingsGoal");

function normalizeDescription(text = "") {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function guessCategory(description = "") {
  const text = normalizeDescription(description);

  const rules = [
    { category: "Food", words: ["zomato", "swiggy", "restaurant", "food", "hotel", "grocery", "groceries"] },
    { category: "Transport", words: ["uber", "ola", "fuel", "petrol", "diesel", "metro", "bus", "train"] },
    { category: "Entertainment", words: ["netflix", "prime video", "hotstar", "movie", "cinema", "spotify"] },
    { category: "Bills", words: ["electricity", "water bill", "internet", "wifi", "mobile recharge", "recharge"] },
    { category: "Shopping", words: ["amazon", "flipkart", "shopping", "myntra"] },
    { category: "Healthcare", words: ["hospital", "pharmacy", "medicine", "medical", "doctor"] },
    { category: "Rent", words: ["rent", "house rent"] }
  ];

  for (const rule of rules) {
    if (rule.words.some(word => text.includes(word))) {
      return rule.category;
    }
  }

  return "Other";
}

async function getSummary(userId) {
  const transactions = await Transaction.find({ userId }).sort({ date: -1 });

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;
  const savingsRate = income > 0 ? Number(((balance / income) * 100).toFixed(2)) : 0;

  const byCategory = {};
  for (const t of transactions.filter(t => t.type === "expense")) {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  }

  return {
    income,
    expenses,
    balance,
    savingsRate,
    byCategory,
    recentTransactions: transactions.slice(0, 10)
  };
}

async function getRecurringExpenses(userId) {
  const expenses = await Transaction.find({
    userId,
    type: "expense"
  }).sort({ date: 1 });

  const groups = {};

  for (const expense of expenses) {
    const key = normalizeDescription(expense.description) || `category:${expense.category}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(expense);
  }

  const result = [];

  for (const [description, items] of Object.entries(groups)) {
    if (items.length < 3) continue;

    const amounts = items.map(x => x.amount);
    const average = amounts.reduce((a, b) => a + b, 0) / amounts.length;

    const dates = items.map(x => new Date(x.date).getTime());
    let frequency = "unknown";

    if (dates.length >= 3) {
      const gaps = [];
      for (let i = 1; i < dates.length; i++) {
        gaps.push((dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24));
      }
      const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;

      if (avgGap >= 5 && avgGap <= 10) frequency = "weekly";
      if (avgGap >= 25 && avgGap <= 35) frequency = "monthly";
    }

    result.push({
      description,
      averageAmount: Number(average.toFixed(2)),
      occurrences: items.length,
      frequency,
      lastSeen: items[items.length - 1].date
    });
  }

  return result;
}

async function getInsights(userId) {
  const summary = await getSummary(userId);
  const recurring = await getRecurringExpenses(userId);
  const insights = [];

  if (summary.income === 0) {
    insights.push("No income has been detected yet. Import a bank statement to analyze your cash flow.");
  }

  if (summary.savingsRate < 10 && summary.income > 0) {
    insights.push(
      `Your current savings rate is ${summary.savingsRate}%. Review your largest spending categories to create more savings room.`
    );
  }

  if (summary.byCategory.Food && summary.income > 0 && summary.byCategory.Food > summary.income * 0.2) {
    insights.push(
      `Food spending is ₹${Math.round(summary.byCategory.Food)}, which is above 20% of your income in this dataset.`
    );
  }

  if (recurring.length > 0) {
    const recurringTotal = recurring.reduce((sum, item) => sum + item.averageAmount, 0);
    insights.push(
      `${recurring.length} recurring expense pattern(s) were detected, averaging about ₹${Math.round(recurringTotal)} per occurrence.`
    );
  }

  const budgets = await Budget.find({ userId });
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  for (const budget of budgets.filter(b => b.month === month)) {
    const categorySpent = summary.byCategory[budget.category] || 0;
    if (categorySpent > budget.amount) {
      insights.push(
        `You are ₹${Math.round(categorySpent - budget.amount)} over your ${budget.category} budget for ${month}.`
      );
    } else {
      const remaining = budget.amount - categorySpent;
      insights.push(
        `You have ₹${Math.round(remaining)} left in your ${budget.category} budget for ${month}.`
      );
    }
  }

  const goals = await SavingsGoal.find({ userId });
  for (const goal of goals) {
    const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
    const today = new Date();
    const target = new Date(goal.targetDate);
    const monthsLeft = Math.max(
      1,
      (target.getFullYear() - today.getFullYear()) * 12 +
      (target.getMonth() - today.getMonth())
    );
    const monthlyNeeded = remaining / monthsLeft;

    insights.push(
      `For your "${goal.name}" goal, approximately ₹${Math.round(monthlyNeeded)} per month is needed to cover the remaining ₹${Math.round(remaining)}.`
    );
  }

  if (insights.length === 0) {
    insights.push("Add more transactions so the coach can identify stronger patterns and recommendations.");
  }

  return {
    summary,
    recurring,
    insights
  };
}

module.exports = {
  guessCategory,
  getSummary,
  getRecurringExpenses,
  getInsights
};
