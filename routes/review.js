// ==========================
// Reviews Routes
// ==========================

const express = require('express');
const router = express.Router({ mergeParams: true }); // Enable merging of params from parent route
const wrapAsync = require('../utils/wrapasync.js'); // Utility to handle async errors
const ExpressError = require('../utils/expressError.js'); // Custom error class
const Review = require('../model/review.js'); // Import Mongoose model for reviews
const Listing = require('../model/listing.js'); // Import Mongoose model for listings
const { validateReview,isLoggedIn, isReviewAuthor } = require('../middleware.js'); // Import middleware to validate review data
const reviewController = require('../controllers/review.js'); // Import controller functions

//Post ROUTE to create a new review for a listing

router.post('/', isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

// DELETE - Remove a review from a listing
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router; // Export the router to use in app.js