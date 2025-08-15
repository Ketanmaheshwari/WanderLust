// ==========================
// Required Modules
// ==========================
const express = require('express'); // Import Express framework
const mongoose = require('mongoose'); // MongoDB object modeling tool
const path = require('path'); // Utility for working with file and directory paths
const methodOverride = require('method-override'); // Allows using HTTP verbs like PUT or DELETE
const ejsMate = require('ejs-mate'); // Template engine to support layouts and partials in EJS
const ExpressError = require('./utils/expressError.js'); // Custom error class

const session = require('express-session'); // Session management middleware
const flash = require('connect-flash'); // Flash messages middleware
const passport=require('passport'); // Authentication middleware
const LocalStrategy = require('passport-local'); // Local authentication strategy
const User = require('./model/user.js'); // User model for authentication
const listingRouter = require('./routes/listing.js'); // Import listings routes
const reviewRouter = require('./routes/review.js'); // Import reviews routes
const userRouter = require('./routes/user.js'); // Import user routes


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

const sessionOptions = {
    secret: 'mysupersecretcode', // Secret key for session encryption
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Save new session if not initialized
    cookie: {
        expires: Date.now() + 7*24*60*60*1000, // Set cookie expiration to 7 day
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        secure: false, // Set to true if using HTTPS (not recommended for development)
        maxAge: 1000 * 60 * 60 * 24 * 7// Cookie expiration time (1 day)
    }
}

// ==========================
// Root Route
// ==========================
app.get('/', (req, res) => {
    res.send('Hi! I am root'); // Respond to root URL
});


app.use(session(sessionOptions)); // Initialize session middleware
app.use(flash()); // Initialize flash messages middleware

app.use(passport.initialize()); // Initialize Passport for authentication
app.use(passport.session()); // Use Passport session management

passport.use(new LocalStrategy(User.authenticate())); // Use local strategy for authentication
passport.serializeUser(User.serializeUser()); // Serialize user for session
passport.deserializeUser(User.deserializeUser()); // Deserialize user from session

app.use((req, res, next) => {
    res.locals.success = req.flash('success'); // Make flash success messages available in views
    res.locals.error = req.flash('error'); // Make flash error messages available in views
    res.locals.currUser = req.user; // Make current user available in views
    next(); // Continue to next middleware
});

// app.get('/demouser',async (req, res) => {
//     let fakeUser= new User({
//         email: 'student@gmail.com',
//         username: 'delta-student',
//     });
//         let registeredUser =  await User.register(fakeUser, 'password123') // Register a fake user for demonstration
//         res.send(registeredUser); // Send registered user details as response
// });



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
// Listings Routes
// ==========================

app.use('/listings', listingRouter); // Use listings routes defined in routes/listing.js

// ==========================
// Reviews Routes
// ==========================

app.use('/listings/:id/reviews', reviewRouter); // Use reviews routes defined in routes/review.js  

// ==========================
// User Routes
// ==========================

app.use('/', userRouter); // Use user routes defined in routes/user.js

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
