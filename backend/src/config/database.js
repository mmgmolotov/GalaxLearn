const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Log the MONGO_URI to ensure it's being loaded
console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose.set('strictQuery', true);  // Keeps the strict query option enabled

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,      // Use the new URL parser
      useUnifiedTopology: true,   // Use the new topology engine
      // useCreateIndex: true,    // Remove this option
      // useFindAndModify: false, // Remove this option
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
