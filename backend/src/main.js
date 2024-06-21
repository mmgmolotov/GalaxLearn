// main.js (Previously index.js)
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const connectDB = async () => {
  try {
    // Suppress Mongoose strictQuery deprecation warning
    mongoose.set('strictQuery', true);

    // Connect to MongoDB using the URI from the environment variables
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/galaxlearn_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
};

connectDB();

// Example route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
