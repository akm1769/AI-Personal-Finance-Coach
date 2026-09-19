const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Atlas connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Routes (will be added by Member 2)
// app.use('/api/auth', authRoutes);
// app.use('/api/transactions', transactionRoutes);
// app.use('/api/budget', budgetRoutes);
// app.use('/api/insights', insightRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ message: '🚀 F1 - AI Personal Finance Coach API is running!', status: 'ok' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
