// ==========================
// Listings Routes
// ==========================


const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapasync.js'); // Utility to handle async errors
const Listing = require('../model/listing.js'); // Import Mongoose model for listings
const { isLoggedIn, isOwner ,validateListing} = require('../middleware.js'); // Import middleware to check if user is logged in
const listingController = require('../controllers/listings.js'); // Import controller functions




// NOTE: Static routes must come before dynamic ones like '/:id'

// New Route to render form to create a new listing
router.get('/new',isLoggedIn,listingController.renderNewForm);

// INDEX - Display all lisLoggedIn,istings
router.get('/', wrapAsync(listingController.index));

// CREATE - Create a new listing in DB
router.post('/',isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// EDIT - Render form to edit an existing listing
router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

// UPDATE - Update existing listing in DB
router.put('/:id',isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing));

// DELETE - Delete a listing
router.delete('/:id',isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

// SHOW - Display a single listing's details
router.get('/:id', wrapAsync(listingController.showListing));

// Export the router to use in app.js
module.exports = router;
