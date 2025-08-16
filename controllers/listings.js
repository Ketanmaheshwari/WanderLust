const Listing = require('../model/listing'); // Import Listing model
const ExpressError = require('../utils/expressError'); // Custom error class


module.exports.index=async (req, res) => {
    const allListings = await Listing.find({}); // Fetch all listings from DB
    res.render('listings/index.ejs', { allListings }); // Render 'index' view with listings
}


module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs'); // Render 'new' EJS view
}


module.exports.showListing=async (req, res) => {
    const { id } = req.params; // Extract listing ID from URL
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    },}).populate("owner"); // Find listing by ID
    if(!listing){
        req.flash('error', 'Listing not found'); // Flash error message if listing not found
        return res.redirect('/listings'); // Redirect to index page if not found
    }
    console.log('📄 Listing Details:', listing); // Log listing details
    if (!listing) {
        throw new ExpressError('Listing not found', 404); // Throw 404 if not found
    }
    res.render('listings/show.ejs', { listing }); // Render 'show' view with listing data
}   

module.exports.createListing = async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing); // Create new Listing instance from form data
    newListing.owner = req.user._id; // Set the owner of the listing to the currently logged-in user 
    newListing.image = { url, filename }; // Set image URL and filename
    await newListing.save(); // Save to DB
    req.flash('success', 'New listing created successfully!'); // Flash success message
    res.redirect('/listings'); // Redirect to index page
}

module.exports.renderEditForm =async (req, res) => {
    const { id } = req.params; // Extract listing ID from URL
    const listing = await Listing.findById(id); // Find listing by ID
    if(!listing){
        req.flash('error', 'Listing not found'); // Flash error message if listing not found
        return res.redirect('/listings'); // Redirect to index page if not found
    }
    if (!listing) throw new ExpressError('Listing not found', 404); // If not found, throw 404 error

    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace('/upload', '/upload/w_300,h_200,'); // Modify URL for display
    res.render('listings/edit.ejs', { listing ,originalImageUrl}); // Render 'edit' view with listing data
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params; // Extract listing ID from URL
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // Update listing using form data
    if(typeof req.file!=="undifined"){ // Check if a new file was uploaded{
       let url=req.file.path;
    let filename=req.file.filename;
    listing.image = { url, filename }; // Update image URL and filename
    await listing.save(); // Save updated listing to DB
    }
    req.flash('success', 'Listing Updated!'); // Flash success message
    res.redirect(`/listings/${id}`); // Redirect to listing detail page
}


module.exports.destroyListing=async (req, res) => {
    const { id } = req.params; // Extract listing ID from URL
    const deletedListing = await Listing.findByIdAndDelete(id); // Delete listing from DB
    console.log('🗑️ Deleted Listing:', deletedListing); // Log deleted listing
    req.flash('success', 'Listing Deleted!'); // Flash success message
    res.redirect('/listings'); // Redirect to index page
}