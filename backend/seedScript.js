const mongoose = require('mongoose');
const { generateSeedData } = require('../core/seedData.js');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/versathon')
  .then(async () => {
    const Transaction = require('./models/Transaction');
    const data = generateSeedData('demo-user-001');
    await Transaction.insertMany(data);
    console.log('✅ Inserted', data.length, 'seed transactions');
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });
