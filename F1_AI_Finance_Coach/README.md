# F1 AI Personal Finance Coach - Backend

## 1. Install
```bash
npm install
```

## 2. Create `.env`
Copy `.env.example` to `.env`.

For local MongoDB:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/f1_finance_coach
```

For MongoDB Atlas, replace MONGODB_URI with your Atlas connection string.

## 3. Start
```bash
npm run dev
```

## 4. Important endpoints
- GET  /api/transactions?userId=USER_ID
- POST /api/transactions
- PUT  /api/transactions/:id
- DELETE /api/transactions/:id
- GET  /api/budgets?userId=USER_ID
- POST /api/budgets
- GET  /api/goals?userId=USER_ID
- POST /api/goals
- PUT  /api/goals/:id
- GET  /api/insights?userId=USER_ID
- GET  /api/insights/summary?userId=USER_ID
- GET  /api/insights/recurring?userId=USER_ID
- POST /api/import/csv

## CSV format
Use columns:
date,description,amount,type

Example:
2026-09-01,ABC WORK PAYMENT,850,credit
2026-09-01,Grocery Store,-120,debit

The backend classifies credit as income and debit as expense.
If an expense category is missing, it tries to guess the category from the description.
