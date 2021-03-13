const express = require('express');
const ejs = require('ejs');
const path = require("path");
const mongoose = require('mongoose');
const engine = require('ejs-mate'); //This npm lets you use your boilerplate.ejs
const methodOverride = require('method-override'); //THis npm lets you use the edit and delete parts of CRUD.
const Upload = require("./models/upload"); //Link for the upload schema in models

const app = express(); //Activates express.

mongoose.connect('mongodb://localhost:27017/ExpressDogProject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

const db = mongoose.connection; //No idea what this code does, seems to just put messages in console log
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("database connected");
});

app.use(express.urlencoded({ extended: true })); //Lets you take the inputted data from the form
app.use(methodOverride('_method')); //Activates methodOverride.

app.engine('ejs', engine);
app.set("views", path.join(__dirname, "/views"))
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
  res.send('home')
});

app.get("/uploads", async (req, res) => { //Home page.
  const uploads = await Upload.find({});
  res.render("uploads/index.ejs", { uploads });
});

/*
app.get("/show", function (req, res) { This is no longer needed
    res.render("uploads/show.ejs");
});
*/

app.get("/uploads/new", function (req, res) {
  console.log("hello?")
 res.render("uploads/new.ejs");
});

app.post("/uploads", async (req, res) => {
  var test = req.body;
  const upload = new Upload(req.body);
  console.log(test);
  await upload.save();

  res.redirect(`/uploads/${upload._id}`)
});

app.get("/uploads/:id", async (req, res) => { //This loads an individual upload on the show page. 
  var find = req.params.id;
  const upload = await Upload.findById(find); //The products object on the farm model is just an array of product object ids. Populate lets you  automatically replace the specified paths in the document with document(s) from other collection(s). Eg replacing those object IDs with the actual data they represent. 
  //res.render("farmsFolder/farmDetails.ejs", { farm }) This passes the value of const farm to the farmDetails.ejs page 
  console.log(upload);
  res.render("uploads/show.ejs", { upload });
})

app.get("/uploads/:id/edit", async (req, res) => {
  var find = req.params.id;
  const upload = await Upload.findById(find);
  res.render("uploads/edit.ejs", { upload });
})

app.put('/uploads/:id', async (req, res,) => { //This activates when the submit button is pressed on the edit.ejs page, updates that 
  const idHolder = req.params.id;
  const upload = await Upload.findByIdAndUpdate(idHolder, { ...req.body.upload }); //No idea what most of this 
 
  await upload.save();
 
  res.redirect(`/uploads/${upload._id}`) //String template literal, note the backticks
})

app.delete('/uploads/:id', async (req, res) => {
  const idHolder = req.params.id;

  await Upload.findByIdAndDelete(idHolder);
  console.log("hit it")
  res.redirect('/uploads');
})

app.listen(3000, function () {
  console.log("Live on http://localhost:3000"); //String template literal, accuratley shows the port you are serving on Heroku or local. 
});