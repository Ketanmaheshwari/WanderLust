// ========================
// Database Seeder Script
// ========================
// Purpose: Clears the existing data and inserts fresh sample data into the 'listings' collection

const mongoose = require('mongoose');
const initData = require('./data.js'); // Import initial data to insert
const Listing = require('../model/listing.js'); // Import the Listing model

const mongoURL = 'mongodb://localhost:27017/wanderlust'; // MongoDB connection URL

// Connect to MongoDB
main()
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch(err => {
    console.error('❌ Error connecting to MongoDB:', err);
  });

async function main() {
  await mongoose.connect(mongoURL);
}

// Seed Function: Deletes all listings and inserts fresh sample listings
const initDB = async () => {
  try {
    await Listing.deleteMany({}); // Remove all existing listings
    await Listing.insertMany(initData.data); // Insert fresh sample data
    console.log('🌱 Database initialized with sample data');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  }
};

initDB(); // Call the seed function
