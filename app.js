const express = require('express');
const ejs = require('ejs');
const path = require("path");
const mongoose = require('mongoose');
const engine = require('ejs-mate'); //This npm lets you use your boilerplate.ejs

const Upload = require("./models/upload"); //Link for the farm schema

const app = express();

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

app.engine('ejs', engine);
app.set("views", path.join(__dirname, "/views"))
app.use(express.static(__dirname + '/public'));

app.get("/", async (req, res) => {
    const uploads = await Upload.find({});
    res.render("uploads/index.ejs", {uploads});
});

/*
app.get("/show", function (req, res) { This is no longer needed
    res.render("uploads/show.ejs");
});
*/

app.get("/uploads/:id", async (req, res) =>{ //In farmsIndex.ejs, <%=farms[i]._id%> holds that farm's _id value, when placed after /farms/, it activates this route. 
var find  = req.params.id;
  const fetch = await Upload.findById(find); //The products object on the farm model is just an array of product object ids. Populate lets you  automatically replace the specified paths in the document with document(s) from other collection(s). Eg replacing those object IDs with the actual data they represent. 
  //res.render("farmsFolder/farmDetails.ejs", { farm }) This passes the value of const farm to the farmDetails.ejs page 
  console.log(fetch);
  res.render("uploads/show.ejs", {fetch});
  })

app.get("/upload", function (req, res) {
    res.render("uploads/upload.ejs");
});

app.post("/upload", async (req, res) => {
    var test = req.body;
    const upload = new Upload(req.body);
    console.log(test);
    await upload.save();
    
    res.redirect("/")
   });

app.listen(3000, function () {
    console.log("Live on http://localhost:3000"); //String template literal, accuratley shows the port you are serving on Heroku or local. 
});