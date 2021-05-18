if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');
const path = require("path");
const ejs = require('ejs');
const engine = require('ejs-mate'); //This npm lets the site use the boilerplate.ejs
const mongoose = require('mongoose');
const Joi = require("joi");
const session = require("express-session");
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require('method-override'); //This npm unlocks the CRUD functionality of HTML forms with the put and delete options.
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet'); 
 
const ExpressError = require("./utilities/ExpressError");
const Upload = require("./models/upload");
const Comment = require("./models/comment");
const User = require("./models/user");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require('./routes/uploadRoutes');
const commentRoutes = require('./routes/commentRoutes');

const expressSession = require('express-session');
const MongoStore = require('connect-mongo'); //Version 4.4.1 is installed.

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/ExpressDogProject'; //This code determines which database the code is saved to, the local mongoDb server or atlas.

const { commentSchema } = require("./schemas.js");
const catchAsync = require("./utilities/catchAsync");

const app = express();

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

app.use(express.urlencoded({ extended: true })); //Lets you take the inputted data from the form to use methodOverride.
app.use(methodOverride('_method')); //Activates methodOverride.

app.engine('ejs', engine);
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname + '/public')));
app.use(mongoSanitize({
    replaceWith: '_'
}));

const secret = process.env.SECRET || "secretHere";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret //The value of "secret" is set to the data in const secret, no need to write it twice.
  }
});

store.on("error", function(error){
  console.log("Session Store error!", error)
  });

const sessionConfig = {
  store,
  name: "dogSession", //This is the name of the session id.
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, //This is optional, if it's included, the cookie cannot be accessed through or interfered with by a client-side script. This is extra security. Hackers cannot see confidential cookies. 
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //This is when the cookie is programmed to expire. It is todays date, Date.now is in milliseconds. We want this cookie to expire in a week so the sum is 1000 milliseconds in a second, 60 secs in a minute, 60 mins in an hour, 24 hours etc. So the date it will expire is today's date plus that time.
    maxAge: 1000 * 60 * 60 * 24 * 7
    //All of this expiration stuff is because we don't want users to log in and stay logged in, they will get logged out after a week. 
}
}
app.use(session(sessionConfig)); //This must be above passposrt.session which is below.
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];

const connectSrcUrls = [
  "https://ka-f.fontawesome.com"
];

const fontSrcUrls = [
  "https://ka-f.fontawesome.com", //Allows the use of fontAwesome. 
  "https://fonts.gstatic.com/"
];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/dfj7xeo4n/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
              "https://images.unsplash.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //User is the const holding the user schema. This line of code is telling the app to use LocalStrategy and the authentication method will be located on the User model and the method is called "authenticate", there is no method in user.js because passport-local imports it itself.

passport.serializeUser(User.serializeUser());//This is relating to storing the user in the session. Once again, "User" is the const holding our user schema. 
passport.deserializeUser(User.deserializeUser());//This lets you get the user out of the session, remove them from the session's storage. serializeUser and deserializeUser are methods bought in by the passport npm package, I didn't write them anywhere myself. 

app.use(function (req, res, next) {//has to come before the route handlers below. These things are called "locals" the system has access to them accross the entire website.
  res.locals.currentUser = req.user; 
  res.locals.successFlash = req.flash("success"); 
  res.locals.errorFlash = req.flash("error");
  next();
})

app.use("/users", userRoutes)
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

app.get('/', async (req, res) =>  { //Loads home page which is set to the main index.
  const uploads = await Upload.find({}).populate("author");
  res.render("uploads/index.ejs", { uploads });
});

app.all("*", (req, res, next) => { //app.all means this will activate for all route types eg .put and .get. The * means it will activate for all inputted urls. This will only run if nothing else runs first which is why it is last on this page. 
  next(new ExpressError("Page not found.", 404))
});

app.use((err, req, res, next) => { //err in this case holds the value of new ExpressError.
  const { statusCode = 500 } = err //This const is destructured.
  if (!err.message) err.message = "Something went wrong!"
  res.status(statusCode).render("error.ejs", { err });//This is the error handling, this loads the error page and is triggered by something going wrong in any of the async functions, it is triggered by catchAsync. When catchAsync passes to "next" it is activating this route, this is the "next" in that context. Err is the error that has occurred. 
})

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Site is live on port ${port}`); //String template literal, accuratley shows the port you are serving on Heroku or local. 
});