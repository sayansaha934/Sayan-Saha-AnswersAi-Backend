const mongoose = require('mongoose');

async function connectToMongoDB() {
  try {
    const dbUrl = process.env.MONGODB_URL;
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

module.exports = connectToMongoDB;