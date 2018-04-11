var express = require("express");
var router = express.Router({mergeParams: true});
var User = require("../models/user");

//registration routes
router.get("/register", function(req, res){
	res.render("register");
});

module.exports = router;