/*
username: Adam,
email: adamwalkerlondon@gmail.com,
pass: Winter

*/

const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");

router.get("/register", function(req, res) {
    res.render("users/register.ejs")
});

router.post("/register", catchAsync(async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const newUser = new User({ username, email }); //Creates a new instance of user with this data.
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", "Welcome to Untitled Dog Project");
        res.redirect("/uploads")
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("register")
    }
}));

router.get("/login", function(req, res){
res.render("users/login.ejs");
})

router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), (req, res) =>{
req.flash("success", "Welcome back!")
res.redirect("/uploads");
})

module.exports = router;