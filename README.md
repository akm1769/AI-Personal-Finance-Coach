# F1 — AI Personal Finance Coach

**Hackathon:** Versathon 2.0  
**Problem:** F1 — AI Personal Finance Coach (Finance / Blockchain Vertical)  
**Vertical:** Finance / Blockchain  

A personal finance application that analyzes income and spending and provides actionable budgeting insights. It identifies recurring expenses and recommends savings opportunities.

---

## Tech Stack
- **Frontend:** React.js + Recharts
- **Backend:** Node.js + Express + MongoDB Atlas
- **Core:** Rule-based AI engine
- **Repo:** https://github.com/akm1769/AI-Personal-Finance-Coach

---

## What It Does (F1 Requirements)
- Track income/expenses with smart categories
- Analyze spending patterns and detect recurring subscriptions
- Generate budgeting insights and savings tips
- Visual dashboards with charts

---

## Project Structure
- `frontend/` — React UI
- `backend/` — Express + MongoDB
- `core/` — AI engine
- `.docs/` — PPT/video/Q&A prep

---

## Live URLs (Deploy Early)
- Frontend (Vercel): [To be deployed — add link here after build]
- Backend (Render): [To be deployed — add link here after build]
- GitHub Repo: https://github.com/akm1769/AI-Personal-Finance-Coach

---

## Setup (Quick Start for Judges / Team)
1. Clone repo
2. `cd backend && npm install && cp .env.example .env` (add MongoDB URI)
3. `npm start` (backend runs on :5000)
4. `cd ../frontend && npm install && npm start` (frontend on :3000)
5. Open `localhost:3000`

---

## Architecture (Evidence-Based Insights)
Every insight links to exact transactions + rule that fired.
- Categorization: rules first → LLM only for unknown merchants
- Recurring: 3+ events, median gap 7/14/30/365 ±3 days
- Insights: z-score + month-over-month + savings rate
- What-if: slider updates goal date based on computed savings

---

## Note on Blockchain Element
The "Finance / Blockchain" vertical label is from the problem statement.
If evaluated: add a small hash-anchored log of savings goals (hash of goal + timestamp).
If not evaluated: skip — don't waste time.
