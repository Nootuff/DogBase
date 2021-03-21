const express = require('express');
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const Joi = require("joi");
const { uploadSchema } = require("../schemas.js")
const {isLoggedIn} = require("../middleware");

const ExpressError = require("../utilities/ExpressError"); //Imports the function from ExpressError.js.
const Upload = require("../models/upload"); //Link for the upload schema in models

const validateUpload = (req, res, next) => {
    const { error } = uploadSchema.validate(req.body)
    if(error){
      const msg = error.details.map(el => el.message).join(",") //If there's more than 1 message, join them all together with a comment. 
      throw new ExpressError(msg, 400)
      } else{
        next();
      }
	}

router.get("/", async (req, res) => { //Home page.
    const uploads = await Upload.find({});
    res.render("uploads/index.ejs", { uploads });
  });
    
  router.get("/new", isLoggedIn, function (req, res) { //Just loads new page.
   res.render("uploads/new.ejs");
  });
  
  router.post("/", isLoggedIn, validateUpload, catchAsync(async (req, res, next) => {   //Post new upload post  
    const upload = new Upload(req.body.upload);
    await upload.save();
    req.flash("success", "Woof! Remember to build a js function that dissmisses this when you press the X!"); //Could you have an array of dog noises and this pulls a random one with each upload?
    res.redirect(`/uploads/${upload._id}`)
  }));
  
  router.get("/:id", catchAsync(async (req, res) => { //This loads an individual upload on the show page. 
    var find = req.params.id;
    const upload = await Upload.findById(find).populate("comments"); // Populate lets you  automatically replace the specified paths in the document with document(s) from other collection(s). Eg replacing those object IDs with the actual data they represent. 
    if(!upload){
      req.flash("error", "Can't be found");
      return res.redirect("/uploads");
    }
    console.log(upload);
    res.render("uploads/show.ejs", { upload });
  }));
  
  router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => { //Load the edit page
    var find = req.params.id;
    const upload = await Upload.findById(find);
    if(!upload){
      req.flash("error", "Can'#'t be found");
      return res.redirect("/uploads");
    }
    res.render("uploads/edit.ejs", { upload });
  }));
  
  router.put('/:id', isLoggedIn, validateUpload, catchAsync(async (req, res,) => { //This activates when the submit button is pressed on the edit.ejs page, updates that 
    const idHolder = req.params.id;
    const upload = await Upload.findByIdAndUpdate(idHolder, { ...req.body.upload }); //No idea what most of this 
    //await upload.save();
    req.flash("success", "Update Success!");
    res.redirect(`/uploads/${upload._id}`) //String template literal, note the backticks
  }));
  
  router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => { //Delete route to delete an upload, the associated middleware in the upload model activates to, deleting all the comments associated with it. 
    const idHolder = req.params.id; 
    await Upload.findByIdAndDelete(idHolder);
    req.flash("success", "Deleted.");
    res.redirect('/uploads');
  }));

  module.exports = router;