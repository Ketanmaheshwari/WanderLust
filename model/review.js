// It is a one to many relationship, where one listing can have multiple reviews.
// ==========================
// Review Model Schema
// ==========================

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating:{
        type: Number,
        min:1,
        max:5
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the date when the review is created
    }
});

module.exports = mongoose.model('Review', reviewSchema); // Export the Review model