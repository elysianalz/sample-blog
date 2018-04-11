var express = require("express");
var router = express.Router({mergeParams: true});

router.get("/", function(req, res){
	res.redirect("/blogs");
});

router.get("/blogs", function(req, res){
	res.render("home");
});

module.exports = router;
