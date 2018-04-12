var express = require("express");
var router = express.Router({mergeParams: true});
var expressSanitizer = require("express-sanitizer");
var User = require("../models/user");
var Blog = require("../models/blog");
var Comment = require("../models/comment");
var About = require("../models/aboutme");
var middleware = require("../middleware");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

//home routes
router.get("/", function(req, res){
	res.redirect("/blogs");
});

router.get("/blogs", function(req, res){
	Blog.find({}, function(err, foundBlogs){
		if(err || !foundBlogs){
			req.flash("error", "Failed to find blogs");
			res.redirect("back");
		} else {
			console.log(foundBlogs);
			res.render("home", {blogs: foundBlogs});
		}
	});
});

//about routes
router.get("/about", function(req, res){
	About.find({}, function(err, foundAbout){
		if(err){
			req.flash("error", "Oops! Something went wrong");
			console.log(err);
			res.redirect("/blogs");
		} else {
			res.render("about", {aboutme: foundAbout});
		}
	});
});

//create new about
router.post("/about/create",middleware.isAdmin, function(req, res){
	req.body.about.content = req.sanitize(req.body.about.content);
	About.create(req.body.about, function(err, newAbout){
		if(err || !newAbout){
			req.flash("error", "Oops! Something went wrong");
			res.redirect("/about");
		} else {
			req.flash("success", "Successfully updated about me");
			res.redirect("/about");
		}
	});
});

//edit about
router.put("/about/:id/edit",middleware.isAdmin, function(req, res){
	About.findByIdAndUpdate(req.params.id, req.body.about, function(err, updatedAbout){
		if(err || !updatedAbout){
			req.flash("error", "Failed to update about page")
			res.redirect("/about");
		} else {
			req.flash("success", "Successfully updated about me");
			res.redirect("/about");
		}
	});
});

//create new blog routes
router.get("/blogs/new", middleware.isAdmin, function(req, res){
	res.render("new");
});

router.post("/blogs", middleware.isAdmin, function(req, res){
	req.body.blog.content = req.sanitize(req.body.blog.content);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err || !newBlog){
			req.flash("error", "Failed to create new blog");
			return res.redirect("/blogs");
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
			req.flash("error", "That blog does not exist");
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
});

//delete blog
router.delete("/blogs/:id/delete", middleware.checkBlogOwnership, function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err, info){
		if(err || !info){
			req.flash("error", "Failed to delete blog");
			res.redirect("/blogs");
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
			req.flash("error", "That blog does not exist");
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

router.put("/blogs/:id/edit", middleware.checkBlogOwnership, function(req, res){
	req.body.blog.content = req.sanitize(req.body.blog.content);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, newBlog){
		if(err || !newBlog){
			req.flash("err", "That blog does not exist");
			res.redirect("/blogs");
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
			req.flash("error", "That blog does not exist");
			res.redirect("/blogs");
		} else {
			Comment.create({text: req.body.text}, function(err, newComment){
				if(err || !newComment){
					req.flash("error", "Failed to comment on blog");
					res.redirect("/blogs/"+req.params.id);
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
		if(err || !info){
			req.flash("error", "Failed to delete comment");
			res.redirect("/blogs/"+ req.params.id)
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
			req.flash("error", "Failed to update comment");
			res.redirect("/blogs/"+req.params.id);
		} else {
			req.flash("success", "Successfully updated comment");
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

// forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'simple.express.blog@gmail.com',
          pass: 'Beers88077363'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'simple.express.blog@gmail.com',
        subject: 'Password reset for simpleblog.com',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'simple.express.blog@gmail.com',
          pass: 'Beers88077363'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'simple.express.blog@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/blogs');
  });
});

module.exports = router;
