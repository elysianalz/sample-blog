var express = require("express");
var router = express.Router({mergeParams: true});
var expressSanitizer = require("express-sanitizer");
var Blog = require("../models/blog");
var Comment = require("../models/comment");
var middleware = require("../middleware");

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
router.get("/blogs/new", middleware.isLoggedIn, function(req, res){
	res.render("new");
});

router.post("/blogs", middleware.isLoggedIn, function(req, res){
	req.body.blog.content = req.sanitize(req.body.blog.content);
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
	Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
		if(err || !foundBlog){
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
});

//delete blog
router.delete("/blogs/:id/delete", middleware.checkBlogOwnership, function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err, info){
		if(err){
			req.flash("error", err.message);
		} else {
			req.flash("success", "Successfully deleted blog");
			res.redirect("/blogs");
		}
	})
});

//edit blog routes
router.get("/blogs/:id/edit", middleware.checkBlogOwnership, function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err || !foundBlog){
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

router.put("/blogs/:id/edit", middleware.checkBlogOwnership, function(req, res){
	req.body.blog.content = req.sanitize(req.body.blog.content);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, newBlog){
		if(err || !newBlog){
			req.flash("err", err.message);
			res.redirect("back");
		} else {
			req.flash("success", "Successfully updated blog");
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//comment on blog
router.post("/blogs/:id/comment/new", middleware.isLoggedIn, function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err || !foundBlog){
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			Comment.create({text: req.body.text}, function(err, newComment){
				if(err || !newComment){
					req.flash("error", err.message);
					res.redirect("back");
				} else {
					newComment.author = req.user.username;
					newComment.save();
					foundBlog.comments.push(newComment);
					foundBlog.save();
					req.flash("success", "Successfully created comment");
					res.redirect("/blogs/"+req.params.id);
				}
			});
		}
	});
});

//delete comment
router.delete("/blogs/:id/:comment_id/delete", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, info){
		if(err){
			req.flash("error", err.message);
		} else {
			req.flash("success", "Successfully deleted comment");
			res.redirect("/blogs/"+ req.params.id);
		}
	});
});

//edit comment
router.put("/blogs/:id/:comment_id/edit",  middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, {text:req.body.text}, function(err, newComment){
		if(err || !newComment){
			req.flash("error", "Unable to update comment at this time");
			res.redirect("/blogs/"+req.params.id);
		} else {
			req.flash("success", "Successfully updated comment");
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

module.exports = router;
