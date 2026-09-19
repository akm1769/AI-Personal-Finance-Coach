const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/versathon')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('DB error:', err.message));

app.get('/', (req,res) => res.json({message:'F1 AI Finance Coach API OK', status:'running'}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('✅ Server on port ' + PORT));
