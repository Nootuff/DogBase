const express = require('express');
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const Joi = require("joi");
const ExpressError = require("../utilities/ExpressError"); //Imports the function from ExpressError.js.
const { uploadSchema } = require("../schemas.js")

const Upload = require("../models/upload"); //Link for the upload schema in models

const validateUpload = (req, res, next) => {
    const { error } = uploadSchema.validate(req.body)
    if(error){
      const msg = error.details.map(el => el.message).join(",") //If there's more than 1 message, join them all together with a comment. 
      throw new ExpressError(msg, 400)
      } else{
        next();
      }
    console.log("result");
	}

router.get("/", async (req, res) => { //Home page.
    const uploads = await Upload.find({});
    res.render("uploads/index.ejs", { uploads });
  });
  
  /*
  app.get("/show", function (req, res) { This is no longer needed
      res.render("uploads/show.ejs");
  });
  */
  
  router.get("/new", function (req, res) { //Just loads new page.
   res.render("uploads/new.ejs");
  });
  
  router.post("/", validateUpload, catchAsync(async (req, res, next) => {    
    const upload = new Upload(req.body.upload);
    await upload.save();
    res.redirect(`/uploads/${upload._id}`)
  }));
  
  router.get("/:id", catchAsync(async (req, res) => { //This loads an individual upload on the show page. 
    var find = req.params.id;
    const upload = await Upload.findById(find).populate("comments"); // Populate lets you  automatically replace the specified paths in the document with document(s) from other collection(s). Eg replacing those object IDs with the actual data they represent. 
    
    console.log(upload);
    res.render("uploads/show.ejs", { upload });
  }));
  
  router.get("/:id/edit", catchAsync(async (req, res) => {
    var find = req.params.id;
    const upload = await Upload.findById(find);
    res.render("uploads/edit.ejs", { upload });
  }));
  
  router.put('/:id', validateUpload, catchAsync(async (req, res,) => { //This activates when the submit button is pressed on the edit.ejs page, updates that 
    const idHolder = req.params.id;
    const upload = await Upload.findByIdAndUpdate(idHolder, { ...req.body.upload }); //No idea what most of this 
    //await upload.save();
    res.redirect(`/uploads/${upload._id}`) //String template literal, note the backticks
  }));
  
  router.delete('/:id', catchAsync(async (req, res) => {
    const idHolder = req.params.id; 
    await Upload.findByIdAndDelete(idHolder);
    console.log("hit it")
    res.redirect('/uploads');
  }));

  module.exports = router;