var Blog = require("../models/blog");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkBlogOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
           if(err || !foundBlog){
               req.flash("error", "Campgound not found");
               res.redirect("/blogs");
           }  else {
               // does user own the campground?
            if(foundBlog.author == req.user.username) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("/blogs/"+req.params.id);
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
               req.flash("error", "Comment not found");
               res.redirect("/blogs/"+req.params.id);
           }  else {
               // does user own the comment?
            if(foundComment.author == req.user.username) {
                next();
            } else {
                req.flash("error", "You don't have permisson to do that");
                res.redirect("/blogs/"+req.params.id);
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;