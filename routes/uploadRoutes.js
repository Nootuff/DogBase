const express = require('express');
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");

const Upload = require("../models/upload"); //Link for the upload schema in models

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
  
  router.post("/", catchAsync(async (req, res) => {
    var test = req.body;
    const upload = new Upload(req.body);
    console.log(test);
    await upload.save();
  
    res.redirect(`/uploads/${upload._id}`)
  }));
  
  router.get("/:id", catchAsync(async (req, res) => { //This loads an individual upload on the show page. 
    var find = req.params.id;
    const upload = await Upload.findById(find); //The products object on the farm model is just an array of product object ids. Populate lets you  automatically replace the specified paths in the document with document(s) from other collection(s). Eg replacing those object IDs with the actual data they represent. 
    //res.render("farmsFolder/farmDetails.ejs", { farm }) This passes the value of const farm to the farmDetails.ejs page 
    console.log(upload);
    res.render("uploads/show.ejs", { upload });
  }));
  
  router.get("/:id/edit", catchAsync(async (req, res) => {
    var find = req.params.id;
    const upload = await Upload.findById(find);
    res.render("uploads/edit.ejs", { upload });
  }));
  
  router.put('/:id', catchAsync(async (req, res,) => { //This activates when the submit button is pressed on the edit.ejs page, updates that 
    const idHolder = req.params.id;
    const upload = await Upload.findByIdAndUpdate(idHolder, { ...req.body.upload }); //No idea what most of this 
    await upload.save();
    res.redirect(`/uploads/${upload._id}`) //String template literal, note the backticks
  }));
  
  router.delete('/:id', catchAsync(async (req, res) => {
    const idHolder = req.params.id; 
    await Upload.findByIdAndDelete(idHolder);
    console.log("hit it")
    res.redirect('/uploads');
  }));

  module.exports = router;