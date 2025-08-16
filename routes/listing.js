// ==========================
// Listings Routes
// ==========================


const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapasync.js'); // Utility to handle async errors
const Listing = require('../model/listing.js'); // Import Mongoose model for listings
const { isLoggedIn, isOwner ,validateListing} = require('../middleware.js'); // Import middleware to check if user is logged in
const listingController = require('../controllers/listings.js'); // Import controller functions
const multer = require('multer'); // Import multer for file uploads
const { cloudinary, storage } = require('../cloudConfig.js'); // Import cloudinary configuration
const upload = multer({storage}); // Set up multer to store uploaded files



router
.route('/')

.get(wrapAsync(listingController.index))// INDEX - Display all lisLoggedIn,istings

.post(isLoggedIn, validateListing,upload.single('listing[image][url]'), wrapAsync(listingController.createListing))// CREATE - Create a new listing in DB



// New Route to render form to create a new listing
router.get('/new',isLoggedIn,listingController.renderNewForm);


router
.route('/:id')

.put(isLoggedIn,isOwner, validateListing,upload.single('listing[image][url]'), wrapAsync(listingController.updateListing))// UPDATE - Update existing listing in DB

.get( wrapAsync(listingController.showListing))// SHOW - Display a single listing's details

.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));// DELETE - Delete a listing




// EDIT - Render form to edit an existing listing
router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));










// Export the router to use in app.js
module.exports = router;
