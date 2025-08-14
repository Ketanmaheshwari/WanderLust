const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    }//passport-local-mongoose will add username and password fields automatically weather we add fields or not 
    }) 

userSchema.plugin(passportLocalMongoose); // Add passport-local-mongoose plugin for authentication

module.exports = mongoose.model('User', userSchema); // Export the User model

// We are using pbkdf2 algorithm for password hashing and salting, which is the default in passport-local-mongoose.