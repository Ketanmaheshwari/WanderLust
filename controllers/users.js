const User = require('../model/user.js'); // User model for authentication

module.exports.renderSignupForm=(req, res) => {
    res.render('users/signup.ejs'); // Render signup page
}



module.exports.signup=async (req, res, next) => {
    try{
          let {username, email, password} = req.body; // Extract user details from request body
    let newUser = new User({username, email}); // Create a new user instance
    const registeredUser =await User.register(newUser, password); // Register the user with the provided password
    console.log(registeredUser); // Log the registered user details
    req.login(registeredUser, (err) => { // Log in the user after registration
        if (err) {return next(err);} // Handle login error
        req.flash('success', 'Welcome to WanderLust!'); // Flash success message after registration
        res.redirect('/listings'); // Redirect to listings page after successful registration
    }
);
   
    }catch(err) {
        req.flash('error', err.message); // Flash error message if registration fails
        res.redirect('/signup'); // Redirect back to signup page
    }
}


 module.exports.renderLoginForm=(req, res) => {
    res.render('users/login.ejs'); // Render login page
}


module.exports.login=async(req, res) => {
     req.flash("success","Welcome to WanderLust!"); // Send welcome message after successful login
     let redirectUrl = res.locals.redirectUrl || '/listings'; // Get redirect URL or default to listings
        res.redirect(redirectUrl); // Redirect to listings page after successful login
}

module.exports.logout=(req, res,next) => {
    req.logout((err) => { // Logout the user
        if (err) {
          next(err); // Pass error to next middleware if logout fails
        }
        req.flash('success', 'Logged out successfully'); // Flash success message on successful logout
        res.redirect('/listings'); // Redirect to login page after logout
    });
}

