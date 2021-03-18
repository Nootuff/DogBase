const express = require('express');
const path = require("path");
const ejs = require('ejs');
const engine = require('ejs-mate'); //This npm lets you use your boilerplate.ejs
const mongoose = require('mongoose');
const Joi = require("joi");
const ExpressError = require("./utilities/ExpressError"); //Imports the function from ExpressError.js.

const methodOverride = require('method-override'); //THis npm lets you use the edit and delete parts of CRUD.
const Upload = require("./models/upload"); //Link for the upload schema in models
const uploadRoutes = require('./routes/uploadRoutes');
const commentRoutes = require('./routes/commentRoutes');

const { commentSchema } = require("./schemas.js");
const catchAsync = require("./utilities/catchAsync");

const app = express(); //Activates express.

mongoose.connect('mongodb://localhost:27017/ExpressDogProject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

const db = mongoose.connection; //No idea what this code does, seems to just put messages in console log
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

app.use(express.urlencoded({ extended: true })); //Lets you take the inputted data from the form
app.use(methodOverride('_method')); //Activates methodOverride.

app.engine('ejs', engine);
app.set("views", path.join(__dirname, "/views"))
app.use(express.static(__dirname + '/public'));
app.use('/uploads', uploadRoutes)



app.get('/', (req, res) => {
  res.send('home')
});

app.post("/uploads/:id/comments", catchAsync(async (req, res) => { 
  res.send("it works")
 }));

app.all("*", (req, res, next) => { //app.all means this will activate for all route types eg .put and .get. The * means it will activate for all inputted urls. This will only run if nothing else runs first which is why it is last. 
  next(new ExpressError("Page not found.", 404))
});

app.use((err, req, res, next) => { //error in this case holds the value of the new ExpressError above.
  const { statusCode = 500 } = err //This const is destructured.
  if (!err.message) err.message = "Something went wrong!"
  res.status(statusCode).render("error.ejs", { err });//This is the error handling, this loads the error page and is triggered by something going wrong in any of the async functions above, it is triggered by catchAsync. When catchAsync passes to "next" it is activating this route, this is the "next" in that context. Err is the error that has occurred. 
})

app.listen(3000, function () {
  console.log("Live on http://localhost:3000"); //String template literal, accuratley shows the port you are serving on Heroku or local. 
});