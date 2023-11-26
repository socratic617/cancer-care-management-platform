const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");// allows me to saty signed in
const MongoStore = require("connect-mongo")(session);//stored in mongo data base or for your browser to be consistent and stay logged in 
const methodOverride = require("method-override"); //enables any type of request from the browser for any request
const flash = require("express-flash");// sends notifications that a message exists
const logger = require("morgan");//connecting diff code together
const connectDB = require("./config/database");//load database
const mainRoutes = require("./routes/main");//then connect my routes
const journalsRoutes = require("./routes/journals");
const path = require('path');//
const i18n=require("i18n-express"); // <-- require the module


//Use .env file in config folder , so my secrets dont go up w password to gtihub
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));//morgan to llogin

//Use forms for put / delete
app.use(methodOverride("_method"));//

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//Setup for Lang in json i18n
app.use(i18n({
  translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
  siteLangs: ["en","es"],
  textsVarName: 'translation',
  paramLangName: 'lang',
})); 

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes); 
app.use("/journals", journalsRoutes); 

//Server Running
app.listen(process.env.PORT, () => {
  console.log("Port number : ",process.env.PORT)
  console.log("Server is running, you better catch it!");
});

