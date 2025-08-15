const Review = require('../model/review.js'); // Import Mongoose model for reviews
const Listing = require('../model/listing.js'); // Import Mongoose model for listings



module.exports.createReview=async (req, res) => {
   let listing= await  Listing.findById(req.params.id);
   let newReview=new Review(req.body.review); // Create new review instance from form data
   newReview.author = req.user._id; // Set review author to current user ID
   listing.reviews.push(newReview); // Add new review to listing's reviews array

    await newReview.save(); // Save new review to DB
    await listing.save(); // Save updated listing with new review

    req.flash('success', 'New Review created successfully!'); // Flash success message

    res.redirect(`/listings/${listing._id}`); // Redirect to listing detail page
}


module.exports.destroyReview=async (req,res) => {
    const { id, reviewId } = req.params; // Extract listing ID and review ID from URL
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove review from listing's reviews array
    await Review.findByIdAndDelete(reviewId); // Delete review from DB
    req.flash('success', 'Review Deleted!'); // Flash success message
    res.redirect(`/listings/${id}`); // Redirect to listing detail page
}