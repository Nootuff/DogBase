const { uploadSchema, commentSchema, userSchema } = require("./schemas.js")
const ExpressError = require("./utilities/ExpressError"); //Imports the function from ExpressError.js.
const Upload = require("./models/upload"); //Link for the upload schema in models
const Comment = require("./models/comment");
const User = require("./models/user");

module.exports.isLoggedIn = (req, res, next) => { //All middleware have req, res and next. The module.exports is exporting this meaning it an be used in other files.
  //console.log(req.user);
  if (!req.isAuthenticated()) { //isAuthenticated is a method bought in by passport. It detects if the currect user is logged in (Authenticated)
    //console.log(req.originalUrl);
    //req.session.returnTo = req.originalUrl originalUrl holds the URL they are requesting/page they want to go to when they hit the login screen maybe? returnTo will be the url we redirect the user back to. I think putting req.session before it adds the data of what they were trying to access to their session cookies.
    req.session.returnTo = req.originalUrl //originalUrl holds the URL they are requesting/page they want to go to when they hit the login screen maybe? returnTo will be the url we redirect the user back to. I think putting req.session before it adds the data of what they were trying to access to their session cookies.
    req.flash("error", "You must be signed in to do this.");
    return res.redirect("/users/login"); //These things activate if the user does not read as logged in. Always have a return on a redirect in an if statement. 
  }
  next();
}

module.exports.validateUpload = (req, res, next) => {
  const { error } = uploadSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",") //If there's more than 1 message, join them all together with a comment. 
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

module.exports.isAuthor = async (req, res, next) => {
  const idHolder = req.params.id;
  const upload = await Upload.findById(idHolder);  //Look to see if the user whose logged in right now's Id equals (is the same as) the current campground ID. 
  if (!upload.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do this.");
    return res.redirect(`/uploads/${idHolder}`);
  }
  next(); //The next lets you move on with whatever you want to do once the function has ascertained you have permission.
}

module.exports.isCommentAuthor = async (req, res, next) => {
  const idHolder = req.params.id; //System seems to take these Ids from the URL 
  const commentIdHolder = req.params.commentId;
  const comment = await Comment.findById(commentIdHolder);
  if (!comment.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do this.");
    return res.redirect(`/uploads/${idHolder}`);
  }
  next();
}

module.exports.validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(",") //If there's more than 1 message, join them all together with a comment. 
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

module.exports.hasLiked = async (req, res, next) => {
  const idHolder = req.params.id;
  const upload = await Upload.findById(idHolder);
  if (upload.likes.includes(req.user._id)) {
    req.flash("error", "You don't have permission to do this.");
    return res.redirect(`/uploads/${idHolder}`);
  }
  next();
}

module.exports.hasDisliked = async (req, res, next) => {
  const idHolder = req.params.id;
  const upload = await Upload.findById(idHolder);
  if (upload.dislikes.includes(req.user._id)) {
    req.flash("error", "You don't have permission to do this.");
    return res.redirect(`/uploads/${idHolder}`);
  }
  next();
}

module.exports.hasFavd = async (req, res, next) => {
  const idHolder = req.params.id;
  const upload = await Upload.findById(idHolder);
const user = await User.findById(req.user._id);
  if (user.favourites.includes(upload)) {
    req.flash("error", "You don't have permission to do this.");
    return res.redirect(`/uploads/${idHolder}`);
  }
  next();
}

module.exports.authNewUser = async (req, res, next) => {
  const username = req.body.username;
  const existUsername = await User.findOne({username: username});
  const password = req.body.password;
  const matchPass = req.body.matchPass;
  if(req.body.username.length < 4){
  req.flash("error", "Username must be at least 4 characters long"); //This actually works, maybe you could beef it up.
return res.redirect(`/users/register`);
  } else if (existUsername) {
    req.flash("error", "Username already in use");
    return res.redirect(`/users/register`);
   } else if(password != matchPass){
    req.flash("error", "Passwords must match");
    return res.redirect(`/users/register`);
   }
  next();
}

module.exports.existDisplayName = async (req, res, next) => {
  const displayName =  req.body.displayName;
  const existDisplayName = await User.findOne({displayName: displayName});
  if (existDisplayName) {
    req.flash("error", "Display name  already in use");
    return res.redirect("back");
   }
  next();
}