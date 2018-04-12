var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	email: {type: String, unique: true, required: true},
	username: String,
	password: String,
	blogs: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Blog"
	}],
	isAdmin: {type: Boolean, default: false},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);

module.exports = User;