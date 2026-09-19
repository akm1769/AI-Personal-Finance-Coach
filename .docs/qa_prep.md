# 🎤 Live Q&A Preparation Sheet — F1: AI Personal Finance Coach
*All 4 team members must memorize these answers!*

---

## 🔥 Must-Answer Questions

### 1. "Why did you choose this tech stack?"
> "We chose React for the frontend because of its component-based architecture and ecosystem (Recharts for beautiful data visualization). Node.js + Express was chosen for the backend because it's lightweight, fast, and great for REST APIs. MongoDB Atlas was selected because our data (transactions, budgets) is document-based and benefits from a flexible schema — making it easy to add new fields without migrations."

### 2. "How does your categorization work?"
> "We use a rule-based keyword matching system. When a user enters a merchant name like 'Zomato' or 'Starbucks', our system checks it against a keyword dictionary. For example, 'zomato' matches the 'food' category with 95% confidence. This is lightweight and explainable, unlike black-box ML models."

### 3. "How do you detect recurring expenses?"
> "We group transactions by merchant, calculate the average amount and standard deviation. If the standard deviation is less than 30% of the average and there are 3+ transactions, we flag it as recurring. This helps users identify subscriptions and regular bills they might not notice."

### 4. "How is data secured?"
> "We use JWT-based authentication for user endpoints. MongoDB Atlas handles data encryption at rest. Each user's data is scoped to their userId — one user cannot access another's transactions. We also use CORS to restrict frontend origins."

### 5. "What was the hardest challenge?"
> "The most challenging part was designing the AI insights engine — making it generate meaningful, personalized insights from raw transaction data without relying on a heavy ML model. We solved it with rule-based logic that analyzes spending patterns, recurring behaviors, and savings ratios."

### 6. "How does your architecture scale?"
> "The frontend and backend are decoupled via REST APIs. MongoDB Atlas scales horizontally with sharding. Adding new features (like investment tracking or multi-currency) is straightforward — we just add new models and API endpoints."

### 7. "What did each team member contribute?"
> "Member 1 built the entire frontend with React, charts, and UI components. Member 2 built the backend API, database models, and connected MongoDB Atlas. Member 3 built the AI insights engine (categorization, recurring detection, budget tips) and managed Git. Member 4 handled PPT, demo video, QA testing, and live evaluation prep."

### 8. "What would you improve with more time?"
> "We'd add: multi-currency support, investment portfolio tracking, mobile notifications for overspending, exportable PDF reports, and a chatbot interface for financial advice."

---

## 💡 Key Talking Points
- ✅ We used AI (rule-based) for intelligent insights — NOT a black-box model
- ✅ All 4 members can explain every part of the codebase
- ✅ Regular Git commits prove authentic development
- ✅ Working prototype with real MongoDB Atlas connection
- ✅ Visual dashboards with spending insights
