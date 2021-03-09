const express = require('express');
const ejs = require('ejs');
const path = require("path");
const mongoose = require('mongoose');
const engine = require('ejs-mate'); //This npm lets you use your boilerplate.ejs

const Upload = require("./models/upload"); //Link for the farm schema

const app = express();

mongoose.connect('mongodb://localhost:27017/ExpressDogProject', { //TEST is the name of your database this will create a db called “test”, give it a new name
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const db = mongoose.connection; //No idea what this code does, seems to just put messages in console log
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("database connected");
});

app.engine('ejs', engine);
app.set("views", path.join(__dirname, "/views"))
app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
    res.render("uploads/index.ejs");
});

app.get("/show", function (req, res) {
    res.render("uploads/show.ejs");
});

app.get("/upload", function (req, res) {
    res.render("uploads/upload.ejs");
});

app.post("/upload", async (req, res) => {
    const upload = new Upload(req.body);
    await upload.save();
    
    res.redirect("/index")
   });


app.listen(3000, function () {
    console.log("Live on http://localhost:3000"); //String template literal, accuratley shows the port you are serving on Heroku or local. 
});