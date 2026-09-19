// ============================================
// Constants for F1 AI Personal Finance Coach
// ============================================

export const API_BASE = '/api';

export const CATEGORIES = [
  'food', 'transport', 'shopping', 'entertainment',
  'bills', 'health', 'education', 'salary', 'uncategorized'
];

export const CATEGORY_COLORS = {
  food: '#e94560',
  transport: '#0f3460',
  shopping: '#e94560',
  entertainment: '#533483',
  bills: '#16213e',
  health: '#1b998b',
  education: '#f9a826',
  salary: '#4ecca3',
  uncategorized: '#888888',
};

export const INSIGHT_TYPES = {
  positive: { color: '#4ecca3', icon: '✅', label: 'Great Job!' },
  neutral: { color: '#f9a826', icon: '💡', label: 'Tip' },
  warning: { color: '#e94560', icon: '⚠️', label: 'Warning' },
  info: { color: '#0f3460', icon: 'ℹ️', label: 'Insight' },
};
