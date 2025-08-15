const Listing = require('./model/listing'); // Import Listing model
const { listingSchema,reviewSchema} = require('./schema.js'); // Joi schema for listing validation
const ExpressError = require('./utils/expressError.js'); // Custom error class
const Review = require('./model/review.js'); // Import Mongoose model for reviews


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //redirect Url Save
        req.session.redirectUrl = req.originalUrl; // Save the original URL to redirect after login
        req.flash('error', 'You must be logged in to do that'); // Flash error message if not authenticated
        return res.redirect('/login'); // Redirect to login page
    }
    next(); // Continue to next middleware if authenticated
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Make redirect URL available in views
    }
    next(); // Continue to next middleware
} 

module.exports.isOwner= async (req, res, next) => {  
let { id } = req.params; // Extract listing ID from URL
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash('error', 'You are not the owner of this listing'); // Flash error if user is not owner
        return res.redirect(`/listings/${id}`); // Redirect to listing detail page
    }
    next(); // Continue to next middleware if user is owner 
}

// Middleware to validate listing data before saving or updating
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body); // Validate req.body using Joi schema
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(', '); // Collect error messages
        throw new ExpressError(400, errMsg); // Throw custom error with status 400
    } else {
        next(); // Continue to next middleware or route handler
    }
};


// Middleware to validate review data before saving
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body); // Validate req.body using Joi schema
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(', '); // Collect error messages
        throw new ExpressError(400, errMsg); // Throw custom error with status 400
    } else {
        next(); // Continue to next middleware or route handler
    }
};

module.exports.isReviewAuthor= async (req, res, next) => {  
let { id,reviewId } = req.params; // Extract listing ID from URL
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash('error', 'You did not create this review'); // Flash error if user is not owner
        return res.redirect(`/listings/${id}`); // Redirect to listing detail page
    }
    next(); // Continue to next middleware if user is owner 
}