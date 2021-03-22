/*
username: Adam,
email: adamwalkerlondon@gmail.com,
pass: Winter

username: EmochNoh,
  email: blue.emu@hotmail.com,
  pass: Campaign1
*/

const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");
const {isLoggedIn} = require("../middleware");

router.get("/register", function(req, res) {
    res.render("users/register.ejs")
});

router.get("/userpage", isLoggedIn, catchAsync(async(req, res)=> {
    res.render("users/userpage.ejs")
}));

router.post("/register", catchAsync(async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const newUser = new User({ username, email }); //Creates a new instance of user with this data.
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, error =>{ //This is another method from passport, logs in newly created user after registering. 
            if(error) return next(error); //If there's an error logging in the new user, go to the error handler, the error is passed to it I think, 
            req.flash("success", "Welcome to Untitled Dog Project");
        res.redirect("/uploads");
            })
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("register")
    }
}));

router.get("/login", function(req, res){
res.render("users/login.ejs");
})

router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), (req, res) =>{
console.log(req.user);
    req.flash("success", "Welcome back! " + req.user.username)
    const redirectUrl = req.session.returnTo || "/uploads"; //When user logs in, either redirect them to the page held in returnTo as defined in middleware.js OR redirect them to /campgrounds. 
	delete req.session.returnTo; //We don't need the returnTo in the session after the redirect so delete just deletes it from the object, otherwise all these returnTo's would clutter up the object.
res.redirect(redirectUrl);
})

router.get("/logout", function(req, res){
    req.logout(); //.logout() is another route bought in from password, logs the user out.
    req.flash("success", "Goodbye! try to build something that will make this route only activate if the user is logged in to begin with.");
    res.redirect("/uploads");
    });

module.exports = router;