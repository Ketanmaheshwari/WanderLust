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
const listings = require('./routes/listing.js'); // Import listings routes
const reviews = require('./routes/review.js'); // Import reviews routes


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

// ==========================
// Listings Routes
// ==========================

app.use('/listings', listings); // Use listings routes defined in routes/listing.js

// ==========================
// Reviews Routes
// ==========================

app.use('/listings/:id/reviews', reviews); // Use reviews routes defined in routes/review.js  

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
