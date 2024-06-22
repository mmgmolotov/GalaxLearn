// src/server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path'); // Add this line to handle static file serving
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Add this line to import userRoutes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Serve static files
app.use(express.static(path.join(__dirname, '../public'))); // Adjust the path as needed to point to your public directory

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes); // Register userRoutes under '/api'

// Catch-all route to serve the lobby page
app.get('/lobby', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/lobby.html'));
});

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
