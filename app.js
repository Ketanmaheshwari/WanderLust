// ==========================
// Required Modules
// ==========================
const express = require('express'); // Import Express framework
const mongoose = require('mongoose'); // MongoDB object modeling tool
const path = require('path'); // Utility for working with file and directory paths
const methodOverride = require('method-override'); // Allows using HTTP verbs like PUT or DELETE
const Listing = require('./model/listing.js'); // Import Mongoose model for listings
const ejsMate = require('ejs-mate'); // Template engine to support layouts and partials in EJS
const wrapAsync = require('./utils/wrapasync.js'); // Utility to handle async errors
const ExpressError = require('./utils/expressError.js'); // Custom error class
const { listingSchema,reviewSchema } = require('./schema.js'); // Joi schema for listing validation
const Review = require('./model/review.js'); // Import Mongoose model for reviews


// ==========================
// App Configuration
// ==========================
const app = express(); // Initialize Express app
const mongoURL = 'mongodb://localhost:27017/wanderlust'; // MongoDB connection string

app.engine('ejs', ejsMate); // Set ejsMate as template engine
app.set('view engine', 'ejs'); // Set EJS as default view engine
app.set('views', path.join(__dirname, 'views')); // Set views directory path

app.use(express.static(path.join(__dirname, '/public'))); // Serve static files from 'public' directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (form data)
app.use(methodOverride('_method')); // Support method override for PUT/DELETE in forms

// ==========================
// Connect to MongoDB
// ==========================
async function main() {
    await mongoose.connect(mongoURL); // Connect to MongoDB
}
main()
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ==========================
// Root Route
// ==========================
app.get('/', (req, res) => {
    res.send('Hi! I am root'); // Respond to root URL
});

// ==========================
// Listings Routes
// ==========================

// NOTE: Static routes must come before dynamic ones like '/:id'

// Route to render form to create a new listing
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs'); // Render 'new' EJS view
});

// Middleware to validate listing data before saving or updating
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body); // Validate req.body using Joi schema
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(', '); // Collect error messages
        throw new ExpressError(400, errMsg); // Throw custom error with status 400
    } else {
        next(); // Continue to next middleware or route handler
    }
};

// Middleware to validate review data before saving
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body); // Validate req.body using Joi schema
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(', '); // Collect error messages
        throw new ExpressError(400, errMsg); // Throw custom error with status 400
    } else {
        next(); // Continue to next middleware or route handler
    }
};

// INDEX - Display all listings
app.get('/listings', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}); // Fetch all listings from DB
    res.render('listings/index.ejs', { allListings }); // Render 'index' view with listings
}));

// CREATE - Create a new listing in DB
app.post('/listings', validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing); // Create new Listing instance from form data
    await newListing.save(); // Save to DB
    res.redirect('/listings'); // Redirect to index page
}));

// EDIT - Render form to edit an existing listing
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params; // Extract listing ID from URL
    const listing = await Listing.findById(id); // Find listing by ID
    if (!listing) throw new ExpressError('Listing not found', 404); // If not found, throw 404 error
    res.render('listings/edit.ejs', { listing }); // Render 'edit' view with listing data
}));

// UPDATE - Update existing listing in DB
app.put('/listings/:id', validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params; // Extract listing ID from URL
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // Update listing using form data
    res.redirect(`/listings/${id}`); // Redirect to listing detail page
}));

// DELETE - Delete a listing
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    const { id } = req.params; // Extract listing ID from URL
    const deletedListing = await Listing.findByIdAndDelete(id); // Delete listing from DB
    console.log('🗑️ Deleted Listing:', deletedListing); // Log deleted listing
    res.redirect('/listings'); // Redirect to index page
}));

// Reviews Routes
//Post ROUTE to create a new review for a listing
app.post('/listings/:id/reviews', validateReview, wrapAsync(async (req, res) => {
   let listing= await  Listing.findById(req.params.id);
   let newReview=new Review(req.body.review); // Create new review instance from form data

   listing.reviews.push(newReview); // Add new review to listing's reviews array

    await newReview.save(); // Save new review to DB
    await listing.save(); // Save updated listing with new review

    res.redirect(`/listings/${listing._id}`); // Redirect to listing detail page
}))

// SHOW - Display a single listing's details
// THIS ROUTE MUST COME AFTER STATIC ONES (like '/new' or '/edit')
app.get('/listings/:id', wrapAsync(async (req, res) => {
    const { id } = req.params; // Extract listing ID from URL
    const listing = await Listing.findById(id).populate("reviews"); // Find listing by ID
    if (!listing) {
        throw new ExpressError('Listing not found', 404); // Throw 404 if not found
    }
    res.render('listings/show.ejs', { listing }); // Render 'show' view with listing data
}));

// DELETE - Remove a review from a listing
app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req,res) => {
    const { id, reviewId } = req.params; // Extract listing ID and review ID from URL
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove review from listing's reviews array
    await Review.findByIdAndDelete(reviewId); // Delete review from DB
    res.redirect(`/listings/${id}`); // Redirect to listing detail page
}));

// ==========================
// Fallback & Error Handling
// ==========================

// Catch-all route for undefined paths
app.use((req, res, next) => {
    next(new ExpressError('Page Not Found', 404)); // Throw 404 error for unknown routes
});

// Global error handler middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong!' } = err; // Set default error values
    res.status(statusCode).render('error.ejs', { message }); // Render error page with message
    // Optional alternative: res.status(statusCode).send(message);
});

// ==========================
// Start Server
// ==========================
app.listen(3000, () => {
    console.log('🚀 Server is running on port 3000'); // Log server status
});
