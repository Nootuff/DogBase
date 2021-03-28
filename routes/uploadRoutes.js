const express = require('express');
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const Joi = require("joi");
const {isLoggedIn, validateUpload, isAuthor } = require("../middleware");
const multer = require("multer");
const {storage} = require("../cloudinary"); //This imports the const "storage"  object from the index.js file in your cloudinary folder. Node automatically looks for a file named index.js in a folder which is why the index file isn't actually reffered to. 
const upload = multer({ storage }); 
const { cloudinary } = require("../cloudinary")


const Upload = require("../models/upload"); //Link for the upload schema in models

router.get("/", async (req, res) => { //Home page.
    const uploads = await Upload.find({});
    res.render("uploads/index.ejs", { uploads });
  });
    
  router.get("/new", isLoggedIn, function (req, res) { //Just loads new page.
   res.render("uploads/new.ejs");
  });
  

  router.post("/", isLoggedIn, upload.single('image'), validateUpload, catchAsync(async (req, res, next) => {  //Post new upload post  
    const upload = new Upload(req.body.upload);
    upload.image.url = req.file.path;
    upload.image.filename = req.file.filename;
    upload.author = req.user._id;
    await upload.save();
    console.log("**It's here** " + upload.image.url);
    req.flash("success", "Woof! Remember to build a js function that dissmisses this when you press the X!"); //Could you have an array of dog noises and this pulls a random one with each upload?
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
    const upload = await Upload.findById(find).populate({path: "comments", populate: {path: "author" }}).populate("author"); // Populate lets you  automatically replace the specified paths in the document with document(s) from other collection(s). Eg replacing those object IDs with the actual data they represent. The path stuff with comments tells the system to populate all the comments from the comments array from the upload we're finding, then on each comment, populate that comment's author. 
    if(!upload){
      req.flash("error", "Can't be found");
      return res.redirect("/uploads");
    }
    console.log(upload);
    res.render("uploads/show.ejs", { upload });
  }));
  
  router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => { //Load the edit page
    var idHolder = req.params.id;
    const upload = await Upload.findById(idHolder);
    if(!upload){
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
  
  router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => { //Delete route to delete an upload, the associated middleware in the upload model activates to, deleting all the comments associated with it. 
    const idHolder = req.params.id; 
    console.log("this is it " + idHolder);
    await Upload.findByIdAndDelete(idHolder);
    
    req.flash("success", "Deleted.");
    res.redirect('/uploads');
  }));

  module.exports = router;