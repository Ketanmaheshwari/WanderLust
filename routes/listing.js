// ==========================
// Listings Routes
// ==========================


const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapasync.js'); // Utility to handle async errors
const { listingSchema} = require('../schema.js'); // Joi schema for listing validation
const ExpressError = require('../utils/expressError.js'); // Custom error class
const Listing = require('../model/listing.js'); // Import Mongoose model for listings


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

// NOTE: Static routes must come before dynamic ones like '/:id'

// Route to render form to create a new listing
router.get('/new', (req, res) => {
    res.render('listings/new.ejs'); // Render 'new' EJS view
});

// INDEX - Display all listings
router.get('/', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({}); // Fetch all listings from DB
    res.render('listings/index.ejs', { allListings }); // Render 'index' view with listings
}));

// CREATE - Create a new listing in DB
router.post('/', validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing); // Create new Listing instance from form data
    await newListing.save(); // Save to DB
    req.flash('success', 'New listing created successfully!'); // Flash success message
    res.redirect('/listings'); // Redirect to index page
}));

// EDIT - Render form to edit an existing listing
router.get('/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params; // Extract listing ID from URL
    const listing = await Listing.findById(id); // Find listing by ID
    if(!listing){
        req.flash('error', 'Listing not found'); // Flash error message if listing not found
        return res.redirect('/listings'); // Redirect to index page if not found
    }
    if (!listing) throw new ExpressError('Listing not found', 404); // If not found, throw 404 error
    res.render('listings/edit.ejs', { listing }); // Render 'edit' view with listing data
}));

// UPDATE - Update existing listing in DB
router.put('/:id', validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params; // Extract listing ID from URL
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // Update listing using form data
    req.flash('success', 'Listing Updated!'); // Flash success message
    res.redirect(`/listings/${id}`); // Redirect to listing detail page
}));

// DELETE - Delete a listing
router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params; // Extract listing ID from URL
    const deletedListing = await Listing.findByIdAndDelete(id); // Delete listing from DB
    console.log('🗑️ Deleted Listing:', deletedListing); // Log deleted listing
    req.flash('success', 'Listing Deleted!'); // Flash success message
    res.redirect('/listings'); // Redirect to index page
}));

// SHOW - Display a single listing's details
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params; // Extract listing ID from URL
    const listing = await Listing.findById(id).populate("reviews"); // Find listing by ID
    if(!listing){
        req.flash('error', 'Listing not found'); // Flash error message if listing not found
        return res.redirect('/listings'); // Redirect to index page if not found
    }
    if (!listing) {
        throw new ExpressError('Listing not found', 404); // Throw 404 if not found
    }
    res.render('listings/show.ejs', { listing }); // Render 'show' view with listing data
}));

// Export the router to use in app.js
module.exports = router;
