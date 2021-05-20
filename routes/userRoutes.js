const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, authNewUser, existDisplayName, alreadyAUser } = require("../middleware");

const multer = require("multer");
const { storage } = require("../cloudinary"); //This imports the const "storage" object from the index.js file in your cloudinary folder. Node automatically looks for a file named index.js in a folder which is why the index file isn't actually reffered to. 
const multerUpload = multer({ storage });
const { cloudinary } = require("../cloudinary");

router.get("/register", alreadyAUser, function (req, res) { //Loads register page.
    res.render("users/register.ejs");
});

router.post("/register", multerUpload.single('profileImage'), authNewUser, catchAsync(async (req, res) => { //The route that adds a new user onto the system. 
    try {
        const joinDate = () => {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0.
            const yyyy = today.getFullYear();
            return dd + '-' + mm + '-' + yyyy;
        }
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const displayName = req.body.displayName;
        const dateJoined = joinDate();
        const profileImage = (!req.file) ? { url: "/assets/placeholder.png", filename: "User-profile-image" } : { url: req.file.path, filename: req.file.filename }; //If user does not upload a profile image on account creation, the placeholder is added in its place. 
        const newUser = new User({ username, email, displayName, profileImage, dateJoined }); //Creates a new instance of user with this data.
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, error => { //This is another method from passport, logs in newly created user after registering. 
            if (error) return next(error); //If there's an error logging in the new user, go to the error handler, the error is passed to it.
            req.flash("success", "Welcome to Untitled Dog Project");
            res.redirect("/uploads");
        })
    } catch (error) {
        req.flash("error", "Missing data");
        res.redirect("register");
    }
}));

router.get("/login", alreadyAUser, function (req, res) { //Loads login page. 
    res.render("users/login.ejs");
})

router.get("/privacyPolicy", function (req, res) { //Loads privacy policy. 
    res.render("users/privacyPolicy.ejs");
})

router.get("/contactPage", function (req, res) { //Loads contact page. 
    res.render("users/contactPage.ejs");
})

router.get("/logout", function (req, res) { //Logs user out.
    req.logout(); //.logout() is another route bought in from passport, logs the user out.
    req.flash("success", "Goodbye!");
    res.redirect("/");
});

router.get("/accountPage", isLoggedIn, catchAsync(async (req, res) => { //Loads the current users' account page.    
    const user = await User.findById(req.user._id).populate("posts");
    res.render("users/accountPage.ejs", { user });
}));

router.get("/accountPage/favourites", isLoggedIn, catchAsync(async (req, res) => { //loads the favs tab on current users' account page.    
    const user = await User.findById(req.user._id).populate({ path: "favourites", populate: { path: "author" } });
    res.render("users/accountFavs.ejs", { user });
}));

router.get("/edit", isLoggedIn, catchAsync(async (req, res) => { //Loads the user edit page.
    const user = await User.findById(req.user._id);
    res.render("users/editUser.ejs", { user });
}));

router.put('/updateUser', isLoggedIn, existDisplayName, catchAsync(async (req, res,) => { //This activates when the submit button is pressed on the editUser.ejs page updating their details with the inputted data.
    const displayName = req.body.displayName;
    const user = await User.findByIdAndUpdate(req.user._id, { displayName: displayName });
    req.flash("success", "Update Success!");
    res.redirect("/users/edit");
}));

router.put('/viewMode', isLoggedIn, catchAsync(async (req, res,) => { //The route allowing user to set their view mode preferences in user edit page. 
    const user = await User.findById(req.user._id);
    if (user.darkMode == false) {
        user.darkMode = true;
    } else {
        user.darkMode = false;
    }
    await user.save();
    res.redirect("/users/edit");
}));

router.put('/destroyUserPic', isLoggedIn, catchAsync(async (req, res,) => { //Delete user profile pic and replace with default.
    const user = await User.findById(req.user._id);
    await cloudinary.uploader.destroy(user.profileImage.filename);
    user.profileImage.url = "/assets/placeholder.png";
    user.profileImage.filename = "User-profile-image";
    await user.save();
    req.flash("success", "Image deleted.");
    res.redirect("/users/edit");
}));

router.put('/updateProfilePic', multerUpload.single('profileImage'), isLoggedIn, catchAsync(async (req, res,) => { //Update user display image with new image.
    const user = await User.findById(req.user._id);
    await cloudinary.uploader.destroy(user.profileImage.filename);//The destroy method deletes the old image from the cloudinary database.
    const profileImage = { url: req.file.path, filename: req.file.filename };
    user.profileImage = profileImage;
    await user.save();
    req.flash("success", "Update Success!");
    res.redirect("/users/edit");
}));

router.get("/:id", catchAsync(async (req, res) => { //This renders the userpage.
    const find = req.params.id;
    const user = await (User.findById(find)).populate("posts");
    res.render("users/userPage.ejs", { user });
}));

router.get("/:id/favourites", catchAsync(async (req, res) => { //This renders the userpage favs tab. 
    const find = req.params.id;
    const user = await (User.findById(find)).populate({ path: "favourites", populate: { path: "author" } });
    res.render("users/userFavs.ejs", { user });
}));

router.post("/login", alreadyAUser, passport.authenticate("local", { failureFlash: true, failureRedirect: "/users/login" }), (req, res) => { //Lets a user log in to their account.
    req.flash("success", "Welcome back " + req.user.username + "!");
    const redirectUrl = req.session.returnTo || "/uploads"; //When user logs in, either redirect them to the page held in returnTo as defined in middleware.js OR redirect them to the main index page. 
    delete req.session.returnTo; //We don't need the returnTo data in the session after the redirect so delete just deletes it from the object, otherwise all these returnTo's would clutter up the object.
    res.redirect(redirectUrl);
})

module.exports = router;