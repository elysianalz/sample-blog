var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	email: String,
	username: String,
	password: String,
	blogs: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Blog"
	}]
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);

module.exports = User;