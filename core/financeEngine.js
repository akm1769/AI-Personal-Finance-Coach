// ============================================
// CORE AI ENGINE - F1: AI Personal Finance Coach
// ============================================
// This module implements rule-based "AI" logic for:
// 1. Expense Categorization
// 2. Recurring Expense Detection
// 3. Budget Insights & Savings Tips
//
// ⚠️ All team members must understand this code!
// ============================================

// --- 1. EXPENSE CATEGORIZATION ---
// Maps merchant names to categories using keyword matching
const CATEGORY_KEYWORDS = {
  food: ['zomato', 'swiggy', 'uber eats', 'dominos', 'subway', 'mcdonald', 'starbucks', 'restaurant', 'cafe', 'foodpanda', 'eat'],
  transport: ['ola', 'uber', 'rapido', 'metro', 'bus', 'fuel', 'petrol', 'diesel', 'rail', 'airline', 'uber'],
  shopping: ['amazon', 'flipkart', 'myntra', 'shop', 'store', 'retail', 'market'],
  entertainment: ['netflix', 'spotify', 'youtube', 'prime', 'hotstar', 'gaming', 'playstation', 'xbox'],
  bills: ['electricity', 'electric', 'water', 'gas', 'internet', 'jio', 'airtel', 'vodafone', 'phone', 'mobile bill'],
  health: ['hospital', 'medicine', 'pharmacy', 'clinic', 'doctor', 'dental', 'health'],
  education: ['coursera', 'udemy', 'college', 'school', 'book', 'fee', 'tuition'],
  salary: ['salary', 'wage', 'income', 'payroll'],
};

function categorizeExpense(merchantName, amount) {
  if (!merchantName) return { category: 'uncategorized', confidence: 0 };

  const merchantLower = merchantName.toLowerCase().trim();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (merchantLower.includes(keyword)) {
        return { category, confidence: 0.95, matchedKeyword: keyword };
      }
    }
  }

  return { category: 'uncategorized', confidence: 0.3 };
}

// --- 2. RECURRING EXPENSE DETECTION ---
// Checks if expenses have same merchant + similar amount within a time window
function detectRecurringExpenses(transactions) {
  const grouped = {};

  // Group by merchant
  transactions.forEach(t => {
    const key = t.merchant.toLowerCase().trim();
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });

  const recurring = [];
  for (const [merchant, txns] of Object.entries(grouped)) {
    if (txns.length >= 3) {
      const amounts = txns.map(t => t.amount);
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - avgAmount, 2), 0) / amounts.length;
      const stdDev = Math.sqrt(variance);

      // If amounts are within 20% of average, it's recurring
      if (stdDev < avgAmount * 0.3) {
        recurring.push({
          merchant,
          avgAmount: Math.round(avgAmount),
          frequency: `Every ${estimateFrequency(txns)}`,
          monthlyTotal: Math.round(avgAmount * (txns.length / Math.max(1, getMonthlyCount(txns)))),
          category: txns[0].category,
        });
      }
    }
  }

  return recurring;
}

function estimateFrequency(transactions) {
  if (transactions.length < 2) return 'unknown';
  const dates = transactions.map(t => new Date(t.date));
  const diffs = [];
  for (let i = 1; i < dates.length; i++) {
    diffs.push(Math.abs(dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24));
  }
  const avgDays = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  if (avgDays < 7) return 'weekly';
  if (avgDays < 35) return 'monthly';
  return 'irregular';
}

function getMonthlyCount(transactions) {
  const months = new Set(transactions.map(t => new Date(t.date).getMonth()));
  return Math.max(1, months.size);
}

// --- 3. AI INSIGHTS GENERATOR ---
// Generates actionable insights from transaction data
function generateInsights(transactions, recurringExpenses) {
  const insights = [];

  // Calculate totals
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;

  // Insight 1: Overall financial health
  if (savingsRate >= 20) {
    insights.push({ type: 'positive', message: 'Great job! You\'re saving around ' + savingsRate + '% of your income. Keep it up!' });
  } else if (savingsRate >= 10) {
    insights.push({ type: 'neutral', message: 'You\'re saving ' + savingsRate + '% of your income. Try to increase it to at least 20% for better financial health.' });
  } else {
    insights.push({ type: 'warning', message: 'You\'re only saving ' + savingsRate + '% of your income. Consider cutting unnecessary expenses.' });
  }

  // Insight 2: Top spending categories
  const categoryTotals = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    const cat = t.category || 'uncategorized';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
  });
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    insights.push({ type: 'info', message: 'Your highest spending category is ' + topCategory[0].toUpperCase() + ' (₹' + Math.round(topCategory[1]) + '). Consider setting a monthly budget for it.' });
  }

  // Insight 3: Recurring expense alerts
  if (recurringExpenses.length > 0) {
    const totalRecurring = recurringExpenses.reduce((sum, r) => sum + r.monthlyTotal, 0);
    insights.push({ type: 'info', message: 'You have ' + recurringExpenses.length + ' recurring expenses totaling ₹' + totalRecurring + '/month. Review these for potential savings.' });
  }

  // Insight 4: Savings goal tip
  if (savings > 0) {
    insights.push({ type: 'positive', message: 'You have a surplus of ₹' + savings + ' this month. Consider putting this into a savings goal!' });
  } else {
    insights.push({ type: 'warning', message: 'You\'re spending more than you earn this month. Track where the money goes!' });
  }

  return { insights, totalIncome, totalExpense, savings, savingsRate };
}

module.exports = {
  categorizeExpense,
  detectRecurringExpenses,
  generateInsights,
  CATEGORY_KEYWORDS,
};
