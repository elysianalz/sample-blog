var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");

//registration routes
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function(err, newUser){
		if(err || !newUser){
			console.log(err.message);
			req.flash("error", err.message);
			return res.redirect("back");
		} 
		if(req.body.admin == "adminpassword"){
			newUser.isAdmin = true;
			newUser.save();
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "welcome to my blog, "+ newUser.username);
			console.log("is admin" + newUser.isAdmin);
			res.redirect("/blogs");
		});
	});
});

//login routes
router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/blogs",
	failureRedirect: "/login",
	failureFlash: true
}), function(req, res){});

//log out routes
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Goodbye, thank you for visiting my blog :)")
	res.redirect("/blogs");
});

module.exports = router;