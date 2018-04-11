var express = require("express");
var router = express.Router({mergeParams: true});
var Blog = require("../models/blog");

//home routes
router.get("/", function(req, res){
	res.redirect("/blogs");
});

router.get("/blogs", function(req, res){
	Blog.find({}, function(err, foundBlogs){
		if(err || !foundBlogs){
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			console.log(foundBlogs);
			res.render("home", {blogs: foundBlogs});
		}
	});
	
});

//create new blog routes
router.get("/blogs/new", function(req, res){
	res.render("new");
});

router.post("/blogs", function(req, res){
	Blog.create(req.body.blog, function(err, newBlog){
		if(err || !newBlog){
			req.flash("error", err.message);
			return res.redirect("back");
		}
		newBlog.author = req.user.username;
		newBlog.save();
		req.flash("success", "Blog successfully created");
		res.redirect("/blogs");
	});
});

//show individual blog route
router.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err || !foundBlog){
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
});

module.exports = router;
