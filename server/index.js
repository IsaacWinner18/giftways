require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/participants', require('./routes/participants'));
app.use('/api/users', require('./routes/users'));
app.use('/api/analytics', require('./routes/analytics'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    mongoose.connect(process.env.MONGODB_URI)
  console.log(`Server running on port ${PORT}`);
}); 