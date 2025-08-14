const express = require('express');
const router = express.Router();
const User = require('../model/user.js'); // User model for authentication
const wrapasync = require('../utils/wrapasync.js');
const passport = require('passport'); // Authentication middleware

router.get('/signup', (req, res) => {
    res.render('users/signup.ejs'); // Render signup page
});

router.post('/signup', wrapasync(async (req, res, next) => {
    try{
          let {username, email, password} = req.body; // Extract user details from request body
    let newUser = new User({username, email}); // Create a new user instance
    const registeredUser =await User.register(newUser, password); // Register the user with the provided password
    console.log(registeredUser); // Log the registered user details
    req.flash('success', 'Welcome to WanderLust!'); // Flash success message
    res.redirect('/listings'); // Redirect to listings page after successful registration 
    }catch(err) {
        req.flash('error', err.message); // Flash error message if registration fails
        res.redirect('/signup'); // Redirect back to signup page
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login.ejs'); // Render login page
});

router.post('/login', passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),async(req, res) => {
     res.flash("success","Welcome to WanderLust!"); // Send welcome message after successful login
        res.redirect('/listings'); // Redirect to listings page after successful login
});
module.exports = router; // Export the router for use in app.js