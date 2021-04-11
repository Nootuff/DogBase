const express = require('express');
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const Joi = require("joi");
const { isLoggedIn, validateUpload, isAuthor, hasLiked, hasDisliked, hasFavd } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary"); //This imports the const "storage"  object from the index.js file in your cloudinary folder. Node automatically looks for a file named index.js in a folder which is why the index file isn't actually reffered to. 
const multerUpload = multer({ storage });
const Upload = require("../models/upload"); //Link for the upload schema in models
const User = require("../models/user");

const dogNoise = ["Woof!", "Bark!", "Yelp!", "Yap!"];

router.get("/", async (req, res) => { //Home page.
  const uploads = await Upload.find({});
  res.render("uploads/index.ejs", { uploads });
});

router.get("/new", isLoggedIn, function (req, res) { //Just loads new page.
  res.render("uploads/new.ejs");
});

router.post("/", isLoggedIn, multerUpload.single('image'), validateUpload, catchAsync(async (req, res, next) => {  //Post new upload post  
  const upload = new Upload(req.body.upload);
  upload.image.url = req.file.path;
  upload.image.filename = req.file.filename;
  upload.author = req.user._id;
  upload.likes.push(req.user._id);
  upload.dislikes.push(req.user._id);
  const author = req.user;
  author.posts.push(upload);
  await author.save();
  await upload.save();
  req.flash("success", dogNoise[Math.floor(Math.random() * dogNoise.length)] +  " Remember to build a js function that dissmisses this when you press the X!");
  res.redirect(`/uploads/${upload._id}`)
}));

/*
router.post("/", upload.single('image'),(req, res) => {    
  console.log(req.file)
  res.send("Great success!")
});
*/

router.get("/:id", catchAsync(async (req, res) => { //This loads an individual upload on the show page. 
  var find = req.params.id;
  const upload = await Upload.findById(find).populate({ path: "comments", populate: { path: "author" } }).populate("author"); // Populate lets you  automatically replace the specified paths in the document with document(s) from other collection(s). Eg replacing those object IDs with the actual data they represent. The path stuff with comments tells the system to populate all the comments from the comments array from the upload we're finding, then on each comment, populate that comment's author. 
  if (!upload) {
    req.flash("error", "Can't be found");
    return res.redirect("/uploads");
  }
  //console.log(upload);
  res.render("uploads/show.ejs", { upload });
}));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => { //Load the edit page
  var idHolder = req.params.id;
  const upload = await Upload.findById(idHolder);
  if (!upload) {
    req.flash("error", "Can't be found");
    return res.redirect("/uploads");
  }
  res.render("uploads/edit.ejs", { upload });
}));

router.put('/:id', isLoggedIn, isAuthor, validateUpload, catchAsync(async (req, res,) => { //This activates when the submit button is pressed on the edit.ejs page, updates that 
  const idHolder = req.params.id;
  const upload = await Upload.findByIdAndUpdate(idHolder, { ...req.body.upload }); //No idea what most of this 
  req.flash("success", "Update Success!");
  res.redirect(`/uploads/${upload._id}`) //String template literal, note the backticks
}));

//Like and un-like and dislike routes.  

router.put('/:id/like', isLoggedIn, hasLiked, catchAsync(async (req, res,) => { //Add to like array route
  const upload = await Upload.findByIdAndUpdate(req.params.id);
  upload.likes.push(req.user._id);
  if (upload.dislikes.includes(req.user._id)) {
    await Upload.findByIdAndUpdate(upload, { $pull: { dislikes: req.user._id } });
  }
  await upload.save();
  req.flash("success", "Liked!");
  res.redirect(`/uploads/${upload._id}`) //String template literal, note the backticks
}));

router.put('/:id/unlike', isLoggedIn, catchAsync(async (req, res,) => { //Remove like from likes array, replace unlike button with like 
  const upload = req.params.id;
  const likedUser = req.user._id;
  await Upload.findByIdAndUpdate(upload, { $pull: { likes: likedUser } });  //Pulls current users ID out of the likes array.
  res.redirect("back"); //Apparently "back" just takes you back to the last page you were on which has now been modified with the above code. 
}));


router.put('/:id/dislike', isLoggedIn, hasDisliked, catchAsync(async (req, res,) => { //Add to Dislike array route 
  const upload = await Upload.findByIdAndUpdate(req.params.id);
  upload.dislikes.push(req.user._id);
  if (upload.likes.includes(req.user._id)) {
    await Upload.findByIdAndUpdate(upload, { $pull: { likes: req.user._id } });
  }
  await upload.save();
  res.redirect(`/uploads/${upload._id}`)
}));

router.put('/:id/undislike', isLoggedIn, catchAsync(async (req, res,) => { //Remove dislike from dislikes array, replace undislike button with dislike .
  const upload = req.params.id;
  const dislikedUser = req.user._id;
  await Upload.findByIdAndUpdate(upload, { $pull: { dislikes: dislikedUser } });  //Pulls current users ID out of the dislikes array.
  res.redirect("back");
}));

//The fave and un-fave routes.

router.put('/:id/fav', isLoggedIn, hasFavd, catchAsync(async (req, res,) => { //Add post to user fav array route.
  const upload = await Upload.findById(req.params.id);
  const user = await User.findByIdAndUpdate(req.user._id);
user.favourites.push(upload);
console.log("upload is " + upload);
await user.save();
  req.flash("success", "Fav'd!");
  res.redirect("back")
}));

router.put('/:id/unFav', isLoggedIn, catchAsync(async (req, res,) => { //Remove prost from user fav array route.
  const user = req.user._id;
   const upload = req.params.id;
await User.findByIdAndUpdate(user, { $pull: { favourites: upload } }); 
  req.flash("success", "Removed from favs.");
  res.redirect("back")
}));


router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => { //Delete route to delete an upload, the associated middleware in the upload model activates too, deleting all the comments associated with it. 
  const upload = req.params.id;
  //console.log("this is it " + idHolder);
  const user = await User.findById(req.user._id);
  if(user.posts.includes(upload)){
console.log("post detected")
await User.findByIdAndUpdate(user, { $pull: { posts: upload } }); 
  }
  await Upload.findByIdAndDelete(upload);

  req.flash("success", "Deleted.");
  res.redirect('/uploads');
}));

module.exports = router;