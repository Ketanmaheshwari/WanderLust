// Custom Error class to handle HTTP errors in Express
class ExpressError extends Error {
    constructor(message, statusCode) {
        // Call the parent Error constructor
        super();

        // Assign custom properties
        this.message = message;         // Error message
        this.statusCode = statusCode;   // HTTP status code
    }
}

// Export the custom error class so it can be used in other files
module.exports = ExpressError;
