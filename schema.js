// Import Joi, a powerful schema description and data validation library
const Joi = require('joi');

// Exporting a validation schema object for a "listing"
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),             // 'title' must be a string and is required
        description: Joi.string().required(),       // 'description' must be a string and is required
        price: Joi.number().required().min(0),      // 'price' must be a number, required, and cannot be negative
        image: Joi.object({
            url: Joi.string().uri().allow('').optional()  // 'image.url' is optional and should be a valid URL if provided
        }).optional(),                             // 'image' object itself is optional
        location: Joi.string().required(),          // 'location' must be a string and is required
        country: Joi.string().required(),           // 'country' must be a string and is required
    }).required() // The 'listing' object itself is required
});



module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),           // 'comment' must be a string and is required
        rating: Joi.number().required().min(1).max(5) // 'rating' must be a number between 1 and 5, required
    }).required() // The 'review' object itself is required
});