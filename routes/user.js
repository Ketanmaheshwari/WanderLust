const express = require('express');
const router = express.Router();
const User = require('../model/user.js'); // User model for authentication
const wrapasync = require('../utils/wrapasync.js');
const passport = require('passport'); // Authentication middleware
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/users.js'); // Import user controller functions

router
.route('/signup')

.get( userController.renderSignupForm) // Render signup form

.post( wrapasync(userController.signup)); // Handle user signup


router
.route('/login')

.get(userController.renderLoginForm) // Render login form

.post(saveRedirectUrl, passport.authenticate("local",{
    failureRedirect:'/login',failureFlash:true})
    ,userController.login); // Handle user login with passport authentication


router.get('/logout', userController.logout); // Handle user logout
module.exports = router; // Export the router for use in app.js