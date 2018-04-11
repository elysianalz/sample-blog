var express = require("express");
var router = express.Router({mergeParams: true});
var Blog = require("../models/blog");

router.get("/", function(req, res){
	res.redirect("/blogs");
});

router.get("/blogs", function(req, res){
	res.render("home");
});

router.get("/blogs/new", function(req, res){
	res.render("new");
});

module.exports = router;
