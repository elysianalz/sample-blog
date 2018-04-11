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
			return res.redirect("back");
		} 
		passport.authenticate("local")(req, res, function(){
			res.redirect("/blogs");
		});
	});
});

module.exports = router;