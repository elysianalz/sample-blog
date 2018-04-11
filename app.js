var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");

//routes files
var blogRoutes = require("./routes/index");
var authRoutes = require("./routes/auth");

var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.set(methodOverride("_method"));
app.use(express.static(__dirname+ "/public"));
app.use(flash());

mongoose.connect("mongodb://localhost:27017/blog_test");

app.use(require("express-session")({
	secret: "this is a sample blog",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(blogRoutes);
app.use(authRoutes);

app.listen(5000, function(req, res){
	console.log("test blog server has started");
});

