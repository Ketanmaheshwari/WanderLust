// ==========================
// Reviews Routes
// ==========================

const express = require('express');
const router = express.Router({ mergeParams: true }); // Enable merging of params from parent route
const wrapAsync = require('../utils/wrapasync.js'); // Utility to handle async errors
const ExpressError = require('../utils/expressError.js'); // Custom error class
const Review = require('../model/review.js'); // Import Mongoose model for reviews
const Listing = require('../model/listing.js'); // Import Mongoose model for listings
const { validateReview } = require('../middleware.js'); // Import middleware to validate review data


//Post ROUTE to create a new review for a listing

router.post('/', validateReview, wrapAsync(async (req, res) => {
   let listing= await  Listing.findById(req.params.id);
   let newReview=new Review(req.body.review); // Create new review instance from form data

   listing.reviews.push(newReview); // Add new review to listing's reviews array

    await newReview.save(); // Save new review to DB
    await listing.save(); // Save updated listing with new review

    req.flash('success', 'New Review created successfully!'); // Flash success message

    res.redirect(`/listings/${listing._id}`); // Redirect to listing detail page
}))

// DELETE - Remove a review from a listing
router.delete('/:reviewId', wrapAsync(async (req,res) => {
    const { id, reviewId } = req.params; // Extract listing ID and review ID from URL
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove review from listing's reviews array
    await Review.findByIdAndDelete(reviewId); // Delete review from DB
    req.flash('success', 'Review Deleted!'); // Flash success message
    res.redirect(`/listings/${id}`); // Redirect to listing detail page
}));


module.exports = router; // Export the router to use in app.js