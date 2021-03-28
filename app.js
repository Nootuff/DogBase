if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');
const path = require("path");
const ejs = require('ejs');
const engine = require('ejs-mate'); //This npm lets you use your boilerplate.ejs
const mongoose = require('mongoose');
const Joi = require("joi");
const session = require("express-session");
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require('method-override'); //THis npm lets you use the edit and delete parts of CRUD.
 
const ExpressError = require("./utilities/ExpressError"); //Imports the function from ExpressError.js.
const Upload = require("./models/upload"); //Link for the upload schema in models
const Comment = require("./models/comment");
const User = require("./models/user");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require('./routes/uploadRoutes');
const commentRoutes = require('./routes/commentRoutes');

const { commentSchema } = require("./schemas.js");
const catchAsync = require("./utilities/catchAsync");


const app = express(); //Activates express.

mongoose.connect('mongodb://localhost:27017/ExpressDogProject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
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
app.use(express.static(path.join(__dirname + '/public')));

const sessionConfig = {
  secret: "secretHere",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, //This thing is optional, if its included, the cookie cannot be accessed through or interfered with by a client side script. This is extra security. Hackers cannot see confidential cookies, you should have it. 
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //This is when the cookie is programmed to expire. It is todays date, Date.now is in milliseconds. We want this cookie to expire in a week so the sum is 1000 milliseconds in a second, 60 secs in a minute, 60 mins in an hour, 24 hours etc. So the date it will expire is today's date plus that time.
    maxAge: 1000 * 60 * 60 * 24 * 7
    //All this expiration stuff is because we don't want users to log in and stay logged in, they will get logged out after a week? 
}
}
app.use(session(sessionConfig)); //This must be above passposrt.session bellow.
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //User is the const with your user schema. This line of code is telling the app to use LocalStrategy and the authentication method will be located on the User model and the method is called "authenticate", there is no method in user.js because passport-local imports it itself.

passport.serializeUser(User.serializeUser());//This is something relating to storing the user in the session. Once again, "User" is the const holding our user schema. 
passport.deserializeUser(User.deserializeUser());//This lets you get the user out of the session, remove them from the session's storage. serializeUser and deserializeUser are methods bought in from passport, you didn't write them. 


app.use(function (req, res, next) {//has to come before the route handlers below apparently. These things are called "locals" you have access to them accross the entire website. 
console.log(req.session)
  res.locals.currentUser = req.user; 
  res.locals.successFlash = req.flash("success"); 
  res.locals.errorFlash = req.flash("error");
  next();
})

app.use("/", userRoutes)
app.use('/uploads', uploadRoutes)
app.use('/uploads/:id/comments', commentRoutes)

const validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",") //If there's more than 1 message, join them all together with a comment. 
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

app.get('/', (req, res) => {
  res.send('home')
});

//Must find a way to get this into the userRoutes.js file, if there is no /users/ then this route breaks the whole system if its in taht file but if you want to add /users/ to everything in user routes you must redo all the url links like login and logout and register. 
app.get("/users/:id", catchAsync(async(req, res)=> {
  var find = req.params.id;
    const user = await User.findById(find); 
  console.log(user);
  res.render("users/userPage.ejs", { user })
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