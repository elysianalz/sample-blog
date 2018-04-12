var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	email: {type: String, unique: true, required: true},
	username: {type: String, unique: true, required:true},
	password: {type: String, unique: true, required:true},
	blogs: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Blog"
	}],
	isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);

module.exports = User;