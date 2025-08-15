// ========================
// Listing Model Schema
// ========================
// This schema defines a listing (apartment, hotel, etc.) for the WanderLust application

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review'); // Import the Review model to handle reviews associated with listings

// Define the schema structure for a listing
const listingSchema = new Schema({
    title: {
        type: String,
        required: true // Every listing must have a title
    },
    description: {
        type: String,
        required: true // Description is also mandatory
    },
    image: {
        filename: {
            type: String,
            default: "listingimage" // Default filename if none provided
        },
        url: {
            type: String,
            default: "https://imgs.search.brave.com/lbsuRHZQ80_K5LVodjIiEpuFp3JPOhDW0CzkWzgntmA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YXMuaXN0b2NrcGhv/dC5jb20vaWQvNTA0/NzAwOTA0L2ZyL3Bo/b3RvL2IlQzMlQTJ0/aW1lbnQtc3F1YXJl/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz05WU5RVXFwRzZZ/ZWhjNDh6bGthdEJ4/UTUySF9HLUlKX3dn/RGpjZmFqR1BVPQ"
            // A default placeholder image URL
        }
    },
    price: {
        type: Number,
        required: true // Price is required
    },
    location: {
        type: String,
        required: true // Specific location of the listing
    },
    country: {
        type: String,
        required: true // Country is required
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review' // Reference to the Review model
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model for the owner of the listing
    }
});

listingSchema.post('findOneAndDelete', async function (listing) {
    {
        if (listing) {
            // If the listing has reviews, delete them from the Review collection
        await Review.deleteMany({_id:{$in: listing.reviews}// When a listing is deleted, also delete all associated reviews
        });
    }
    }
});

// Create the Listing model using the schema
const Listing = mongoose.model('Listing', listingSchema);

// Export the Listing model so it can be used in routes and controllers
module.exports = Listing;
